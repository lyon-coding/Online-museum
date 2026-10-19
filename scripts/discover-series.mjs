#!/usr/bin/env node
// Lists candidate Commons files for painting series, with their size and the
// title/date recorded on Commons. Used to curate the series wings.
const API = 'https://commons.wikimedia.org/w/api.php';
const headers = { 'User-Agent': 'OnlineMuseum/1.0 (series discovery script)' };
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const strip = (h) => String(h || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

const SERIES = [
  ['haystacks', ['Monet Stacks of Wheat', 'Monet Haystacks', 'Monet Meules', 'Monet Grainstack', 'Monet Wheatstacks'], ['monet', 'wheat|haystack|grainstack|meule|stack']],
  ['rouen', ['Monet Rouen Cathedral', 'Monet cathédrale de Rouen'], ['monet', 'rouen']],
  ['bridge', ['Monet Japanese footbridge', 'Monet bridge water lily pond', 'Monet pont japonais', 'Monet bassin aux nymphéas pont'], ['monet', 'bridge|footbridge|pont|passerelle']],
  ['waterlilies', ['Monet Water Lilies', 'Monet Nymphéas', 'Monet water lily pond'], ['monet', 'water.?lil|nympheas|lily']],
  ['victoire', ['Cézanne Mont Sainte-Victoire', 'Cezanne Montagne Sainte-Victoire'], ['cezanne', 'victoire']],
  ['cardplayers', ['Cézanne Card Players', 'Cézanne joueurs de cartes'], ['cezanne', 'card players|joueurs de cartes|cardplayers']],
  ['montmartre', ['Pissarro Boulevard Montmartre'], ['pissarro', 'montmartre']],
  ['sunflowers', ['Van Gogh Sunflowers', 'Van Gogh tournesols', 'Van Gogh zonnebloemen'], ['gogh', 'sunflower|tournesol|zonnebloem']]
];

const only = process.argv.slice(2);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function getJson(u) {
  for (let i = 0; i < 5; i++) {
    const res = await fetch(u, { headers });
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      await sleep(5000 * (i + 1)); // rate limited: wait and retry
    }
  }
  return {};
}

for (const [id, queries, all] of SERIES) {
  if (only.length && !only.includes(id)) continue;
  const seen = new Map();
  for (const q of queries) {
    const u = new URL(API);
    Object.entries({ action: 'query', format: 'json', formatversion: '2', generator: 'search', gsrsearch: q, gsrnamespace: '6', gsrlimit: '50', prop: 'imageinfo', iiprop: 'size|mime|extmetadata', iiextmetadatafilter: 'ObjectName|DateTimeOriginal|Credit' }).forEach(([k, v]) => u.searchParams.set(k, v));
    await sleep(1500);
    const data = await getJson(u);
    for (const p of (data.query && data.query.pages) || []) {
      const n = norm(p.title);
      if (!all.every((re) => new RegExp(re).test(n))) continue;
      const ii = p.imageinfo && p.imageinfo[0];
      if (!ii || !/jpeg|png|tiff|webp/.test(ii.mime)) continue;
      const m = ii.extmetadata || {};
      seen.set(p.title, `${p.title.replace(/^File:/, '')} | ${ii.width}x${ii.height} | ${strip(m.DateTimeOriginal && m.DateTimeOriginal.value).slice(0, 30)} | ${strip(m.ObjectName && m.ObjectName.value).slice(0, 90)}`);
    }
  }
  console.log(`\n### ${id} (${seen.size})`);
  for (const line of [...seen.values()].sort()) console.log(line);
}
