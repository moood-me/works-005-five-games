// «The boilers» (IV.4, the deck, the beat `burn`; the Henrietta's deck from the poop, all that burns in sight): Fogg has
// bought the ship, there is no coal. A dashed ring on each part of the ship (`<part>#part`) the purse can pay for — the masts once
// their yards are burnt: pull
// to the open stokehold hatch `hatch#fire` (it glows from the start); the part moves by the key `drag_<part>` (0 in place … 1 at the
// hatch), let go not at the hatch — it goes back, seen. Brought there — the part into the furnace: `<part>` 0 (the
// scene — a flare in the hatch), `fire` and `speed` grow, Speedy clutches his head (`speedy_grief`). Each — PRICE £
// from the carpet-bag (opts.money); not enough for the next — the rest are locked (`locked_<part>` 1, no marks).
// Speedy's cabin — last, when all the rest has burnt: a choice — pull it too (a ring on the cabin) or spare it (a quiet
// ring on `speedy#head`, the petal «Spare the cabin»); the response even.
//   What he does: Passepartout (or Fogg, his frock-coat off for the first time) hauls pieces of the bought ship into
//     the furnace.
//   What he wants: to reach Liverpool on the last of the wood — there is no coal, and England is four days off.
//   How it is for him: excitement and the sacrifice of what is another's — the ship is stripped before his eyes, the
//     captain groans.
//   What the player feels: the thrill of destruction and the price of every plank.
//   opts: { who: 'pp' | 'fogg' — whose hands (the plate's phrase), money: what the carpet-bag holds (£) }
//   → { burned: [the parts, burnt in order], cabin: whether Speedy's cabin is burnt }
import { until, keys } from '../hands.js';

const PARTS = ['deckhouse', 'boats', 'bunks', 'yards', 'mast_fore', 'mast_main', 'bulwarks'];
const CABIN = 'speedy_cabin';
const MASTS = ['mast_fore', 'mast_main']; // (the yards hang on them: a mast is offered once the yards are burnt)
const PRICE = 1500; // £ a part
const FLASH = 0.8; // s: the fire flares up after a part
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export default {
  file: 'boilers',
  title: tr('The boilers'), // (as the author's map lists it)
  about: 50,
  // (skipped: all the wood but the cabin; how much of it the purse can pay for the chapter checks against the carpet-bag: skipped knows no money)
  skipped: { burned: [...PARTS], cabin: false },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: opts.who === 'fogg'
      ? tr('Mr. Fogg has taken off his frock-coat. No coal; everything wooden burns')
      : tr('No coal. Passepartout feeds the furnace with everything that burns') });
    const send = keys(g), acts = new Set();
    const move = (key, value, over) => { const a = b.act('state', 'move', key, value, { over }); acts.add(a); return a; };
    signal.addEventListener('abort', () => { for (const a of acts) a.cancel?.(); });
    const ALL = PARTS.length + 1;
    let money = +opts.money || 0;
    const burned = [];
    const heat = () => {
      const u = burned.length / ALL;
      move('fire', 0.3 + 0.7 * u, FLASH);
      send('speed', 0.2 + 0.8 * u);
      send('speedy_grief', burned.includes(CABIN) ? 1 : clamp(0.8 * burned.length / PARTS.length));
    };
    send('fire', 0.3); send('speed', 0.2); send('speedy_grief', 0);
    mg.glow('hatch'); // (where every part goes: the open hatch, seen before a part is touched)
    for (const part of [...PARTS, CABIN]) { send(part, 1); send(`drag_${part}`, 0); send(`locked_${part}`, 0); }
    const lock = parts => parts.forEach(p => send(`locked_${p}`, 1));
    // one part: a ring, pull to the hatch; let go at the hatch — into the furnace
    const items = new Map(); // part → {mark, pull}
    const burn = part => {
      const { mark } = items.get(part);
      burned.push(part);
      money -= PRICE;
      send(part, 0);
      send(`drag_${part}`, 0);
      mg.snap({ at: mark });
      mark.remove();
      items.delete(part);
      heat();
    };
    const offer = (part, ok = () => true) => {
      const mark = mg.mark({ at: `${part}#part`, kind: 'dash' });
      const pull = mg.pull({ on: mark, to: 'hatch#fire', release: 'spring' });
      pull.on('release', ({ inTarget }) => { if (inTarget && items.has(part) && ok()) burn(part); });
      items.set(part, { mark, pull });
      return pull;
    };
    const left = () => PARTS.filter(p => !burned.includes(p));
    // ── all but the cabin, in any order ──
    if (money < PRICE) lock([...PARTS, CABIN]);
    else {
      const pulls = left().filter(part => !MASTS.includes(part)).map(part => offer(part));
      b.minigame.tricks.teach(mg, pulls.slice(0, 1), { id: 'boilers' });
      let masts = false; // (offered, or locked)
      const done = await until(mg, () => {
        if (!masts && burned.includes('yards') && money >= PRICE) { masts = true; MASTS.forEach(part => offer(part)); }
        // not enough for the next — the rest are locked
        if (money < PRICE && (items.size || !masts)) { for (const it of items.values()) it.mark.remove(); items.clear(); lock([...left(), CABIN]); masts = true; }
        for (const [part, { pull }] of items) send(`drag_${part}`, pull.state.u);
        mg.plate.set({ fill: burned.length / ALL, glow: [...items.values()].some(it => it.pull.state.held) ? 'good' : 'idle' });
        return masts && items.size === 0;
      });
      if (!done) return this.skipped;
    }
    // ── Speedy's cabin: burn it or spare it ──
    let cabin = false;
    if (money >= PRICE && left().length === 0) {
      mg.plate.set({ phrase: tr('Captain Speedy\'s cabin is all that is left. Speedy clutches his head'), glow: null });
      send('speedy_grief', 1);
      let kept = false;
      const pull = offer(CABIN, () => !kept);
      const spare = mg.mark({ at: 'speedy#head', kind: 'ring', quiet: true });
      const keep = mg.press({ on: spare, petals: [{ id: 'spare', label: tr('Spare the cabin') }] });
      keep.on('choose', () => { kept = true; });
      mg.show({ gestures: [pull, keep] });
      const decided = await until(mg, () => {
        if (items.has(CABIN)) send(`drag_${CABIN}`, pull.state.u);
        return kept || !items.has(CABIN);
      });
      if (!decided) return this.skipped;
      cabin = burned.includes(CABIN);
      if (kept) { send(`drag_${CABIN}`, 0); items.get(CABIN)?.mark.remove(); items.delete(CABIN); }
      spare.remove();
      await mg.end({ as: 'neutral' });
    } else await mg.end({ as: burned.length ? 'clean' : 'neutral' });
    return { burned, cabin };
  },
};
