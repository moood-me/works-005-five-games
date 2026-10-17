// «Склейка» (I.2, Будка, после куска `splice_in`; вставка `splice` открыта): руками Альфредо — три закладки по
// порядку, одна метка за раз. Разрез — вести по линии: от `splice#cutN` поперёк плёнки по краю кадра до
// `splice#cutN_end`; прошёл — `cutN` → 1 (обрезок отъезжает), ножницы, рука мальчика ближе (`boy_reach` N/3). Сошёл с
// линии — разрез этого кадра косой (`bentN` 1, сцена рисует косой край; раз на разрез), `jumps` + 1; ведёт дальше с того
// же места. Склейка — держать желоб на `splice#glueN` 1.2 с: `glueN` растёт с наливом, пресс; отпустил раньше — стекает.
//   Чувство: Альфредо режет поцелуи, потому что так велено; хочет, чтобы не прыгало; привычная досада; игрок режет
//   то, что потом вернётся к нему.
//   opts: { onCrooked() — первый косой разрез (Р08), не ждётся }
//   → { jumps: сколько кадров склеено криво (0…3) }
import { until, keys } from '../hands.js';

const N = 3;
const CUT = 0.3; // с: cutN → 1
const REACH = 1; // с: рука мальчика ближе
const GLUE = 1.2, DRAIN = 0.6; // с: налив пресса; стекает от полного
const STEPS = 2 * N;

export default {
  file: 'skleyka',
  title: 'Склейка', // как её зовёт карта автора
  about: 18,
  skipped: { jumps: 0 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Закладки торчат там, где звонил колокольчик. Кривая склейка потом прыгает на экране' });
    const send = keys(g), acts = new Set();
    const move = (key, value, over) => { const a = b.act('state', 'move', key, value, { over }); acts.add(a); return a; };
    signal.addEventListener('abort', () => { for (const a of acts) a.cancel(); });
    mg.plate.set({ notches: Array.from({ length: STEPS - 1 }, (_, i) => (i + 1) / STEPS) });
    let jumps = 0, told = false;
    for (let n = 1; n <= N; n++) {
      // разрез
      const start = mg.mark({ at: `splice#cut${n}`, kind: 'dash' });
      const cut = mg.trace({ on: start, line: [`splice#cut${n}`, `splice#cut${n}_end`] });
      if (n === 1) b.minigame.tricks.teach(mg, [cut], { id: 'trace' });
      let bent = false;
      cut.on('off', () => {
        if (bent) return; // (раз на разрез)
        bent = true;
        jumps++;
        send(`bent${n}`, 1);
        mg.error('off', { at: cut });
        if (!told) { told = true; opts.onCrooked?.(); }
      });
      const cutDone = await until(mg, () => {
        const s = cut.state;
        mg.plate.set({ fill: (2 * (n - 1) + s.u) / STEPS, glow: s.tracing ? 'good' : 'idle' });
        return s.u >= 0.99;
      });
      if (!cutDone) return this.skipped;
      move(`cut${n}`, 1, CUT);
      move('boy_reach', n / N, REACH);
      g.sound.scissors();
      mg.snap({ at: start });
      start.remove();
      // склейка
      const press = mg.mark({ at: `splice#glue${n}`, kind: 'groove' });
      const hold = mg.hold({ on: press, seconds: GLUE, drain: DRAIN });
      if (n === 1) b.minigame.tricks.teach(mg, [hold], { id: 'hold' });
      hold.on('up', () => { const u = hold.state.fill; if (u > 0.05 && u < 1) mg.error('early', { at: press }); });
      const glued = await until(mg, () => {
        const s = hold.state;
        send(`glue${n}`, s.fill);
        mg.plate.set({ fill: (2 * (n - 1) + 1 + s.fill) / STEPS, glow: s.held ? 'good' : 'idle' });
        return s.fill >= 1;
      });
      if (!glued) return this.skipped;
      g.sound.press();
      mg.snap({ at: press });
      press.remove();
    }
    await mg.end({ as: jumps ? 'flawed' : 'clean' });
    return { jumps };
  },
};
