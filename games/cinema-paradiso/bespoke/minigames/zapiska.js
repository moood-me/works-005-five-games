// «Записка» (V.5, Будка в руинах, после куска `calendar`; вставка `calendar`): Сальваторе листает назад календарь
// 1958 года за дверью будки — открыт на декабре, прошлые месяцы завёрнуты за верх. Четыре раза, одна метка за раз:
// тянуть край завёрнутого листа (`calendar#fold`) вниз на 0.15 высоты окна, с пружиной; `fold` — где лист на пути.
// Дотянул — лист ложится поверх (`pages` + 1: ноябрь, октябрь, сентябрь, август), шелест; на первом — пыль слетает
// (`dust` → 0 за 1 с). Отпустил раньше — лист видимо уходит назад за верх. На августе — карандашные строки; 1.5 с — конец.
//   Чувство: Сальваторе листает назад календарь, который тридцать лет висел за дверью; хочет и боится найти; игрок —
//   открыть то, что спрятал Альфредо.
//   → {} (её записка — Р126; листок в его руке в Риме)
import { until, keys } from '../hands.js';

const PAGES = 4;
const DOWN = 0.15; // доля высоты окна — путь листа вниз
const BACK = 3; // fold в секунду назад, отпущенный
const DUST = 1; // с
const READ = 1.5; // с на августе

export default {
  file: 'zapiska',
  title: 'Записка', // как её зовёт ☰ автора
  about: 10,
  skipped: {},
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Календарь пятьдесят восьмого года открыт на декабре. Прошлые месяцы завёрнуты за верх' });
    const send = keys(g), acts = new Set();
    const move = (key, value, over) => { const a = b.act('state', 'move', key, value, { over }); acts.add(a); return a; };
    signal.addEventListener('abort', () => { for (const a of acts) a.cancel(); });
    mg.plate.set({ notches: [0.25, 0.5, 0.75] });
    send('pages', 0);
    send('fold', 0);
    for (let p = 1; p <= PAGES; p++) {
      // (тянуть вниз до порога: путь вниз без цели — язык сообщает, когда дотянули)
      const edge = mg.mark({ at: 'calendar#fold', kind: 'dash' });
      const sheet = mg.pull({ on: edge, tear: DOWN });
      if (p === 1) b.minigame.tricks.teach(mg, [sheet], { id: 'pull:tear' });
      let torn = false, fold = 0;
      sheet.on('tear', () => { torn = true; });
      const down = await until(mg, ({ dt }) => {
        const s = sheet.state;
        fold = s.held ? s.u : Math.max(0, fold - BACK * dt); // отпущенный — назад за верх, видимо
        send('fold', fold);
        mg.plate.set({ fill: (p - 1 + fold) / PAGES, glow: s.held ? 'good' : 'idle' });
        return torn;
      });
      if (!down) return this.skipped;
      send('pages', p);
      send('fold', 0);
      g.sound.paper();
      mg.snap({ at: edge });
      edge.remove();
      if (p === 1) { move('dust', 0, DUST); g.sound.puff(); }
    }
    const t1 = mg.t;
    if (!(await until(mg, ({ t }) => t - t1 >= READ))) return this.skipped;
    await mg.end({ as: 'clean' });
    return {};
  },
};
