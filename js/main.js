import * as THREE from 'three';
import { RoomEnvironment } from '../vendor/addons/RoomEnvironment.js';
import { ARTISTS, LOBBY, INFLUENCES, CONTEMPORARIES, artistById } from './data/artists.js';
import { MOVEMENTS, movementById } from './data/movements.js';
import { loadImages, paintingKey } from './images.js';
import { buildRoom, EYE } from './museum/room.js';
import { Controls } from './museum/controls.js';
import { setMaxAnisotropy } from './museum/textures.js';
import { Viewer } from './ui/viewer.js';
import { Timeline } from './ui/timeline.js';
import { esc, years } from './ui/util.js';

const params = new URLSearchParams(location.search);
const PLACEHOLDERS = params.has('placeholders'); // developer mode: draw labelled placeholders instead of images
const $ = (s) => document.querySelector(s);

// ───────────────────────────── renderer ─────────────────────────────
const canvas = $('#scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
const coarse = matchMedia('(pointer: coarse)').matches;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, coarse ? 1.5 : 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.outputColorSpace = THREE.SRGBColorSpace;
setMaxAnisotropy(Math.min(8, renderer.capabilities.getMaxAnisotropy()));

const scene = new THREE.Scene();
scene.background = new THREE.Color('#1a1816');
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.55;

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.05, 80);
camera.rotation.order = 'YXZ';

function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.fov = w < h ? 80 : 70; // wider view in portrait
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();

// ───────────────────────────── data ─────────────────────────────
let images = {};
const works = {}; // artistId -> [{painting, info}]
let available = new Set(['lobby']);

function prepareWorks() {
  available = new Set(['lobby']);
  const aspects = [1.25, 0.8, 1.5, 0.75, 2.2, 1.0, 1.33, 0.7];
  for (const a of ARTISTS) {
    const list = a.paintings
      .map((p, i) => {
        if (PLACEHOLDERS) return { painting: p, info: { placeholder: true, w: aspects[i % aspects.length] * 100, h: 100 } };
        const info = images[paintingKey(a.id, p)];
        return info ? { painting: p, info } : null;
      })
      .filter(Boolean)
      .sort((x, y) => x.painting.year - y.painting.year);
    works[a.id] = list;
    if (list.length) available.add(a.id);
  }
}

const movementOf = (id) => (id === 'lobby' ? null : movementById[artistById[id].movement]);

function linkTo(id, kind, text) {
  const a = artistById[id];
  const m = movementOf(id);
  return {
    id,
    name: a.name,
    years: id === 'lobby' ? 'Start of the visit' : `${years(a)} · ${m.short}`,
    kind,
    text,
    color: m ? m.color : '#9a7b47',
    wall: a.room.wall
  };
}

function linksFor(id) {
  const back = INFLUENCES.filter((e) => e.to === id && available.has(e.from)).map((e) => linkTo(e.from, 'Roots', e.text));
  const front = INFLUENCES.filter((e) => e.from === id && available.has(e.to)).map((e) => linkTo(e.to, id === 'lobby' ? 'Begin' : 'Legacy', e.text));
  const side = CONTEMPORARIES.filter((e) => (e.a === id || e.b === id) && available.has(e.a === id ? e.b : e.a)).map((e) => linkTo(e.a === id ? e.b : e.a, 'Contemporary', e.text));
  // sort by year so the order of doors follows the chronology
  const by = (l) => (l.id === 'lobby' ? 0 : artistById[l.id].born);
  back.sort((x, y) => by(x) - by(y));
  front.sort((x, y) => by(x) - by(y));
  return { back, front, left: side.filter((_, i) => i % 2 === 0).slice(0, 2), right: side.filter((_, i) => i % 2 === 1).slice(0, 2) };
}

// ───────────────────────────── textures ─────────────────────────────
const loader = new THREE.TextureLoader();
loader.setCrossOrigin('anonymous');
const texCache = new Map(); // url -> Promise<Texture|null>
function getTexture(info) {
  if (!info || info.placeholder) return Promise.resolve(null);
  const url = info.thumb;
  if (texCache.has(url)) {
    const p = texCache.get(url);
    texCache.delete(url); // refresh LRU order
    texCache.set(url, p);
    return p;
  }
  const p = loader
    .loadAsync(url)
    .then((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      t.userData.keep = true;
      return t;
    })
    .catch(() => null);
  texCache.set(url, p);
  // keep GPU memory bounded
  while (texCache.size > (coarse ? 28 : 48)) {
    const [oldUrl, oldP] = texCache.entries().next().value;
    texCache.delete(oldUrl);
    oldP.then((t) => {
      if (t && !inCurrentRoom(oldUrl)) t.dispose();
    });
  }
  return p;
}
const inCurrentRoom = (url) => (works[currentId] || []).some((w) => w.info && w.info.thumb === url);

// ───────────────────────────── room management ─────────────────────────────
let room = null;
let currentId = null;
let transitioning = false;
const controls = new Controls(canvas, { joystick: $('#joystick'), onTap, onHover });

function enterRoom(id, { from = null, via = null } = {}) {
  if (!available.has(id)) id = 'lobby';
  if (room) {
    scene.remove(room.group);
    room.dispose();
  }
  const artist = artistById[id];
  room = buildRoom({
    artist,
    works: works[id] || [],
    links: linksFor(id),
    movement: movementOf(id),
    movements: MOVEMENTS,
    getTexture,
    placeholderLabel: PLACEHOLDERS ? 'DEVELOPER PLACEHOLDER' : ''
  });
  scene.add(room.group);
  scene.background = new THREE.Color(artist.room.wall).multiplyScalar(0.25);
  currentId = id;
  const sp = room.spawn(from);
  controls.setPose(sp.x, sp.z, sp.yaw);
  updateHud();
  showRoomCard(via);
  try {
    history.replaceState(null, '', `#${id}`);
  } catch {
    /* ignore */
  }
}

async function go(id, opts = {}) {
  if (transitioning) return;
  transitioning = true;
  controls.enabled = false;
  const fade = $('#fade');
  fade.classList.add('on');
  await new Promise((r) => setTimeout(r, 380));
  enterRoom(id, opts);
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  fade.classList.remove('on');
  controls.enabled = !anyModalOpen();
  transitioning = false;
}

// ───────────────────────────── HUD ─────────────────────────────
function updateHud() {
  const a = artistById[currentId];
  const m = movementOf(currentId);
  $('#hud-name').textContent = a.name;
  const chip = $('#hud-chip');
  chip.textContent = m ? m.short : 'Welcome';
  chip.style.setProperty('--c', m ? m.color : '#9a7b47');
}

let cardTimer = null;
function showRoomCard(via) {
  const card = $('#roomcard');
  const a = artistById[currentId];
  const m = movementOf(currentId);
  const n = (works[currentId] || []).length;
  let html;
  if (currentId === 'lobby') {
    html = `<div class="rc-kicker">Entrance hall</div><div class="rc-title">From Impression to Abstraction</div>
      <p>Walk through the door ahead to begin with Manet, or open the <a href="#" data-tl>timeline</a> to jump anywhere.</p>`;
  } else {
    html = `<div class="rc-kicker" style="--c:${m.color}"><span class="dot"></span>${esc(m.short)} · ${years(a)}</div>
      <div class="rc-title">${esc(a.name)}</div>
      ${via && via.text ? `<p class="rc-via"><strong>${esc({ Roots: 'Going back in time', Contemporary: 'A contemporary', Legacy: 'What came next', Begin: 'The visit begins' }[via.kind] || '')}:</strong> ${esc(via.text)}</p>` : `<p>${esc(a.roots)}</p>`}
      <div class="rc-foot">${n} painting${n === 1 ? '' : 's'}, in chronological order · <a href="#" data-info>About this room</a></div>`;
  }
  card.innerHTML = `<button class="icon-btn rc-close" aria-label="Hide">✕</button>${html}`;
  card.classList.add('show');
  card.querySelector('.rc-close').addEventListener('click', () => card.classList.remove('show'));
  card.querySelector('[data-info]')?.addEventListener('click', (e) => {
    e.preventDefault();
    openInfo();
  });
  card.querySelector('[data-tl]')?.addEventListener('click', (e) => {
    e.preventDefault();
    openTimeline();
  });
  clearTimeout(cardTimer);
  cardTimer = setTimeout(() => card.classList.remove('show'), via ? 14000 : 9000);
}

let toastTimer = null;
function toast(text) {
  const t = $('#toast');
  t.textContent = text;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

// ───────────────────────────── modals ─────────────────────────────
const viewer = new Viewer($('#viewer'), { onClose: modalClosed });
const timeline = new Timeline($('#timeline'), {
  movements: MOVEMENTS,
  onEnter: (id) => {
    modalClosed();
    if (id !== currentId) go(id);
  },
  onLobby: () => {
    modalClosed();
    go('lobby');
  }
});
const timelineObserver = new MutationObserver(() => {
  if (!timeline.isOpen()) modalClosed();
});
timelineObserver.observe($('#timeline'), { attributes: true, attributeFilter: ['class'] });

function anyModalOpen() {
  return document.querySelector('.modal.open, .sheet.open, #intro.open') !== null;
}
function modalOpened() {
  controls.enabled = false;
  controls.keys.clear();
}
function modalClosed() {
  setTimeout(() => {
    if (!anyModalOpen() && !transitioning) controls.enabled = true;
  }, 0);
}

function openTimeline() {
  closeAll();
  modalOpened();
  timeline.open(currentId);
}

function openPainting(index) {
  closeAll();
  modalOpened();
  viewer.open(works[currentId], index, artistById[currentId]);
}

function openDoor(link) {
  closeAll();
  modalOpened();
  const box = $('#doorcard');
  const here = artistById[currentId];
  const kindText = { Roots: 'Roots', Legacy: 'What came next', Contemporary: 'Contemporaries', Begin: 'Begin the visit' }[link.kind] || link.kind;
  box.querySelector('.dc-body').innerHTML = `
    <div class="dc-kicker" style="--c:${link.color}">${esc(kindText)}</div>
    <h3>${currentId === 'lobby' ? '' : esc(here.short) + ' <span class="arrow">' + (link.kind === 'Roots' ? '←' : link.kind === 'Contemporary' ? '↔' : '→') + '</span> '}${esc(link.name)}</h3>
    <div class="muted">${esc(link.years)}</div>
    <p>${esc(link.text)}</p>`;
  box.classList.add('open');
  const goBtn = box.querySelector('[data-go]');
  goBtn.textContent = link.id === 'lobby' ? 'Back to the entrance hall' : `Enter ${artistById[link.id].short}'s room →`;
  goBtn.onclick = () => {
    box.classList.remove('open');
    modalClosed();
    go(link.id, { from: currentId, via: link });
  };
}

function openInfo() {
  closeAll();
  modalOpened();
  const box = $('#info');
  const a = artistById[currentId];
  const m = movementOf(currentId);
  const l = linksFor(currentId);
  const list = works[currentId] || [];
  const linkList = (title, arr) =>
    arr.length
      ? `<h4>${title}</h4>${arr
          .map((x) => `<button class="link-row" data-go="${x.id}" style="--c:${x.color}"><span class="lr-name">${esc(x.name)}</span><span class="lr-text">${esc(x.text)}</span></button>`)
          .join('')}`
      : '';
  let html;
  if (currentId === 'lobby') {
    html = `<h2>From Impression to Abstraction</h2>
      <p>This museum follows modern painting from Manet in the 1860s to the first abstract paintings of the 1910s. Each room is dedicated to one artist, with paintings hung in chronological order.</p>
      <p>The central question: <em>how does one movement become another?</em> In every room, doors behind you lead to the artist's roots, doors ahead to the painters who followed, and side doors to contemporaries.</p>
      ${MOVEMENTS.map((mm) => `<div class="mv-row" style="--c:${mm.color}"><strong>${esc(mm.name)}</strong> <span class="muted">${mm.start}–${mm.end}</span><p>${esc(mm.roots)}</p></div>`).join('')}`;
  } else {
    const all = [...l.left, ...l.right];
    html = `<span class="chip" style="--c:${m.color}">${esc(m.short)}</span>
      <h2>${esc(a.name)}</h2>
      <div class="muted">${esc(a.nationality)}, ${years(a)}</div>
      <p>${esc(a.bio)}</p>
      <p><strong>Roots:</strong> ${esc(a.roots)}</p>
      <div class="connections">
        ${linkList('Came from', l.back.filter((x) => x.id !== 'lobby'))}
        ${linkList('Led to', l.front)}
        ${linkList('Contemporaries', all)}
      </div>
      <h4>The movement: ${esc(m.name)}</h4>
      <p><strong>Where it came from.</strong> ${esc(m.roots)}</p>
      <p><strong>What it became.</strong> ${esc(m.became)}</p>
      <h4>Paintings in this room (${list.length})</h4>
      <ol class="work-list">${list
        .map((w, i) => `<li><button data-work="${i}">${w.info && w.info.thumb && !w.info.placeholder ? `<img loading="lazy" src="${esc(w.info.thumb.replace(/\/\d+px-/, '/330px-'))}" alt="" onerror="this.remove()">` : '<span class="ph"></span>'}<span><strong>${esc(w.painting.title)}</strong><small>${esc(w.painting.date)}</small></span></button></li>`)
        .join('')}</ol>`;
  }
  box.querySelector('.info-body').innerHTML = html;
  box.querySelectorAll('[data-go]').forEach((b) =>
    b.addEventListener('click', () => {
      const id = b.dataset.go;
      const link = [...l.back, ...l.front, ...l.left, ...l.right].find((x) => x.id === id);
      closeAll();
      modalClosed();
      go(id, { from: currentId, via: link });
    })
  );
  box.querySelectorAll('[data-work]').forEach((b) => b.addEventListener('click', () => openPainting(+b.dataset.work)));
  box.classList.add('open');
  box.querySelector('.sheet-panel').scrollTop = 0;
}

function closeAll() {
  document.querySelectorAll('.modal.open, .sheet.open').forEach((m) => m.classList.remove('open'));
  if (viewer.isOpen()) viewer.close();
  timeline.close();
}

document.querySelectorAll('[data-dismiss]').forEach((b) =>
  b.addEventListener('click', () => {
    b.closest('.modal, .sheet').classList.remove('open');
    modalClosed();
  })
);
document.querySelectorAll('.modal, .sheet').forEach((m) =>
  m.addEventListener('click', (e) => {
    if (e.target === m) {
      m.classList.remove('open');
      modalClosed();
    }
  })
);
window.addEventListener('keydown', (e) => {
  if (e.target && /input|textarea/i.test(e.target.tagName)) return;
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal.open, .sheet.open').forEach((m) => m.classList.remove('open'));
    modalClosed();
  }
  if ($('#intro').classList.contains('open')) return;
  if (e.key === 't' || e.key === 'T') timeline.isOpen() ? (timeline.close(), modalClosed()) : openTimeline();
  if (e.key === 'i' || e.key === 'I') openInfo();
});
$('#timelineBtn').addEventListener('click', openTimeline);
$('#roomBtn').addEventListener('click', openInfo);
$('#lobbyBtn').addEventListener('click', () => go('lobby'));
$('#helpBtn').addEventListener('click', () => {
  closeAll();
  modalOpened();
  $('#intro').classList.add('open', 'help');
});

// ───────────────────────────── picking ─────────────────────────────
const raycaster = new THREE.Raycaster();
const ndc = new THREE.Vector2();
function pick(x, y) {
  if (!room) return null;
  ndc.set((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);
  raycaster.setFromCamera(ndc, camera);
  raycaster.far = 40;
  const hits = raycaster.intersectObjects(room.interactives, false);
  for (const h of hits) if (h.object.userData.action) return { action: h.object.userData.action, point: h.point, distance: h.distance };
  return null;
}

function onTap(x, y) {
  if (transitioning || anyModalOpen()) return;
  const hit = pick(x, y);
  if (!hit) return;
  const a = hit.action;
  if (a.type === 'painting') openPainting(a.index);
  else if (a.type === 'door') openDoor(a.link);
  else if (a.type === 'info') openInfo();
  else if (a.type === 'timeline') openTimeline();
  else if (a.type === 'floor') {
    controls.walkTo(hit.point.x, hit.point.z);
    showMarker(hit.point);
  }
}

const tooltip = $('#tooltip');
let hoverPending = null;
function onHover(x, y) {
  hoverPending = x === null ? 'none' : { x, y };
}
function processHover() {
  if (!hoverPending) return;
  const hp = hoverPending;
  hoverPending = null;
  if (hp === 'none' || anyModalOpen() || transitioning) {
    tooltip.classList.remove('show');
    canvas.style.cursor = '';
    return;
  }
  const hit = pick(hp.x, hp.y);
  let label = '';
  if (hit) {
    const a = hit.action;
    if (a.type === 'painting') {
      const w = works[currentId][a.index];
      label = `${w.painting.title}, ${w.painting.date}`;
    } else if (a.type === 'door') label = `${a.link.kind === 'Begin' ? 'Begin' : a.link.kind}: ${a.link.name}`;
    else if (a.type === 'info') label = 'Read more';
    else if (a.type === 'timeline') label = 'Open the timeline';
  }
  canvas.style.cursor = hit && hit.action.type !== 'floor' ? 'pointer' : '';
  if (label) {
    tooltip.textContent = label;
    tooltip.style.transform = `translate(${hp.x + 14}px, ${hp.y + 16}px)`;
    tooltip.classList.add('show');
  } else tooltip.classList.remove('show');
}

// walk-to marker on the floor
const marker = new THREE.Mesh(new THREE.RingGeometry(0.16, 0.22, 32), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0, depthWrite: false }));
marker.rotation.x = -Math.PI / 2;
scene.add(marker);
let markerT = 0;
function showMarker(p) {
  marker.position.set(p.x, 0.02, p.z);
  markerT = 1;
}

// ───────────────────────────── loop ─────────────────────────────
const clock = new THREE.Clock();
let elapsed = 0;
let bob = 0;
let stuckTime = 0;
function frame() {
  const dt = Math.min(0.05, clock.getDelta());
  elapsed += dt;
  if (room) {
    const mv = controls.update(dt);
    if (mv.moving && !transitioning) {
      const before = { x: controls.x, z: controls.z };
      const p = { x: controls.x + mv.dx, z: controls.z + mv.dz };
      const door = room.collide(p);
      controls.x = p.x;
      controls.z = p.z;
      const moved = Math.hypot(p.x - before.x, p.z - before.z);
      const wanted = Math.hypot(mv.dx, mv.dz);
      if (controls.target) {
        stuckTime = moved < wanted * 0.3 ? stuckTime + dt : 0;
        if (stuckTime > 0.35) controls.target = null;
      }
      bob += moved * 5.5;
      if (door) go(door.id, { from: currentId, via: door });
    }
    camera.position.set(controls.x, EYE + Math.sin(bob) * 0.025, controls.z);
    camera.rotation.set(controls.pitch, controls.yaw, 0);
    for (const f of room.animate) f(dt, elapsed);
  }
  if (markerT > 0) {
    markerT = Math.max(0, markerT - dt * 0.9);
    marker.material.opacity = markerT * 0.8;
    marker.scale.setScalar(1 + (1 - markerT) * 0.6);
  }
  processHover();
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}

// ───────────────────────────── start ─────────────────────────────
async function start() {
  const intro = $('#intro');
  const btn = $('#enterBtn');
  const status = $('#loadStatus');
  const bar = $('#loadBar');
  intro.classList.add('open');
  modalOpened();
  if (coarse) document.body.classList.add('touch');

  if (document.fonts && document.fonts.load) {
    await Promise.race([Promise.all([document.fonts.load('600 40px "Cormorant Garamond"'), document.fonts.load('400 16px "Inter"')]), new Promise((r) => setTimeout(r, 2500))]).catch(() => {});
  }

  const total = ARTISTS.reduce((s, a) => s + a.paintings.length, 0);
  let errors = 0;
  if (PLACEHOLDERS) {
    status.textContent = 'Developer mode: showing labelled placeholders instead of images.';
  } else {
    status.textContent = `Checking ${total} paintings on Wikimedia Commons…`;
    const res = await loadImages(ARTISTS, {
      onProgress: (n, t) => {
        bar.style.width = `${Math.round((n / t) * 100)}%`;
        status.textContent = `Checking free images on Wikimedia Commons… ${n} / ${t}`;
      }
    });
    images = res.images;
    errors = res.errors;
  }
  prepareWorks();
  const shown = Object.values(works).reduce((s, l) => s + l.length, 0);
  const rooms = available.size - 1;
  bar.style.width = '100%';
  if (!shown) {
    status.innerHTML = `Could not reach Wikimedia Commons, so no paintings can be shown. Check your connection and <a href="#" id="retry">try again</a>.`;
    $('#retry').addEventListener('click', (e) => {
      e.preventDefault();
      location.reload();
    });
  } else {
    status.textContent = `${shown} paintings by ${rooms} artists${errors ? ' (some images could not be checked — reload later to try again)' : ''}.`;
  }

  // timeline data
  timeline.setData(
    ARTISTS.filter((a) => available.has(a.id)).map((a) => {
      const ys = works[a.id].map((w) => Math.floor(w.painting.year));
      return { id: a.id, name: a.name, short: a.short, born: a.born, died: a.died, movement: a.movement, roots: a.roots, start: Math.min(...ys), end: Math.max(...ys) + 1, count: ys.length };
    }),
    INFLUENCES,
    CONTEMPORARIES
  );

  const hash = location.hash.replace('#', '');
  enterRoom(available.has(hash) ? hash : 'lobby');
  $('#roomcard').classList.remove('show');
  btn.disabled = false;
  btn.textContent = hash && available.has(hash) && hash !== 'lobby' ? `Enter ${artistById[hash].short}'s room` : 'Enter the museum';
  btn.addEventListener('click', () => {
    intro.classList.remove('open', 'help');
    modalClosed();
    showRoomCard(null);
  });
  document.body.classList.add('ready');
  requestAnimationFrame(frame);
  if (params.has('debug')) window.__museum = { go, enterRoom, controls, camera, works, images, openPainting, openTimeline, openDoor, linksFor, room: () => room };
}

start();
