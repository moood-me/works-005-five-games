// «Кэб» (Эпилог, Сэвил-Роу, кусок `cab`; кэб в тумане к Реформ-клубу, камера с ним): ритм где угодно — доля копыт
// (кольцо сходится на голове лошади `cab#horse`). В долю — лошадь прибавляет (`cab_pace` к 1: шаг → галоп), мимо доли
// — сбивается, пропущенная доля — понемногу сдаёт. Игра ведёт кэб вперёд по `cab_pace` (`cab_to` — куда он едет,
// сцена везёт его туда и говорит, где он, `cab_at`); из тумана навстречу выплывают фонари экипажей (`traffic`). Часы
// идут: LIMIT с — от 20:35 до 20:45 (тень плашки, слой времени). Кэб у клуба (`cab_at` ≥ ARRIVE) — успел; часы
// вышли раньше — опоздал. Щедрая: опоздать можно, только почти не понукая.
//   Что делает: кэб гонит сквозь лондонский туман к Реформ-клубу; Фогг считает секунды.
//   Чего хочет: войти в клуб до восьми сорока пяти — суббота открыта, день выигран.
//   Каково ему: последние минуты; туман, фонари, стук копыт и сердца.
//   Что чувствует игрок: гнать — в лад с лошадью, не сбиваясь, пока идут часы.
//   → { late: опоздал ли }
import { until, keys } from '../hands.js';

const BPM = 100; // доля копыт
const START = 0.3, HIT = 0.12, MISS = 0.1, LAPSE = 0.04; // cab_pace: в начале; за долю в такт; мимо; пропущенная доля
const BASE = 0.012, GAIN = 0.04; // cab_to в секунду: шагом; прибавка на полном ходу
const LIMIT = 50; // с: до 20:45
const ARRIVE = 0.98; // cab_at: у клуба
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export default {
  file: 'keb',
  title: 'Кэб', // как её зовёт ☰ автора
  about: 36,
  skipped: { late: false },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Двадцать часов тридцать пять минут. До Пэлл-Мэлл — туман и десять минут' });
    const send = keys(g);
    const horse = mg.mark({ at: 'cab#horse', kind: 'ring' });
    const hooves = mg.rhythm({ on: null, show: [horse], bpm: BPM });
    b.minigame.tricks.teach(mg, [hooves], { id: 'rhythm:anywhere' });
    const time = mg.layer('time');
    let pace = START, to = clamp(+g.get('cab_to') || 0), tapped = true, last = null;
    hooves.on('tap', ({ hit }) => {
      tapped = true;
      if (hit) pace = Math.min(1, pace + HIT);
      else { pace = Math.max(0, pace - MISS); mg.error('timing', { at: horse }); }
    });
    hooves.on('beat', () => { if (!tapped) pace = Math.max(0, pace - LAPSE); tapped = false; });
    send('traffic', 0.6);
    const t0 = mg.t;
    const done = await until(mg, ({ t, dt }) => {
      const now = t - t0;
      to = clamp(to + dt * (BASE + GAIN * pace));
      send('cab_to', to);
      send('cab_pace', pace);
      const at = clamp(+g.get('cab_at') || 0), u = clamp(now / LIMIT);
      time.set({ u, level: 1 });
      // (минуты на плашке — когда меняются)
      const minute = 35 + Math.min(10, Math.floor(u * 10));
      if (minute !== last) { last = minute; if (minute > 35) mg.plate.set({ phrase: minute < 45 ? `Двадцать часов ${MINUTES[minute - 36]}. Туман, фонари экипажей` : 'Двадцать часов сорок пять минут' }); }
      mg.plate.set({ fill: at, shade: u, glow: pace >= 0.6 ? 'good' : 'idle' });
      return at >= ARRIVE || now >= LIMIT;
    });
    time.remove();
    if (!done) return this.skipped;
    const late = clamp(+g.get('cab_at') || 0) < ARRIVE;
    await mg.end({ as: late ? 'loss' : 'clean' });
    return { late };
  },
};

const MINUTES = ['тридцать шесть минут', 'тридцать семь минут', 'тридцать восемь минут', 'тридцать девять минут',
  'сорок минут', 'сорок одна минута', 'сорок две минуты', 'сорок три минуты', 'сорок четыре минуты'];
