import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Isolated Vercel handler: no real ATS requests, personal data or secrets.
const source = await readFile(new URL('../api/jobs.js', import.meta.url), 'utf8');
const { default: handler } = await import('data:text/javascript,' + encodeURIComponent(source));

async function callApi(mockFetch, { withHeaders = false } = {}) {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = mockFetch;
  try {
    let result;
    const headers = {};
    const res = {
      setHeader: (key, value) => { headers[key] = value; },
      status: (code) => { assert.equal(code, 200); return res; },
      json: (payload) => { result = payload; return res; },
    };
    await handler({}, res);
    assert.ok(result, 'handler must return a response');
    assert.equal(headers['Cache-Control'], result.partial ? 'no-store' : 'public, s-maxage=3600, stale-while-revalidate=86400');
    return withHeaders ? { payload: result, headers } : result;
  } finally {
    globalThis.fetch = originalFetch;
  }
}

const emptySuccess = async () => ({ ok: true, json: async () => ({ jobs: [] }) });

test('all ATS failures do not masquerade as a successful refresh', async () => {
  const payload = await callApi(async () => { throw Error('private ATS diagnostics'); });
  assert.equal(payload.fetchedAt, null);
  assert.deepEqual(payload.companies, []);
  assert.equal(payload.partial, true);
  assert.deepEqual(payload.failedCompanies.sort(), ['Anthropic', 'GitLab', 'Zapier']);
  assert.doesNotMatch(JSON.stringify(payload), /private ATS diagnostics/);
});

test('partial outages omit failed employers and preserve previous client links', async () => {
  const payload = await callApi(async url => String(url).includes('/gitlab/') ? Promise.reject(Error('unavailable')) : emptySuccess());
  assert.equal(payload.partial, true);
  assert.deepEqual(payload.failedCompanies, ['GitLab']);
  assert.deepEqual(payload.companies.map(c => c.company), ['Anthropic', 'Zapier']);
  assert.ok(!Number.isNaN(Date.parse(payload.fetchedAt)));
});

test('successfully empty boards remain valid empty results', async () => {
  const payload = await callApi(emptySuccess);
  assert.equal(payload.partial, false);
  assert.deepEqual(payload.failedCompanies, []);
  assert.equal(payload.companies.length, 3);
  assert.ok(payload.companies.every(c => c.postings.length === 0));
  assert.ok(!Number.isNaN(Date.parse(payload.fetchedAt)));
});

test('partial and total ATS outages cannot be cached as a fresh complete feed', async () => {
  const failed = await callApi(async () => { throw Error('temporary provider outage'); }, { withHeaders: true });
  assert.equal(failed.payload.partial, true);
  assert.equal(failed.payload.fetchedAt, null);
  assert.equal(failed.headers['Cache-Control'], 'no-store');

  const mixed = await callApi(async url => String(url).includes('/gitlab/')
    ? Promise.reject(Error('temporary provider outage'))
    : emptySuccess(), { withHeaders: true });
  assert.equal(mixed.payload.partial, true);
  assert.equal(mixed.headers['Cache-Control'], 'no-store');

  const complete = await callApi(emptySuccess, { withHeaders: true });
  assert.equal(complete.payload.partial, false);
  assert.equal(complete.headers['Cache-Control'], 'public, s-maxage=3600, stale-while-revalidate=86400');
});

test('UI distinguishes partial ATS freshness and retains snapshot on all failures', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /window\.__livePartial=data\.partial===true/);
  assert.match(html, /partial ATS refresh/);
  assert.match(html, /if\(window\.__liveAsOf\)/);
  assert.match(html, /const job=findJob\(c\.company\)/);
});


test('every ATS provider gets a finite request timeout without changing successful results', async () => {
  const originalTimeout = AbortSignal.timeout;
  const durations = [];
  const requested = [];
  AbortSignal.timeout = (ms) => {
    durations.push(ms);
    return originalTimeout(ms);
  };
  try {
    const payload = await callApi(async (url, options) => {
      requested.push({ url: String(url), signal: options?.signal });
      return emptySuccess();
    });
    assert.deepEqual(durations, [8000, 8000, 8000]);
    assert.equal(requested.filter(r => r.url.includes('greenhouse.io')).length, 2);
    assert.equal(requested.filter(r => r.url.includes('ashbyhq.com')).length, 1);
    assert.ok(requested.every(r => r.signal instanceof AbortSignal));
    assert.equal(payload.partial, false);
    assert.equal(payload.companies.length, 3);
  } finally {
    AbortSignal.timeout = originalTimeout;
  }
});

test('ATS application links reject executable, insecure and credentialed URLs', async () => {
  const greenhouse = {
    jobs: [
      { title: 'Program Manager', absolute_url: 'https://jobs.example.org/positions/42?from=ats', location: { name: 'Remote' } },
      { title: 'Program Manager', absolute_url: 'javascript:alert(1)' },
      { title: 'Program Manager', absolute_url: 'http://jobs.example.org/insecure' },
      { title: 'Program Manager', absolute_url: 'https://user:password@jobs.example.org/private' },
      { title: 'Program Manager', absolute_url: '/relative/job/99' }
    ]
  };
  const ashby = {
    jobs: [
      { title: 'Program Manager', isListed: true, applyUrl: 'https://jobs.example.org/ashby/62' },
      { title: 'Program Manager', isListed: true, jobUrl: 'data:text/html,unsafe' },
      { title: 'Program Manager', isListed: true, jobPostingUrl: 'http://jobs.example.org/unsafe' }
    ]
  };
  const result = await callApi(async url => ({
    ok: true,
    json: async () => String(url).includes('ashbyhq.com') ? ashby : greenhouse
  }));
  assert.equal(result.partial, false);
  assert.equal(result.companies.length, 3);
  for (const c of result.companies) {
    assert.equal(c.postings.length, 1, c.company);
    assert.ok(c.postings[0].url.startsWith('https://jobs.example.org/'));
  }
  assert.equal(result.companies.find(c => c.company === 'Zapier').postings[0].url,
    'https://jobs.example.org/ashby/62');
  assert.ok(Number.isFinite(Date.parse(result.fetchedAt)));
  assert.doesNotMatch(JSON.stringify(result), /javascript:|data:text|user:password|http:\/\/jobs|\/relative\/job/);
});


test('malformed successful ATS payloads cannot erase previous verified links', async () => {
  for (const malformed of [{}, { jobs: null }, { jobs: {} }, null]) {
    const result = await callApi(async url => String(url).includes('/gitlab/')
      ? { ok: true, json: async () => malformed }
      : emptySuccess());
    assert.equal(result.partial, true);
    assert.deepEqual(result.failedCompanies, ['GitLab']);
    assert.deepEqual(result.companies.map(c => c.company), ['Anthropic', 'Zapier']);
  }
  const allMalformed = await callApi(async () => ({ ok: true, json: async () => ({}) }));
  assert.equal(allMalformed.fetchedAt, null);
  assert.equal(allMalformed.partial, true);
  assert.deepEqual(allMalformed.companies, []);
});
