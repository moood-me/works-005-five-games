// “Running” (V.3, the Street, after the beat `run_out`; game.md §7): the street from the gate (0) to the path to the
// platform (1), ≈ 65 m. Held anywhere — Busygin runs (`run` = min(`run_at` + 0.08, 1), `look_back` 0; where he is —
// `run_at`, the scene sets it); he himself glows. Let go — he stops and turns back to the lit kitchen window (`run` = `run_at`, `look_back`
// 1); counted in `looks`. It is no mistake: running and looking back are the game. At the 8th second — a horn: the last train is coming. The end —
// at the path (`run_at` ≥ 0.98, neutral). It does not run by itself.
//   Feeling: running from the house where the truth was told to the last train; wants to leave; can't help looking back; the player —
//   the run and the look back at the window.
//   → { seconds, looks }
import { until, keys } from '../hands.js';

const AHEAD = 0.08;
const HORN = 8; // s — the last train's horn
const THERE = 0.98;

export default {
  title: 'Running', // (as the author's ☰ lists it)
  about: 24,
  skipped: { seconds: 24, looks: 1 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: tr('The last one\'s at eleven forty. The kitchen window is still lit') });
    const send = keys(g);
    const at = () => +g.get('run_at') || 0;
    mg.glow('busygin');
    const run = mg.hold({ on: null, seconds: 1, drain: 0 });
    // (looking back is a way too: the finger is shown at the first meeting, not when the player stands still)
    b.minigame.tricks.teach(mg, [run], { id: 'hold:anywhere', still: null });
    let looks = 0, ran = false, begun = false, horn = false;
    const done = await until(mg, ({ t }) => {
      const now = at(), held = run.state.held;
      if (held) ran = begun = true;
      else if (ran) { ran = false; looks++; } // (let go while running — he looked back)
      send('run', held ? Math.min(now + AHEAD, 1) : now);
      send('look_back', held || !begun ? 0 : 1); // (before the first step — he hasn't looked back yet)
      if (!horn && t >= HORN) { horn = true; g.sound.horn(0.4); }
      mg.plate.set({ fill: now, glow: held ? 'good' : 'idle' });
      return now >= THERE;
    });
    if (!done) return this.skipped;
    send('look_back', 0);
    const seconds = Math.round(mg.t);
    await mg.end({ as: 'neutral' });
    return { seconds, looks };
  },
};
