// «За корабликом» (I, «Лес у моря», the beat `chase`): Assol runs along the stream after her yacht. Held anywhere
// (the language's hold, no mark: she is the thing, she glows) she runs; let go, she stands where she is. The yacht's
// place is the game's own number `toy`: it goes down the stream by its own clock (sent under the key `toy`, with time,
// so that it glides), never read back. Held, she runs on to where the yacht is (a little ahead of it at most, never in
// front of it by more); the scene walks her there (`run`) and says where she is (`run_at`). Left behind too far, the
// yacht sticks in the reeds (`reeds`) and waits — «отстала»; caught up, it goes on. The scene stops her before a snag
// (`chase:snag`): a ring on the snag, pressed — she is over it (`jump`). All in `run`'s units: 0 — where the yacht was
// set afloat, 1 — the mouth.
//   → { seconds, lost (how many times the yacht stuck), jumps }
import { until, keys } from '../hands.js';

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const SPEED = 1 / 34; // the yacht's way a second, off the reeds
const AHEAD = 0.1, WITH = 0.04; // she is sent no further than this before where she is, nor before the yacht
const STUCK = 0.2, FREE = 0.06; // left behind this far, the yacht sticks; caught up this near, it frees
const END = 0.98;
const SNAGS = [{ at: 0.4, ref: 'snag#snag' }, { at: 0.7, ref: 'snag2#snag' }]; // the scene's snags (its notes: snags)
const PAST = 0.03; // she is past a snag this far beyond it
const LEAP = 300; // ms: a jump is told this long
const GLIDE = 0.34; // s: the scene glides the yacht between the places sent

const skipped = { seconds: 0, lost: 0, jumps: 0 };

export default {
  title: 'За корабликом', // (as the author's ☰ lists it)
  about: 40,
  skipped,
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Ручей уносит яхту к морю' });
    const send = keys(g);
    const at = () => clamp(+g.get('run_at') || 0); // where she is (the scene keeps it)
    const run = mg.hold({ on: null, seconds: 1, drain: 0 }); // (held — she runs: what it reports is whether)
    const toyAt = mg.mark({ at: 'toy#toy', hidden: true }); // (where «отстала» is shown)
    mg.glow('assol');
    b.minigame.tricks.teach(mg, [run], { id: 'hold:anywhere' });
    let toy = 0, stuck = false, lost = 0, jumps = 0, wasHeld = false, snag = null, over = false;
    mg.on('end', () => { over = true; });
    // the scene stops her before a snag and says so: a ring on it, to be pressed (waiting set before the cause, and again
    // after each)
    (async () => {
      while (!over) {
        if (!(await g.told('chase:snag')) || over || snag) continue;
        const next = SNAGS.find(s => at() < s.at + PAST);
        if (!next) continue;
        const mark = mg.mark({ at: next.ref }), press = mg.press({ on: mark });
        snag = { mark, next };
        b.minigame.tricks.teach(mg, [press], { id: 'press', still: [2, 6] });
        press.on('press', () => {
          jumps++;
          g.set('jump', 1);
          setTimeout(() => g.set('jump', 0), LEAP);
          mg.snap({ at: mark });
          mark.remove();
          snag = null;
        });
      }
    })();
    const t0 = mg.t;
    const done = await until(mg, ({ dt }) => {
      const here = at();
      if (!stuck) toy = Math.min(1, toy + SPEED * dt);
      g.set('toy', toy, GLIDE);
      if (!stuck && toy - here > STUCK) {
        stuck = true;
        lost++;
        g.set('reeds', 1);
        g.sound.splash();
        mg.error('behind', { at: toyAt });
      } else if (stuck && toy - here < FREE) {
        stuck = false;
        g.set('reeds', 0);
      }
      // (past the snag another way — let go and held again: its ring goes)
      if (snag && here > snag.next.at + PAST) { snag.mark.remove(); snag = null; }
      const hold = run.state.held;
      if (wasHeld && !hold) g.set('run', here); // (a release always tells the scene where she is)
      else if (hold) send('run', Math.min(here + AHEAD, toy + WITH, 1));
      wasHeld = hold;
      mg.plate.set({ fill: here, glow: stuck ? 'bad' : hold ? 'good' : 'idle' });
      return here >= END;
    });
    if (!done) return skipped;
    const seconds = Math.round(mg.t - t0);
    await mg.end({ as: lost ? 'flawed' : 'clean' });
    return { seconds, lost, jumps };
  },
};
