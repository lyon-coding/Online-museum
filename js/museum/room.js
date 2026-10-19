// Builds one gallery room: walls with doorways, floor, ceiling and skylight,
// framed paintings with spotlights, wall texts, doors to related artists and props.
import * as THREE from 'three';
import {
  floorTexture,
  wallTexture,
  textPanel,
  wallLettering,
  doorSign,
  portalTexture,
  plaqueTexture,
  placeholderTexture,
  skylightTexture,
  isDark,
  shade,
  SERIF,
  SANS
} from './textures.js';
import { buildProps } from './props.js';

export const EYE = 1.65;
const H = 5.4; // ceiling height
const T = 0.3; // wall thickness
const DW = 2.2; // door width
const DH = 3.1; // door height
const DOOR_PITCH = 3.3;
const SLOT = 3.5; // wall space per painting
const MARGIN = 1.4; // corner margin
const SIDE_DOOR_HALF = 1.9;
const VEST = 1.6; // depth of the passage behind a door

const std = (color, roughness = 0.85, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness, ...extra });

function box(w, h, d, mat) {
  return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
}

/**
 * A wall in local space: runs along x from -L/2..L/2, inner face at z=0 facing +z,
 * thickness behind it (negative z). Openings: [{c, w, h}].
 */
function buildWall(L, openings, mat, trimMat, baseMat) {
  const g = new THREE.Group();
  const ops = openings.slice().sort((a, b) => a.c - b.c);
  let x = -L / 2;
  const seg = (x0, x1, y0, y1) => {
    if (x1 - x0 < 0.001 || y1 - y0 < 0.001) return;
    const m = box(x1 - x0, y1 - y0, T, mat);
    m.position.set((x0 + x1) / 2, (y0 + y1) / 2, -T / 2);
    g.add(m);
  };
  const base = (x0, x1) => {
    if (x1 - x0 < 0.01) return;
    const m = box(x1 - x0, 0.16, 0.03, baseMat);
    m.position.set((x0 + x1) / 2, 0.08, 0.015);
    g.add(m);
  };
  let prevEnd = -L / 2;
  for (const o of ops) {
    const a = o.c - o.w / 2;
    const b = o.c + o.w / 2;
    seg(x, a, 0, H);
    base(prevEnd, a - 0.12);
    seg(a, b, o.h, H);
    // architrave around the opening
    const t = 0.12;
    const l = box(t, o.h + t, 0.05, trimMat);
    l.position.set(a - t / 2, (o.h + t) / 2, 0.025);
    const r = l.clone();
    r.position.x = b + t / 2;
    const top = box(o.w + 2 * t, t, 0.05, trimMat);
    top.position.set(o.c, o.h + t / 2, 0.025);
    g.add(l, r, top);
    x = b;
    prevEnd = b + 0.12;
  }
  seg(x, L / 2, 0, H);
  base(prevEnd, L / 2);
  // crown moulding
  const crown = box(L, 0.18, 0.06, baseMat);
  crown.position.set(0, H - 0.09, 0.03);
  g.add(crown);
  return g;
}

// Short passage behind a doorway, ending in a glowing panel naming the next room.
function buildVestibule(link, floorMat) {
  const g = new THREE.Group();
  const col = link.wall || '#cccccc';
  const wallMat = std(shade(col, -0.05), 0.9);
  const ceil = std('#f2f0eb', 0.9);
  const f = new THREE.Mesh(new THREE.PlaneGeometry(DW, VEST + T), floorMat);
  f.rotation.x = -Math.PI / 2;
  f.position.set(0, 0.002, -(VEST + T) / 2);
  g.add(f);
  for (const s of [-1, 1]) {
    const w = new THREE.Mesh(new THREE.PlaneGeometry(VEST, DH), wallMat);
    w.rotation.y = -s * Math.PI / 2;
    w.position.set((s * DW) / 2, DH / 2, -T - VEST / 2);
    g.add(w);
  }
  const c = new THREE.Mesh(new THREE.PlaneGeometry(DW, VEST), ceil);
  c.rotation.x = Math.PI / 2;
  c.position.set(0, DH, -T - VEST / 2);
  g.add(c);
  const portal = new THREE.Mesh(
    new THREE.PlaneGeometry(DW, DH),
    new THREE.MeshBasicMaterial({ map: portalTexture({ name: link.name, color: link.color, wall: col }), toneMapped: false })
  );
  portal.position.set(0, DH / 2, -T - VEST);
  portal.userData.action = { type: 'door', link };
  g.add(portal);
  return { group: g, portal };
}

function frameMaterials(style) {
  switch (style) {
    case 'gilt':
      return { b: 0.13, d: 0.09, outer: std('#b48a3c', 0.32, { metalness: 0.9 }), inner: std('#7a5a26', 0.4, { metalness: 0.8 }) };
    case 'wood':
      return { b: 0.09, d: 0.07, outer: std('#4a3020', 0.5), inner: std('#2c1c12', 0.6) };
    case 'black':
      return { b: 0.045, d: 0.06, outer: std('#141414', 0.45), inner: std('#141414', 0.5) };
    case 'white':
      return { b: 0.06, d: 0.06, outer: std('#f1eee8', 0.5), inner: std('#e2ded6', 0.6) };
    default:
      return { b: 0, d: 0.04, outer: std('#efeee9', 0.8), inner: null };
  }
}

function buildFrame(w, h, style) {
  const g = new THREE.Group();
  const f = frameMaterials(style);
  if (f.b === 0) {
    // stretched canvas without frame
    const c = box(w, h, f.d, f.outer);
    c.position.z = f.d / 2 - 0.005;
    g.add(c);
    return { group: g, depth: f.d };
  }
  const W = w + 2 * f.b;
  const Hh = h + 2 * f.b;
  const top = box(W, f.b, f.d, f.outer);
  top.position.set(0, h / 2 + f.b / 2, f.d / 2);
  const bot = top.clone();
  bot.position.y = -top.position.y;
  const left = box(f.b, h, f.d, f.outer);
  left.position.set(-w / 2 - f.b / 2, 0, f.d / 2);
  const right = left.clone();
  right.position.x = -left.position.x;
  g.add(top, bot, left, right);
  if (style === 'gilt') {
    // inner lip and a fine outer bead
    const lip = 0.025;
    const t2 = box(w + lip * 2, lip, f.d * 0.6, f.inner);
    t2.position.set(0, h / 2 + lip / 2, f.d * 0.3);
    const b2 = t2.clone();
    b2.position.y = -t2.position.y;
    const l2 = box(lip, h, f.d * 0.6, f.inner);
    l2.position.set(-w / 2 - lip / 2, 0, f.d * 0.3);
    const r2 = l2.clone();
    r2.position.x = -l2.position.x;
    g.add(t2, b2, l2, r2);
    const bead = box(W + 0.02, Hh + 0.02, 0.02, f.inner);
    bead.position.z = 0.01;
    g.add(bead);
  }
  const back = box(w, h, 0.02, std('#222', 0.9));
  back.position.z = 0.01;
  g.add(back);
  return { group: g, depth: f.d };
}

function paintingSize(aspect) {
  const A = 2.6;
  let w = Math.sqrt(A * aspect);
  let h = w / aspect;
  if (w > 2.4) {
    w = 2.4;
    h = w / aspect;
  }
  if (h > 1.9) {
    h = 1.9;
    w = h * aspect;
  }
  return { w, h };
}

function doorPositions(k) {
  return Array.from({ length: k }, (_, i) => (i - (k - 1) / 2) * DOOR_PITCH);
}

// Movement chain chart for the entrance hall.
function movementChart(movements, width, height) {
  const ppm = 300;
  const Wp = Math.round(width * ppm);
  const Hp = Math.round(height * ppm);
  const c = document.createElement('canvas');
  c.width = Wp;
  c.height = Hp;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#211d1a';
  ctx.fillRect(0, 0, Wp, Hp);
  const pad = Wp * 0.05;
  ctx.fillStyle = '#c9a96e';
  ctx.font = `600 ${Math.round(Wp * 0.018)}px ${SANS}`;
  ctx.fillText('THE ROAD FROM 1850 TO 1930', pad, pad + Wp * 0.015);
  ctx.fillStyle = '#f3ede2';
  ctx.font = `600 ${Math.round(Wp * 0.045)}px ${SERIF}`;
  ctx.fillText('One movement grows out of another', pad, pad + Wp * 0.07);
  const y0 = pad + Wp * 0.11;
  const y1 = Hp - pad * 1.2;
  const x0 = pad + Wp * 0.2;
  const x1 = Wp - pad;
  const yr0 = 1845;
  const yr1 = 1935;
  const X = (y) => x0 + ((y - yr0) / (yr1 - yr0)) * (x1 - x0);
  const lane = (y1 - y0) / movements.length;
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 2;
  ctx.font = `500 ${Math.round(Wp * 0.014)}px ${SANS}`;
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  for (let y = 1850; y <= 1930; y += 10) {
    ctx.beginPath();
    ctx.moveTo(X(y), y0);
    ctx.lineTo(X(y), y1);
    ctx.stroke();
    ctx.fillText(String(y), X(y) - Wp * 0.015, y1 + Wp * 0.025);
  }
  movements.forEach((m, i) => {
    const y = y0 + i * lane + lane * 0.15;
    ctx.fillStyle = m.color;
    const r = lane * 0.35;
    const xa = X(m.start);
    const xb = X(Math.min(m.end, 1932));
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(xa, y, xb - xa, lane * 0.7, r) : ctx.rect(xa, y, xb - xa, lane * 0.7);
    ctx.fill();
    ctx.fillStyle = '#f3ede2';
    ctx.font = `600 ${Math.round(lane * 0.32)}px ${SERIF}`;
    ctx.textAlign = 'right';
    ctx.fillText(m.short, x0 - Wp * 0.015, y + lane * 0.48);
    ctx.textAlign = 'left';
    if (i > 0) {
      const prev = movements[i - 1];
      ctx.strokeStyle = 'rgba(255,255,255,0.55)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      const px = X(Math.max(prev.start + 8, m.start - 4));
      ctx.moveTo(px, y - lane * 0.3 + lane * 0.0);
      ctx.lineTo(X(m.start) + 6, y + lane * 0.3);
      ctx.stroke();
    }
  });
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/**
 * @param opts.artist      artist (or lobby) record
 * @param opts.works       [{painting, info, index}] chronological
 * @param opts.links       {back:[], front:[], left:[], right:[]} each {id, name, years, kind, text, color, wall}
 * @param opts.movement    movement record (or null)
 * @param opts.movements   all movements (lobby chart)
 * @param opts.getTexture  (info) => Promise<Texture>
 */
export function buildRoom(opts) {
  const { artist, works, links, movement, movements } = opts;
  const style = artist.room;
  const isLobby = artist.id === 'lobby';
  const group = new THREE.Group();
  const interactives = [];
  const colliders = [];
  const animate = [];
  const lights = [];

  // ── dimensions ──
  const n = works.length;
  const s = Math.max(1, Math.ceil(n / 2));
  const hasSide = links.left.length > 0 || links.right.length > 0;
  let D;
  let kb = s;
  if (hasSide) {
    kb = Math.ceil(s / 2);
    D = 2 * (MARGIN + SIDE_DOOR_HALF + kb * SLOT);
  } else D = s * SLOT + 2 * MARGIN;
  D = Math.max(isLobby ? 18 : 13, D);
  const maxDoors = Math.max(links.back.length, links.front.length);
  const W = Math.max(isLobby ? 15 : 11.5, maxDoors * DOOR_PITCH + 6);
  const hw = W / 2;
  const hd = D / 2;

  // ── materials ──
  const wallMat = std(style.wall, 0.92, { map: wallTexture(style.wall) });
  const dark = isDark(style.wall);
  const trimMat = std(dark ? shade(style.wall, -0.1) : '#f4f1ea', 0.6);
  const baseMat = std(dark ? shade(style.wall, -0.15) : shade(style.wall, -0.25), 0.6);
  const fl = floorTexture(style.floor);
  const floorMap = fl.map.clone();
  floorMap.needsUpdate = true;
  floorMap.repeat.set(W / fl.tile, D / fl.tile);
  const floorMat = std('#ffffff', fl.roughness, { map: floorMap, envMapIntensity: 0.6 });

  // ── floor & ceiling ──
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.userData.action = { type: 'floor' };
  group.add(floor);
  interactives.push(floor);

  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(W, D), std('#f3f1ec', 0.95));
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = H;
  group.add(ceiling);
  const skyColor = style.sky || '#fffaf0';
  const cw = Math.max(2, W * 0.42);
  const cd = Math.max(2, D * 0.55);
  const sky = new THREE.Mesh(new THREE.PlaneGeometry(cw, cd), new THREE.MeshBasicMaterial({ map: skylightTexture(skyColor), color: '#d9d5cc' }));
  sky.rotation.x = Math.PI / 2;
  sky.position.y = H - 0.01;
  group.add(sky);
  // coffer around the skylight
  const cofferMat = std('#e9e6df', 0.9);
  for (const [x, z, w, d] of [[0, cd / 2 + 0.1, cw + 0.4, 0.2], [0, -cd / 2 - 0.1, cw + 0.4, 0.2], [cw / 2 + 0.1, 0, 0.2, cd], [-cw / 2 - 0.1, 0, 0.2, cd]]) {
    const m = box(w, 0.35, d, cofferMat);
    m.position.set(x, H - 0.175, z);
    group.add(m);
  }

  // ── lights ──
  const wallL = new THREE.Color(style.wall).getHSL({}).l;
  const bright = wallL > 0.75;
  const hemi = new THREE.HemisphereLight(skyColor, shade(style.wall, -0.2), bright ? 0.45 : wallL < 0.3 ? 1.5 : 0.8);
  group.add(hemi);
  for (const z of [-D / 4, D / 4]) {
    const p = new THREE.PointLight(style.light, bright ? 4 : wallL < 0.3 ? 14 : 8, 14, 1.6);
    p.position.set(0, H - 0.8, z);
    group.add(p);
  }

  // ── doors ──
  const doors = [];
  const walls = { back: [], front: [], left: [], right: [] };
  const signDark = dark;

  // place: function(wallName, localX) -> world transform
  const wallXf = {
    back: { pos: [0, 0, hd], rot: Math.PI, toWorld: (lx) => [-lx, hd], len: W },
    front: { pos: [0, 0, -hd], rot: 0, toWorld: (lx) => [lx, -hd], len: W },
    left: { pos: [-hw, 0, 0], rot: Math.PI / 2, toWorld: (lx) => [-hw, -lx], len: D },
    right: { pos: [hw, 0, 0], rot: -Math.PI / 2, toWorld: (lx) => [hw, lx], len: D }
  };

  const openings = { back: [], front: [], left: [], right: [] };
  const addDoorsOnWall = (wall, list, positions) => {
    list.forEach((link, i) => {
      const lx = positions[i];
      openings[wall].push({ c: lx, w: DW, h: DH, link });
    });
  };
  addDoorsOnWall('back', links.back, doorPositions(links.back.length));
  addDoorsOnWall('front', links.front, doorPositions(links.front.length));
  // side doors in the middle of the long walls
  addDoorsOnWall('left', links.left, links.left.length > 1 ? [-1.25, 1.25] : [0]);
  addDoorsOnWall('right', links.right, links.right.length > 1 ? [-1.25, 1.25] : [0]);

  const wallGroups = {};
  for (const name of ['back', 'front', 'left', 'right']) {
    const xf = wallXf[name];
    const wg = buildWall(xf.len, openings[name], wallMat, trimMat, baseMat);
    wg.position.set(...xf.pos);
    wg.rotation.y = xf.rot;
    group.add(wg);
    wallGroups[name] = wg;
    for (const o of openings[name]) {
      const v = buildVestibule(o.link, floorMat);
      v.group.position.x = o.c;
      wg.add(v.group);
      interactives.push(v.portal);
      // invisible click target filling the opening
      const hit = new THREE.Mesh(new THREE.PlaneGeometry(DW, DH), new THREE.MeshBasicMaterial({ visible: false }));
      hit.position.set(o.c, DH / 2, -0.05);
      hit.userData.action = { type: 'door', link: o.link };
      wg.add(hit);
      interactives.push(hit);
      // sign above
      const sign = new THREE.Mesh(
        new THREE.PlaneGeometry(1.7, 0.49),
        std('#ffffff', 0.6, { map: doorSign({ kind: o.link.kind, name: o.link.name, years: o.link.years, color: o.link.color, dark: signDark }) })
      );
      sign.position.set(o.c, DH + 0.42, 0.06);
      sign.userData.action = { type: 'door', link: o.link };
      wg.add(sign);
      interactives.push(sign);
      const [wx, wz] = xf.toWorld(o.c);
      doors.push({ wall: name, x: wx, z: wz, link: o.link });
      // world-space opening range along the wall for collision
      const a = o.c - DW / 2;
      const b = o.c + DW / 2;
      if (name === 'back') walls.back.push({ a: -b, b: -a, link: o.link });
      if (name === 'front') walls.front.push({ a, b, link: o.link });
      if (name === 'left') walls.left.push({ a: -b, b: -a, link: o.link });
      if (name === 'right') walls.right.push({ a, b, link: o.link });
    }
  }

  // Helper: put a mesh flat on a wall at local x/y.
  const onWall = (wall, mesh, lx, y, off = 0.02) => {
    mesh.position.set(lx, y, off);
    wallGroups[wall].add(mesh);
  };

  const panelOpts = { bg: dark ? shade(style.wall, -0.08) : '#f7f3ec', accent: movement ? movement.color : '#9a7b47' };
  const panel = (wall, lx, pw, ph, content, action) => {
    const tex = textPanel({ ...panelOpts, ...content, width: pw, height: ph });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(pw, ph), std('#ffffff', 0.85, { map: tex }));
    onWall(wall, m, lx, 1.75);
    const back = box(pw + 0.06, ph + 0.06, 0.02, std(dark ? '#111' : '#d8d2c7', 0.8));
    onWall(wall, back, lx, 1.75, 0.008);
    m.userData.action = action || { type: 'info' };
    interactives.push(m);
    return m;
  };

  // Panels beside the doors on the front and back walls.
  const sidePanels = (wall, k) => {
    const groupHalf = k ? ((k - 1) / 2) * DOOR_PITCH + DW / 2 + 0.15 : 0;
    const space = hw - groupHalf;
    const pw = Math.min(2.9, space - 0.7);
    if (pw < 1.5) return [];
    const c = k ? groupHalf + space / 2 : W / 4;
    return [-c, c].map((x) => ({ x, pw }));
  };

  if (isLobby) {
    onWall('front', new THREE.Mesh(new THREE.PlaneGeometry(W * 0.86, 1.4), new THREE.MeshBasicMaterial({ map: wallLettering({ title: 'From Impression to Abstraction', subtitle: 'A walk through modern painting · 1860–1930', color: '#2a2520', accent: '#9a7b47', width: W * 0.86, height: 1.4 }), transparent: true })), 0, H - 0.95);
    const fp = sidePanels('front', links.front.length);
    if (fp.length) {
      panel('front', fp[0].x, fp[0].pw, 1.9, {
        kicker: 'Begin here',
        title: 'The visit starts with Manet',
        body: ['Walk through the door ahead to enter the 1860s. Each room belongs to one artist, with the paintings hung in chronological order — follow the numbers on the labels.', 'Open the timeline at any moment to jump to another room.']
      });
      panel('front', fp[1].x, fp[1].pw, 1.9, {
        kicker: 'Images',
        title: 'Free images only',
        body: ['Every painting is a public-domain or freely licensed image from Wikimedia Commons; its source and licence appear when you open it.', 'Works without a free image on Commons are simply not shown.']
      });
    }
    panel('left', 0, 4.4, 2.6, {
      kicker: 'The question',
      title: 'How does one movement become another?',
      body: [
        'Between 1860 and 1930 painting changed more than in the four centuries before. Each new movement grew out of the one before it — by extending it, or by rebelling against it.',
        'In every room, the doors behind you lead back to the artist\'s roots; the doors ahead lead to the painters who followed. Side doors in the middle of the room lead to contemporaries working in the same period and movement.'
      ]
    });
    const chart = new THREE.Mesh(new THREE.PlaneGeometry(5.6, 3.0), std('#ffffff', 0.8, { map: movementChart(movements, 5.6, 3.0) }));
    onWall('right', chart, 0, 2.0);
    chart.userData.action = { type: 'timeline' };
    interactives.push(chart);
    panel('back', -W / 4, 3.2, 2.1, {
      kicker: 'How to visit',
      title: 'Walk, look, follow the doors',
      body: [
        'Computer: drag to look around, W A S D or arrow keys to walk, click a painting to enlarge it, click the floor to walk there.',
        'Phone or tablet: drag to look, use the joystick (bottom left) or tap the floor to walk, tap a painting to enlarge it.',
        'Press T or the Timeline button to jump anywhere.'
      ]
    });
    panel('back', W / 4, 3.2, 2.1, {
      kicker: 'Seven steps',
      title: 'From Realism to Abstraction',
      body: movements.map((m) => `${m.short}: ${m.start}–${m.end}`)
    });
  } else {
    // Front wall (seen when entering): name of the artist + what came next.
    const title = wallLettering({
      title: artist.name,
      subtitle: `${artist.born}–${artist.died} · ${movement ? movement.short : ''}`,
      color: dark ? '#f3ede2' : '#2a2520',
      accent: movement ? movement.color : '#9a7b47',
      width: W * 0.86,
      height: 1.3
    });
    onWall('front', new THREE.Mesh(new THREE.PlaneGeometry(W * 0.86, 1.3), new THREE.MeshBasicMaterial({ map: title, transparent: true })), 0, H - 0.95);
    const fp = sidePanels('front', links.front.length);
    if (fp.length) {
      panel('front', fp[0].x, fp[0].pw, 1.9, { kicker: 'The artist', title: artist.name, subtitle: `${artist.nationality}, ${artist.born}–${artist.died}`, body: artist.bio });
      panel('front', fp[1].x, fp[1].pw, 1.9, links.front.length
        ? { kicker: 'Legacy', title: 'What it became', body: movement ? movement.became : '' }
        : { kicker: 'End of this path', title: 'Where the road goes on', body: [movement ? movement.became : '', 'Open the timeline to continue the visit elsewhere.'] },
        links.front.length ? { type: 'info' } : { type: 'timeline' });
    }
    // Back wall: roots.
    onWall('back', new THREE.Mesh(new THREE.PlaneGeometry(W * 0.6, 1.0), new THREE.MeshBasicMaterial({ map: wallLettering({ title: 'Roots', subtitle: 'where this art came from', color: dark ? '#f3ede2' : '#2a2520', accent: movement ? movement.color : '#9a7b47', width: W * 0.6, height: 1.0 }), transparent: true })), 0, H - 0.85);
    const bp = sidePanels('back', links.back.length);
    if (bp.length) {
      panel('back', bp[0].x, bp[0].pw, 1.9, { kicker: 'Influences', title: `${artist.short}'s sources`, body: artist.roots });
      if (movement) panel('back', bp[1].x, bp[1].pw, 1.9, { kicker: 'The movement', title: movement.name, subtitle: `${movement.start}–${movement.end}`, body: movement.roots });
    }
  }

  // ── paintings ──
  const slotZ = [];
  {
    const intervals = hasSide
      ? [[hd - MARGIN, SIDE_DOOR_HALF, kb], [-SIDE_DOOR_HALF, -hd + MARGIN, s - kb]]
      : [[hd - MARGIN, -hd + MARGIN, s]];
    for (const [start, end, k] of intervals) {
      const L = start - end;
      for (let i = 0; i < k; i++) slotZ.push(start - (L - k * SLOT) / 2 - SLOT / 2 - i * SLOT);
    }
  }
  const paintingMeshes = [];
  works.forEach((wk, k) => {
    const slot = Math.floor(k / 2);
    const side = k % 2 === 0 ? 'left' : 'right';
    const z = slotZ[slot];
    const aspect = wk.info && wk.info.w && wk.info.h ? wk.info.w / wk.info.h : 1.25;
    const { w, h } = paintingSize(aspect);
    const pg = new THREE.Group();
    const frame = buildFrame(w, h, style.frame);
    pg.add(frame.group);
    const mat = new THREE.MeshStandardMaterial({
      map: placeholderTexture({ title: wk.painting.title, color: shade(style.wall, dark ? 0.15 : -0.15), label: opts.placeholderLabel || '' }),
      roughness: 0.75,
      emissive: '#ffffff',
      emissiveIntensity: 0.22
    });
    mat.emissiveMap = mat.map;
    const canvasMesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
    canvasMesh.position.z = style.frame === 'none' ? frame.depth + 0.003 : frame.depth * 0.5 + 0.004;
    canvasMesh.userData.action = { type: 'painting', index: k };
    pg.add(canvasMesh);
    interactives.push(canvasMesh);
    paintingMeshes.push(canvasMesh);
    if (wk.info && opts.getTexture) {
      opts.getTexture(wk.info).then((tex) => {
        if (!tex) return;
        const old = mat.map;
        mat.map = tex;
        mat.emissiveMap = tex;
        mat.needsUpdate = true;
        if (old && !old.userData.keep) old.dispose();
      });
    }
    // label to the right of the painting
    const pl = new THREE.Mesh(
      new THREE.PlaneGeometry(0.5, 0.21),
      std('#ffffff', 0.7, { map: plaqueTexture({ index: k + 1, title: wk.painting.title, date: wk.painting.date, dark }) })
    );
    pl.position.set(w / 2 + 0.2 + 0.25 + (style.frame === 'gilt' ? 0.1 : 0), 1.45 - 1.85, 0.012);
    pl.userData.action = { type: 'painting', index: k };
    pg.add(pl);
    interactives.push(pl);

    // the painting hangs on a side wall, facing into the room
    if (side === 'left') {
      pg.position.set(-hw + 0.01, 1.85, z);
      pg.rotation.y = Math.PI / 2;
    } else {
      pg.position.set(hw - 0.01, 1.85, z);
      pg.rotation.y = -Math.PI / 2;
    }
    group.add(pg);

    // spotlight from the ceiling
    const nx = side === 'left' ? 1 : -1;
    const spot = new THREE.SpotLight(style.light, bright ? 32 : 50, 12, 0.5, 0.65, 1.6);
    spot.position.set(pg.position.x + nx * 2.2, H - 0.25, z);
    spot.target.position.set(pg.position.x, 1.75, z);
    const dist = spot.position.distanceTo(spot.target.position);
    spot.angle = Math.min(0.75, Math.atan((Math.max(w, h) / 2 + 0.45) / dist));
    group.add(spot, spot.target);
    lights.push(spot);
    // small light fixture on the ceiling track
    const fix = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.22, 12), std('#1d1d1d', 0.4, { metalness: 0.6 }));
    fix.position.copy(spot.position);
    fix.lookAt(spot.target.position);
    fix.rotateX(Math.PI / 2);
    group.add(fix);
  });
  // On a long wall without a side door, a room guide listing the works in order.
  if (!isLobby && hasSide && works.length && (!links.left.length || !links.right.length)) {
    const wall = links.left.length ? 'right' : 'left';
    panel(wall, 0, 2.5, 2.0, {
      kicker: 'In this room',
      title: 'Chronology',
      body: works.map((w, i) => `${i + 1}.  ${w.painting.date} — ${w.painting.title}`)
    });
  }

  // ceiling tracks for the lights
  if (works.length) {
    for (const sx of [-1, 1]) {
      const tr = box(0.05, 0.04, D - 2, std('#1d1d1d', 0.5, { metalness: 0.5 }));
      tr.position.set(sx * (hw - 2.2), H - 0.06, 0);
      group.add(tr);
    }
  }

  // ── props ──
  const pctx = {
    group,
    W,
    D,
    H,
    animate,
    movementColors: (movements || []).map((m) => m.color),
    addCircle: (x, z, r) => colliders.push({ type: 'circle', x, z, r }),
    addBox: (x, z, hx, hz) => colliders.push({ type: 'box', x, z, hx, hz })
  };
  buildProps(pctx, style.props || []);

  // ── collision & spawn ──
  const R = 0.35;
  const PASS = 0.45; // how far into a passage before switching room
  function collide(p) {
    let door = null;
    const check = (coordAlong, coordAcross, limit, list, sign, setAcross, setAlong) => {
      // sign=+1: wall at +limit, sign=-1: wall at -limit (on the "across" axis)
      const depth = sign * coordAcross - (limit - R);
      if (depth <= 0) return;
      const o = list.find((op) => coordAlong > op.a && coordAlong < op.b);
      const inside = sign * coordAcross > limit; // already past the wall plane
      if (o && (inside || (coordAlong > o.a + R && coordAlong < o.b - R))) {
        setAlong(Math.min(o.b - R, Math.max(o.a + R, coordAlong)));
        if (sign * coordAcross > limit + PASS) door = o.link;
        if (sign * coordAcross > limit + VEST) setAcross(sign * (limit + VEST));
      } else setAcross(sign * (limit - R));
    };
    check(p.x, p.z, hd, walls.back, 1, (v) => (p.z = v), (v) => (p.x = v));
    check(p.x, p.z, hd, walls.front, -1, (v) => (p.z = v), (v) => (p.x = v));
    check(p.z, p.x, hw, walls.left, -1, (v) => (p.x = v), (v) => (p.z = v));
    check(p.z, p.x, hw, walls.right, 1, (v) => (p.x = v), (v) => (p.z = v));
    for (const c of colliders) {
      if (c.type === 'circle') {
        const dx = p.x - c.x;
        const dz = p.z - c.z;
        const d = Math.hypot(dx, dz);
        const min = c.r + R;
        if (d < min && d > 1e-6) {
          p.x = c.x + (dx / d) * min;
          p.z = c.z + (dz / d) * min;
        }
      } else {
        const dx = p.x - c.x;
        const dz = p.z - c.z;
        const ox = c.hx + R - Math.abs(dx);
        const oz = c.hz + R - Math.abs(dz);
        if (ox > 0 && oz > 0) {
          if (ox < oz) p.x += Math.sign(dx || 1) * ox;
          else p.z += Math.sign(dz || 1) * oz;
        }
      }
    }
    return door;
  }

  function spawn(fromId) {
    const d = fromId && doors.find((x) => x.link.id === fromId);
    if (!d) return { x: 0, z: hd - 1.8, yaw: 0 };
    const inset = 1.5;
    switch (d.wall) {
      case 'back':
        return { x: d.x, z: hd - inset, yaw: 0 };
      case 'front':
        return { x: d.x, z: -hd + inset, yaw: Math.PI };
      case 'left':
        return { x: -hw + inset, z: d.z, yaw: -Math.PI / 2 };
      default:
        return { x: hw - inset, z: d.z, yaw: Math.PI / 2 };
    }
  }

  function dispose() {
    group.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      const mats = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : [];
      for (const m of mats) {
        for (const key of ['map', 'emissiveMap']) {
          const t = m[key];
          if (t && !t.userData.keep && !t.userData.shared) t.dispose();
        }
        m.dispose();
      }
    });
  }

  return { group, interactives, paintingMeshes, collide, spawn, dispose, animate, W, D, H, doors, isLobby };
}
