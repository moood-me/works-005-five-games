// "Splicing" (I.2, the booth, after the beat `splice_in`; the insert `splice` open): with Alfredo's hands — the three markers in
// order, one mark at a time. The cut — lead along a line: from `splice#cutN` across the film along the frame's edge to
// `splice#cutN_end`; gone through — `cutN` → 1 (the clipping slides off), the scissors, the boy's hand nearer (`boy_reach` N/3). Off the
// line — this frame's cut is slanted (`bentN` 1, the scene paints a slanted edge; once a cut), `jumps` + 1; it leads on from the same
// place. The splice — hold the groove on `splice#glueN` 1.2 s: `glueN` grows with the fill, the press; let go too soon — it drains.
//   The feeling: Alfredo cuts the kisses because he is told to; he wants it not to jump; a familiar annoyance; the player cuts
//   what will come back to him later.
//   opts: { onCrooked() — the first slanted cut (L08), not waited for }
//   → { jumps: how many frames are spliced crooked (0…3) }
import { until, keys } from '../hands.js';

const N = 3;
const CUT = 0.3; // s: cutN → 1
const REACH = 1; // s: the boy's hand nearer
const GLUE = 1.2, DRAIN = 0.6; // s: the press's fill; it drains from full
const STEPS = 2 * N;

export default {
  file: 'skleyka',
  title: 'Splicing', // as the author's ☰ lists it
  about: 18,
  skipped: { jumps: 0 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: tr('The markers stick out where the bell rang. A crooked splice jumps on the screen later') });
    const send = keys(g), acts = new Set();
    const move = (key, value, over) => { const a = b.act('state', 'move', key, value, { over }); acts.add(a); return a; };
    signal.addEventListener('abort', () => { for (const a of acts) a.cancel(); });
    mg.plate.set({ notches: Array.from({ length: STEPS - 1 }, (_, i) => (i + 1) / STEPS) });
    let jumps = 0, told = false;
    for (let n = 1; n <= N; n++) {
      // the cut
      const start = mg.mark({ at: `splice#cut${n}`, kind: 'dash' });
      const cut = mg.trace({ on: start, line: [`splice#cut${n}`, `splice#cut${n}_end`] });
      if (n === 1) b.minigame.tricks.teach(mg, [cut], { id: 'trace' });
      let bent = false;
      cut.on('off', () => {
        if (bent) return; // (once a cut)
        bent = true;
        jumps++;
        send(`bent${n}`, 1);
        mg.error('off', { at: cut });
        if (!told) { told = true; opts.onCrooked?.(); }
      });
      const cutDone = await until(mg, () => {
        const s = cut.state;
        mg.plate.set({ fill: (2 * (n - 1) + s.u) / STEPS, glow: s.tracing ? 'good' : 'idle' });
        return s.u >= 0.99;
      });
      if (!cutDone) return this.skipped;
      move(`cut${n}`, 1, CUT);
      move('boy_reach', n / N, REACH);
      g.sound.scissors();
      mg.snap({ at: start });
      start.remove();
      // the splice
      const press = mg.mark({ at: `splice#glue${n}`, kind: 'groove' });
      const hold = mg.hold({ on: press, seconds: GLUE, drain: DRAIN });
      if (n === 1) b.minigame.tricks.teach(mg, [hold], { id: 'hold' });
      hold.on('up', () => { const u = hold.state.fill; if (u > 0.05 && u < 1) mg.error('early', { at: press }); });
      const glued = await until(mg, () => {
        const s = hold.state;
        send(`glue${n}`, s.fill);
        mg.plate.set({ fill: (2 * (n - 1) + 1 + s.fill) / STEPS, glow: s.held ? 'good' : 'idle' });
        return s.fill >= 1;
      });
      if (!glued) return this.skipped;
      g.sound.press();
      mg.snap({ at: press });
      press.remove();
    }
    await mg.end({ as: jumps ? 'flawed' : 'clean' });
    return { jumps };
  },
};
