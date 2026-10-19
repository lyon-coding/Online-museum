#!/usr/bin/env node
// Verifies every painting against the Wikimedia Commons API and writes the
// confirmed images to data/images.json. The museum then loads instantly from
// that file instead of querying Commons in each visitor's browser.
//
//   node scripts/verify-images.mjs            # resolve everything, write data/images.json
//   node scripts/verify-images.mjs --dry-run  # only print the report
//
// Paintings that cannot be confirmed are written as null and are not shown.
import { writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { ARTISTS } from '../js/data/artists.js';
import { resolveImages, paintingKey, allPaintings } from '../js/images.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dry = process.argv.includes('--dry-run');
const headers = { 'User-Agent': 'OnlineMuseum/1.0 (https://github.com/lyon-coding/online-museum; image verification script)' };

const total = ARTISTS.reduce((s, a) => s + allPaintings(a).length, 0);
let requests = 0;
console.log(`Resolving ${total} paintings on Wikimedia Commons…`);
const { images, errors } = await resolveImages(ARTISTS, {
  headers,
  concurrency: 3,
  onRequest: () => requests++,
  onProgress: (n, t) => process.stdout.write(`\r  ${n}/${t}`),
  onError: (e) => console.error('\n  request failed:', e.message)
});
console.log(`\n${requests} API requests, ${errors} errors.\n`);

let shown = 0;
for (const a of ARTISTS) {
  const rows = allPaintings(a).map((p) => ({ p, info: images[paintingKey(a.id, p)] }));
  const ok = rows.filter((r) => r.info).length;
  shown += ok;
  console.log(`${a.name} — ${ok}/${rows.length}`);
  for (const r of rows) console.log(`   ${r.info ? '✓' : '✗'} ${r.p.date.padEnd(10)} ${r.p.title}${r.info ? `  ←  ${r.info.file}` : '  (not on Commons, hidden)'}`);
}
console.log(`\n${shown} of ${total} paintings confirmed.`);

if (errors) {
  console.error('Some requests failed; not writing data/images.json. Run again later.');
  process.exit(1);
}
if (!dry) {
  await mkdir(path.join(root, 'data'), { recursive: true });
  const out = { generated: new Date().toISOString(), source: 'Wikimedia Commons API', images };
  await writeFile(path.join(root, 'data', 'images.json'), JSON.stringify(out, null, 1) + '\n');
  console.log('Wrote data/images.json');
}
