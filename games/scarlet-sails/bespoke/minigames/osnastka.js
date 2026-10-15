// «Оснастка» (глава I, Дом, кусок `rig`): вставка `rig` открыта, лоскут Ассоль уже взяла. Девочка крепит алые паруса
// к игрушечной мачте, отец придерживает. Четыре крепления по порядку (грот, гика-шкот, кливер, его шкот), одна метка за
// раз — желоб там, где её пальцы берут крепление (`closeup#rigN`); держать, пока не нальётся: `rigN` растёт с наливом.
// Первое — вместе с отцом (`guide` 1: его рука держит, ничего не падает). На остальных отпустить раньше — срыв: налив
// стекает, счёт `slips`, приходит рука отца и держит это крепление до конца (вдвое быстрее, ничего не падает).
//   opts: { onGuide() — отец говорит (глава ставит реплику), один раз, в начале; не ждётся }
//   → { slips: сколько раз сорвалось }
import { until, keys } from '../hands.js';

const TOTAL = 4;
const SECONDS = 2; // на крепление, пока держат
const HELPED = 1; // с рукой отца
const DRAIN = 1.25; // с: налив стекает от полного, отпущенный без отца
const GUIDE = 0.6; // с: рука отца приходит и уходит

export default {
  title: 'Оснастка', // как её зовёт ☰ автора
  about: 20,
  skipped: { slips: 0 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Яхта была готова — недоставало лишь алого шёлка' });
    const send = keys(g);
    let slips = 0, acting = null;
    // рука отца: ключ идёт сценой; прежний ход снимается
    const guide = on => { acting?.cancel(); acting = b.act('state', 'move', 'guide', on ? 1 : 0, { over: GUIDE }); };
    signal.addEventListener('abort', () => acting?.cancel());
    mg.plate.set({ notches: [0.25, 0.5, 0.75] });
    guide(true);
    opts.onGuide?.();
    for (let n = 1; n <= TOTAL; n++) {
      const mark = mg.mark({ at: `closeup#rig${n}`, kind: 'groove' });
      // (с отцом — его рука держит: отпущенное не падает)
      let helped = n === 1;
      const hold = mg.hold({ on: mark, seconds: SECONDS, drain: helped ? 0 : DRAIN });
      if (n === 1) b.minigame.tricks.teach(mg, [hold], { id: 'hold' });
      hold.on('up', () => {
        const u = hold.state.fill;
        if (helped || u <= 0.05 || u >= 1) return;
        slips++;
        mg.error('early', { at: mark });
        helped = true;
        guide(true);
        hold.set({ seconds: HELPED, drain: 0 });
      });
      const done = await until(mg, () => {
        const s = hold.state;
        send(`rig${n}`, s.fill);
        mg.plate.set({ fill: (n - 1 + s.fill) / TOTAL, glow: s.held ? 'good' : 'idle' });
        return s.fill >= 1;
      });
      if (!done) return this.skipped;
      g.sound.silk();
      mg.snap({ at: mark });
      mark.remove();
      if (helped) guide(false);
    }
    await mg.end({ as: slips ? 'flawed' : 'clean' });
    return { slips };
  },
};
