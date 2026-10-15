// «Руки» (I.3, Дом, после куска `kitchen`; вставка `stove` открыта; game.md §7): на `hands#hands` — пятно, тереть.
// Отогрев `thaw` растёт, пока палец живо трёт по пятну, — так, что живого растирания нужно ≈ 10 с (своё число: покрытие
// пятна языка набирается быстрее); `rub` — направление и скорость пальца, знак dx · min(1, |dx|/dt / 1.5 высоты кадра в
// секунду). Стоит без дела — ничего не остывает. На смене направления — шорох ладоней. `thaw` 1 — `rub` 0, через 1 с
// конец (clean).
//   Чувство: греет руки у чужой печи; хочет согреться; тепло взято ложью — неловко; игрок — тепло, которое жжёт.
//   → { seconds: от первого касания до конца }
import { until, keys } from '../hands.js';

const RUB = 10; // с живого растирания до тепла
const LIVELY = 1.5; // высот кадра в секунду — скорость пальца «вовсю»
const SPOT = 0.22; // радиус пятна, доля высоты кадра

export default {
  title: 'Руки', // как её зовёт ☰ автора
  about: 12,
  skipped: { seconds: 10 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Руки с мороза не гнутся. Дверца печи открыта' });
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
