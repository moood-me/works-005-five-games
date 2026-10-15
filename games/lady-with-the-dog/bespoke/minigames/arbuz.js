// «Арбуз» (II.1, Номер в Ялте, после куска `melon`; вставка `melon`): Гуров режет арбуз. Вести по линии: кольцо у ножа
// (`melon#knife`), пунктир разреза от `melon#from` до `melon#to`. Пройденное — `cut` (не быстрее 0.15 в секунду: язык
// сообщает, сколько пройдено, игра шлёт меньшее из этого и своего предела); отпускать и продолжать можно — счёт
// `lifts`. Сошёл с линии — ошибка «сошёл». Каждые 0.15 пути — хруст. Дорезал — защёлка, ломоть отвалился (`slice` 1),
// потом молчание: меток нет, ход сцены, тихий плач (подложка `weep` 0.15; на выходе — 0: подложки шага ставит глава),
// свеча оплывает своим действием (`candle` к 0.4 за 10 с), 10 с — конец.
//   Кто что делает: Гуров режет арбуз. Чего хочет: занять руки рядом с её стыдом. Что чувствует: неловкость, иронию.
//   Игрок: медленный аккуратный разрез — и потом ничего.
//   → { lifts: сколько раз отрывал нож }
import { until, keys } from '../hands.js';

const SPEED = 0.15; // доля разреза в секунду, не быстрее
const CRUNCH = 0.15; // хруст через каждую такую долю
const SILENCE = 10; // с молчания после разреза

export default {
  title: 'Арбуз',
  about: 18,
  skipped: { lifts: 0 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'На столе в номере лежал арбуз' });
    const send = keys(g);
    const knife = mg.mark({ at: 'melon#knife', kind: 'dash' });
    const trace = mg.trace({ on: knife, line: ['melon#from', 'melon#to'] });
    b.minigame.tricks.teach(mg, [trace], { id: 'trace' });
    let cut = 0, lifts = 0, crunched = 0, end = -1, candle = null;
    trace.on('off', () => mg.error('off', { at: trace }));
    trace.on('up', () => { if (cut > 0 && cut < 1) lifts++; });
    const leave = () => { candle?.cancel(); g.sound.weep(0, 1); };
    signal.addEventListener('abort', leave);
    const done = await until(mg, ({ t, dt }) => {
      if (end >= 0) return t >= end;
      cut = Math.min(trace.state.u, cut + SPEED * dt);
      send('cut', cut);
      if (cut - crunched >= CRUNCH) { crunched = cut; g.sound.knife(); }
      mg.plate.set({ fill: cut, glow: trace.state.tracing ? 'good' : 'idle' });
      if (cut >= 1) {
        mg.snap({ at: knife });
        send('cut', 1);
        send('slice', 1);
        trace.remove();
        knife.remove();
        mg.sceneTurn(true);
        g.sound.weep(0.15, 2);
        candle = b.act('state', 'move', 'candle', 0.4, { over: SILENCE });
        end = t + SILENCE;
      }
      return false;
    });
    if (!done) return this.skipped;
    signal.removeEventListener('abort', leave);
    g.sound.weep(0, 1);
    await mg.end({ as: 'neutral' });
    return { lifts };
  },
};
