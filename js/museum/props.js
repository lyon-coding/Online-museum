// Decorative objects that give each room its character. Built from primitives
// so the museum has no external 3D assets.
import * as THREE from 'three';
import { blobShadow, textPanel } from './textures.js';

const M = (color, roughness = 0.6, metalness = 0, extra = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness, ...extra });

function mesh(geo, mat, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  return m;
}

function shadow(group, x, z, w, d) {
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(w, d),
    new THREE.MeshBasicMaterial({ map: blobShadow(), transparent: true, depthWrite: false })
  );
  m.rotation.x = -Math.PI / 2;
  m.position.set(x, 0.005, z);
  m.renderOrder = 1;
  group.add(m);
}

function pedestal(g, x, z, w = 0.8, h = 1.0, color = '#f2efe9') {
  g.add(mesh(new THREE.BoxGeometry(w, h, w), M(color, 0.7), x, h / 2, z));
  g.add(mesh(new THREE.BoxGeometry(w + 0.06, 0.04, w + 0.06), M(color, 0.6), x, h, z));
  shadow(g, x, z, w * 2, w * 2);
}

// ─────────────────────────────── generic ───────────────────────────────

function bench(ctx, x, z, len = 2.4, rotY = 0) {
  const g = new THREE.Group();
  const wood = M('#6b4528', 0.55);
  const metal = M('#2a2a2a', 0.4, 0.8);
  const leather = M('#2d2a28', 0.7);
  g.add(mesh(new THREE.BoxGeometry(len, 0.08, 0.55), wood, 0, 0.44, 0));
  g.add(mesh(new THREE.BoxGeometry(len - 0.08, 0.06, 0.48), leather, 0, 0.51, 0));
  for (const sx of [-1, 1]) {
    g.add(mesh(new THREE.BoxGeometry(0.06, 0.42, 0.5), metal, sx * (len / 2 - 0.15), 0.21, 0));
  }
  shadow(g, 0, 0, len + 0.8, 1.2);
  g.position.set(x, 0, z);
  g.rotation.y = rotY;
  ctx.group.add(g);
  const c = Math.abs(Math.cos(rotY));
  ctx.addBox(x, z, (len / 2 + 0.1) * c + 0.35 * (1 - c), 0.35 * c + (len / 2 + 0.1) * (1 - c));
}

function plant(ctx, x, z, scale = 1, tropical = false) {
  const g = new THREE.Group();
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.22, 0.55, 20), M('#b7a99a', 0.8));
  pot.position.y = 0.275;
  g.add(pot);
  g.add(mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.04, 20), M('#3b2a1e', 1), 0, 0.53, 0));
  const leafMat = M(tropical ? '#2f6b34' : '#456b3a', 0.8, 0, { side: THREE.DoubleSide });
  if (tropical) {
    const trunk = mesh(new THREE.CylinderGeometry(0.04, 0.06, 1.4, 8), M('#6a5236', 0.9), 0, 1.2, 0);
    g.add(trunk);
    for (let i = 0; i < 9; i++) {
      const leaf = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 1.2, 1, 4), leafMat);
      const pos = leaf.geometry.attributes.position;
      for (let k = 0; k < pos.count; k++) {
        const yy = pos.getY(k);
        pos.setZ(k, -0.25 * ((yy + 0.6) / 1.2) ** 2);
      }
      leaf.geometry.computeVertexNormals();
      leaf.geometry.translate(0, 0.6, 0);
      leaf.position.y = 1.85;
      leaf.rotation.order = 'YXZ';
      leaf.rotation.y = (i / 9) * Math.PI * 2;
      leaf.rotation.x = -0.9 - (i % 3) * 0.2;
      g.add(leaf);
    }
  } else {
    const fol = M('#4f7d43', 0.85, 0, { flatShading: true });
    for (let i = 0; i < 9; i++) {
      const r = 0.22 + ((i * 37) % 10) / 60;
      const s = mesh(new THREE.IcosahedronGeometry(r, 0), fol, Math.sin(i * 2.1) * 0.18, 0.8 + (i % 4) * 0.18, Math.cos(i * 2.1) * 0.18);
      g.add(s);
    }
  }
  shadow(g, 0, 0, 1, 1);
  g.scale.setScalar(scale);
  g.position.set(x, 0, z);
  ctx.group.add(g);
  ctx.addCircle(x, z, 0.4 * scale);
}

// ─────────────────────────────── themes ────────────────────────────────

const THEMES = {
  bench(ctx) {
    bench(ctx, 0, ctx.D * 0.18);
  },

  rotunda(ctx) {
    // Entrance hall: two slowly turning ring sculptures in the colours of the movements,
    // framing the way to the first room.
    for (const sx of [-1, 1]) {
      const x = sx * 3.4;
      const z = -1.5;
      const g = new THREE.Group();
      g.add(mesh(new THREE.CylinderGeometry(0.75, 0.82, 0.3, 40), M('#e8e2d6', 0.4), 0, 0.15, 0));
      g.add(mesh(new THREE.CylinderGeometry(0.22, 0.3, 1.1, 32), M('#d9d1c2', 0.4), 0, 0.85, 0));
      const ring = new THREE.Group();
      ctx.movementColors.forEach((col, i) => {
        const t = new THREE.Mesh(new THREE.TorusGeometry(0.62 - i * 0.055, 0.025, 12, 64), M(col, 0.35, 0.3));
        t.rotation.x = Math.PI / 2 + i * 0.22;
        t.rotation.y = i * 0.4;
        ring.add(t);
      });
      ring.position.y = 2.1;
      g.add(ring);
      ctx.animate.push((dt, t) => {
        ring.rotation.y = sx * t * 0.15;
        ring.children.forEach((c, i) => (c.rotation.z = t * (0.1 + i * 0.03)));
      });
      shadow(g, 0, 0, 2.2, 2.2);
      g.position.set(x, 0, z);
      ctx.group.add(g);
      ctx.addCircle(x, z, 0.9);
    }
    bench(ctx, -3.4, ctx.D * 0.2, 2.2);
    bench(ctx, 3.4, ctx.D * 0.2, 2.2);
    plant(ctx, -ctx.W / 2 + 1, -ctx.D / 2 + 1, 1.2);
    plant(ctx, ctx.W / 2 - 1, -ctx.D / 2 + 1, 1.2);
  },

  bar(ctx) {
    // Manet: the marble bar of the Folies-Bergère with bottles and a bowl of oranges.
    const z = -ctx.D * 0.2;
    const g = new THREE.Group();
    g.add(mesh(new THREE.BoxGeometry(3, 1.05, 0.7), M('#3a2318', 0.5), 0, 0.525, 0));
    g.add(mesh(new THREE.BoxGeometry(3.15, 0.06, 0.8), M('#e9e3d9', 0.15, 0.05), 0, 1.08, 0));
    const colors = ['#1d3b1f', '#3a1410', '#c9b07a', '#1b2f4a', '#2a2a2a'];
    for (let i = 0; i < 7; i++) {
      const col = colors[i % colors.length];
      const b = new THREE.Group();
      b.add(mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.24, 14), M(col, 0.1, 0.1, { transparent: true, opacity: 0.92 }), 0, 0.12, 0));
      b.add(mesh(new THREE.CylinderGeometry(0.015, 0.04, 0.1, 10), M(col, 0.1), 0, 0.29, 0));
      b.add(mesh(new THREE.CylinderGeometry(0.017, 0.017, 0.04, 8), M(i % 2 ? '#b8913f' : '#8b1c1c', 0.4, 0.6), 0, 0.36, 0));
      b.position.set(-1.25 + i * 0.12 + (i > 3 ? 1.6 : 0), 1.11, (i % 2) * 0.12 - 0.05);
      g.add(b);
    }
    const bowl = mesh(new THREE.SphereGeometry(0.16, 20, 10, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), M('#cfd6d8', 0.05, 0.1, { transparent: true, opacity: 0.6, side: THREE.DoubleSide }), 0.2, 1.27, 0);
    g.add(bowl);
    for (let i = 0; i < 5; i++) g.add(mesh(new THREE.SphereGeometry(0.055, 14, 10), M('#e87a1d', 0.5), 0.2 + Math.cos(i * 1.3) * 0.07, 1.17 + (i > 3 ? 0.07 : 0), Math.sin(i * 1.3) * 0.07));
    g.add(mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.16, 10), M('#c9d7cf', 0.05, 0, { transparent: true, opacity: 0.5 }), -0.3, 1.19, 0.1));
    shadow(g, 0, 0, 4, 1.6);
    g.position.set(0, 0, z);
    ctx.group.add(g);
    ctx.addBox(0, z, 1.65, 0.5);
  },

  pond(ctx) {
    // Monet: a little water-lily basin.
    const z = -ctx.D * 0.15;
    const g = new THREE.Group();
    g.add(mesh(new THREE.CylinderGeometry(1.6, 1.7, 0.42, 48, 1, true), M('#bdb6a8', 0.8, 0, { side: THREE.DoubleSide }), 0, 0.21, 0));
    const rim = new THREE.Mesh(new THREE.TorusGeometry(1.65, 0.09, 10, 64), M('#cfc8ba', 0.7));
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.42;
    g.add(rim);
    const water = new THREE.Mesh(new THREE.CircleGeometry(1.6, 48), M('#2c4f52', 0.05, 0.3, { envMapIntensity: 1.4 }));
    water.rotation.x = -Math.PI / 2;
    water.position.y = 0.34;
    g.add(water);
    const padMat = M('#4f7f3a', 0.6, 0, { side: THREE.DoubleSide });
    const flowerMat = M('#f2b7c6', 0.5);
    const pads = [];
    for (let i = 0; i < 14; i++) {
      const r = 0.12 + ((i * 53) % 10) / 70;
      const pad = new THREE.Mesh(new THREE.CircleGeometry(r, 18, 0.3, Math.PI * 2 - 0.4), padMat);
      pad.rotation.x = -Math.PI / 2;
      pad.rotation.z = i * 1.7;
      const a = i * 2.4;
      const d = 0.3 + ((i * 31) % 10) / 9;
      pad.position.set(Math.cos(a) * d, 0.355, Math.sin(a) * d);
      g.add(pad);
      pads.push(pad);
      if (i % 3 === 0) {
        const f = new THREE.Group();
        for (let k = 0; k < 6; k++) {
          const petal = mesh(new THREE.SphereGeometry(0.035, 8, 6), flowerMat, Math.cos(k) * 0.03, 0.03, Math.sin(k) * 0.03);
          petal.scale.set(1, 1.6, 0.6);
          f.add(petal);
        }
        f.add(mesh(new THREE.SphereGeometry(0.02, 8, 6), M('#f3d36b', 0.5), 0, 0.05, 0));
        f.position.copy(pad.position);
        g.add(f);
      }
    }
    ctx.animate.push((dt, t) => {
      pads.forEach((p, i) => (p.rotation.z += Math.sin(t * 0.3 + i) * 0.0008));
    });
    g.position.set(0, 0, z);
    ctx.group.add(g);
    ctx.addCircle(0, z, 1.85);
    bench(ctx, 0, ctx.D * 0.22);
  },

  cafe(ctx) {
    // Renoir: a bistro table from the Maison Fournaise.
    const z = -ctx.D * 0.18;
    const g = new THREE.Group();
    const iron = M('#1f1f1f', 0.5, 0.6);
    g.add(mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.04, 32), M('#f1ece2', 0.25), 0, 0.75, 0));
    g.add(mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.72, 10), iron, 0, 0.37, 0));
    g.add(mesh(new THREE.CylinderGeometry(0.25, 0.28, 0.03, 20), iron, 0, 0.015, 0));
    const glassMat = M('#e8f0ee', 0.05, 0, { transparent: true, opacity: 0.35 });
    for (const [x, zz] of [[0.18, 0.1], [-0.15, -0.12], [-0.05, 0.22]]) {
      g.add(mesh(new THREE.CylinderGeometry(0.035, 0.025, 0.12, 12), glassMat, x, 0.83, zz));
      g.add(mesh(new THREE.CylinderGeometry(0.03, 0.022, 0.04, 12), M('#7a1424', 0.3), x, 0.8, zz));
    }
    g.add(mesh(new THREE.CylinderGeometry(0.04, 0.045, 0.26, 12), M('#1e3a22', 0.15), 0.02, 0.9, -0.02));
    for (const a of [0.3, Math.PI - 0.2, Math.PI * 1.5]) {
      const ch = new THREE.Group();
      ch.add(mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.04, 20), M('#b07b46', 0.6), 0, 0.46, 0));
      for (let k = 0; k < 4; k++) {
        const ang = (k / 4) * Math.PI * 2 + Math.PI / 4;
        ch.add(mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.46, 6), iron, Math.cos(ang) * 0.14, 0.23, Math.sin(ang) * 0.14));
      }
      const back = mesh(new THREE.TorusGeometry(0.17, 0.014, 8, 20, Math.PI), iron, 0, 0.75, -0.17);
      ch.add(back);
      ch.add(mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.3, 6), iron, 0.17, 0.6, -0.17));
      ch.add(mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.3, 6), iron, -0.17, 0.6, -0.17));
      ch.position.set(Math.cos(a) * 0.75, 0, Math.sin(a) * 0.75);
      ch.rotation.y = -a - Math.PI / 2;
      g.add(ch);
    }
    shadow(g, 0, 0, 2.6, 2.6);
    g.position.set(0, 0, z);
    ctx.group.add(g);
    ctx.addCircle(0, z, 1.1);
    plant(ctx, -ctx.W / 2 + 1.0, -ctx.D / 2 + 1.0, 1.1);
    plant(ctx, ctx.W / 2 - 1.0, -ctx.D / 2 + 1.0, 1.1);
  },

  dancer(ctx) {
    // Degas: a bronze dancer on a pedestal (homage to his sculpture).
    const z = -ctx.D * 0.18;
    const g = new THREE.Group();
    pedestal(g, 0, 0, 0.9, 1.0, '#e8e2d6');
    const bronze = M('#7a5a35', 0.35, 0.85);
    const fig = new THREE.Group();
    fig.add(mesh(new THREE.CylinderGeometry(0.035, 0.04, 0.55, 10), bronze, -0.05, 0.28, 0));
    fig.add(mesh(new THREE.CylinderGeometry(0.035, 0.04, 0.55, 10), bronze, 0.06, 0.28, 0.02));
    const tutu = mesh(new THREE.ConeGeometry(0.32, 0.22, 24, 1, true), M('#e9e1cf', 0.9, 0, { side: THREE.DoubleSide }), 0, 0.62, 0);
    fig.add(tutu);
    fig.add(mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.36, 12), bronze, 0, 0.82, 0));
    fig.add(mesh(new THREE.SphereGeometry(0.075, 16, 12), bronze, 0, 1.08, 0.02));
    const arm1 = mesh(new THREE.CylinderGeometry(0.02, 0.022, 0.4, 8), bronze, -0.12, 0.85, -0.06);
    arm1.rotation.z = 0.5;
    arm1.rotation.x = 0.4;
    const arm2 = arm1.clone();
    arm2.position.x = 0.12;
    arm2.rotation.z = -0.5;
    fig.add(arm1, arm2);
    fig.add(mesh(new THREE.TorusGeometry(0.06, 0.012, 8, 16), M('#e7c9b6', 0.8), 0, 1.13, -0.05));
    fig.position.y = 1.02;
    fig.scale.setScalar(1.15);
    g.add(fig);
    ctx.animate.push((dt, t) => (fig.rotation.y = Math.sin(t * 0.2) * 0.35));
    g.position.set(0, 0, z);
    ctx.group.add(g);
    ctx.addCircle(0, z, 0.75);
    bench(ctx, 0, ctx.D * 0.18);
  },

  easel(ctx) {
    // Pissarro: a plein-air easel with a fresh canvas.
    const z = -ctx.D * 0.18;
    const g = new THREE.Group();
    const wood = M('#8b6a45', 0.7);
    for (const [x, zz, rx, rz] of [[-0.35, 0.15, -0.12, 0.15], [0.35, 0.15, -0.12, -0.15], [0, -0.35, 0.3, 0]]) {
      const leg = mesh(new THREE.BoxGeometry(0.05, 1.9, 0.05), wood, x * 0.6, 0.95, zz * 0.6);
      leg.rotation.x = rx;
      leg.rotation.z = rz;
      g.add(leg);
    }
    g.add(mesh(new THREE.BoxGeometry(0.9, 0.04, 0.08), wood, 0, 0.9, 0.12));
    const can = mesh(new THREE.BoxGeometry(0.85, 0.65, 0.03), M('#f2ede2', 0.9), 0, 1.25, 0.1);
    can.rotation.x = -0.12;
    g.add(can);
    // a sketch on the canvas: a few strokes of landscape colour
    const strokes = [['#7aa0c4', 0.18], ['#8fae5d', 0.0], ['#c9b07a', -0.15]];
    strokes.forEach(([c, y]) => {
      const s = mesh(new THREE.PlaneGeometry(0.7, 0.14), M(c, 1), 0, 1.25 + y, 0.118 - y * 0.12);
      s.rotation.x = -0.12;
      g.add(s);
    });
    // stool and paint box
    g.add(mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.04, 16), wood, 0.1, 0.5, 0.75));
    for (let k = 0; k < 3; k++) {
      const a = (k / 3) * Math.PI * 2;
      g.add(mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.5, 6), wood, 0.1 + Math.cos(a) * 0.12, 0.25, 0.75 + Math.sin(a) * 0.12));
    }
    g.add(mesh(new THREE.BoxGeometry(0.4, 0.08, 0.28), M('#5a3d24', 0.6), -0.45, 0.04, 0.5));
    shadow(g, 0, 0.2, 2, 2);
    g.position.set(0, 0, z);
    g.rotation.y = 0.5;
    ctx.group.add(g);
    ctx.addCircle(0, z + 0.2, 0.9);
    THEMES.bench(ctx);
  },

  planters(ctx) {
    plant(ctx, -ctx.W / 2 + 1.0, -ctx.D / 2 + 1.0, 1.1);
    plant(ctx, ctx.W / 2 - 1.0, -ctx.D / 2 + 1.0, 1.1);
  },

  vanity(ctx) {
    // Morisot: a dressing table with an oval mirror and flowers.
    const z = -ctx.D * 0.2;
    const g = new THREE.Group();
    const wood = M('#d9c7ad', 0.5);
    g.add(mesh(new THREE.BoxGeometry(1.2, 0.06, 0.5), wood, 0, 0.75, 0));
    for (const [x, zz] of [[-0.55, -0.2], [0.55, -0.2], [-0.55, 0.2], [0.55, 0.2]]) g.add(mesh(new THREE.CylinderGeometry(0.025, 0.02, 0.75, 8), wood, x, 0.375, zz));
    const mirror = new THREE.Mesh(new THREE.CircleGeometry(0.35, 40), M('#cfd8dc', 0.02, 1));
    mirror.scale.y = 1.35;
    mirror.position.set(0, 1.35, -0.2);
    g.add(mirror);
    const frame = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.025, 8, 40), M('#c7a660', 0.3, 0.8));
    frame.scale.y = 1.35;
    frame.position.copy(mirror.position);
    g.add(frame);
    g.add(mesh(new THREE.CylinderGeometry(0.07, 0.05, 0.22, 16), M('#e5ecef', 0.05, 0, { transparent: true, opacity: 0.6 }), 0.38, 0.89, 0.05));
    for (let i = 0; i < 7; i++) {
      g.add(mesh(new THREE.SphereGeometry(0.05, 10, 8), M(['#f1f1ef', '#f3c6cf', '#ffffff'][i % 3], 0.7), 0.38 + Math.cos(i) * 0.08, 1.06 + (i % 3) * 0.04, 0.05 + Math.sin(i) * 0.08));
    }
    shadow(g, 0, 0, 2, 1.4);
    g.position.set(0, 0, z);
    ctx.group.add(g);
    ctx.addBox(0, z, 0.7, 0.35);
    THEMES.bench(ctx);
  },

  stilllife(ctx) {
    // Cézanne: a table with tilted cloth, apples and a jug.
    const z = ctx.D * 0.15;
    const g = new THREE.Group();
    const wood = M('#6e4b2c', 0.6);
    g.add(mesh(new THREE.BoxGeometry(1.4, 0.06, 0.8), wood, 0, 0.78, 0));
    for (const [x, zz] of [[-0.62, -0.32], [0.62, -0.32], [-0.62, 0.32], [0.62, 0.32]]) g.add(mesh(new THREE.BoxGeometry(0.06, 0.78, 0.06), wood, x, 0.39, zz));
    const cloth = mesh(new THREE.BoxGeometry(0.9, 0.012, 0.85), M('#f3efe6', 0.95), -0.15, 0.82, 0.04);
    cloth.rotation.z = 0.03;
    g.add(cloth);
    const drape = mesh(new THREE.BoxGeometry(0.012, 0.45, 0.7), M('#f3efe6', 0.95), -0.63, 0.6, 0.05);
    drape.rotation.z = 0.08;
    g.add(drape);
    const apples = ['#b8331f', '#d9a227', '#8a9c2a', '#c4471e', '#a52a1c', '#e0b02f', '#7d8f25'];
    apples.forEach((c, i) => {
      const a = mesh(new THREE.SphereGeometry(0.065, 16, 12), M(c, 0.45), -0.35 + (i % 4) * 0.14, 0.89 + (i > 3 ? 0.08 : 0), -0.05 + Math.floor(i / 4) * 0.12 + (i % 2) * 0.05);
      g.add(a);
    });
    const pts = [];
    for (let i = 0; i <= 12; i++) {
      const t = i / 12;
      pts.push(new THREE.Vector2(0.06 + Math.sin(t * Math.PI) * 0.07 + (t > 0.85 ? 0.03 : 0), t * 0.32));
    }
    g.add(mesh(new THREE.LatheGeometry(pts, 24), M('#cdbb92', 0.35), 0.38, 0.81, -0.1));
    shadow(g, 0, 0, 2.2, 1.6);
    g.position.set(0, 0, z);
    g.rotation.y = 0.2;
    ctx.group.add(g);
    ctx.addBox(0, z, 0.85, 0.55);
  },

  geometry(ctx) {
    // Cézanne: "treat nature by means of the cylinder, the sphere and the cone".
    const z = -ctx.D * 0.18;
    const g = new THREE.Group();
    g.add(mesh(new THREE.BoxGeometry(2.2, 0.6, 0.9), M('#efe9df', 0.8), 0, 0.3, 0));
    const plaster = M('#f6f2ea', 0.55);
    g.add(mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.75, 40), plaster, -0.7, 0.975, 0));
    g.add(mesh(new THREE.SphereGeometry(0.3, 40, 24), plaster, 0, 0.9, 0));
    g.add(mesh(new THREE.ConeGeometry(0.28, 0.8, 40), plaster, 0.7, 1.0, 0));
    shadow(g, 0, 0, 3, 1.6);
    g.position.set(0, 0, z);
    ctx.group.add(g);
    ctx.addBox(0, z, 1.2, 0.55);
    const label = new THREE.Mesh(
      new THREE.PlaneGeometry(1.1, 0.42),
      new THREE.MeshStandardMaterial({
        map: textPanel({ kicker: 'Cézanne, 1904', title: '', body: '“Treat nature by means of the cylinder, the sphere and the cone.”', width: 1.1, height: 0.42, bg: '#2a2520', accent: '#c9a96e' }),
        roughness: 0.8
      })
    );
    label.position.set(0, 0.32, 0.455 + z);
    label.rotation.x = 0;
    ctx.group.add(label);
  },

  dotrug(ctx) {
    // Seurat: a round rug woven from coloured dots.
    const S = 512;
    const c = document.createElement('canvas');
    c.width = c.height = S;
    const g2 = c.getContext('2d');
    g2.fillStyle = '#e9e2cf';
    g2.fillRect(0, 0, S, S);
    const cols = ['#2f6fb0', '#e1a43a', '#d9532f', '#6aa04a', '#f2e6b8', '#7a4ea3', '#3fa3a0'];
    let s = 7;
    for (let i = 0; i < 9000; i++) {
      s = (s * 16807) % 2147483647;
      const x = (s % 1000) / 1000 * S;
      s = (s * 16807) % 2147483647;
      const y = (s % 1000) / 1000 * S;
      const r = Math.hypot(x - S / 2, y - S / 2) / (S / 2);
      g2.fillStyle = cols[(Math.floor(r * 6) + (i % 2)) % cols.length];
      g2.beginPath();
      g2.arc(x, y, 3, 0, Math.PI * 2);
      g2.fill();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    const rug = new THREE.Mesh(new THREE.CircleGeometry(2.0, 64), new THREE.MeshStandardMaterial({ map: tex, roughness: 1 }));
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(0, 0.01, ctx.D * 0.05);
    ctx.group.add(rug);
    bench(ctx, 0, ctx.D * 0.05, 2.0);
  },

  parasol(ctx) {
    // Seurat: a parasol from the Grande Jatte.
    const z = -ctx.D * 0.25;
    const g = new THREE.Group();
    g.add(mesh(new THREE.CylinderGeometry(0.02, 0.02, 2.3, 8), M('#3b2a1e', 0.6), 0, 1.15, 0));
    const canopy = mesh(new THREE.ConeGeometry(1.0, 0.45, 16, 1, true), M('#c8462c', 0.8, 0, { side: THREE.DoubleSide }), 0, 2.2, 0);
    g.add(canopy);
    g.add(mesh(new THREE.CylinderGeometry(0.25, 0.3, 0.06, 20), M('#2a2a2a', 0.5, 0.5), 0, 0.03, 0));
    shadow(g, 0, 0, 2.4, 2.4);
    g.position.set(0, 0, z);
    ctx.group.add(g);
    ctx.addCircle(0, z, 0.35);
  },

  sailboat(ctx) {
    // Signac: a model sailing boat — he owned more than thirty boats.
    const z = -ctx.D * 0.18;
    const g = new THREE.Group();
    pedestal(g, 0, 0, 0.9, 0.95, '#f4f1ea');
    const hullShape = new THREE.Shape();
    hullShape.moveTo(-0.45, 0);
    hullShape.quadraticCurveTo(0, -0.18, 0.5, 0.02);
    hullShape.lineTo(0.45, 0.08);
    hullShape.lineTo(-0.45, 0.08);
    const hull = new THREE.Mesh(new THREE.ExtrudeGeometry(hullShape, { depth: 0.16, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02 }), M('#1f3f6b', 0.4));
    hull.position.set(0, 1.12, -0.08);
    g.add(hull);
    g.add(mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.9, 6), M('#6b4b2c', 0.5), 0, 1.65, 0));
    const sail = new THREE.Shape();
    sail.moveTo(0, 0);
    sail.lineTo(0.38, 0);
    sail.lineTo(0, 0.78);
    const sailMesh = new THREE.Mesh(new THREE.ShapeGeometry(sail), M('#f3e6c8', 0.9, 0, { side: THREE.DoubleSide }));
    sailMesh.position.set(0.02, 1.25, 0);
    g.add(sailMesh);
    const jib = sailMesh.clone();
    jib.scale.set(-0.7, 0.8, 1);
    jib.material = M('#d2452e', 0.9, 0, { side: THREE.DoubleSide });
    jib.position.x = -0.02;
    g.add(jib);
    ctx.animate.push((dt, t) => (g.children.slice(-4).forEach((m) => (m.rotation.z = Math.sin(t * 0.8) * 0.03))));
    g.position.set(0, 0, z);
    ctx.group.add(g);
    ctx.addCircle(0, z, 0.75);
  },

  vgchair(ctx) {
    // Van Gogh: his rush-seated chair, with pipe.
    const z = ctx.D * 0.2;
    const g = new THREE.Group();
    const wood = M('#c99a3d', 0.6);
    const rush = M('#d8b558', 0.95);
    for (const [x, zz] of [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]]) g.add(mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.45, 8), wood, x, 0.225, zz));
    g.add(mesh(new THREE.BoxGeometry(0.46, 0.05, 0.46), rush, 0, 0.47, 0));
    for (const x of [-0.2, 0.2]) g.add(mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.55, 8), wood, x, 0.75, -0.2));
    for (const y of [0.7, 0.85, 1.0]) g.add(mesh(new THREE.BoxGeometry(0.42, 0.04, 0.025), wood, 0, y, -0.2));
    g.add(mesh(new THREE.CylinderGeometry(0.015, 0.012, 0.14, 8), M('#3a2618', 0.5), 0.05, 0.51, 0.05));
    g.add(mesh(new THREE.CylinderGeometry(0.03, 0.025, 0.05, 10), M('#3a2618', 0.5), -0.03, 0.52, 0.05));
    shadow(g, 0, 0, 1.2, 1.2);
    g.position.set(-1.0, 0, z);
    g.rotation.y = 0.5;
    ctx.group.add(g);
    ctx.addCircle(-1.0, z, 0.45);
    bench(ctx, 1.0, z, 2.0);
  },

  sunflowers(ctx) {
    // Van Gogh: a yellow vase of sunflowers on a pedestal.
    const z = -ctx.D * 0.18;
    const g = new THREE.Group();
    pedestal(g, 0, 0, 0.7, 0.95, '#e9d9a6');
    const pts = [];
    for (let i = 0; i <= 12; i++) {
      const t = i / 12;
      pts.push(new THREE.Vector2(0.1 + Math.sin(t * Math.PI * 0.9) * 0.08, t * 0.38));
    }
    g.add(mesh(new THREE.LatheGeometry(pts, 24), M('#e3b23c', 0.35), 0, 0.97, 0));
    g.add(mesh(new THREE.CylinderGeometry(0.13, 0.11, 0.02, 24), M('#2f69a8', 0.4), 0, 1.15, 0));
    const petal = M('#f2c230', 0.6, 0, { side: THREE.DoubleSide });
    const heart = M('#6b3d14', 0.9);
    const stem = M('#5a7a2a', 0.8);
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2;
      const r = 0.12 + (i % 3) * 0.08;
      const fx = Math.cos(a) * r;
      const fz = Math.sin(a) * r;
      const fy = 1.55 + (i % 4) * 0.1;
      const s = mesh(new THREE.CylinderGeometry(0.008, 0.01, fy - 1.2, 6), stem, fx / 2, (fy + 1.2) / 2, fz / 2);
      s.lookAt(new THREE.Vector3(fx, fy, fz));
      s.rotateX(Math.PI / 2);
      g.add(s);
      const f = new THREE.Group();
      f.add(mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.03, 18), heart));
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.06, 0.13, 14, 1), petal);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.005;
      f.add(ring);
      f.position.set(fx, fy, fz);
      f.rotation.x = 0.6 + Math.cos(a) * 0.4;
      f.rotation.z = -Math.sin(a) * 0.5;
      g.add(f);
    }
    g.position.set(0, 0, z);
    ctx.group.add(g);
    ctx.addCircle(0, z, 0.6);
  },

  palms(ctx) {
    plant(ctx, -ctx.W / 2 + 1.1, -ctx.D / 2 + 1.1, 1.15, true);
    plant(ctx, ctx.W / 2 - 1.1, -ctx.D / 2 + 1.1, 1.15, true);
    plant(ctx, -ctx.W / 2 + 1.1, ctx.D / 2 - 1.4, 1.0, true);
    plant(ctx, ctx.W / 2 - 1.1, ctx.D / 2 - 1.4, 1.0, true);
    bench(ctx, 0, ctx.D * 0.18);
  },

  idol(ctx) {
    // Gauguin: a carved wooden figure, after his Polynesian sculptures.
    const z = -ctx.D * 0.18;
    const g = new THREE.Group();
    g.add(mesh(new THREE.CylinderGeometry(0.5, 0.55, 0.5, 8), M('#3a2416', 0.9), 0, 0.25, 0));
    const wood = M('#8a5a32', 0.75, 0, { flatShading: true });
    const fig = new THREE.Group();
    fig.add(mesh(new THREE.CylinderGeometry(0.2, 0.26, 0.9, 8), wood, 0, 0.45, 0));
    fig.add(mesh(new THREE.BoxGeometry(0.56, 0.12, 0.3), wood, 0, 0.95, 0));
    fig.add(mesh(new THREE.CylinderGeometry(0.22, 0.2, 0.42, 8), wood, 0, 1.22, 0));
    fig.add(mesh(new THREE.SphereGeometry(0.06, 8, 6), M('#e7d7b6', 0.6), -0.08, 1.3, 0.18));
    fig.add(mesh(new THREE.SphereGeometry(0.06, 8, 6), M('#e7d7b6', 0.6), 0.08, 1.3, 0.18));
    fig.add(mesh(new THREE.BoxGeometry(0.18, 0.03, 0.05), M('#3a2416', 0.8), 0, 1.13, 0.19));
    fig.add(mesh(new THREE.ConeGeometry(0.25, 0.25, 8), wood, 0, 1.55, 0));
    fig.position.y = 0.5;
    g.add(fig);
    shadow(g, 0, 0, 1.8, 1.8);
    g.position.set(0, 0, z);
    ctx.group.add(g);
    ctx.addCircle(0, z, 0.65);
  },

  goldfish(ctx) {
    // Matisse: a goldfish bowl on a little round table.
    const z = -ctx.D * 0.18;
    const g = new THREE.Group();
    g.add(mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.04, 32), M('#d1452f', 0.5), 0, 0.85, 0));
    g.add(mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.85, 10), M('#2b2b2b', 0.4, 0.6), 0, 0.42, 0));
    g.add(mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.03, 20), M('#2b2b2b', 0.4, 0.6), 0, 0.015, 0));
    const bowl = mesh(new THREE.SphereGeometry(0.25, 32, 20), M('#dff1f3', 0.02, 0, { transparent: true, opacity: 0.28 }), 0, 1.12, 0);
    g.add(bowl);
    g.add(mesh(new THREE.SphereGeometry(0.235, 32, 16, 0, Math.PI * 2, Math.PI * 0.35, Math.PI * 0.65), M('#7fc3c9', 0.05, 0, { transparent: true, opacity: 0.35 }), 0, 1.12, 0));
    const fish = [];
    for (let i = 0; i < 4; i++) {
      const f = new THREE.Group();
      const body = mesh(new THREE.SphereGeometry(0.04, 12, 8), M('#f26a1b', 0.4));
      body.scale.set(1.6, 0.8, 0.6);
      f.add(body);
      const tail = mesh(new THREE.ConeGeometry(0.03, 0.05, 6), M('#f28a2b', 0.5), -0.07, 0, 0);
      tail.rotation.z = Math.PI / 2;
      f.add(tail);
      g.add(f);
      fish.push(f);
    }
    ctx.animate.push((dt, t) => {
      fish.forEach((f, i) => {
        const a = t * (0.5 + i * 0.12) + i * 1.6;
        f.position.set(Math.cos(a) * 0.12, 1.07 + Math.sin(t + i) * 0.04, Math.sin(a) * 0.12);
        f.rotation.y = -a - Math.PI / 2;
      });
    });
    shadow(g, 0, 0, 1.4, 1.4);
    g.position.set(0, 0, z);
    ctx.group.add(g);
    ctx.addCircle(0, z, 0.55);
    bench(ctx, 0, ctx.D * 0.18);
  },

  floatingshapes(ctx) {
    // Kandinsky: circles, triangles and lines floating like a composition.
    const z = -ctx.D * 0.05;
    const g = new THREE.Group();
    g.add(mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.12, 48), M('#1c1c1c', 0.4), 0, 0.06, 0));
    const items = [];
    const cols = ['#e2b532', '#c8372d', '#2b4fa2', '#1d1d1d', '#e97b2e', '#6a3a8f', '#3b8f6a'];
    for (let i = 0; i < 12; i++) {
      let geo;
      if (i % 3 === 0) geo = new THREE.CylinderGeometry(0.14 + (i % 4) * 0.08, 0.14 + (i % 4) * 0.08, 0.03, 40);
      else if (i % 3 === 1) geo = new THREE.CylinderGeometry(0.0, 0.3, 0.03, 3);
      else geo = new THREE.BoxGeometry(0.9, 0.025, 0.025);
      const m = mesh(geo, M(cols[i % cols.length], 0.4, 0.05), Math.cos(i * 1.9) * 1.0, 1.2 + (i % 5) * 0.35, Math.sin(i * 1.9) * 1.0);
      m.rotation.set(i * 0.7 + Math.PI / 2, i * 0.3, i * 0.5);
      g.add(m);
      items.push({ m, base: m.position.y, phase: i });
    }
    ctx.animate.push((dt, t) => {
      g.rotation.y = t * 0.07;
      items.forEach(({ m, base, phase }) => {
        m.position.y = base + Math.sin(t * 0.6 + phase) * 0.06;
        m.rotation.z += dt * 0.1;
      });
    });
    g.position.set(0, 0, z);
    ctx.group.add(g);
    ctx.addCircle(0, z, 1.75);
  },

  crystals(ctx) {
    // Franz Marc: prismatic crystals in his symbolic colours.
    const z = -ctx.D * 0.1;
    const g = new THREE.Group();
    g.add(mesh(new THREE.BoxGeometry(2.4, 0.5, 1.2), M('#121c2e', 0.6), 0, 0.25, 0));
    const cols = ['#2b62c4', '#f0c22b', '#c8342b', '#2b62c4', '#3d8f4a', '#f0c22b'];
    const crys = [];
    cols.forEach((c, i) => {
      const m = mesh(new THREE.OctahedronGeometry(0.22 + (i % 3) * 0.08, 0), M(c, 0.15, 0.1, { flatShading: true, transparent: true, opacity: 0.88 }), -0.9 + i * 0.36, 0.85 + (i % 2) * 0.25, (i % 2 ? 0.2 : -0.2));
      m.scale.y = 1.6;
      g.add(m);
      crys.push(m);
    });
    ctx.animate.push((dt, t) => crys.forEach((m, i) => (m.rotation.y = t * 0.25 + i)));
    shadow(g, 0, 0, 3.2, 1.8);
    g.position.set(0, 0, z);
    ctx.group.add(g);
    ctx.addBox(0, z, 1.3, 0.7);
    bench(ctx, 0, ctx.D * 0.22);
  },

  cubistblocks(ctx) {
    // Juan Gris: a still life split into flat planes, with a guitar silhouette.
    const z = -ctx.D * 0.18;
    const g = new THREE.Group();
    pedestal(g, 0, 0, 1.1, 0.8, '#d9d4cb');
    const cols = ['#2e3a4a', '#c9b48a', '#6b7b55', '#f0ebe0', '#8a4b3a'];
    for (let i = 0; i < 7; i++) {
      const m = mesh(new THREE.BoxGeometry(0.35 + (i % 3) * 0.12, 0.5 + (i % 2) * 0.3, 0.02), M(cols[i % cols.length], 0.7), -0.3 + (i % 4) * 0.2, 1.1 + (i % 3) * 0.08, -0.2 + (i % 3) * 0.15);
      m.rotation.y = i * 0.6;
      m.rotation.z = (i % 2 ? 0.2 : -0.15);
      g.add(m);
    }
    const gs = new THREE.Shape();
    gs.absellipse(0, 0, 0.16, 0.14, 0, Math.PI * 2);
    const hole = new THREE.Path();
    hole.absarc(0, 0.02, 0.04, 0, Math.PI * 2, true);
    gs.holes.push(hole);
    const gu = new THREE.Mesh(new THREE.ExtrudeGeometry(gs, { depth: 0.05, bevelEnabled: false }), M('#a06a35', 0.5));
    gu.position.set(0.1, 1.15, 0.2);
    g.add(gu);
    g.add(mesh(new THREE.BoxGeometry(0.05, 0.4, 0.03), M('#3a2416', 0.5), 0.1, 1.42, 0.23));
    g.position.set(0, 0, z);
    ctx.group.add(g);
    ctx.addCircle(0, z, 0.85);
  },

  discs(ctx) {
    // Delaunay: rotating rings of contrasting colour ("Circular Forms").
    const z = -ctx.D * 0.18;
    const g = new THREE.Group();
    g.add(mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.4, 10), M('#222', 0.4, 0.6), 0, 0.7, 0));
    g.add(mesh(new THREE.CylinderGeometry(0.35, 0.4, 0.06, 24), M('#222', 0.4, 0.6), 0, 0.03, 0));
    const disc = new THREE.Group();
    const cols = ['#e2462f', '#f2c12e', '#2a6bc2', '#3aa35a', '#f08a2b', '#7a3fa0', '#f5f1e6', '#1d1d1d'];
    for (let r = 0; r < 8; r++) {
      for (let q = 0; q < 4; q++) {
        const ring = new THREE.Mesh(new THREE.RingGeometry(0.1 + r * 0.11, 0.21 + r * 0.11, 32, 1, (q * Math.PI) / 2, Math.PI / 2), M(cols[(r + q * 3) % cols.length], 0.6, 0, { side: THREE.DoubleSide }));
        disc.add(ring);
      }
    }
    disc.position.y = 2.05;
    g.add(disc);
    ctx.animate.push((dt, t) => (disc.rotation.z = t * 0.2));
    g.position.set(-1.3, 0, z);
    ctx.group.add(g);
    ctx.addCircle(-1.3, z, 0.45);
    bench(ctx, 0, ctx.D * 0.2);
  },

  eiffel(ctx) {
    // Delaunay: a miniature Eiffel Tower.
    const z = -ctx.D * 0.18;
    const g = new THREE.Group();
    pedestal(g, 0, 0, 0.7, 0.7, '#e9e6df');
    const iron = M('#8a4b2e', 0.5, 0.5);
    for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      const leg = mesh(new THREE.CylinderGeometry(0.012, 0.03, 0.8, 6), iron, sx * 0.12, 1.1, sz * 0.12);
      leg.rotation.z = -sx * 0.25;
      leg.rotation.x = sz * 0.25;
      g.add(leg);
    }
    g.add(mesh(new THREE.BoxGeometry(0.28, 0.03, 0.28), iron, 0, 1.15, 0));
    g.add(mesh(new THREE.CylinderGeometry(0.01, 0.06, 0.9, 4), iron, 0, 1.95, 0));
    g.add(mesh(new THREE.BoxGeometry(0.14, 0.025, 0.14), iron, 0, 1.6, 0));
    g.position.set(1.3, 0, z);
    ctx.group.add(g);
    ctx.addCircle(1.3, z, 0.5);
  },

  colorblocks(ctx) {
    // Mondrian: benches as primary-coloured blocks with black edges.
    const blocks = [
      [-1.2, ctx.D * 0.18, 1.6, 0.45, 0.6, '#d52b1e'],
      [0.9, ctx.D * 0.18, 1.0, 0.45, 0.6, '#f5f3ee'],
      [0.2, -ctx.D * 0.15, 0.7, 0.45, 0.7, '#f2c12e'],
      [-0.6, -ctx.D * 0.15, 0.9, 0.45, 0.7, '#1f4fa3']
    ];
    for (const [x, z, w, h, d, c] of blocks) {
      const m = mesh(new THREE.BoxGeometry(w, h, d), M(c, 0.5), x, h / 2, z);
      ctx.group.add(m);
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry), new THREE.LineBasicMaterial({ color: '#111' }));
      edges.position.copy(m.position);
      ctx.group.add(edges);
      shadow(ctx.group, x, z, w + 0.6, d + 0.6);
      ctx.addBox(x, z, w / 2 + 0.05, d / 2 + 0.05);
    }
  },

  suprematist(ctx) {
    // Malevich: floating black square, red plane and a white cube.
    const z = -ctx.D * 0.12;
    const g = new THREE.Group();
    g.add(mesh(new THREE.BoxGeometry(0.9, 0.9, 0.9), M('#fbfbf9', 0.6), 0, 0.45, 0));
    const black = mesh(new THREE.BoxGeometry(0.9, 0.9, 0.04), M('#111111', 0.8), 0, 2.2, 0);
    const red = mesh(new THREE.BoxGeometry(0.5, 0.46, 0.03), M('#c72a1f', 0.7), 0.75, 1.65, 0.3);
    red.rotation.z = 0.12;
    const bar = mesh(new THREE.BoxGeometry(1.2, 0.08, 0.03), M('#1f4fa3', 0.7), -0.7, 1.5, -0.2);
    bar.rotation.z = -0.4;
    const yel = mesh(new THREE.BoxGeometry(0.3, 0.12, 0.03), M('#f2c12e', 0.7), -0.4, 2.8, 0.2);
    yel.rotation.z = 0.6;
    g.add(black, red, bar, yel);
    ctx.animate.push((dt, t) => {
      black.rotation.y = Math.sin(t * 0.2) * 0.6;
      red.position.y = 1.65 + Math.sin(t * 0.5) * 0.05;
      bar.position.y = 1.5 + Math.sin(t * 0.4 + 1) * 0.05;
      yel.position.y = 2.8 + Math.sin(t * 0.45 + 2) * 0.05;
    });
    shadow(g, 0, 0, 2, 2);
    g.position.set(0, 0, z);
    ctx.group.add(g);
    ctx.addCircle(0, z, 0.75);
    bench(ctx, 0, ctx.D * 0.22, 2.4);
  }
};

// ───────────────────────── 20th-century movements ─────────────────────────

Object.assign(THEMES, {
  gears(ctx) {
    // Dada / Picabia: mechanomorphic gears turning on a stand.
    const z = -ctx.D * 0.18;
    const g = new THREE.Group();
    g.add(mesh(new THREE.BoxGeometry(1.6, 0.8, 0.6), M('#2b2b2b', 0.5), 0, 0.4, 0));
    const metal = M('#a8a29a', 0.35, 0.85);
    const brass = M('#b48a3c', 0.3, 0.9);
    const gears = [];
    [[-0.45, 1.45, 0.42, 14, metal], [0.2, 1.75, 0.3, 10, brass], [0.62, 1.3, 0.22, 8, metal]].forEach(([x, y, r, teeth, mat], i) => {
      const gear = new THREE.Group();
      gear.add(mesh(new THREE.CylinderGeometry(r, r, 0.06, 32), mat));
      for (let t = 0; t < teeth; t++) {
        const a = (t / teeth) * Math.PI * 2;
        const tooth = mesh(new THREE.BoxGeometry(0.07, 0.06, 0.08), mat, Math.cos(a) * (r + 0.03), 0, Math.sin(a) * (r + 0.03));
        tooth.rotation.y = -a;
        gear.add(tooth);
      }
      gear.add(mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.12, 12), M('#1a1a1a', 0.4)));
      gear.rotation.x = Math.PI / 2;
      gear.position.set(x, y, 0);
      g.add(gear);
      gears.push({ gear, dir: i % 2 ? -1 : 1, speed: 0.4 / r });
      g.add(mesh(new THREE.CylinderGeometry(0.02, 0.02, y - 0.8, 6), M('#1a1a1a', 0.4), x, (y + 0.8) / 2, -0.05));
    });
    ctx.animate.push((dt) => gears.forEach((o) => (o.gear.rotation.y += dt * o.dir * o.speed * 0.3)));
    shadow(g, 0, 0, 2.4, 1.4);
    g.position.set(0, 0, z);
    ctx.group.add(g);
    ctx.addBox(0, z, 0.85, 0.35);
    bench(ctx, 0, ctx.D * 0.2);
  },

  merz(ctx) {
    // Schwitters: a Merz column assembled from found fragments.
    const z = -ctx.D * 0.18;
    const g = new THREE.Group();
    const cols = ['#c9b48a', '#8a4b3a', '#2e3a4a', '#e8e2d6', '#b23a2a', '#4f6b3a', '#d8c24a'];
    let y = 0;
    for (let i = 0; i < 9; i++) {
      const w = 0.35 + ((i * 37) % 10) / 22;
      const h = 0.18 + ((i * 53) % 10) / 40;
      const piece = mesh(new THREE.BoxGeometry(w, h, 0.3 + ((i * 29) % 10) / 30), M(cols[i % cols.length], 0.8), ((i * 7) % 5 - 2) * 0.05, y + h / 2, 0);
      piece.rotation.y = i * 0.5;
      g.add(piece);
      y += h;
    }
    g.add(mesh(new THREE.CylinderGeometry(0.12, 0.15, 0.25, 6), M('#7a5a35', 0.6), 0.05, y + 0.12, 0));
    g.add(mesh(new THREE.TorusGeometry(0.16, 0.025, 8, 24), M('#9a9a9a', 0.4, 0.7), -0.1, y + 0.35, 0));
    shadow(g, 0, 0, 1.6, 1.6);
    g.position.set(0, 0, z);
    ctx.group.add(g);
    ctx.addCircle(0, z, 0.55);
    bench(ctx, 0, ctx.D * 0.2);
  },

  dadahead(ctx) {
    // Taeuber-Arp: a turned and painted wooden head on a plinth.
    const z = -ctx.D * 0.18;
    const g = new THREE.Group();
    pedestal(g, 0, 0, 0.7, 1.0, '#f1efe9');
    const pts = [];
    for (let i = 0; i <= 16; i++) {
      const t = i / 16;
      pts.push(new THREE.Vector2(0.03 + Math.sin(t * Math.PI) * 0.17 + (t < 0.15 ? 0.06 : 0), t * 0.5));
    }
    const head = new THREE.Mesh(new THREE.LatheGeometry(pts, 32), M('#e9d8b4', 0.6));
    head.position.y = 1.02;
    g.add(head);
    [['#2b62c4', 0.12, 0.2], ['#d2452e', -0.1, 0.3], ['#1d1d1d', 0.0, 0.42]].forEach(([c, x, y]) => {
      const dot = mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.01, 16), M(c, 0.5), x, 1.02 + y, 0.17);
      dot.rotation.x = Math.PI / 2;
      g.add(dot);
    });
    g.position.set(0, 0, z);
    ctx.group.add(g);
    ctx.addCircle(0, z, 0.55);
    bench(ctx, 0, ctx.D * 0.2);
  },

  biomorphs(ctx) {
    // Tanguy: smooth, bone-like forms on a bare plain, with long shadows.
    const z = -ctx.D * 0.05;
    const g = new THREE.Group();
    const stone = [M('#c9c2b6', 0.35), M('#9ea7ad', 0.35), M('#d9cdb8', 0.35), M('#7d8a92', 0.3)];
    for (let i = 0; i < 7; i++) {
      const f = new THREE.Group();
      const body = mesh(new THREE.SphereGeometry(0.22 + (i % 3) * 0.08, 24, 16), stone[i % stone.length]);
      body.scale.set(1, 1.6 + (i % 2) * 0.8, 0.8);
      body.position.y = 0.35 + (i % 3) * 0.12;
      f.add(body);
      const tip = mesh(new THREE.ConeGeometry(0.06, 0.4, 16), stone[(i + 1) % stone.length], 0, body.position.y + 0.45 + (i % 2) * 0.2, 0);
      f.add(tip);
      const a = i * 0.9;
      f.position.set(Math.cos(a) * (0.6 + (i % 3) * 0.45), 0, Math.sin(a) * (0.5 + (i % 2) * 0.4));
      f.rotation.z = ((i % 3) - 1) * 0.15;
      g.add(f);
      shadow(g, f.position.x + 0.5, f.position.z + 0.3, 1.6, 0.6);
    }
    g.position.set(0, 0, z);
    ctx.group.add(g);
    ctx.addCircle(0, z, 1.6);
  },

  mirostars(ctx) {
    // In the spirit of Miró: a hanging mobile of stars, moons and coloured discs.
    const z = -ctx.D * 0.1;
    const g = new THREE.Group();
    const cols = ['#d52b1e', '#1f4fa3', '#f2c12e', '#1d1d1d', '#2f8a4a'];
    const arm = new THREE.Group();
    arm.position.y = 4.6;
    arm.add(mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.8, 4), M('#111', 0.5), 0, 0.4, 0));
    const shapes = [];
    for (let i = 0; i < 9; i++) {
      const c = cols[i % cols.length];
      let geo;
      if (i % 3 === 0) {
        const st = new THREE.Shape();
        for (let k = 0; k < 10; k++) {
          const r = k % 2 ? 0.07 : 0.18;
          const a = (k / 10) * Math.PI * 2;
          k ? st.lineTo(Math.cos(a) * r, Math.sin(a) * r) : st.moveTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        geo = new THREE.ExtrudeGeometry(st, { depth: 0.02, bevelEnabled: false });
      } else if (i % 3 === 1) {
        const mo = new THREE.Shape();
        mo.absarc(0, 0, 0.16, 0, Math.PI * 2, false);
        const hole = new THREE.Path();
        hole.absarc(0.07, 0.03, 0.14, 0, Math.PI * 2, true);
        mo.holes.push(hole);
        geo = new THREE.ExtrudeGeometry(mo, { depth: 0.02, bevelEnabled: false });
      } else geo = new THREE.CylinderGeometry(0.12 + (i % 2) * 0.06, 0.12 + (i % 2) * 0.06, 0.02, 32);
      const m = mesh(geo, M(c, 0.5, 0, { side: THREE.DoubleSide }));
      if (i % 3 === 2) m.rotation.x = Math.PI / 2;
      const holder = new THREE.Group();
      const len = 0.6 + (i % 4) * 0.35;
      holder.add(mesh(new THREE.CylinderGeometry(0.004, 0.004, len, 4), M('#111', 0.5), 0, -len / 2, 0));
      m.position.y = -len;
      holder.add(m);
      const a = (i / 9) * Math.PI * 2;
      holder.position.set(Math.cos(a) * (0.5 + (i % 3) * 0.35), 0, Math.sin(a) * (0.5 + (i % 3) * 0.35));
      arm.add(holder);
      shapes.push({ holder, phase: i });
    }
    g.add(arm);
    ctx.animate.push((dt, t) => {
      arm.rotation.y = t * 0.08;
      shapes.forEach(({ holder, phase }) => (holder.rotation.y = Math.sin(t * 0.5 + phase) * 0.6));
    });
    g.position.set(0, 0, z);
    ctx.group.add(g);
    bench(ctx, 0, ctx.D * 0.22);
  },

  triadic(ctx) {
    // Schlemmer: two figures in the geometric costumes of the Triadic Ballet.
    const z = -ctx.D * 0.18;
    const g = new THREE.Group();
    g.add(mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.15, 40), M('#1d1d1d', 0.5), 0, 0.075, 0));
    const fig = (x, cols) => {
      const f = new THREE.Group();
      f.add(mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.7, 8), M('#e8e2d6', 0.5), -0.08, 0.5, 0));
      f.add(mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.7, 8), M('#e8e2d6', 0.5), 0.08, 0.5, 0));
      f.add(mesh(new THREE.ConeGeometry(0.4, 0.5, 24, 1, true), M(cols[0], 0.5, 0, { side: THREE.DoubleSide }), 0, 1.0, 0));
      f.add(mesh(new THREE.SphereGeometry(0.2, 24, 16), M(cols[1], 0.4), 0, 1.35, 0));
      f.add(mesh(new THREE.SphereGeometry(0.12, 24, 16), M('#f2efe9', 0.3), 0, 1.68, 0));
      f.add(mesh(new THREE.CylinderGeometry(0.0, 0.14, 0.25, 4), M(cols[2], 0.4), 0, 1.88, 0));
      for (const sx of [-1, 1]) {
        const arm = mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.5, 8), M(cols[1], 0.4), sx * 0.3, 1.35, 0);
        arm.rotation.z = sx * 1.1;
        f.add(arm);
        f.add(mesh(new THREE.SphereGeometry(0.06, 12, 8), M(cols[2], 0.4), sx * 0.52, 1.47, 0));
      }
      f.position.set(x, 0.15, 0);
      return f;
    };
    const a = fig(-0.5, ['#d52b1e', '#f2c12e', '#1d1d1d']);
    const b = fig(0.5, ['#1f4fa3', '#e8e2d6', '#d52b1e']);
    g.add(a, b);
    ctx.animate.push((dt, t) => {
      a.rotation.y = Math.sin(t * 0.4) * 0.6;
      b.rotation.y = -Math.sin(t * 0.4 + 1) * 0.6;
    });
    g.position.set(0, 0, z);
    ctx.group.add(g);
    ctx.addCircle(0, z, 1.3);
    bench(ctx, 0, ctx.D * 0.22);
  },

  proun(ctx) {
    // Lissitzky / Constructivism: a floating 'Proun' of planes and volumes.
    const z = -ctx.D * 0.12;
    const g = new THREE.Group();
    g.add(mesh(new THREE.BoxGeometry(1.4, 0.06, 1.4), M('#1d1d1d', 0.5), 0, 0.03, 0));
    const parts = [
      [new THREE.BoxGeometry(1.2, 0.08, 0.6), '#d9d4cb', 0, 1.6, 0, 0.2],
      [new THREE.BoxGeometry(0.3, 0.3, 0.3), '#c72a1f', 0.35, 1.85, 0.1, 0.5],
      [new THREE.CylinderGeometry(0.15, 0.15, 0.6, 24), '#1d1d1d', -0.4, 1.3, 0.1, 0.9],
      [new THREE.BoxGeometry(0.05, 1.2, 0.05), '#1d1d1d', 0.1, 1.2, -0.2, -0.4],
      [new THREE.ConeGeometry(0.22, 0.5, 3), '#c72a1f', -0.2, 2.2, 0.0, 1.2]
    ];
    const meshes = parts.map(([geo, c, x, y, zz, r]) => {
      const m = mesh(geo, M(c, 0.5), x, y, zz);
      m.rotation.set(r * 0.3, r, r * 0.5);
      g.add(m);
      return m;
    });
    ctx.animate.push((dt, t) => {
      g.children.slice(1).forEach((m, i) => (m.position.y = parts[i][3] + Math.sin(t * 0.5 + i) * 0.04));
      g.rotation.y = Math.sin(t * 0.15) * 0.3;
    });
    g.position.set(0, 0, z);
    ctx.group.add(g);
    ctx.addCircle(0, z, 0.85);
    bench(ctx, 0, ctx.D * 0.22);
  },

  colorgrid(ctx) {
    // Klee's 'magic squares': a rug of softly modulated colour squares.
    const S = 512;
    const c = document.createElement('canvas');
    c.width = c.height = S;
    const g2 = c.getContext('2d');
    const pal = ['#c96d4a', '#e2b45c', '#7a8f5a', '#5a7fa3', '#a35a6d', '#d9c9a0', '#6b5a8f', '#c98f5a'];
    const n = 8;
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++) {
        g2.fillStyle = pal[(i * 3 + j * 5 + ((i * j) % 3)) % pal.length];
        g2.fillRect((i * S) / n, (j * S) / n, S / n + 1, S / n + 1);
      }
    g2.globalAlpha = 0.15;
    for (let k = 0; k < 3000; k++) {
      g2.fillStyle = k % 2 ? '#fff' : '#000';
      g2.fillRect(Math.random() * S, Math.random() * S, 2, 2);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    const rug = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 3.2), new THREE.MeshStandardMaterial({ map: tex, roughness: 1 }));
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(0, 0.008, 0);
    rug.userData.noShadow = true;
    ctx.group.add(rug);
    bench(ctx, 0, 0, 2.0);
  }
});

export function buildProps(ctx, list) {
  for (const p of list) {
    const fn = THEMES[p];
    if (fn) fn(ctx);
  }
}
