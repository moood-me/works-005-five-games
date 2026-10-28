// «The elephant» (I.4, the jungle, the beat `ride`; the frame rides on the elephant from the side, the trail runs by):
// Kiouni goes at his own pace. A rhythm on the ring on his head — the beat of Kiouni's step (`kiouni#head`): on the
// beat — the step steadier, `pace` grows up to STEADY; off the beat or a beat missed — the step drags (no lower than
// SLOW). The goad — hold the groove on `guide#hands` (the guide raises the goad, `goad` 1): `pace` 1, the beat quicker,
// but the elephant grows angry — the danger arc on the goad; full — Kiouni stops dead (`balk` → 1, `pace` 0, the goad
// drops from the hands) and stands his ground STAND s. Then a ring on the trunk `kiouni#trunk`: pressed — Passepartout
// gives him sugar (`sugar` a rise to 1), the elephant calms down and goes on, at his slowest step. The way `ride` 0 → 1 at a speed by `pace`; the outcome — hours
// against the timetable by the time the way took.
//   What it does: Kiouni carries the travellers through the forest to Allahabad; Fogg, Passepartout and Cromarty sway
//     in the howdah.
//   What they want: to get there by nightfall — every hour of forest costs an hour in the notebook.
//   How it is for them: heat, swaying; the elephant is alive and wilful, you cannot wind him up like an engine.
//   What the player feels: patience with a living thing — to go in step with him; drive him, and he stops.
//   → { hours: how many hours gained (+) or lost (−) against the timetable, −2…+2 }
import { until, shown, keys } from '../hands.js';

const BPM = 48, BPM_GOAD = 64; // Kiouni's step; under the goad
const SLOW = 0.3, STEADY = 0.6, START = 0.4; // pace: the slowest step; steady, on the beat; at the start
const HIT = 0.1, MISS = 0.08, LAPSE = 0.05; // pace: for a beat in time; for a touch off the beat; for a beat missed
const PATH = 36; // s: the way at a steady step (STEADY) — on time
const HOUR = 6; // s of the way — an hour in the notebook
const ANGER = 0.35, CALM = 0.2; // a second: the anger under the goad; it cools without it
const BALK_IN = 0.6, STAND = 4, SUGAR_OUT = 1.2; // s: he stops; stands his ground before sugar will do; he calms down
const EASE = 1.5; // a second: pace goes to its aim
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export default {
  file: 'elephant',
  title: tr('The elephant'), // (as the author's map lists it)
  about: 38,
  skipped: { hours: 0 }, // in step, no goad — on time
  async run(g, b, opts, signal) {
    const PHRASE = tr('Kiouni goes at his own pace. The howdah sways; forest all the way to Allahabad');
    const mg = g.minigame({ phrase: PHRASE });
    const send = keys(g), acts = new Set();
    const move = (key, value, over) => { const a = b.act('state', 'move', key, value, { over }); acts.add(a); return a; };
    signal.addEventListener('abort', () => { for (const a of acts) a.cancel?.(); });
    send('ride', 0); send('pace', START); send('goad', 0); send('balk', 0); send('sugar', 0);
    // the step: the beat on the elephant's head, a touch anywhere
    const head = mg.mark({ at: 'kiouni#head', kind: 'ring' });
    // (on the ring itself: a touch there is the step's, not the goad's beside it)
    const step = mg.rhythm({ on: head, bpm: BPM });
    // the goad
    const hook = mg.mark({ at: 'guide#hands', kind: 'groove', quiet: true, danger: 0 });
    const goad = mg.hold({ on: hook, seconds: 0.3, drain: 0.3 });
    // (the ghost shows it; the time runs from the player's first touch)
    if (!(await shown(b, mg, [step]))) return this.skipped;
    let steady = START, pace = START, ride = 0, anger = 0, balked = false, balks = 0, tapped = true, bpm = BPM;
    let sugar = null, sugarPress = null, sugarOff = -1, t0 = mg.t;
    step.on('tap', ({ hit }) => {
      tapped = true;
      if (balked || goad.state.held) return; // under the goad and standing — no time for the step
      if (hit) steady = Math.min(STEADY, steady + HIT);
      else { steady = Math.max(SLOW, steady - MISS); mg.error('timing', { at: head }); }
    });
    step.on('beat', () => {
      if (!tapped && !balked && !goad.state.held) steady = Math.max(SLOW, steady - LAPSE);
      tapped = false;
    });
    const balk = async () => {
      balked = true;
      balks++;
      goad.set({ fill: 0 });
      send('goad', 0);
      move('balk', 1, BALK_IN);
      mg.error('danger', { at: hook });
      mg.plate.set({ phrase: tr('Kiouni has stopped in the middle of the path, ears spread wide. The goad will settle nothing here') });
      const t1 = mg.t;
      if (!(await until(mg, ({ t }) => t - t1 >= STAND))) return;
      sugar = mg.mark({ at: 'kiouni#trunk', kind: 'ring' });
      sugarPress = mg.press({ on: sugar });
      b.minigame.tricks.teach(mg, [sugarPress]);
      sugarPress.on('press', () => {
        send('sugar', 1);
        mg.snap({ at: sugar });
        sugar.remove();
        sugar = null;
        move('balk', 0, SUGAR_OUT);
        anger = 0;
        steady = SLOW;
        sugarOff = mg.t + 0.6;
        balked = false;
        mg.plate.set({ phrase: PHRASE });
      });
    };
    const done = await until(mg, ({ t, dt }) => {
      if (sugarOff >= 0 && t >= sugarOff) { sugarOff = -1; send('sugar', 0); }
      const goading = !balked && goad.state.held && goad.state.fill >= 1;
      send('goad', goading ? 1 : 0);
      if (balked) goad.set({ fill: 0 });
      anger = clamp(anger + (goading ? ANGER : -CALM) * dt);
      hook.set({ danger: anger });
      if (goading && anger >= 1) balk();
      const want = balked ? 0 : goading ? 1 : steady;
      pace += clamp(want - pace, -EASE * dt, EASE * dt);
      send('pace', pace);
      const nb = goading ? BPM_GOAD : BPM;
      if (nb !== bpm) { bpm = nb; step.set({ bpm }); }
      ride = clamp(ride + (dt * pace) / (STEADY * PATH));
      send('ride', ride);
      mg.plate.set({ fill: ride, glow: balked ? 'bad' : goading ? 'good' : pace >= STEADY - 0.05 ? 'good' : 'idle' });
      return ride >= 1;
    });
    if (!done) return this.skipped;
    const seconds = mg.t - t0;
    mg.snap({ at: head });
    const hours = clamp(Math.round((PATH - seconds) / HOUR), -2, 2) || 0;
    await mg.end({ as: balks || hours < 0 ? 'flawed' : 'clean' });
    return { hours };
  },
};
