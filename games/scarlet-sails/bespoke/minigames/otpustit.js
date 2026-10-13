// «Отпустить» (Замок, после куска `farewell`): the insert `hold` is open — the mother's four fingers on her son's
// hand, the scene's keys grip1…grip4 (1 holding → 0 let go). The player presses a finger and draws away from it, and
// it lets go; or waits, and she lets go herself. The scene shows it all: the insert's points hands#finger1…finger4
// are where the fingers are. The chapter reads the result: `pried` = opened > 0.
//   → { opened: how many fingers the player opened (0…4), waited: opened === 0 }
const FINGERS = [1, 2, 3, 4];
const REACH = 0.09; // frame heights: a press this near a finger takes it
const MIN_REACH = 44; // px
const DRAW = 0.05; // frame heights: the way drawn from the finger that opens it
const OPEN = 0.6; // s: a finger lets go
const WAIT = 12000; // ms from the start or the last press: she lets go herself
const GAP = 1500; // ms between the fingers she lets go
const END = 1000; // ms after the last finger

export default {
  title: 'Отпустить',
  about: 15,
  skipped: { opened: 0, waited: true },
  async run(g, b, opts, signal) {
    const layer = document.createElement('div');
    layer.style.cssText = 'position:absolute;inset:0;touch-action:none';
    b.layer.append(layer);

    const free = new Set(); // fingers let go (or going)
    let opened = 0, off = null, held = null, patience = 0, hers = 0, finish;
    const timers = new Set();
    const later = (fn, ms) => {
      const t = setTimeout(() => { timers.delete(t); fn(); }, ms);
      timers.add(t);
      return t;
    };

    const first = () => { off?.(); off = null; };
    const letGo = n => {
      free.add(n);
      g.set(`grip${n}`, 0, OPEN);
      if (free.size === FINGERS.length) later(() => finish(), END);
    };
    const open = n => {
      first();
      opened++;
      letGo(n);
      wait();
    };
    // she lets go herself: one finger now, the next after GAP, and so on
    const release = () => {
      const n = FINGERS.find(k => !free.has(k));
      if (!n) return;
      letGo(n);
      hers = later(release, GAP);
    };
    // 12 s of waiting from now
    const wait = () => {
      clearTimeout(patience);
      clearTimeout(hers);
      if (free.size < FINGERS.length) patience = later(release, WAIT);
    };

    const nearest = (x, y) => {
      const r = Math.max(REACH * b.frame().h, MIN_REACH);
      let best = null, d = r;
      for (const n of FINGERS) {
        const p = !free.has(n) && b.where(`hands#finger${n}`);
        const k = p && Math.hypot(x - p.x, y - p.y);
        if (p && k <= d) { best = n; d = k; }
      }
      return best;
    };
    const down = e => {
      if (e.button > 0) return;
      e.preventDefault();
      layer.setPointerCapture?.(e.pointerId);
      wait();
      const n = nearest(e.clientX, e.clientY);
      held = n && { n, id: e.pointerId, x: e.clientX, y: e.clientY };
    };
    const move = e => {
      if (!held || e.pointerId !== held.id) return;
      if (Math.hypot(e.clientX - held.x, e.clientY - held.y) < DRAW * b.frame().h) return;
      const { n } = held;
      held = null;
      if (!free.has(n)) open(n);
    };
    const up = () => { held = null; };
    layer.addEventListener('pointerdown', down);
    layer.addEventListener('pointermove', move);
    layer.addEventListener('pointerup', up);
    layer.addEventListener('pointercancel', up);

    off = g.hint('Разожми её пальцы — или подожди');
    wait();

    await new Promise(ok => {
      finish = ok;
      signal.addEventListener('abort', ok);
    });
    timers.forEach(clearTimeout);
    layer.remove();
    if (signal.aborted) {
      first();
      g.withdraw();
      return this.skipped;
    }
    first();
    return { opened, waited: opened === 0 };
  },
};
