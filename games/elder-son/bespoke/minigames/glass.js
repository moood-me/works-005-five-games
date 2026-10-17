// “The Glass” (V.3, the Platform, after the beat `glass`; the camera in the carriage; game.md §7): a spot on `train_window#pane`, rubbed;
// rubbed — `wipe` (the spot's coverage, up to 1); every 0.4 of the frame's height of the finger's path — a nail's scratch on the frost. `wipe` ≥ 0.8 —
// clean. The train does not wait long: 15 s without moving — the end (neutral): as much is seen as was rubbed.
//   Feeling: he left; wants to see who stayed; is leaving them; the player — rubbing the frost, his lie, off the glass.
//   → { wipe }
import { until, keys } from '../hands.js';

const SPOT = 0.3; // the spot's radius, a share of the frame's height
const CLEAR = 0.8;
const STILL = 15; // s without moving
const SCRAPE = 0.4; // of the frame's height of path — a scratch

export default {
  title: 'The Glass', // (as the author's ☰ lists it)
  about: 6,
  skipped: { wipe: 0.8 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: tr('The carriage window is frosted. Beyond it, the platform') });
    const send = keys(g);
    const h = () => b.frame()?.h || 600;
    const pane = mg.mark({ at: 'train_window#pane', kind: 'spot' });
    const rub = mg.rub({ on: pane, radius: Math.round(SPOT * h()), full: 1 });
    b.minigame.tricks.teach(mg, [rub], { id: 'rub' });
    let wipe = 0, still = 0, path = 0, last = null;
    send('wipe', 0);
    const done = await until(mg, ({ dt }) => {
      const s = rub.state;
      wipe = Math.max(wipe, s.u);
      const moving = s.at && last && (s.at.x !== last.x || s.at.y !== last.y);
      if (moving) {
        still = 0;
        path += Math.hypot(s.at.x - last.x, s.at.y - last.y) / h();
        if (path >= SCRAPE) { path = 0; g.sound.scrape(); }
      } else still += dt;
      last = s.at ? { ...s.at } : null;
      send('wipe', wipe);
      mg.plate.set({ fill: Math.min(1, wipe / CLEAR), glow: moving ? 'good' : 'idle' });
      return wipe >= CLEAR || still >= STILL;
    });
    if (!done) return this.skipped;
    await mg.end({ as: wipe >= CLEAR ? 'clean' : 'neutral' });
    return { wipe: Math.round(wipe * 100) / 100 };
  },
};
