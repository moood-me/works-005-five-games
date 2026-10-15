// «Подглядывать» (I.1, Зал, после куска `peek`; кадр CURTAIN): мальчик за занавеской у боковой двери, в пятом ряду —
// отец Адельфио один смотрит фильм. Держать где угодно (налив и дуга — у щели занавеса `curtain#gap`): держат — мальчик
// выглядывает (`peek` к 1 на 2 в секунду), отпустили — прячется (к 0 на 3 в секунду). Фильм идёт сам: три поцелуя на
// 6-й, 15-й, 24-й секунде — `screen_film` romance_kiss, через 1.2 с колокольчик (`bell` 1, сцена играет bell_ring), через
// 0.8 с `bell` 0 и снова romance; выглядывал на звонке — увидел (`seen`). Дважды за фильм священник оглядывается на
// занавес (`turn`), скрипнув креслом за 0.8 с до того: дуга опасности; выглядывал, пока он смотрит, — попался.
//   Чувство: мальчик подглядывает из-за занавески за тем, что ему нельзя; хочет увидеть, что режет священник;
//   страшно и смешно; игрок — сообщник.
//   opts: { onFirstBell() — на первом звонке (Р04), не ждётся; onCaught() — когда попался впервые (Р05) }
//   → { seen: сколько звонков он видел (0…3), caught: сколько раз попался }
import { until, keys } from '../hands.js';

const KISSES = [6, 15, 24]; // с от начала: поцелуй на экране
const BELL = 1.2, BELL_OFF = 0.8; // с: колокольчик после поцелуя; сколько звенит
const TURNS = [[8, 12], [18, 22]]; // с: в эти промежутки он оглядывается (миг — случайный)
const CREAK = 0.8, TURN_IN = 0.4, TURN_HOLD = 1.6, TURN_OUT = 0.4; // с
const FILM = 26; // с: заливка — время фильма
const AFTER = 2; // с после третьего звонка — конец
const BLOCK = 2; // с: попался — держание не принимается
const PEEK = 0.5; // выглядывает, когда больше
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export default {
  file: 'podglyadyvat',
  title: 'Подглядывать', // как её зовёт ☰ автора
  about: 28,
  skipped: { seen: 3, caught: 0 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Отец Адельфио смотрит фильм один. Прежде чем обернуться, его кресло скрипит' });
    const send = keys(g);
    const gap = mg.mark({ at: 'curtain#gap', kind: 'groove' });
    // (держит — выглядывает: налив и есть `peek` — 2 в секунду туда, 3 обратно)
    const hold = mg.hold({ on: null, show: gap, seconds: 0.5, drain: 1 / 3 });
    b.minigame.tricks.teach(mg, [hold], { id: 'hold:anywhere' });
    mg.plate.set({ notches: KISSES.map(k => (k + BELL) / FILM) });
    // когда он оглядывается: начало поворота в своём промежутке
    const turns = TURNS.map(([a, z]) => a + CREAK + Math.random() * (z - a - CREAK));
    const turnAt = t => {
      for (const T of turns) {
        if (t >= T && t < T + TURN_IN) return (t - T) / TURN_IN;
        if (t >= T + TURN_IN && t < T + TURN_IN + TURN_HOLD) return 1;
        if (t >= T + TURN_IN + TURN_HOLD && t < T + TURN_IN + TURN_HOLD + TURN_OUT) return 1 - (t - T - TURN_IN - TURN_HOLD) / TURN_OUT;
      }
      return 0;
    };
    const dangerAt = t => {
      for (const T of turns) {
        if (t >= T - CREAK && t < T) return (t - T + CREAK) / CREAK;
        if (t >= T && t < T + TURN_IN + TURN_HOLD + TURN_OUT) return Math.max(0.15, turnAt(t));
      }
      return 0;
    };
    let seen = 0, caught = 0, toldCaught = false, blockedTill = -1;
    const fired = new Set(); // события фильма, уже случившиеся
    const once = (name, fn) => { if (!fired.has(name)) { fired.add(name); fn(); } };
    send('screen_film', 'romance');
    const t0 = mg.t;
    const done = await until(mg, ({ t: now }) => {
      const t = now - t0;
      // попался — держание не принимается: мальчик за занавесом
      if (t < blockedTill) hold.set({ fill: 0 });
      const peek = hold.state.fill;
      send('peek', peek);
      // фильм: поцелуй, колокольчик, снова фильм
      KISSES.forEach((K, i) => {
        if (t >= K) once(`kiss${i}`, () => send('screen_film', 'romance_kiss'));
        if (t >= K + BELL) once(`bell${i}`, () => {
          send('bell', 1);
          g.sound.bell();
          if (i === 0) opts.onFirstBell?.();
          if (peek > PEEK) { seen++; mg.snap({ at: gap }); }
        });
        if (t >= K + BELL + BELL_OFF) once(`off${i}`, () => { send('bell', 0); send('screen_film', 'romance'); });
      });
      // он оглядывается: скрип, дуга растёт; держат, пока он смотрит, — попался
      turns.forEach((T, i) => {
        if (t >= T - CREAK) once(`creak${i}`, () => g.sound.creak());
        if (t >= T && t < T + TURN_IN + TURN_HOLD + TURN_OUT && turnAt(t) > 0.5 && peek > PEEK) once(`caught${i}`, () => {
          caught++;
          mg.error('danger', { at: gap });
          if (!toldCaught) { toldCaught = true; opts.onCaught?.(); }
          hold.set({ fill: 0 });
          blockedTill = t + BLOCK;
        });
      });
      const turn = turnAt(t), danger = dangerAt(t);
      send('turn', turn);
      gap.set({ danger });
      mg.plate.set({ fill: clamp(t / FILM), glow: danger > 0.5 && hold.state.held ? 'bad' : hold.state.held ? 'good' : 'idle' });
      return t >= KISSES[2] + BELL + AFTER;
    });
    if (!done) return this.skipped;
    await mg.end({ as: caught ? 'flawed' : 'clean' });
    return { seen, caught };
  },
};
