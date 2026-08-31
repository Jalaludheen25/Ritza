import sharp from 'sharp';

/* Renders the "after" frame used by the home-page try-on showcase, using the
   exact same screen-blend the live try-on view applies in the browser. */

const base = sharp('public/images/bare-shoulder-neck.jpg').resize({ width: 1200 });
const meta = await base.metadata();
const W = 1200;
const H = Math.round((meta.height / meta.width) * W) || 1500;

const plate = await sharp('public/tryon/necklace-diamond.png')
  .resize({ width: Math.round(W * 0.52) })
  .toBuffer();
const pm = await sharp(plate).metadata();

await sharp('public/images/bare-shoulder-neck.jpg')
  .resize({ width: W })
  .composite([
    {
      input: plate,
      left: Math.round(W * 0.24),
      top: Math.round(H * 0.34),
      blend: 'screen',
    },
  ])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile('public/images/tryon-after.jpg');

await sharp('public/images/bare-shoulder-neck.jpg')
  .resize({ width: W })
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile('public/images/tryon-before.jpg');

console.log('base', W + 'x' + H, 'plate', pm.width + 'x' + pm.height);
