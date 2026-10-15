// «Ванты» (II, the deck): the boy climbs the shrouds. The scene «Палуба» (beat `shrouds`, the insert `ropes`) shows
// it all; this moves its keys: hand_l / hand_r (1 — the hand grips, the default; 0 — lifted), climb (0…1), slip (a
// pulse), roll (the ship's heel, which the insert's horizon follows). One mark at a time, on one hand and then the
// other (ropes#left, ropes#right): held, that hand is lifted, and a short fill grows; let go full — it grips higher
// (climb + 1/12), the mark goes to the other hand; let go before — it grips where it was. The heel is the mark's arc
// of danger: a hand up while the ship heels hard (|roll| > 0.6) longer than 0.25 s — the hands slip (climb − 2/12).
//   → { slips, seconds }
import { until } from '../hands.js';

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const STEP = 1 / 12; // a regrip
const FALL = 2 / 12; // a slip
const EASE = STEP / 0.4; // climb per second while it moves to its target
const HELD = 0.3; // s a hand must be up for the regrip
const HEEL = 0.6; // |roll| above which a lifted hand is a danger
const GRACE = 0.25; // s of a hand up in the heel before it slips
const SIDES = [{ key: 'hand_l', at: 'ropes#left' }, { key: 'hand_r', at: 'ropes#right' }];

export default {
  title: 'Ванты', // (as the author's ☰ lists it)
  about: 40,
  skipped: { slips: 1, seconds: 0 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: 'Ванты уходили в небо, и палуба кренилась под ногами' });
    const tension = mg.layer('tension');
    let target = 0, shown = 0, slips = 0, side = 0, bad = 0, spent = false, warned = false, wind = -1, sentRoll = 0, sentClimb = 0;
    SIDES.forEach(s => g.set(s.key, 1));
    g.set('climb', 0);
    g.set('roll', 0);
    let mark = null, hold = null;
    // the hand that climbs now: its mark, its hold
    const take = () => {
      mark?.remove();
      const s = SIDES[side];
      mark = mg.mark({ at: s.at, kind: 'groove' });
      hold = mg.hold({ on: mark, seconds: HELD, drain: 0.2 });
      hold.on('down', () => { spent = false; bad = 0; g.set(s.key, 0); });
      hold.on('up', () => {
        g.set(s.key, 1);
        if (spent) return;
        if (hold.state.fill < 1) return;
        target = Math.min(1, target + STEP);
        mg.snap({ at: mark });
        side = 1 - side;
        take();
      });
    };
    take();
    b.minigame.tricks.teach(mg, [hold], { id: 'hold' });
    const slip = () => {
      slips++;
      spent = true;
      g.set(SIDES[side].key, 1);
      hold.set({ fill: 0 });
      target = Math.max(0, target - FALL);
      g.set('slip', 1);
      g.set('slip', 0, 0.8);
      g.sound.burn();
      mg.error('danger', { at: mark });
    };
    const t0 = mg.t;
    const done = await until(mg, ({ t, dt }) => {
      const since = t - t0, roll = 0.8 * Math.sin((2 * Math.PI * since) / 6), heel = Math.abs(roll);
      if (heel > HEEL && !warned) g.sound.rigging();
      warned = heel > HEEL;
      if (Math.abs(roll - sentRoll) > 0.01) { sentRoll = roll; g.set('roll', roll); }
      const level = clamp((heel - 0.25) / (HEEL - 0.25));
      mark.set({ danger: level });
      const up = hold.state.held && !spent;
      tension.set({ u: up ? level : 0 });
      if (up && heel > HEEL) { bad += dt; if (bad > GRACE) slip(); }
      const step = EASE * dt;
      shown = Math.abs(target - shown) <= step ? target : shown + Math.sign(target - shown) * step;
      if (Math.abs(shown - sentClimb) > 0.01 || (shown === target && shown !== sentClimb)) { sentClimb = shown; g.set('climb', shown); }
      const w = 0.3 + 0.5 * shown;
      if (Math.abs(w - wind) > 0.01) { wind = w; g.sound.wind(w, 0.5); }
      mg.plate.set({ fill: shown, glow: up && level >= 1 ? 'bad' : up ? 'good' : 'idle' });
      return shown >= 1;
    });
    if (!done) return this.skipped;
    const seconds = Math.round(mg.t - t0);
    await mg.end({ as: slips ? 'flawed' : 'clean' });
    return { slips, seconds };
  },
};
