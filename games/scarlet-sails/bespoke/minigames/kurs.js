// «Course» (V, the ship on its way to Kaperna; played in three legs, `opts.leg` 0, 1, 2): Gray at the helm, the bow on
// Kaperna. The language's lead, anywhere — the helm: the finger's offset turns the wheel (`helm`) and steers the bow
// (`heading`, the lead's arrow, a rate), gusts push it off (the lead's push, set each frame); kept in the zone (|heading|
// < 0.2) the sails stay full, out of it they luff (`luff`). The scene (`helm`) shows it all by those three keys; the
// camera goes with the ship — a gesture anywhere, the camera may. A leg is 20 s from the player's first touch (or from
// the 4th second); steady is the share of it in the zone.
//   opts: { leg: 0…2, sea: the sea scale, onSteady(u) — four times a second, the share kept steady over the last 3 s }
//   → { steady: 0…1 }
import { until, keys } from '../hands.js';

const LEG = 20, WAIT = 4; // seconds of a leg; seconds before it starts by itself
const STEADY = 0.2, LUFF_FROM = 0.25, LUFF_SPAN = 0.5; // |heading| counted steady; where the sails start to luff
const SAMPLES = 12; // 3 s of quarter-seconds
const EASE = 0.5; // s: the wheel let go comes back
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

const kurs = {
  title: 'Course', // (as the author's ☰ lists it)
  about: 22,
  skipped: { steady: 0.8 }, // (as played: the plain good outcome — clean from 0.6)
  async run(g, b, opts, signal) {
    const leg = opts.leg, sea = opts.sea;
    const A = (0.5 - 0.06 * sea) * (0.8 + 0.2 * leg);
    const mg = g.minigame({ phrase: tr('The wind was carrying the Secret off her course for Kaperna') });
    const send = keys(g);
    const helm = mg.lead({ steer: 'rate', zone: { at: 0, width: 2 * STEADY } });
    mg.glow('wheel');
    if (leg === 0) b.minigame.tricks.teach(mg, [helm], { id: 'lead' });
    let began = null, steadyFor = 0, tick = 0, luff = 0, wheel = 0;
    const ticks = [];
    mg.on('down', () => { began ??= mg.t; });
    const t0 = mg.t;
    const done = await until(mg, ({ t, dt }) => {
      if (began === null && t - t0 >= WAIT) began = t;
      const s = helm.state;
      // (the wheel where the finger has it; let go, it comes back in half a second)
      wheel = s.held ? s.knob : wheel - Math.sign(wheel) * Math.min(Math.abs(wheel), dt / EASE);
      send('helm', wheel);
      if (began === null) return false;
      const since = t - began, T = since + LEG * leg;
      // the gusts push the bow off (a rate, as the helm's: the lead's push)
      helm.set({ push: A * (0.6 * Math.sin(2 * Math.PI * T / 7) + 0.4 * Math.sin(2 * Math.PI * T / 2.9 + 1)) * 0.8 });
      const was = luff;
      luff = clamp((Math.abs(s.arrow) - LUFF_FROM) / LUFF_SPAN);
      if (was <= 0.5 && luff > 0.5) g.sound.rigging();
      if (s.in) steadyFor += dt;
      tick += dt;
      while (tick >= 0.25) {
        tick -= 0.25;
        ticks.push(s.in ? 1 : 0);
        if (ticks.length > SAMPLES) ticks.shift();
        opts.onSteady?.(ticks.reduce((a, v) => a + v, 0) / ticks.length);
      }
      send('heading', s.arrow);
      send('luff', luff);
      mg.plate.set({ fill: since / LEG, glow: s.in ? 'good' : 'bad' });
      return since >= LEG;
    });
    if (!done) return kurs.skipped;
    const steady = clamp(steadyFor / LEG);
    await mg.end({ as: steady >= 0.6 ? 'clean' : 'flawed' });
    return { steady };
  },
};

export default kurs;
