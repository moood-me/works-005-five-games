// “Watermelon” (II.1, A room in Yalta, after the beat `melon`; the insert `melon`): Gurov cuts the watermelon. Trace
// the line: a ring at the knife (`melon#knife`), the cut's dashes from `melon#from` to `melon#to`. What is traced —
// `cut` (no faster than 0.15 a second: the language tells how far it has gone, the game sends the lesser of that and
// its own limit); one may let go and go on — counted in `lifts`. Off the line — the error `off`. Every 0.15 of the
// way — a crunch. Cut through — a snap, the slice falls away (`slice` 1), then silence: no marks, the scene's turn,
// quiet weeping (the bed `weep` 0.15; on the way out — 0: the step's beds are the chapter's), the candle burns down by
// an action of its own (`candle` to 0.4 over 10 s), 10 s — the end.
//   Who does what: Gurov cuts the watermelon. What he wants: to keep his hands busy beside her shame. What he feels:
//   awkwardness, irony. The player: a slow careful cut — and then nothing.
//   → { lifts: how many times the knife was lifted }
import { until, keys } from '../hands.js';

const SPEED = 0.15; // the cut's share a second, no faster
const CRUNCH = 0.15; // a crunch every such share
const SILENCE = 10; // s of silence after the cut

export default {
  title: 'Watermelon',
  about: 18,
  skipped: { lifts: 0 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: tr('There was a watermelon on the table') });
    const send = keys(g);
    const knife = mg.mark({ at: 'melon#knife', kind: 'dash' });
    const trace = mg.trace({ on: knife, line: ['melon#from', 'melon#to'] });
    b.minigame.tricks.teach(mg, [trace], { id: 'trace' });
    let cut = 0, lifts = 0, crunched = 0, end = -1, candle = null;
    trace.on('off', () => mg.error('off', { at: trace }));
    trace.on('up', () => { if (cut > 0 && cut < 1) lifts++; });
    const leave = () => { candle?.cancel(); g.sound.weep(0, 1); };
    signal.addEventListener('abort', leave);
    const done = await until(mg, ({ t, dt }) => {
      if (end >= 0) return t >= end;
      cut = Math.min(trace.state.u, cut + SPEED * dt);
      send('cut', cut);
      if (cut - crunched >= CRUNCH) { crunched = cut; g.sound.knife(); }
      mg.plate.set({ fill: cut, glow: trace.state.tracing ? 'good' : 'idle' });
      if (cut >= 1) {
        mg.snap({ at: knife });
        send('cut', 1);
        send('slice', 1);
        trace.remove();
        knife.remove();
        mg.sceneTurn(true);
        g.sound.weep(0.15, 2);
        candle = b.act('state', 'move', 'candle', 0.4, { over: SILENCE });
        end = t + SILENCE;
      }
      return false;
    });
    if (!done) return this.skipped;
    signal.removeEventListener('abort', leave);
    g.sound.weep(0, 1);
    await mg.end({ as: 'neutral' });
    return { lifts };
  },
};
