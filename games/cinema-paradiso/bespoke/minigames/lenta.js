// «Лента» (V.5, Будка в руинах, после куска `window_strip`; вставка `strip`): Сальваторе ведёт склеенную ленту против
// окна будки. Тянуть с сопротивлением: кольцо у правой руки (`strip#hand_r`), путь — к левой (`strip#hand_l`), лента
// идёт справа налево (`strip_x` 0…1), не быстрее 0.045 в секунду — тянется, кадры успевают засветиться; отпустил — стоит,
// кольцо снова у руки, и следующий захват ведёт оставшееся. Первыми идут три поцелуя, разрезанные в главе I (кривые —
// прыгают: это сцена), потом ещё восемь; кадр в свете — мотив темы, не чаще раза в 3 с. Ошибок нет.
//   Чувство: Сальваторе ведёт к свету ленту, которую сохранил для него Альфредо; хочет увидеть всё; благодарность и
//   горе; игрок — бережно, не торопясь.
//   opts: { onProgress(u) — четыре раза в секунду: где лента (глава ведёт тему) }
//   → { seconds: от первого касания до конца }
import { until, keys } from '../hands.js';

const SPEED = 0.045; // strip_x в секунду, не быстрее
const FRAMES = 11; // kiss_cut1…3, kiss1…8
const MOTIF = 3; // с: мотив не чаще
const TELL = 0.25; // с между onProgress
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export default {
  file: 'lenta',
  title: 'Лента', // как её зовёт ☰ автора
  about: 24,
  skipped: { seconds: 0 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Обрезки склеены в одну ленту, кадр к кадру. За стеклом ещё светло' });
    const send = keys(g);
    let x = clamp(+g.get('strip_x') || 0), base = x, mark = null, pull = null, started = null, told = -1, motif = -MOTIF, lit = -1;
    // кольцо у руки; захват ведёт оставшуюся ленту: u пути — доля оставшегося
    const grab = first => {
      mark = mg.mark({ at: 'strip#hand_r', kind: 'dash' });
      pull = mg.pull({ on: mark, to: 'strip#hand_l', heavy: true });
      if (first) b.minigame.tricks.teach(mg, [pull], { id: 'pull:heavy' });
      pull.on('down', () => { started ??= mg.t; });
      pull.on('release', () => { mark.remove(); base = x; grab(false); });
    };
    grab(true);
    const done = await until(mg, ({ t, dt }) => {
      const s = pull.state, want = base + s.u * (1 - base);
      x = Math.min(want, x + SPEED * dt, 1);
      if (x < want - 1e-4) pull.set({ u: (x - base) / Math.max(1e-6, 1 - base) }); // (лента тянется: палец впереди неё)
      send('strip_x', x);
      // кадр в середине окна засветился
      const k = Math.floor(x * FRAMES + 0.5) - 1;
      if (k > lit && k < FRAMES) { lit = k; if (t - motif >= MOTIF) { motif = t; g.sound.motif(); } }
      if (started !== null && t - told >= TELL) { told = t; opts.onProgress?.(x); }
      mg.plate.set({ fill: x, glow: s.held ? 'good' : 'idle' });
      return x >= 0.999;
    });
    if (!done) return this.skipped;
    send('strip_x', 1);
    opts.onProgress?.(1);
    mg.snap({ at: mark });
    const seconds = Math.round(mg.t - (started ?? mg.t));
    await mg.end({ as: 'clean' });
    return { seconds };
  },
};
