// “Find her” (IV.2, the theatre in S., after the beat `hall_find`; HALL_CAM): Gurov looks for her in the provincial
// crowd. Its own `enter` rises by 1 every 3 s from 1 to 6 — the scene leads the next lady along the aisle to her seat
// (lady1, lady2, lady3, Anna, lady4, lady5). On each who has sat down — a ring with a petal “Her?”. Not her — the
// error `wrong`, the mark taken off. Her — a snap, the end 0.5 s later. After 25 s, if he has not found her, her
// lorgnette's glint is brighter (`glint` 1) and the finger shows her mark. The bar — how many ladies have come in.
//   Who does what: Gurov looks for her in the crowd. What he wants: to see her. What he feels: impatience.
//   The player: to search and be wrong.
//   → { wrong: how many times he was wrong }
import { until, keys } from '../hands.js';

const ORDER = ['lady1', 'lady2', 'lady3', 'anna', 'lady4', 'lady5'];
const EVERY = 3; // s between the ladies
const SIT = 2.5; // s from coming in to her sitting down (the mark)
const HINT = 25; // s: the glint brighter, the finger shows
const AFTER = 0.5;
const PETAL = [{ id: 'her', label: tr('Her?') }];

export default {
  title: 'Find her',
  about: 18,
  skipped: { wrong: 0 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: tr('The audience came in and took their seats') });
    const send = keys(g);
    let enter = 0, wrong = 0, end = -1, hinted = false, taught = false, annaPress = null;
    const sat = new Set();
    const t0 = mg.t;
    const done = await until(mg, ({ t: now }) => {
      const t = now - t0;
      if (end >= 0) return t >= end;
      const k = Math.min(ORDER.length, 1 + Math.floor(t / EVERY));
      if (k > enter) { enter = k; send('enter', enter); }
      // the ladies who have sat by now: a mark each
      ORDER.forEach((id, i) => {
        if (sat.has(id) || t < i * EVERY + SIT) return;
        sat.add(id);
        const mark = mg.mark({ at: `${id}#head` });
        const press = mg.press({ on: mark, petals: PETAL });
        if (id === 'anna') annaPress = press;
        if (!taught) { taught = true; b.minigame.tricks.teach(mg, [press], { id: 'press:petal' }); }
        press.on('choose', () => {
          if (end >= 0) return;
          if (id === 'anna') {
            mg.snap({ at: mark });
            end = mg.t - t0 + AFTER;
          } else {
            wrong++;
            mg.error('wrong', { at: mark });
            mark.remove();
          }
        });
      });
      if (!hinted && t >= HINT && annaPress) {
        hinted = true;
        g.set('glint', 1, 1);
        mg.show({ gestures: [annaPress] });
      }
      mg.plate.set({ fill: enter / ORDER.length, glow: 'idle' });
      return false;
    });
    if (!done) return this.skipped;
    await mg.end({ as: wrong ? 'flawed' : 'clean' });
    return { wrong };
  },
};
