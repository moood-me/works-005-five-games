// «Смотри» (V, the house, beat `look`): Assol sits with the book, her eyes in the page. The player draws up from
// wherever she presses — her gaze follows the finger, never faster than 0.3 a second (opts.heavy: 0.18 — she does
// not believe her eyes) — up from the page to the window. Let go before the window and the gaze sinks back to the
// page (0.5 a second): a try. The scene shows it all by its key `gaze` (0 — the page, 1 — the window).
//   opts: { heavy: slower, for the cry — she does not believe her eyes }
//   → { tries: how many times it was let go short of the window, seconds }
const REACH = 0.35; // the draw that lifts the gaze all the way, in frame heights
const RISE = 0.3, RISE_HEAVY = 0.18, SINK = 0.5; // gaze per second

export default {
  title: 'Смотри', // (as the author's ☰ lists it)
  about: 5,
  skipped: { tries: 0, seconds: 0 },
  run(g, b, { heavy = false } = {}, signal) {
    const { skipped } = this;
    return new Promise(done => {
      const rise = heavy ? RISE_HEAVY : RISE;
      const veil = document.createElement('div');
      veil.style.cssText = 'position: absolute; inset: 0; touch-action: none';
      b.layer.append(veil);
      const off = g.hint('Веди вверх — подними её взгляд');
      const t0 = performance.now();
      let gaze = b.get('gaze') ?? 0, sent = gaze, aim = 0, finger = null, from = 0, tries = 0, raf = 0, last = t0;
      const held = () => finger !== null;
      const down = e => {
        if (e.button > 0 || finger !== null) return;
        off();
        finger = e.pointerId;
        from = e.clientY;
        veil.setPointerCapture(e.pointerId);
      };
      const move = e => {
        if (e.pointerId !== finger) return;
        aim = Math.min(1, Math.max(0, (from - e.clientY) / (b.frame().h * REACH)));
      };
      const up = e => {
        if (e.pointerId !== finger) return;
        finger = null;
        aim = 0;
        if (gaze > 0) tries++; // a release is a try, not trouble: the gaze simply sinks
      };
      veil.addEventListener('pointerdown', down);
      veil.addEventListener('pointermove', move);
      veil.addEventListener('pointerup', up);
      veil.addEventListener('pointercancel', up);
      const send = () => {
        sent = gaze;
        g.set('gaze', gaze);
      };
      const end = result => {
        cancelAnimationFrame(raf);
        veil.remove();
        off();
        g.withdraw();
        done(result);
      };
      const step = now => {
        const dt = Math.min(0.1, (now - last) / 1000);
        last = now;
        // up to the aim no faster than the finger lets her; down to the page when nothing holds it
        gaze = gaze < aim ? Math.min(aim, gaze + rise * dt) : Math.max(held() ? aim : 0, gaze - SINK * dt);
        if (gaze >= 1) {
          send();
          end({ tries, seconds: Math.round((now - t0) / 1000) });
          return;
        }
        if (Math.abs(gaze - sent) > 0.01) send();
        raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
      signal.addEventListener('abort', () => end(skipped));
    });
  },
};
