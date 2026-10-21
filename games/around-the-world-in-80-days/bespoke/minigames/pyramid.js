// «The pyramid» (II.6, the harbour — Yokohama, the beat `pyramid`; Batulcar's booth, night): Passepartout at the bottom
// of the Long Noses' human pyramid. Lead anywhere: the arrow — the pyramid's lean (`tilt` −1…1), the zone — level; the
// «noses» climb up and sway it (`push`). Held — the tiers grow (`pyramid` 0 → 1), level faster; swayed to the
// edge — a mistake, a tier sinks. At FOGG — Fogg sits down in the front row (`fogg_present` 1; the scene says
// `pyramid:fogg`). From that instant — a choice by the hands, the response even: hold to the end (keep it level up to
// `pyramid` 1) or let go (the finger off for LET_GO s — the pyramid collapses). The ghost finger shows both ways; and
// the letting go is seen from the instant Fogg sits: a quiet ring on him (`fogg#head`), its time arc running down while
// the finger is off — full again while it holds —, the plate's shade growing with it (waiting is a way too).
//   What he does: Passepartout, hired penniless into the troupe, holds the acrobats' tiers on his shoulders.
//   What he wants: to hold out to the end of the act, not to let his fellows down — and suddenly he sees his master in
//     the front row.
//   How it is for him: funny and agonising: loyalty to his fellows against his master in the house.
//   What the player feels: keeping the balance — and deciding oneself what matters more.
//   → { choice: 'hold' (held to the end) | 'drop' (let go) }
import { until, keys } from '../hands.js';

const CLIMB = 0.05, LEANING = 0.02; // pyramid a second while level; while held but leaning
const ZONE = 0.5, EDGE = 0.95; // the zone's width; the lean — a mistake
const SLIP = 0.08; // pyramid: a tier sinks
const FOGG = 0.5; // pyramid: Fogg sits down in the front row
const SEAT = 3; // s: wait for `pyramid:fogg` no longer
const LET_GO = 5; // s without a finger — let go
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const sway = (t, h) => 0.2 * Math.sin(1.1 * t) + 0.12 * Math.sin(2.7 * t + 1) + 0.06 * h;

export default {
  file: 'pyramid',
  title: tr('The pyramid'), // (as the author's map lists it)
  about: 24,
  skipped: { choice: 'drop' }, // as in Verne: he saw his master — and the pyramid collapsed
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: tr('The Long Noses climb on one another\'s shoulders. Passepartout is at the bottom') });
    const send = keys(g);
    send('pyramid', 0); send('tilt', 0); send('fogg_present', 0);
    const lead = mg.lead({ zone: { at: 0, width: ZONE }, steer: 'rate', release: 'stay', push: 0 });
    b.minigame.tricks.teach(mg, [lead], { id: 'pyramid' });
    let h = 0, wobbling = false, slips = 0, fogg = false, seated = false, offSince = null, choice = null, master = null;
    const t0 = mg.t;
    const done = await until(mg, ({ t, dt }) => {
      const now = t - t0, s = lead.state;
      lead.set({ push: sway(now, h) });
      send('tilt', s.arrow);
      send('pyramid', h);
      if (!seated) {
        // the skill: level — it grows; at the edge — it sinks
        if (s.held) h = Math.min(FOGG, h + (s.in ? CLIMB : LEANING) * dt);
        if (Math.abs(s.arrow) >= EDGE && !wobbling) { wobbling = true; slips++; h = Math.max(0, h - SLIP); mg.error('danger', { at: lead }); }
        if (s.in) wobbling = false;
        if (h >= FOGG && !fogg) {
          fogg = true;
          send('fogg_present', 1);
          // (he sits down — then the choice; the scene says nothing — after SEAT s)
          g.told('pyramid:fogg', SEAT * 1000).then(() => {
            if (signal.aborted) return;
            seated = true;
            offSince = s.held ? null : mg.t;
            master = mg.mark({ at: 'fogg#head', kind: 'ring', quiet: true, time: 1 });
            mg.plate.set({ phrase: tr('In the front row, watch in hand, sits Mr. Fogg'), glow: null });
            mg.show({ gestures: [lead] }).finished.then(() => { if (!choice && !signal.aborted) mg.show({ handsOff: true }); });
          });
        }
        mg.plate.set({ fill: h, glow: s.in ? 'good' : 'bad' });
        return false;
      }
      // the choice: hold to the end — or let go
      if (s.held) { offSince = null; h = Math.min(1, h + (s.in ? CLIMB : LEANING) * dt); }
      else if (offSince == null) offSince = t;
      if (offSince != null && t - offSince >= LET_GO) choice = 'drop';
      if (h >= 1) choice = 'hold';
      const off = offSince == null ? 0 : Math.min(1, (t - offSince) / LET_GO);
      master.set({ time: 1 - off });
      mg.plate.set({ fill: h, shade: offSince == null ? null : off });
      return !!choice;
    });
    if (!done) return this.skipped;
    master.remove();
    await mg.end({ as: 'neutral' });
    return { choice };
  },
};
