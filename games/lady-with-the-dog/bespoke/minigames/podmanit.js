// «Подманить» (I.1, Набережная, после куска `coax`; GARDEN_CAM): Гуров опускает руку к чужому шпицу.
// Вести (язык §4.9): стрелка — его опущенная рука (`hand` 0…1: как низко и как близко к морде), зона — у морды шпица
// (`spitz#head`; светится сам шпиц). Пока стрелка в зоне и движение не резкое, своё `near` растёт на 0.09 в секунду и
// шлётся ключом `spitz_near` (сцена ставит шпица разом). Резкое движение — шпиц ворчит: ошибка «в опасность» у его
// морды, `near` −0.2, секунду роста нет. `near` 1 — шпиц у колена: защёлка, через 0.5 с конец.
//   Кто что делает: Гуров тянет руку к чужой собачке. Чего хочет: развлечься, подойти к даме через неё.
//   Что чувствует: ленив, насмешлив, чуть любопытен. Игрок: терпение и маленькая хитрость.
//   → { startles: сколько раз спугнул }
import { until, keys } from '../hands.js';

const ZONE = { at: 0.45, width: 0.4 }; // где у морды держать стрелку (−1…1: рука высоко и далеко … низко и близко)
const RATE = 0.09; // доля пути шпица в секунду
const SHARP = 0.12; // резкость движения, от которой шпиц пугается (язык: насколько резко, за кадр)
const STARTLE = 0.2, STILL = 1; // на сколько он отходит; сколько секунд не подходит
const AFTER = 0.5; // с от защёлки до конца
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export default {
  title: 'Подманить', // как её зовёт ☰ автора
  about: 15,
  skipped: { startles: 0 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Шпиц смотрел на чужую руку и не решался подойти' });
    const send = keys(g);
    const lead = mg.lead({ zone: ZONE, steer: 'follow', release: 'stay' });
    b.minigame.tricks.teach(mg, [lead], { id: 'lead' });
    mg.glow('spitz');
    let near = clamp(+g.get('spitz_near') || 0), startles = 0, still = -1, end = -1;
    const done = await until(mg, ({ t, dt }) => {
      const s = lead.state;
      send('hand', clamp((s.arrow + 1) / 2));
      if (end >= 0) return t >= end;
      if (s.held && s.jerk > SHARP && t >= still) {
        startles++;
        mg.error('danger', { at: b.where('spitz#head') || undefined });
        g.sound.growl();
        near = clamp(near - STARTLE);
        still = t + STILL;
      } else if (s.in && t >= still) near = clamp(near + RATE * dt);
      send('spitz_near', near);
      mg.plate.set({ fill: near, glow: t < still ? 'bad' : s.in ? 'good' : 'idle' });
      if (near >= 1) {
        mg.snap({ at: b.where('spitz#head') || undefined });
        end = t + AFTER;
      }
      return false;
    });
    if (!done) return this.skipped;
    await mg.end({ as: startles ? 'flawed' : 'clean' });
    return { startles };
  },
};
