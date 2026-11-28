// Vercel serverless function: live job feed for Compass.
// Reads each employer's open ATS board (Greenhouse / Ashby) server-side, filters to the
// target role, and returns current openings with exact title + permalink. Cached ~1h at
// the edge so the front-end shows live postings without per-visit ATS hits.
//
// GET /api/jobs  ->  { fetchedAt, companies: [ {company, via, careers, postings:[{title,location,url}]} ] }

const BOARDS = [
  { company: "Anthropic", via: "Greenhouse", type: "greenhouse", token: "anthropic",
    careers: "https://job-boards.greenhouse.io/anthropic", match: /program manager/i },
  { company: "GitLab", via: "GitLab · Greenhouse", type: "greenhouse", token: "gitlab",
    careers: "https://job-boards.greenhouse.io/gitlab", match: /program manager/i },
  { company: "Zapier", via: "Zapier · Ashby", type: "ashby", org: "zapier",
    careers: "https://zapier.com/jobs", match: /program manager/i },
];

// ATS feeds are external. Never pass executable/relative URLs to the UI.
function safePostingUrl(value) {
  if (typeof value !== "string" || !value.trim()) return "";
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "https:" || !parsed.hostname ||
        parsed.username || parsed.password) return "";
    return parsed.href;
  } catch {
    return "";
  }
}

async function fetchGreenhouse(token, match) {
  const r = await fetch(`https://boards-api.greenhouse.io/v1/boards/${token}/jobs`, {
    headers: { "User-Agent": "Compass/1.0 (+vercel)" },
    // Bound third-party ATS latency so one stalled provider cannot hang the entire feed.
    signal: AbortSignal.timeout(8000),
  });
  if (!r.ok) throw new Error(`greenhouse ${token} ${r.status}`);
  const data = await r.json();
  if (!Array.isArray(data?.jobs) || data.jobs.some(j => !j || typeof j !== "object" || Array.isArray(j) || typeof j.title !== "string" || !j.title.trim())) {
    throw new Error("Invalid ATS jobs response");
  }
  return data.jobs
    .filter((j) => match.test(j.title || ""))
    .map((j) => ({ title: (j.title || "").trim(), location: (j.location && j.location.name) || "", url: safePostingUrl(j.absolute_url) }))
    .filter((j) => j.url);
}

async function fetchAshby(org, match) {
  const r = await fetch(`https://api.ashbyhq.com/posting-api/job-board/${org}?includeCompensation=true`, {
    headers: { "User-Agent": "Compass/1.0 (+vercel)" },
    // Bound third-party ATS latency so one stalled provider cannot hang the entire feed.
    signal: AbortSignal.timeout(8000),
  });
  if (!r.ok) throw new Error(`ashby ${org} ${r.status}`);
  const data = await r.json();
  if (!Array.isArray(data?.jobs) || data.jobs.some(j => !j || typeof j !== "object" || Array.isArray(j) || typeof j.title !== "string" || !j.title.trim())) {
    throw new Error("Invalid ATS jobs response");
  }
  return data.jobs
    .filter((j) => j.isListed !== false && match.test(j.title || ""))
    .map((j) => ({
      title: (j.title || "").trim(),
      location: j.locationName || (typeof j.location === "string" ? j.location : (j.location && j.location.name)) || "",
      url: safePostingUrl(j.applyUrl || j.jobUrl || j.jobPostingUrl || ""),
    }))
    .filter((j) => j.url);
}

export default async function handler(req, res) {
  const results = await Promise.all(
    BOARDS.map(async (b) => {
      try {
        const postings =
          b.type === "greenhouse" ? await fetchGreenhouse(b.token, b.match)
          : b.type === "ashby" ? await fetchAshby(b.org, b.match)
          : [];
        return { company: b.company, via: b.via, careers: b.careers, postings: postings.slice(0, 4) };
      } catch (e) {
        // On any ATS failure, return an empty (→ front-end keeps snapshot / shows search).
        return { company: b.company, error: true };
      }
    })
  );
  // A failed ATS request does not mean zero open jobs. Exclude failures so
  // the client preserves previous verified links and titles for those employers.
  const companies = results.filter(c => !c.error);
  const failedCompanies = results.filter(c => c.error).map(c => c.company);
  // Cache successful complete refreshes, but never cache partial/total ATS outages:
  // clients must be able to retry promptly while preserving their saved links.
  res.setHeader("Cache-Control", failedCompanies.length
    ? "no-store"
    : "public, s-maxage=3600, stale-while-revalidate=86400");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).json({
    fetchedAt: companies.length ? new Date().toISOString() : null,
    partial: failedCompanies.length > 0,
    failedCompanies,
    companies,
  });
}
