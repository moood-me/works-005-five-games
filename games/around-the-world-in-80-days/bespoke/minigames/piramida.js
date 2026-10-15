// «Пирамида» (II.6, Гавань — Иокогама, кусок `pyramid`; балаган Батулкара, ночь): Паспарту в основании живой
// пирамиды «Длинных носов». Вести где угодно: стрелка — крен пирамиды (`tilt` −1…1), зона — ровно; «носы» лезут вверх
// и раскачивают её (`push`). Ровно — ярусы растут (`pyramid` 0 → 1), криво — стоят; качнулась до края — ошибка,
// ярус оседает. На FOGG — в первом ряду садится Фогг (`fogg_present` 1; сцена говорит `pyramid:fogg`). С этого мига —
// выбор руками, отклик ровный: достоять (держать ровно до `pyramid` 1) или отпустить (палец прочь LET_GO с —
// пирамида валится). Призрачный палец показывает оба пути.
//   Что делает: Паспарту, без гроша нанявшийся в труппу, держит на плечах ярусы акробатов.
//   Чего хочет: достоять номер, не подвести товарищей — и вдруг видит в первом ряду хозяина.
//   Каково ему: смешно и мучительно: верность товарищам против хозяина в зале.
//   Что чувствует игрок: держать равновесие — и самому решить, что важнее.
//   → { choice: 'hold' (достоял) | 'drop' (бросил) }
import { until, keys } from '../hands.js';

const CLIMB = 0.05; // pyramid в секунду, пока ровно
const ZONE = 0.5, EDGE = 0.95; // ширина зоны; крен — ошибка
const SLIP = 0.08; // pyramid: ярус оседает
const FOGG = 0.5; // pyramid: Фогг садится в первом ряду
const SEAT = 3; // с: ждать `pyramid:fogg` не дольше
const LET_GO = 1.5; // с без пальца — бросил
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const sway = (t, h) => 0.2 * Math.sin(1.1 * t) + 0.12 * Math.sin(2.7 * t + 1) + 0.06 * h;

export default {
  file: 'piramida',
  title: 'Пирамида', // как её зовёт ☰ автора
  about: 24,
  skipped: { choice: 'drop' }, // как у Верна: увидел хозяина — и пирамида рухнула
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: '«Длинные носы» лезут друг другу на плечи. В основании — Паспарту' });
    const send = keys(g);
    send('pyramid', 0); send('tilt', 0); send('fogg_present', 0);
    const lead = mg.lead({ zone: { at: 0, width: ZONE }, steer: 'rate', release: 'stay', push: 0 });
    b.minigame.tricks.teach(mg, [lead], { id: 'lead' });
    let h = 0, wobbling = false, slips = 0, fogg = false, seated = false, offSince = null, choice = null;
    const t0 = mg.t;
    const done = await until(mg, ({ t, dt }) => {
      const now = t - t0, s = lead.state;
      lead.set({ push: sway(now, h) });
      send('tilt', s.arrow);
      send('pyramid', h);
      if (!seated) {
        // умение: ровно — растёт; на краю — оседает
        if (s.in) h = Math.min(FOGG, h + CLIMB * dt);
        if (Math.abs(s.arrow) >= EDGE && !wobbling) { wobbling = true; slips++; h = Math.max(0, h - SLIP); mg.error('danger', { at: lead }); }
        if (s.in) wobbling = false;
        if (h >= FOGG && !fogg) {
          fogg = true;
          send('fogg_present', 1);
          // (он садится — тогда выбор; сцена молчит — через SEAT с)
          g.told('pyramid:fogg', SEAT * 1000).then(() => {
            if (signal.aborted) return;
            seated = true;
            offSince = s.held ? null : mg.t;
            mg.plate.set({ phrase: 'В первом ряду, с часами в руке, сидит мистер Фогг', glow: null });
            mg.show({ gestures: [lead] }).finished.then(() => { if (!choice && !signal.aborted) mg.show({ handsOff: true }); });
          });
        }
        mg.plate.set({ fill: h, glow: s.in ? 'good' : 'bad' });
        return false;
      }
      // выбор: достоять — или отпустить
      if (s.held) { offSince = null; if (s.in) h = Math.min(1, h + CLIMB * dt); }
      else if (offSince == null) offSince = t;
      if (offSince != null && t - offSince >= LET_GO) choice = 'drop';
      if (h >= 1) choice = 'hold';
      mg.plate.set({ fill: h });
      return !!choice;
    });
    if (!done) return this.skipped;
    await mg.end({ as: 'neutral' });
    return { choice };
  },
};
