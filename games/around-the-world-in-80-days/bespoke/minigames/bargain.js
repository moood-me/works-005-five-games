// «The bargain» (I.3, the jungle, the beat `haggle`; by the shed Fogg and the elephant's owner three-quarters to each
// other, Kiouni behind them): Fogg raises the price. Hold anywhere (the fill — on the roll of banknotes in Fogg's hand,
// `fogg#hands`): the roll grows by £100 a second, from START to TOP (`offer` 0…1 — its thickness); let go — he has made
// an offer (no less than £100 above the last). A price below the owner's threshold (MIN…TOP, random, the player does
// not know it) — the owner turns his back, arms folded (`owner_turn` → 1, stands, → 0): twenty minutes in the notebook;
// while he stands with his back turned the roll does not grow. Not below — sold. TOP is never below the threshold: who
// is ready to pay loses not a minute.
//   What he does: Phileas Fogg buys an elephant from an old Parsee in the middle of the forest.
//   What he wants: the elephant now — fifty miles to Allahabad, and the train is gone.
//   How it is for him: unruffled; he reckons; money to him is only a way to buy time.
//   What the player feels: time is dearer than money — each refusal costs twenty minutes, each rise banknotes.
//   opts: { onRefuse(minutes) — after each refusal: how many minutes are gone in all (the chapter keeps the notebook),
//     not waited for }
//   → { price: what it was bought for (£), minutes: how many minutes went on the refusals }
import { until, keys } from '../hands.js';

const START = 1000, TOP = 2000, MIN = 1100; // £: the roll at the start; the thickest; the lowest threshold
const STEP = 100; // £: the price's step and the least rise
const RATE = 100; // £ a second while held
const REFUSAL = 20; // minutes in the notebook for a refusal
const TURN = 0.8, BACK = 1.6; // s: turns away; stands with his back turned
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export default {
  file: 'bargain',
  title: 'The bargain', // (as the author's ☰ lists it)
  about: 20,
  skipped: { price: 2000, minutes: 0 }, // Verne's price, no minutes lost
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: tr('The old Parsee looks at the roll of banknotes and says nothing. What an elephant costs, he alone knows') });
    const send = keys(g), acts = new Set();
    const move = (key, value, over) => { const a = b.act('state', 'move', key, value, { over }); acts.add(a); return a; };
    signal.addEventListener('abort', () => { for (const a of acts) a.cancel?.(); });
    const threshold = MIN + STEP * Math.floor(Math.random() * ((TOP - MIN) / STEP + 1));
    const pack = mg.mark({ at: 'fogg#hands', kind: 'groove' });
    // (the fill is the roll: full — TOP; let go — it stays)
    const hold = mg.hold({ on: null, show: pack, seconds: (TOP - START) / RATE, drain: 0 });
    b.minigame.tricks.teach(mg, [hold], { id: 'bargain' });
    send('offer', 0);
    send('owner_turn', 0);
    const priceOf = fill => START + STEP * Math.floor((fill * (TOP - START)) / STEP + 1e-6);
    let last = START, minutes = 0, refusals = 0, backAt = -1, frozen = 0, sold = false, t0 = mg.t;
    hold.on('up', () => {
      if (backAt >= 0) return;
      const price = priceOf(hold.state.fill);
      if (price - last < STEP) return; // no rise — no offer
      last = price;
      if (price >= threshold) { sold = true; return; }
      // a refusal: he turns away, twenty minutes
      refusals++;
      minutes += REFUSAL;
      frozen = hold.state.fill;
      backAt = mg.t - t0 + TURN + BACK;
      move('owner_turn', 1, TURN);
      mg.error('wrong', { at: pack, chip: true });
      mg.plate.set({ phrase: refusals === 1 ? tr('The old man turned away and folded his arms. Twenty minutes') : tr.n(refusals, 'The old man has turned away {n} time now. Another twenty minutes', 'The old man has turned away {n} times now. Another twenty minutes') });
      opts.onRefuse?.(minutes);
    });
    const done = await until(mg, ({ t }) => {
      const now = t - t0;
      // while he stands with his back turned, the roll does not grow
      if (backAt >= 0) {
        hold.set({ fill: frozen });
        if (now >= backAt) { backAt = -1; move('owner_turn', 0, TURN); }
      }
      const fill = hold.state.fill;
      send('offer', fill);
      mg.plate.set({ fill, glow: backAt >= 0 ? 'bad' : hold.state.held ? 'good' : 'idle' });
      return sold;
    });
    if (!done) return this.skipped;
    mg.snap({ at: pack });
    mg.plate.set({ phrase: tr('The elephant is sold') });
    await mg.end({ as: refusals ? 'flawed' : 'clean' });
    return { price: last, minutes };
  },
};
