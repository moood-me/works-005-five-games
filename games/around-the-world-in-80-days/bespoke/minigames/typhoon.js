// «The typhoon» (II.5, the sea, the beat `typhoon`; the camera at the Tankadere's stern, low): crests come at the bow
// one after another, each from its bow (`wave_from` −1…1: port … starboard). Lead anywhere: the arrow — the helm
// (`helm` −1…1: the tiller and the boat's bow), the zone — where to keep the bow: as a crest comes — into the wave (it comes now from the port bow, now from the starboard), in the
// trough — straight. The wave — `wave` 0 → 1 in PERIOD s (0.5 — the crest under the bow), its height `wave_h` grows to
// the middle of the storm and falls. Two instants a wave: the crest under the bow (the bow not into the wave — water
// over the side, `green_water` a rise to 1) and the trough (not straight — the boat yaws, water too). The heel `heel` —
// from how far the bow is off, and from the crest. The outcome — hours: every two mistakes — an hour.
//   What he does: Fogg and Bunsby take the tiny Tankadere through the typhoon to Shanghai.
//   What he wants: not to let a wave lay the boat on her side — and not to lose a mile.
//   How it is for him: holding on; Fogg's cold self-command amid the howling and the foam.
//   What the player feels: holding on — meeting each wave bow on, without a jerk.
//   → { hours: 0…−3 }
import { until, keys } from '../hands.js';

const WAVES = 8, PERIOD = 5; // waves; s a wave
const CREST = 0.5, TROUGH = 0.9; // wave: the check on the crest; in the trough
const ZONE = 0.4; // the zone's width
const STRAIGHT = 0.3; // in the trough — straight, if |helm| is no more
const SPLASH = 1.2; // s: green_water stays at 1
const clamp = (v, a = -1, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a, b, x) => { const u = Math.min(1, Math.max(0, (x - a) / (b - a))); return u * u * (3 - 2 * u); };

export default {
  file: 'typhoon',
  title: tr('The typhoon'), // (as the author's map lists it)
  about: 42,
  skipped: { hours: 0 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: tr('Waves higher than the mast. The Tankadere — twenty tons, and she goes to meet them') });
    const send = keys(g);
    mg.plate.set({ notches: Array.from({ length: WAVES - 1 }, (_, i) => (i + 1) / WAVES) });
    // where each wave comes from: now the left, now the right, by how much
    const dirs = Array.from({ length: WAVES }, (_, k) => (k % 2 ? 1 : -1) * (0.45 + 0.25 * Math.random()));
    const lead = mg.lead({ zone: { at: 0, width: ZONE }, release: 'stay' });
    b.minigame.tricks.teach(mg, [lead], { id: 'typhoon' });
    let misses = 0, k = 0, checked = { crest: -1, trough: -1 }, splashOff = -1, said = null;
    const PORT = tr('A crest comes down on the port bow'), STARBOARD = tr('A crest comes down on the starboard bow'), TROUGH = tr('The crest has passed. The trough, and the bow comes back');
    send('green_water', 0);
    const splash = (now, reason) => {
      misses++;
      send('green_water', 1);
      splashOff = now + SPLASH;
      mg.error(reason, { at: lead });
    };
    const T = WAVES * PERIOD, t0 = mg.t;
    const done = await until(mg, ({ t }) => {
      const now = t - t0;
      k = Math.min(WAVES - 1, Math.floor(now / PERIOD));
      const w = Math.min(1, (now - k * PERIOD) / PERIOD), dir = dirs[k];
      // where to keep the bow: as it comes — into the wave; after the crest — straight again
      const at = dir * (smooth(0.12, 0.35, w) - smooth(0.58, 0.78, w));
      lead.set({ zone: { at, width: ZONE } });
      const helm = lead.state.arrow;
      send('wave', w);
      send('wave_from', dir);
      send('wave_h', 0.55 + 0.45 * Math.sin(Math.PI * Math.min(1, now / T)));
      send('helm', helm);
      const crest = Math.sin(Math.PI * w) ** 2;
      send('heel', clamp(1.3 * (at - helm) * (0.3 + 0.7 * crest) + 0.15 * Math.sin(2 * Math.PI * w)));
      if (w >= CREST && checked.crest < k) {
        checked.crest = k;
        if (Math.abs(helm - dir) > ZONE / 2) splash(now, 'off');
        else mg.sound('tap');
      }
      if (w >= TROUGH && checked.trough < k) {
        checked.trough = k;
        if (Math.abs(helm) > STRAIGHT) splash(now, 'off');
      }
      if (splashOff >= 0 && now >= splashOff) { splashOff = -1; send('green_water', 0); }
      // (where the crest comes from, said as it comes; in the trough — the bow back)
      const told = w < 0.5 ? (dir < 0 ? 'port' : 'starboard') : 'trough';
      if (told !== said) { said = told; mg.plate.set({ phrase: told === 'port' ? PORT : told === 'starboard' ? STARBOARD : TROUGH }); }
      mg.plate.set({ fill: Math.min(1, now / T), glow: lead.state.in ? 'good' : 'bad' });
      return now >= T;
    });
    if (!done) return this.skipped;
    send('green_water', 0);
    await mg.end({ as: misses ? 'flawed' : 'clean' });
    return { hours: -Math.min(3, Math.floor(misses / 2)) || 0 };
  },
};
