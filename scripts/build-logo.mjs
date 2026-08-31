import fs from 'node:fs/promises';
import sharp from 'sharp';

const SRC = 'assets/Ritza Profile Picture.jpg.jpeg';
const OUT = 'public/brand';
await fs.mkdir(OUT, { recursive: true });

const img = sharp(SRC);
const meta = await img.metadata();
const { data, info } = await img.raw().toColourspace('srgb').toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: CH } = info;
console.log('source', W, H, CH);

const px = (x, y) => { const o = (y * W + x) * CH; return [data[o], data[o + 1], data[o + 2]]; };
const bg = px(8, 8);
console.log('background', bg);

// alpha from distance to the cream ground
const T0 = 12, T1 = 46;
const alpha = new Float32Array(W * H);
let inkR = 0, inkG = 0, inkB = 0, inkN = 0;
for (let i = 0; i < W * H; i++) {
  const o = i * CH;
  const d = Math.max(Math.abs(data[o] - bg[0]), Math.abs(data[o + 1] - bg[1]), Math.abs(data[o + 2] - bg[2]));
  const a = Math.min(1, Math.max(0, (d - T0) / (T1 - T0)));
  alpha[i] = a;
  if (a > 0.97) { inkR += data[o]; inkG += data[o + 1]; inkB += data[o + 2]; inkN++; }
}
console.log('mean ink', [inkR, inkG, inkB].map(v => Math.round(v / inkN)));

// darkest + most saturated-gold samples for the palette
let dark = [255, 255, 255], gold = [0, 0, 0], goldScore = -1;
for (let i = 0; i < W * H; i++) {
  if (alpha[i] < 0.98) continue;
  const o = i * CH, r = data[o], g = data[o + 1], b = data[o + 2];
  if (r + g + b < dark[0] + dark[1] + dark[2]) dark = [r, g, b];
  const s = r - b;
  if (s > goldScore) { goldScore = s; gold = [r, g, b]; }
}
const hex = c => '#' + c.map(v => v.toString(16).padStart(2, '0')).join('');
console.log('PALETTE  ground', hex(bg), ' ink', hex(dark), ' gold', hex(gold));

// row bands of ink -> split monogram / wordmark
const rowSum = new Float32Array(H);
for (let y = 0; y < H; y++) { let s = 0; for (let x = 0; x < W; x++) s += alpha[y * W + x]; rowSum[y] = s; }
const bands = [];
let start = -1;
for (let y = 0; y < H; y++) {
  const on = rowSum[y] > 1.5;
  if (on && start < 0) start = y;
  if (!on && start >= 0) { bands.push([start, y - 1]); start = -1; }
}
if (start >= 0) bands.push([start, H - 1]);
const big = bands.filter(b => b[1] - b[0] > 20);
console.log('ink bands', JSON.stringify(big));

function boxFor(y0, y1) {
  let x0 = W, x1 = 0;
  for (let y = y0; y <= y1; y++) for (let x = 0; x < W; x++) if (alpha[y * W + x] > 0.2) { if (x < x0) x0 = x; if (x > x1) x1 = x; }
  return { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 };
}

// RGBA buffer, un-premultiplied against the cream ground so edges stay clean on any colour
function rgba(recolor) {
  const out = Buffer.alloc(W * H * 4);
  for (let i = 0; i < W * H; i++) {
    const o = i * CH, q = i * 4, a = alpha[i];
    if (a <= 0) { out[q + 3] = 0; continue; }
    let r = (data[o] - (1 - a) * bg[0]) / a;
    let g = (data[o + 1] - (1 - a) * bg[1]) / a;
    let b = (data[o + 2] - (1 - a) * bg[2]) / a;
    r = Math.min(255, Math.max(0, r)); g = Math.min(255, Math.max(0, g)); b = Math.min(255, Math.max(0, b));
    if (recolor && b > r + 8) { r = 246; g = 241; b = 233; }      // navy ink -> ivory
    else if (recolor) { r = Math.min(255, r * 1.12); g = Math.min(255, g * 1.1); b = Math.min(255, b * 1.05); }
    out[q] = r; out[q + 1] = g; out[q + 2] = b; out[q + 3] = Math.round(a * 255);
  }
  return out;
}

const PAD = 14;
const pad = (b) => ({ left: Math.max(0, b.left - PAD), top: Math.max(0, b.top - PAD), width: Math.min(W, b.width + PAD * 2), height: Math.min(H, b.height + PAD * 2) });

// cluster the ink bands into two marks by splitting at the largest vertical gap
let splitAt = 1, biggestGap = -1;
for (let i = 1; i < big.length; i++) {
  const gap = big[i][0] - big[i - 1][1];
  if (gap > biggestGap) { biggestGap = gap; splitAt = i; }
}
const upper = big.slice(0, splitAt), lower = big.slice(splitAt);
console.log('monogram rows', upper[0][0], upper[upper.length - 1][1], '| wordmark rows', lower[0][0], lower[lower.length - 1][1]);
const monoBox = pad(boxFor(upper[0][0], upper[upper.length - 1][1]));
const wordBox = pad(boxFor(lower[0][0], lower[lower.length - 1][1]));
const fullBox = pad(boxFor(big[0][0], big[big.length - 1][1]));

async function write(name, box, recolor, targetW) {
  const buf = rgba(recolor);
  await sharp(buf, { raw: { width: W, height: H, channels: 4 } })
    .extract(box)
    .resize({ width: targetW, withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toFile(`${OUT}/${name}.png`);
  const m = await sharp(`${OUT}/${name}.png`).metadata();
  console.log(name, m.width + 'x' + m.height);
}

await write('ritza-lockup', fullBox, false, 900);
await write('ritza-lockup-light', fullBox, true, 900);
await write('ritza-wordmark', wordBox, false, 900);
await write('ritza-wordmark-light', wordBox, true, 900);
await write('ritza-monogram', monoBox, false, 600);
await write('ritza-monogram-light', monoBox, true, 600);

// favicon / app icon: monogram in ivory on the brand navy
const monoLight = await sharp(rgba(true), { raw: { width: W, height: H, channels: 4 } })
  .extract(monoBox).resize({ width: 260 }).png().toBuffer();
const mm = await sharp(monoLight).metadata();
await sharp({ create: { width: 512, height: 512, channels: 4, background: hex(dark) } })
  .composite([{ input: monoLight, left: Math.round((512 - mm.width) / 2), top: Math.round((512 - mm.height) / 2) }])
  .png().toFile('src/app/icon.png');
console.log('icon.png 512x512');

await fs.writeFile(`${OUT}/palette.json`, JSON.stringify({ ground: hex(bg), ink: hex(dark), gold: hex(gold) }, null, 2));
