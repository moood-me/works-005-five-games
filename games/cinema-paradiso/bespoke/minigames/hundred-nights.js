// "A Hundred Nights" (III.3, the square, after the beat `nights`; the shot BALCONY): Toto on the chair under Elena's balcony, night after night.
// Fourteen weeks of seven nights. A week — hold anywhere (he sits): the fill at `toto`, 1.2 s, in rain, wind and
// cold — 1.8 s; let go — the fill stands (the night does not end; not a mistake). The fill full — press the ring on the wall
// (`chalk_wall#chalk`): a stroke of chalk (`mark_chalk` — a pulse, the scene plays chalk_mark), `chalk` + 7. In the seventh week
// the shutter opens a little (`elena_window` 0.3) and shuts. The week's weather — `night_kind`.
//   The feeling: Toto sits under the balcony night after night; he wants to prove it; stubbornness with a smile; the player — patience.
//   → {} (98 strokes on the wall; in 1988 they are still seen)
import { until, keys } from '../hands.js';

const WEEKS = ['clear', 'rain', 'wind', 'clear', 'feast', 'rain', 'clear', 'wind', 'rain', 'clear', 'wind', 'cold', 'cold', 'cold'];
const NIGHT = 1.2, HARD = 1.8; // s: the week's fill; in rain, wind, cold
const MARK = 0.4; // s: the stroke is made, then the next week
const SHUTTER_WEEK = 6; // the seventh (from zero)
const SHUTTER_IN = 0.4, SHUTTER_HOLD = 1.5; // s
const RAIN = 0.6; // the rain's level in a rainy week

export default {
  file: 'hundred-nights',
  title: 'A Hundred Nights', // as the author's ☰ lists it
  about: 36,
  skipped: {},
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: tr('The nights are long. For each week, a stroke of chalk on the wall of the bank') });
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
      // a week: he sits
      const seat = mg.mark({ at: 'toto', kind: 'groove' });
      const hold = mg.hold({ on: null, show: seat, seconds: ['rain', 'wind', 'cold'].includes(kind) ? HARD : NIGHT, drain: 0 });
      if (w === 0) b.minigame.tricks.teach(mg, [hold], { id: 'hold:anywhere' });
      let shutter = w === SHUTTER_WEEK ? 'closed' : null, opened = 0;
      const sat = await until(mg, ({ t }) => {
        const s = hold.state;
        // in the seventh week, while it fills — the shutter
        if (shutter === 'closed' && s.fill >= 0.4) { shutter = 'open'; opened = t; move('elena_window', 0.3, SHUTTER_IN); g.sound.shutter(); }
        if (shutter === 'open' && t - opened >= SHUTTER_IN + SHUTTER_HOLD) { shutter = 'done'; move('elena_window', 0, SHUTTER_IN); g.sound.shutter(); }
        mg.plate.set({ fill: (chalk + 7 * s.fill) / 98, glow: s.held ? 'good' : 'idle' });
        return s.fill >= 1 && shutter !== 'open';
      });
      if (!sat) return this.skipped;
      seat.remove();
      // a stroke of chalk
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
