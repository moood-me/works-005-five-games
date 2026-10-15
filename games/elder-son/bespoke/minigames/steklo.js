// «Стекло» (V.3, Платформа, после куска `glass`; камера в вагоне; game.md §7): пятно на `train_window#pane`, тереть;
// протёрто — `wipe` (покрытие пятна, до 1); каждые 0.4 высоты кадра пути пальца — шорох ногтя по инею. `wipe` ≥ 0.8 —
// clean. Электричка ждёт недолго: 15 с без движения — конец (neutral): видно столько, сколько протёрто.
//   Чувство: уехал; хочет увидеть, кто остался; уезжает от них; игрок — протереть иней, его ложь, на стекле.
//   → { wipe }
import { until, keys } from '../hands.js';

const SPOT = 0.3; // радиус пятна, доля высоты кадра
const CLEAR = 0.8;
const STILL = 15; // с без движения
const SCRAPE = 0.4; // высоты кадра пути — шорох

export default {
  title: 'Стекло', // как её зовёт ☰ автора
  about: 6,
  skipped: { wipe: 0.8 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Стекло вагона в инее. За ним — платформа' });
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
