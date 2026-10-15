// «Тайфун» (II.5, Море, кусок `typhoon`; камера на корме «Танкадеры», низко): гребни идут на нос один за другим. Вести
// где угодно: стрелка — руль (`helm` −1…1: румпель и нос бота), зона — куда держать нос: на подходе гребня — на волну
// (она идёт то с левой скулы, то с правой), во впадине — прямо. Волна — `wave` 0 → 1 за PERIOD с (0.5 — гребень под
// носом), высота `wave_h` растёт к середине шторма и спадает. Два мига на волну: гребень под носом (нос не на волну —
// вода через борт, `green_water` подъём до 1) и впадина (не прямо — бот рыскает, тоже вода). Крен `heel` — от того,
// насколько нос не туда, и от гребня. Итог — часы: каждые две ошибки — час.
//   Что делает: Фогг и Бансби ведут крошечную «Танкадеру» сквозь тайфун к Шанхаю.
//   Чего хочет: не дать волне положить бот на борт — и не потерять ни мили.
//   Каково ему: держаться; холодная выдержка Фогга посреди воя и пены.
//   Что чувствует игрок: держаться — встречать каждую волну носом, не дёргаясь.
//   → { hours: 0…−3 }
import { until, keys } from '../hands.js';

const WAVES = 8, PERIOD = 5; // волн; с на волну
const CREST = 0.5, TROUGH = 0.9; // wave: проверка на гребне; во впадине
const ZONE = 0.4; // ширина зоны
const STRAIGHT = 0.3; // во впадине — прямо, если |руль| не больше
const SPLASH = 1.2; // с: green_water стоит на 1
const clamp = (v, a = -1, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a, b, x) => { const u = Math.min(1, Math.max(0, (x - a) / (b - a))); return u * u * (3 - 2 * u); };

export default {
  file: 'tayfun',
  title: 'Тайфун', // как её зовёт ☰ автора
  about: 42,
  skipped: { hours: 0 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Волны выше мачты. «Танкадера» — двадцать тонн, и она идёт им навстречу' });
    const send = keys(g);
    mg.plate.set({ notches: Array.from({ length: WAVES - 1 }, (_, i) => (i + 1) / WAVES) });
    // откуда каждая волна: то слева, то справа, на сколько
    const dirs = Array.from({ length: WAVES }, (_, k) => (k % 2 ? 1 : -1) * (0.45 + 0.25 * Math.random()));
    const lead = mg.lead({ zone: { at: 0, width: ZONE }, release: 'stay' });
    b.minigame.tricks.teach(mg, [lead], { id: 'lead' });
    let misses = 0, k = 0, checked = { crest: -1, trough: -1 }, splashOff = -1;
    send('green_water', 0);
    const splash = (now, reason) => {
      misses++;
      send('green_water', 1);
      splashOff = now + SPLASH;
      mg.error(reason, { at: lead });
    };
    const T = WAVES * PERIOD, t0 = mg.t;
    const done = await until(mg, ({ t }) => {
      const now = t - t0;
      k = Math.min(WAVES - 1, Math.floor(now / PERIOD));
      const w = Math.min(1, (now - k * PERIOD) / PERIOD), dir = dirs[k];
      // куда держать нос: на подходе — на волну; после гребня — снова прямо
      const at = dir * (smooth(0.12, 0.35, w) - smooth(0.58, 0.78, w));
      lead.set({ zone: { at, width: ZONE } });
      const helm = lead.state.arrow;
      send('wave', w);
      send('wave_h', 0.55 + 0.45 * Math.sin(Math.PI * Math.min(1, now / T)));
      send('helm', helm);
      const crest = Math.sin(Math.PI * w) ** 2;
      send('heel', clamp(1.3 * (at - helm) * (0.3 + 0.7 * crest) + 0.15 * Math.sin(2 * Math.PI * w)));
      if (w >= CREST && checked.crest < k) {
        checked.crest = k;
        if (Math.abs(helm - dir) > ZONE / 2) splash(now, 'off');
        else mg.sound('tap');
      }
      if (w >= TROUGH && checked.trough < k) {
        checked.trough = k;
        if (Math.abs(helm) > STRAIGHT) splash(now, 'off');
      }
      if (splashOff >= 0 && now >= splashOff) { splashOff = -1; send('green_water', 0); }
      mg.plate.set({ fill: Math.min(1, now / T), glow: lead.state.in ? 'good' : 'bad' });
      return now >= T;
    });
    if (!done) return this.skipped;
    send('green_water', 0);
    await mg.end({ as: misses ? 'flawed' : 'clean' });
    return { hours: -Math.min(3, Math.floor(misses / 2)) || 0 };
  },
};
