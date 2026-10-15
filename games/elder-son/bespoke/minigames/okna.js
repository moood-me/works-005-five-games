// «Окна» (I.1, Улица, после куска `knock_ready`; game.md §7): пять окон посёлка ещё горят (`win1…win5` = 1); на каждом
// горящем — кольцо, нажать (касание и есть стук, без лепестков). Нажато окно N: ход сцены (метки скрыты) — Бусыгин
// идёт и стучит (`knock` = N; сцена говорит `knock:hit`, `knock:done`); в окне силуэт (`winN` = 2); первые три —
// отказ голосом (opts.refuse[i]), четвёртое и пятое — молча, лает собака; окно гаснет. Ждать — тоже путь: каждые 9 с
// без касания гаснет горящее окно с наименьшим номером. Снег гуще с каждым тёмным. Все пять тёмные — конец (neutral).
//   Чувство: стучит в чужие окна; хочет, чтобы пустили; замёрз, неловко будить людей; игрок — холод и закрытый мир.
//   opts: { refuse: [ref => …, ref => …, ref => …] — три отказа, каждый своей репликой у окна ref ('winN') }
//   → { knocked: [номера окон, в которые стучал, по порядку] }
import { until, keys } from '../hands.js';

const WINDOWS = 5;
const IDLE = 9; // с без касания — гаснет окно с наименьшим номером
const SILHOUETTE = 0.6; // с: силуэт в окне до ответа
const AFTER = 1; // с после ответа — окно гаснет
const KNOCK_MS = 30000; // мс: ждать стука и его конца (ход сцены — до 8 с)

export default {
  title: 'Окна', // как её зовёт ☰ автора
  about: 50,
  skipped: { knocked: [] },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Ночь. В посёлке ещё горит свет — в пяти окнах' });
    const send = keys(g);
    const pause = s => { const t0 = mg.t; return until(mg, ({ t }) => t - t0 >= s); };
    const lit = new Set(), marks = new Map(), presses = [];
    const knocked = [];
    let dark = 0, idle = 0, busy = false, pressed = null;
    for (let n = 1; n <= WINDOWS; n++) {
      lit.add(n);
      send(`win${n}`, 1);
      const mark = mg.mark({ at: `win${n}`, kind: 'ring' });
      const press = mg.press({ on: mark });
      press.on('press', () => { if (!busy && !pressed) pressed = n; });
      marks.set(n, mark);
      presses.push(press);
    }
    // (ждать — путь: палец показывают только при первой встрече, не когда игрок замер)
    b.minigame.tricks.teach(mg, presses, { id: 'press:okna', still: null });
    const out = n => {
      lit.delete(n);
      send(`win${n}`, 0);
      marks.get(n).remove();
      marks.delete(n);
      dark++;
      g.set('snow', 0.4 + 0.06 * dark, 2);
      mg.plate.set({ fill: dark / WINDOWS });
    };
    mg.plate.set({ fill: 0, glow: 'idle' });
    while (lit.size) {
      pressed = null;
      idle = 0;
      // нажали — или 9 с без касания
      const went = await until(mg, ({ dt }) => {
        if (pressed) return true;
        idle += dt;
        return idle >= IDLE;
      });
      if (!went) return this.skipped;
      if (!pressed) { out(Math.min(...lit)); continue; } // (люди ложатся)
      const n = pressed;
      busy = true;
      knocked.push(n);
      mg.sceneTurn(true);
      const hit = g.told('knock:hit', KNOCK_MS), done = g.told('knock:done', KNOCK_MS);
      g.set('knock', n);
      hit.then(ok => { if (ok && !signal.aborted) g.sound.knock(); });
      await done;
      if (signal.aborted) return this.skipped;
      send(`win${n}`, 2);
      if (!(await pause(SILHOUETTE))) return this.skipped;
      const i = knocked.length - 1;
      if (i < opts.refuse.length) await opts.refuse[i](`win${n}`);
      else g.sound.dog();
      if (signal.aborted || !(await pause(AFTER))) return this.skipped;
      mg.snap({ at: marks.get(n) });
      out(n);
      mg.sceneTurn(false);
      busy = false;
    }
    if (!(await pause(1))) return this.skipped;
    g.set('knock', 0);
    await mg.end({ as: 'neutral' });
    return { knocked };
  },
};
