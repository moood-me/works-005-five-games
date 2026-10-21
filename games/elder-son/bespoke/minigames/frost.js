// “Frost” (II.6, the Home, after the beat `window_watch`; game.md §7): a spot on `window#pane` (the language's, rubbed where it is drawn), rubbed;
// the hole in the frost — its own `hole` (up to 1): grows with what the finger has rubbed; not rubbed — it slowly heals over (−0.02 a second),
// but not below 0.4 once the train has begun; every 0.4 of the frame's height of the finger's path — a nail's scratch on the frost. Watching is a way too:
// once `hole` first reaches 0.6, or after 12 s without moving, a train goes past beyond the window (`far_train` → 1 over 14 s), a horn,
// the beds with the train. The end — once the train has gone (neutral).
//   Feeling: he stayed; wants to see what he let go; quiet, freedom passing by; the player — a frosted window rubbed with a finger.
//   → { hole }
import { until, keys } from '../hands.js';

const HEAL = 0.02; // a second — the frost heals over
const FLOOR = 0.4; // no lower, once the train has gone
const TRAIN_AT = 0.6; // hole — the train
const STILL = 12; // s without moving — the train
const TRAIN = 14; // s — the train beyond the window
const SCRAPE = 0.4; // of the frame's height of path — a scratch

export default {
  title: 'Frost', // (as the author's map lists it)
  about: 18,
  skipped: { hole: 0.6 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: tr('Frost has grown over the glass. Beyond it, the vegetable plots and the station') });
    const send = keys(g);
    const h = () => b.frame()?.h || 600;
    let train = null;
    signal.addEventListener('abort', () => { train?.cancel?.(); g.beds({ clock: 0.4, rails: 0.3 }, 2); });
    const pane = mg.mark({ at: 'window#pane', kind: 'spot' });
    let rub = mg.rub({ on: pane, full: 0.85 });
    // (watching is a way: the finger is shown at the first meeting with this frost — rubbing met in “Hands” says nothing of
    // a window one may also just look through —, not when the player stands still)
    b.minigame.tricks.teach(mg, [rub], { id: 'rub:frost', still: null });
    let hole = 0, covered = 0, still = 0, path = 0, last = null, going = false, gone = false;
    send('hole', 0);
    send('far_train', 0);
    const done = await until(mg, ({ dt }) => {
      const s = rub.state;
      if (s.u > covered) { hole = Math.min(1, hole + (s.u - covered)); covered = s.u; }
      // (the spot all rubbed: a fresh one — what has healed over can be rubbed again)
      if (covered >= 0.95 && !s.at) { rub.remove(); rub = mg.rub({ on: pane, full: 0.85 }); covered = 0; }
      const moving = s.at && last && (s.at.x !== last.x || s.at.y !== last.y);
      if (moving) {
        still = 0;
        path += Math.hypot(s.at.x - last.x, s.at.y - last.y) / h();
        if (path >= SCRAPE) { path = 0; g.sound.scrape(); }
      } else {
        still += dt;
        hole = Math.max(going ? FLOOR : 0, hole - HEAL * dt);
      }
      last = s.at ? { ...s.at } : null;
      send('hole', hole);
      if (!going && (hole >= TRAIN_AT || still >= STILL)) {
        going = true;
        hole = Math.max(hole, FLOOR);
        train = b.act('state', 'move', 'far_train', 1, { over: TRAIN });
        Promise.resolve(train).then(() => { gone = true; });
        g.sound.horn(0.3);
        g.beds({ clock: 0.4, rails: 0.3, train: 0.25 }, 2);
      }
      mg.plate.set({ fill: hole, glow: moving ? 'good' : 'idle' });
      return gone;
    });
    if (!done) return this.skipped;
    await mg.end({ as: 'neutral' });
    return { hole: Math.round(hole * 100) / 100 };
  },
};
