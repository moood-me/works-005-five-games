// «Бегом» (V.3, Улица, после куска `run_out`; game.md §7): улица от калитки (0) до тропы на платформу (1), ≈ 65 м.
// Держать где угодно — Бусыгин бежит (`run` = min(`run_at` + 0.08, 1), `look_back` 0; где он — `run_at`, ставит сцена);
// светится он сам. Отпустил — останавливается и оборачивается на освещённое окно кухни (`run` = `run_at`, `look_back`
// 1); счёт `looks`. Это не ошибка: бег и оглядки — и есть игра. На 8-й секунде — гудок: последняя уже идёт. Конец —
// у тропы (`run_at` ≥ 0.98, neutral). Само не бежит.
//   Чувство: бежит от дома, где сказана правда, к последней электричке; хочет уехать; не может не оглядываться; игрок —
//   бег и оглядка на окно.
//   → { seconds, looks }
import { until, keys } from '../hands.js';

const AHEAD = 0.08;
const HORN = 8; // с — гудок последней
const THERE = 0.98;

export default {
  title: 'Бегом', // как её зовёт ☰ автора
  about: 24,
  skipped: { seconds: 24, looks: 1 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Последняя — в двадцать три сорок. Окно кухни ещё горит' });
    const send = keys(g);
    const at = () => +g.get('run_at') || 0;
    mg.glow('busygin');
    const run = mg.hold({ on: null, seconds: 1, drain: 0 });
    // (оглядка — тоже путь: палец показывают при первой встрече, не когда игрок замер)
    b.minigame.tricks.teach(mg, [run], { id: 'hold:anywhere', still: null });
    let looks = 0, ran = false, begun = false, horn = false;
    const done = await until(mg, ({ t }) => {
      const now = at(), held = run.state.held;
      if (held) ran = begun = true;
      else if (ran) { ran = false; looks++; } // (отпустил на бегу — оглянулся)
      send('run', held ? Math.min(now + AHEAD, 1) : now);
      send('look_back', held || !begun ? 0 : 1); // (до первого шага — ещё не оглядывался)
      if (!horn && t >= HORN) { horn = true; g.sound.horn(0.4); }
      mg.plate.set({ fill: now, glow: held ? 'good' : 'idle' });
      return now >= THERE;
    });
    if (!done) return this.skipped;
    send('look_back', 0);
    const seconds = Math.round(mg.t);
    await mg.end({ as: 'neutral' });
    return { seconds, looks };
  },
};
