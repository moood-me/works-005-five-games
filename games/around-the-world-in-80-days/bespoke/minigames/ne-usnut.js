// «Stay awake» (II.3, the harbour, the beat `pipe`; evening, the Hong Kong quay): Passepartout in the opium staggers
// from the tavern to the steps where the boatman waits with his lantern (`boatman` 1). Lead anywhere — and hold: while
// the finger is on the screen, Passepartout's eyes are open (`daze` slowly falls); let go — the stupor grows fast. The
// arrow — where he is led (`pp_sway` −1…1: he lurches sideways), the zone — straight on; the stupor itself pulls him now
// to the right, now to the left, the harder the thicker it is (`push`). Held and straight — he walks: the game sends him
// ahead along his way (`pp_walk` a little ahead of `pp_walk_at`, the scene leads him at his own pace); outside the zone
// — he stands; lurched to the edge — he stumbles (`pp_stumble` a rise to 1, a second). At the boatman (`pp_walk_at` ≥
// BOATMAN) — `message` a rise to 1: the boatman pushes off with the news. The stupor up to 1 — Passepartout slides down
// onto the stones: the news has not got through (the end «loss»).
//   What he does: Passepartout, drugged by Fix, drags himself along the quay to the lights of the landing.
//   What he wants: to tell his master that the Carnatic sails tonight, not tomorrow.
//   How it is for him: the world swims and doubles, his legs will not obey — duty through a fog.
//   What the player feels: keeping him conscious and leading him, against all the odds.
//   → { told: whether the news got to Fogg (the boatman pushed off) }
import { until, keys } from '../hands.js';

const BOATMAN = 0.97; // pp_walk_at: he is at the boatman (at the steps)
const AHEAD = 0.04; // pp_walk: how far ahead he is sent while led
const OPIUM = 0.015, WAKE = 0.05, SINK = 0.15; // daze a second: always grows; falls while held; grows while not
const ZONE = 0.6, EDGE = 0.92; // the width of the zone «straight on»; the lurch at which he stumbles
const STUMBLE = 1; // s: he stands after stumbling
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const reel = (t, daze) => daze * (0.5 * Math.sin(0.7 * t) + 0.3 * Math.sin(1.9 * t + 2));

export default {
  file: 'ne-usnut',
  title: 'Stay awake', // (as the author's ☰ lists it)
  about: 40,
  skipped: { told: true },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: tr('The lights of the quay swim double. The Carnatic sails tonight, and his master does not know') });
    const send = keys(g);
    send('boatman', 1);
    send('message', 0);
    send('pp_stumble', 0);
    send('pp_sway', 0);
    let daze = clamp(+g.get('daze') || 0.3), start = clamp(+g.get('pp_walk_at') || 0), stumbles = 0, stillTill = -1, stumbleOff = -1, tilted = false;
    const lead = mg.lead({ zone: { at: 0, width: ZONE }, steer: 'rate', release: 'stay', push: 0 });
    b.minigame.tricks.teach(mg, [lead], { id: 'lead' });
    const t0 = mg.t;
    const end = await until(mg, ({ t, dt }) => {
      const now = t - t0, s = lead.state;
      lead.set({ push: reel(now, daze) });
      daze = clamp(daze + (OPIUM + (s.held ? -WAKE : SINK)) * dt);
      send('daze', daze);
      send('pp_sway', s.arrow);
      const at = clamp(+g.get('pp_walk_at') || 0);
      // lurched to the edge — he stumbles
      if (Math.abs(s.arrow) >= EDGE && !tilted) {
        tilted = true;
        stumbles++;
        stillTill = now + STUMBLE;
        send('pp_stumble', 1);
        stumbleOff = now + 0.5;
        mg.error('off', { at: lead });
      }
      if (Math.abs(s.arrow) < ZONE / 2) tilted = false;
      if (stumbleOff >= 0 && now >= stumbleOff) { stumbleOff = -1; send('pp_stumble', 0); }
      // led straight on and his eyes open — he walks; else he stands
      const going = s.held && s.in && now >= stillTill;
      send('pp_walk', going ? Math.min(1, at + AHEAD) : at);
      mg.plate.set({ fill: clamp((at - start) / (BOATMAN - start)), glow: daze > 0.75 ? 'bad' : going ? 'good' : 'idle' });
      return at >= BOATMAN || daze >= 1;
    });
    if (!end) return this.skipped;
    if (daze >= 1) {
      send('pp_walk', clamp(+g.get('pp_walk_at') || 0));
      mg.plate.set({ phrase: tr('The opium has won. The boatman waits in vain') });
      await mg.end({ as: 'loss' });
      return { told: false };
    }
    send('message', 1);
    mg.snap({});
    mg.plate.set({ phrase: tr('The boatman\'s lantern moves off across the water towards the town') });
    await mg.end({ as: stumbles ? 'flawed' : 'clean' });
    return { told: true };
  },
};
