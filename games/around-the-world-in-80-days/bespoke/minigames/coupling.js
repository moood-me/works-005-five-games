// «The coupling» (III.3, the prairie, the beat `under`; the camera low under the cars — wheels, chains, running snow):
// Passepartout under the speeding train goes hand over hand along the chains from car to car to the engine. The cars
// sway — the scene leads the sway's phase (`swing_at` 0…1; CLOSE — the cars have come together, a chain at his hand);
// the game reads it and puts the rhythm's beats on those instants (the ring closes on the chain). A ring on the next
// chain `chain#c{n}`: pressed on the beat — the hand has caught it, Passepartout half a car further (`pp_car` +0.5,
// smoothly); off the beat — the hand slipped, he hangs (a mistake, time only). Two beats a chain, three chains — at the
// engine (`pp_car` 3). There a dashed ring on the coupling pin `coupling#pin`: pull (tear away) — the pin comes out
// (`uncouple` by the pull, 1 — torn out), the cars fall behind. The outcome — hours by the time: the longer, the
// further past the fort the cars will stop.
//   What he does: Passepartout climbs under the cars of the speeding train to the engine, to uncouple the cars at the
//     fort.
//   What he wants: to stop the train at Fort Kearney before the Sioux kill the passengers.
//   How it is for him: an acrobat's courage: the roar of the wheels, snow in his face, the sleepers half a metre away.
//   What the player feels: to catch the chain the instant the cars come together — and to wrench out the pin.
//   → { hours: 0…−2 }
import { until, once, keys } from '../hands.js';

const CLOSE = 0.5; // swing_at: the cars have come together — a chain at the hand
const GUESS = 1.4; // s: the sway's period, until it is seen from the scene
const HALF = 0.5, STEP = 0.4; // pp_car a beat; s — he moves across
const CHAINS = 3; // chains to the engine (c1…c3)
const TEAR = 0.2; // a share of the window's height — to tear out the pin
const QUICK = 14, LATE = 22; // s: up to this — no loss; up to this — an hour; longer — two
const WINDOW = 0.2; // s: the beat's tolerance
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export default {
  file: 'coupling',
  title: 'The coupling', // (as the author's map lists it)
  about: 16,
  skipped: { hours: 0 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: tr('Under the cars, sleepers and snow. The chains meet when the cars swing together') });
    const send = keys(g), acts = new Set();
    const move = (key, value, over) => { const a = b.act('state', 'move', key, value, { over }); acts.add(a); return a; };
    signal.addEventListener('abort', () => { for (const a of acts) a.cancel?.(); });
    const STEPS = 2 * CHAINS + 1;
    mg.plate.set({ notches: Array.from({ length: STEPS - 1 }, (_, i) => (i + 1) / STEPS) });
    send('pp_car', 0); send('uncouple', 0);
    let car = 0, misses = 0, period = GUESS, lastPh = null;
    const t0 = mg.t;
    // ── the chains: the beats — when the cars come together ──
    for (let n = 1; n <= CHAINS; n++) {
      const chain = mg.mark({ at: `chain#c${n}`, kind: 'ring' });
      const grab = mg.rhythm({ on: chain, times: [], window: WINDOW });
      if (n === 1) b.minigame.tricks.teach(mg, [grab], { id: 'coupling' });
      // the beats given to the rhythm: the last and the next (its clock); which of them a hand has taken already
      let times = [], hits = 0;
      const taken = new Set();
      const give = (prev, next) => { times = [prev, next]; grab.set({ times }); };
      grab.on('tap', ({ k, hit }) => {
        if (!hit) { misses++; mg.error('timing', { at: chain }); return; }
        const beat = times[k];
        if (taken.has(beat)) return; // (one beat — one hand)
        taken.add(beat);
        hits++;
        car += HALF;
        move('pp_car', car, STEP);
      });
      const ok = await until(mg, ({ dt }) => {
        // the scene's phase → when the cars will next come together (by the rhythm's clock)
        const ph = +g.get('swing_at'), now = grab.state.t;
        if (Number.isFinite(ph)) {
          if (lastPh != null && dt > 0) {
            const d = (ph - lastPh + 1) % 1;
            if (d > 0 && d < 0.5) period += (dt / d - period) * 0.1;
          }
          lastPh = ph;
          const next = now + ((CLOSE - ph + 1) % 1) * period;
          const coming = times[1];
          if (coming == null) give(next - period, next);
          else if (now > coming + WINDOW) give(coming, next); // the beat has passed — the next
          else if (now < coming - WINDOW && Math.abs(next - coming) > 0.08) give(times[0], next); // the sway has moved — correct it
        }
        mg.plate.set({ fill: (2 * (n - 1) + hits) / STEPS, glow: 'idle' });
        return hits >= 2;
      });
      if (!ok) return this.skipped;
      mg.snap({ at: chain });
      chain.remove();
    }
    // ── the coupling pin ──
    mg.plate.set({ phrase: tr('Passepartout is at the engine. The coupling pin holds the cars') });
    const pin = mg.mark({ at: 'coupling#pin', kind: 'dash' });
    const pull = mg.pull({ on: pin, tear: TEAR });
    b.minigame.tricks.teach(mg, [pull], { id: 'coupling:pin' });
    const off = mg.on('frame', () => {
      send('uncouple', clamp(pull.state.u * 0.9));
      mg.plate.set({ fill: (2 * CHAINS + pull.state.u) / STEPS, glow: pull.state.held ? 'good' : 'idle' });
    });
    const torn = await once(mg, pull, 'tear');
    off();
    if (!torn) return this.skipped;
    send('uncouple', 1);
    mg.snap({ at: pin });
    const seconds = mg.t - t0;
    await mg.end({ as: misses ? 'flawed' : 'clean' });
    return { hours: seconds <= QUICK ? 0 : seconds <= LATE ? -1 : -2 };
  },
};
