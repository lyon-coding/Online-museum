// Tests the Wikimedia Commons resolver against a mocked API (no network needed).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveImages, paintingKey } from '../js/images.js';
import { ARTISTS, INFLUENCES, CONTEMPORARIES, artistById } from '../js/data/artists.js';
import { MOVEMENTS } from '../js/data/movements.js';

const COMMONS_FILES = {
  'Monet - Impression, Sunrise.jpg': { width: 4000, height: 3000 },
  'Water Lilies Lead.jpg': { width: 3000, height: 2000 },
  'Claude Monet - Gare Saint-Lazare, 1877 (Orsay).jpg': { width: 2000, height: 1500 },
  'Claude Monet - Gare Saint-Lazare detail.jpg': { width: 2000, height: 1500 }
};
const LEADS = { 'Women in the Garden': 'Water_Lilies_Lead.jpg', 'Olympia (Manet)': 'NonFree_local.jpg' };

function page(title) {
  const name = title.replace(/^File:/, '');
  const f = COMMONS_FILES[name];
  if (!f) return { title, missing: true };
  return {
    title,
    imagerepository: 'local',
    imageinfo: [{ url: `https://upload.example/${name}`, thumburl: `https://upload.example/1280px-${name}`, thumbwidth: 1280, thumbheight: Math.round((1280 * f.height) / f.width), width: f.width, height: f.height, mime: 'image/jpeg', descriptionurl: `https://commons.example/${name}`, extmetadata: { LicenseShortName: { value: 'Public domain' }, Artist: { value: '<a href="x">Claude Monet</a>' } } }]
  };
}

async function mockFetch(url) {
  const u = new URL(url);
  const p = Object.fromEntries(u.searchParams);
  let body;
  if (u.hostname === 'en.wikipedia.org') {
    const titles = p.titles.split('|');
    body = { query: { pages: titles.map((t) => (LEADS[t] ? { title: t, pageimage: LEADS[t] } : { title: t })) } };
  } else if (p.generator === 'search') {
    const hits = p.gsrsearch.includes('Lazare') ? ['File:Claude Monet - Gare Saint-Lazare detail.jpg', 'File:Claude Monet - Gare Saint-Lazare, 1877 (Orsay).jpg'] : [];
    body = { query: { pages: hits.map((t, i) => ({ ...page(t), index: i + 1 })) } };
  } else {
    const titles = p.titles.split('|');
    const normalized = titles.filter((t) => t.includes('_')).map((t) => ({ from: t, to: t.replace(/_/g, ' ') }));
    body = { query: { normalized, pages: titles.map((t) => page(t.replace(/_/g, ' '))) } };
  }
  return { ok: true, status: 200, json: async () => body };
}

test('resolves by exact file, by article lead image and by filtered search', async () => {
  const monet = ARTISTS.find((a) => a.id === 'monet');
  const manet = ARTISTS.find((a) => a.id === 'manet');
  const { images, errors } = await resolveImages([monet, manet], { fetch: mockFetch, concurrency: 2 });
  assert.equal(errors, 0);
  const get = (a, title) => images[paintingKey(a.id, a.paintings.find((p) => p.title.startsWith(title)))];
  assert.equal(get(monet, 'Impression, Sunrise').file, 'Monet - Impression, Sunrise.jpg');
  assert.equal(get(monet, 'Impression, Sunrise').credit, 'Claude Monet');
  assert.equal(get(monet, 'Women in the Garden').file, 'Water Lilies Lead.jpg');
  // the "detail" crop must be skipped in favour of the full painting
  assert.equal(get(monet, 'La Gare Saint-Lazare').file, 'Claude Monet - Gare Saint-Lazare, 1877 (Orsay).jpg');
  // a lead image that is not on Commons is rejected → painting hidden
  assert.equal(get(manet, 'Olympia'), null);
  assert.equal(get(manet, 'The Fifer'), null);
});

test('data integrity', () => {
  const ids = new Set(ARTISTS.map((a) => a.id));
  const mv = new Set(MOVEMENTS.map((m) => m.id));
  for (const a of ARTISTS) {
    assert.ok(mv.has(a.movement), `${a.id} movement`);
    assert.ok(a.bio && a.roots && a.room && a.room.wall, `${a.id} fields`);
    const titles = new Set();
    for (const p of a.paintings) {
      assert.ok(p.title && p.date && p.desc && typeof p.year === 'number', `${a.id}/${p.title}`);
      assert.ok(p.files || p.article || p.search, `${a.id}/${p.title} has an image source`);
      assert.ok(!titles.has(p.title), `duplicate title ${p.title}`);
      titles.add(p.title);
      for (const re of (p.search && p.search.all) || []) new RegExp(re);
    }
    // paintings are listed in chronological order
    const years = a.paintings.map((p) => p.year);
    assert.deepEqual(years, [...years].sort((x, y) => x - y), `${a.id} chronological`);
    // series wings: valid references, unique titles, chronological works, wing texts
    const seriesIds = new Set((a.series || []).map((sr) => sr.id));
    for (const p of a.paintings) if (p.series) assert.ok(seriesIds.has(p.series), `${a.id}/${p.title} refers to series ${p.series}`);
    for (const sr of a.series || []) {
      assert.ok(sr.title && sr.date && sr.intro && sr.look && sr.works.length, `${a.id}/${sr.id} fields`);
      for (const p of sr.works) {
        assert.ok(p.title && p.date && p.desc && typeof p.year === 'number', `${a.id}/${sr.id}/${p.title}`);
        assert.ok(p.files || p.article || p.search, `${a.id}/${sr.id}/${p.title} has an image source`);
        assert.ok(!titles.has(p.title), `duplicate title ${p.title}`);
        titles.add(p.title);
      }
      const ys = sr.works.map((p) => p.year);
      assert.deepEqual(ys, [...ys].sort((x, y) => x - y), `${a.id}/${sr.id} chronological`);
    }
  }
  for (const e of INFLUENCES) assert.ok((ids.has(e.from) || e.from === 'lobby') && ids.has(e.to) && e.text, `edge ${e.from}->${e.to}`);
  for (const e of CONTEMPORARIES) assert.ok(ids.has(e.a) && ids.has(e.b) && e.text, `pair ${e.a}-${e.b}`);
  // every artist has a way in
  for (const a of ARTISTS) assert.ok(INFLUENCES.some((e) => e.to === a.id) || CONTEMPORARIES.some((e) => e.a === a.id || e.b === a.id), `${a.id} reachable`);
  assert.ok(artistById.lobby);
});
