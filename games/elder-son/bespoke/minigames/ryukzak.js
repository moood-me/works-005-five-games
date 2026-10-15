// «Рюкзак» (IV.1, Платформа, после куска `strap`; вставка `strap` открыта, двери вагона за ней открыты; game.md §7):
// кольцо с желобом на `strap#grip`, держать; дуга опасности — как тянет Васенька (`pull`). Он тянет: `pull` растёт на
// 0.12 в секунду и рывками +0.15 каждые 2–3 с. Держат — кулак сжат (`grip` 1), `pull` −0.2 в секунду (не ниже 0);
// отпустил — `grip` 0, `pull` +0.25 в секунду. `pull` 1 — вырвался: ошибка (сорвал), счёт `slips`, `pull` 0.6, кулак
// снова сжат на 1 с (поймал). Через 22 с — сцена своим ходом: двери шипят и закрываются (`door_bg` → 1 за 1.5 с),
// ремень обвисает (`pull` → 0 за 1 с), конец (clean / flawed).
//   Чувство: держит младшего за рюкзак, говоря «я не держу»; хочет, чтобы тот не уехал; смешно и больно; игрок — «не
//   держу» — и держу.
//   → { slips }
import { until, keys } from '../hands.js';

const PULL = 0.12, JERK = 0.15; // в секунду; рывок
const JERK_EVERY = [2, 3]; // с между рывками
const HELD = -0.2, LOOSE = 0.25; // в секунду: держат; отпустил
const CAUGHT = 1; // с — снова поймал
const DOORS = 22; // с — двери закрываются

export default {
  title: 'Рюкзак', // как её зовёт ☰ автора
  about: 25,
  skipped: { slips: 0 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Двери вагона открыты. Васенька тянет рюкзак к себе' });
    const send = keys(g), acts = new Set();
    const move = (key, value, over) => { const a = b.act('state', 'move', key, value, { over }); acts.add(a); return a; };
    signal.addEventListener('abort', () => { for (const a of acts) a.cancel?.(); });
    const grip = mg.mark({ at: 'strap#grip', kind: 'groove', danger: 0 });
    const hold = mg.hold({ on: grip, seconds: 0.4, drain: 0.3 });
    b.minigame.tricks.teach(mg, [hold], { id: 'hold' });
    let pull = 0, touched = false, slips = 0, jerkAt = JERK_EVERY[0], caughtTill = -1;
    send('door_bg', 0);
    const done = await until(mg, ({ t, dt }) => {
      const held = hold.state.held || t < caughtTill;
      if (held) touched = true;
      // (до первого касания он тянет сам; потом — держат или отпустили)
      pull += (held ? HELD : touched ? LOOSE : PULL) * dt;
      if (t >= jerkAt) { pull += JERK; jerkAt = t + JERK_EVERY[0] + Math.random() * (JERK_EVERY[1] - JERK_EVERY[0]); }
      pull = Math.max(0, pull);
      if (pull >= 1) {
        slips++;
        mg.error('jerk', { at: grip });
        pull = 0.6;
        caughtTill = t + CAUGHT;
      }
      send('pull', pull);
      send('grip', held ? 1 : 0);
      grip.set({ danger: Math.min(1, pull) });
      mg.plate.set({ fill: Math.min(1, t / DOORS), glow: held ? 'good' : 'bad' });
      return t >= DOORS;
    });
    if (!done) return this.skipped;
    g.sound.doors();
    move('door_bg', 1, 1.5);
    move('pull', 0, 1);
    send('grip', 1);
    await mg.end({ as: slips ? 'flawed' : 'clean' });
    return { slips };
  },
};
