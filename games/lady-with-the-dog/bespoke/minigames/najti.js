// «Найти» (IV.2, Театр в С., после куска `hall_find`; HALL_CAM): Гуров ищет её в провинциальной толпе. Своё `enter`
// растёт на 1 каждые 3 с от 1 до 6 — сцена ведёт следующую даму по проходу к её месту (lady1, lady2, lady3, Анна,
// lady4, lady5). На каждой севшей — кольцо с лепестком «Она?». Не она — ошибка «не то», метка снята. Она — защёлка,
// через 0.5 с конец. Через 25 с, если не нашёл, блик её лорнетки ярче (`glint` 1) и палец показывает её метку. Полоса —
// сколько дам вошло.
//   Кто что делает: Гуров ищет её в толпе. Чего хочет: увидеть её. Что чувствует: нетерпение.
//   Игрок: искать и ошибаться.
//   → { wrong: сколько раз ошибся }
import { until, keys } from '../hands.js';

const ORDER = ['lady1', 'lady2', 'lady3', 'anna', 'lady4', 'lady5'];
const EVERY = 3; // с между дамами
const SIT = 2.5; // с от входа до того, как она села (метка)
const HINT = 25; // с: блик ярче, палец показывает
const AFTER = 0.5;
const PETAL = [{ id: 'her', label: 'Она?' }];

export default {
  title: 'Найти',
  about: 18,
  skipped: { wrong: 0 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Публика входила и рассаживалась' });
    const send = keys(g);
    let enter = 0, wrong = 0, end = -1, hinted = false, taught = false, annaPress = null;
    const sat = new Set();
    const t0 = mg.t;
    const done = await until(mg, ({ t: now }) => {
      const t = now - t0;
      if (end >= 0) return t >= end;
      const k = Math.min(ORDER.length, 1 + Math.floor(t / EVERY));
      if (k > enter) { enter = k; send('enter', enter); }
      // the ladies who have sat by now: a mark each
      ORDER.forEach((id, i) => {
        if (sat.has(id) || t < i * EVERY + SIT) return;
        sat.add(id);
        const mark = mg.mark({ at: `${id}#head` });
        const press = mg.press({ on: mark, petals: PETAL });
        if (id === 'anna') annaPress = press;
        if (!taught) { taught = true; b.minigame.tricks.teach(mg, [press], { id: 'press:petal' }); }
        press.on('choose', () => {
          if (end >= 0) return;
          if (id === 'anna') {
            mg.snap({ at: mark });
            end = mg.t - t0 + AFTER;
          } else {
            wrong++;
            mg.error('wrong', { at: mark });
            mark.remove();
          }
        });
      });
      if (!hinted && t >= HINT && annaPress) {
        hinted = true;
        g.set('glint', 1, 1);
        mg.show({ gestures: [annaPress] });
      }
      mg.plate.set({ fill: enter / ORDER.length, glow: 'idle' });
      return false;
    });
    if (!done) return this.skipped;
    await mg.end({ as: wrong ? 'flawed' : 'clean' });
    return { wrong };
  },
};
