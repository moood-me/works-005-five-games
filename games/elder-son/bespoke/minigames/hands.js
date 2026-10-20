// “Hands” (I.3, the Home, after the beat `kitchen`; the insert `stove` open; game.md §7): on `hands#hands` — a spot, rubbed.
// The thaw `thaw` grows while the finger rubs the spot briskly — so that ≈ 10 s of brisk rubbing are needed (a number of its own: the
// language's spot coverage fills faster); `rub` — the finger's way and speed, the sign of dx · min(1, |dx|/dt / 1.5 frame heights a
// second). Left idle — nothing cools. At each change of way — the palms rustle. `thaw` 1 — `rub` 0, 1 s later
// the end (clean).
//   Feeling: warming his hands at a stranger's stove; wants to get warm; the warmth is taken by a lie — awkward; the player — warmth that burns.
//   → { seconds: from the first touch to the end }
import { until, keys } from '../hands.js';

const RUB = 10; // s of brisk rubbing till warm
const LIVELY = 1.5; // frame heights a second — the finger's speed “for all it's worth”
const SPOT = 0.22; // the spot's radius, a share of the frame's height

export default {
  title: 'Hands', // (as the author's map lists it)
  about: 12,
  skipped: { seconds: 10 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: tr('Hands too frozen to bend. The stove door is open') });
    const send = keys(g);
    const h = () => b.frame()?.h || 600;
    const spot = mg.mark({ at: 'hands#hands', kind: 'spot' });
    const rub = mg.rub({ on: spot, radius: Math.round(SPOT * h()), full: 1 });
    b.minigame.tricks.teach(mg, [rub], { id: 'rub' });
    let thaw = 0, last = null, way = 0, started = null;
    send('thaw', 0);
    send('rub', 0);
    const done = await until(mg, ({ t, dt }) => {
      const at = rub.state.at;
      if (at && last && dt > 0) {
        started ??= t;
        const dx = (at.x - last.x) / h(), speed = Math.hypot(at.x - last.x, at.y - last.y) / h() / dt;
        const r = Math.sign(dx) * Math.min(1, Math.abs(dx) / dt / LIVELY);
        if (Math.abs(r) > 0.05) {
          const now = Math.sign(r);
          if (way && now !== way) g.sound.rub();
          way = now;
        }
        thaw = Math.min(1, thaw + (dt / RUB) * Math.min(1, speed / LIVELY));
        send('rub', r);
      } else if (!at) send('rub', 0);
      last = at ? { ...at } : null;
      send('thaw', thaw);
      mg.plate.set({ fill: thaw, glow: at ? 'good' : 'idle' });
      return thaw >= 1;
    });
    if (!done) { send('rub', 0); return this.skipped; }
    send('rub', 0);
    mg.snap({ at: spot });
    const t1 = mg.t;
    if (!(await until(mg, ({ t }) => t - t1 >= 1))) return this.skipped;
    const seconds = Math.round(mg.t - (started ?? 0));
    await mg.end({ as: 'clean' });
    return { seconds };
  },
};
