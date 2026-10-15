// «Чай» (V.3, Славянский базар, после куска `tea`; вставка `tea`): Гуров наливает чай, пока она плачет у окна. Два
// движения. 1) Тянуть: кольцо с пунктиром на стакане (`tea#glass`), цель — под краном (`tea#under`); где стакан —
// `glass_at`; дошёл — защёлка. 2) Держать с опасностью: кольцо с желобом на кране (`tea#tap`): держит — кран открыт
// (`tap` 1), чай (`fill`) растёт на 0.12 в секунду, на каждом открытии — журчание; дуга опасности — от 0.8 к 1.
// Отпустил при 0.82…0.95 — защёлка, через 0.8 с конец. Перелил (больше 1) — ошибка «в опасность», лужица на блюдце
// (`spill` к 1 за 0.5 с), капли, кран закрыт, `fill` 0.9, через 1 с конец. Подложку плача ставит глава.
//   Кто что делает: Гуров наливает чай, пока она плачет. Чего хочет: переждать её слёзы, сделать что-то.
//   Что чувствует: заботу мелочью. Игрок: два движения, второе с опасностью.
//   → { spills: перелил ли (0 | 1) }
import { until, keys } from '../hands.js';

const RATE = 0.12; // чай в секунду
const FROM = 0.82, TO = 0.95; // где отпустить
const DANGER = 0.8; // с какого уровня дуга
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export default {
  title: 'Чай',
  about: 14,
  skipped: { spills: 0 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Самовар был горячий, а она всё плакала у окна' });
    const send = keys(g);
    const acts = [];
    signal.addEventListener('abort', () => acts.forEach(a => a.cancel()));
    // 1) the glass under the tap
    const glass = mg.mark({ at: 'tea#glass', kind: 'dash' });
    const carry = mg.pull({ on: glass, to: 'tea#under' });
    b.minigame.tricks.teach(mg, [carry], { id: 'pull' });
    let placed = false;
    carry.on('release', ({ inTarget }) => { if (inTarget) placed = true; });
    const moved = await until(mg, () => {
      send('glass_at', carry.state.u);
      mg.plate.set({ fill: carry.state.u * 0.3, glow: carry.state.held ? 'good' : 'idle' });
      return placed;
    });
    if (!moved) return this.skipped;
    send('glass_at', 1);
    mg.snap({ at: glass });
    glass.remove();
    // 2) the tap
    const tap = mg.mark({ at: 'tea#tap', kind: 'groove', danger: 0 });
    const hold = mg.hold({ on: tap, seconds: 1e6, drain: 0 });
    b.minigame.tricks.teach(mg, [hold], { id: 'hold' });
    let fill = clamp(+g.get('fill') || 0), open = false, spills = 0, end = -1, as = 'clean';
    const done = await until(mg, ({ t, dt }) => {
      if (end >= 0) return t >= end;
      const h = hold.state.held;
      if (h && !open) { open = true; send('tap', 1); g.sound.pour(); }
      if (!h && open) {
        open = false;
        send('tap', 0);
        if (fill >= FROM && fill <= TO) { mg.snap({ at: tap }); end = t + 0.8; }
      }
      if (open) fill += RATE * dt;
      if (fill > 1) {
        spills = 1;
        as = 'flawed';
        mg.error('danger', { at: tap });
        acts.push(b.act('state', 'move', 'spill', 1, { over: 0.5 }));
        g.sound.spill();
        open = false;
        send('tap', 0);
        fill = 0.9;
        end = t + 1;
      }
      send('fill', fill);
      hold.set({ fill });
      tap.set({ danger: clamp((fill - DANGER) / (1 - DANGER)) });
      mg.plate.set({ fill: 0.3 + 0.7 * clamp(fill), glow: open && fill > DANGER ? 'bad' : open ? 'good' : 'idle' });
      return false;
    });
    if (!done) return this.skipped;
    await mg.end({ as });
    return { spills };
  },
};
