// “Coax” (I.1, the sea-front, after the beat `coax`; GARDEN_CAM): Gurov lowers his hand to another's spitz.
// Lead (the language §4.9): the arrow — his lowered hand (`hand` 0…1: how low and how near the muzzle), the zone — at
// the spitz's muzzle (`spitz#head`; the spitz itself glows). While the arrow is in the zone and the move not sharp,
// its own `near` grows 0.09 a second and is sent as the key `spitz_near` (the scene sets the spitz at once). A sharp
// move — the spitz growls: the error `danger` at its muzzle, `near` −0.2, a second without growth. `near` 1 — the
// spitz at his knee: a snap, the end 0.5 s later.
//   Who does what: Gurov reaches out to a stranger's little dog. What he wants: to amuse himself, to come to the lady
//   through it. What he feels: lazy, mocking, a little curious. The player: patience and a small trick.
//   → { startles: how many times he startled it }
import { until, keys } from '../hands.js';

const ZONE = { at: 0.45, width: 0.4 }; // where at the muzzle to keep the arrow (−1…1: the hand high and far … low and near)
const RATE = 0.09; // the spitz's share of the way a second
const SHARP = 0.12; // how sharp a move startles the spitz (the language: how sharp, per frame)
const STARTLE = 0.2, STILL = 1; // how far he backs off; how many seconds he does not come
const AFTER = 0.5; // s from the snap to the end
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export default {
  title: 'Coax', // as the author's ☰ lists it
  about: 15,
  skipped: { startles: 0 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: tr('The Pomeranian eyed the stranger’s hand and would not come near') });
    const send = keys(g);
    const lead = mg.lead({ zone: ZONE, steer: 'follow', release: 'stay' });
    b.minigame.tricks.teach(mg, [lead], { id: 'lead' });
    mg.glow('spitz');
    let near = clamp(+g.get('spitz_near') || 0), startles = 0, still = -1, end = -1;
    const done = await until(mg, ({ t, dt }) => {
      const s = lead.state;
      send('hand', clamp((s.arrow + 1) / 2));
      if (end >= 0) return t >= end;
      if (s.held && s.jerk > SHARP && t >= still) {
        startles++;
        mg.error('danger', { at: b.where('spitz#head') || undefined });
        g.sound.growl();
        near = clamp(near - STARTLE);
        still = t + STILL;
      } else if (s.in && t >= still) near = clamp(near + RATE * dt);
      send('spitz_near', near);
      mg.plate.set({ fill: near, glow: t < still ? 'bad' : s.in ? 'good' : 'idle' });
      if (near >= 1) {
        mg.snap({ at: b.where('spitz#head') || undefined });
        end = t + AFTER;
      }
      return false;
    });
    if (!done) return this.skipped;
    await mg.end({ as: startles ? 'flawed' : 'clean' });
    return { startles };
  },
};
