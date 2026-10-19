// Full-screen painting viewer: enlarged image, description, source and licence.
import { esc } from './util.js';

export class Viewer {
  constructor(root, { onClose } = {}) {
    this.root = root;
    this.onClose = onClose;
    this.works = [];
    this.index = 0;
    root.innerHTML = `
      <div class="viewer-backdrop" data-close></div>
      <div class="viewer-box" role="dialog" aria-modal="true" aria-label="Painting">
        <button class="icon-btn viewer-close" data-close aria-label="Close">✕</button>
        <div class="viewer-image">
          <div class="spinner"></div>
          <img alt="" />
          <button class="icon-btn nav prev" aria-label="Previous painting">‹</button>
          <button class="icon-btn nav next" aria-label="Next painting">›</button>
          <span class="zoom-hint">Tap the image to zoom</span>
        </div>
        <div class="viewer-text">
          <div class="viewer-count"></div>
          <h2 class="viewer-title"></h2>
          <div class="viewer-meta"></div>
          <p class="viewer-desc"></p>
          <div class="viewer-credit"></div>
        </div>
      </div>`;
    this.img = root.querySelector('img');
    this.imgBox = root.querySelector('.viewer-image');
    root.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => this.close()));
    root.querySelector('.prev').addEventListener('click', (e) => {
      e.stopPropagation();
      this.go(-1);
    });
    root.querySelector('.next').addEventListener('click', (e) => {
      e.stopPropagation();
      this.go(1);
    });
    this.img.addEventListener('load', () => this.imgBox.classList.remove('loading'));
    this.img.addEventListener('error', () => this._fallback());
    this.img.addEventListener('click', () => this._toggleZoom());
    window.addEventListener('keydown', (e) => {
      if (!this.isOpen()) return;
      if (e.key === 'Escape') this.close();
      if (e.key === 'ArrowLeft') this.go(-1);
      if (e.key === 'ArrowRight') this.go(1);
    });
  }

  isOpen() {
    return this.root.classList.contains('open');
  }

  open(works, index, artist) {
    this.works = works;
    this.artist = artist;
    this.index = index;
    this.root.classList.add('open');
    this._render();
  }

  close() {
    if (!this.isOpen()) return;
    this.root.classList.remove('open');
    this.imgBox.classList.remove('zoomed');
    this.img.removeAttribute('src');
    this.onClose && this.onClose();
  }

  go(d) {
    if (!this.works.length) return;
    this.index = (this.index + d + this.works.length) % this.works.length;
    this._render();
  }

  _toggleZoom() {
    const zoomed = this.imgBox.classList.toggle('zoomed');
    const info = this.works[this.index].info;
    if (zoomed && info && !info.placeholder) {
      const big = info.ow && info.ow > 3000 ? info.thumb.replace(/\/\d+px-/, '/1920px-') : info.url;
      if (big && big !== this.img.src) {
        this._sources = [big, info.thumb];
        this.img.src = big;
      }
    }
  }

  _fallback() {
    if (this._sources && this._sources.length > 1) {
      this._sources.shift();
      this.img.src = this._sources[0];
    } else this.imgBox.classList.remove('loading');
  }

  _render() {
    const { painting, info } = this.works[this.index];
    const a = this.artist;
    this.imgBox.classList.remove('zoomed');
    this.imgBox.classList.add('loading');
    this.root.querySelector('.viewer-count').textContent = `${a.name} · painting ${this.index + 1} of ${this.works.length}`;
    this.root.querySelector('.viewer-title').textContent = painting.title;
    this.root.querySelector('.viewer-meta').innerHTML = [esc(painting.date), painting.collection ? esc(painting.collection) : ''].filter(Boolean).join(' · ');
    this.root.querySelector('.viewer-desc').textContent = painting.desc;
    const credit = this.root.querySelector('.viewer-credit');
    if (info && !info.placeholder) {
      this._sources = [info.thumb, info.url];
      this.img.src = info.thumb;
      this.img.alt = `${painting.title} by ${a.name}`;
      credit.innerHTML = `Image: <a href="${esc(info.page)}" target="_blank" rel="noopener">Wikimedia Commons</a> · ${esc(info.license || 'Public domain')}${info.credit ? ' · ' + esc(info.credit) : ''}`;
    } else {
      this._sources = null;
      this.img.removeAttribute('src');
      this.imgBox.classList.remove('loading');
      credit.textContent = 'Developer placeholder — no image loaded.';
    }
  }
}
