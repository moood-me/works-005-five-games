// "Letters" (I.4, the booth, after the beat `slate_in`; the insert `slate`): the small hand on Alfredo's big hand with the chalk —
// «ALFREDO» along the dotted letters on the slate (the world's Italian letters: seven). Lead along the line from `slate#start` to `slate#end`: gone through — `chalk_x`,
// the letters — `letters` = floor(7 · chalk_x). In a hurry (the chalk goes faster than 0.1 of the line a second, smoothed over 0.3 s) — the hand
// twitched: `wobble` 1 for 0.4 s, the letter now in `crooked` becomes 1, the chalk squeaks (no more than once a letter). Let go —
// it stands; on from the same place.
//   The feeling: grown-up Alfredo learns to write his name from the boy; he wants to pass the exam; shameful and funny; the player —
//   tenderness and patience.
//   → { crooked: a string of 7 characters '0'/'1' — the crooked letters (the slate on the nail in the booth of 1988) }
import { until, keys } from '../hands.js';

const LETTERS = 7; // «ALFREDO»
const FAST = 0.1; // of the line a second — faster, the hand twitches
const SMOOTH = 0.3; // s: the speed's smoothing
const WOBBLE = 0.4; // s

export default {
  file: 'letters',
  title: 'Letters', // as the author's map lists it
  about: 14,
  skipped: { crooked: '0000000' },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: tr('Alfredo\'s hand is heavy. The chalk obeys it only when it moves slowly') });
    const send = keys(g);
    const start = mg.mark({ at: 'slate#start', kind: 'dash' });
    const chalk = mg.trace({ on: start, line: ['slate#start', 'slate#end'] });
    b.minigame.tricks.teach(mg, [chalk], { id: 'trace' });
    mg.plate.set({ notches: Array.from({ length: LETTERS - 1 }, (_, i) => (i + 1) / LETTERS) });
    const crooked = Array(LETTERS).fill('0');
    let x = 0, rate = 0, wobbleTill = -1, letters = 0, faulted = -1;
    const done = await until(mg, ({ t, dt }) => {
      const s = chalk.state, was = x;
      x = Math.min(1, s.u);
      // the chalk's speed, smoothed
      if (dt > 0) rate += ((x - was) / dt - rate) * Math.min(1, dt / SMOOTH);
      const now = Math.min(LETTERS - 1, Math.floor(LETTERS * x));
      if (rate > FAST && s.tracing && faulted !== now) {
        faulted = now;
        crooked[now] = '1';
        send('crooked', crooked.join(''));
        wobbleTill = t + WOBBLE;
        g.sound.chalkSqueak();
        mg.error('off', { at: chalk });
      }
      const lettersNow = Math.min(LETTERS, Math.floor(LETTERS * x));
      if (lettersNow > letters) { letters = lettersNow; send('letters', letters); g.sound.chalk(); }
      send('chalk_x', x);
      send('wobble', t < wobbleTill ? 1 : 0);
      mg.plate.set({ fill: x, glow: t < wobbleTill ? 'bad' : s.tracing ? 'good' : 'idle' });
      return x >= 0.99;
    });
    if (!done) return this.skipped;
    send('chalk_x', 1);
    send('letters', LETTERS);
    send('wobble', 0);
    mg.snap({ at: start });
    const line = crooked.join('');
    await mg.end({ as: line.includes('1') ? 'flawed' : 'clean' });
    return { crooked: line };
  },
};
