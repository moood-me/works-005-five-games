// “The sea” (II.2, Oreanda, after the beat `still`): the two above the sea before dawn. Press ×3 — or nothing (doing
// nothing is a way too: the finger shows both the press and “hands off”). It grows light by itself (`dawn` to 1 over
// 40 s, by an action of its own). Rings: the steamer's lights (`steamer#lights` — they go out one by one, `lights` to
// 0 over 6 s), the cicada in the near cypress (`cypress#cicada` — it stops: `cicada` 0, the cicadas' sound to 0), her
// hand on the seat (`anna#hand_r` — he covers it with his: `hand` 1). What is touched is taken off. At the 12th second
// — `opts.sea()` (the narrator on the sea; not waited for). The end — 40 s from the start, however one presses.
//   Who does what: they sit above the sea. What they want: nothing. What they feel: peace. The player: may do nothing.
//   opts: { sea() — at the 12th second }
//   → { touched: ['lights' | 'cicada' | 'hand', … in order] }
import { until, keys } from '../hands.js';

const LONG = 40; // s
const SEA = 12; // s: the words on the sea
const POINTS = [['lights', 'steamer#lights'], ['cicada', 'cypress#cicada'], ['hand', 'anna#hand_r']];

export default {
  title: 'The sea',
  about: 40,
  skipped: { touched: [] },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: tr('Below, the sea was sounding, and it was growing light') });
    const send = keys(g);
    const acts = [b.act('state', 'move', 'dawn', 1, { over: LONG })];
    signal.addEventListener('abort', () => acts.forEach(a => a.cancel()));
    const touched = [], presses = [];
    for (const [id, at] of POINTS) {
      const mark = mg.mark({ at });
      const press = mg.press({ on: mark });
      presses.push(press);
      press.on('press', () => {
        touched.push(id);
        mg.snap({ at: mark });
        mark.remove();
        if (id === 'lights') acts.push(b.act('state', 'move', 'lights', 0, { over: 6 }));
        if (id === 'cicada') { send('cicada', 0); g.sound.cicadas(0, 2); }
        if (id === 'hand') send('hand', 1);
      });
    }
    // (both ways shown: a touch — and hands off)
    mg.show({ gestures: [presses[0]] }).finished.then(() => { if (!signal.aborted) mg.show({ handsOff: true }); });
    let said = false;
    const t0 = mg.t;
    const done = await until(mg, ({ t: now }) => {
      const t = now - t0;
      if (!said && t >= SEA) { said = true; opts.sea?.(); }
      mg.plate.set({ fill: Math.min(1, t / LONG), glow: 'idle' });
      return t >= LONG;
    });
    if (!done) return this.skipped;
    await mg.end({ as: 'neutral' });
    return { touched };
  },
};
