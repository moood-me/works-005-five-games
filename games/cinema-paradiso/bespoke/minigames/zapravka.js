// «Заправка» (II.1, Будка, после куска `lesson`; вставка `thread`): мальчик заправляет проектор — конец плёнки от
// зубца к зубцу, пять отрезков, одна метка за раз. Тянуть по пути: кольцо на конце плёнки у `thread#p{threaded}`, путь —
// до следующей точки; `pull` — где плёнка на отрезке; дошёл — `threaded` + 1, щелчок зубца. Отпустил раньше — пружина:
// плёнка видимо возвращается к началу отрезка, без ошибки. У петли (перед отрезком 2 → 3, на `thread#p2`) — держать
// желоб 0.8 с: `loop` 1, сцена делает петлю; отпустил раньше — стекает, ошибка, `slips` + 1.
//   Чувство: мальчик впервые заправляет проектор; хочет сделать как мастер; гордость и осторожность; игрок — учиться
//   руками.
//   → { slips: сколько раз петля сорвалась (≥ 1 — кадр в луче дрожит в `motor`) }
import { until, keys } from '../hands.js';

const SEGMENTS = 5;
const LOOP_AT = 2; // перед отрезком 2 → 3
const LOOP = 0.8, DRAIN = 0.5; // с: налив петли; стекает от полного
const STEPS = SEGMENTS + 1;
const DONE = 0.98;

export default {
  file: 'zapravka',
  title: 'Заправка', // как её зовёт ☰ автора
  about: 14,
  skipped: { slips: 0 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Плёнка идёт от зубца к зубцу. Без петли перед кадровым окном её рвёт' });
    const send = keys(g);
    mg.plate.set({ notches: Array.from({ length: STEPS - 1 }, (_, i) => (i + 1) / STEPS) });
    let slips = 0, step = 0;
    send('threaded', 0);
    send('pull', 0);
    for (let k = 0; k < SEGMENTS; k++) {
      if (k === LOOP_AT) {
        // петля перед кадровым окном
        const ring = mg.mark({ at: `thread#p${k}`, kind: 'groove' });
        const hold = mg.hold({ on: ring, seconds: LOOP, drain: DRAIN });
        b.minigame.tricks.teach(mg, [hold], { id: 'hold' });
        hold.on('up', () => {
          const u = hold.state.fill;
          if (u > 0.05 && u < 1) { slips++; mg.error('early', { at: ring }); }
        });
        const looped = await until(mg, () => {
          const s = hold.state;
          mg.plate.set({ fill: (step + s.fill) / STEPS, glow: s.held ? 'good' : 'idle' });
          return s.fill >= 1;
        });
        if (!looped) return this.skipped;
        send('loop', 1);
        g.sound.click();
        mg.snap({ at: ring });
        ring.remove();
        step++;
      }
      // отрезок k → k + 1
      const end = mg.mark({ at: `thread#p${k}`, kind: 'dash' });
      const pull = mg.pull({ on: end, to: `thread#p${k + 1}`, release: 'spring' });
      if (k === 0) b.minigame.tricks.teach(mg, [pull], { id: 'pull:spring' });
      const there = await until(mg, () => {
        const s = pull.state;
        send('pull', s.shown ?? s.u);
        mg.plate.set({ fill: (step + s.u) / STEPS, glow: s.held ? 'good' : 'idle' });
        return s.held && s.u >= DONE;
      });
      if (!there) return this.skipped;
      send('threaded', k + 1);
      send('pull', 0);
      g.sound.click();
      mg.snap({ at: end });
      end.remove();
      step++;
    }
    await mg.end({ as: slips ? 'flawed' : 'clean' });
    return { slips };
  },
};
