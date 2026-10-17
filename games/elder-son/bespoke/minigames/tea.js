// “Tea” (II.3, the Home, after the beat `talk`; the insert `tea` open, the kettle over the first glass; game.md §7). The first glass —
// a skill: a ring with a groove on `tea#glass1`; held — it pours (`pour` 1), the level rises 0.22 a second (the ring's fill —
// the level); let go — the stream stops; let go at 0.85…1.0 — poured, the kettle moves to the second. Let go earlier — it can
// be topped up. Full to the brim while held — over the brim, poured. The second glass is no skill but a question: at the first touch the chapter
// asks (opts.ask(), not waited for), the hand shakes (`shake` 1), letting go does not stop the stream, the level rises 0.6 a
// second; the shaking lasts while the question is heard and 0.6 s more, no less than 1.8 s — so the second glass always runs over: a puddle
// on the oilcloth, the question's trace (no mistake). The shaking over, the stream stops by itself; 1 s later the end (neutral).
//   Feeling: pouring tea for a stranger's father; wants not to be asked; at the second glass, the question about a mother whose son he
//   is not; the player — a hand that trembled.
//   opts: { ask() — Sarafanov's question (L33); → once it is said }
//   → { spills: 1, or 2 — if the first ran over too }
import { until, keys } from '../hands.js';

const RATE = 0.22; // level a second — the first glass
const SHAKEN = 0.6; // level a second — the second, under the question
const FULL = 0.85; // poured — from this level
const SHAKE_MIN = 1.8; // s — the shaking no shorter
const SHAKE_AFTER = 0.6; // s — the shaking after the question

export default {
  title: 'Tea', // (as the author's ☰ lists it)
  about: 13,
  skipped: { spills: 1 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: tr('The kettle is heavy. Two glasses in their holders') });
    const send = keys(g);
    const pour = on => { send('pour', on ? 1 : 0); g.sound.pour(on ? 0.6 : 0, 0.2); };
    signal.addEventListener('abort', () => { send('shake', 0); g.sound.pour(0, 0.2); });
    let spills = 0;
    send('which', 0);
    send('glass1', 0);
    send('glass2', 0);
    // the first glass
    const one = mg.mark({ at: 'tea#glass1', kind: 'groove' });
    const hold1 = mg.hold({ on: one, seconds: 1 / RATE, drain: 0 });
    b.minigame.tricks.teach(mg, [hold1], { id: 'hold' });
    let level = 0, running = false;
    const first = await until(mg, ({ dt }) => {
      const held = hold1.state.held;
      if (held !== running) { running = held; pour(held); }
      if (held) level = Math.min(1, level + RATE * dt);
      hold1.set({ fill: level });
      send('glass1', level);
      mg.plate.set({ fill: level / 2, glow: held ? 'good' : 'idle' });
      if (held && level >= 1) { // over the brim, while held
        spills++;
        send('spill', 1);
        g.sound.spill();
        return true;
      }
      return !held && level >= FULL;
    });
    if (!first) return this.skipped;
    if (running) { running = false; pour(false); }
    mg.snap({ at: one });
    one.remove();
    b.act('state', 'move', 'which', 1, { over: 0.6 });
    // the second glass: the question
    const two = mg.mark({ at: 'tea#glass2', kind: 'groove' });
    const hold2 = mg.hold({ on: two, seconds: 1 / SHAKEN, drain: 0 });
    let asked = null, askedAt = 0, said = null, spills2 = false;
    hold2.on('down', () => {
      if (asked) return;
      askedAt = mg.t;
      asked = Promise.resolve(opts.ask?.()).then(() => { said = mg.t; });
      send('shake', 1);
      pour(true);
    });
    level = 0;
    const second = await until(mg, ({ t, dt }) => {
      if (asked) {
        level = Math.min(1, level + SHAKEN * dt);
        if (level >= 1 && !spills2) { spills2 = true; spills++; send('spill', 1); g.sound.spill(); }
      }
      hold2.set({ fill: level });
      send('glass2', level);
      mg.plate.set({ fill: 0.5 + level / 2, glow: asked ? 'bad' : 'idle' });
      // (the shaking — while the question is heard and 0.6 s more, no less than 1.8 s)
      return asked && said !== null && t >= Math.max(askedAt + SHAKE_MIN, said + SHAKE_AFTER) && level >= 1;
    });
    if (!second) return this.skipped;
    send('shake', 0);
    pour(false);
    two.remove();
    const t1 = mg.t;
    if (!(await until(mg, ({ t }) => t - t1 >= 1))) return this.skipped;
    await mg.end({ as: 'neutral' });
    return { spills };
  },
};
