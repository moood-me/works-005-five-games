// Алый (Лавка в Лиссе, кусок `silk`): the rolls of silk are brought to the window one by one, and the player
// says by eye whether this is the colour of the scrap that lies in the corner. The colours are never named.
// Made of offers (as `tishe.js` of the Asher game is); nothing of its own on the screen but the hint. Grey
// brings each roll himself (the scene's keys `roll`, `roll_out`); a wrong «Этот» brings the scrap near
// (`memory`) for a moment — the eye sees the difference. The chapter answers each choice (opts).
// → { wrong: n, passed: bool, shown: n }
//   opts: { no() — the answer to «Не то» (also after a wrong «Этот»), yes() — to the right «Этот»,
//           last() — the merchant brings the right roll again after the last one was passed; all awaited }
const ROLLS = ['cherry', 'pink', 'crimson', 'brick', 'scarlet', 'raspberry', 'carrot']; // the order they are brought in
const RIGHT = 'scarlet';
const NO = { id: 'no', label: 'Не то' };
const YES = { id: 'yes', label: 'Этот' };

export default {
  title: 'Алый', // (as the author's ☰ lists it)
  about: 45,
  skipped: { wrong: 0, passed: false, shown: 5 },
  async run(g, b, opts, signal) {
    let wrong = 0, passed = false, shown = 0;
    // (a game left — ⏭, «Дальше», the step — ends every wait with null)
    const aborted = new Promise(ok => signal.addEventListener('abort', () => ok(null), { once: true }));
    const until = promise => Promise.race([promise, aborted]);
    let off = () => {};
    // one roll to the window; what the player answers, or null once the game is left
    const bring = async (roll, offers) => {
      g.set('roll_out', 0);
      g.set('roll', roll);
      shown++;
      await until(g.wait(800));
      if (signal.aborted) return null;
      g.sound.silk();
      await until(g.move('roll_out', 1, 1.2));
      if (signal.aborted) return null;
      const choice = g.choose(null, { roll: offers });
      if (shown === 1) off = g.hint('Тот ли это цвет, что у лоскута?'); // once, with the first roll
      const id = await until(choice);
      off();
      return id;
    };
    try {
      for (const roll of ROLLS) {
        const id = await bring(roll, [NO, YES]);
        if (!id) break;
        if (roll === RIGHT && id === 'yes') {
          await until(opts.yes());
          return { wrong, passed, shown };
        }
        if (roll === RIGHT) passed = true;
        else if (id === 'yes') {
          wrong++;
          g.trouble();
          g.set('memory', 1);
          await until(g.wait(1500));
          g.set('memory', 0);
        }
        if (signal.aborted) break;
        await until(opts.no());
        if (signal.aborted) break;
      }
      if (!signal.aborted) {
        await until(opts.last());
        if (!signal.aborted && await bring(RIGHT, [YES])) await until(opts.yes());
      }
      if (signal.aborted) return this.skipped;
      return { wrong, passed, shown };
    } finally {
      if (signal.aborted) {
        off();
        g.set('memory', 0);
        g.withdraw();
      }
    }
  },
};
