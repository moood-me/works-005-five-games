// «Камера» (III.1, Площадь, после куска `dusk`; вставка `viewfinder` открыта): Тото снимает незнакомую девушку на
// восьмимиллиметровку. Вести (где угодно): стрелка — перекрестие видоискателя (`pan`), зона — девушка (`elena_x`,
// её ведёт игра: от автобуса справа к фонтану за 22 с, на середине — остановка 2 с: оглядывается на церковь). На 9-й
// секунде через кадр перебегает сумасшедший (`madman_x` −1 → 1 за 3 с). Нажал и ведёт вбок: `pan` — смещение пальца
// (четверть ширины окна = 1) от `pan` на миг нажатия; отпустил — стоит. В зоне (|elena_x − pan| < 0.22) камера пишет
// (`rec` 1); вне зоны дольше 4 с подряд — «отстал» (раз на выход). Конец — через 1.5 с после того, как она дошла.
//   Чувство: Тото снимает незнакомую девушку; хочет удержать её в кадре; любопытство и робость; игрок — не потерять её.
//   opts: { onFrame(inFrame) — когда она входит в кадр и выходит из него (глава ведёт стрекот камеры) }
//   → { share: доля времени, что она была в кадре, 0…1 (столько её в его плёнке в V.2) }
import { until, keys } from '../hands.js';

const WALK = 10, STOP = 2; // с: полпути, остановка на середине, полпути
const MADMAN = 9, RUN = 3; // с: когда и сколько он перебегает
const ZONE = 0.22; // полуширина зоны
const LOST = 4; // с вне зоны подряд — «отстал»
const AFTER = 1.5; // с после того, как она дошла
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

// где она в момент t (от начала): 1 → 0.5 за 10 с, стоит 2 с, 0.5 → 0 за 10 с
const elenaAt = t => (t < WALK ? 1 - 0.5 * (t / WALK) : t < WALK + STOP ? 0.5 : Math.max(0, 0.5 - 0.5 * ((t - WALK - STOP) / WALK)));
const PATH = 2 * WALK + STOP;

export default {
  file: 'kamera',
  title: 'Камера', // как её зовёт карта автора
  about: 26,
  skipped: { share: 1 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Незнакомая девушка идёт от автобуса через площадь. Камера стрекочет, пока она в кадре' });
    const send = keys(g);
    let pan = clamp(+g.get('pan') || 0, -1, 1), from = pan, inside = null, out = 0, lostOnce = false, errors = 0, inTime = 0;
    const lead = mg.lead({ zone: { at: 1 - pan, width: 2 * ZONE }, release: 'return' });
    b.minigame.tricks.teach(mg, [lead], { id: 'lead' });
    lead.on('down', () => { from = pan; });
    send('madman_x', -1);
    const t0 = mg.t;
    const done = await until(mg, ({ t: now, dt }) => {
      const t = now - t0, s = lead.state, x = elenaAt(t);
      if (s.held) pan = clamp(from + s.knob, -1, 1);
      // (the lead's own zone where she is, as the finger's offset sees it: its 'in zone' sound true)
      lead.set({ zone: { at: x - from, width: 2 * ZONE } });
      send('pan', pan);
      send('elena_x', x);
      send('madman_x', t < MADMAN ? -1 : t < MADMAN + RUN ? -1 + 2 * (t - MADMAN) / RUN : 1);
      const now_in = Math.abs(x - pan) < ZONE;
      if (now_in !== inside) { inside = now_in; send('rec', inside ? 1 : 0); opts.onFrame?.(inside); }
      if (t < PATH) {
        if (inside) { inTime += dt; out = 0; lostOnce = false; }
        else if ((out += dt) > LOST && !lostOnce) { lostOnce = true; errors++; mg.error('behind', {}); }
      }
      mg.plate.set({ fill: clamp(t / PATH), glow: inside ? 'good' : 'bad' });
      return t >= PATH + AFTER;
    });
    if (!done) return this.skipped;
    const share = Math.round(clamp(inTime / PATH) * 100) / 100;
    await mg.end({ as: errors ? 'flawed' : 'clean' });
    return { share };
  },
};
