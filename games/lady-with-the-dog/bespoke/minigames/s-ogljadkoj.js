// “Looking round” (II.3, the sea-front, after the beat `noon_garden`; ALLEY_CAM): a kiss in broad daylight. Press: a
// ring on Anna (`anna#head`), the arc of danger on it — the people walking in the avenue: 1 while someone is in the seen
// part of the avenue (`watched`, the scene sets it at once; the avenue is empty for about 4 s once in 10–12 s), 0 —
// empty. Pressed while people are there — the error `danger`: `seen` 1 (a pulse; the scene itself sets it back to
// 0) — a lady with a parasol turns round, Anna steps back; the mark again 2 s later. Pressed when it is empty —
// `kiss_now` 1, the embrace; wait for `noon_garden:kiss` (up to 6 s) — a snap, the end.
//   Who does what: Gurov kisses her in broad daylight. What he wants: to kiss her — and not be seen.
//   What he feels: the thrill of a secret. The player: to wait for the moment.
//   → { seen: how many times they were seen }
import { until, keys } from '../hands.js';

const AGAIN = 2; // s: the mark again after they were seen
const KISS = 6000; // ms: the embrace ends (the scene tells)

export default {
  title: 'Looking round',
  about: 15,
  skipped: { seen: 0 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: tr('People walked in the avenue, and anyone might look round') });
    const send = keys(g);
    let watched = g.get('watched') === 0 ? 0 : 1;
    g.watch('watched', v => { watched = v ? 1 : 0; });
    const mark = mg.mark({ at: 'anna#head', danger: watched });
    const press = mg.press({ on: mark });
    b.minigame.tricks.teach(mg, [press], { id: 'press' });
    let seen = 0, backAt = -1, kissed = null;
    press.on('press', () => {
      if (kissed || backAt >= 0) return;
      if (watched) {
        seen++;
        mg.error('danger', { at: mark });
        send('seen', 1);
        mark.set({ hidden: true });
        backAt = mg.t + AGAIN;
        return;
      }
      // (the wait — before the embrace has begun)
      kissed = g.told('noon_garden:kiss', KISS);
      send('kiss_now', 1);
      mark.set({ hidden: true });
      mg.plate.set({ fill: 1, glow: 'good' });
    });
    const done = await until(mg, ({ t }) => {
      if (backAt >= 0 && t >= backAt) { backAt = -1; mark.set({ hidden: false }); }
      mark.set({ danger: watched });
      if (!kissed) mg.plate.set({ fill: 0, glow: watched ? 'bad' : 'idle' });
      return !!kissed;
    });
    if (!done) return this.skipped;
    await kissed;
    if (signal.aborted) return this.skipped;
    mg.snap({ at: b.where('anna#head') || undefined });
    await mg.end({ as: seen ? 'flawed' : 'clean' });
    return { seen };
  },
};
