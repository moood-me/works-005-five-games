// «Отпустить» (Замок, после куска `farewell`): the insert `hold` is open — the mother's four fingers on her son's
// hand, the scene's keys grip1…grip4 (1 holding → 0 let go). A choice, not a skill: one finger at a time has a mark
// (hands#fingerN) — pulled away from, it tears off, it lets go; or nothing is done, and she lets go herself, a finger
// after a finger. Both ways are shown from the start; nothing says «wrong». The chapter reads `pried` = opened > 0.
//   → { opened: how many fingers the player opened (0…4), waited: opened === 0 }
import { until } from '../hands.js';

const FINGERS = [1, 2, 3, 4];
const TEAR = 0.05; // window heights: the way drawn from the finger that opens it
const OPEN = 0.6; // s: a finger lets go
const WAIT = 12; // s from the start or the last touch: she lets go herself
const GAP = 1.5; // s between the fingers she lets go
const END = 1; // s after the last finger

export default {
  title: 'Отпустить',
  about: 15,
  skipped: { opened: 0, waited: true },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Мать держала его руку и не могла отпустить' });
    mg.plate.set({ glow: null });
    const free = new Set();
    let opened = 0, mark = null, still = 0, hers = null, last = 0;
    const letGo = n => {
      free.add(n);
      g.set(`grip${n}`, 0, OPEN);
      mg.plate.set({ fill: free.size / FINGERS.length });
    };
    // the next finger still holding has its mark
    const next = () => {
      mark?.remove();
      mark = null;
      const n = FINGERS.find(k => !free.has(k));
      if (!n || hers !== null) return null;
      mark = mg.mark({ at: `hands#finger${n}`, kind: 'dash' });
      const tear = mg.pull({ on: mark, tear: TEAR });
      tear.on('tear', () => { opened++; mg.snap({ at: mark }); letGo(n); next(); });
      return tear;
    };
    const first = next();
    // (both ways: a finger torn off — and hands off)
    mg.show({ gestures: [first] }).finished.then(done => done && mg.show({ handsOff: true }));
    mg.on('down', () => { still = 0; });
    const done = await until(mg, ({ t, dt }) => {
      still += dt;
      // she lets go herself: one finger now, the next after GAP, and so on
      if (hers === null && still >= WAIT) { hers = t - GAP; mark?.remove(); mark = null; }
      if (hers !== null && t - hers >= GAP && free.size < FINGERS.length) { hers = t; letGo(FINGERS.find(k => !free.has(k))); }
      if (free.size === FINGERS.length) { if (!last) last = t; return t - last >= END; }
      return false;
    });
    if (!done) return this.skipped;
    await mg.end({ as: 'neutral' });
    return { opened, waited: opened === 0 };
  },
};
