// “Arm in Arm” (III.1, the Hillside, after the beat `meet`; game.md §7): the way down the iced path 0…1 (`down`; where they are now —
// `down_at`, the scene sets it; the gait `careful`). Held anywhere — they walk: `down` = min(`down_at` + 0.08, 1); let go —
// `down` = `down_at`: they stand. On a strip of ice the scene tells `down:slip` and stops them both itself; the hold ends
// (one finger: to catch him it must be lifted); on `sarafanov#shoulder_l` — a ring with an arc of time, 1.5 s. Pressed —
// caught (`catch` 1, the snow crunches), 1.5 s later they can walk on. Not pressed — a mistake (behind), Sarafanov sits down in the snow
// (`fall` 1, a soft fall), counted in `falls`; 2 s later he gets up, 2 s more — they can walk on. The end: at the gate (`down_at` ≥ 0.98).
//   Feeling: leading a stranger's father down the ice; wants him not to fall; has learnt his secret — gently; the player — care in a hand.
//   → { falls }
import { until, keys } from '../hands.js';

const AHEAD = 0.08; // how far the aim is ahead of where they are
const CATCH = 1.5; // s — the arc of time
const CAUGHT = 1.5; // s — holding him, then they can walk on
const DOWN = 2, UP = 2; // s — sitting in the snow; up, still standing
const GATE = 0.98;
const SLIP_MS = 600000;

export default {
  title: 'Arm in Arm', // (as the author's map lists it)
  about: 36,
  skipped: { falls: 0 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: tr('The path is iced over. The old man treads carefully') });
    const send = keys(g);
    const at = () => +g.get('down_at') || 0;
    const pause = s => { const t0 = mg.t; return until(mg, ({ t }) => t - t0 >= s); };
    let falls = 0, slipped = false, walk = null, first = true;
    const walking = () => {
      walk = mg.hold({ on: null, seconds: 1, drain: 0 });
      if (first) b.minigame.tricks.teach(mg, [walk], { id: 'hold:anywhere' });
      first = false;
    };
    // (the scene tells `down:slip` on every strip of ice: waited for anew after each)
    const listen = () => g.told('down:slip', SLIP_MS).then(ok => { if (ok && !signal.aborted) { slipped = true; listen(); } });
    listen();
    send('catch', 0);
    send('fall', 0);
    walking();
    for (;;) {
      const step = await until(mg, () => {
        const now = at();
        send('down', walk.state.held ? Math.min(now + AHEAD, 1) : now);
        mg.plate.set({ fill: now, glow: walk.state.held ? 'good' : 'idle' });
        return slipped || now >= GATE;
      });
      if (!step) return this.skipped;
      if (!slipped) break;
      // he slipped: they stand; the hold is over — he can be caught only with the finger lifted
      slipped = false;
      walk.remove();
      send('down', at());
      const shoulder = mg.mark({ at: 'sarafanov#shoulder_l', kind: 'ring', time: 1 });
      const press = mg.press({ on: shoulder });
      let caught = false;
      press.on('press', () => { caught = true; });
      const t0 = mg.t;
      const over = await until(mg, ({ t }) => {
        shoulder.set({ time: Math.max(0, 1 - (t - t0) / CATCH) });
        return caught || t - t0 >= CATCH;
      });
      if (!over) return this.skipped;
      if (caught) {
        send('catch', 1);
        g.sound.crunch();
        mg.snap({ at: shoulder });
        shoulder.remove();
        if (!(await pause(CAUGHT))) return this.skipped;
        send('catch', 0);
      } else {
        mg.error('behind', { at: shoulder });
        shoulder.remove();
        falls++;
        send('fall', 1);
        g.sound.thud();
        if (!(await pause(DOWN))) return this.skipped;
        send('fall', 0);
        if (!(await pause(UP))) return this.skipped;
      }
      walking();
    }
    send('down', 1);
    await mg.end({ as: falls ? 'flawed' : 'clean' });
    return { falls };
  },
};
