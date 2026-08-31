import puppeteer from 'puppeteer-core';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const ROUTES = JSON.parse(process.env.ROUTES || '["/"]');
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox','--hide-scrollbars'] });

for (const route of ROUTES) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 950 });
  await page.evaluateOnNewDocument(() => { try { sessionStorage.setItem('ritza.entered','1'); } catch {} });
  await page.goto('http://localhost:3000' + route, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 1500));
  const r = await page.evaluate(() => {
    const imgsNoAlt = [...document.querySelectorAll('img')].filter(i => i.getAttribute('alt') === null).map(i => i.currentSrc?.split('/').pop()?.slice(0,40));
    const namelessButtons = [...document.querySelectorAll('button, a')].filter(el => {
      const label = (el.getAttribute('aria-label') || el.textContent || '').trim();
      return label.length === 0 && !el.querySelector('img[alt]:not([alt=""])');
    }).map(el => el.tagName.toLowerCase() + '.' + (el.className?.toString?.()||'').slice(0,45));
    const headings = [...document.querySelectorAll('h1,h2,h3,h4')].map(h => +h.tagName[1]);
    let jumps = [];
    for (let i = 1; i < headings.length; i++) if (headings[i] - headings[i-1] > 1) jumps.push(`${headings[i-1]}->${headings[i]}`);
    const h1s = document.querySelectorAll('h1').length;
    const inputsNoLabel = [...document.querySelectorAll('input:not([type=hidden]):not([type=checkbox]):not([type=radio]), textarea, select')].filter(el => {
      if (el.getAttribute('aria-label')) return false;
      return !el.closest('label') && !el.getAttribute('aria-label') && !document.querySelector(`label[for="${el.id}"]`);
    }).length;
    return { imgsNoAlt, namelessButtons: namelessButtons.slice(0,6), h1s, jumps, inputsNoLabel, lang: document.documentElement.lang };
  }).catch(e => ({ error: String(e).slice(0,120) }));
  console.log(`\n${route}`);
  console.log('  h1 count:', r.h1s, '| heading jumps:', r.jumps?.length ? r.jumps.join(',') : 'none', '| lang:', r.lang);
  console.log('  images missing alt:', r.imgsNoAlt?.length ? r.imgsNoAlt : 'none');
  console.log('  controls without accessible name:', r.namelessButtons?.length ? r.namelessButtons : 'none');
  console.log('  unlabelled inputs:', r.inputsNoLabel);
  await page.close();
}
await browser.close();
