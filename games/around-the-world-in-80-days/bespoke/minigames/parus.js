// «Парус» (III.5, Прерия, кусок `sail`; сани Маджа под парусом летят по снегу к Омахе): вести где угодно — стрелка —
// шкот (`sheet` 0 — отдан … 1 — выбран до отказа), зона — как его держать при этом ветре (`wind` −1…1: флажок на
// мачте, снег по ветру; ветер меняется каждые GUST с). В зоне — сани разгоняются (`sl_speed` к 1), вне — теряют ход;
// путь `sledge` 0 → 1 по скорости. Каждые RIDGE с из снега впереди встаёт торос (`drift` 0 → 1 за RIDGE_IN с): зона
// уходит в «отдан» — отпустить шкот и обойти; шкот выбран, когда торос под санями, — удар: сани встают (ошибка, `sl_speed`
// 0). Медленно — с края равнины подходят волки (`wolves` растёт), быстро — отстают. Итог — часы по времени пути.
//   Что делает: сани Маджа несутся под парусом по замёрзшей равнине к Омахе.
//   Чего хочет: вернуть потерянные часы — или, если Паспарту один, догнать поезд в Омахе.
//   Каково ему: восторг скорости: ветер, мороз, снег в лицо, волки на краю равнины.
//   Что чувствует игрок: ловить ветер и чувствовать, как сани летят.
//   opts: { alone: true — Паспарту один с Маджем, догоняет поезд (фраза плашки) }
//   → { hours: сколько часов вернули (+10…+22), caught: успели к поезду в Омахе (часов не меньше CAUGHT) }
import { until, keys } from '../hands.js';

const FAST = 30, SLOW = 60; // с: путь на полном ходу; на самом вялом
const HOURS = [10, 22]; // часов: за SLOW с; за FAST с
const CAUGHT = 16; // часов: не меньше — поезд в Омахе ещё стоит
const GUST = 8; // с: ветер меняется
const RIDGE = 12, RIDGE_IN = 3, HIT = 0.85; // с: торос каждые; подходит; drift, когда он под санями
const STOP = 1.5; // с: сани стоят после удара
const ZONE = 0.4; // ширина зоны
const GAIN = 0.5, LOSS = 0.35; // sl_speed в секунду: разгон в зоне; потеря вне
const MIN_SPEED = 0.15;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = x => { const u = clamp(x); return u * u * (3 - 2 * u); };

export default {
  file: 'parus',
  title: 'Парус', // как её зовёт ☰ автора
  about: 40,
  skipped: { hours: 18, caught: true },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: opts.alone
      ? 'Паспарту один с Маджем. Поезд в Омахе ждать не станет'
      : 'Ветер с запада, и сани Маджа летят по снегу, как лодка по воде' });
    const send = keys(g);
    // ветер: где он сейчас и куда повернёт
    const winds = [0.5];
    for (let i = 1; i < 12; i++) winds.push(clamp(winds[i - 1] + (Math.random() < 0.5 ? -1 : 1) * (0.5 + 0.6 * Math.random()), -0.9, 0.9));
    const windAt = t => {
      const i = Math.min(Math.floor(t / GUST), winds.length - 1), j = Math.min(i + 1, winds.length - 1);
      return winds[i] + (winds[j] - winds[i]) * smooth((t - i * GUST - (GUST - 2)) / 2); // поворачивает за 2 с
    };
    // шкот: стрелка −1 (отдан) … 1 (выбран); чем круче ветер в борт, тем туже
    const want = w => 0.1 + 0.7 * Math.abs(w);
    const SLACK = -0.8; // торос: шкот отдан
    const lead = mg.lead({ zone: { at: want(winds[0]), width: ZONE }, release: 'stay' });
    b.minigame.tricks.teach(mg, [lead], { id: 'lead' });
    let speed = 0.3, sledge = 0, wolves = 0, hits = 0, stopTill = -1, hitRidge = -1;
    send('sledge', 0); send('drift', 0); send('wolves', 0);
    const t0 = mg.t;
    const done = await until(mg, ({ t, dt }) => {
      const now = t - t0, w = windAt(now);
      // торос: подходит RIDGE_IN с; пока он близко — шкот отдать
      const k = Math.floor(now / RIDGE), r = now - k * RIDGE - (RIDGE - RIDGE_IN);
      const drift = k >= 0 && r >= 0 ? clamp(r / RIDGE_IN) : 0;
      const at = drift > 0.3 ? SLACK : want(w);
      lead.set({ zone: { at, width: ZONE } });
      const sheet = (lead.state.arrow + 1) / 2;
      if (drift >= HIT && hitRidge < k) {
        hitRidge = k;
        if (!lead.state.in) { hits++; speed = 0; stopTill = now + STOP; mg.error('danger', { at: lead }); }
        else mg.sound('tap');
      }
      if (now < stopTill) speed = 0;
      else speed = clamp(speed + (lead.state.in ? GAIN : -LOSS) * dt, MIN_SPEED, 1);
      sledge = clamp(sledge + dt * (1 / SLOW + (1 / FAST - 1 / SLOW) * speed));
      wolves = clamp(wolves + (speed < 0.5 ? 0.08 : -0.12) * dt);
      send('wind', w); send('sheet', sheet); send('drift', drift); send('sl_speed', speed); send('sledge', sledge); send('wolves', wolves);
      mg.plate.set({ fill: sledge, glow: now < stopTill ? 'bad' : lead.state.in ? 'good' : 'idle' });
      return sledge >= 1;
    });
    if (!done) return this.skipped;
    const seconds = mg.t - t0;
    const hours = Math.round(HOURS[0] + (HOURS[1] - HOURS[0]) * clamp((SLOW - seconds) / (SLOW - FAST)));
    await mg.end({ as: hits ? 'flawed' : 'clean' });
    return { hours, caught: hours >= CAUGHT };
  },
};
