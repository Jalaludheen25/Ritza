import fs from 'node:fs/promises';
import sharp from 'sharp';

/* Try-on overlay plates.
   Each piece is cropped from a true-black studio plate, then every pixel is
   scaled by a smooth luma gate so the surrounding studio grey falls to pure
   black. The browser drops the plate onto a photograph with
   `mix-blend-mode: screen`, leaving only the metal and the stones visible. */

const JOBS = [
  { out: 'necklace-solitaire', src: 'pendant-black-stand',      crop: [0.36, 0.21, 0.40, 0.44], gate: [70, 124] },
  { out: 'necklace-diamond',   src: 'ring-pendant-black',       crop: [0.52, 0.06, 0.40, 0.90], gate: [30, 84] },
  { out: 'necklace-coin',      src: 'gold-coin-necklace-black', crop: [0.26, 0.22, 0.48, 0.46], gate: [36, 84] },
  { out: 'pendant-gold',       src: 'gold-pendant-black',       crop: [0.06, 0.00, 0.92, 0.58], gate: [30, 92] },
  { out: 'earring-diamond',    src: 'diamond-set-black',        crop: [0.35, 0.40, 0.15, 0.24], gate: [30, 82] },
  { out: 'ring-solitaire',     src: 'ring-pendant-black',       crop: [0.14, 0.34, 0.26, 0.44], gate: [30, 84] },
  { out: 'bracelet-gold',      src: 'gold-coin-necklace-black', crop: [0.29, 0.45, 0.42, 0.15], gate: [36, 84] },
];

await fs.mkdir('public/tryon', { recursive: true });

for (const j of JOBS) {
  const meta = await sharp(`public/images/${j.src}.jpg`).metadata();
  const [rx, ry, rw, rh] = j.crop;
  const box = {
    left: Math.round(rx * meta.width),
    top: Math.round(ry * meta.height),
    width: Math.round(rw * meta.width),
    height: Math.round(rh * meta.height),
  };

  const { data, info } = await sharp(`public/images/${j.src}.jpg`)
    .extract(box)
    .resize({ width: 900, withoutEnlargement: true })
    .raw().toBuffer({ resolveWithObject: true });

  const [LO, HI] = j.gate;
  const out = Buffer.alloc(info.width * info.height * 3);
  for (let i = 0; i < info.width * info.height; i++) {
    const o = i * info.channels;
    const r = data[o], g = data[o + 1], b = data[o + 2];
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    let t = (luma - LO) / (HI - LO);
    t = t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t); // smoothstep
    out[i * 3] = Math.round(r * t);
    out[i * 3 + 1] = Math.round(g * t);
    out[i * 3 + 2] = Math.round(b * t);
  }

  await sharp(out, { raw: { width: info.width, height: info.height, channels: 3 } })
    .png({ compressionLevel: 9 })
    .toFile(`public/tryon/${j.out}.png`);
  console.log(j.out.padEnd(20), `${info.width}x${info.height}`);
}
