// "The Camera" (III.1, the square, after the beat `dusk`; the insert `viewfinder` open): Toto films a girl he does not know with
// the eight-millimetre camera. Lead (anywhere): the arrow — the viewfinder's crosshair (`pan`), the zone — the girl (`elena_x`,
// the game leads her: from the bus on the right to the fountain in 22 s, halfway a stop of 2 s: she looks round at the church). At the 9th
// second the madman runs across the frame (`madman_x` −1 → 1 in 3 s). Pressed and led sideways: `pan` — the finger's shift
// (a quarter of the window's width = 1) from `pan` at the moment of the press; let go — it stands. In the zone (|elena_x − pan| < 0.22) the camera records
// (`rec` 1); out of the zone longer than 4 s on end — "fell behind" (once each time out). The end — 1.5 s after she has got there.
//   The feeling: Toto films a girl he does not know; he wants to keep her in the frame; curiosity and shyness; the player — not to lose her.
//   opts: { onFrame(inFrame) — when she comes into the frame and goes out of it (the chapter keeps the camera's whirr) }
//   → { share: the share of the time she was in the frame, 0…1 (so much of her is in his film in V.2) }
import { until, keys } from '../hands.js';

const WALK = 10, STOP = 2; // s: half the way, the stop halfway, half the way
const MADMAN = 9, RUN = 3; // s: when and how long he runs across
const ZONE = 0.22; // the zone's half-width
const LOST = 4; // s out of the zone on end — "fell behind"
const AFTER = 1.5; // s after she has got there
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

// where she is at the moment t (from the beginning): 1 → 0.5 in 10 s, stands 2 s, 0.5 → 0 in 10 s
const elenaAt = t => (t < WALK ? 1 - 0.5 * (t / WALK) : t < WALK + STOP ? 0.5 : Math.max(0, 0.5 - 0.5 * ((t - WALK - STOP) / WALK)));
const PATH = 2 * WALK + STOP;

export default {
  file: 'camera',
  title: 'The Camera', // as the author's ☰ lists it
  about: 26,
  skipped: { share: 1 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: tr('A strange girl crosses the square from the bus. The camera runs while she\'s in frame') });
    const send = keys(g);
    let pan = clamp(+g.get('pan') || 0, -1, 1), from = pan, inside = null, out = 0, lostOnce = false, errors = 0, inTime = 0;
    const lead = mg.lead({ zone: { at: 1 - pan, width: 2 * ZONE }, release: 'return' });
    b.minigame.tricks.teach(mg, [lead], { id: 'lead' });
    lead.on('down', () => { from = pan; });
    send('madman_x', -1);
    const t0 = mg.t;
    const done = await until(mg, ({ t: now, dt }) => {
      const t = now - t0, s = lead.state, x = elenaAt(t);
      if (s.held) pan = clamp(from + s.knob, -1, 1);
      // (the lead's own zone where she is, as the finger's offset sees it: its 'in zone' sound true)
      lead.set({ zone: { at: x - from, width: 2 * ZONE } });
      send('pan', pan);
      send('elena_x', x);
      send('madman_x', t < MADMAN ? -1 : t < MADMAN + RUN ? -1 + 2 * (t - MADMAN) / RUN : 1);
      const now_in = Math.abs(x - pan) < ZONE;
      if (now_in !== inside) { inside = now_in; send('rec', inside ? 1 : 0); opts.onFrame?.(inside); }
      if (t < PATH) {
        if (inside) { inTime += dt; out = 0; lostOnce = false; }
        else if ((out += dt) > LOST && !lostOnce) { lostOnce = true; errors++; mg.error('behind', {}); }
      }
      mg.plate.set({ fill: clamp(t / PATH), glow: inside ? 'good' : 'bad' });
      return t >= PATH + AFTER;
    });
    if (!done) return this.skipped;
    const share = Math.round(clamp(inTime / PATH) * 100) / 100;
    await mg.end({ as: errors ? 'flawed' : 'clean' });
    return { share };
  },
};
