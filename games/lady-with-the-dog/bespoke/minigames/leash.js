// “The leash” (III.2, the town of S., after the beat `autumn_walk`; FENCE_CAM): Anna walks the spitz along the fence.
// A choice by gesture — hold anywhere (the response at her hand with the leash, `anna#hand_l`): held — she holds the
// spitz back and goes to the gate (`anna_to` = where she is − 0.05); let go — the spitz pulls to the fence's end,
// toward the station road (`anna_to` = where she is + `opts.pull`). Where she is — `anna_at` (the scene sets it at
// once); the key is sent at each change of it. The response neutral, both ways shown by the finger at the start. The
// end: at the gate (≤ 0.05) — 'home', at the road (≥ 0.95) — 'road', after 35 s — whichever is nearer. Wind in gusts:
// the bed `wind` up to 0.7 for a second once in 5–8 s, then 0.5 (the step's level).
//   Who does what: Anna walks the spitz along the fence. What she wants: to forget Yalta — and she cannot.
//   What she feels: longing; the spitz pulls toward the station road. The player: to hold or to let go.
//   opts: { pull — how hard the spitz pulls: 0.06 (duty) or 0.09 (life) }
//   → { end: 'home' | 'road' }
import { until, keys } from '../hands.js';

const HOME = 0.05, ROAD = 0.95, LONG = 35; // where the way ends; s
const BACK = 0.05; // held — a step toward the gate
const WIND = 0.5, GUST = 0.7; // the step's bed of wind; a gust

export default {
  title: 'The leash',
  about: 20,
  skipped: { end: 'home' },
  async run(g, b, opts, signal) {
    const pull = opts.pull ?? 0.06;
    const mg = g.minigame({ phrase: tr('The Pomeranian pulled to the end of the fence, toward the station road') });
    const send = keys(g);
    const leash = mg.mark({ at: 'anna#hand_l', kind: 'groove' });
    const hold = mg.hold({ on: null, show: leash, seconds: 0.4, drain: 0.4 });
    // (both ways shown: holding — and letting go)
    mg.show({ gestures: [hold] }).finished.then(() => { if (!signal.aborted) mg.show({ handsOff: true }); });
    signal.addEventListener('abort', () => g.sound.wind(WIND, 1));
    let at = +g.get('anna_at');
    if (!(at >= 0)) at = 0.3;
    let held = null, changed = true, gust = -1, calm = -1;
    g.watch('anna_at', v => { at = +v; changed = true; });
    const t0 = mg.t;
    mg.plate.set({ ways: [{ from: 0, to: 0.5, as: 'theirs' }, { from: 0.5, to: 1, as: 'own' }], glow: null });
    const done = await until(mg, ({ t: now }) => {
      const t = now - t0;
      const h = hold.state.held;
      if (changed || h !== held) {
        changed = false;
        held = h;
        send('anna_to', h ? Math.max(0, at - BACK) : Math.min(1, at + pull));
      }
      // wind in gusts
      if (gust < 0) gust = t + 5 + Math.random() * 3;
      if (t >= gust) { g.sound.wind(GUST, 0.4); calm = t + 1; gust = t + 5 + Math.random() * 3; }
      if (calm >= 0 && t >= calm) { g.sound.wind(WIND, 1.2); calm = -1; }
      mg.plate.set({ fill: at });
      return at <= HOME || at >= ROAD || t >= LONG;
    });
    if (!done) return this.skipped;
    g.sound.wind(WIND, 1);
    await mg.end({ as: 'neutral' });
    return { end: at >= 0.5 ? 'road' : 'home' };
  },
};
