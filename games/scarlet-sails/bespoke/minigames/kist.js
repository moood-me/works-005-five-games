// «Brush» (II, the castle): the insert `canvas` is open — three nails on the painting. A spot on each (the insert's
// points canvas#nail1…3), rubbed over with the brush, in any order, all three at once on the screen: how far each is
// covered is how far it is painted over — the scene shows it by its keys nail1…nail3 (0…1). Each stroke's beginning —
// the brush's own sound.
//   → { order: the nails (1…3) in the order they were painted, seconds: how long it took }
import { until, keys } from '../hands.js';

const NAILS = [1, 2, 3];

export default {
  title: 'Brush', // (as the author's ☰ lists it)
  about: 15,
  skipped: { order: [3, 1, 2], seconds: 0 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: tr('The nails in the picture were painted so that it hurt to look') });
    const send = keys(g), t0 = mg.t, order = [];
    const nails = NAILS.map(n => {
      const mark = mg.mark({ at: `canvas#nail${n}`, kind: 'spot' }), rub = mg.rub({ on: mark });
      rub.on('down', () => g.sound.brush());
      return { n, mark, rub };
    });
    b.minigame.tricks.teach(mg, [nails[0].rub], { id: 'rub' });
    let misses = 0;
    mg.on('miss', e => { misses++; mg.error('miss', { at: e.mark, finger: e }); });
    const done = await until(mg, () => {
      let all = 0;
      for (const x of nails) {
        const u = order.includes(x.n) ? 1 : x.rub.state.u;
        all += u;
        send(`nail${x.n}`, u);
        if (u >= 1 && !order.includes(x.n)) { order.push(x.n); mg.snap({ at: x.mark }); x.mark.remove(); }
      }
      mg.plate.set({ fill: all / NAILS.length, glow: nails.some(x => x.rub.state.at) ? 'good' : 'idle' });
      return order.length === NAILS.length;
    });
    if (!done) return this.skipped;
    const seconds = Math.round(mg.t - t0);
    await mg.end({ as: misses ? 'flawed' : 'clean' });
    return { order, seconds };
  },
};
