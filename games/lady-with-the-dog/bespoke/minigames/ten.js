// «Тень» (III.1, Москва, после куска `evening_walk`; STREET_CAM): Гуров идёт по вечерней улице к камере, и в каждой
// женщине ему видится она. Для N = 1…count: ожидание `evening_walk:stopN` (поставлено заранее), `walk_on` = N — он идёт
// к N-й точке и стоит; дошёл — впереди выходит тень N (`shadeN` 1, сцена: 1–2 с) и стоит спиной; первая — `opts.onFirst()`
// (не ждётся). Нажать: кольцо на её голове, дуга времени 6 с. Нажал — он всматривается (`gurov_look` на неё, 1 с), она
// оборачивается — чужое лицо — и уходит (`shadeN` 2), через 2.5 с он отводит взгляд. Не нажал за 6 с — она уходит сама.
// Следующая — через 2 с; после последней — 2 с, конец.
//   Кто что делает: Гуров идёт по московской улице. Чего хочет: забыть. Что чувствует: память не отпускает.
//   Игрок: всмотреться, узнать, ошибиться.
//   opts: { count — 4 или 2 фигуры; onFirst() — при первой }
//   → { touched: [номера тех, в кого всмотрелся] }
import { until, keys } from '../hands.js';

const STOP = 30000; // мс: дошёл до точки (сцена говорит)
const OUT = 1.5; // с: она выходит
const TIME = 6; // с на взгляд
const LOOK = 1, AWAY = 2.5; // с: всматривается; потом отводит взгляд
const GAP = 2; // с до следующей; после последней

export default {
  title: 'Тень',
  about: 26,
  skipped: { touched: [] },
  async run(g, b, opts, signal) {
    const count = opts.count ?? 4;
    const mg = g.minigame({ phrase: 'На улице были женщины, и каждая издали была похожа на неё' });
    const send = keys(g);
    const wait = s => { const at = mg.t + s; return until(mg, ({ t }) => t >= at); };
    const touched = [];
    let passed = 0, taught = false;
    const bar = () => mg.plate.set({ fill: passed / count, glow: 'idle' });
    bar();
    for (let n = 1; n <= count; n++) {
      const there = g.told(`evening_walk:stop${n}`, STOP);
      send('walk_on', n);
      await Promise.race([there, until(mg, () => false)]);
      if (signal.aborted) return this.skipped;
      send(`shade${n}`, 1);
      if (n === 1) opts.onFirst?.();
      if (!(await wait(OUT))) return this.skipped;
      const mark = mg.mark({ at: `shade${n}#head`, time: 1 });
      const press = mg.press({ on: mark });
      if (!taught) { taught = true; b.minigame.tricks.teach(mg, [press], { id: 'press' }); }
      let looked = false;
      press.on('press', () => { looked = true; });
      const from = mg.t;
      const ok = await until(mg, ({ t }) => {
        mark.set({ time: Math.max(0, 1 - (t - from) / TIME) });
        return looked || t - from >= TIME;
      });
      if (!ok) return this.skipped;
      if (looked) {
        touched.push(n);
        mg.snap({ at: mark });
        mark.remove();
        send('gurov_look', `shade${n}`);
        if (!(await wait(LOOK))) return this.skipped;
        send(`shade${n}`, 2);
        if (!(await wait(AWAY))) return this.skipped;
        send('gurov_look', null);
      } else {
        mark.remove();
        send(`shade${n}`, 2);
      }
      passed = n;
      bar();
      if (!(await wait(GAP))) return this.skipped;
    }
    await mg.end({ as: 'neutral' });
    return { touched };
  },
};
