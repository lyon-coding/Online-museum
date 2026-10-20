#!/usr/bin/env node
// Temporary: prints Commons metadata (date, licence, description) for candidate files,
// and the results of a few searches, to write accurate wall texts.
const API = 'https://commons.wikimedia.org/w/api.php';
const headers = { 'User-Agent': 'OnlineMuseum/1.0 (metadata script)' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const strip = (h) => String(h || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
async function api(params) {
  const u = new URL(API);
  Object.entries({ format: 'json', formatversion: '2', ...params }).forEach(([k, v]) => u.searchParams.set(k, v));
  for (let i = 0; i < 5; i++) {
    await sleep(1000);
    const text = await (await fetch(u, { headers })).text();
    try { return JSON.parse(text); } catch { await sleep(3000 * (i + 1)); }
  }
  return {};
}
const FILES = `
Carnaval d'Arlequin (Carnival of Harlequin), 1924-1925.jpg
Joan Miró — Composition (1927).jpg
Et les seins mouraient... (1927) - Joan Miró (1893-1983) (45065322815).jpg
Mére Ubu, Joan Miró.jpg
Yves tanguy, la tempesta (paesaggio nero), 1926.jpg
Mama, Papa is Wounded!.jpg
Yves tanguy, la morte guardando la sua famiglia, 1927.jpg
Yves Tanguy - Le jardin sombre (1928).jpg
Yves tanguy, fuori, 1929 (edimburgo, scottish ng of ma).jpg
Yves Tanguy - Titre inconnu (Noyer indifférent, 1929).jpg
Yves Tanguy La splendeur semblable 1930.jpg
Yves Tanguy - Fraude au jardin (1930) - The Observer.jpg
Kairuan, vor dem Thor, Paul Klee (1914).jpg
Paul Klee - Vollmond - 15249 - Bavarian State Painting Collections.jpg
Klee - Sumpflegende PA291156.jpg
Klee Rosengarten 1290085.jpg
Paul Klee ~ Angelus Novus ~ 1920.jpg
Kristall-Stufung, Paul Klee (1921).jpg
Paul Klee - Gespenst eines Genies (Ghost of a Genius) - Google Art Project.jpg
Paul Klee - Vogelgarten - 15251 - Bavarian State Painting Collections.jpg
Hauptweg und Nebenwege - Paul Klee - Museum Ludwig-7026 (cropped).jpg
Monuments at G., 1929 - Paul Klee, MET DT7818.jpg
Farbtafel Qu 1, 1930 - Paul Klee.jpg
Francis Picabia - Caoutchouc.jpg
Francis Picabia - Les Meules (circa 1911).jpg
Francis Picabia, 1913, Catch as Catch Can, oil on canvas, 100.6 x 81.6 cm, Philadelphia Museum of Art.jpg
Francis Picabia, I See Again in Francis Picabia, I See Again in Memory My Dear UdnieMemory My Dear Udnie (50393143873).jpg
Francis Picabia - Le Lierre unique eunuque - 1985-0007 - Kunsthaus Zürich.jpg
Francis Picabia, 1922 - La Feuille de vigne.jpg
Francis Picabia, 1925 - Mardi gras.jpg
Francis Picabia, 1929 - Le Sphinx.jpg
Abtraction 26. Delicate Symphony.jpg
Merzbild 1A (The Psychiatrist) (1919).jpg
Merz-Painting 9b (also known as 'The Big Me-Painting').jpg
Green Square (Grünviereck).jpg
Merz 1925, 1. Relief in Blue Square 1925.jpg
Kurt Schwitters 7. Abstrakte Komposition.jpg
Sophie Taeuber-Arp, Composition à motifs d'arceaux ou Composition Horizontale-Verticale.jpg
Sophie Taeuber-Arp - Triptyque. Composition verticale-horizontale à triangles réciproques - 1958-0023.a-c - Kunsthaus Zürich.jpg
Sophie Taeuber-Arp, Aubette 127.jpg
Sophie Taeuber-Arp, Aubette 182.jpg
Sophie Taeuber-Arp - Kompozycja r.jpg
El Lissitzky I84361.jpg
El Lissitzky, Proun 23 N (B 111), 1920-21.jpg
El Lissitzky - Proun 99 - 1941.548 - Yale University Art Gallery.jpg
El lissitzky, proun G.B.A., 1923 ca.jpg
El Lissitzky - Proun 5A.jpg
El Lissitzky - Proposal for a PROUN street celebration - Google Art Project.jpg
Hamburg Docks (Lissitzky, 1926).jpg
1913 Popova Das Modell anagoria.JPG
'The Traveler' by Liubov Popova, Norton Simon Museum.JPG
Lyubov Popova, Lady with a Guitar, 1915.webp
'Architectonic Painting' by Lyubov Popova, 1917, LACMA.JPG
Lyubov Popova - Painterly Architectonics - 1982.10 - Dallas Museum of Art.jpg
Liubov Sergeievna Popova - Composition (Red-Black-Gold) - Google Art Project.jpg
1921 Popova Raum-und-Kraft-Konstruktion anagoria.jpg
Theo van Doesburg - Girl with Ranunculus - Google Art Project.jpg
Abstract Portrait by Theo van Doesburg.jpg
Otterloo kroller muller van doesburg danseuses.jpg
Theo van Doesburg Composition XX.jpg
Komposition in Halbtönen, Theo van Doesburg, 1928.jpg
Theo van Doesburg 002.jpg
Oskar Schlemmer Laternenfest Bauhaus Weimar 1922.jpg
Oskar Schlemmer (Der Gesetzgeber).jpg
Oskar Schlemmer - Vier Figuren im Raum 1925.jpg
1928 Schlemmer Rot Gegeneinander.jpg
Oskar Schlemmer Jünglingsgruppe in Braun 1928.jpg
1930 Schlemmer-Frauenschule.JPG
Oskar Schlemmer Vierergruppe mit Grau 1930.jpg
`.trim().split('\n');
const SEARCHES = [
  'Lissitzky Beat the Whites with the Red Wedge', 'Doesburg Counter-Composition', 'Doesburg Contra-Compositie',
  'Miró The Tilled Field', 'Miró The Farm 1921', 'Joan Miró 1925 painting', 'Joan Miró Harlequin', 'Miró Dog Barking at the Moon',
  'Schlemmer Bauhaustreppe', 'Picabia Udnie 1913', 'Picabia Danses à la source', 'Picabia Parade amoureuse', 'Schwitters Merzbild', 'Taeuber-Arp composition'
];
for (let i = 0; i < FILES.length; i += 20) {
  const titles = FILES.slice(i, i + 20).map((f) => 'File:' + f).join('|');
  const d = await api({ action: 'query', titles, prop: 'imageinfo', iiprop: 'size|extmetadata', iiextmetadatafilter: 'ObjectName|DateTimeOriginal|LicenseShortName|ImageDescription|Credit' });
  for (const p of (d.query && d.query.pages) || []) {
    const ii = p.imageinfo && p.imageinfo[0];
    if (!ii) { console.log(`\n## ${p.title}\nMISSING`); continue; }
    const m = ii.extmetadata || {};
    const g = (k) => strip(m[k] && m[k].value);
    console.log(`\n## ${p.title}\n${ii.width}x${ii.height} | ${g('LicenseShortName')} | ${g('DateTimeOriginal').slice(0, 40)} | ${g('ObjectName').slice(0, 80)}\nDESC: ${g('ImageDescription').slice(0, 600)}\nCREDIT: ${g('Credit').slice(0, 160)}`);
  }
}
for (const q of SEARCHES) {
  const d = await api({ action: 'query', generator: 'search', gsrsearch: q, gsrnamespace: '6', gsrlimit: '15', prop: 'imageinfo', iiprop: 'size|extmetadata', iiextmetadatafilter: 'LicenseShortName|DateTimeOriginal' });
  console.log(`\n### search: ${q}`);
  for (const p of (d.query && d.query.pages) || []) {
    const ii = p.imageinfo && p.imageinfo[0];
    if (!ii) continue;
    const m = ii.extmetadata || {};
    console.log(`${p.title.replace(/^File:/, '')} | ${ii.width}x${ii.height} | ${strip(m.LicenseShortName && m.LicenseShortName.value)} | ${strip(m.DateTimeOriginal && m.DateTimeOriginal.value).slice(0, 24)}`);
  }
}
