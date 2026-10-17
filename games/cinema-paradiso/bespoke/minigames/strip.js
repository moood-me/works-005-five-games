// "The Strip" (V.5, the booth in ruins, after the beat `window_strip`; the insert `strip`): Salvatore draws the spliced strip across
// the booth's window. Pull against resistance: a ring at the right hand (`strip#hand_r`), the way — to the left one (`strip#hand_l`), the strip
// goes from right to left (`strip_x` 0…1), no faster than 0.045 a second — it is drawn out, the frames have time to light up; let go — it stands,
// the ring at the hand again, and the next grip leads what is left. First come the three kisses cut in chapter I (the crooked ones
// jump: that is the scene's), then eight more; a frame in the light — the theme's motif, no more than once in 3 s. No mistakes.
//   The feeling: Salvatore draws to the light the strip that Alfredo kept for him; he wants to see it all; gratitude and
//   grief; the player — carefully, unhurried.
//   opts: { onProgress(u) — four times a second: where the strip is (the chapter keeps the theme) }
//   → { seconds: from the first touch to the end }
import { until, keys } from '../hands.js';

const SPEED = 0.045; // strip_x a second, no faster
const FRAMES = 11; // kiss_cut1…3, kiss1…8
const MOTIF = 3; // s: the motif no more often
const TELL = 0.25; // s between onProgress
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export default {
  file: 'strip',
  title: 'The Strip', // as the author's map lists it
  about: 24,
  skipped: { seconds: 0 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: tr('The clippings are spliced into one strip, frame to frame. It\'s still light behind the glass') });
    const send = keys(g);
    let x = clamp(+g.get('strip_x') || 0), base = x, mark = null, pull = null, started = null, told = -1, motif = -MOTIF, lit = -1;
    // the ring at the hand; a grip leads the strip that is left: u of the way — a share of what is left
    const grab = first => {
      mark = mg.mark({ at: 'strip#hand_r', kind: 'dash' });
      pull = mg.pull({ on: mark, to: 'strip#hand_l', heavy: true });
      if (first) b.minigame.tricks.teach(mg, [pull], { id: 'pull:heavy' });
      pull.on('down', () => { started ??= mg.t; });
      pull.on('release', () => { mark.remove(); base = x; grab(false); });
    };
    grab(true);
    const done = await until(mg, ({ t, dt }) => {
      const s = pull.state, want = base + s.u * (1 - base);
      x = Math.min(want, x + SPEED * dt, 1);
      if (x < want - 1e-4) pull.set({ u: (x - base) / Math.max(1e-6, 1 - base) }); // (the strip is drawn out: the finger ahead of it)
      send('strip_x', x);
      // the frame in the middle of the window has lit up
      const k = Math.floor(x * FRAMES + 0.5) - 1;
      if (k > lit && k < FRAMES) { lit = k; if (t - motif >= MOTIF) { motif = t; g.sound.motif(); } }
      if (started !== null && t - told >= TELL) { told = t; opts.onProgress?.(x); }
      mg.plate.set({ fill: x, glow: s.held ? 'good' : 'idle' });
      return x >= 0.999;
    });
    if (!done) return this.skipped;
    send('strip_x', 1);
    opts.onProgress?.(1);
    mg.snap({ at: mark });
    const seconds = Math.round(mg.t - (started ?? mg.t));
    await mg.end({ as: 'clean' });
    return { seconds };
  },
};
