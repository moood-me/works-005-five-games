// «Иней» (II.6, Дом, после куска `window_watch`; game.md §7): пятно на `window#pane` (радиус 0.3 высоты кадра), тереть;
// дыра в инее — своё `hole` (до 1): растёт с тем, что палец протёр; не трут — медленно затягивается (−0.02 в секунду),
// но не ниже 0.4 после начала поезда; каждые 0.4 высоты кадра пути пальца — шорох ногтя по инею. Смотреть — тоже путь:
// когда `hole` впервые ≥ 0.6 или после 12 с без движения — за окном идёт электричка (`far_train` → 1 за 14 с), гудок,
// подложки с поездом. Конец — когда поезд прошёл (neutral).
//   Чувство: остался; хочет увидеть, что упустил; тихо, свобода уходит мимо; игрок — окно в инее, протёртое пальцем.
//   → { hole }
import { until, keys } from '../hands.js';

const SPOT = 0.3; // радиус пятна, доля высоты кадра
const HEAL = 0.02; // в секунду — иней затягивает
const FLOOR = 0.4; // ниже — нет, когда поезд пошёл
const TRAIN_AT = 0.6; // hole — поезд
const STILL = 12; // с без движения — поезд
const TRAIN = 14; // с — поезд за окном
const SCRAPE = 0.4; // высоты кадра пути — шорох

export default {
  title: 'Иней', // как её зовёт ☰ автора
  about: 18,
  skipped: { hole: 0.6 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Стекло заросло инеем. За ним — огороды и станция' });
    const send = keys(g);
    const h = () => b.frame()?.h || 600;
    let train = null;
    signal.addEventListener('abort', () => { train?.cancel?.(); g.beds({ clock: 0.4, rails: 0.3 }, 2); });
    const pane = mg.mark({ at: 'window#pane', kind: 'spot' });
    let rub = mg.rub({ on: pane, radius: Math.round(SPOT * h()), full: 0.85 });
    // (смотреть — путь: палец показывают при первой встрече, не когда игрок замер)
    b.minigame.tricks.teach(mg, [rub], { id: 'rub', still: null });
    let hole = 0, covered = 0, still = 0, path = 0, last = null, going = false, gone = false;
    send('hole', 0);
    send('far_train', 0);
    const done = await until(mg, ({ dt }) => {
      const s = rub.state;
      if (s.u > covered) { hole = Math.min(1, hole + (s.u - covered)); covered = s.u; }
      // (the spot all rubbed: a fresh one — what has healed over can be rubbed again)
      if (covered >= 0.95 && !s.at) { rub.remove(); rub = mg.rub({ on: pane, radius: Math.round(SPOT * h()), full: 0.85 }); covered = 0; }
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
