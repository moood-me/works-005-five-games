// «У забора» (IV.1, Город С., после куска `fence_wait`; FENCE_CAM): Гуров ходит вдоль серого забора её дома. Тянуть к
// целям: кольцо с пунктиром на Гурове (`gurov#head`), цели — пять мест вдоль забора (`fence#p1…p5`); отпустил у цели —
// он идёт туда своим шагом (`walk_to`), туда и обратно, сколько угодно. Где он — `gurov_at` (сцена ставит разом). Рояль
// за окном (`opts.tune`: вальс или этюд) слышен глухо — тем громче, чем ближе он к окну (место 0.6): четыре раза в
// секунду уровень 0.15 + 0.6 · близость; полоса — тот же уровень. Впервые громче 0.4 — `opts.onPiano()` (не ждётся).
// Пять секунд под окном (ближе 0.08) — дождался: защёлка, конец; или 35 с — конец. На выходе рояль стихает за 3 с.
//   Кто что делает: Гуров ходит вдоль забора её дома. Чего хочет: увидеть её. Что чувствует: нелепость, надежду.
//   Игрок: искать место, где слышнее.
//   opts: { tune — 'waltz' | 'etude'; onPiano() — когда рояль впервые слышен }
//   → { stood: дождался ли под окном }
import { until, keys } from '../hands.js';

const PLACES = [0.1, 0.3, 0.5, 0.6, 0.85]; // `gurov_at` мест fence#p1…p5
const WINDOW = 0.6, NEAR = 0.35, UNDER = 0.08, STAND = 5, LONG = 35;
const HEARD = 0.4; // уровень, на котором рояль впервые слышен
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export default {
  title: 'У забора',
  about: 18,
  skipped: { stood: true },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Из дома доносились звуки рояля, слабые, неясные' });
    const send = keys(g);
    const p = g.sound.piano(opts.tune ?? 'etude');
    signal.addEventListener('abort', () => p.stop(3));
    const him = mg.mark({ at: 'gurov#head', kind: 'dash' });
    const walk = mg.pull({ on: him, targets: PLACES.map((_, i) => `fence#p${i + 1}`) });
    b.minigame.tricks.teach(mg, [walk], { id: 'pull:targets' });
    walk.on('release', ({ target }) => { if (target >= 0) send('walk_to', PLACES[target]); });
    let at = +g.get('gurov_at');
    if (!(at >= 0)) at = PLACES[0];
    g.watch('gurov_at', v => { at = +v; });
    let heard = false, under = 0, tick = 0, level = 0;
    const t0 = mg.t;
    const done = await until(mg, ({ t: now, dt }) => {
      const t = now - t0;
      tick += dt;
      if (tick >= 0.25) {
        tick = 0;
        level = 0.15 + 0.6 * clamp(1 - Math.abs(at - WINDOW) / NEAR);
        p.loud(level, 0.3);
        if (!heard && level > HEARD) { heard = true; opts.onPiano?.(); }
      }
      under = Math.abs(at - WINDOW) < UNDER ? under + dt : 0;
      mg.plate.set({ fill: level, glow: under > 0 ? 'good' : 'idle' });
      return under >= STAND || t >= LONG;
    });
    if (!done) return this.skipped;
    const stood = under >= STAND;
    if (stood) mg.snap({ at: him });
    p.stop(3);
    await mg.end({ as: stood ? 'clean' : 'neutral' });
    return { stood };
  },
};
