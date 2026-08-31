import puppeteer from 'puppeteer-core';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const OUT = process.env.SHOT_DIR || './.shots';
const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox','--hide-scrollbars'] });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e).slice(0, 160)));
await page.evaluateOnNewDocument(() => { try { sessionStorage.setItem('ritza.entered','1'); } catch {} });
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 60000 });
await new Promise(r => setTimeout(r, 1600));

// open the menu
await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find(x => x.getAttribute('aria-label') === 'Open menu');
  b?.click();
});
await new Promise(r => setTimeout(r, 1200));
await page.screenshot({ path: `${OUT}/mobile-nav.png` });

// open the bag drawer from the menu's close state
await page.evaluate(() => {
  const c = [...document.querySelectorAll('button')].find(x => x.getAttribute('aria-label') === 'Close menu');
  c?.click();
});
await new Promise(r => setTimeout(r, 900));
await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find(x => x.getAttribute('aria-label') === 'Shopping bag');
  b?.click();
});
await new Promise(r => setTimeout(r, 1100));
await page.screenshot({ path: `${OUT}/mobile-cart-drawer.png` });
console.log(errors.length ? 'ERRORS ' + errors.join(' | ') : 'no page errors');
await browser.close();
