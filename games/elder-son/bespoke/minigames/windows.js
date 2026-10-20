// “Windows” (I.1, the Street, after the beat `knock_ready`; game.md §7): five windows of the settlement still lit (`win1…win5` = 1); on each
// lit one a ring, pressed (the touch is the knock itself, no petals). Window N pressed: the scene's turn (the marks hidden) — Busygin
// goes and knocks (`knock` = N; the scene tells `knock:hit`, `knock:done`); a figure in the window (`winN` = 2); the first three —
// a refusal aloud (opts.refuse[i]), the fourth and fifth — silence, a dog barks; the window goes dark. Waiting is a way too: every 9 s
// with no touch the lit window with the lowest number goes dark. The snow thicker with each dark one. All five dark — the end (neutral).
//   Feeling: knocking at strangers' windows; wants to be let in; frozen, awkward about waking people; the player — the cold and a shut world.
//   opts: { refuse: [ref => …, ref => …, ref => …] — three refusals, each a line of its own at the window ref ('winN') }
//   → { knocked: [the numbers of the windows knocked at, in order] }
import { until, keys } from '../hands.js';

const WINDOWS = 5;
const IDLE = 9; // s with no touch — the window with the lowest number goes dark
const SILHOUETTE = 0.6; // s: the figure in the window before the answer
const AFTER = 1; // s after the answer — the window goes dark
const KNOCK_MS = 30000; // ms: waiting for the knock and its end (the scene's turn — up to 8 s)

export default {
  title: 'Windows', // (as the author's map lists it)
  about: 50,
  skipped: { knocked: [] },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: tr('Night. In the settlement the light is still on in five windows') });
    const send = keys(g);
    const pause = s => { const t0 = mg.t; return until(mg, ({ t }) => t - t0 >= s); };
    const lit = new Set(), marks = new Map(), presses = [];
    const knocked = [];
    let dark = 0, idle = 0, busy = false, pressed = null;
    for (let n = 1; n <= WINDOWS; n++) {
      lit.add(n);
      send(`win${n}`, 1);
      const mark = mg.mark({ at: `win${n}`, kind: 'ring' });
      const press = mg.press({ on: mark });
      press.on('press', () => { if (!busy && !pressed) pressed = n; });
      marks.set(n, mark);
      presses.push(press);
    }
    // (waiting is a way: the finger is shown only at the first meeting, not when the player stands still)
    b.minigame.tricks.teach(mg, presses, { id: 'press:windows', still: null });
    const out = n => {
      lit.delete(n);
      send(`win${n}`, 0);
      marks.get(n).remove();
      marks.delete(n);
      dark++;
      g.set('snow', 0.4 + 0.06 * dark, 2);
      mg.plate.set({ fill: dark / WINDOWS });
    };
    mg.plate.set({ fill: 0, glow: 'idle' });
    while (lit.size) {
      pressed = null;
      idle = 0;
      // pressed — or 9 s with no touch
      const went = await until(mg, ({ dt }) => {
        if (pressed) return true;
        idle += dt;
        return idle >= IDLE;
      });
      if (!went) return this.skipped;
      if (!pressed) { out(Math.min(...lit)); continue; } // (people go to bed)
      const n = pressed;
      busy = true;
      knocked.push(n);
      mg.sceneTurn(true);
      const hit = g.told('knock:hit', KNOCK_MS), done = g.told('knock:done', KNOCK_MS);
      g.set('knock', n);
      hit.then(ok => { if (ok && !signal.aborted) g.sound.knock(); });
      await done;
      if (signal.aborted) return this.skipped;
      send(`win${n}`, 2);
      if (!(await pause(SILHOUETTE))) return this.skipped;
      const i = knocked.length - 1;
      if (i < opts.refuse.length) await opts.refuse[i](`win${n}`);
      else g.sound.dog();
      if (signal.aborted || !(await pause(AFTER))) return this.skipped;
      mg.snap({ at: marks.get(n) });
      out(n);
      mg.sceneTurn(false);
      busy = false;
    }
    if (!(await pause(1))) return this.skipped;
    g.set('knock', 0);
    await mg.end({ as: 'neutral' });
    return { knocked };
  },
};
