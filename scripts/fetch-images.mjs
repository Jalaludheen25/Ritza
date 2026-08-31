import fs from 'node:fs/promises';
import sharp from 'sharp';

const SP = process.argv[2];
const urls = (await fs.readFile(`${SP}/all_urls.txt`,'utf8')).trim().split(/\r?\n/);

const MAP = `5 ear-earring-hand
6 chain-on-shirt
7 layered-gold-green
12 model-gold-bokeh
14 chain-on-silk
20 pearls-macro
22 gold-teardrop-model
26 chain-on-books
30 gold-link-bracelet
31 gold-chain-stone
32 gold-rings-silk
33 gold-chain-marble
36 diamond-pendants-navy
37 gold-hoops-flowers
38 rings-mirror
39 rings-white-flowers
46 pearl-choker-model
52 ornate-earring-ear
59 diamond-necklace-model
60 pearl-choker-white
63 pearls-table
68 gold-necklace-ceramic
73 gold-bokeh-texture
74 gold-pendant-black
76 diamond-set-black
77 diamond-necklace-black
78 pearl-strand-cream
88 gold-pendant-silk
90 gold-necklace-cylinder
92 diamond-ring-gold-silk
97 coin-pendant-hand
99 dubai-palms-pool
101 pearl-coin-necklace
112 pear-diamond-ring-stone
117 gold-solitaire-ring
119 pearls-books
124 gold-necklace-white
141 emerald-diamond-necklace
144 gold-earrings-stand
146 pearl-crystal-earrings
147 gold-chain-light
149 gold-rings-flatlay
163 pendants-brown-card
165 diamond-tennis-necklace
172 pearl-necklace-stand
177 model-profile-earrings
178 diamond-set-terracotta
181 layered-chains-green
182 gold-earring-blonde
183 diamond-necklace-blue
193 gold-coin-necklace-black
202 diamond-studs
203 diamond-studs-2
204 emerald-cut-pendant
205 rings-white-boxes
217 pearl-necklace-red-lips
222 gold-hoop-hand
223 model-gold-necklace-black
224 pearl-strand-held
226 wedding-rings
238 gold-set-dark-plate
241 gold-chain-earring-model
243 gold-chains-rail
244 ring-pendant-black
250 gold-hoops-flatlay
257 gold-earring-hair
258 chains-teacup
259 gold-jewels-plate
260 gold-jewels-plate-2
279 pearl-necklace-blazer
285 pendant-black-stand
290 pearl-strand-shells
291 pearls-white-silk
292 gold-necklace-warm`.trim().split('\n').map(l=>{const [i,n]=l.split(' ');return {i:+i,n};});

const HERO = new Set(['model-gold-bokeh','model-gold-necklace-black','pearl-necklace-red-lips','dubai-palms-pool','gold-chains-rail','gold-bokeh-texture']);

await fs.mkdir('public/images',{recursive:true});
let ok=0, fail=[];
const q = [...MAP];
await Promise.all(Array.from({length:8}, async()=>{
  while(q.length){
    const {i,n}=q.shift();
    const w = HERO.has(n) ? 2400 : 1500;
    const src = `https://${urls[i]}?auto=compress&cs=tinysrgb&w=${w}`;
    try{
      const r = await fetch(src);
      if(!r.ok){ fail.push(n+' '+r.status); continue; }
      const buf = Buffer.from(await r.arrayBuffer());
      await sharp(buf).jpeg({quality:82, mozjpeg:true}).toFile(`public/images/${n}.jpg`);
      ok++;
    }catch(e){ fail.push(n+' '+e.message); }
  }
}));
console.log('saved',ok,'failed',fail.length, fail.join(' | '));
