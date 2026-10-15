// «Следом» (III.1, Косогор, после куска `hide`; game.md §7): Сарафанов сам идёт к клубу (`sar_go` 1; где он — `sar_at`,
// ставит сцена; три оглядки). Держать где угодно — Нина и Бусыгин идут следом: `follow` = min(`follow_at` + 0.08,
// `sar_at` − 0.1), `hold` 1; отпустил — стоят (`follow` = `follow_at`, `hold` 0). Дуга опасности — у Сарафанова: растёт,
// когда он в 0.04 до места оглядки (0.25, 0.5, 0.75). По `sar_go:look` (голова начинает поворачиваться) — судить через
// 0.6 с: шли (`hold` 1 или `follow_at` менялся за последние 0.3 с) — почти увидел: ошибка (в опасность), присели
// (`duck` 1), счёт `seen`; по `sar_go:on` — встают. Конец: `sar_go:club` (clean / flawed).
//   Чувство: идёт за отцом, чтобы тот не увидел; хочет сберечь его ложь; смешно и стыдно; игрок — замереть вовремя.
//   → { seen }
import { until, keys } from '../hands.js';

const AHEAD = 0.08, BEHIND = 0.1;
const LOOKS = [0.25, 0.5, 0.75];
const NEAR = 0.04; // до места оглядки — дуга растёт
const JUDGE = 0.6; // с после начала поворота головы
const MOVED = 0.3; // с — «шли» недавно
const WAIT_MS = 600000;

export default {
  title: 'Следом', // как её зовёт ☰ автора
  about: 40,
  skipped: { seen: 0 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Сарафанов идёт к клубу. Иногда оглядывается' });
    const send = keys(g);
    const num = k => +g.get(k) || 0;
    let seen = 0, ducked = false, looked = null, club = false, movedAt = -Infinity, was = num('follow_at');
    // (сцена говорит оглядки по одной: ожидание — заново после каждой)
    const look = () => g.told('sar_go:look', WAIT_MS).then(ok => { if (ok && !signal.aborted) { looked = mg.t; look(); } });
    const on = () => g.told('sar_go:on', WAIT_MS).then(ok => { if (ok && !signal.aborted) { if (ducked) { ducked = false; send('duck', 0); } on(); } });
    g.told('sar_go:club', WAIT_MS).then(ok => { if (ok) club = true; });
    look();
    on();
    send('duck', 0);
    send('hold', 0);
    g.set('sar_go', 1);
    const him = mg.mark({ at: 'sarafanov', kind: 'light', danger: 0 });
    const walk = mg.hold({ on: null, seconds: 1, drain: 0 });
    b.minigame.tricks.teach(mg, [walk], { id: 'hold:anywhere' });
    const done = await until(mg, ({ t }) => {
      const sar = num('sar_at'), now = num('follow_at');
      if (Math.abs(now - was) > 1e-4) { movedAt = t; was = now; }
      const going = walk.state.held && !ducked;
      send('hold', going ? 1 : 0);
      send('follow', going ? Math.max(now, Math.min(now + AHEAD, sar - BEHIND)) : now);
      // дуга опасности: он вот-вот оглянется
      const next = LOOKS.find(p => sar <= p + 0.01);
      const danger = next != null && sar >= next - NEAR ? Math.min(1, 1 - (next - sar) / NEAR) : 0;
      him.set({ danger: ducked ? 1 : danger });
      if (looked !== null && t - looked >= JUDGE) {
        if ((going || t - movedAt <= MOVED) && !ducked) {
          seen++;
          ducked = true;
          send('duck', 1);
          send('hold', 0);
          mg.error('danger', { at: him });
        }
        looked = null;
      }
      mg.plate.set({ fill: sar, glow: going ? 'good' : 'idle' });
      return club;
    });
    if (!done) return this.skipped;
    send('duck', 0);
    send('hold', 0);
    await mg.end({ as: seen ? 'flawed' : 'clean' });
    return { seen };
  },
};
