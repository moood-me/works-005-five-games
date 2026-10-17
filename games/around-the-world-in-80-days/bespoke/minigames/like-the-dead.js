// «Like the dead» (I.5 «at night», the jungle, the beat `walk`; dawn, the crowd face down by the pyre): the «rajah» —
// Passepartout — carries Aouda from the pyre to the trees. Lead anywhere: the arrow — his step (−1 slow … +1 running),
// the zone — the solemn step of a dead man in the middle. Without a finger the step itself now breaks forward, now
// freezes (nerves: `push`); the finger steers it (`steer: 'rate'`). The way `walk` 0 → 1 at a speed by the step. Faster
// than the zone — the crowd raises its heads (`heads` grows; once at 1 — he is known: an alarm, a chase — an hour; the
// heads bow again). The pyre's smoke (`smoke`) thins by itself with every second, slower than the zone — faster still;
// the smoke gone and he not yet at the trees — he is seen: an alarm (once). At the trees — the end.
//   What he does: Passepartout, in the dead rajah's shroud, comes down from the pyre with the widow in his arms and walks
//     through the crowd.
//   What he wants: to carry her to the trees while they take him for one risen from the dead.
//   How it is for him: daring held down to a walk; his heart pounds, his legs ask to run.
//   What the player feels: holding oneself back — not to break into a run and not to linger.
//   → { hours: 0…−2 — an hour for each alarm (the chase) }
import { until, keys } from '../hands.js';

const PATH = 22; // s: the way at a steady step
const SPEED = 0.7; // the step ±1 — the way's speed × (1 ± SPEED)
const ZONE = 0.5; // the width of the step's zone
const HEADS_UP = 0.8, HEADS_DOWN = 0.35; // a second: the heads rise (at a full run) and bow
const ALARM_HOLD = 1.2, HEADS_BACK = 0.2; // s: the heads raised after an alarm; where they bow to then
const SMOKE0 = 0.9, SMOKE_FADE = 0.026, SMOKE_SLOW = 0.03, SMOKE_GONE = 0.12; // the smoke: at the start; thins a second; more — lingering; «gone»
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
// (nerves: the step breaks forward oftener than it freezes; no stronger than a finger can hold)
const nerves = t => 0.12 + 0.18 * Math.sin(0.8 * t) + 0.06 * Math.sin(2.3 * t + 1);

export default {
  file: 'like-the-dead',
  title: 'Like the dead', // (as the author's ☰ lists it)
  about: 24,
  skipped: { hours: 0 },
  async run(g, b, opts, signal) {
    const PHRASE = tr('The crowd lies face down. The dead rajah comes down from the pyre with the widow in his arms');
    const mg = g.minigame({ phrase: PHRASE });
    const send = keys(g);
    const lead = mg.lead({ zone: { at: 0, width: ZONE }, steer: 'rate', release: 'stay', push: nerves(0) });
    b.minigame.tricks.teach(mg, [lead], { id: 'lead' });
    let walk = clamp(+g.get('walk') || 0), heads = 0, smoke = SMOKE0, alarms = 0, upTill = -1, smokeAlarm = false, phrase = PHRASE;
    const put = p => { if (p !== phrase) { phrase = p; mg.plate.set({ phrase: p }); } };
    send('heads', 0);
    send('smoke', smoke);
    const t0 = mg.t;
    const done = await until(mg, ({ t, dt }) => {
      const now = t - t0;
      lead.set({ push: nerves(now) });
      const a = lead.state.arrow, fast = a > ZONE / 2, slow = a < -ZONE / 2;
      walk = clamp(walk + (dt / PATH) * (1 + SPEED * a));
      send('walk', walk);
      // faster than the zone — the heads rise
      if (upTill >= 0) {
        // known: the heads raised, then they bow again
        if (now >= upTill) { upTill = -1; heads = HEADS_BACK; } else heads = 1;
      } else {
        if (fast) heads = clamp(heads + HEADS_UP * dt * (0.4 + (0.6 * (a - ZONE / 2)) / (1 - ZONE / 2)));
        else heads = Math.max(0, heads - HEADS_DOWN * dt);
        if (heads >= 1) {
          alarms++;
          upTill = now + ALARM_HOLD;
          mg.error('danger', { chip: true });
        }
      }
      send('heads', heads);
      // the smoke thins; lingering — faster
      smoke = Math.max(SMOKE_GONE, smoke - (SMOKE_FADE + (slow ? SMOKE_SLOW : 0)) * dt);
      send('smoke', smoke);
      if (!smokeAlarm && smoke <= SMOKE_GONE && walk < 1) { smokeAlarm = true; alarms++; mg.error('behind', { chip: true }); }
      put(heads > 0.5 ? tr('Heads rise from the ground, one after another') : smoke < 0.35 && !smokeAlarm ? tr('The smoke over the pyre is thinning') : PHRASE);
      mg.plate.set({ fill: walk, glow: fast || slow ? 'bad' : lead.state.held ? 'good' : 'idle' });
      return walk >= 1;
    });
    if (!done) return this.skipped;
    await mg.end({ as: alarms ? 'flawed' : 'clean' });
    return { hours: -Math.min(2, alarms) || 0 };
  },
};
