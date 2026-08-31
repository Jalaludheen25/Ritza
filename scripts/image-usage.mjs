import fs from "node:fs";
import path from "node:path";

/* Maps every /images/*.jpg reference back to the file that uses it, so an
   imagery audit can be done against actual placement rather than filenames. */

const files = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (/\.(tsx|ts)$/.test(entry.name)) files.push(p);
  }
})("src");

const usage = {};
for (const file of files) {
  const src = fs.readFileSync(file, "utf8");
  for (const m of src.matchAll(/["'`](\/images\/[a-z0-9-]+\.jpg)["'`]/g)) {
    const img = m[1].replace("/images/", "").replace(".jpg", "");
    (usage[img] ??= new Set()).add(file.split(path.sep).join("/").replace("src/", ""));
  }
}

const rows = Object.entries(usage).sort(([a], [b]) => a.localeCompare(b));
console.log(`${rows.length} images referenced\n`);
for (const [img, where] of rows) {
  console.log(img.padEnd(30), [...where].join("  "));
}

const all = fs.readdirSync("public/images").filter((f) => f.endsWith(".jpg")).map((f) => f.replace(".jpg", ""));
const unused = all.filter((f) => !usage[f]);
console.log(`\n${unused.length} unused: ${unused.join(", ")}`);
