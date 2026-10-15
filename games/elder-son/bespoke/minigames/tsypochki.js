// «На цыпочках» (II.6, Дом, после куска `sneak`; game.md §7): ритм — доли — тики ходиков, раз в 1.0 с (тик на каждой);
// знак доли без касания — на `clock#face`; касание — где угодно (окно доли ±220 мс). Касание в долю — шаг: цель `sneak`
// = min(`sneak` + 0.1, `sneak_at` + 0.12) (вперёд не дальше, чем они успевают дойти; сцена ведёт обоих походкой
// `tiptoe` и говорит, где они, — `sneak_at`). Не в долю — ошибка (рано / поздно), скрип половицы, Сарафанов
// ворочается: `stir` += 0.3 (спадает на 0.1 в секунду), при `stir` ≥ 0.6 — кашель за стеной; счёт `creaks`. Конец —
// у двери (`sneak_at` ≥ 0.98): clean / flawed.
//   Чувство: крадётся из чужого дома на рассвете; хочет уйти, не разбудив; стыдно; игрок — шаг в такт, дыхание затаено.
//   → { creaks }
import { until, keys } from '../hands.js';

const BPM = 60; // тик ходиков — раз в 1.0 с
const WINDOW = 0.22; // с: окно доли
const STEP = 0.1, AHEAD = 0.12;
const STIR = 0.3, CALM = 0.1, COUGH = 0.6;
const DOOR = 0.98;

export default {
  title: 'На цыпочках', // как её зовёт ☰ автора
  about: 15,
  skipped: { creaks: 0 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Половицы старые. Ходики тикают на всю кухню' });
    const send = keys(g);
    const clock = mg.mark({ at: 'clock#face', kind: 'light' });
    const beat = mg.rhythm({ on: null, show: [clock], bpm: BPM, window: WINDOW });
    b.minigame.tricks.teach(mg, [beat], { id: 'rhythm' });
    let sneak = Math.max(0, +g.get('sneak') || 0), stir = 0, creaks = 0, last = -1;
    beat.on('beat', () => g.sound.tick());
    beat.on('tap', ({ k, off, hit }) => {
      if (hit) {
        if (k === last) return; // (доля засчитана раз)
        last = k;
        const at = +g.get('sneak_at') || 0;
        sneak = Math.min(1, sneak + STEP, at + AHEAD);
        send('sneak', sneak);
        return;
      }
      mg.error(off < 0 ? 'early' : 'timing', {});
      g.sound.creak();
      creaks++;
      stir = Math.min(1, stir + STIR);
      if (stir >= COUGH) g.sound.cough();
    });
    const done = await until(mg, ({ dt }) => {
      stir = Math.max(0, stir - CALM * dt);
      send('stir', stir);
      const at = +g.get('sneak_at') || 0;
      mg.plate.set({ fill: at, glow: stir >= COUGH ? 'bad' : 'idle' });
      return at >= DOOR;
    });
    if (!done) return this.skipped;
    send('stir', 0);
    await mg.end({ as: creaks ? 'flawed' : 'clean' });
    return { creaks };
  },
};
