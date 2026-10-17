// «Смена» (IV.2, Будка, после куска `changeover`; кадр PORTS): Тото меняет катушки весь вечер и ждёт Елену. Три смены;
// переключают на тот проектор, что стоит (`to`: 2, 1, 2 — 1 элемент `projector`, 2 — `projector2`); на другом меток
// нет. Ожидание 6 с: часы идут (`clock` 6 + k за 2 с); на второй — шаги на лестнице мимо. Первая точка: `cue` 1 на 0.8 с
// (мигает смотровое окошко), тик; кольцо на `#motor` стоящего с дугой времени 2.5 с — нажал: мотор (`motor{to}` 1).
// Через 3 с — вторая точка, тик выше; кольцо на `#lever`, дуга 2 с — нажал: переключил (`active` to, `motor{from}` 0).
// Дуга кончилась — «отстал», `missed` + 1, кольцо ждёт (на рычаге — экран белеет, зал свистит, пока не переключат).
//   Чувство: Тото работает и ждёт Елену; хочет не пропустить ни смену, ни её шаги; тревога; игрок — работать, ожидая.
//   → { missed: сколько точек пропущено (≥ 1 — Альфредо слышал свист: Р129) }
import { until, keys } from '../hands.js';

const TO = [2, 1, 2];
const WAIT = 6, CLOCK = 2; // с: ожидание; часы переходят
const CUE = 0.8; // с: точка мигает
const MOTOR_TIME = 2.5, LEVER_TIME = 2, GAP = 3; // с
const STEPS = 2 * TO.length;
const el = n => (n === 1 ? 'projector' : 'projector2');

export default {
  file: 'smena',
  title: 'Смена', // как её зовёт карта автора
  about: 38,
  skipped: { missed: 0 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Катушка на исходе. Перед концом в углу кадра мигает точка, потом вторая' });
    const send = keys(g), acts = new Set();
    const move = (key, value, over) => { const a = b.act('state', 'move', key, value, { over }); acts.add(a); return a; };
    signal.addEventListener('abort', () => { for (const a of acts) a.cancel(); });
    mg.plate.set({ notches: Array.from({ length: STEPS - 1 }, (_, i) => (i + 1) / STEPS) });
    send('clock', 6); send('motor1', 1); send('motor2', 0); send('active', 1); send('white', 0); send('cue', 0);
    let missed = 0, step = 0;
    const wait = async s => { const t1 = mg.t; return until(mg, ({ t }) => { mg.plate.set({ fill: step / STEPS, glow: 'idle' }); return t - t1 >= s; }); };
    // одна точка: мигнуло окошко, кольцо с дугой времени на ручке; → нажали (true) или мини-игру покинули (false)
    const point = async (ref, seconds, sound, late) => {
      send('cue', 1);
      g.sound[sound]();
      const t1 = mg.t;
      const ring = mg.mark({ at: ref, kind: 'ring', time: 1 });
      const press = mg.press({ on: ring });
      if (step === 0) b.minigame.tricks.teach(mg, [press], { id: 'press', still: null });
      let pressed = false, over = false;
      press.on('press', () => { pressed = true; });
      const ok = await until(mg, ({ t }) => {
        const left = Math.max(0, 1 - (t - t1) / seconds);
        if (t - t1 >= CUE) send('cue', 0);
        ring.set({ time: over ? 0 : left });
        if (!over && left <= 0 && !pressed) { over = true; missed++; mg.error('behind', { at: ring }); late?.(); }
        mg.plate.set({ fill: step / STEPS, glow: over ? 'bad' : 'idle' });
        return pressed;
      });
      send('cue', 0);
      if (!ok) return false;
      mg.snap({ at: ring });
      ring.remove();
      step++;
      return true;
    };
    for (let k = 1; k <= TO.length; k++) {
      const to = TO[k - 1], from = to === 1 ? 2 : 1;
      move('clock', 6 + k, CLOCK);
      if (k === 2) g.sound.steps();
      if (!(await wait(WAIT))) return this.skipped;
      // мотор стоящего
      if (!(await point(`${el(to)}#motor`, MOTOR_TIME, 'tick'))) return this.skipped;
      send(`motor${to}`, 1);
      g.sound.motor();
      if (!(await wait(GAP))) return this.skipped;
      // рычаг: переключить
      let white = false;
      const switched = await point(`${el(to)}#lever`, LEVER_TIME, 'tick2', () => { white = true; send('white', 1); g.sound.whistle(); });
      if (!switched) return this.skipped;
      send('active', to);
      send(`motor${from}`, 0);
      if (white) send('white', 0);
      g.sound.clunk();
    }
    move('clock', 10, CLOCK);
    if (!(await wait(CLOCK))) return this.skipped;
    await mg.end({ as: missed ? 'flawed' : 'clean' });
    return { missed };
  },
};
