// «The cab» (Epilogue, Saville Row, the beat `cab`; the cab in the fog to the Reform Club, the camera with it): a rhythm
// anywhere — the beat of the hooves (the ring closes on the horse's head `cab#horse`). On the beat — the horse quickens
// (`cab_pace` towards 1: a walk → a gallop), off the beat — it falters, a beat missed — it slackens little by little.
// The game drives the cab on by `cab_pace` (`cab_to` — where it goes, the scene takes it there and says where it is,
// `cab_at`); out of the fog the lamps of carriages loom towards it (`traffic`). The clock goes: LIMIT s — from 20:35 to
// 20:45 (the plate's shade, the time layer). The cab at the club (`cab_at` ≥ ARRIVE) — in time; the time up before —
// late. A generous one: one can be late only by hardly urging it on at all.
//   What it does: the cab races through the London fog to the Reform Club; Fogg counts the seconds.
//   What he wants: to enter the club before a quarter to nine — Saturday found, the day gained.
//   How it is for him: the last minutes; fog, lamps, the beat of hooves and of his heart.
//   What the player feels: driving on — in time with the horse, without faltering, while the clock goes.
//   → { late: whether he is late }
import { until, shown, keys } from '../hands.js';

const BPM = 100; // the beat of the hooves
const START = 0.3, HIT = 0.12, MISS = 0.1, LAPSE = 0.04; // cab_pace: at the start; for a beat in time; off; a beat missed
const BASE = 0.012, GAIN = 0.04; // cab_to a second: at a walk; the rise at full speed
const LIMIT = 50; // s: to 20:45
const ARRIVE = 0.98; // cab_at: at the club
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export default {
  file: 'cab',
  title: tr('The cab'), // (as the author's map lists it)
  about: 36,
  skipped: { late: false },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: tr('Twenty-five minutes to nine. Fog all the way to Pall Mall — and ten minutes') });
    const send = keys(g);
    const horse = mg.mark({ at: 'cab#horse', kind: 'ring' });
    const hooves = mg.rhythm({ on: null, show: [horse], bpm: BPM });
    // (the ghost shows it; the time runs from the player's first touch)
    if (!(await shown(b, mg, [hooves]))) return this.skipped;
    const time = mg.layer('time');
    let pace = START, to = clamp(+g.get('cab_to') || 0), tapped = true, last = null;
    hooves.on('tap', ({ hit }) => {
      tapped = true;
      if (hit) pace = Math.min(1, pace + HIT);
      else { pace = Math.max(0, pace - MISS); mg.error('timing', { at: horse }); }
    });
    hooves.on('beat', () => { if (!tapped) pace = Math.max(0, pace - LAPSE); tapped = false; });
    send('traffic', 0.6);
    const t0 = mg.t;
    const done = await until(mg, ({ t, dt }) => {
      const now = t - t0;
      to = clamp(to + dt * (BASE + GAIN * pace));
      send('cab_to', to);
      send('cab_pace', pace);
      const at = clamp(+g.get('cab_at') || 0), u = clamp(now / LIMIT);
      time.set({ u, level: 1 });
      // (the minutes on the plate — when they change)
      const minute = 35 + Math.min(10, Math.floor(u * 10));
      if (minute !== last) { last = minute; if (minute > 35) mg.plate.set({ phrase: MINUTES[minute - 36] }); }
      mg.plate.set({ fill: at, shade: u, glow: pace >= 0.6 ? 'good' : 'idle' });
      return at >= ARRIVE || now >= LIMIT;
    });
    time.remove();
    if (!done) return this.skipped;
    const late = clamp(+g.get('cab_at') || 0) < ARRIVE;
    await mg.end({ as: late ? 'loss' : 'clean' });
    return { late };
  },
};

// the plate's phrase at each minute from 20:36 to 20:45
const MINUTES = [tr('Twenty-four minutes to nine. Fog, carriage lamps'), tr('Twenty-three minutes to nine. Fog, carriage lamps'),
  tr('Twenty-two minutes to nine. Fog, carriage lamps'), tr('Twenty-one minutes to nine. Fog, carriage lamps'),
  tr('Twenty minutes to nine. Fog, carriage lamps'), tr('Nineteen minutes to nine. Fog, carriage lamps'),
  tr('Eighteen minutes to nine. Fog, carriage lamps'), tr('Seventeen minutes to nine. Fog, carriage lamps'),
  tr('Sixteen minutes to nine. Fog, carriage lamps'), tr('A quarter to nine')];
