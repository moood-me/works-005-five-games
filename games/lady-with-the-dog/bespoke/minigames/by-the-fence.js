// “By the fence” (IV.1, the town of S., after the beat `fence_wait`; FENCE_CAM): Gurov walks along the grey fence of
// her house. Pull to targets: a ring with dashes on Gurov (`gurov#head`), the targets — five places along the fence
// (`fence#p1…p5`); let go at a target — he walks there at his own pace (`walk_to`), there and back, as often as one
// likes. Where he is — `gurov_at` (the scene sets it at once). The piano behind the window (`opts.tune`: a waltz or a
// study) is heard dully — the louder the nearer he is to the window (place 0.6): four times a second the level 0.15 +
// 0.6 · nearness; the bar — the same level. First louder than 0.4 — `opts.onPiano()` (not waited for). Five seconds
// under the window (nearer than 0.08) — he has waited it out: a snap, the end; or 35 s — the end. On the way out the
// piano dies away over 3 s.
//   Who does what: Gurov walks along the fence of her house. What he wants: to see her. What he feels: the
//   absurdity, hope. The player: to find the place where it is heard better.
//   opts: { tune — 'waltz' | 'etude'; onPiano() — when the piano is first heard }
//   → { stood: whether he waited it out under the window }
import { until, keys } from '../hands.js';

const PLACES = [0.1, 0.3, 0.5, 0.6, 0.85]; // `gurov_at` of the places fence#p1…p5
const WINDOW = 0.6, NEAR = 0.35, UNDER = 0.08, STAND = 5, LONG = 35;
const HEARD = 0.4; // the level at which the piano is first heard
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export default {
  title: tr('By the fence'),
  about: 18,
  skipped: { stood: true },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: tr('From the house came the sounds of a piano, faint and indistinct') });
    const send = keys(g);
    const p = g.sound.piano(opts.tune ?? 'etude');
    signal.addEventListener('abort', () => p.stop(3));
    const him = mg.mark({ at: 'gurov#head', kind: 'dash' });
    const walk = mg.pull({ on: him, targets: PLACES.map((_, i) => `fence#p${i + 1}`) });
    b.minigame.tricks.teach(mg, [walk], { id: 'pull:targets' });
    walk.on('release', ({ target }) => { if (target >= 0) send('walk_to', PLACES[target]); });
    let at = +g.get('gurov_at');
    if (!(at >= 0)) at = PLACES[0];
    g.watch('gurov_at', v => { at = +v; });
    let heard = false, under = 0, tick = 0, level = 0;
    const t0 = mg.t;
    const done = await until(mg, ({ t: now, dt }) => {
      const t = now - t0;
      tick += dt;
      if (tick >= 0.25) {
        tick = 0;
        level = 0.15 + 0.6 * clamp(1 - Math.abs(at - WINDOW) / NEAR);
        p.loud(level, 0.3);
        if (!heard && level > HEARD) { heard = true; opts.onPiano?.(); }
      }
      under = Math.abs(at - WINDOW) < UNDER ? under + dt : 0;
      mg.plate.set({ fill: level, glow: under > 0 ? 'good' : 'idle' });
      return under >= STAND || t >= LONG;
    });
    if (!done) return this.skipped;
    const stood = under >= STAND;
    if (stood) mg.snap({ at: him });
    p.stop(3);
    await mg.end({ as: stood ? 'clean' : 'neutral' });
    return { stood };
  },
};
