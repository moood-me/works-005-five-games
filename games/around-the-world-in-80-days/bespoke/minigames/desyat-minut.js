// «Десять минут» (Пролог, Сэвил-Роу, кусок `pack`; фасад, все окна в кадре, саквояж у двери): Паспарту мечется по
// дому. Кольцо на каждом окне со списком Фогга — гардеробная (две рубашки), спальня (три пары чулок), холл (плащ),
// кабинет (Брэдшо); тихое кольцо на мансарде — газ, его в списке нет. Нажал окно — Паспарту бежит туда (`pp_in`
// 'none' на лестнице, этаж — RUN с, потом окно), и вещь летит в саквояж (`fly_what`, `fly` подъём до 1; `bag` растёт);
// каждое следующее нажатие того же окна — следующая вещь (не чаще THROW с; нажатия, пока он бежит, копятся). Мансарда
// — он гасит газ (`gas` → 0, GAS с). Тридцать секунд (тень плашки, слой времени); всё уложено — конец сразу.
//   Что делает: Паспарту за десять минут собирает хозяина в кругосветное путешествие.
//   Чего хочет: уложить всё по списку и не задержать мистера Фогга ни на минуту.
//   Каково ему: ошарашен — только что нанялся в самый спокойный дом Лондона; мечется, весело и бестолково.
//   Что чувствует игрок: весёлую суматоху — конец спокойной жизни; газ — мелочь, которую легко забыть.
//   → { missing: сколько вещей списка не уложено (0…4; каждая — Саквояж −50), gas: горит ли газ в мансарде }
import { until, keys } from '../hands.js';

// окно → что там по списку (сколько штук), этаж
const ROOMS = {
  dressing: { at: 'win_dressing', what: 'shirt', n: 2, floor: 2 },
  bedroom: { at: 'win_bedroom', what: 'stockings', n: 3, floor: 2 },
  hall: { at: 'win_hall', what: 'coat', n: 1, floor: 0 },
  study: { at: 'win_study', what: 'bradshaw', n: 1, floor: 1 },
};
const ATTIC = { at: 'attic', floor: 3 };
const LIMIT = 30; // с
const RUN = 0.45, ROOM = 0.5; // с: этаж по лестнице; от двери к окну комнаты
const THROW = 0.6; // с: от вещи к вещи в одной комнате
const FLY = 0.5; // с: `fly` стоит на 1, потом 0 (следующий подъём)
const GAS = 1.2; // с: дотянуться до рожка
const BAG0 = 0.15; // саквояж у двери, пустой
const AFTER = 0.8; // с после последней вещи — конец
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export default {
  file: 'desyat-minut',
  title: 'Десять минут', // как её зовёт ☰ автора
  about: 30,
  skipped: { missing: 0, gas: true }, // список уложен; газ, которого в списке нет, горит — как у Верна
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Две рубашки, три пары чулок, плащ, путеводитель Брэдшо — и десять минут' });
    const send = keys(g), acts = new Set();
    const move = (key, value, over) => { const a = b.act('state', 'move', key, value, { over }); acts.add(a); return a; };
    signal.addEventListener('abort', () => { for (const a of acts) a.cancel?.(); });
    const ALL = Object.values(ROOMS).reduce((s, r) => s + r.n, 0);
    mg.plate.set({ shade: 0 });
    const time = mg.layer('time');
    send('pp_in', 'none');
    send('fly', 0);
    send('bag', BAG0);
    send('gas', 1);
    // кольца: окна списка и тихое — мансарда
    const left = {}, rings = {}, presses = [];
    for (const [room, r] of Object.entries(ROOMS)) {
      left[room] = r.n;
      rings[room] = mg.mark({ at: r.at, kind: 'ring' });
      const p = mg.press({ on: rings[room] });
      p.on('press', () => go(room));
      presses.push(p);
    }
    rings.attic = mg.mark({ at: ATTIC.at, kind: 'ring', quiet: true });
    mg.press({ on: rings.attic }).on('press', () => go('attic'));
    b.minigame.tricks.teach(mg, presses.slice(0, 1), { id: 'press' });
    // где он: floor — последний этаж, куда добежал; dest — куда бежит или где он; там с arrive; want — сколько ещё
    // нажатий в этой комнате ждут; next — когда он сможет бросить следующую
    let floor = 0, dest = null, here = null, arrive = 0, want = 0, next = 0, flyOff = -1, gasAt = -1, gasOff = false, packed = 0, t0 = mg.t, now = 0;
    const floorOf = room => (room === 'attic' ? ATTIC : ROOMS[room]).floor;
    function go(room) {
      if (room === 'attic' && gasOff) return;
      if (room !== 'attic' && left[room] <= 0) return;
      if (room === dest) { want = Math.min(want + 1, room === 'attic' ? 1 : left[room]); return; }
      const from = dest ? floorOf(dest) : floor;
      dest = room;
      want = 1;
      arrive = now + Math.abs(floorOf(room) - from) * RUN + ROOM;
      next = arrive;
      gasAt = -1;
      here = null;
      send('pp_in', 'none');
    }
    const done = await until(mg, ({ t }) => {
      now = t - t0;
      // прибежал: свет в окне, он там
      if (dest && now >= arrive && here !== dest) { here = dest; send('pp_in', dest); floor = floorOf(dest); }
      if (dest && now >= arrive) {
        if (dest === 'attic') {
          if (gasAt < 0 && !gasOff) gasAt = now + GAS;
          if (gasAt >= 0 && now >= gasAt && !gasOff) {
            gasOff = true;
            move('gas', 0, 0.5);
            mg.snap({ at: rings.attic });
            rings.attic.remove();
          }
        } else if (want > 0 && left[dest] > 0 && now >= next) {
          // вещь летит в саквояж
          want--;
          left[dest]--;
          packed++;
          next = now + THROW;
          send('fly_what', ROOMS[dest].what);
          send('fly', 1);
          flyOff = now + FLY;
          send('bag', BAG0 + (0.95 - BAG0) * packed / ALL);
          if (left[dest] === 0) { mg.snap({ at: rings[dest] }); rings[dest].remove(); }
        }
      }
      if (flyOff >= 0 && now >= flyOff) { flyOff = -1; send('fly', 0); }
      const u = clamp(now / LIMIT);
      time.set({ u, level: 1 });
      mg.plate.set({ fill: packed / ALL, shade: u, glow: dest && now < arrive ? 'good' : 'idle' });
      return now >= LIMIT || (packed >= ALL && flyOff < 0 && now >= next - THROW + AFTER);
    });
    time.remove();
    if (!done) return this.skipped;
    if (flyOff >= 0) send('fly', 0);
    const missing = Object.keys(ROOMS).filter(room => left[room] > 0).length;
    await mg.end({ as: missing ? 'flawed' : 'clean' });
    return { missing, gas: !gasOff };
  },
};
