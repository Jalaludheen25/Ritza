import puppeteer from 'puppeteer-core';
import fs from 'node:fs/promises';

/* Exercises the interactive surfaces end to end: search, quick view, and the
   full four-step checkout through to the confirmation screen. */

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const OUT = process.env.SHOT_DIR || './.shots';
await fs.mkdir(OUT, { recursive: true });

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox','--hide-scrollbars'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 950 });
const errors = [];
page.on('pageerror', (e) => errors.push('PAGEERROR ' + String(e).slice(0, 180)));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 180)));

const seed = JSON.stringify({
  cart: [{ slug: 'kasu-mala-necklace', quantity: 1 }, { slug: 'halo-everyday-hoops', quantity: 2 }],
  wishlist: [], recent: [], customer: null,
});
await page.evaluateOnNewDocument((s) => {
  try { localStorage.setItem('ritza.store.v1', s); sessionStorage.setItem('ritza.entered','1'); } catch {}
}, seed);

const click = async (text, tag = 'button') => page.evaluate((t, g) => {
  const el = [...document.querySelectorAll(g)].find(b => b.textContent?.trim().includes(t));
  if (!el) return false;
  el.click();
  return true;
}, text, tag);

const type = async (label, value) => page.evaluate((l, v) => {
  const lab = [...document.querySelectorAll('label')].find(x => x.textContent?.includes(l));
  const input = lab?.querySelector('input, textarea, select');
  if (!input) return false;
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
  setter?.call(input, v);
  input.dispatchEvent(new Event('input', { bubbles: true }));
  return true;
}, label, value);

/* ---- search overlay ---- */
await page.goto('http://localhost:3000/shop', { waitUntil: 'networkidle2', timeout: 60000 });
await new Promise(r => setTimeout(r, 1500));
await page.evaluate(() => {
  [...document.querySelectorAll('button')].find(b => b.getAttribute('aria-label') === 'Search')?.click();
});
await new Promise(r => setTimeout(r, 900));
await page.type('input[aria-label="Search the collection"]', 'jumukka', { delay: 40 });
await new Promise(r => setTimeout(r, 1000));
await page.screenshot({ path: `${OUT}/flow-search.png` });
const searchResults = await page.evaluate(() => document.body.innerText.match(/(\d+) pieces?/)?.[0] ?? 'n/a');
console.log('search "jumukka" ->', searchResults);
await page.keyboard.press('Escape');
await new Promise(r => setTimeout(r, 700));

/* ---- quick view ---- */
await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find(x => x.textContent?.trim() === 'Quick view');
  b?.click();
});
await new Promise(r => setTimeout(r, 1100));
const qvOpen = await page.evaluate(() => !!document.querySelector('[role=dialog]'));
await page.screenshot({ path: `${OUT}/flow-quickview.png` });
console.log('quick view dialog open:', qvOpen);
await page.keyboard.press('Escape');
await new Promise(r => setTimeout(r, 600));

/* ---- checkout ---- */
await page.goto('http://localhost:3000/checkout', { waitUntil: 'networkidle2', timeout: 60000 });
await new Promise(r => setTimeout(r, 1400));
await type('Email address', 'layla@example.ae');
await type('Mobile number', '+971 50 123 4567');
console.log('step1 continue:', await click('Continue'));
await new Promise(r => setTimeout(r, 900));

await type('First name', 'Layla');
await type('Last name', 'Haddad');
await type('Address', 'Villa 22, Street 14b');
await type('City', 'Dubai');
console.log('step2 continue:', await click('Continue'));
await new Promise(r => setTimeout(r, 900));
await page.screenshot({ path: `${OUT}/flow-checkout-payment.png` });

await type('Name on card', 'Layla Haddad');
await type('Card number', '4242424242424242');
await type('Expiry', '1229');
await type('Security code', '123');
console.log('step3 continue:', await click('Continue'));
await new Promise(r => setTimeout(r, 900));
await page.screenshot({ path: `${OUT}/flow-checkout-review.png` });

console.log('place order:', await click('Place order'));
await new Promise(r => setTimeout(r, 3000));
await page.screenshot({ path: `${OUT}/flow-checkout-done.png` });
const done = await page.evaluate(() => ({
  heading: document.querySelector('h1')?.textContent?.trim(),
  ref: document.body.innerText.match(/RZ-\d{6}/)?.[0],
  cart: JSON.parse(localStorage.getItem('ritza.store.v1') || '{}').cart,
}));
console.log('confirmation:', JSON.stringify(done));
console.log(errors.length ? 'ERRORS:\n  ' + [...new Set(errors)].join('\n  ') : 'no console errors');
await browser.close();
