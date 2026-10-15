// «Рывок» (I.5 «на дороге», Джунгли, кусок `charge`; ночь, факелы): Киуни вырывается из зарослей на тропу. Фаза 1 —
// вести где угодно: стрелка — куда Киуни берёт поперёк тропы (`kiouni_lane` −1…1), зона — носилки с вдовой
// (`litter_lane`: носильщики шарахаются, носилки мечутся). В зоне — Киуни ломится прямо к ним (`charge` быстро), мимо
// — вязнет в толпе (медленно). Факелы разлетаются по `charge` (`scatter`). Фаза 2 — у носилок (`charge` LITTER): кольцо
// на руках вдовы `aouda#hands`, тянуть (оторвать, тяжело): Паспарту выхватывает её в гауду (`grab` подъём до 1).
// Фаза 3 — ход сцены: Киуни уходит в темноту (`charge` → 1), факел выхватывает лицо проводника (`guide_seen` до 1).
// Итог — часы по тому, сколько длились фазы 1–2.
//   Что делает: Фогг гонит слона прямо в процессию; Паспарту в гауде, проводник на шее.
//   Чего хочет: вырвать вдову из рук жрецов, пока те не опомнились.
//   Каково ему: отчаянная скорость, крики, огонь у самых глаз.
//   Что чувствует игрок: бешеный рывок — и один миг, когда надо схватить.
//   → { hours: 0…−2 — чем дольше бились у носилок, тем дальше погоня }
import { until, once, keys } from '../hands.js';

const LITTER = 0.5; // charge: Киуни у носилок
const FAST = 0.1, SLOW = 0.035; // charge в секунду: в зоне; в толпе
const ZONE = 0.35; // ширина зоны (носилки)
const SCATTER_FROM = 0.15, SCATTER_TO = 0.45; // charge: факелы разлетаются отсюда досюда
const TEAR = 0.2; // доля высоты окна — рвануть вдову
const AWAY = 3, SEEN = 1.4; // с: уходит в темноту; когда факел ловит лицо проводника
const QUICK = 9, LATE = 14; // с: до них — без потерь; до них — час; дольше — два
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
// (носилки мечутся: носильщики шарахаются то вправо, то влево)
const litter = t => clamp(0.55 * Math.sin(0.8 * t + 0.6) + 0.15 * Math.sin(2.1 * t), -0.8, 0.8);

export default {
  file: 'ryvok',
  title: 'Рывок', // как её зовёт ☰ автора
  about: 14,
  skipped: { hours: 0 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Факелы, жрецы, носилки с вдовой — и слон, которого здесь никто не ждал' });
    const send = keys(g), acts = new Set();
    const move = (key, value, over) => { const a = b.act('state', 'move', key, value, { over }); acts.add(a); return a; };
    signal.addEventListener('abort', () => { for (const a of acts) a.cancel?.(); });
    mg.plate.set({ notches: [0.6, 0.8] });
    send('charge', 0); send('scatter', 0); send('grab', 0); send('guide_seen', 0);
    // ── фаза 1: сквозь факелы к носилкам ──
    const lead = mg.lead({ zone: { at: litter(0), width: ZONE }, release: 'stay' });
    b.minigame.tricks.teach(mg, [lead], { id: 'lead' });
    let charge = 0;
    const t0 = mg.t;
    const there = await until(mg, ({ t, dt }) => {
      const now = t - t0, at = litter(now);
      lead.set({ zone: { at, width: ZONE } });
      send('litter_lane', at);
      send('kiouni_lane', lead.state.arrow);
      charge = Math.min(LITTER, charge + (lead.state.in ? FAST : SLOW) * dt);
      send('charge', charge);
      send('scatter', clamp((charge - SCATTER_FROM) / (SCATTER_TO - SCATTER_FROM)));
      mg.plate.set({ fill: (0.6 * charge) / LITTER, glow: lead.state.in ? 'good' : lead.state.held ? 'bad' : 'idle' });
      return charge >= LITTER;
    });
    if (!there) return this.skipped;
    lead.remove();
    send('scatter', 1);
    // ── фаза 2: выхватить вдову ──
    mg.plate.set({ phrase: 'Носильщики бросили шесты. Вдова на носилках, одна' });
    const hands = mg.mark({ at: 'aouda#hands', kind: 'dash' });
    const pull = mg.pull({ on: hands, tear: TEAR });
    b.minigame.tricks.teach(mg, [pull], { id: 'pull:tear' });
    const off = mg.on('frame', () => mg.plate.set({ fill: 0.6 + 0.2 * pull.state.u, glow: pull.state.held ? 'good' : 'idle' }));
    const torn = await once(mg, pull, 'tear');
    off();
    if (!torn) return this.skipped;
    const seconds = mg.t - t0;
    send('grab', 1);
    mg.snap({ at: hands });
    hands.remove();
    // ── фаза 3: в темноту ──
    mg.sceneTurn(true);
    move('charge', 1, AWAY);
    const t1 = mg.t;
    let seen = false;
    const away = await until(mg, ({ t }) => {
      if (!seen && t - t1 >= SEEN) { seen = true; send('guide_seen', 1); }
      mg.plate.set({ fill: 0.8 + (0.2 * clamp((t - t1) / AWAY)) });
      return t - t1 >= AWAY;
    });
    if (!away) return this.skipped;
    mg.sceneTurn(false);
    await mg.end({ as: seconds <= QUICK ? 'clean' : 'flawed' });
    return { hours: seconds <= QUICK ? 0 : seconds <= LATE ? -1 : -2 };
  },
};
