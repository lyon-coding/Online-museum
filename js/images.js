// Resolves every painting to a free image hosted on Wikimedia Commons.
//
// Works both in the browser (CORS via origin=*) and in Node 18+ (used by
// scripts/verify-images.mjs to "bake" a verified list into data/images.json).
// A painting that cannot be confirmed on Commons resolves to null and is
// left out of the museum.

const COMMONS_API = 'https://commons.wikimedia.org/w/api.php';
const ENWIKI_API = 'https://en.wikipedia.org/w/api.php';
const THUMB_WIDTH = 1280;
const BATCH = 25;
const CACHE_KEY = 'museum-commons-cache-v1';
const CACHE_TTL = 14 * 24 * 3600 * 1000;

// File names containing these words are photos of rooms, details, studies… not the painting itself.
const EXCLUDE = /\b(detail|details|ausschnitt|framed|frame|gallery|exhibition|installation|museum view|stamp|postcard|sketch|study|studies|etude|esquisse|copy|replica|x-ray|infrared|verso|reverse|signature|pastiche|after)\b/;

export function paintingKey(artistId, painting) {
  return `${artistId}/${painting.title}`;
}

export function normalizeName(s) {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/_/g, ' ')
    .toLowerCase();
}

function stripHtml(html) {
  if (!html) return '';
  return String(html)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function chunk(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

function buildUrl(base, params) {
  const u = new URL(base);
  const all = { format: 'json', formatversion: '2', origin: '*', ...params };
  for (const [k, v] of Object.entries(all)) u.searchParams.set(k, v);
  return u.toString();
}

async function getJson(url, opts) {
  let lastErr;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await (opts.fetch || fetch)(url, { headers: opts.headers || {} });
      if (res.status === 429 || res.status >= 500) throw new Error(`HTTP ${res.status}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      lastErr = err;
      await new Promise((r) => setTimeout(r, 600 * (attempt + 1)));
    }
  }
  throw lastErr;
}

function toInfo(page) {
  const ii = page.imageinfo && page.imageinfo[0];
  if (!ii || !ii.url) return null;
  const meta = ii.extmetadata || {};
  const mime = ii.mime || '';
  if (!/^image\/(jpeg|png|tiff|webp)$/.test(mime)) return null;
  const file = page.title.replace(/^File:/, '');
  return {
    file,
    thumb: ii.thumburl || ii.url,
    url: ii.url,
    w: ii.thumbwidth || ii.width,
    h: ii.thumbheight || ii.height,
    ow: ii.width,
    page: ii.descriptionurl || `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, '_'))}`,
    license: stripHtml(meta.LicenseShortName && meta.LicenseShortName.value) || 'Public domain',
    credit: stripHtml(meta.Artist && meta.Artist.value)
  };
}

const IMAGEINFO = {
  prop: 'imageinfo',
  iiprop: 'url|size|mime|extmetadata',
  iiurlwidth: String(THUMB_WIDTH),
  iiextmetadatafilter: 'LicenseShortName|Artist'
};

// Look up exact file names on Commons. Returns Map(requestedName -> info).
async function commonsLookup(names, opts) {
  const result = new Map();
  const unique = [...new Set(names)];
  for (const group of chunk(unique, BATCH)) {
    const url = buildUrl(COMMONS_API, { action: 'query', ...IMAGEINFO, titles: group.map((n) => 'File:' + n).join('|') });
    const data = await getJson(url, opts);
    const q = data.query || {};
    const norm = new Map((q.normalized || []).map((n) => [n.from, n.to]));
    const byTitle = new Map();
    for (const p of q.pages || []) {
      // Only files that live on Commons itself ("local" from the Commons API point of view).
      if (p.missing || p.invalid) continue;
      if (p.imagerepository && p.imagerepository !== 'local') continue;
      const info = toInfo(p);
      if (info) byTitle.set(p.title, info);
    }
    for (const n of group) {
      const t = 'File:' + n;
      const info = byTitle.get(norm.get(t) || t) || byTitle.get(t);
      if (info) result.set(n, info);
    }
    opts.onRequest && opts.onRequest();
  }
  return result;
}

// Lead images of English Wikipedia articles. Returns Map(articleTitle -> fileName).
async function articleLeadImages(titles, opts) {
  const result = new Map();
  const unique = [...new Set(titles)];
  for (const group of chunk(unique, BATCH)) {
    const url = buildUrl(ENWIKI_API, {
      action: 'query',
      prop: 'pageimages',
      piprop: 'name',
      pilicense: 'free',
      redirects: '1',
      titles: group.join('|')
    });
    const data = await getJson(url, opts);
    const q = data.query || {};
    const norm = new Map((q.normalized || []).map((n) => [n.from, n.to]));
    const redir = new Map((q.redirects || []).map((n) => [n.from, n.to]));
    const byTitle = new Map((q.pages || []).filter((p) => p.pageimage).map((p) => [p.title, p.pageimage.replace(/_/g, ' ')]));
    for (const t of group) {
      let final = norm.get(t) || t;
      final = redir.get(final) || final;
      const file = byTitle.get(final);
      if (file) result.set(t, file);
    }
    opts.onRequest && opts.onRequest();
  }
  return result;
}

function matchesSearch(fileName, spec) {
  const n = normalizeName(fileName);
  if (EXCLUDE.test(n)) return false;
  return (spec.all || []).every((re) => new RegExp(re).test(n));
}

async function commonsSearch(spec, opts) {
  const url = buildUrl(COMMONS_API, {
    action: 'query',
    generator: 'search',
    gsrsearch: spec.q,
    gsrnamespace: '6',
    gsrlimit: '20',
    ...IMAGEINFO
  });
  const data = await getJson(url, opts);
  opts.onRequest && opts.onRequest();
  const pages = ((data.query && data.query.pages) || []).slice().sort((a, b) => (a.index || 0) - (b.index || 0));
  for (const p of pages) {
    if (!matchesSearch(p.title, spec)) continue;
    const info = toInfo(p);
    if (!info) continue;
    const ii = p.imageinfo[0];
    const aspect = ii.width / ii.height;
    if (ii.width < 500 || aspect < 0.25 || aspect > 4) continue;
    return info;
  }
  return null;
}

async function pool(items, size, fn) {
  let i = 0;
  const workers = Array.from({ length: Math.min(size, items.length) }, async () => {
    while (i < items.length) {
      const item = items[i++];
      await fn(item);
    }
  });
  await Promise.all(workers);
}

/**
 * Resolve all paintings of all artists.
 * @returns {Promise<{images: Object<string, object|null>, errors: number}>}
 */
export async function resolveImages(artists, opts = {}) {
  const jobs = [];
  for (const a of artists) for (const p of a.paintings) jobs.push({ key: paintingKey(a.id, p), artist: a, p });

  const images = {};
  let errors = 0;
  const used = new Set();
  const done = () => opts.onProgress && opts.onProgress(Object.keys(images).length, jobs.length);
  const claim = (job, info) => {
    if (!info || used.has(info.file)) return false;
    used.add(info.file);
    images[job.key] = info;
    return true;
  };

  // 1. Exact file names.
  try {
    const found = await commonsLookup(jobs.flatMap((j) => j.p.files || []), opts);
    for (const j of jobs) for (const f of j.p.files || []) if (!images[j.key] && claim(j, found.get(f))) break;
  } catch (e) {
    errors++;
    opts.onError && opts.onError(e);
  }
  done();

  // 2. Lead images of Wikipedia articles (free images only), confirmed on Commons.
  try {
    const pending = jobs.filter((j) => !images[j.key] && j.p.article);
    if (pending.length) {
      const leads = await articleLeadImages(pending.map((j) => j.p.article), opts);
      const files = [...new Set([...leads.values()])];
      const found = files.length ? await commonsLookup(files, opts) : new Map();
      for (const j of pending) claim(j, found.get(leads.get(j.p.article)));
    }
  } catch (e) {
    errors++;
    opts.onError && opts.onError(e);
  }
  done();

  // 3. Commons search with strict file-name matching.
  const searchJobs = jobs.filter((j) => !images[j.key] && j.p.search);
  await pool(searchJobs, opts.concurrency || 4, async (j) => {
    try {
      const info = await commonsSearch(j.p.search, opts);
      claim(j, info);
    } catch (e) {
      errors++;
      opts.onError && opts.onError(e);
    }
    done();
  });

  for (const j of jobs) if (!(j.key in images)) images[j.key] = null;
  return { images, errors };
}

// ───────────────────────── browser helpers ─────────────────────────

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw);
    if (!c || Date.now() - c.time > CACHE_TTL) return null;
    return c.images;
  } catch {
    return null;
  }
}

function writeCache(images) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ time: Date.now(), images }));
  } catch {
    /* storage may be unavailable */
  }
}

/**
 * Browser entry point: baked list (data/images.json) → local cache → live API.
 */
export async function loadImages(artists, { onProgress, force } = {}) {
  const keys = artists.flatMap((a) => a.paintings.map((p) => paintingKey(a.id, p)));

  let baked = {};
  try {
    const res = await fetch('data/images.json', { cache: 'no-cache' });
    if (res.ok) baked = (await res.json()).images || {};
  } catch {
    /* no baked list */
  }

  const cached = force ? null : readCache();
  const images = {};
  for (const k of keys) {
    if (k in baked) images[k] = baked[k];
    else if (cached && k in cached) images[k] = cached[k];
  }

  const missing = artists
    .map((a) => ({ ...a, paintings: a.paintings.filter((p) => !(paintingKey(a.id, p) in images)) }))
    .filter((a) => a.paintings.length);

  let errors = 0;
  if (missing.length) {
    const already = Object.keys(images).length;
    const res = await resolveImages(missing, {
      onProgress: (n) => onProgress && onProgress(already + n, keys.length)
    });
    errors = res.errors;
    Object.assign(images, res.images);
    // Only cache a run that completed without network errors.
    if (!errors) {
      const toCache = {};
      for (const k of keys) if (!(k in baked)) toCache[k] = images[k];
      writeCache(toCache);
    }
  }
  onProgress && onProgress(keys.length, keys.length);
  return { images, errors };
}
