// “The Coat” (V.1, the Street, after the beat `shawl`; the insert `shawl` open; game.md §7): a dashed ring on the coat's
// collar (`shawl#coat`), the way to her shoulders (`shawl#shoulders`); `lay` — the place on the way, it does not go back; let go — it stays.
// There (`lay` ≥ 0.97) — 1 s later the end (clean). It does not come down by itself.
//   Feeling: laying his coat on Nina's shoulders; wants to warm her — and to say what he won't say; tender, awkward; the player —
//   giving what is his.
//   → { seconds: from the first touch to the end }
import { until, keys } from '../hands.js';

const THERE = 0.97;

export default {
  title: 'The Coat', // (as the author's ☰ lists it)
  about: 6,
  skipped: { seconds: 5 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: tr('Snow. Nina has only a shawl on') });
    const send = keys(g);
    const coat = mg.mark({ at: 'shawl#coat', kind: 'dash' });
    const pull = mg.pull({ on: coat, to: 'shawl#shoulders', release: 'stay' });
    b.minigame.tricks.teach(mg, [pull], { id: 'pull:to' });
    let lay = 0, started = null;
    send('lay', 0);
    const done = await until(mg, ({ t }) => {
      const s = pull.state;
      if (s.held) started ??= t;
      if (s.u > lay) lay = s.u; // (it does not go back)
      else if (s.u < lay) pull.set({ u: lay });
      send('lay', lay);
      mg.plate.set({ fill: lay, glow: s.held ? 'good' : 'idle' });
      return lay >= THERE;
    });
    if (!done) return this.skipped;
    send('lay', 1);
    mg.snap({ at: coat });
    const t1 = mg.t;
    if (!(await until(mg, ({ t }) => t - t1 >= 1))) return this.skipped;
    const seconds = Math.round(mg.t - (started ?? mg.t));
    await mg.end({ as: 'clean' });
    return { seconds };
  },
};
