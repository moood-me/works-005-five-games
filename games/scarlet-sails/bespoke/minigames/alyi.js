// Алый (Лавка в Лиссе, кусок `silk`): the rolls of silk are brought to the window one by one, and the player says by
// eye whether this is the colour of the scrap — the scrap lies on the plate, the sample to compare with. The colours are
// never named. Grey brings each roll himself (the scene's keys `roll`, `roll_out`; meanwhile the scene answers: no
// mark); on the roll a ring with two petals, «Не то» and «Этот». A wrong «Этот» is an error («не то»): the scrap
// comes near (`memory`) for a moment — the eye sees the difference. The chapter answers each choice (opts).
// → { wrong: n, passed: bool, shown: n }
//   opts: { no() — the answer to «Не то» (also after a wrong «Этот»), yes() — to the right «Этот»,
//           last() — the merchant brings the right roll again after the last one was passed; all awaited }
import { once } from '../hands.js';

const ROLLS = ['cherry', 'pink', 'crimson', 'brick', 'scarlet', 'raspberry', 'carrot']; // the order they are brought in
const RIGHT = 'scarlet';
const NO = { id: 'no', label: 'Не то' };
const YES = { id: 'yes', label: 'Этот' };

export default {
  title: 'Алый', // (as the author's ☰ lists it)
  about: 45,
  skipped: { wrong: 0, passed: false, shown: 5 },
  async run(g, b, opts, signal) {
    // the sample: the scarlet scrap of the first chapter (ui.css .scrap-sample)
    const scrap = document.createElement('i');
    scrap.className = 'scrap-sample';
    const mg = g.minigame({ phrase: 'Шёлка было много — вишнёвого, розового, пунцового, — но не того', sample: scrap });
    let wrong = 0, passed = false, shown = 0;
    const aborted = new Promise(ok => signal.addEventListener('abort', () => ok(null), { once: true }));
    const until = promise => Promise.race([promise, aborted]);
    // what the scene or the chapter does meanwhile: the scene's turn
    const turn = async fn => { mg.sceneTurn(true); await until(fn()); mg.sceneTurn(false); };
    // one roll to the window; what the player answers ('no' | 'yes'), or null once the game is left
    const bring = async (roll, petals) => {
      await turn(async () => {
        g.set('roll_out', 0);
        g.set('roll', roll);
        shown++;
        mg.plate.set({ fill: Math.min(1, shown / ROLLS.length) });
        await until(g.wait(800));
        if (signal.aborted) return;
        g.sound.silk();
        await until(g.move('roll_out', 1, 1.2));
      });
      if (signal.aborted) return null;
      const mark = mg.mark({ at: 'roll' });
      const press = mg.press({ on: mark, ...(petals.length > 1 ? { petals } : {}) });
      mg.glow('roll');
      if (shown === 1) b.minigame.tricks.teach(mg, [press], { id: 'press:petals', still: null });
      const chosen = await (petals.length > 1 ? once(mg, press, 'choose').then(c => c?.id ?? null) : once(mg, press, 'press').then(p => (p ? petals[0].id : null)));
      // (a wrong «Этот»: «не то», the roll shakes its head)
      if (chosen === 'yes' && roll !== RIGHT) mg.error('wrong', { at: mark });
      else if (chosen) mg.snap({ at: mark });
      mark.remove();
      return chosen;
    };
    for (const roll of ROLLS) {
      const id = await bring(roll, [NO, YES]);
      if (!id) return this.skipped;
      if (roll === RIGHT && id === 'yes') {
        await turn(opts.yes);
        if (signal.aborted) return this.skipped;
        await mg.end({ as: wrong ? 'flawed' : 'clean' });
        return { wrong, passed, shown };
      }
      if (roll === RIGHT) passed = true;
      else if (id === 'yes') {
        wrong++;
        await turn(async () => { g.set('memory', 1); await until(g.wait(1500)); g.set('memory', 0); });
      }
      if (signal.aborted) return this.skipped;
      await turn(opts.no);
      if (signal.aborted) return this.skipped;
    }
    await turn(opts.last);
    if (signal.aborted || !(await bring(RIGHT, [YES]))) return this.skipped;
    await turn(opts.yes);
    if (signal.aborted) return this.skipped;
    await mg.end({ as: wrong ? 'flawed' : 'clean' });
    return { wrong, passed, shown };
  },
};
