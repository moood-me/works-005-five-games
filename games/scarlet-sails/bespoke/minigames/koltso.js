// «Кольцо» (Лес, кусок `ring`): Грей на коленях, кольцо в пальцах; он надевает его спящей Ассоль на палец. Желоб на
// его руке с кольцом (`grey#ring`): пока держат, налив растёт — рука тянется, сцена показывает её по ключу `ring_at`.
// Спящая шевелится (`stir`) — это дуга опасности на метке: пока держат, она шевелится всё сильнее, пока нет —
// успокаивается, и время от времени вздыхает. Дошло до края под пальцем — она почти проснулась: рука отходит, и надо
// замереть, пока дыхание не выровняется (держать нельзя секунду). Когда `ring_at` дошёл до 1, сцена говорит `ring:on` —
// это конец. Дыхание её слышно (звук вещи).
// → { on: true, stirs: сколько раз она почти проснулась, seconds: от начала до конца }
import { until, keys } from '../hands.js';

const REACH = 0.11; // ring_at в секунду, пока держат
const SPOOK = 0.25; // stir в секунду, пока держат
const CALM = 0.35; // stir в секунду, пока нет
const SIGH = [4, 7]; // раз в столько секунд — вздох
const SIGH_BY = 0.3; // на сколько вздох прибавляет stir
const WAKING_STIR = 0.6; // stir после «почти проснулась»
const RECOIL = 0.15; // на сколько рука отходит
const STILL = 1; // секунд, пока после этого держать нельзя
const ON_WITHIN = 3000; // сколько ждать от сцены `ring:on`, мс
const BREATH = [0.2, 0.8]; // дыхание: g.sound.breath(BREATH[0] + BREATH[1] * stir, 0.2)

export default {
  title: 'Кольцо', // (как её зовёт ☰ автора)
  about: 25,
  skipped: { on: false, stirs: 0, seconds: 0 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Она спит, и сон её чуток' });
    const send = keys(g), tension = mg.layer('tension');
    const mark = mg.mark({ at: 'grey#ring', kind: 'groove' });
    const hold = mg.hold({ on: mark, seconds: 1 / REACH, drain: 0 });
    hold.set({ fill: Math.min(1, +b.get('ring_at') || 0) });
    b.minigame.tricks.teach(mg, [hold], { id: 'hold' });
    signal.addEventListener('abort', () => g.sound.breath(BREATH[0], 0.5)); // (the bed as the chapter set it before)
    let stir = 0, stirs = 0, still = 0, frozen = 0, sigh = mg.t + SIGH[0] + (SIGH[1] - SIGH[0]) * Math.random();
    const t0 = mg.t;
    const done = await until(mg, ({ t, dt }) => {
      const held = hold.state.held;
      // (still: the hand must not go on — what is held stands where it is)
      if (still > 0) { still = Math.max(0, still - dt); hold.set({ fill: frozen }); }
      const reaching = held && still === 0;
      stir = Math.max(0, Math.min(1, stir + (reaching ? SPOOK : -CALM) * dt));
      if (t > sigh) {
        stir = Math.min(1, stir + SIGH_BY);
        sigh = t + SIGH[0] + (SIGH[1] - SIGH[0]) * Math.random();
      }
      if (reaching && stir >= 1 && hold.state.fill < 1) { // she is almost awake: the hand draws back, and must be still
        frozen = Math.max(0, hold.state.fill - RECOIL);
        hold.set({ fill: frozen });
        stir = WAKING_STIR;
        still = STILL;
        stirs++;
        mg.error('danger', { at: mark });
      }
      mark.set({ danger: stir });
      tension.set({ u: held ? stir : 0 });
      g.sound.breath(BREATH[0] + BREATH[1] * stir, 0.2);
      if (hold.state.fill < 1) send('ring_at', hold.state.fill); // (the 1 — once its tell is waited for)
      send('stir', stir);
      mg.plate.set({ fill: hold.state.fill, glow: stir > 0.7 && held ? 'bad' : reaching ? 'good' : 'idle' });
      return hold.state.fill >= 1;
    });
    if (!done) return this.skipped;
    const on = g.told('ring:on', ON_WITHIN); // (asked before its cause)
    g.set('ring_at', 1);
    mg.snap({ at: mark });
    const heard = await on;
    if (signal.aborted) return this.skipped;
    const seconds = Math.round(mg.t - t0);
    await mg.end({ as: stirs ? 'flawed' : 'clean' });
    return { on: heard, stirs, seconds };
  },
};
