import puppeteer from 'puppeteer-core';

/* Reports any element wider than the viewport — horizontal overflow is the
   most common way a "responsive" page quietly breaks on a phone. */

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const ROUTES = JSON.parse(process.env.ROUTES || '["/"]');

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--hide-scrollbars'],
});

for (const route of ROUTES) {
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  await page.evaluateOnNewDocument(() => {
    try { sessionStorage.setItem('ritza.entered', '1'); } catch {}
  });
  await page.goto('http://localhost:3000' + route, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 2200));

  const report = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const offenders = [];
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      const overflowsRight = r.right > vw + 1;
      const tooWide = r.width > vw + 1;
      if (!overflowsRight && !tooWide) continue;
      // ignore elements inside a horizontal scroller — that overflow is intended
      let p = el.parentElement, inScroller = false;
      while (p && p !== document.body) {
        const ox = getComputedStyle(p).overflowX;
        if (ox === 'auto' || ox === 'scroll' || ox === 'hidden') { inScroller = true; break; }
        p = p.parentElement;
      }
      if (inScroller) continue;
      offenders.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.className?.toString?.() || '').slice(0, 90),
        w: Math.round(r.width),
        right: Math.round(r.right),
      });
    }
    return { vw, scrollW: document.documentElement.scrollWidth, offenders: offenders.slice(0, 8) };
  });

  console.log(`\n${route}  viewport ${report.vw}  documentScrollWidth ${report.scrollW}`);
  if (report.offenders.length === 0) console.log('  no unclipped overflow');
  for (const o of report.offenders) console.log(`  ${o.tag}.${o.cls} — w:${o.w} right:${o.right}`);
  await page.close();
}
await browser.close();
