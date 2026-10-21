// «Ten minutes» (Prologue, Saville Row, the beat `pack`; the front, all the windows in the frame, the carpet-bag at the
// door): Passepartout rushes about the house. A ring on each window of Fogg's list — the dressing-room (two shirts),
// the bedroom (three pairs of stockings), the hall (the mackintosh), the study (the Bradshaw); a quiet ring on the
// attic — the gas, not on the list. A window pressed — Passepartout runs there (`pp_in` 'none' on the stairs, a floor —
// RUN s, then the window), and a thing flies into the bag (`fly_what`, `fly` a rise to 1; `bag` grows); each next press
// of the same window — the next thing (no oftener than THROW s; presses while he runs add up). The attic — he turns off
// the gas (`gas` → 0, GAS s). Thirty seconds (the plate's shade, the time layer); all packed — the end at once.
//   What he does: Passepartout packs his master for a journey round the world in ten minutes.
//   What he wants: to pack everything on the list and not delay Mr. Fogg by a minute.
//   How it is for him: dumbfounded — he has only just taken a place in the quietest house in London; he rushes about,
//     merrily and muddle-headedly.
//   What the player feels: a merry bustle — the end of a quiet life; the gas — a trifle, easily forgotten.
//   → { missing: how many things of the list are not packed (0…4; each — the carpet-bag −50), gas: whether the gas burns
//     in the attic }
import { until, keys } from '../hands.js';

// a window → what the list has there (how many), the floor
const ROOMS = {
  dressing: { at: 'win_dressing', what: 'shirt', n: 2, floor: 2 },
  bedroom: { at: 'win_bedroom', what: 'stockings', n: 3, floor: 2 },
  hall: { at: 'win_hall', what: 'coat', n: 1, floor: 0 },
  study: { at: 'win_study', what: 'bradshaw', n: 1, floor: 1 },
};
const ATTIC = { at: 'attic', floor: 3 };
const LIMIT = 30; // s
const RUN = 0.45, ROOM = 0.5; // s: a floor by the stairs; from the door to the room's window
const THROW = 0.6; // s: from thing to thing in one room
const FLY = 0.5; // s: `fly` stays at 1, then 0 (the next rise)
const GAS = 1.2; // s: to reach the burner
const BAG0 = 0.15; // the carpet-bag at the door, empty
const AFTER = 0.8; // s after the last thing — the end
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export default {
  file: 'ten-minutes',
  title: 'Ten minutes', // (as the author's ☰ lists it)
  about: 30,
  skipped: { missing: 0, gas: true }, // the list packed; the gas, not on the list, burns — as in Verne
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: tr('Two shirts, three pairs of stockings, a mackintosh, a Bradshaw — and ten minutes') });
    const send = keys(g), acts = new Set();
    const move = (key, value, over) => { const a = b.act('state', 'move', key, value, { over }); acts.add(a); return a; };
    signal.addEventListener('abort', () => { for (const a of acts) a.cancel?.(); });
    const ALL = Object.values(ROOMS).reduce((s, r) => s + r.n, 0);
    mg.plate.set({ shade: 0 });
    const time = mg.layer('time');
    send('pp_in', 'none');
    send('fly', 0);
    send('bag', BAG0);
    send('gas', 1);
    // the rings: the list's windows and a quiet one — the attic
    const left = {}, rings = {}, presses = [];
    for (const [room, r] of Object.entries(ROOMS)) {
      left[room] = r.n;
      rings[room] = mg.mark({ at: r.at, kind: 'ring' });
      const p = mg.press({ on: rings[room] });
      p.on('press', () => go(room));
      presses.push(p);
    }
    rings.attic = mg.mark({ at: ATTIC.at, kind: 'ring', quiet: true });
    mg.press({ on: rings.attic }).on('press', () => go('attic'));
    b.minigame.tricks.teach(mg, presses.slice(0, 1), { id: 'ten-minutes' });
    // where he is: floor — the last floor he ran to; dest — where he runs to or where he is; there at arrive; want — how
    // many more presses in this room wait; next — when he can throw the next thing
    let floor = 0, dest = null, here = null, arrive = 0, want = 0, next = 0, flyOff = -1, gasAt = -1, gasOff = false, packed = 0, t0 = mg.t, now = 0;
    const floorOf = room => (room === 'attic' ? ATTIC : ROOMS[room]).floor;
    function go(room) {
      if (room === 'attic' && gasOff) return;
      if (room !== 'attic' && left[room] <= 0) return;
      if (room === dest) { want = Math.min(want + 1, room === 'attic' ? 1 : left[room]); return; }
      const from = dest ? floorOf(dest) : floor;
      dest = room;
      want = 1;
      arrive = now + Math.abs(floorOf(room) - from) * RUN + ROOM;
      next = arrive;
      gasAt = -1;
      here = null;
      send('pp_in', 'none');
    }
    const done = await until(mg, ({ t }) => {
      now = t - t0;
      // he has run there: light in the window, he is there
      if (dest && now >= arrive && here !== dest) { here = dest; send('pp_in', dest); floor = floorOf(dest); }
      if (dest && now >= arrive) {
        if (dest === 'attic') {
          if (gasAt < 0 && !gasOff) gasAt = now + GAS;
          if (gasAt >= 0 && now >= gasAt && !gasOff) {
            gasOff = true;
            move('gas', 0, 0.5);
            mg.snap({ at: rings.attic });
            rings.attic.remove();
          }
        } else if (want > 0 && left[dest] > 0 && now >= next) {
          // a thing flies into the bag
          want--;
          left[dest]--;
          packed++;
          next = now + THROW;
          send('fly_what', ROOMS[dest].what);
          send('fly', 1);
          flyOff = now + FLY;
          send('bag', BAG0 + (0.95 - BAG0) * packed / ALL);
          if (left[dest] === 0) { mg.snap({ at: rings[dest] }); rings[dest].remove(); }
        }
      }
      if (flyOff >= 0 && now >= flyOff) { flyOff = -1; send('fly', 0); }
      const u = clamp(now / LIMIT);
      time.set({ u, level: 1 });
      mg.plate.set({ fill: packed / ALL, shade: u, glow: dest && now < arrive ? 'good' : 'idle' });
      return now >= LIMIT || (packed >= ALL && flyOff < 0 && now >= next - THROW + AFTER);
    });
    time.remove();
    if (!done) return this.skipped;
    if (flyOff >= 0) send('fly', 0);
    const missing = Object.keys(ROOMS).filter(room => left[room] > 0).length;
    await mg.end({ as: missing ? 'flawed' : 'clean' });
    return { missing, gas: !gasOff };
  },
};
