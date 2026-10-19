// Procedural textures drawn on <canvas>: floors, walls, wall texts, signs, plaques.
import * as THREE from 'three';

export const SERIF = '"Cormorant Garamond", "Playfair Display", Georgia, "Times New Roman", serif';
export const SANS = '"Inter", "Helvetica Neue", Arial, sans-serif';

let maxAniso = 4;
export function setMaxAnisotropy(n) {
  maxAniso = n;
}

function canvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

function finish(c, { repeat = null, srgb = true } = {}) {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = maxAniso;
  if (repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repeat[0], repeat[1]);
  }
  t.needsUpdate = true;
  return t;
}

// Small deterministic random generator so textures look the same every visit.
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function shade(hex, amt) {
  const c = new THREE.Color(hex);
  const hsl = {};
  c.getHSL(hsl);
  c.setHSL(hsl.h, hsl.s, Math.max(0, Math.min(1, hsl.l + amt)));
  return '#' + c.getHexString();
}

function noise(ctx, w, h, strength, rand, size = 1) {
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let y = 0; y < h; y += size) {
    for (let x = 0; x < w; x += size) {
      const n = (rand() - 0.5) * strength;
      for (let yy = y; yy < Math.min(h, y + size); yy++) {
        for (let xx = x; xx < Math.min(w, x + size); xx++) {
          const i = (yy * w + xx) * 4;
          d[i] += n;
          d[i + 1] += n;
          d[i + 2] += n;
        }
      }
    }
  }
  ctx.putImageData(img, 0, 0);
}

function woodPlank(ctx, x, y, w, h, base, rand) {
  ctx.fillStyle = shade(base, (rand() - 0.5) * 0.08);
  ctx.fillRect(x, y, w, h);
  // grain
  ctx.globalAlpha = 0.18;
  const vertical = h > w;
  const len = vertical ? h : w;
  const across = vertical ? w : h;
  for (let i = 0; i < across / 2; i++) {
    ctx.strokeStyle = rand() > 0.5 ? shade(base, -0.12) : shade(base, 0.06);
    ctx.lineWidth = 0.5 + rand();
    ctx.beginPath();
    const o = rand() * across;
    for (let t = 0; t <= len; t += 8) {
      const wob = Math.sin(t * 0.05 + o) * 1.5;
      const px = vertical ? x + o + wob : x + t;
      const py = vertical ? y + t : y + o + wob;
      t === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.strokeStyle = 'rgba(0,0,0,0.35)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
}

const floorCache = new Map();

/** Returns a texture tiled every `tile` metres. */
export function floorTexture(type) {
  if (floorCache.has(type)) return floorCache.get(type);
  const S = 1024;
  const c = canvas(S, S);
  const ctx = c.getContext('2d');
  const rand = rng(type.length * 7919 + 13);
  let tile = 4; // metres covered by one texture repeat
  let rough = 0.55;

  switch (type) {
    case 'parquet':
    case 'darkwood': {
      const base = type === 'parquet' ? '#a57a4f' : '#4a2f20';
      const pw = S / 8;
      const ph = S / 2;
      for (let col = 0; col < 8; col++) {
        const offset = (col % 2) * (ph / 2);
        for (let row = -1; row < 3; row++) woodPlank(ctx, col * pw, row * ph + offset, pw, ph, base, rand);
      }
      tile = 3;
      rough = type === 'parquet' ? 0.45 : 0.4;
      break;
    }
    case 'herringbone': {
      const base = '#7b5232';
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, S, S);
      // Basket-weave parquet: square cells of three planks, alternating direction.
      const n = 6;
      const t = S / n;
      for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++)
          for (let k = 0; k < 3; k++) {
            if ((i + j) % 2) woodPlank(ctx, i * t + (k * t) / 3, j * t, t / 3, t, base, rand);
            else woodPlank(ctx, i * t, j * t + (k * t) / 3, t, t / 3, base, rand);
          }
      tile = 2.4;
      rough = 0.45;
      break;
    }
    case 'terracotta': {
      const n = 8;
      const t = S / n;
      for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++) {
          ctx.fillStyle = shade('#b4654a', (rand() - 0.5) * 0.12);
          ctx.fillRect(i * t, j * t, t, t);
        }
      noise(ctx, S, S, 22, rand, 2);
      ctx.strokeStyle = '#d9c2a8';
      ctx.lineWidth = 6;
      for (let i = 0; i <= n; i++) {
        ctx.beginPath();
        ctx.moveTo(i * t, 0);
        ctx.lineTo(i * t, S);
        ctx.moveTo(0, i * t);
        ctx.lineTo(S, i * t);
        ctx.stroke();
      }
      tile = 3.2;
      rough = 0.8;
      break;
    }
    case 'stone':
    case 'marble': {
      const n = 4;
      const t = S / n;
      for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++) {
          const light = type === 'marble' ? ((i + j) % 2 ? '#e9e4da' : '#d8d1c3') : shade('#cfc8ba', (rand() - 0.5) * 0.05);
          ctx.fillStyle = light;
          ctx.fillRect(i * t, j * t, t, t);
          // veins
          ctx.globalAlpha = type === 'marble' ? 0.25 : 0.1;
          ctx.strokeStyle = '#8f877a';
          for (let v = 0; v < 3; v++) {
            ctx.lineWidth = 0.5 + rand() * 1.5;
            ctx.beginPath();
            let x = i * t + rand() * t;
            let y = j * t;
            ctx.moveTo(x, y);
            for (let k = 0; k < 10; k++) {
              x += (rand() - 0.5) * 40;
              y += t / 10;
              ctx.lineTo(x, y);
            }
            ctx.stroke();
          }
          ctx.globalAlpha = 1;
        }
      noise(ctx, S, S, 10, rand, 2);
      ctx.strokeStyle = 'rgba(80,70,60,0.35)';
      ctx.lineWidth = 2;
      for (let i = 0; i <= n; i++) {
        ctx.beginPath();
        ctx.moveTo(i * t, 0);
        ctx.lineTo(i * t, S);
        ctx.moveTo(0, i * t);
        ctx.lineTo(S, i * t);
        ctx.stroke();
      }
      tile = type === 'marble' ? 4 : 5;
      rough = type === 'marble' ? 0.18 : 0.35;
      break;
    }
    case 'tiles': {
      // Patterned cement tiles (Matisse room)
      const n = 8;
      const t = S / n;
      for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++) {
          ctx.fillStyle = '#efe6d2';
          ctx.fillRect(i * t, j * t, t, t);
          ctx.fillStyle = (i + j) % 2 ? '#2f5d8a' : '#c8492f';
          ctx.beginPath();
          ctx.arc(i * t + t / 2, j * t + t / 2, t * 0.32, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#efe6d2';
          for (let k = 0; k < 4; k++) {
            ctx.beginPath();
            const a = (k * Math.PI) / 2 + Math.PI / 4;
            ctx.arc(i * t + t / 2 + Math.cos(a) * t * 0.18, j * t + t / 2 + Math.sin(a) * t * 0.18, t * 0.1, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.fillStyle = '#3e7d4f';
          [[0, 0], [t, 0], [0, t], [t, t]].forEach(([dx, dy]) => {
            ctx.beginPath();
            ctx.arc(i * t + dx, j * t + dy, t * 0.16, 0, Math.PI * 2);
            ctx.fill();
          });
        }
      noise(ctx, S, S, 12, rand, 2);
      tile = 3.2;
      rough = 0.6;
      break;
    }
    case 'concrete':
    case 'white': {
      ctx.fillStyle = type === 'white' ? '#ecebe7' : '#a9a7a2';
      ctx.fillRect(0, 0, S, S);
      noise(ctx, S, S, type === 'white' ? 8 : 26, rand, 2);
      noise(ctx, S, S, type === 'white' ? 6 : 14, rand, 16);
      ctx.strokeStyle = 'rgba(0,0,0,0.12)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(S / 2, 0);
      ctx.lineTo(S / 2, S);
      ctx.moveTo(0, S / 2);
      ctx.lineTo(S, S / 2);
      ctx.stroke();
      tile = 6;
      rough = type === 'white' ? 0.3 : 0.5;
      break;
    }
    case 'mondrian': {
      ctx.fillStyle = '#f2f0ea';
      ctx.fillRect(0, 0, S, S);
      const cells = [
        [0, 0, 0.38, 0.55, '#d52b1e'],
        [0.8, 0.62, 0.2, 0.38, '#1f4fa3'],
        [0.38, 0.82, 0.22, 0.18, '#f2c12e']
      ];
      for (const [x, y, w, h, col] of cells) {
        ctx.fillStyle = col;
        ctx.fillRect(x * S, y * S, w * S, h * S);
      }
      ctx.fillStyle = '#111';
      const lw = 18;
      [0.38, 0.8, 0.6].forEach((x) => ctx.fillRect(x * S - lw / 2, 0, lw, S));
      [0.55, 0.82, 0.25].forEach((y) => ctx.fillRect(0, y * S - lw / 2, S, lw));
      noise(ctx, S, S, 6, rand, 2);
      tile = 8;
      rough = 0.35;
      break;
    }
    default: {
      ctx.fillStyle = '#888';
      ctx.fillRect(0, 0, S, S);
    }
  }
  const tex = finish(c, { repeat: [1, 1] });
  const res = { map: tex, tile, roughness: rough };
  floorCache.set(type, res);
  return res;
}

/** Subtle plaster texture tinted with the wall colour. */
export function wallTexture(color) {
  const S = 512;
  const c = canvas(S, S);
  const ctx = c.getContext('2d');
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, S, S);
  const rand = rng(parseInt(color.slice(1), 16));
  noise(ctx, S, S, 7, rand, 2);
  noise(ctx, S, S, 5, rand, 32);
  return finish(c, { repeat: [1, 1] });
}

function wrap(ctx, text, maxWidth) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function isDark(hex) {
  const c = new THREE.Color(hex);
  return c.r * 0.299 + c.g * 0.587 + c.b * 0.114 < 0.45;
}

/**
 * A wall text panel. Width and height in metres; resolution scales with them.
 */
export function textPanel({ kicker = '', title = '', subtitle = '', body = [], width = 2.6, height = 1.8, bg = '#f4efe6', fg, accent = '#8a6a3a' }) {
  const ppm = 360; // pixels per metre
  const W = Math.round(width * ppm);
  const H = Math.round(height * ppm);
  const c = canvas(W, H);
  const ctx = c.getContext('2d');
  fg = fg || (isDark(bg) ? '#f3ede2' : '#2a2520');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  const pad = W * 0.07;
  let y = pad;
  if (kicker) {
    ctx.fillStyle = accent;
    ctx.font = `600 ${Math.round(W * 0.028)}px ${SANS}`;
    ctx.fillText(kicker.toUpperCase().split('').join(' '), pad, y + W * 0.028);
    y += W * 0.06;
  }
  if (title) {
    ctx.fillStyle = fg;
    let size = Math.round(W * 0.075);
    ctx.font = `600 ${size}px ${SERIF}`;
    while (ctx.measureText(title).width > W - pad * 2 && size > 20) {
      size -= 2;
      ctx.font = `600 ${size}px ${SERIF}`;
    }
    const lines = wrap(ctx, title, W - pad * 2);
    for (const l of lines) {
      y += size;
      ctx.fillText(l, pad, y);
      y += size * 0.15;
    }
    y += W * 0.015;
  }
  if (subtitle) {
    ctx.fillStyle = accent;
    const s = Math.round(W * 0.034);
    ctx.font = `italic 500 ${s}px ${SERIF}`;
    y += s;
    ctx.fillText(subtitle, pad, y);
    y += s * 0.8;
  }
  ctx.fillStyle = accent;
  ctx.fillRect(pad, y + W * 0.012, W * 0.12, Math.max(2, W * 0.004));
  y += W * 0.05;
  // Body paragraphs, shrink to fit.
  const paras = Array.isArray(body) ? body : [body];
  let size = Math.round(W * 0.033);
  let laid;
  for (;;) {
    ctx.font = `400 ${size}px ${SANS}`;
    laid = paras.map((p) => wrap(ctx, p, W - pad * 2));
    const total = laid.reduce((s, l) => s + l.length * size * 1.45 + size * 0.7, 0);
    if (y + total < H - pad || size <= 12) break;
    size -= 1;
  }
  ctx.fillStyle = fg;
  ctx.globalAlpha = 0.88;
  for (const lines of laid) {
    for (const l of lines) {
      y += size * 1.45;
      ctx.fillText(l, pad, y);
    }
    y += size * 0.7;
  }
  ctx.globalAlpha = 1;
  return finish(c);
}

/** Big lettering painted directly on a wall (transparent background). */
export function wallLettering({ title, subtitle = '', color = '#222', accent, width = 8, height = 1.2 }) {
  const ppm = 200;
  const W = Math.round(width * ppm);
  const H = Math.round(height * ppm);
  const c = canvas(W, H);
  const ctx = c.getContext('2d');
  ctx.textAlign = 'center';
  ctx.fillStyle = color;
  let size = Math.round(H * 0.5);
  ctx.font = `500 ${size}px ${SERIF}`;
  while (ctx.measureText(title).width > W * 0.95 && size > 10) {
    size -= 2;
    ctx.font = `500 ${size}px ${SERIF}`;
  }
  ctx.fillText(title, W / 2, H * 0.55);
  if (subtitle) {
    ctx.fillStyle = accent || color;
    ctx.font = `500 ${Math.round(H * 0.17)}px ${SANS}`;
    ctx.fillText(subtitle.toUpperCase().split('').join(' '), W / 2, H * 0.88);
  }
  return finish(c);
}

/** Sign above a doorway. */
export function doorSign({ kind, name, years, color, dark }) {
  const W = 900;
  const H = 260;
  const c = canvas(W, H);
  const ctx = c.getContext('2d');
  ctx.fillStyle = dark ? '#151515' : '#faf7f1';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 18, H);
  ctx.textAlign = 'left';
  ctx.fillStyle = color;
  ctx.font = `700 34px ${SANS}`;
  ctx.fillText(kind.toUpperCase().split('').join(' '), 52, 62);
  ctx.fillStyle = dark ? '#f5f1ea' : '#1f1b17';
  let size = 92;
  ctx.font = `600 ${size}px ${SERIF}`;
  while (ctx.measureText(name).width > W - 90 && size > 30) {
    size -= 4;
    ctx.font = `600 ${size}px ${SERIF}`;
  }
  ctx.fillText(name, 50, 160);
  if (years) {
    ctx.globalAlpha = 0.6;
    ctx.font = `500 34px ${SANS}`;
    ctx.fillText(years, 52, 220);
    ctx.globalAlpha = 1;
  }
  return finish(c);
}

/** Glowing panel at the end of a doorway passage. */
export function portalTexture({ name, color, wall, low = false }) {
  const W = 512;
  const H = 768;
  const c = canvas(W, H);
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, shade(wall, 0.12));
  g.addColorStop(1, shade(wall, -0.1));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  const r = ctx.createRadialGradient(W / 2, H * 0.45, 10, W / 2, H * 0.45, W * 0.8);
  r.addColorStop(0, 'rgba(255,255,255,0.55)');
  r.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = r;
  ctx.fillRect(0, 0, W, H);
  const ty = low ? H * 0.9 : H * 0.57;
  ctx.fillStyle = color;
  ctx.fillRect(W * 0.3, ty + H * 0.05, W * 0.4, 6);
  ctx.textAlign = 'center';
  ctx.fillStyle = isDark(wall) ? '#fff' : '#1d1a17';
  let size = 84;
  ctx.font = `600 ${size}px ${SERIF}`;
  while (ctx.measureText(name).width > W * 0.86 && size > 24) {
    size -= 4;
    ctx.font = `600 ${size}px ${SERIF}`;
  }
  ctx.fillText(name, W / 2, ty);
  return finish(c);
}

/** Small label next to a painting. */
export function plaqueTexture({ index, title, date, dark }) {
  const W = 720;
  const H = 300;
  const c = canvas(W, H);
  const ctx = c.getContext('2d');
  ctx.fillStyle = dark ? '#1c1a19' : '#fbf8f2';
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = dark ? '#444' : '#d9d1c4';
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, W - 4, H - 4);
  const fg = dark ? '#efe9df' : '#26211c';
  ctx.fillStyle = '#9a7b47';
  ctx.font = `700 46px ${SANS}`;
  ctx.fillText(String(index).padStart(2, '0'), 34, 76);
  ctx.fillStyle = fg;
  ctx.globalAlpha = 0.6;
  ctx.font = `500 40px ${SANS}`;
  ctx.fillText(date, 120, 74);
  ctx.globalAlpha = 1;
  let size = 50;
  ctx.font = `600 ${size}px ${SERIF}`;
  let lines = wrap(ctx, title, W - 68);
  while (lines.length > 3 && size > 30) {
    size -= 3;
    ctx.font = `600 ${size}px ${SERIF}`;
    lines = wrap(ctx, title, W - 68);
  }
  lines.slice(0, 3).forEach((l, i) => ctx.fillText(l, 34, 140 + i * size * 1.12));
  ctx.globalAlpha = 0.45;
  ctx.font = `500 26px ${SANS}`;
  ctx.fillText('tap / click to enlarge', 34, H - 22);
  ctx.globalAlpha = 1;
  return finish(c);
}

/** Placeholder shown while an image is loading (or in developer placeholder mode). */
export function placeholderTexture({ title, color = '#777', label = '' }) {
  const W = 512;
  const H = 512;
  const c = canvas(W, H);
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, shade(color, 0.15));
  g.addColorStop(1, shade(color, -0.15));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.textAlign = 'center';
  ctx.font = `600 34px ${SERIF}`;
  wrap(ctx, title, W * 0.8)
    .slice(0, 4)
    .forEach((l, i) => ctx.fillText(l, W / 2, H * 0.42 + i * 40));
  if (label) {
    ctx.font = `600 18px ${SANS}`;
    ctx.fillText(label, W / 2, H * 0.85);
  }
  return finish(c);
}

let shadowTex = null;
export function blobShadow() {
  if (shadowTex) return shadowTex;
  const S = 128;
  const c = canvas(S, S);
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, 'rgba(0,0,0,0.55)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  shadowTex = finish(c, { srgb: false });
  shadowTex.userData.shared = true;
  return shadowTex;
}

/** Soft glow texture for skylights. */
export function skylightTexture(color = '#ffffff') {
  const S = 256;
  const c = canvas(S, S);
  const ctx = c.getContext('2d');
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, S, S);
  ctx.strokeStyle = 'rgba(0,0,0,0.25)';
  ctx.lineWidth = 6;
  for (let i = 1; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo((i * S) / 4, 0);
    ctx.lineTo((i * S) / 4, S);
    ctx.moveTo(0, (i * S) / 4);
    ctx.lineTo(S, (i * S) / 4);
    ctx.stroke();
  }
  return finish(c);
}

export { shade, isDark };

// ───────────────────────── realism details ─────────────────────────

const detailCache = new Map();
function cached(key, make) {
  if (!detailCache.has(key)) {
    const t = make();
    t.userData.shared = true;
    detailCache.set(key, t);
  }
  return detailCache.get(key);
}

/** Soft dark gradient (opaque at v=0) used as alpha map for contact shadows along walls. */
export function aoGradient() {
  return cached('ao', () => {
    const c = canvas(4, 256);
    const ctx = c.getContext('2d');
    const g = ctx.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, '#fff');
    g.addColorStop(0.25, '#888');
    g.addColorStop(0.6, '#222');
    g.addColorStop(1, '#000');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 4, 256);
    return finish(c, { srgb: false });
  });
}

/** Fine canvas weave, used as a bump map on paintings. */
export function canvasWeave() {
  return cached('weave', () => {
    const S = 128;
    const c = canvas(S, S);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, S, S);
    const rand = rng(77);
    for (let y = 0; y < S; y += 2) {
      for (let x = 0; x < S; x += 2) {
        const over = ((x >> 1) + (y >> 1)) % 2 === 0;
        const v = (over ? 150 : 105) + (rand() - 0.5) * 30;
        ctx.fillStyle = `rgb(${v},${v},${v})`;
        ctx.fillRect(x, y, 2, 2);
      }
    }
    const t = finish(c, { srgb: false, repeat: [1, 1] });
    return t;
  });
}

/** Chased-gold ornament relief for gilt frames. */
export function ornamentBump() {
  return cached('ornament', () => {
    const S = 256;
    const c = canvas(S, S);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, S, S);
    const rand = rng(11);
    for (let i = 0; i < 700; i++) {
      const x = rand() * S;
      const y = rand() * S;
      const r = 1 + rand() * 4;
      const v = 110 + rand() * 120;
      ctx.fillStyle = `rgb(${v},${v},${v})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    // beaded bands
    for (const y of [24, S - 24]) {
      for (let x = 6; x < S; x += 12) {
        ctx.fillStyle = '#eee';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    return finish(c, { srgb: false, repeat: [1, 1] });
  });
}

/** Raised wall panels below the chair rail (colour + matching bump map). */
export function wainscotTextures(color, panelWidth = 1.4) {
  const key = 'wain' + color;
  if (detailCache.has(key)) return detailCache.get(key);
  const W = 512;
  const H = 256;
  const make = (bump) => {
    const c = canvas(W, H);
    const ctx = c.getContext('2d');
    ctx.fillStyle = bump ? '#808080' : color;
    ctx.fillRect(0, 0, W, H);
    const m = 34;
    const hi = bump ? '#c8c8c8' : shade(color, 0.08);
    const lo = bump ? '#3a3a3a' : shade(color, -0.12);
    // panel: light top/left edges, dark bottom/right edges (bevel)
    ctx.lineWidth = 10;
    ctx.strokeStyle = hi;
    ctx.beginPath();
    ctx.moveTo(m, H - m);
    ctx.lineTo(m, m);
    ctx.lineTo(W - m, m);
    ctx.stroke();
    ctx.strokeStyle = lo;
    ctx.beginPath();
    ctx.moveTo(W - m, m);
    ctx.lineTo(W - m, H - m);
    ctx.lineTo(m, H - m);
    ctx.stroke();
    ctx.lineWidth = 3;
    ctx.strokeStyle = lo;
    ctx.strokeRect(m + 14, m + 14, W - 2 * m - 28, H - 2 * m - 28);
    if (!bump) noise(ctx, W, H, 6, rng(5), 2);
    return finish(c, { srgb: !bump, repeat: [1, 1] });
  };
  const res = { map: make(false), bump: make(true), panelWidth };
  res.map.userData.shared = res.bump.userData.shared = true;
  detailCache.set(key, res);
  return res;
}

/** Metal air-vent grille. */
export function ventTexture() {
  return cached('vent', () => {
    const c = canvas(256, 64);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#b9b6b0';
    ctx.fillRect(0, 0, 256, 64);
    for (let x = 10; x < 246; x += 9) {
      ctx.fillStyle = '#3c3b39';
      ctx.fillRect(x, 10, 4, 44);
    }
    ctx.strokeStyle = '#8e8b86';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, 252, 60);
    return finish(c);
  });
}

/** Soft round sprite for dust motes. */
export function dustSprite() {
  return cached('dust', () => {
    const c = canvas(32, 32);
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 32, 32);
    return finish(c);
  });
}
