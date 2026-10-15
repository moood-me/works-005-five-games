// «Пальто» (V.1, Улица, после куска `shawl`; вставка `shawl` открыта; game.md §7): кольцо с пунктиром на воротнике
// пальто (`shawl#coat`), путь к её плечам (`shawl#shoulders`); `lay` — место на пути, назад не идёт; отпустил — стоит.
// Дошло (`lay` ≥ 0.97) — через 1 с конец (clean). Само не опускается.
//   Чувство: кладёт своё пальто на плечи Нины; хочет её согреть — и сказать то, чего не скажет; нежно, неловко; игрок —
//   отдать своё.
//   → { seconds: от первого касания до конца }
import { until, keys } from '../hands.js';

const THERE = 0.97;

export default {
  title: 'Пальто', // как её зовёт ☰ автора
  about: 6,
  skipped: { seconds: 5 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Снег. Нина в одном платке' });
    const send = keys(g);
    const coat = mg.mark({ at: 'shawl#coat', kind: 'dash' });
    const pull = mg.pull({ on: coat, to: 'shawl#shoulders', release: 'stay' });
    b.minigame.tricks.teach(mg, [pull], { id: 'pull:to' });
    let lay = 0, started = null;
    send('lay', 0);
    const done = await until(mg, ({ t }) => {
      const s = pull.state;
      if (s.held) started ??= t;
      if (s.u > lay) lay = s.u; // (назад не идёт)
      else if (s.u < lay) pull.set({ u: lay });
      send('lay', lay);
      mg.plate.set({ fill: lay, glow: s.held ? 'good' : 'idle' });
      return lay >= THERE;
    });
    if (!done) return this.skipped;
    send('lay', 1);
    mg.snap({ at: coat });
    const t1 = mg.t;
    if (!(await until(mg, ({ t }) => t - t1 >= 1))) return this.skipped;
    const seconds = Math.round(mg.t - (started ?? mg.t));
    await mg.end({ as: 'clean' });
    return { seconds };
  },
};
