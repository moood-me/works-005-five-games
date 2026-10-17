// «Как мёртвый» (I.5 «ночью», Джунгли, кусок `walk`; рассвет, толпа ниц у костра): «раджа» — Паспарту — несёт Ауду
// от костра к деревьям. Вести где угодно: стрелка — его шаг (−1 медленно … +1 бегом), зона — торжественный шаг мёртвого
// посередине. Без пальца шаг сам рвётся вперёд, то замирает (нервы: `push`); палец его правит (`steer: 'rate'`). Путь
// `walk` 0 → 1 со скоростью по шагу. Быстрее зоны — толпа поднимает головы (`heads` растёт; дошло до 1 — его узнали:
// тревога, погоня — час; головы опять клонятся). Дым костра (`smoke`) редеет сам с каждой секундой, медленнее зоны —
// ещё быстрее; дым кончился, а он ещё не у деревьев — его увидели: тревога (раз). У деревьев — конец.
//   Что делает: Паспарту, в покрывале мёртвого раджи, сходит с костра с вдовой на руках и идёт сквозь толпу.
//   Чего хочет: унести её к деревьям, пока его принимают за воскресшего.
//   Каково ему: дерзость, сдержанная до шага; сердце колотится, ноги просятся бежать.
//   Что чувствует игрок: держать себя — не сорваться на бег и не замешкаться.
//   → { hours: 0…−2 — по часу за каждую тревогу (погоня) }
import { until, keys } from '../hands.js';

const PATH = 22; // с: путь ровным шагом
const SPEED = 0.7; // шаг ±1 — скорость пути × (1 ± SPEED)
const ZONE = 0.5; // ширина зоны шага
const HEADS_UP = 0.8, HEADS_DOWN = 0.35; // в секунду: головы поднимаются (на полном бегу) и клонятся
const ALARM_HOLD = 1.2, HEADS_BACK = 0.2; // с: головы подняты после тревоги; куда клонятся потом
const SMOKE0 = 0.9, SMOKE_FADE = 0.026, SMOKE_SLOW = 0.03, SMOKE_GONE = 0.12; // дым: в начале; редеет в секунду; ещё — медля; «кончился»
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
// (нервы: шаг рвётся вперёд чаще, чем замирает; не сильнее, чем палец может удержать)
const nerves = t => 0.12 + 0.18 * Math.sin(0.8 * t) + 0.06 * Math.sin(2.3 * t + 1);

export default {
  file: 'kak-mertvyy',
  title: 'Как мёртвый', // как её зовёт ☰ автора
  about: 24,
  skipped: { hours: 0 },
  async run(g, b, opts, signal) {
    const PHRASE = 'Толпа лежит ниц. Мёртвый раджа сходит с костра с вдовой на руках';
    const mg = g.minigame({ phrase: PHRASE });
    const send = keys(g);
    const lead = mg.lead({ zone: { at: 0, width: ZONE }, steer: 'rate', release: 'stay', push: nerves(0) });
    b.minigame.tricks.teach(mg, [lead], { id: 'lead' });
    let walk = clamp(+g.get('walk') || 0), heads = 0, smoke = SMOKE0, alarms = 0, upTill = -1, smokeAlarm = false, phrase = PHRASE;
    const put = p => { if (p !== phrase) { phrase = p; mg.plate.set({ phrase: p }); } };
    send('heads', 0);
    send('smoke', smoke);
    const t0 = mg.t;
    const done = await until(mg, ({ t, dt }) => {
      const now = t - t0;
      lead.set({ push: nerves(now) });
      const a = lead.state.arrow, fast = a > ZONE / 2, slow = a < -ZONE / 2;
      walk = clamp(walk + (dt / PATH) * (1 + SPEED * a));
      send('walk', walk);
      // быстрее зоны — головы поднимаются
      if (upTill >= 0) {
        // узнали: головы подняты, потом опять клонятся
        if (now >= upTill) { upTill = -1; heads = HEADS_BACK; } else heads = 1;
      } else {
        if (fast) heads = clamp(heads + HEADS_UP * dt * (0.4 + (0.6 * (a - ZONE / 2)) / (1 - ZONE / 2)));
        else heads = Math.max(0, heads - HEADS_DOWN * dt);
        if (heads >= 1) {
          alarms++;
          upTill = now + ALARM_HOLD;
          mg.error('danger', { chip: true });
        }
      }
      send('heads', heads);
      // дым редеет; медля — быстрее
      smoke = Math.max(SMOKE_GONE, smoke - (SMOKE_FADE + (slow ? SMOKE_SLOW : 0)) * dt);
      send('smoke', smoke);
      if (!smokeAlarm && smoke <= SMOKE_GONE && walk < 1) { smokeAlarm = true; alarms++; mg.error('behind', { chip: true }); }
      put(heads > 0.5 ? 'Головы поднимаются от земли одна за другой' : smoke < 0.35 && !smokeAlarm ? 'Дым над костром редеет' : PHRASE);
      mg.plate.set({ fill: walk, glow: fast || slow ? 'bad' : lead.state.held ? 'good' : 'idle' });
      return walk >= 1;
    });
    if (!done) return this.skipped;
    await mg.end({ as: alarms ? 'flawed' : 'clean' });
    return { hours: -Math.min(2, alarms) || 0 };
  },
};
