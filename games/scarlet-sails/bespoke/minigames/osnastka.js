// «Rigging» (chapter I, the house, the beat `rig`): the insert `rig` is open, Assol has taken the scrap already. The girl makes the scarlet sails
// fast to the toy mast, her father steadies it. Four fastenings in order (the mainsail, the main sheet, the jib, its sheet), one mark at a
// time — a groove where her fingers take the fastening (`closeup#rigN`); held till it fills: `rigN` grows with the fill.
// The first — together with her father (`guide` 1: his hand holds, nothing falls). On the rest, let go too early — a slip: the fill
// drains, the count `slips`, her father's hand comes and holds that fastening to the end (twice as fast, nothing falls).
//   opts: { onGuide() — the father speaks (the chapter puts the line), once, at the start; not awaited }
//   → { slips: how many times it slipped }
import { until, keys } from '../hands.js';

const TOTAL = 4;
const SECONDS = 2; // a fastening, while it is held
const HELPED = 1; // with her father's hand
const DRAIN = 1.25; // s: the fill drains from full, let go without her father
const GUIDE = 0.6; // s: her father's hand comes and goes

export default {
  title: 'Rigging', // (as the author's ☰ lists it)
  about: 20,
  skipped: { slips: 0 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: tr('The yacht was ready; all it lacked was the scarlet silk') });
    const send = keys(g);
    let slips = 0, acting = null;
    // her father's hand: the key is moved by the scene; the move before is cancelled
    const guide = on => { acting?.cancel(); acting = b.act('state', 'move', 'guide', on ? 1 : 0, { over: GUIDE }); };
    signal.addEventListener('abort', () => acting?.cancel());
    mg.plate.set({ notches: [0.25, 0.5, 0.75] });
    guide(true);
    opts.onGuide?.();
    for (let n = 1; n <= TOTAL; n++) {
      const mark = mg.mark({ at: `closeup#rig${n}`, kind: 'groove' });
      // (with her father — his hand holds: what is let go does not fall)
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
