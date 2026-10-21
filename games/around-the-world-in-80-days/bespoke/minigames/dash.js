// «The dash» (I.5 «on the road», the jungle, the beat `charge`; night, torches): Kiouni bursts out of the thicket onto
// the trail. Phase 1 — lead anywhere: the arrow — where Kiouni heads across the trail (`kiouni_lane` −1…1), the zone —
// the palanquin with the widow (`litter_lane`: the bearers shy away, the palanquin lurches about). In the zone — Kiouni
// crashes straight at them (`charge` fast), outside it — he sticks in the crowd (slow). The torches scatter by
// `charge` (`scatter`). Phase 2 — at the palanquin (`charge` LITTER): a ring on the widow's hands `aouda#hands`, pull
// (tear away, heavy): Passepartout snatches her up into the howdah (`grab` a rise to 1). Phase 3 — the scene's own:
// Kiouni goes off into the dark (`charge` → 1), a torch catches the guide's face (`guide_seen` to 1). The outcome —
// hours by how long phases 1–2 lasted.
//   What he does: Fogg drives the elephant straight into the procession; Passepartout in the howdah, the guide on the
//     neck.
//   What he wants: to tear the widow from the priests' hands before they come to their senses.
//   How it is for him: a desperate speed, shouts, fire right at the eyes.
//   What the player feels: a mad dash — and one instant when one must snatch.
//   → { hours: 0…−2 — the longer the struggle at the palanquin, the further the chase }
import { until, once, keys } from '../hands.js';

const LITTER = 0.5; // charge: Kiouni at the palanquin
const FAST = 0.1, SLOW = 0.035; // charge a second: in the zone; in the crowd
const ZONE = 0.35; // the zone's width (the palanquin)
const SCATTER_FROM = 0.15, SCATTER_TO = 0.45; // charge: the torches scatter from here to here
const TEAR = 0.2; // a share of the window's height — to tear the widow away
const AWAY = 3, SEEN = 1.4; // s: goes off into the dark; when a torch catches the guide's face
const QUICK = 9, LATE = 14; // s: up to this — no loss; up to this — an hour; longer — two
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
// (the palanquin lurches about: the bearers shy now to the right, now to the left)
const litter = t => clamp(0.55 * Math.sin(0.8 * t + 0.6) + 0.15 * Math.sin(2.1 * t), -0.8, 0.8);

export default {
  file: 'dash',
  title: 'The dash', // (as the author's map lists it)
  about: 14,
  skipped: { hours: 0 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: tr('Torches, priests, the widow\'s palanquin — and an elephant nobody expected here') });
    const send = keys(g), acts = new Set();
    const move = (key, value, over) => { const a = b.act('state', 'move', key, value, { over }); acts.add(a); return a; };
    signal.addEventListener('abort', () => { for (const a of acts) a.cancel?.(); });
    mg.plate.set({ notches: [0.6, 0.8] });
    send('charge', 0); send('scatter', 0); send('grab', 0); send('guide_seen', 0);
    // ── phase 1: through the torches to the palanquin ──
    const lead = mg.lead({ zone: { at: litter(0), width: ZONE }, release: 'stay' });
    b.minigame.tricks.teach(mg, [lead], { id: 'dash' });
    let charge = 0;
    const t0 = mg.t;
    const there = await until(mg, ({ t, dt }) => {
      const now = t - t0, at = litter(now);
      lead.set({ zone: { at, width: ZONE } });
      send('litter_lane', at);
      send('kiouni_lane', lead.state.arrow);
      charge = Math.min(LITTER, charge + (lead.state.in ? FAST : SLOW) * dt);
      send('charge', charge);
      send('scatter', clamp((charge - SCATTER_FROM) / (SCATTER_TO - SCATTER_FROM)));
      mg.plate.set({ fill: (0.6 * charge) / LITTER, glow: lead.state.in ? 'good' : lead.state.held ? 'bad' : 'idle' });
      return charge >= LITTER;
    });
    if (!there) return this.skipped;
    lead.remove();
    send('scatter', 1);
    // ── phase 2: snatch the widow ──
    mg.plate.set({ phrase: tr('The bearers have dropped the poles. The widow is on the palanquin, alone') });
    const hands = mg.mark({ at: 'aouda#hands', kind: 'dash' });
    const pull = mg.pull({ on: hands, tear: TEAR });
    b.minigame.tricks.teach(mg, [pull], { id: 'dash:grab' });
    const off = mg.on('frame', () => mg.plate.set({ fill: 0.6 + 0.2 * pull.state.u, glow: pull.state.held ? 'good' : 'idle' }));
    const torn = await once(mg, pull, 'tear');
    off();
    if (!torn) return this.skipped;
    const seconds = mg.t - t0;
    send('grab', 1);
    mg.snap({ at: hands });
    hands.remove();
    // ── phase 3: into the dark ──
    mg.sceneTurn(true);
    move('charge', 1, AWAY);
    const t1 = mg.t;
    let seen = false;
    const away = await until(mg, ({ t }) => {
      if (!seen && t - t1 >= SEEN) { seen = true; send('guide_seen', 1); }
      mg.plate.set({ fill: 0.8 + (0.2 * clamp((t - t1) / AWAY)) });
      return t - t1 >= AWAY;
    });
    if (!away) return this.skipped;
    mg.sceneTurn(false);
    await mg.end({ as: seconds <= QUICK ? 'clean' : 'flawed' });
    return { hours: seconds <= QUICK ? 0 : seconds <= LATE ? -1 : -2 };
  },
};
