// “The shadow” (III.1, Moscow, after the beat `evening_walk`; STREET_CAM): Gurov walks down the evening street toward
// the camera, and in every woman he sees her. For N = 1…count: a wait for `evening_walk:stopN` (set ahead), `walk_on` =
// N — he walks to the N-th point and stands; there — shadow N comes out ahead (`shadeN` 1, the scene: 1–2 s) and
// stands, her back to him; the first — `opts.onFirst()` (not waited for). Press: a ring on her head, an arc of time of
// 6 s. Pressed — he looks hard (`gurov_look` at her, 1 s), she turns round — a stranger's face — and goes (`shadeN`
// 2), 2.5 s later he looks away. Not pressed in 6 s — she goes by herself. The next — 2 s later; after the last —
// 2 s, the end.
//   Who does what: Gurov walks down a Moscow street. What he wants: to forget. What he feels: memory will not let go.
//   The player: to look hard, to know her, to be wrong.
//   opts: { count — 4 or 2 figures; onFirst() — at the first }
//   → { touched: [the numbers of those he looked hard at] }
import { until, keys } from '../hands.js';

const STOP = 30000; // ms: he has come to the point (the scene tells)
const OUT = 1.5; // s: she comes out
const TIME = 6; // s for a look
const LOOK = 1, AWAY = 2.5; // s: he looks hard; then looks away
const GAP = 2; // s to the next one; after the last

export default {
  title: 'The shadow',
  about: 26,
  skipped: { touched: [] },
  async run(g, b, opts, signal) {
    const count = opts.count ?? 4;
    const mg = g.minigame({ phrase: tr('Women passed in the street, and from far off each one looked like her') });
    const send = keys(g);
    const wait = s => { const at = mg.t + s; return until(mg, ({ t }) => t >= at); };
    const touched = [];
    let passed = 0, taught = false;
    const bar = () => mg.plate.set({ fill: passed / count, glow: 'idle' });
    bar();
    for (let n = 1; n <= count; n++) {
      const there = g.told(`evening_walk:stop${n}`, STOP);
      send('walk_on', n);
      await Promise.race([there, until(mg, () => false)]);
      if (signal.aborted) return this.skipped;
      send(`shade${n}`, 1);
      if (n === 1) opts.onFirst?.();
      if (!(await wait(OUT))) return this.skipped;
      const mark = mg.mark({ at: `shade${n}#head`, time: 1 });
      const press = mg.press({ on: mark });
      if (!taught) { taught = true; b.minigame.tricks.teach(mg, [press], { id: 'press' }); }
      let looked = false;
      press.on('press', () => { looked = true; });
      const from = mg.t;
      const ok = await until(mg, ({ t }) => {
        mark.set({ time: Math.max(0, 1 - (t - from) / TIME) });
        return looked || t - from >= TIME;
      });
      if (!ok) return this.skipped;
      if (looked) {
        touched.push(n);
        mg.snap({ at: mark });
        mark.remove();
        send('gurov_look', `shade${n}`);
        if (!(await wait(LOOK))) return this.skipped;
        send(`shade${n}`, 2);
        if (!(await wait(AWAY))) return this.skipped;
        send('gurov_look', null);
      } else {
        mark.remove();
        send(`shade${n}`, 2);
      }
      passed = n;
      bar();
      if (!(await wait(GAP))) return this.skipped;
    }
    await mg.end({ as: 'neutral' });
    return { touched };
  },
};
