// Timeline + family tree: movements as lanes, artists as bars, influences as curves.
// Tap an artist to see their roots and legacy, then enter their room.
import { esc } from './util.js';

const Y0 = 1855;
const Y1 = 1945;
const PX = 13; // pixels per year
const ROW = 30;
const BAR = 20;
const LANE_PAD = 12;
const AXIS = 34;
const NS = 'http://www.w3.org/2000/svg';

export class Timeline {
  constructor(root, { movements, onEnter, onLobby }) {
    this.root = root;
    this.movements = movements;
    this.onEnter = onEnter;
    root.innerHTML = `
      <div class="sheet-panel" role="dialog" aria-modal="true" aria-label="Timeline">
        <div class="sheet-head">
          <div>
            <h2>Timeline</h2>
            <p>How each movement grew out of the last. Tap an artist to see their roots and legacy, then enter their room.</p>
          </div>
          <div class="sheet-actions">
            <button class="btn ghost" data-lobby>Entrance hall</button>
            <button class="icon-btn" data-close aria-label="Close">✕</button>
          </div>
        </div>
        <div class="tl-body">
          <div class="tl-labels"></div>
          <div class="tl-scroll"><svg class="tl-svg"></svg></div>
        </div>
        <div class="tl-detail"></div>
      </div>`;
    root.querySelector('[data-close]').addEventListener('click', () => this.close());
    root.querySelector('[data-lobby]').addEventListener('click', () => {
      this.close();
      onLobby && onLobby();
    });
    root.addEventListener('click', (e) => {
      if (e.target === root) this.close();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) this.close();
    });
    this.svg = root.querySelector('svg');
    this.labels = root.querySelector('.tl-labels');
    this.detail = root.querySelector('.tl-detail');
    this.scroll = root.querySelector('.tl-scroll');
  }

  isOpen() {
    return this.root.classList.contains('open');
  }

  /** artists: [{id, name, short, born, died, movement, start, end, count, roots}] */
  setData(artists, influences, contemporaries) {
    this.artists = artists;
    this.byId = Object.fromEntries(artists.map((a) => [a.id, a]));
    this.influences = influences.filter((e) => this.byId[e.from] && this.byId[e.to]);
    this.contemporaries = contemporaries.filter((e) => this.byId[e.a] && this.byId[e.b]);
    this._layout();
  }

  _x(year) {
    return 20 + (year - Y0) * PX;
  }

  _layout() {
    const svg = this.svg;
    svg.innerHTML = '';
    this.labels.innerHTML = '';
    const width = this._x(Y1) + 30;
    let y = AXIS;
    this.lanes = [];
    for (const m of this.movements) {
      const list = this.artists.filter((a) => a.movement === m.id).sort((a, b) => a.start - b.start);
      if (!list.length) continue;
      const rowsEnd = [];
      for (const a of list) {
        const labelYears = (a.short.length * 7.2 + 14) / PX;
        const occEnd = Math.max(a.end, a.start + labelYears) + 1.5;
        let r = rowsEnd.findIndex((e) => e <= a.start);
        if (r === -1) {
          r = rowsEnd.length;
          rowsEnd.push(occEnd);
        } else rowsEnd[r] = occEnd;
        a._row = r;
      }
      const h = rowsEnd.length * ROW + LANE_PAD * 2;
      for (const a of list) a._y = y + LANE_PAD + a._row * ROW + ROW / 2;
      this.lanes.push({ m, y, h });
      y += h;
    }
    const height = y + 10;
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    const el = (tag, attrs, parent = svg) => {
      const e = document.createElementNS(NS, tag);
      for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
      parent.appendChild(e);
      return e;
    };

    // lanes
    this.lanes.forEach((l, i) => {
      el('rect', { x: 0, y: l.y, width, height: l.h, class: 'tl-lane' + (i % 2 ? ' alt' : '') });
      // movement period band
      el('rect', { x: this._x(l.m.start), y: l.y + 3, width: (Math.min(l.m.end, Y1) - l.m.start) * PX, height: l.h - 6, rx: 8, fill: l.m.color, class: 'tl-band' });
      const lab = document.createElement('button');
      lab.className = 'tl-label';
      lab.style.height = l.h + 'px';
      lab.style.setProperty('--c', l.m.color);
      lab.innerHTML = `<span>${esc(l.m.short)}</span><small>${l.m.start}–${l.m.end}</small>`;
      lab.addEventListener('click', () => this.selectMovement(l.m.id));
      this.labels.appendChild(lab);
    });
    this.labels.style.paddingTop = AXIS + 'px';

    // axis
    for (let yr = 1860; yr <= 1940; yr += 5) {
      const major = yr % 10 === 0;
      el('line', { x1: this._x(yr), x2: this._x(yr), y1: major ? 18 : 24, y2: height, class: major ? 'tl-grid major' : 'tl-grid' });
      if (major) {
        const t = el('text', { x: this._x(yr), y: 14, class: 'tl-year' });
        t.textContent = yr;
      }
    }

    // edges
    this.edgeEls = [];
    const eg = el('g', { class: 'tl-edges' });
    const color = (id) => (this.movements.find((m) => m.id === this.byId[id].movement) || {}).color || '#888';
    for (const e of this.influences) {
      const s = this.byId[e.from];
      const t = this.byId[e.to];
      const xs = this._x(Math.min(s.end, Math.max(s.start + 1, t.start)));
      const xt = this._x(t.start);
      const dx = Math.max(40, Math.abs(xt - xs) * 0.5);
      const d = `M${xs},${s._y} C${xs + dx},${s._y} ${xt - dx},${t._y} ${xt},${t._y}`;
      const p = el('path', { d, class: 'tl-edge', stroke: color(e.from), 'marker-end': 'url(#arrow)' }, eg);
      this.edgeEls.push({ el: p, a: e.from, b: e.to, kind: 'inf' });
    }
    for (const e of this.contemporaries) {
      const s = this.byId[e.a];
      const t = this.byId[e.b];
      const xs = this._x((s.start + s.end) / 2);
      const xt = this._x((t.start + t.end) / 2);
      const p = el('path', { d: `M${xs},${s._y} Q${(xs + xt) / 2 + 30},${(s._y + t._y) / 2} ${xt},${t._y}`, class: 'tl-edge contemp', stroke: color(e.a) }, eg);
      this.edgeEls.push({ el: p, a: e.a, b: e.b, kind: 'con' });
    }
    const defs = el('defs', {});
    const mk = el('marker', { id: 'arrow', viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto-start-reverse' }, defs);
    el('path', { d: 'M0,0 L10,5 L0,10 z', fill: 'context-stroke' }, mk);

    // artist bars
    this.barEls = {};
    for (const a of this.artists) {
      const m = this.movements.find((mm) => mm.id === a.movement);
      const g = el('g', { class: 'tl-artist', tabindex: 0, role: 'button', 'aria-label': `${a.name}, ${a.start}–${a.end}` });
      el('rect', { x: this._x(a.start), y: a._y - BAR / 2, width: Math.max(6, (a.end - a.start) * PX), height: BAR, rx: BAR / 2, fill: m.color, class: 'tl-bar' }, g);
      const t = el('text', { x: this._x(a.start) + 8, y: a._y + 4.5, class: 'tl-name' }, g);
      t.textContent = a.short;
      g.addEventListener('click', () => this.select(a.id));
      g.addEventListener('dblclick', () => this._enter(a.id));
      g.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') this._enter(a.id);
      });
      this.barEls[a.id] = g;
    }
  }

  open(currentId) {
    this.current = currentId;
    this.root.classList.add('open');
    if (currentId && this.byId[currentId]) {
      this.select(currentId);
      const a = this.byId[currentId];
      requestAnimationFrame(() => (this.scroll.scrollLeft = Math.max(0, this._x(a.start) - this.scroll.clientWidth / 3)));
    } else this.selectMovement(this.movements[0].id);
    for (const [id, g] of Object.entries(this.barEls)) g.classList.toggle('current', id === currentId);
  }

  close() {
    this.root.classList.remove('open');
  }

  _enter(id) {
    this.close();
    this.onEnter && this.onEnter(id);
  }

  _highlight(ids, edgesOf) {
    for (const [id, g] of Object.entries(this.barEls)) g.classList.toggle('dim', ids && !ids.has(id));
    for (const e of this.edgeEls) e.el.classList.toggle('hl', !!edgesOf && (e.a === edgesOf || e.b === edgesOf));
  }

  select(id) {
    const a = this.byId[id];
    if (!a) return;
    const m = this.movements.find((mm) => mm.id === a.movement);
    const roots = this.influences.filter((e) => e.to === id);
    const legacy = this.influences.filter((e) => e.from === id);
    const cons = this.contemporaries.filter((e) => e.a === id || e.b === id);
    const ids = new Set([id, ...roots.map((e) => e.from), ...legacy.map((e) => e.to), ...cons.map((e) => (e.a === id ? e.b : e.a))]);
    this._highlight(ids, id);
    for (const [k, g] of Object.entries(this.barEls)) g.classList.toggle('selected', k === id);
    const chip = (other, text) => {
      const o = this.byId[other];
      const om = this.movements.find((mm) => mm.id === o.movement);
      return `<button class="rel-chip" data-id="${o.id}" style="--c:${om.color}" title="${esc(text)}">${esc(o.name)}</button>`;
    };
    const group = (title, list) => (list.length ? `<div class="rel-group"><h4>${title}</h4>${list.join('')}</div>` : '');
    this.detail.innerHTML = `
      <div class="tl-detail-head">
        <div>
          <span class="chip" style="--c:${m.color}">${esc(m.short)}</span>
          <h3>${esc(a.name)}</h3>
          <div class="muted">${a.born}–${a.died} · ${a.count} painting${a.count === 1 ? '' : 's'} on view, ${a.start}–${a.end}</div>
        </div>
        <button class="btn primary" data-enter>${id === this.current ? 'Back to this room' : 'Enter room →'}</button>
      </div>
      <p class="tl-roots"><strong>Roots:</strong> ${esc(a.roots)}</p>
      <div class="rel">
        ${group('Came from', roots.map((e) => chip(e.from, e.text)))}
        ${group('Led to', legacy.map((e) => chip(e.to, e.text)))}
        ${group('Contemporaries', cons.map((e) => chip(e.a === id ? e.b : e.a, e.text)))}
      </div>`;
    this.detail.querySelector('[data-enter]').addEventListener('click', () => this._enter(id));
    this.detail.querySelectorAll('.rel-chip').forEach((b) => b.addEventListener('click', () => this.select(b.dataset.id)));
  }

  selectMovement(mid) {
    const m = this.movements.find((mm) => mm.id === mid);
    const list = this.artists.filter((a) => a.movement === mid);
    this._highlight(new Set(list.map((a) => a.id)), null);
    for (const g of Object.values(this.barEls)) g.classList.remove('selected');
    this.detail.innerHTML = `
      <div class="tl-detail-head">
        <div>
          <span class="chip" style="--c:${m.color}">${m.start}–${m.end}</span>
          <h3>${esc(m.name)}</h3>
        </div>
      </div>
      <div class="mv-cols">
        <div><h4>Where it came from</h4><p>${esc(m.roots)}</p></div>
        <div><h4>What it became</h4><p>${esc(m.became)}</p></div>
      </div>
      <div class="rel"><div class="rel-group"><h4>Artists in this museum</h4>
        ${list.map((a) => `<button class="rel-chip" data-id="${a.id}" style="--c:${m.color}">${esc(a.name)}</button>`).join('') || '<span class="muted">None on view.</span>'}
      </div></div>`;
    this.detail.querySelectorAll('.rel-chip').forEach((b) => b.addEventListener('click', () => this.select(b.dataset.id)));
  }
}
