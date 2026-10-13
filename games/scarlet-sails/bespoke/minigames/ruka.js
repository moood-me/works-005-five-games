// «Рука» (VII, the shore, the last action of the game): the hands insert `boat` is open — her hand on the way to his.
// The player presses at her palm, where it is now, and leads it towards his; the scene's `reach` (0…1) is her hand's
// way, and it follows the finger no faster than REACH_SPEED a second and never back. Let go, and it stands.
// The points of the insert: hands#her (her palm at the start), hands#his (his palm).
//   opts: { onReach(u): about four times a second, how far her hand is (the chapter lets the orchestra swell) }
//   → { seconds (from the first touch to the touch of the hands), lets (how many times the hand was let go) }
const GRAB = 0.14; // of the frame's height: how near her palm a press has to be
const FLOOR = 44; // px: but not less than this
const REACH_SPEED = 0.25; // a second
const DONE = 0.97;
const SENT = 0.01; // a key is sent when it changed by more
const TELL = 250; // ms between onReach

export default {
  title: 'Рука', // (as the author's ☰ lists it)
  about: 6,
  skipped: { seconds: 0, lets: 0 },
  run(g, b, opts, signal) {
    return new Promise(done => {
      const off = g.hint('Веди её руку к его');
      const pad = document.createElement('div');
      pad.style.cssText = 'position: absolute; inset: 0; touch-action: none;';
      b.layer.append(pad);
      let from = null, to = null; // her palm at the start, his palm (px) — remembered once both are known
      let reach = b.get('reach') ?? 0, sent = reach, aim = 0;
      let finger = null, started = 0, lets = 0, last = 0, told = 0, frame = 0;
      const held = () => finger !== null;
      const begin = now => {
        if (started) return;
        started = now;
        off();
      };
      const at = (x, y) => {
        const dx = to.x - from.x, dy = to.y - from.y;
        return Math.min(1, Math.max(0, ((x - from.x) * dx + (y - from.y) * dy) / (dx * dx + dy * dy)));
      };
      const down = e => {
        if (e.button > 0 || !from || finger !== null) return;
        const palm = { x: from.x + (to.x - from.x) * reach, y: from.y + (to.y - from.y) * reach };
        if (Math.hypot(e.clientX - palm.x, e.clientY - palm.y) > Math.max(GRAB * b.frame().h, FLOOR)) return;
        e.preventDefault();
        pad.setPointerCapture(e.pointerId);
        finger = e.pointerId;
        begin(performance.now());
      };
      const move = e => {
        if (e.pointerId === finger) aim = at(e.clientX, e.clientY);
      };
      const up = e => {
        if (e.pointerId !== finger) return;
        finger = null;
        lets++;
      };
      pad.addEventListener('pointerdown', down);
      pad.addEventListener('pointermove', move);
      pad.addEventListener('pointerup', up);
      pad.addEventListener('pointercancel', up);

      const step = now => {
        const dt = Math.min(0.1, (now - last) / 1000);
        last = now;
        if (!from) {
          const her = b.where('hands#her'), his = b.where('hands#his');
          if (her && his) { from = her; to = his; }
        } else if (held()) {
          reach = Math.min(1, reach + Math.max(0, Math.min(aim - reach, REACH_SPEED * dt)));
          if (reach >= DONE) {
            end();
            done({ seconds: Math.round((now - started) / 1000), lets });
            return;
          }
          if (Math.abs(reach - sent) > SENT) g.set('reach', (sent = reach));
        }
        if (started && now - told >= TELL) {
          told = now;
          opts.onReach?.(reach);
        }
        frame = requestAnimationFrame(step);
      };
      last = performance.now();
      frame = requestAnimationFrame(step);

      function end() {
        cancelAnimationFrame(frame);
        off();
        pad.remove();
      }
      signal.addEventListener('abort', () => {
        end();
        g.withdraw();
        done(this.skipped);
      });
    });
  },
};
