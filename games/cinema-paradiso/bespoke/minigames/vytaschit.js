// «Вытащить» (II.3, Будка в дыму, после куска `smoke_in`; кадр FLOOR): мальчик тащит Альфредо по полу к двери.
// Тянуть с сопротивлением: кольцо на руках мальчика (`toto#hand_r`), путь — от проектора (`floor#path0`) к двери
// (`floor#path1`), сверху вниз по кадру; Альфредо идёт за пальцем тяжело (натяжение — языка); `drag` — где он на пути,
// сцена ведёт двоих и говорит, где они сейчас (`drag_at`). Дыхание: тянут дольше 3 с подряд — кашель: ошибка «сорвал»,
// `cough` 1 (мальчик выпрямляется), Альфредо сползает назад на 0.05, секунду тянуть нельзя. Отпустил и снова взялся —
// вдохнул, без ошибки. Конец — у двери (`drag` 1 и `drag_at` ≥ 0.97).
//   Чувство: мальчик тащит Альфредо из дыма; хочет спасти; страх и упрямство; игрок — усилие и дыхание.
//   → {} (кашель стоит только секунд; итог рук — то, что Альфредо жив)
import { until, keys } from '../hands.js';

const BREATH = 3; // с: тянуть подряд, пока хватает воздуха
const SLIDE = 0.05; // на сколько он сползает назад при кашле
const STILL = 1; // с после кашля — тянуть нельзя
const STAND = 0.6; // с: мальчик выпрямляется (cough 1)
const SHUFFLE = 0.1; // шорох по доскам — через каждую такую долю пути
const AT_DOOR = 0.97;

export default {
  file: 'vytaschit',
  title: 'Вытащить', // как её зовёт карта автора
  about: 18,
  skipped: {},
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Дым стоит под потолком. У пола ещё можно дышать — недолго' });
    const send = keys(g);
    const hands = mg.mark({ at: 'toto#hand_r', kind: 'dash' });
    const pull = mg.pull({ on: hands, to: 'floor#path1', heavy: true });
    b.minigame.tricks.teach(mg, [pull], { id: 'pull:heavy' });
    let drag = clamp(+g.get('drag') || 0), held = 0, frozenTill = -1, frozen = drag, standTill = -1, shuffled = drag;
    pull.set({ u: drag });
    pull.on('up', () => { held = 0; });
    const done = await until(mg, ({ t, dt }) => {
      const s = pull.state;
      if (t < frozenTill) pull.set({ u: frozen });
      else if (s.held) {
        held += dt;
        if (held > BREATH) {
          // кашель
          held = 0;
          frozen = Math.max(0, s.u - SLIDE);
          pull.set({ u: frozen });
          frozenTill = t + STILL;
          standTill = t + STAND;
          send('cough', 1);
          g.sound.cough();
          mg.error('jerk', { at: pull });
        }
      }
      if (t >= standTill) send('cough', 0);
      drag = pull.state.u;
      send('drag', drag);
      if (drag - shuffled >= SHUFFLE) { shuffled = drag; g.sound.drag(); } else if (drag < shuffled) shuffled = drag;
      mg.plate.set({ fill: drag, glow: t < frozenTill ? 'bad' : s.held ? 'good' : 'idle' });
      return drag >= 1 && (+g.get('drag_at') || 0) >= AT_DOOR;
    });
    if (!done) return this.skipped;
    send('cough', 0);
    mg.snap({ at: hands });
    await mg.end({ as: 'clean' });
    return {};
  },
};
function clamp(v, a = 0, b = 1) { return Math.min(b, Math.max(a, v)); }
