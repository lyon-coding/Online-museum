#!/usr/bin/env node
// Lists the Commons files in an artist's painting categories (one level of subcategories),
// to find which works are available as free images. Usage: node scripts/discover-artists.mjs
const API = 'https://commons.wikimedia.org/w/api.php';
const headers = { 'User-Agent': 'OnlineMuseum/1.0 (artist discovery script)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const strip = (h) => String(h || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

async function api(params) {
  const u = new URL(API);
  Object.entries({ format: 'json', formatversion: '2', ...params }).forEach(([k, v]) => u.searchParams.set(k, v));
  for (let i = 0; i < 5; i++) {
    await sleep(1200);
    const text = await (await fetch(u, { headers })).text();
    try {
      return JSON.parse(text);
    } catch {
      await sleep(5000 * (i + 1));
    }
  }
  return {};
}

const ARTISTS = {
  'Joan Miró': ['Paintings by Joan Miró', 'Joan Miró'],
  'Yves Tanguy': ['Paintings by Yves Tanguy', 'Yves Tanguy'],
  'Paul Klee': ['Paintings by Paul Klee'],
  'Francis Picabia': ['Paintings by Francis Picabia'],
  'Kurt Schwitters': ['Works by Kurt Schwitters', 'Kurt Schwitters'],
  'Sophie Taeuber-Arp': ['Works by Sophie Taeuber-Arp', 'Sophie Taeuber-Arp'],
  'El Lissitzky': ['Works by El Lissitzky', 'El Lissitzky'],
  'Lyubov Popova': ['Paintings by Lyubov Popova'],
  'Theo van Doesburg': ['Paintings by Theo van Doesburg'],
  'Oskar Schlemmer': ['Paintings by Oskar Schlemmer'],
  'Giorgio de Chirico': ['Paintings by Giorgio de Chirico'],
  'Max Ernst': ['Paintings by Max Ernst'],
  'Fernand Léger': ['Paintings by Fernand Léger'],
  'Umberto Boccioni': ['Paintings by Umberto Boccioni']
};

async function filesIn(cat) {
  const d = await api({ action: 'query', generator: 'categorymembers', gcmtitle: 'Category:' + cat, gcmtype: 'file', gcmlimit: '200', prop: 'imageinfo', iiprop: 'size|mime|extmetadata', iiextmetadatafilter: 'ObjectName|DateTimeOriginal' });
  return (d.query && d.query.pages) || [];
}
async function subcats(cat) {
  const d = await api({ action: 'query', list: 'categorymembers', cmtitle: 'Category:' + cat, cmtype: 'subcat', cmlimit: '100' });
  return ((d.query && d.query.categorymembers) || []).map((c) => c.title.replace(/^Category:/, ''));
}

for (const [name, cats] of Object.entries(ARTISTS)) {
  const seen = new Map();
  let catsFound = 0;
  for (const cat of cats) {
    const subs = await subcats(cat);
    const files = await filesIn(cat);
    if (subs.length || files.length) catsFound++;
    const all = [...files];
    for (const sc of subs.slice(0, 25)) all.push(...(await filesIn(sc)));
    for (const p of all) {
      const ii = p.imageinfo && p.imageinfo[0];
      if (!ii || !/jpeg|png|tiff|webp/.test(ii.mime) || ii.width < 700) continue;
      const m = ii.extmetadata || {};
      seen.set(p.title, `${p.title.replace(/^File:/, '')} | ${ii.width}x${ii.height} | ${strip(m.DateTimeOriginal && m.DateTimeOriginal.value).slice(0, 24)} | ${strip(m.ObjectName && m.ObjectName.value).slice(0, 70)}`);
    }
  }
  console.log(`\n### ${name} (${seen.size} files, ${catsFound} categories found)`);
  for (const line of [...seen.values()].sort().slice(0, 70)) console.log(line);
}
