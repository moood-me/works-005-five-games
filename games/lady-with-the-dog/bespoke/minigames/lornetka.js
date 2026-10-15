// «Лорнетка» (I.2, Набережная, после куска `gangway`; GANGWAY_CAM, вид света `glass`): Анна в лорнетку смотрит на
// приезжих. Нажать: кольцо на голове каждого из двух последних отпущенных (метка идёт за точкой). Своё `pass` (сколько
// сошло) растёт на 1 каждые 4 с — сцена ведёт следующего вниз по сходням, по порядку p1…p4, stranger (с дамой), p5, p6.
// Нажал — `look_at` = он на 1.5 с (замедлился, повернул голову), метка снята. Перед пятым — ожидание
// `gangway:stranger`: когда высокий сутулый встал внизу спиной, поток стоит, метка только на нём; нажал — сердце,
// всмотрелась, он оборачивается к своей даме — чужое лицо (`stranger_turn` 1); 12 с не нажала — оборачивается сам, без
// звука. Потом p5, p6; толпа хлынула (`surge` 1), через 1 с конец.
//   Кто что делает: Анна ищет в лорнетку знакомых из С. Чего хочет: чтобы их не было. Что чувствует: страх и стыд.
//   Игрок: всматриваться и бояться узнать.
//   → { looked: в скольких всмотрелась, stranger: всмотрелась ли в сутулого }
import { until, keys } from '../hands.js';

const ORDER = ['p1', 'p2', 'p3', 'p4', 'stranger', 'p5', 'p6'];
const STEP = 4; // с между приезжими
const LOOK = 1.5; // с всматривается
const WAIT = 12; // с сутулый ждёт взгляда
const TOLD = 20000; // мс: сутулый дошёл до низа сходней (сцена говорит; без неё — дальше так)
const AFTER = 1; // с после `surge` — конец

export default {
  title: 'Лорнетка',
  about: 32,
  skipped: { looked: 0, stranger: false },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Пассажиры сходили по сходням, и между ними могли быть знакомые' });
    const send = keys(g);
    let pass = 0, next = STEP, phase = 'flow', looked = 0, stranger = false, lookTill = -1, standFrom = -1, end = -1, taught = false;
    const marks = []; // [{id, mark}] — на отпущенных, последние две
    const unmark = m => { m.mark.remove(); marks.splice(marks.indexOf(m), 1); };
    const look = (id, t) => { send('look_at', id); lookTill = t + LOOK; };
    const markOn = (id, onPress) => {
      const mark = mg.mark({ at: `${id}#head` });
      const press = mg.press({ on: mark });
      if (!taught) { taught = true; b.minigame.tricks.teach(mg, [press], { id: 'press' }); }
      const m = { id, mark };
      press.on('press', () => onPress(m));
      return m;
    };
    const onPassenger = m => { looked++; look(m.id, mg.t - t0); mg.snap({ at: m.mark }); unmark(m); };
    let arrived = null; // ожидание сутулого внизу сходней
    const t0 = mg.t;
    send('pass', 0);
    send('look_at', '');
    const done = await until(mg, ({ t: now }) => {
      const t = now - t0;
      if (lookTill >= 0 && t >= lookTill) { lookTill = -1; send('look_at', ''); }
      if (end >= 0) return t >= end;
      if (phase === 'flow' && t >= next) {
        if (pass === ORDER.length) {
          send('surge', 1);
          for (const m of [...marks]) unmark(m);
          end = t + AFTER;
          return false;
        }
        const id = ORDER[pass];
        if (id === 'stranger') {
          // (ожидание ставится до того, как его отпустили)
          arrived = g.told('gangway:stranger', TOLD);
          arrived.then(() => { if (phase === 'walk') phase = 'arrived'; });
          phase = 'walk';
          for (const m of [...marks]) unmark(m);
        }
        pass++;
        send('pass', pass);
        if (id !== 'stranger') {
          marks.push(markOn(id, onPassenger));
          while (marks.length > 2) unmark(marks[0]);
        }
        next = t + STEP;
      }
      if (phase === 'arrived') {
        // поток стоит: метка только на нём
        phase = 'stranger';
        standFrom = t;
        marks.push(markOn('stranger', m => {
          looked++;
          stranger = true;
          g.sound.heart();
          look('stranger', mg.t - t0);
          mg.snap({ at: m.mark });
          unmark(m);
          phase = 'turning';
          standFrom = mg.t - t0;
        }));
      }
      if (phase === 'stranger' && t - standFrom >= WAIT) {
        for (const m of [...marks]) unmark(m);
        send('stranger_turn', 1);
        phase = 'flow';
        next = t + STEP;
      }
      if (phase === 'turning' && t - standFrom >= LOOK) {
        send('stranger_turn', 1);
        phase = 'flow';
        next = t + STEP;
      }
      mg.plate.set({ fill: pass / ORDER.length, glow: 'idle' });
      return false;
    });
    if (!done) return this.skipped;
    await mg.end({ as: 'neutral' });
    return { looked, stranger };
  },
};
