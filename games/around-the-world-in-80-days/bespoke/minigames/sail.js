// «The sail» (III.5, the prairie, the beat `sail`; Mudge's sledge flies under sail over the snow to Omaha): lead
// anywhere — the arrow — the sheet (`sheet` 0 — let go … 1 — hauled right in), the zone — how to hold it in this wind
// (`wind` −1…1: the pennant on the mast, the snow downwind; the wind changes every GUST s). In the zone — the sledge
// gathers speed (`sl_speed` towards 1), outside it — loses way; the way `sledge` 0 → 1 by the speed. Every RIDGE s a
// snow ridge rises out of the snow ahead (`drift` 0 → 1 in RIDGE_IN s): the zone goes to «let go» — ease the sheet and
// go round; the sheet hauled in when the ridge is under the sledge — a blow: the sledge stops (a mistake, `sl_speed`
// 0). Slow — wolves come up from the edge of the plain (`wolves` grows), fast — they fall behind. The outcome — hours by
// the time of the way.
//   What it does: Mudge's sledge races under sail over the frozen plain to Omaha.
//   What they want: to win back the lost hours — or, if Passepartout is alone, to catch the train at Omaha.
//   How it is for them: the rapture of speed: wind, frost, snow in the face, wolves at the edge of the plain.
//   What the player feels: catching the wind and feeling the sledge fly.
//   opts: { alone: true — Passepartout alone with Mudge, catching up with the train (the plate's phrase) }
//   → { hours: how many hours won back (+10…+22), caught: in time for the train at Omaha (hours no fewer than
//     CAUGHT) }
import { until, keys } from '../hands.js';

const FAST = 30, SLOW = 60; // s: the way at full speed; at the slackest
const HOURS = [10, 22]; // hours: in SLOW s; in FAST s
const CAUGHT = 16; // hours: no fewer — the train still stands at Omaha
const GUST = 8; // s: the wind changes
const RIDGE = 12, RIDGE_IN = 3, HIT = 0.85; // s: a ridge every; comes up; drift when it is under the sledge
const STOP = 1.5; // s: the sledge stands after a blow
const ZONE = 0.4; // the zone's width
const GAIN = 0.5, LOSS = 0.35; // sl_speed a second: gathering in the zone; losing outside
const MIN_SPEED = 0.15;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = x => { const u = clamp(x); return u * u * (3 - 2 * u); };

export default {
  file: 'sail',
  title: tr('The sail'), // (as the author's map lists it)
  about: 40,
  skipped: { hours: 18, caught: true },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: opts.alone
      ? tr('Passepartout alone with Mudge. The train will not wait at Omaha')
      : tr('A west wind, and Mudge\'s sledge flies over the snow like a boat over the water') });
    const send = keys(g);
    // the wind: where it is now and where it will turn
    const winds = [0.5];
    for (let i = 1; i < 12; i++) winds.push(clamp(winds[i - 1] + (Math.random() < 0.5 ? -1 : 1) * (0.5 + 0.6 * Math.random()), -0.9, 0.9));
    const windAt = t => {
      const i = Math.min(Math.floor(t / GUST), winds.length - 1), j = Math.min(i + 1, winds.length - 1);
      return winds[i] + (winds[j] - winds[i]) * smooth((t - i * GUST - (GUST - 2)) / 2); // it turns over 2 s
    };
    // the sheet: the arrow −1 (let go) … 1 (hauled in); the more the wind is abeam, the tighter
    const want = w => 0.1 + 0.7 * Math.abs(w);
    const SLACK = -0.8; // a ridge: the sheet let go
    const lead = mg.lead({ zone: { at: want(winds[0]), width: ZONE }, release: 'stay' });
    b.minigame.tricks.teach(mg, [lead], { id: 'sail' });
    let speed = 0.3, sledge = 0, wolves = 0, hits = 0, stopTill = -1, hitRidge = -1;
    send('sledge', 0); send('drift', 0); send('wolves', 0);
    const t0 = mg.t;
    const done = await until(mg, ({ t, dt }) => {
      const now = t - t0, w = windAt(now);
      // a ridge: comes up over RIDGE_IN s; while it is near — let go the sheet
      const k = Math.floor(now / RIDGE), r = now - k * RIDGE - (RIDGE - RIDGE_IN);
      const drift = k >= 0 && r >= 0 ? clamp(r / RIDGE_IN) : 0;
      const at = drift > 0.3 ? SLACK : want(w);
      lead.set({ zone: { at, width: ZONE } });
      const sheet = (lead.state.arrow + 1) / 2;
      if (drift >= HIT && hitRidge < k) {
        hitRidge = k;
        if (!lead.state.in) { hits++; speed = 0; stopTill = now + STOP; mg.error('danger', { at: lead }); }
        else mg.sound('tap');
      }
      if (now < stopTill) speed = 0;
      else speed = clamp(speed + (lead.state.in ? GAIN : -LOSS) * dt, MIN_SPEED, 1);
      sledge = clamp(sledge + dt * (1 / SLOW + (1 / FAST - 1 / SLOW) * speed));
      wolves = clamp(wolves + (speed < 0.5 ? 0.08 : -0.12) * dt);
      send('wind', w); send('sheet', sheet); send('drift', drift); send('sl_speed', speed); send('sledge', sledge); send('wolves', wolves);
      mg.plate.set({ fill: sledge, glow: now < stopTill ? 'bad' : lead.state.in ? 'good' : 'idle' });
      return sledge >= 1;
    });
    if (!done) return this.skipped;
    const seconds = mg.t - t0;
    const hours = Math.round(HOURS[0] + (HOURS[1] - HOURS[0]) * clamp((SLOW - seconds) / (SLOW - FAST)));
    await mg.end({ as: hits ? 'flawed' : 'clean' });
    return { hours, caught: hours >= CAUGHT };
  },
};
