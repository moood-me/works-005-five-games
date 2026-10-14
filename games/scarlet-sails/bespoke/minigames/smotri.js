// «Смотри» (V, the house, beat `look`): Assol sits with the book, her eyes in the page. Her gaze is the thing pulled:
// a mark on the book (`book#book`), drawn along its way up to the window (`window#window`) — let go short of it, the
// gaze sinks back to the page, seen (a spring): a try. opts.heavy — she does not believe her eyes: it comes only while
// the finger pulls ahead of it. The scene shows it all by its key `gaze` (0 — the page, 1 — the window); the camera
// stands meanwhile (it rises with her eyes once they are at the window).
//   opts: { heavy: slower, for the cry — she does not believe her eyes }
//   → { tries: how many times it was let go short of the window, seconds }
import { until, keys } from '../hands.js';

export default {
  title: 'Смотри', // (as the author's ☰ lists it)
  about: 5,
  skipped: { tries: 0, seconds: 0 },
  async run(g, b, { heavy = false } = {}, signal) {
    const mg = g.minigame({ phrase: 'Строки книги ещё держат её взгляд' });
    const send = keys(g), t0 = mg.t;
    const book = mg.mark({ at: 'book#book', kind: 'dash' });
    const gaze = mg.pull({ on: book, to: 'window#window', release: 'spring', heavy });
    b.minigame.tricks.teach(mg, [gaze], { id: 'pull' });
    let tries = 0;
    gaze.on('release', ({ u }) => { if (u > 0 && u < 0.99) tries++; });
    const done = await until(mg, () => {
      const s = gaze.state, u = s.shown ?? s.u;
      send('gaze', u);
      mg.plate.set({ fill: s.u, glow: s.held ? 'good' : 'idle' });
      return s.u >= 0.99;
    });
    if (!done) return this.skipped;
    g.set('gaze', 1);
    mg.snap({ at: book });
    const seconds = Math.round(mg.t - t0);
    await mg.end({ as: 'clean' });
    return { tries, seconds };
  },
};
