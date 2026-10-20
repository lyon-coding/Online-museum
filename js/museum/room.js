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
  aoGradient,
  canvasWeave,
  ornamentBump,
  wainscotTextures,
  ventTexture,
  dustSprite,
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
function buildWall(L, openings, mat, trimMat, baseMat, deco = {}) {
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
    // a thin moulded cap on the skirting board
    const cap = box(x1 - x0, 0.025, 0.04, baseMat);
    cap.position.set((x0 + x1) / 2, 0.165, 0.02);
    g.add(cap);
    if (deco.wain) {
      // raised panels below a chair rail (classic rooms)
      const len = x1 - x0;
      const map = deco.wain.map.clone();
      const bump = deco.wain.bump.clone();
      for (const t of [map, bump]) {
        t.repeat.set(Math.max(1, Math.round(len / deco.wain.panelWidth)), 1);
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.needsUpdate = true;
      }
      const panel = new THREE.Mesh(new THREE.PlaneGeometry(len, 0.76), new THREE.MeshStandardMaterial({ map, bumpMap: bump, bumpScale: 1.2, roughness: 0.7 }));
      panel.position.set((x0 + x1) / 2, 0.18 + 0.38, 0.006);
      g.add(panel);
      const rail = box(len, 0.05, 0.045, deco.railMat);
      rail.position.set((x0 + x1) / 2, 0.96, 0.022);
      g.add(rail);
    }
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
  // two-step cornice
  const crown = box(L, 0.18, 0.06, baseMat);
  crown.position.set(0, H - 0.09, 0.03);
  const crown2 = box(L, 0.07, 0.035, baseMat);
  crown2.position.set(0, H - 0.215, 0.018);
  g.add(crown, crown2);
  if (deco.pictureRail) {
    const pr = box(L, 0.045, 0.035, deco.railMat);
    pr.position.set(0, H - 0.6, 0.018);
    g.add(pr);
  }
  return g;
}

// Short passage behind a doorway, ending in a glowing panel naming the next room.
function buildVestibule(link, floorMat, getTexture) {
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
  const preview = link.preview && !link.preview.placeholder ? link.preview : null;
  const portal = new THREE.Mesh(
    new THREE.PlaneGeometry(DW, DH),
    new THREE.MeshBasicMaterial({ map: portalTexture({ name: link.name, color: link.color, wall: col, low: !!link.preview }), toneMapped: false })
  );
  portal.position.set(0, DH / 2, -T - VEST);
  portal.userData.action = { type: 'door', link };
  g.add(portal);
  if (link.preview) {
    // A glimpse of the series: its first painting hangs at the end of the passage.
    const aspect = link.preview.w && link.preview.h ? link.preview.w / link.preview.h : 1.25;
    let pw = DW - 0.6;
    let ph = pw / aspect;
    if (ph > DH * 0.55) {
      ph = DH * 0.55;
      pw = ph * aspect;
    }
    const cy = DH * 0.6;
    const frame = box(pw + 0.12, ph + 0.12, 0.04, std(shade(col, -0.35), 0.5));
    frame.position.set(0, cy, -T - VEST + 0.03);
    g.add(frame);
    const mat = new THREE.MeshBasicMaterial({ color: shade(col, -0.2) });
    const pic = new THREE.Mesh(new THREE.PlaneGeometry(pw, ph), mat);
    pic.position.set(0, cy, -T - VEST + 0.055);
    pic.userData.action = { type: 'door', link };
    g.add(pic);
    if (preview && getTexture) {
      getTexture(preview).then((tex) => {
        if (!tex) return;
        mat.map = tex;
        mat.color.set('#ffffff');
        mat.needsUpdate = true;
      });
    }
  }
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

function buildFrame(w, h, style, high = false) {
  const g = new THREE.Group();
  const f = frameMaterials(style);
  if (high && style === 'gilt') {
    // carved, chased-gold relief on the moulding
    f.outer.bumpMap = ornamentBump();
    f.outer.bumpScale = 2;
    f.inner.bumpMap = ornamentBump();
    f.inner.bumpScale = 1.5;
  }
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
  ctx.fillText(`THE ROAD FROM 1850 TO ${movements.length > 8 ? 1940 : 1930}`, pad, pad + Wp * 0.015);
  ctx.fillStyle = '#f3ede2';
  ctx.font = `600 ${Math.round(Wp * 0.045)}px ${SERIF}`;
  ctx.fillText('One movement grows out of another', pad, pad + Wp * 0.07);
  const y0 = pad + Wp * 0.11;
  const y1 = Hp - pad * 1.2;
  const x0 = pad + Wp * 0.2;
  const x1 = Wp - pad;
  const yr0 = 1845;
  const yr1 = movements.length > 8 ? 1948 : 1935;
  const X = (y) => x0 + ((y - yr0) / (yr1 - yr0)) * (x1 - x0);
  const lane = (y1 - y0) / movements.length;
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 2;
  ctx.font = `500 ${Math.round(Wp * 0.014)}px ${SANS}`;
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  for (let y = 1850; y <= yr1 - 5; y += 10) {
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
    const xb = X(Math.min(m.end, yr1 - 3));
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
  const isWing = !!artist.isWing;
  D = Math.max(isLobby ? 18 : isWing ? 11 : 13, D);
  const maxDoors = Math.max(links.back.length, links.front.length);
  const W = Math.max(isLobby ? 15 : isWing ? 10.5 : 11.5, maxDoors * DOOR_PITCH + 6);
  const hw = W / 2;
  const hd = D / 2;

  // ── materials ──
  const wallTex = wallTexture(style.wall);
  const wallMat = std(style.wall, 0.92, { map: wallTex, bumpMap: wallTex, bumpScale: 0.4 });
  const classic = isLobby || style.frame === 'gilt' || style.frame === 'wood';
  const dark = isDark(style.wall);
  const trimMat = std(dark ? shade(style.wall, -0.1) : '#f4f1ea', 0.6);
  const baseMat = std(dark ? shade(style.wall, -0.15) : shade(style.wall, -0.25), 0.6);
  const fl = floorTexture(style.floor);
  const floorMap = fl.map.clone();
  floorMap.needsUpdate = true;
  floorMap.repeat.set(W / fl.tile, D / fl.tile);
  const floorMat = std('#ffffff', fl.roughness, { map: floorMap, bumpMap: floorMap, bumpScale: 0.6, envMapIntensity: 0.6 });

  // ── floor & ceiling ──
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.userData.action = { type: 'floor' };
  group.add(floor);
  if (['parquet', 'herringbone', 'darkwood', 'marble', 'stone', 'terracotta'].includes(style.floor)) {
    // an inlaid border band running around the room
    const inlay = std(shade(style.floor === 'marble' || style.floor === 'stone' ? '#8f877a' : style.floor === 'terracotta' ? '#7a3b28' : '#3b2416', 0), 0.45);
    const inset = 0.55;
    const bw = 0.16;
    for (const [x, z, w, d] of [[0, hd - inset, W - 2 * inset + bw, bw], [0, -hd + inset, W - 2 * inset + bw, bw], [hw - inset, 0, bw, D - 2 * inset], [-hw + inset, 0, bw, D - 2 * inset]]) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), inlay);
      m.rotation.x = -Math.PI / 2;
      m.position.set(x, 0.002, z);
      m.userData.noShadow = true;
      m.receiveShadow = true;
      group.add(m);
    }
  }
  interactives.push(floor);

  // Ceiling with a recessed skylight well (the ceiling is built around the opening).
  const skyColor = style.sky || '#fffaf0';
  const cw = Math.max(2, W * 0.42);
  const cd = Math.max(2, D * 0.55);
  const WELL = 0.9;
  const ceilMat = std('#f3f1ec', 0.95);
  const ceilPart = (x, z, w, d) => {
    if (w <= 0 || d <= 0) return;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), ceilMat);
    m.rotation.x = Math.PI / 2;
    m.position.set(x, H, z);
    m.userData.noShadow = true;
    group.add(m);
  };
  ceilPart(0, (cd / 2 + hd) / 2, W, hd - cd / 2);
  ceilPart(0, -(cd / 2 + hd) / 2, W, hd - cd / 2);
  ceilPart((cw / 2 + hw) / 2, 0, hw - cw / 2, cd);
  ceilPart(-(cw / 2 + hw) / 2, 0, hw - cw / 2, cd);
  // the well's four inner walls
  const wellMat = std('#ece9e2', 0.95, { side: THREE.DoubleSide });
  for (const [x, z, w, ry] of [[0, cd / 2, cw, Math.PI], [0, -cd / 2, cw, 0], [cw / 2, 0, cd, -Math.PI / 2], [-cw / 2, 0, cd, Math.PI / 2]]) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, WELL), wellMat);
    m.position.set(x, H + WELL / 2, z);
    m.rotation.y = ry;
    m.userData.noShadow = true;
    group.add(m);
  }
  const sky = new THREE.Mesh(new THREE.PlaneGeometry(cw, cd), new THREE.MeshBasicMaterial({ map: skylightTexture(skyColor), color: '#e3dfd6' }));
  sky.rotation.x = Math.PI / 2;
  sky.position.y = H + WELL;
  sky.userData.noShadow = true;
  group.add(sky);
  // a moulded lip around the opening
  const cofferMat = std('#e9e6df', 0.9);
  for (const [x, z, w, d] of [[0, cd / 2 + 0.06, cw + 0.24, 0.12], [0, -cd / 2 - 0.06, cw + 0.24, 0.12], [cw / 2 + 0.06, 0, 0.12, cd], [-cw / 2 - 0.06, 0, 0.12, cd]]) {
    const m = box(w, 0.1, d, cofferMat);
    m.position.set(x, H - 0.05, z);
    m.userData.noShadow = true;
    group.add(m);
  }
  // smoke detectors on the ceiling
  for (const sz of [-1, 1]) {
    const det = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.04, 20), std('#f4f4f2', 0.5));
    det.position.set(cw / 2 + (hw - cw / 2) / 2, H - 0.02, sz * (cd / 2 + (hd - cd / 2) / 2));
    det.userData.noShadow = true;
    group.add(det);
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.008, 6, 4), new THREE.MeshBasicMaterial({ color: '#7cff7c' }));
    led.position.copy(det.position).add(new THREE.Vector3(0.04, -0.022, 0));
    group.add(led);
  }

  // ── lights ──
  const wallL = new THREE.Color(style.wall).getHSL({}).l;
  const bright = wallL > 0.75;
  const high = opts.quality === 'high';
  const hemiI = bright ? 0.45 : wallL < 0.3 ? 1.5 : 0.8;
  const hemi = new THREE.HemisphereLight(skyColor, shade(style.wall, -0.2), high ? hemiI * 0.75 : hemiI);
  group.add(hemi);
  if (high) {
    // daylight falling through the skylight, casting soft shadows
    const sun = new THREE.DirectionalLight(skyColor, bright ? 0.9 : 1.3);
    sun.position.set(cw * 0.3, H + 8, cd * 0.15);
    sun.target.position.set(0, 0, 0);
    sun.castShadow = true;
    const ext = Math.max(W, D) * 0.6;
    Object.assign(sun.shadow.camera, { left: -ext, right: ext, top: ext, bottom: -ext, near: 1, far: H + 20 });
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.03;
    sun.shadow.radius = 4;
    group.add(sun, sun.target);
    // faint shafts of light under the skylight
    // Soft volume: brightest when looking through a face, fading at face edges and toward the floor.
    const shaftMat = new THREE.ShaderMaterial({
      uniforms: { color: { value: new THREE.Color(skyColor) }, strength: { value: 0.06 } },
      vertexShader: `
        varying vec2 vUv; varying vec3 vN; varying vec3 vV;
        void main() {
          vUv = uv;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vN = normalize(normalMatrix * normal);
          vV = normalize(-mv.xyz);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        uniform vec3 color; uniform float strength;
        varying vec2 vUv; varying vec3 vN; varying vec3 vV;
        void main() {
          float facing = abs(dot(vN, vV));
          float edge = sin(3.14159 * vUv.x);
          float height = pow(smoothstep(0.25, 1.0, vUv.y), 2.0);
          float a = strength * facing * facing * edge * edge * height;
          gl_FragColor = vec4(color * a, 1.0);
        }`,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const shaft = new THREE.Mesh(new THREE.BoxGeometry(cw * 0.95, H, cd * 0.95, 1, 1, 1), [shaftMat]);
    // remove top/bottom faces so only the soft sides remain
    shaft.geometry.clearGroups();
    shaft.geometry.addGroup(0, 12, 0);
    shaft.geometry.addGroup(24, 12, 0);
    shaft.position.set(0, H / 2, 0);
    shaft.userData.noShadow = true;
    shaft.renderOrder = 2;
    group.add(shaft);
    // dust drifting in the light
    const N = 260;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (Math.random() - 0.5) * cw;
      pos[i * 3 + 1] = 0.4 + Math.random() * (H - 0.6);
      pos[i * 3 + 2] = (Math.random() - 0.5) * cd;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const dust = new THREE.Points(
      dustGeo,
      new THREE.PointsMaterial({ map: dustSprite(), size: 0.016, color: '#fff6e0', transparent: true, opacity: 0.35, depthWrite: false, blending: THREE.AdditiveBlending })
    );
    dust.userData.noShadow = true;
    group.add(dust);
    animate.push((dt, t) => {
      const a = dustGeo.attributes.position.array;
      for (let i = 0; i < N; i++) {
        a[i * 3 + 1] -= dt * (0.015 + (i % 7) * 0.003);
        a[i * 3] += Math.sin(t * 0.3 + i) * dt * 0.02;
        if (a[i * 3 + 1] < 0.3) a[i * 3 + 1] = H - 0.3;
      }
      dustGeo.attributes.position.needsUpdate = true;
    });
  }
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

  // Painting slots along the long walls (from the entrance towards the far wall).
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
  // Works alternate left/right; a series takes its slot as a doorway into its wing.
  const placement = works.map((wk, k) => ({ side: k % 2 === 0 ? 'left' : 'right', z: slotZ[Math.floor(k / 2)] }));

  const openings = { back: [], front: [], left: [], right: [] };
  works.forEach((wk, k) => {
    if (!wk.wing) return;
    const { side, z } = placement[k];
    openings[side].push({ c: side === 'left' ? -z : z, w: DW, h: DH, link: wk.wing });
  });
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
    const deco = classic
      ? { wain: wainscotTextures(shade(style.wall, dark ? 0.04 : -0.03)), railMat: trimMat, pictureRail: true }
      : {};
    const wg = buildWall(xf.len, openings[name], wallMat, trimMat, baseMat, deco);
    wg.position.set(...xf.pos);
    wg.rotation.y = xf.rot;
    group.add(wg);
    wallGroups[name] = wg;
    for (const o of openings[name]) {
      const v = buildVestibule(o.link, floorMat, opts.getTexture);
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
      // stone threshold under the doorway
      const sill = box(DW + 0.04, 0.014, T + 0.08, std('#cfc8ba', 0.5));
      sill.position.set(o.c, 0.007, -T / 2);
      wg.add(sill);
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

  // ── contact shading: soft dark gradients where walls meet floor, ceiling and each other ──
  {
    const ao = aoGradient();
    const aoMat = (opacity) =>
      new THREE.MeshBasicMaterial({ color: '#000', alphaMap: ao, transparent: true, opacity, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
    const floorAo = aoMat(dark ? 0.35 : 0.28);
    const ceilAo = aoMat(0.22);
    const cornerAo = aoMat(0.16);
    // A plane whose normal faces `n` and whose dark edge points along `d`.
    const strip = (mat, w, h, pos, n, d) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
      const z = new THREE.Vector3(...n);
      const y = new THREE.Vector3(...d);
      const x = new THREE.Vector3().crossVectors(y, z);
      m.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z));
      m.position.set(...pos);
      m.userData.noShadow = true;
      m.renderOrder = 1;
      group.add(m);
    };
    const fw = 0.75;
    const cwid = 0.6;
    for (const [len, axis, sign] of [[W, 'z', -1], [W, 'z', 1], [D, 'x', -1], [D, 'x', 1]]) {
      const d = axis === 'z' ? [0, 0, sign] : [sign, 0, 0];
      const off = (axis === 'z' ? hd : hw) - fw / 2;
      const offC = (axis === 'z' ? hd : hw) - cwid / 2;
      const at = (o, y) => (axis === 'z' ? [0, y, sign * o] : [sign * o, y, 0]);
      strip(floorAo, len, fw, at(off, 0.004), [0, 1, 0], d); // along the floor
      strip(ceilAo, len, cwid, at(offC, H - 0.003), [0, -1, 0], d); // along the ceiling
    }
    // vertical room corners
    for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      strip(cornerAo, H, 0.5, [sx * (hw - 0.003), H / 2, sz * (hd - 0.25)], [-sx, 0, 0], [0, 0, sz]);
      strip(cornerAo, H, 0.5, [sx * (hw - 0.25), H / 2, sz * (hd - 0.003)], [0, 0, -sz], [sx, 0, 0]);
    }
  }

  // ── small museum fixtures ──
  {
    const vent = new THREE.MeshStandardMaterial({ map: ventTexture(), roughness: 0.5, metalness: 0.3 });
    for (const sx of [-1, 1]) {
      const v = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.22), vent);
      v.position.set(sx * (hw - 0.9), 0.4, hd - 0.012);
      v.rotation.y = Math.PI;
      v.userData.noShadow = true;
      group.add(v);
    }
    if (opts.quality === 'high') {
      // a security camera in a far corner and a climate sensor on a wall
      const cam = new THREE.Group();
      const camMat = std('#e6e4df', 0.4);
      cam.add(box(0.1, 0.1, 0.06, camMat));
      const arm = box(0.03, 0.03, 0.18, camMat);
      arm.position.set(0, 0, 0.1);
      cam.add(arm);
      const body = box(0.09, 0.08, 0.22, camMat);
      body.position.set(0, -0.05, 0.22);
      body.rotation.x = 0.35;
      cam.add(body);
      const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.02, 16), std('#111', 0.2, { metalness: 0.5 }));
      lens.rotation.x = Math.PI / 2 + 0.35;
      lens.position.set(0, -0.09, 0.33);
      cam.add(lens);
      cam.position.set(-hw + 0.25, H - 0.45, -hd + 0.06);
      cam.rotation.y = Math.PI / 4;
      group.add(cam);
      const sensor = box(0.1, 0.14, 0.03, std('#f2f1ee', 0.5));
      sensor.position.set(hw - 0.016, 1.5, hd - 0.7);
      sensor.rotation.y = -Math.PI / 2;
      group.add(sensor);
      const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.06, 0.03), new THREE.MeshBasicMaterial({ color: '#9fd2c4' }));
      scr.position.set(hw - 0.033, 1.53, hd - 0.7);
      scr.rotation.y = -Math.PI / 2;
      group.add(scr);
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
      kicker: `${['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'][movements.length] || movements.length} steps`,
      title: `From ${movements[0].short} to ${movements[movements.length - 1].short}`,
      body: movements.map((m) => `${m.short}: ${m.start}–${m.end}`)
    });
  } else if (isWing) {
    const sr = artist.series;
    const title = wallLettering({
      title: sr.title,
      subtitle: `A series by ${artist.parent.name} · ${sr.date}`,
      color: dark ? '#f3ede2' : '#2a2520',
      accent: movement ? movement.color : '#9a7b47',
      width: W * 0.86,
      height: 1.3
    });
    onWall('front', new THREE.Mesh(new THREE.PlaneGeometry(W * 0.86, 1.3), new THREE.MeshBasicMaterial({ map: title, transparent: true })), 0, H - 0.95);
    const fp = sidePanels('front', 0);
    panel('front', fp[0].x, fp[0].pw, 1.9, { kicker: 'The series', title: sr.title, subtitle: sr.date, body: sr.intro });
    panel('front', fp[1].x, fp[1].pw, 1.9, { kicker: 'How to look', title: 'Same motif, different moments', body: sr.look });
    const bp = sidePanels('back', links.back.length);
    if (bp.length) {
      panel('back', bp[0].x, bp[0].pw, 1.9, {
        kicker: 'In this wing',
        title: 'Chronology',
        body: works.map((w, i) => `${i + 1}.  ${w.painting.date} — ${w.painting.title}`)
      });
      panel('back', bp[1].x, bp[1].pw, 1.9, {
        kicker: 'Way out',
        title: `Back to ${artist.parent.short}`,
        body: `The door between these panels leads back to the main ${artist.parent.name} room, where the visit continues in chronological order.`
      }, { type: 'door', link: links.back[0] });
    }
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
  const paintingMeshes = [];
  let pIndex = -1;
  works.forEach((wk, slotIndex) => {
    if (wk.wing) return;
    const k = ++pIndex;
    const { side, z } = placement[slotIndex];
    const aspect = wk.info && wk.info.w && wk.info.h ? wk.info.w / wk.info.h : 1.25;
    const { w, h } = paintingSize(aspect);
    const pg = new THREE.Group();
    const frame = buildFrame(w, h, style.frame, opts.quality === 'high');
    pg.add(frame.group);
    // canvas weave relief, scaled to the painting's size
    const weave = canvasWeave().clone();
    weave.wrapS = weave.wrapT = THREE.RepeatWrapping;
    weave.repeat.set(w * 14, h * 14);
    weave.needsUpdate = true;
    const matOpts = {
      map: placeholderTexture({ title: wk.painting.title, color: shade(style.wall, dark ? 0.15 : -0.15), label: opts.placeholderLabel || '' }),
      roughness: 0.72,
      bumpMap: weave,
      bumpScale: 0.35,
      emissive: '#ffffff',
      emissiveIntensity: 0.22
    };
    // on computers: a thin varnish layer that catches the spotlight
    const mat = opts.quality === 'high'
      ? new THREE.MeshPhysicalMaterial({ ...matOpts, clearcoat: 0.35, clearcoatRoughness: 0.45 })
      : new THREE.MeshStandardMaterial(matOpts);
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
    const plBack = box(0.52, 0.23, 0.01, std(dark ? '#0e0e0e' : '#d6d0c5', 0.6));
    plBack.position.set(pl.position.x, pl.position.y, 0.006);
    pg.add(plBack);
    if (classic && opts.quality === 'high') {
      // two brass wires from the picture rail to the top of the frame
      const fb = frameMaterials(style.frame).b;
      const topY = h / 2 + fb;
      const railY = H - 0.6 - 1.85;
      const wireMat = std('#b59a5e', 0.3, { metalness: 0.9 });
      for (const sx of [-1, 1]) {
        const a = new THREE.Vector3(sx * w * 0.32, topY - 0.02, 0.02);
        const b = new THREE.Vector3(sx * w * 0.12, railY, 0.02);
        const len = a.distanceTo(b);
        const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.0035, 0.0035, len, 5), wireMat);
        wire.position.copy(a).add(b).multiplyScalar(0.5);
        wire.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
        wire.userData.noShadow = true;
        pg.add(wire);
        const hook = box(0.03, 0.05, 0.03, wireMat);
        hook.position.copy(b);
        pg.add(hook);
      }
    }

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
      body: works.map((w) => (w.wing ? `Series wing — ${w.painting.date}: ${w.wing.name} (${w.wing.count} paintings)` : `${w.painting.date} — ${w.painting.title}`))
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

  if (opts.quality === 'high') {
    group.traverse((o) => {
      if (!o.isMesh) return;
      const m = Array.isArray(o.material) ? o.material[0] : o.material;
      const basic = m && (m.isMeshBasicMaterial || m.transparent);
      o.receiveShadow = !basic;
      o.castShadow = !basic && !o.userData.noShadow && o !== floor;
    });
  }

  return { group, interactives, paintingMeshes, collide, spawn, dispose, animate, W, D, H, doors, isLobby };
}
