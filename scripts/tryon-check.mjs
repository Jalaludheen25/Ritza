import puppeteer from 'puppeteer-core';
import fs from 'node:fs/promises';

/* Drives the try-on end to end: open, upload a photograph, wait out the
   render stages, and capture the result. */

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const OUT = process.env.SHOT_DIR || './.shots';
await fs.mkdir(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--hide-scrollbars'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 950 });

const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 200)));
page.on('pageerror', (e) => errors.push('PAGEERROR ' + String(e).slice(0, 200)));

await page.evaluateOnNewDocument(() => {
  try { sessionStorage.setItem('ritza.entered', '1'); } catch {}
});
await page.goto('http://localhost:3000/product/noor-emerald-cut-pendant?tryon=1', {
  waitUntil: 'networkidle2',
  timeout: 60000,
});
await new Promise((r) => setTimeout(r, 1800));
await page.screenshot({ path: `${OUT}/tryon-1-upload.png` });

const input = await page.$('input[type=file]');
if (!input) throw new Error('no file input found — modal did not open');
await input.uploadFile('public/images/collar-open-shirt.jpg');

await new Promise((r) => setTimeout(r, 900));
await page.screenshot({ path: `${OUT}/tryon-2-processing.png` });

await new Promise((r) => setTimeout(r, 3600));
await page.screenshot({ path: `${OUT}/tryon-3-result.png` });

// exercise the adjust controls, then add to bag
const sliders = await page.$$('input[type=range]');
console.log('sliders found:', sliders.length);
if (sliders[0]) {
  await sliders[0].focus();
  for (let i = 0; i < 6; i++) await page.keyboard.press('ArrowRight');
}
await new Promise((r) => setTimeout(r, 700));
await page.screenshot({ path: `${OUT}/tryon-4-adjusted.png` });

const added = await page.evaluate(() => {
  const btn = [...document.querySelectorAll('button')].find((b) =>
    b.textContent?.includes('Add to bag —'),
  );
  if (btn) { btn.click(); return true; }
  return false;
});
await new Promise((r) => setTimeout(r, 1200));
const bag = await page.evaluate(() => {
  try { return JSON.parse(localStorage.getItem('ritza.store.v1') || '{}').cart ?? []; }
  catch { return 'unreadable'; }
});
console.log('add-to-bag clicked:', added, '| cart now:', JSON.stringify(bag));
await page.screenshot({ path: `${OUT}/tryon-5-after-add.png` });

console.log(errors.length ? 'CONSOLE ERRORS:\n  ' + [...new Set(errors)].join('\n  ') : 'no console errors');
await browser.close();
