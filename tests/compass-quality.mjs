// Isolated Chromium coverage; runs locally against a static server that mirrors Vercel route rewrites.
// No private production data, credentials or external property services are accessed.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const root = process.cwd();
const pages = new Set(['/', '/overview', '/personality', '/live', '/work', '/properties', '/cars', '/compare', '/priorities', '/profile', '/data']);
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml', '.png':'image/png' };
const server=createServer(async (req,res)=>{
  const url=new URL(req.url,'http://127.0.0.1');
  if(url.pathname.startsWith('/api/')) {res.writeHead(503,{'Content-Type':'application/json'});res.end('{"error":"offline isolated test"}');return;}
  const relative=pages.has(url.pathname)?'index.html':url.pathname.slice(1);
  const resolved=path.resolve(root,relative);
  if(!resolved.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  try{
    const data=await readFile(resolved);
    res.writeHead(200,{'Content-Type':types[path.extname(resolved)]||'application/octet-stream'});
    res.end(data);
  }catch{res.writeHead(404);res.end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const port=server.address().port;
let browser;
try{
  const html=await readFile(path.join(root,'index.html'),'utf8');
  assert.match(html, /"rewrites"/u.test((await readFile(path.join(root,'vercel.json'),'utf8')))?/role="main"/:/this-never-matches/);
  browser=await chromium.launch({headless:true});
  let passed=0;
  const scenarios=[{width:320,height:780,scheme:'dark'},{width:390,height:844,scheme:'light'},{width:1280,height:900,scheme:'dark'}];
  for(const {width,height,scheme} of scenarios){
    const context=await browser.newContext({viewport:{width,height},colorScheme:scheme});
    await context.route(/^https:\/\//u,route=>route.abort('blockedbyclient'));
    const page=await context.newPage();
    await page.goto(`http://127.0.0.1:${port}/priorities?src=quality#retain-me`,{waitUntil:'domcontentloaded'});
    await page.locator('#weight-live-career').waitFor();
    assert.equal(await page.locator('.view.active').getAttribute('data-v'),'priorities');
    assert.equal(await page.locator('#weight-live-career').getAttribute('aria-describedby'),'wv-live-career');
    assert.equal(await page.locator('label[for="weight-live-career"]').count(),1);
    await page.waitForFunction(() => document.getElementById('propertyFreshness')?.textContent === 'Daily feed temporarily unavailable');
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(()=>document.activeElement.classList.contains('skip-link')),true);
    await page.keyboard.press('Enter');
    assert.equal(await page.evaluate(()=>document.activeElement.id),'main-content');
    const slider=page.locator('#weight-live-career');
    const before=Number(await slider.inputValue());
    await slider.focus();
    await slider.press('ArrowRight');
    assert.equal(Number(await slider.inputValue()),before+1);
    await page.getByRole('navigation',{name:'App sections'}).getByRole('button',{name:'Work',exact:true}).click();
    assert.equal(new URL(page.url()).pathname,'/work');
    assert.equal(new URL(page.url()).search,'?src=quality');
    assert.equal(new URL(page.url()).hash,'#main-content');
    assert.equal(await page.locator('.view.active').getAttribute('data-v'),'work');
    assert.equal(await page.getByRole('button',{name:'Work',exact:true}).getAttribute('aria-current'),'page');
    assert.equal(await page.locator('.view[data-v="work"]').evaluate(el=>document.activeElement===el),true);
    await page.goBack({waitUntil:'domcontentloaded'});
    assert.equal(new URL(page.url()).pathname,'/priorities');
    assert.equal(await page.locator('.view.active').getAttribute('data-v'),'priorities');
    await page.reload({waitUntil:'domcontentloaded'});
    await page.locator('#weight-live-career').waitFor();
    assert.equal(Number(await page.locator('#weight-live-career').inputValue()),before+1);
    await page.getByRole('button',{name:'Profile',exact:true}).click();
    await page.locator('#userNote').fill('private QA note — retained');
    await page.getByRole('button',{name:'Save note'}).click();
    await page.reload({waitUntil:'domcontentloaded'});
    assert.equal(await page.locator('#userNote').inputValue(),'private QA note — retained');
    await context.close();
    passed++;
  }
  console.log(`PASS: ${passed} genuine Chromium viewport/theme scenarios; deep links, back, keyboard, labeled sliders, local state, offline error.`);
}finally{await browser?.close(); await new Promise(resolve=>server.close(resolve));}
