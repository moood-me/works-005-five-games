// «Сто ночей» (III.3, Площадь, после куска `nights`; кадр BALCONY): Тото на стуле под балконом Елены, ночь за ночью.
// Четырнадцать недель по семь ночей. Неделя — держать где угодно (он сидит): налив у `toto`, 1.2 с, в дождь, ветер и
// холод — 1.8 с; отпустили — налив стоит (ночь не кончается; не ошибка). Налив полон — нажать кольцо на стене
// (`chalk_wall#chalk`): палочка мелом (`mark_chalk` — импульс, сцена играет chalk_mark), `chalk` + 7. На седьмой неделе
// ставня приоткрывается (`elena_window` 0.3) и закрывается. Погода недели — `night_kind`.
//   Чувство: Тото сидит под балконом ночь за ночью; хочет доказать; упрямство с улыбкой; игрок — терпение.
//   → {} (98 палочек на стене; в 1988 они ещё видны)
import { until, keys } from '../hands.js';

const WEEKS = ['clear', 'rain', 'wind', 'clear', 'feast', 'rain', 'clear', 'wind', 'rain', 'clear', 'wind', 'cold', 'cold', 'cold'];
const NIGHT = 1.2, HARD = 1.8; // с: налив недели; в дождь, ветер, холод
const MARK = 0.4; // с: палочка ставится, потом следующая неделя
const SHUTTER_WEEK = 6; // седьмая (с нуля)
const SHUTTER_IN = 0.4, SHUTTER_HOLD = 1.5; // с
const RAIN = 0.6; // уровень дождя на дождливую неделю

export default {
  file: 'sto-nochey',
  title: 'Сто ночей', // как её зовёт карта автора
  about: 36,
  skipped: {},
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Ночи длинные. За каждую неделю — палочка мелом на стене банка' });
    const send = keys(g), acts = new Set();
    const move = (key, value, over) => { const a = b.act('state', 'move', key, value, { over }); acts.add(a); return a; };
    let raining = false;
    const rain = on => { if (on !== raining) { raining = on; g.sound.rain(on ? RAIN : 0, 1); } };
    signal.addEventListener('abort', () => { for (const a of acts) a.cancel(); rain(false); });
    const W = WEEKS.length;
    mg.plate.set({ notches: Array.from({ length: W - 1 }, (_, i) => (i + 1) / W) });
    let chalk = Math.round(+g.get('chalk') || 0);
    for (let w = 0; w < W; w++) {
      const kind = WEEKS[w];
      send('night_kind', kind);
      rain(kind === 'rain');
      if (kind === 'feast') g.sound.band();
      // неделя: он сидит
      const seat = mg.mark({ at: 'toto', kind: 'groove' });
      const hold = mg.hold({ on: null, show: seat, seconds: ['rain', 'wind', 'cold'].includes(kind) ? HARD : NIGHT, drain: 0 });
      if (w === 0) b.minigame.tricks.teach(mg, [hold], { id: 'hold:anywhere' });
      let shutter = w === SHUTTER_WEEK ? 'closed' : null, opened = 0;
      const sat = await until(mg, ({ t }) => {
        const s = hold.state;
        // на седьмой неделе, пока налив, — ставня
        if (shutter === 'closed' && s.fill >= 0.4) { shutter = 'open'; opened = t; move('elena_window', 0.3, SHUTTER_IN); g.sound.shutter(); }
        if (shutter === 'open' && t - opened >= SHUTTER_IN + SHUTTER_HOLD) { shutter = 'done'; move('elena_window', 0, SHUTTER_IN); g.sound.shutter(); }
        mg.plate.set({ fill: (chalk + 7 * s.fill) / 98, glow: s.held ? 'good' : 'idle' });
        return s.fill >= 1 && shutter !== 'open';
      });
      if (!sat) return this.skipped;
      seat.remove();
      // палочка мелом
      const wall = mg.mark({ at: 'chalk_wall#chalk', kind: 'ring' });
      const press = mg.press({ on: wall });
      if (w === 0) b.minigame.tricks.teach(mg, [press], { id: 'press' });
      let pressed = false;
      press.on('press', () => { pressed = true; });
      const marked = await until(mg, () => pressed);
      if (!marked) return this.skipped;
      chalk += 7;
      send('mark_chalk', 1);
      send('chalk', chalk);
      g.sound.chalk();
      mg.snap({ at: wall });
      wall.remove();
      mg.plate.set({ fill: chalk / 98 });
      const t1 = mg.t;
      if (!(await until(mg, ({ t }) => t - t1 >= MARK))) return this.skipped;
      send('mark_chalk', 0);
    }
    rain(false);
    await mg.end({ as: 'clean' });
    return {};
  },
};
