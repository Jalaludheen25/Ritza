import puppeteer from 'puppeteer-core';
import fs from 'node:fs/promises';

/* Dev-time visual check: loads a route and writes full-page and viewport
   screenshots so layout can be reviewed without a browser open. */

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const OUT = process.env.SHOT_DIR || './.shots';
const BASE = process.env.RITZA_BASE || 'http://localhost:3000';

const targets = process.env.SHOT_ROUTES ? JSON.parse(process.env.SHOT_ROUTES) : process.argv.slice(2);
if (!targets.length) targets.push('/');

await fs.mkdir(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--hide-scrollbars', '--force-device-scale-factor=1'],
});

for (const spec of targets) {
  const [route, mode = 'desktop', full = 'full'] = spec.split('|');
  const page = await browser.newPage();
  const viewport = mode === 'mobile'
    ? { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
    : { width: 1440, height: 900, deviceScaleFactor: 1 };
  await page.setViewport(viewport);

  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 200)));
  page.on('pageerror', (e) => errors.push('PAGEERROR ' + String(e).slice(0, 200)));

  // optionally seed the client store so cart/wishlist views can be captured populated
  if (process.env.SHOT_SEED) {
    await page.evaluateOnNewDocument((seed) => {
      try {
        localStorage.setItem('ritza.store.v1', seed);
        sessionStorage.setItem('ritza.entered', '1');
      } catch {}
    }, process.env.SHOT_SEED);
  } else {
    await page.evaluateOnNewDocument(() => {
      try { sessionStorage.setItem('ritza.entered', '1'); } catch {}
    });
  }

  await page.goto(BASE + route, { waitUntil: 'networkidle2', timeout: 60000 });
  // let the entry animations settle, then walk the page so scroll reveals fire
  await new Promise((r) => setTimeout(r, 2600));
  if (full === 'full') {
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.7;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 190));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 500));
    });
  }
  await new Promise((r) => setTimeout(r, 900));

  const name = (route === '/' ? 'home' : route.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '')) + `-${mode}`;
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: full === 'full' });
  console.log(name, errors.length ? `\n  ERRORS: ${[...new Set(errors)].slice(0, 5).join('\n  ')}` : '(no console errors)');
  await page.close();
}

await browser.close();
