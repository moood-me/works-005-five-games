// «Чай» (II.3, Дом, после куска `talk`; вставка `tea` открыта, чайник над первым стаканом; game.md §7). Первый стакан —
// умение: кольцо с желобом на `tea#glass1`; держат — льётся (`pour` 1), уровень растёт на 0.22 в секунду (налив кольца —
// уровень); отпустил — струя встала; отпустил на 0.85…1.0 — налит, чайник переходит ко второму. Отпустил раньше — можно
// долить. Дошёл до краёв, пока держат, — через край, налит. Второй стакан — не умение, а вопрос: на первом касании глава
// спрашивает (opts.ask(), не ждать), рука дрожит (`shake` 1), отпускание струю не останавливает, уровень растёт 0.6 в
// секунду; дрожь — пока звучит вопрос и ещё 0.6 с, не меньше 1.8 с, — поэтому второй стакан переливается всегда: лужица
// на клеёнке, след вопроса (не ошибка). Дрожь кончилась — струя встала сама; через 1 с конец (neutral).
//   Чувство: наливает чай чужому отцу; хочет, чтобы не спрашивали; на втором стакане вопрос про мать, которой он не
//   сын; игрок — рука, которая дрогнула.
//   opts: { ask() — вопрос Сарафанова (Р33); → когда он сказан }
//   → { spills: 1, или 2 — если и первый перелил }
import { until, keys } from '../hands.js';

const RATE = 0.22; // уровень в секунду — первый стакан
const SHAKEN = 0.6; // уровень в секунду — второй, под вопросом
const FULL = 0.85; // налит — от этого уровня
const SHAKE_MIN = 1.8; // с — дрожь не короче
const SHAKE_AFTER = 0.6; // с — дрожь после вопроса

export default {
  title: 'Чай', // как её зовёт ☰ автора
  about: 13,
  skipped: { spills: 1 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Чайник тяжёлый. Два стакана в подстаканниках' });
    const send = keys(g);
    const pour = on => { send('pour', on ? 1 : 0); g.sound.pour(on ? 0.6 : 0, 0.2); };
    signal.addEventListener('abort', () => { send('shake', 0); g.sound.pour(0, 0.2); });
    let spills = 0;
    send('which', 0);
    send('glass1', 0);
    send('glass2', 0);
    // первый стакан
    const one = mg.mark({ at: 'tea#glass1', kind: 'groove' });
    const hold1 = mg.hold({ on: one, seconds: 1 / RATE, drain: 0 });
    b.minigame.tricks.teach(mg, [hold1], { id: 'hold' });
    let level = 0, running = false;
    const first = await until(mg, ({ dt }) => {
      const held = hold1.state.held;
      if (held !== running) { running = held; pour(held); }
      if (held) level = Math.min(1, level + RATE * dt);
      hold1.set({ fill: level });
      send('glass1', level);
      mg.plate.set({ fill: level / 2, glow: held ? 'good' : 'idle' });
      if (held && level >= 1) { // через край, пока держат
        spills++;
        send('spill', 1);
        g.sound.spill();
        return true;
      }
      return !held && level >= FULL;
    });
    if (!first) return this.skipped;
    if (running) { running = false; pour(false); }
    mg.snap({ at: one });
    one.remove();
    b.act('state', 'move', 'which', 1, { over: 0.6 });
    // второй стакан: вопрос
    const two = mg.mark({ at: 'tea#glass2', kind: 'groove' });
    const hold2 = mg.hold({ on: two, seconds: 1 / SHAKEN, drain: 0 });
    let asked = null, askedAt = 0, said = null, spills2 = false;
    hold2.on('down', () => {
      if (asked) return;
      askedAt = mg.t;
      asked = Promise.resolve(opts.ask?.()).then(() => { said = mg.t; });
      send('shake', 1);
      pour(true);
    });
    level = 0;
    const second = await until(mg, ({ t, dt }) => {
      if (asked) {
        level = Math.min(1, level + SHAKEN * dt);
        if (level >= 1 && !spills2) { spills2 = true; spills++; send('spill', 1); g.sound.spill(); }
      }
      hold2.set({ fill: level });
      send('glass2', level);
      mg.plate.set({ fill: 0.5 + level / 2, glow: asked ? 'bad' : 'idle' });
      // (дрожь — пока звучит вопрос и ещё 0.6 с, не меньше 1.8 с)
      return asked && said !== null && t >= Math.max(askedAt + SHAKE_MIN, said + SHAKE_AFTER) && level >= 1;
    });
    if (!second) return this.skipped;
    send('shake', 0);
    pour(false);
    two.remove();
    const t1 = mg.t;
    if (!(await until(mg, ({ t }) => t - t1 >= 1))) return this.skipped;
    await mg.end({ as: 'neutral' });
    return { spills };
  },
};
