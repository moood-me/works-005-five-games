// “The Snuffbox” (II.4, the Home, after the beat `box_take` or `box_give`; the insert `box` open, the mode in the frame — `box_mode`;
// game.md §7). opts.mode:
// - take: the palm open, the old hand still over the snuffbox. Four dashed rings on `box#finger1…4`, all at once;
//   each pulled to the snuffbox (`box#box`): there — the finger closes (`fingerN` → 1 over 0.5 s), the ring gone; not there —
//   the finger back. Any order; the fingers do not close by themselves. All four — the lid clicks, the old hand goes (`old` → 0 over
//   1.5 s), the end (clean).
// - give: the snuffbox on the oilcloth between them. A dashed ring on `box#box`, the way to `box#old`; pulled against resistance
//   (heavy: it moves while the finger pulls ahead of it); `push` — the place on the way, it does not go back; let go — it stays. There —
//   the old fingers close on it not at once (`old_close` → 1 over 2 s), a click, the end (clean). It does not move by itself.
//   Feeling: taking (or giving back) the grandfather's snuffbox, “for the elder son”; wants not to hurt the old man; ashamed; the player — a thing
//   heavier than it weighs.
//   opts: { mode: 'take' | 'give' }
//   → { closed: how many fingers closed (take — 4; give — 0), seconds: from the first touch to the end }
import { until, keys } from '../hands.js';

const FINGERS = 4;
const THERE = 0.97; // push — there

export default {
  title: 'The Snuffbox', // (as the author's map lists it)
  about: 8,
  // (one shape for both modes: the chapter reads none of the result's fields; game.md §7 — take {closed: 4}, give {seconds: 6})
  skipped: { closed: 4, seconds: 6 },
  async run(g, b, opts, signal) {
    const take = opts.mode !== 'give';
    const mg = g.minigame({ phrase: take ? tr('The snuffbox lies in his palm. The old hand is still over it') : tr('The snuffbox sits on the oilcloth between them') });
    const send = keys(g), acts = new Set();
    const move = (key, value, over) => { const a = b.act('state', 'move', key, value, { over }); acts.add(a); return a; };
    signal.addEventListener('abort', () => { for (const a of acts) a.cancel?.(); });
    let started = null;
    mg.on('down', () => { started ??= mg.t; });
    if (take) {
      let closed = 0;
      const pulls = [];
      for (let n = 1; n <= FINGERS; n++) {
        send(`finger${n}`, 0);
        const ring = mg.mark({ at: `box#finger${n}`, kind: 'dash' });
        const pull = mg.pull({ on: ring, to: 'box#box', release: 'spring' });
        pull.on('release', ({ inTarget }) => {
          if (!inTarget) return;
          move(`finger${n}`, 1, 0.5);
          mg.snap({ at: ring });
          ring.remove();
          closed++;
          mg.plate.set({ fill: closed / FINGERS });
        });
        pulls.push(pull);
      }
      b.minigame.tricks.teach(mg, pulls, { id: 'pull:to' });
      mg.plate.set({ fill: 0, glow: 'idle' });
      if (!(await until(mg, () => closed >= FINGERS))) return this.skipped;
      g.sound.box();
      move('old', 0, 1.5);
    } else {
      send('push', 0);
      send('old_close', 0);
      const ring = mg.mark({ at: 'box#box', kind: 'dash' });
      const pull = mg.pull({ on: ring, to: 'box#old', heavy: true, release: 'stay' });
      b.minigame.tricks.teach(mg, [pull], { id: 'pull:heavy' });
      let push = 0;
      const done = await until(mg, () => {
        const s = pull.state;
        if (s.u > push) push = s.u; // (it does not go back)
        else if (s.u < push) pull.set({ u: push });
        send('push', push);
        mg.plate.set({ fill: push, glow: s.held ? 'good' : 'idle' });
        return push >= THERE;
      });
      if (!done) return this.skipped;
      send('push', 1);
      mg.snap({ at: ring });
      move('old_close', 1, 2);
      g.sound.box();
    }
    const seconds = Math.round(mg.t - (started ?? mg.t));
    await mg.end({ as: 'clean' });
    return { closed: take ? FINGERS : 0, seconds };
  },
};
