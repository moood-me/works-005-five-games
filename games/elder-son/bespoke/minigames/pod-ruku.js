// «Под руку» (III.1, Косогор, после куска `meet`; game.md §7): путь по обледенелой тропе 0…1 (`down`; где они сейчас —
// `down_at`, ставит сцена; походка `careful`). Держать где угодно — идут: `down` = min(`down_at` + 0.08, 1); отпустил —
// `down` = `down_at`: стоят. На ледяной полосе сцена говорит `down:slip` и сама останавливает обоих; держание кончается
// (один палец: чтобы поймать, его надо поднять); на `sarafanov#shoulder_l` — кольцо с дугой времени 1.5 с. Нажал —
// поймал (`catch` 1, хруст снега), через 1.5 с можно идти. Не нажал — ошибка (отстал), Сарафанов садится в снег
// (`fall` 1, мягкое падение), счёт `falls`; через 2 с встаёт, ещё 2 с — можно идти. Конец: у ворот (`down_at` ≥ 0.98).
//   Чувство: ведёт чужого отца вниз по льду; хочет, чтобы тот не упал; узнал его тайну — бережно; игрок — забота рукой.
//   → { falls }
import { until, keys } from '../hands.js';

const AHEAD = 0.08; // насколько цель впереди того, где они
const CATCH = 1.5; // с — дуга времени
const CAUGHT = 1.5; // с — держит его, потом можно идти
const DOWN = 2, UP = 2; // с — сидит в снегу; встав, ещё стоит
const GATE = 0.98;
const SLIP_MS = 600000;

export default {
  title: 'Под руку', // как её зовёт ☰ автора
  about: 36,
  skipped: { falls: 0 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Тропа обледенела. Старик ступает осторожно' });
    const send = keys(g);
    const at = () => +g.get('down_at') || 0;
    const pause = s => { const t0 = mg.t; return until(mg, ({ t }) => t - t0 >= s); };
    let falls = 0, slipped = false, walk = null, first = true;
    const walking = () => {
      walk = mg.hold({ on: null, seconds: 1, drain: 0 });
      if (first) b.minigame.tricks.teach(mg, [walk], { id: 'hold:anywhere' });
      first = false;
    };
    // (сцена говорит `down:slip` на каждой ледяной полосе: ожидание — заново после каждого)
    const listen = () => g.told('down:slip', SLIP_MS).then(ok => { if (ok && !signal.aborted) { slipped = true; listen(); } });
    listen();
    send('catch', 0);
    send('fall', 0);
    walking();
    for (;;) {
      const step = await until(mg, () => {
        const now = at();
        send('down', walk.state.held ? Math.min(now + AHEAD, 1) : now);
        mg.plate.set({ fill: now, glow: walk.state.held ? 'good' : 'idle' });
        return slipped || now >= GATE;
      });
      if (!step) return this.skipped;
      if (!slipped) break;
      // поскользнулся: стоят; держание кончилось — поймать можно, только подняв палец
      slipped = false;
      walk.remove();
      send('down', at());
      const shoulder = mg.mark({ at: 'sarafanov#shoulder_l', kind: 'ring', time: 1 });
      const press = mg.press({ on: shoulder });
      let caught = false;
      press.on('press', () => { caught = true; });
      const t0 = mg.t;
      const over = await until(mg, ({ t }) => {
        shoulder.set({ time: Math.max(0, 1 - (t - t0) / CATCH) });
        return caught || t - t0 >= CATCH;
      });
      if (!over) return this.skipped;
      if (caught) {
        send('catch', 1);
        g.sound.crunch();
        mg.snap({ at: shoulder });
        shoulder.remove();
        if (!(await pause(CAUGHT))) return this.skipped;
        send('catch', 0);
      } else {
        mg.error('behind', { at: shoulder });
        shoulder.remove();
        falls++;
        send('fall', 1);
        g.sound.thud();
        if (!(await pause(DOWN))) return this.skipped;
        send('fall', 0);
        if (!(await pause(UP))) return this.skipped;
      }
      walking();
    }
    send('down', 1);
    await mg.end({ as: falls ? 'flawed' : 'clean' });
    return { falls };
  },
};
