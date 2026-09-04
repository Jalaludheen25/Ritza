import fs from 'node:fs/promises';
import sharp from 'sharp';

const SP = process.argv[2];
process.chdir(SP);
const urls = (await fs.readFile('extra_urls.txt','utf8')).trim().split(/\r?\n/);
await fs.mkdir('ethumbs',{recursive:true});
const TW=230, TH=300, COLS=8, ROWS=5, PER=COLS*ROWS;

async function grab(u,i){
  const f = `ethumbs/${String(i).padStart(3,'0')}.jpg`;
  try { await fs.access(f); return f; } catch {}
  const full = `https://${u}?auto=compress&cs=tinysrgb&w=${TW*2}&h=${TH*2}&fit=crop`;
  try{
    const r = await fetch(full);
    if(!r.ok) return null;
    const b = Buffer.from(await r.arrayBuffer());
    await sharp(b).resize(TW,TH,{fit:'cover'}).jpeg({quality:72}).toFile(f);
    return f;
  }catch(e){ return null; }
}
const results=[];
const queue=urls.map((u,i)=>({u,i}));
await Promise.all(Array.from({length:12},async()=>{
  while(queue.length){
    const {u,i}=queue.shift();
    const f=await grab(u,i);
    if(f) results[i]={f,u,i};
  }
}));
const good=results.filter(Boolean);
console.log('downloaded',good.length,'of',urls.length);
await fs.writeFile('eindex.json',JSON.stringify(good));

const sheets=Math.ceil(good.length/PER);
for(let s=0;s<sheets;s++){
  const items=good.slice(s*PER,(s+1)*PER);
  const W=COLS*(TW+8)+8, H=ROWS*(TH+24)+8;
  const comps=[];
  for(let k=0;k<items.length;k++){
    const c=k%COLS, r=Math.floor(k/COLS);
    const x=8+c*(TW+8), y=8+r*(TH+24);
    comps.push({input:items[k].f, left:x, top:y});
    comps.push({input:Buffer.from(`<svg width="${TW}" height="20"><rect width="${TW}" height="20" fill="#111"/><text x="4" y="15" font-family="monospace" font-size="15" fill="#fff">#${items[k].i}</text></svg>`), left:x, top:y+TH});
  }
  await sharp({create:{width:W,height:H,channels:3,background:'#222'}}).composite(comps).jpeg({quality:76}).toFile(`esheet_${s}.jpg`);
  console.log('esheet_'+s+'.jpg', items.length);
}
