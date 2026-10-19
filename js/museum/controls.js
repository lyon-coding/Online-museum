// First-person controls that work with mouse, keyboard and touch.
//  - drag anywhere to look around
//  - WASD / arrow keys to walk (arrows left/right turn), Shift to walk faster
//  - on touch screens: a joystick at the bottom left
//  - a short tap/click is reported to the app (open a painting, walk to a spot…)

export class Controls {
  constructor(dom, { joystick, onTap, onHover } = {}) {
    this.dom = dom;
    this.onTap = onTap;
    this.onHover = onHover;
    this.yaw = 0;
    this.pitch = 0;
    this.x = 0;
    this.z = 0;
    this.enabled = true;
    this.keys = new Set();
    this.joy = { x: 0, y: 0 };
    this.target = null; // walk-to target {x, z}
    this.stuck = 0;
    this.speed = 2.4;
    this._drag = null;
    this._bind();
    if (joystick) this._bindJoystick(joystick);
  }

  setPose(x, z, yaw) {
    this.x = x;
    this.z = z;
    this.yaw = yaw;
    this.pitch = 0;
    this.target = null;
  }

  walkTo(x, z) {
    this.target = { x, z };
    this.stuck = 0;
  }

  _bind() {
    const el = this.dom;
    el.addEventListener('contextmenu', (e) => e.preventDefault());
    el.addEventListener('pointerdown', (e) => {
      if (!this.enabled) return;
      if (this._drag) return; // single-pointer look
      el.setPointerCapture(e.pointerId);
      this._drag = { id: e.pointerId, x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, t: performance.now(), moved: 0, type: e.pointerType };
    });
    el.addEventListener('pointermove', (e) => {
      const d = this._drag;
      if (d && d.id === e.pointerId) {
        const dx = e.clientX - d.x;
        const dy = e.clientY - d.y;
        d.x = e.clientX;
        d.y = e.clientY;
        d.moved += Math.abs(dx) + Math.abs(dy);
        if (d.moved > 6) {
          const k = d.type === 'touch' ? 0.0055 : 0.0038;
          this.yaw += dx * k;
          this.pitch = Math.max(-1.1, Math.min(1.1, this.pitch + dy * k));
          this.target = null;
          el.classList.add('dragging');
        }
      } else if (!d && e.pointerType === 'mouse' && this.onHover) {
        this.onHover(e.clientX, e.clientY);
      }
    });
    const end = (e) => {
      const d = this._drag;
      if (!d || d.id !== e.pointerId) return;
      this._drag = null;
      el.classList.remove('dragging');
      const dt = performance.now() - d.t;
      if (e.type === 'pointerup' && d.moved < 8 && dt < 500 && this.enabled && this.onTap) this.onTap(e.clientX, e.clientY);
    };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
    el.addEventListener('pointerleave', () => this.onHover && this.onHover(null));

    window.addEventListener('keydown', (e) => {
      if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
      const k = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'q', 'e', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'shift'].includes(k)) {
        this.keys.add(k);
        this.target = null;
        if (k.startsWith('arrow') && this.enabled) e.preventDefault();
      }
    });
    window.addEventListener('keyup', (e) => this.keys.delete(e.key.toLowerCase()));
    window.addEventListener('blur', () => this.keys.clear());
  }

  _bindJoystick(base) {
    const knob = base.querySelector('.knob');
    let id = null;
    let cx = 0;
    let cy = 0;
    const R = 46;
    const set = (x, y) => {
      let dx = x - cx;
      let dy = y - cy;
      const len = Math.hypot(dx, dy);
      if (len > R) {
        dx = (dx / len) * R;
        dy = (dy / len) * R;
      }
      knob.style.transform = `translate(${dx}px, ${dy}px)`;
      this.joy.x = dx / R;
      this.joy.y = -dy / R;
    };
    base.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      id = e.pointerId;
      base.setPointerCapture(id);
      const r = base.getBoundingClientRect();
      cx = r.left + r.width / 2;
      cy = r.top + r.height / 2;
      this.target = null;
      set(e.clientX, e.clientY);
    });
    base.addEventListener('pointermove', (e) => {
      if (e.pointerId === id) set(e.clientX, e.clientY);
    });
    const end = (e) => {
      if (e.pointerId !== id) return;
      id = null;
      this.joy.x = this.joy.y = 0;
      knob.style.transform = '';
    };
    base.addEventListener('pointerup', end);
    base.addEventListener('pointercancel', end);
  }

  /** Returns the desired horizontal displacement for this frame. */
  update(dt) {
    let fwd = 0;
    let side = 0;
    let turn = 0;
    if (this.enabled) {
      const k = this.keys;
      if (k.has('w') || k.has('arrowup')) fwd += 1;
      if (k.has('s') || k.has('arrowdown')) fwd -= 1;
      if (k.has('d')) side += 1;
      if (k.has('a')) side -= 1;
      if (k.has('arrowleft') || k.has('q')) turn += 1;
      if (k.has('arrowright') || k.has('e')) turn -= 1;
      fwd += this.joy.y;
      // joystick sideways: turn when mostly sideways and not moving forward, else strafe a little
      if (Math.abs(this.joy.x) > 0.15) {
        if (Math.abs(this.joy.y) < 0.35) turn -= this.joy.x * 0.9;
        else side += this.joy.x * 0.5;
      }
    }
    this.yaw += turn * 1.8 * dt;
    const run = this.keys.has('shift') ? 1.8 : 1;
    const sin = Math.sin(this.yaw);
    const cos = Math.cos(this.yaw);
    let dx = (-sin * fwd + cos * side) * this.speed * run * dt;
    let dz = (-cos * fwd - sin * side) * this.speed * run * dt;

    if (this.target && fwd === 0 && side === 0) {
      const tx = this.target.x - this.x;
      const tz = this.target.z - this.z;
      const dist = Math.hypot(tx, tz);
      if (dist < 0.12) this.target = null;
      else {
        const step = Math.min(dist, this.speed * 1.15 * dt * Math.min(1, dist * 1.5 + 0.3));
        dx = (tx / dist) * step;
        dz = (tz / dist) * step;
      }
    }
    return { dx, dz, moving: Math.abs(dx) + Math.abs(dz) > 1e-5 };
  }
}
