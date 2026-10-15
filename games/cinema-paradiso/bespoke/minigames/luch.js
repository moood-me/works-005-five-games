// «Луч» (II.2, Площадь, после куска `beam_out`; кадр WALL): руками Альфредо — луч из окошка будки через площадь на
// белую стену дома напротив. Фаза 1 — вести (где угодно): стрелка — конец луча (пятно света на камне и головах), зона —
// белая стена (`beam_aim` 1). Нажал и ведёт вбок: цель `beam_aim` — смещение пальца (четверть ширины окна = 1) от
// `beam_aim` на миг нажатия; сам `beam_aim` идёт к цели не быстрее 0.25 в секунду — проектор тяжёлый; отпустил — луч
// стоит. В зоне (`beam_aim` ≥ 0.95) полсекунды — защёлка: `beam_aim` 1, лязг, на стене мутное пятно (`wall_film`
// comedy, `beam_focus` 0). Фаза 2 — крутить: кольцо с пунктиром по кругу на `wall#screen`; полтора оборота по стрелке —
// резкость 0 → 1; против стрелки — назад (ошибка «против»).
//   Чувство: Альфредо дарит кино тем, кому не хватило мест; хочет, чтобы вся площадь увидела; озорство и гордость;
//   игрок — щедрость.
//   opts: { onFocus(u) — четыре раза в секунду во второй фазе: резкость (глава ведёт стрекот) }
//   → { seconds: от начала до конца }
import { until, keys } from '../hands.js';

const SPEED = 0.25; // beam_aim в секунду, не быстрее
const ZONE = 0.95, LATCH = 0.5; // в зоне — сколько секунд до защёлки
const TURNS = 1.5; // оборотов до полной резкости
const TELL = 0.25; // с между onFocus
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export default {
  file: 'luch',
  title: 'Луч', // как её зовёт ☰ автора
  about: 14,
  skipped: { seconds: 0 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Белая стена дома напротив пустая. Проектор тяжёлый, луч ползёт медленно' });
    const send = keys(g), t0 = mg.t;
    mg.plate.set({ notches: [0.5] });
    // ── фаза 1: вести луч на стену ──
    let aim = clamp(+g.get('beam_aim') || 0), target = aim, from = aim, inZone = 0;
    const lead = mg.lead({ zone: { at: 1 - aim, width: 0.1 }, release: 'return' });
    b.minigame.tricks.teach(mg, [lead], { id: 'lead' });
    lead.on('down', () => { from = aim; lead.set({ zone: { at: ZONE + (1 - ZONE) / 2 - from, width: 1 - ZONE } }); });
    const aimed = await until(mg, ({ dt }) => {
      const s = lead.state;
      target = s.held ? clamp(from + s.knob) : aim;
      aim += clamp(target - aim, -SPEED * dt, SPEED * dt);
      send('beam_aim', aim);
      inZone = aim >= ZONE ? inZone + dt : 0;
      mg.plate.set({ fill: aim / 2, glow: s.held ? (Math.abs(target - aim) > 0.01 ? 'good' : 'idle') : 'idle' });
      return inZone >= LATCH;
    });
    if (!aimed) return this.skipped;
    send('beam_aim', 1);
    g.sound.clunk();
    mg.snap({});
    lead.remove();
    send('wall_film', 'comedy');
    send('beam_focus', 0);
    // ── фаза 2: навести резкость ──
    mg.plate.set({ phrase: 'На стене уже смеются, а кадр ещё мутный' });
    const ring = mg.mark({ at: 'wall#screen', kind: 'dash' });
    const knob = mg.turn({ on: ring, dir: 1 });
    b.minigame.tricks.teach(mg, [knob], { id: 'turn' });
    knob.on('against', () => mg.error('against', { at: knob }));
    let told = 0, focus = 0;
    const sharp = await until(mg, ({ t }) => {
      focus = clamp(knob.state.turns / TURNS);
      send('beam_focus', focus);
      if (t - told >= TELL) { told = t; opts.onFocus?.(focus); }
      mg.plate.set({ fill: 0.5 + focus / 2, glow: 'good' });
      return focus >= 1;
    });
    if (!sharp) return this.skipped;
    send('beam_focus', 1);
    opts.onFocus?.(1);
    mg.snap({ at: ring });
    const seconds = Math.round(mg.t - t0);
    await mg.end({ as: 'clean' });
    return { seconds };
  },
};
