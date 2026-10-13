// «Кисть» (II, the castle): the insert `canvas` is open — three nails on the painting. The player draws
// the brush over them, the button held; the scene shows it all with its keys nail1…nail3 (how far each is
// painted, 0…1). Where each nail is: the insert's points canvas#nail1…3. Nothing of its own on the screen
// but the hint. Space paints the lowest unpainted nail by 0.2.
//   → { order: the nails (1…3) in the order they were painted, seconds: how long it took }
const NAILS = [1, 2, 3];
const RADIUS = 0.1; // of the frame's height
const NEAR = 44; // px: at least this near a nail counts
const LENGTH = 0.9; // frame heights of the brush's path that paint a nail whole
const SPACE = 0.2;
const END = 800; // ms: from the last nail to the end

export default {
  title: 'Кисть', // (as the author's ☰ lists it)
  about: 15,
  skipped: { order: [3, 1, 2], seconds: 0 },
  async run(g, b, opts, signal) {
    const t0 = performance.now();
    const paint = { 1: 0, 2: 0, 3: 0 }, sent = { 1: 0, 2: 0, 3: 0 };
    const order = [];
    let off = g.hint('Води кистью по гвоздям'), pointer = null, last = null, frame = 0, ending = 0, finish;

    const unpainted = () => NAILS.filter(n => paint[n] < 1);
    // the nearest unpainted nail to (x, y), within max(RADIUS of the frame's height, NEAR)
    const nailAt = (x, y) => {
      const reach = Math.max(RADIUS * b.frame().h, NEAR);
      let best = null, away = reach;
      for (const n of unpainted()) {
        const p = b.where(`canvas#nail${n}`);
        const d = p && Math.hypot(x - p.x, y - p.y);
        if (p && d <= away) { best = n; away = d; }
      }
      return best;
    };
    const add = (n, by) => {
      paint[n] = Math.min(1, paint[n] + by);
      if (paint[n] >= 1) order.push(n);
      off?.();
      off = null;
      if (!ending && !unpainted().length) ending = setTimeout(finish, END);
    };

    const layer = document.createElement('div');
    layer.style.cssText = 'position:absolute;inset:0;touch-action:none';
    b.layer.append(layer);
    const down = e => {
      if (e.button > 0 || pointer != null) return;
      e.preventDefault();
      pointer = e.pointerId;
      layer.setPointerCapture?.(e.pointerId);
      last = { x: e.clientX, y: e.clientY };
      g.sound.brush();
    };
    const move = e => {
      if (e.pointerId !== pointer) return;
      const n = nailAt(e.clientX, e.clientY);
      if (n) add(n, Math.hypot(e.clientX - last.x, e.clientY - last.y) / b.frame().h / LENGTH);
      last = { x: e.clientX, y: e.clientY };
    };
    const up = e => { if (e.pointerId === pointer) pointer = null; };
    const key = e => {
      if (e.code !== 'Space' || e.repeat) return;
      e.preventDefault();
      const n = unpainted()[0];
      if (n) add(n, SPACE);
    };
    layer.addEventListener('pointerdown', down);
    layer.addEventListener('pointermove', move);
    layer.addEventListener('pointerup', up);
    layer.addEventListener('pointercancel', up);
    window.addEventListener('keydown', key);

    // the scene's keys: sent when changed by more than 0.01, once a frame at most
    const send = () => {
      for (const n of NAILS) {
        if (Math.abs(paint[n] - sent[n]) > 0.01 || (paint[n] >= 1 && sent[n] < 1)) {
          sent[n] = paint[n];
          g.set(`nail${n}`, paint[n]);
        }
      }
      frame = requestAnimationFrame(send);
    };
    send();

    await new Promise(ok => {
      finish = ok;
      signal.addEventListener('abort', ok);
    });
    cancelAnimationFrame(frame);
    clearTimeout(ending);
    window.removeEventListener('keydown', key);
    layer.remove();
    off?.();
    g.withdraw();
    if (signal.aborted) return this.skipped;
    return { order, seconds: Math.round((performance.now() - t0) / 1000) };
  },
};
