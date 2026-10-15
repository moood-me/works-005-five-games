// «Рука» (VII, the shore, the last action of the game): the hands insert `boat` is open — her hand on the way to his.
// Her hand is the thing pulled, heavy (it comes while the finger leads ahead of it), from where it is (`hands#her`)
// along its way to his palm (`hands#his`), never back: let go, it stands. The scene's `reach` (0…1) is her hand's way.
//   opts: { onReach(u): about four times a second, how far her hand is (the chapter lets the orchestra swell) }
//   → { seconds (from the first touch to the touch of the hands), lets (how many times the hand was let go) }
import { until, keys } from '../hands.js';

const DONE = 0.97;
const TELL = 0.25; // s between onReach

export default {
  title: 'Рука', // (as the author's ☰ lists it)
  about: 6,
  skipped: { seconds: 0, lets: 0 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Его рука протянута к ней' });
    const send = keys(g);
    const her = mg.mark({ at: 'hands#her', kind: 'dash' });
    const hand = mg.pull({ on: her, to: 'hands#his', heavy: true });
    b.minigame.tricks.teach(mg, [hand], { id: 'pull:heavy' });
    let started = null, lets = 0, told = 0;
    hand.on('down', () => { started ??= mg.t; });
    hand.on('release', () => { lets++; });
    const done = await until(mg, ({ t }) => {
      const s = hand.state;
      send('reach', s.shown ?? s.u);
      if (started !== null && t - told >= TELL) { told = t; opts.onReach?.(s.u); }
      mg.plate.set({ fill: s.u, glow: s.held ? 'good' : 'idle' });
      return s.u >= DONE;
    });
    if (!done) return this.skipped;
    mg.snap({ at: her });
    const seconds = Math.round(mg.t - (started ?? mg.t));
    await mg.end({ as: 'clean' });
    return { seconds, lets };
  },
};
