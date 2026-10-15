// «Поводок» (III.2, Город С., после куска `autumn_walk`; FENCE_CAM): Анна гуляет со шпицем вдоль забора. Выбор жестом —
// держать где угодно (отклик у её руки с поводком, `anna#hand_l`): держит — она держит шпица и идёт к калитке
// (`anna_to` = где она − 0.05); отпустил — шпиц тянет к концу забора, к дороге на станцию (`anna_to` = где она +
// `opts.pull`). Где она — `anna_at` (сцена ставит разом); ключ шлётся при каждом его изменении. Отклик нейтральный, оба
// пути показаны пальцем в начале. Конец: у калитки (≤ 0.05) — 'home', у дороги (≥ 0.95) — 'road', через 35 с — к
// какому ближе. Ветер порывами: подложка `wind` до 0.7 на секунду раз в 5–8 с, потом 0.5 (уровень шага).
//   Кто что делает: Анна гуляет со шпицем вдоль забора. Чего хочет: забыть Ялту — и не может.
//   Что чувствует: тоску; шпиц тянет к дороге на станцию. Игрок: держать или отпустить.
//   opts: { pull — как сильно тянет шпиц: 0.06 (долг) или 0.09 (жизнь) }
//   → { end: 'home' | 'road' }
import { until, keys } from '../hands.js';

const HOME = 0.05, ROAD = 0.95, LONG = 35; // где конец пути; с
const BACK = 0.05; // держит — шаг к калитке
const WIND = 0.5, GUST = 0.7; // подложка ветра шага; порыв

export default {
  title: 'Поводок',
  about: 20,
  skipped: { end: 'home' },
  async run(g, b, opts, signal) {
    const pull = opts.pull ?? 0.06;
    const mg = g.minigame({ phrase: 'Шпиц тянул к концу забора, туда, где дорога к станции' });
    const send = keys(g);
    const leash = mg.mark({ at: 'anna#hand_l', kind: 'groove' });
    const hold = mg.hold({ on: null, show: leash, seconds: 0.4, drain: 0.4 });
    // (both ways shown: holding — and letting go)
    mg.show({ gestures: [hold] }).finished.then(() => { if (!signal.aborted) mg.show({ handsOff: true }); });
    signal.addEventListener('abort', () => g.sound.wind(WIND, 1));
    let at = +g.get('anna_at');
    if (!(at >= 0)) at = 0.3;
    let held = null, changed = true, gust = -1, calm = -1;
    g.watch('anna_at', v => { at = +v; changed = true; });
    const t0 = mg.t;
    mg.plate.set({ ways: [{ from: 0, to: 0.5, as: 'theirs' }, { from: 0.5, to: 1, as: 'own' }], glow: null });
    const done = await until(mg, ({ t: now }) => {
      const t = now - t0;
      const h = hold.state.held;
      if (changed || h !== held) {
        changed = false;
        held = h;
        send('anna_to', h ? Math.max(0, at - BACK) : Math.min(1, at + pull));
      }
      // wind in gusts
      if (gust < 0) gust = t + 5 + Math.random() * 3;
      if (t >= gust) { g.sound.wind(GUST, 0.4); calm = t + 1; gust = t + 5 + Math.random() * 3; }
      if (calm >= 0 && t >= calm) { g.sound.wind(WIND, 1.2); calm = -1; }
      mg.plate.set({ fill: at });
      return at <= HOME || at >= ROAD || t >= LONG;
    });
    if (!done) return this.skipped;
    g.sound.wind(WIND, 1);
    await mg.end({ as: 'neutral' });
    return { end: at >= 0.5 ? 'road' : 'home' };
  },
};
