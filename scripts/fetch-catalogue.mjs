import fs from "node:fs/promises";
import sharp from "sharp";

/* Downloads the photography for the two product lines.
   Indices refer to the contact sheets built from the Kerala-traditional and
   anti-tarnish scrapes (cindex.json). */

const SP = process.argv[2];

const PICKS = `
6    at-chain-silk
12   at-chain-fine
19   at-chain-books
84   at-chain-heart
89   at-chain-layered-silk
94   at-chain-layered-model
100  at-chain-highneck
112  at-chain-back
114  at-chain-coin
207  at-chain-charm
225  at-chain-stone
238  at-chain-coiled
98   at-chain-box
16   at-hoop-ear
21   at-hoop-twist
22   at-hoop-book
24   at-hoop-chunky
27   at-hoop-studio-sm
28   at-hoop-studio
29   at-hoop-textured
33   at-hoop-flowers
83   at-hoop-magazine
90   at-hoop-large-ear
91   at-hoop-small-ear
0    at-earcuff-hand
229  at-cuff-arm
230  at-cuff-model
233  at-bangle-thin-wrist
234  at-bangle-thin-leaves
235  at-cuff-sculpt
25   at-cuff-chainlink
210  at-cuff-band
5    at-anklet-sneaker
8    at-anklet-sneaker-2
34   at-anklet-foot
208  at-anklet-pair
18   kt-bride-kasavu
13   kt-temple-idol
15   kt-jhumka-palm
36   kt-jhumka-box
110  kt-jhumka-silver
200  kt-jhumka-stand
204  kt-earring-kundan
227  kt-jhumka-pile
14   kt-jhumka-portrait
87   kt-earring-portrait
226  kt-earring-saree
37   kt-necklace-pot
92   kt-necklace-saree
104  kt-necklace-jasmine
107  kt-haaram-bust
205  kt-necklace-kundan-set
108  kt-necklace-bride
85   kt-choker-bride
109  kt-choker-silver
115  kt-choker-gold
236  kt-choker-kundan
119  kt-choker-ornate
237  kt-haaram-green
88   kt-nosepin-bride
117  kt-nosepin-close
228  kt-nosepin-smile
82   kt-bangle-ornate
103  kt-bangle-green
105  kt-bangle-henna
17   kt-bangle-stack
35   kt-bangle-red
231  kt-bangle-hands
211  kt-necklace-teal
95   kt-portrait-blue
`
  .trim()
  .split("\n")
  .map((l) => {
    const [i, name] = l.trim().split(/\s+/);
    return { i: Number(i), name };
  });

const HERO = new Set(["kt-bride-kasavu", "at-chain-layered-model", "kt-necklace-jasmine", "kt-choker-bride"]);

const list = JSON.parse(await fs.readFile(`${SP}/cindex.json`, "utf8"));
await fs.mkdir("public/images", { recursive: true });

let ok = 0;
const missing = [];
const queue = [...PICKS];

await Promise.all(
  Array.from({ length: 6 }, async () => {
    while (queue.length) {
      const { i, name } = queue.shift();
      const entry = list.find((e) => e.i === i);
      if (!entry) {
        missing.push(`${name} (#${i} not in index)`);
        continue;
      }
      const w = HERO.has(name) ? 2400 : 1600;
      try {
        const r = await fetch(`https://${entry.u}?auto=compress&cs=tinysrgb&w=${w}`);
        if (!r.ok) {
          missing.push(`${name} ${r.status}`);
          continue;
        }
        const buf = Buffer.from(await r.arrayBuffer());
        await sharp(buf).jpeg({ quality: 82, mozjpeg: true }).toFile(`public/images/${name}.jpg`);
        ok++;
      } catch (e) {
        missing.push(`${name} ${e.message}`);
      }
    }
  }),
);

console.log(`saved ${ok}/${PICKS.length}`);
if (missing.length) console.log("missing:\n  " + missing.join("\n  "));
