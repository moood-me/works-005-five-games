// "Threading" (II.1, the booth, after the beat `lesson`; the insert `thread`): the boy threads the projector — the film's end from
// sprocket to sprocket, five stretches, one mark at a time. Pull along the way: a ring at the film's end at `thread#p{threaded}`, the way —
// to the next point; `pull` — where the film is on the stretch; got there — `threaded` + 1, the sprocket's click. Let go too soon — a spring:
// the film visibly goes back to the stretch's beginning, no mistake. At the loop (before the stretch 2 → 3, at `thread#p2`) — hold
// the groove 0.8 s: `loop` 1, the scene makes the loop; let go too soon — it drains, a mistake, `slips` + 1.
//   The feeling: the boy threads the projector for the first time; he wants to do it like the master; pride and care; the player — to learn
//   with the hands.
//   → { slips: how many times the loop slipped (≥ 1 — the frame in the beam trembles in `motor`) }
import { until, keys } from '../hands.js';

const SEGMENTS = 5;
const LOOP_AT = 2; // before the stretch 2 → 3
const LOOP = 0.8, DRAIN = 0.5; // s: the loop's fill; it drains from full
const STEPS = SEGMENTS + 1;
const DONE = 0.98;

export default {
  file: 'thread',
  title: 'Threading', // as the author's ☰ lists it
  about: 14,
  skipped: { slips: 0 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: tr('The film goes from sprocket to sprocket. Without a loop before the gate, it tears') });
    const send = keys(g);
    mg.plate.set({ notches: Array.from({ length: STEPS - 1 }, (_, i) => (i + 1) / STEPS) });
    let slips = 0, step = 0;
    send('threaded', 0);
    send('pull', 0);
    for (let k = 0; k < SEGMENTS; k++) {
      if (k === LOOP_AT) {
        // the loop before the gate
        const ring = mg.mark({ at: `thread#p${k}`, kind: 'groove' });
        const hold = mg.hold({ on: ring, seconds: LOOP, drain: DRAIN });
        b.minigame.tricks.teach(mg, [hold], { id: 'hold' });
        hold.on('up', () => {
          const u = hold.state.fill;
          if (u > 0.05 && u < 1) { slips++; mg.error('early', { at: ring }); }
        });
        const looped = await until(mg, () => {
          const s = hold.state;
          mg.plate.set({ fill: (step + s.fill) / STEPS, glow: s.held ? 'good' : 'idle' });
          return s.fill >= 1;
        });
        if (!looped) return this.skipped;
        send('loop', 1);
        g.sound.click();
        mg.snap({ at: ring });
        ring.remove();
        step++;
      }
      // the stretch k → k + 1
      const end = mg.mark({ at: `thread#p${k}`, kind: 'dash' });
      const pull = mg.pull({ on: end, to: `thread#p${k + 1}`, release: 'spring' });
      if (k === 0) b.minigame.tricks.teach(mg, [pull], { id: 'pull:spring' });
      const there = await until(mg, () => {
        const s = pull.state;
        send('pull', s.shown ?? s.u);
        mg.plate.set({ fill: (step + s.u) / STEPS, glow: s.held ? 'good' : 'idle' });
        return s.held && s.u >= DONE;
      });
      if (!there) return this.skipped;
      send('threaded', k + 1);
      send('pull', 0);
      g.sound.click();
      mg.snap({ at: end });
      end.remove();
      step++;
    }
    await mg.end({ as: slips ? 'flawed' : 'clean' });
    return { slips };
  },
};
