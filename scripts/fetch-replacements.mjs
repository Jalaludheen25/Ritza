import fs from "node:fs/promises";
import sharp from "sharp";

/* Pulls the shortlisted replacement frames at full resolution.
   Indices refer to the contact sheets built from the modest-fashion and
   jewellery-on-clothed-model scrapes. */

const SP = process.argv[2];

const PICKS = [
  // [source index file, index, output name]
  ["mindex.json", 27, "collar-open-shirt"], // clothed neck, no necklace — try-on base
  ["mindex.json", 105, "portrait-burgundy-knit"],
  ["mindex.json", 93, "portrait-veiled-minimal"],
  ["jindex.json", 85, "portrait-pearls-bw"], // b&w headwrap, pearl drops + strand
  ["jindex.json", 86, "profile-pearl-choker"],
  ["jindex.json", 28, "pearls-black-top-bw"],
  ["jindex.json", 80, "abaya-arch"],
  ["jindex.json", 33, "necklace-white-shirt"],
  ["jindex.json", 37, "pendant-white-shirt"],
  ["jindex.json", 87, "gold-chain-blouse"],
  ["jindex.json", 102, "pearls-lace-portrait"],
  ["jindex.json", 116, "hijab-gold-earrings"],
  ["jindex.json", 5, "pearl-earrings-green"],
  ["jindex.json", 92, "pearl-earrings-still"],
  ["jindex.json", 94, "gold-necklace-still"],
  ["jindex.json", 1, "gold-chain-cream-shirt"],
  ["jindex.json", 6, "pearls-green-rest"],
  ["jindex.json", 19, "gold-earring-veil"],
];

const cache = {};
async function load(file) {
  cache[file] ??= JSON.parse(await fs.readFile(`${SP}/${file}`, "utf8"));
  return cache[file];
}

await fs.mkdir("public/images", { recursive: true });
const results = [];

for (const [file, idx, name] of PICKS) {
  const list = await load(file);
  const entry = list.find((e) => e.i === idx);
  if (!entry) {
    console.log(`MISSING ${file}#${idx}`);
    continue;
  }
  const url = `https://${entry.u}?auto=compress&cs=tinysrgb&w=2000`;
  try {
    const r = await fetch(url);
    if (!r.ok) {
      console.log(`FAIL ${name} ${r.status}`);
      continue;
    }
    const buf = Buffer.from(await r.arrayBuffer());
    await sharp(buf).jpeg({ quality: 82, mozjpeg: true }).toFile(`public/images/${name}.jpg`);
    const m = await sharp(`public/images/${name}.jpg`).metadata();
    results.push({ name, w: m.width, h: m.height, ratio: (m.width / m.height).toFixed(2) });
    console.log(name.padEnd(26), `${m.width}x${m.height}`, (m.width / m.height).toFixed(2));
  } catch (e) {
    console.log(`ERROR ${name} ${e.message}`);
  }
}
console.log(`\nsaved ${results.length}/${PICKS.length}`);
