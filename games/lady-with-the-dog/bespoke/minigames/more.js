// «Море» (II.2, Ореанда, после куска `still`): двое над морем перед рассветом. Нажать ×3 — или ничего (бездействие —
// путь: палец показывает и нажатие, и «руки прочь»). Светает само (`dawn` к 1 за 40 с, своим действием). Кольца: огни
// парохода (`steamer#lights` — гаснут по одному, `lights` к 0 за 6 с), цикада в ближнем кипарисе (`cypress#cicada` —
// замолкает: `cicada` 0, звук цикад к 0), её рука на скамье (`anna#hand_r` — он накрывает её своей: `hand` 1). Тронутое
// снимается. На 12-й секунде — `opts.sea()` (рассказчик о море; не ждётся). Конец — через 40 с от начала, как бы ни
// нажимали.
//   Кто что делает: сидят над морем. Чего хотят: ничего. Что чувствуют: покой. Игрок: можно ничего не делать.
//   opts: { sea() — на 12-й секунде }
//   → { touched: ['lights' | 'cicada' | 'hand', … по порядку] }
import { until, keys } from '../hands.js';

const LONG = 40; // с
const SEA = 12; // с: слова о море
const POINTS = [['lights', 'steamer#lights'], ['cicada', 'cypress#cicada'], ['hand', 'anna#hand_r']];

export default {
  title: 'Море',
  about: 40,
  skipped: { touched: [] },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Внизу шумело море, и светало' });
    const send = keys(g);
    const acts = [b.act('state', 'move', 'dawn', 1, { over: LONG })];
    signal.addEventListener('abort', () => acts.forEach(a => a.cancel()));
    const touched = [], presses = [];
    for (const [id, at] of POINTS) {
      const mark = mg.mark({ at });
      const press = mg.press({ on: mark });
      presses.push(press);
      press.on('press', () => {
        touched.push(id);
        mg.snap({ at: mark });
        mark.remove();
        if (id === 'lights') acts.push(b.act('state', 'move', 'lights', 0, { over: 6 }));
        if (id === 'cicada') { send('cicada', 0); g.sound.cicadas(0, 2); }
        if (id === 'hand') send('hand', 1);
      });
    }
    // (both ways shown: a touch — and hands off)
    mg.show({ gestures: [presses[0]] }).finished.then(() => { if (!signal.aborted) mg.show({ handsOff: true }); });
    let said = false;
    const t0 = mg.t;
    const done = await until(mg, ({ t: now }) => {
      const t = now - t0;
      if (!said && t >= SEA) { said = true; opts.sea?.(); }
      mg.plate.set({ fill: Math.min(1, t / LONG), glow: 'idle' });
      return t >= LONG;
    });
    if (!done) return this.skipped;
    await mg.end({ as: 'neutral' });
    return { touched };
  },
};
