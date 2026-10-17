// “On Tiptoe” (II.6, the Home, after the beat `sneak`; game.md §7): a rhythm — its beats the wall clock's ticks, one in 1.0 s (a tick on each);
// the beat's sign, not touched, on `clock#face`; the touch — anywhere (the beat's window ±220 ms). A touch on the beat — a step: the aim `sneak`
// = min(`sneak` + 0.1, `sneak_at` + 0.12) (no further ahead than they manage to get; the scene leads them both in the gait
// `tiptoe` and tells where they are — `sneak_at`). Off the beat — a mistake (early / late), a floorboard creaks, Sarafanov
// stirs: `stir` += 0.3 (falling 0.1 a second), at `stir` ≥ 0.6 — a cough behind the wall; counted in `creaks`. The end —
// at the door (`sneak_at` ≥ 0.98): clean / flawed.
//   Feeling: creeping out of a stranger's house at dawn; wants to leave without waking anyone; ashamed; the player — a step in time, the breath held.
//   → { creaks }
import { until, keys } from '../hands.js';

const BPM = 60; // the wall clock's tick — one in 1.0 s
const WINDOW = 0.22; // s: the beat's window
const STEP = 0.1, AHEAD = 0.12;
const STIR = 0.3, CALM = 0.1, COUGH = 0.6;
const DOOR = 0.98;

export default {
  title: 'On Tiptoe', // (as the author's ☰ lists it)
  about: 15,
  skipped: { creaks: 0 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: tr('Old floorboards. The wall clock\'s ticking fills the kitchen') });
    const send = keys(g);
    const clock = mg.mark({ at: 'clock#face', kind: 'light' });
    const beat = mg.rhythm({ on: null, show: [clock], bpm: BPM, window: WINDOW });
    b.minigame.tricks.teach(mg, [beat], { id: 'rhythm' });
    let sneak = Math.max(0, +g.get('sneak') || 0), stir = 0, creaks = 0, last = -1;
    beat.on('beat', () => g.sound.tick());
    beat.on('tap', ({ k, off, hit }) => {
      if (hit) {
        if (k === last) return; // (a beat counted once)
        last = k;
        const at = +g.get('sneak_at') || 0;
        sneak = Math.min(1, sneak + STEP, at + AHEAD);
        send('sneak', sneak);
        return;
      }
      mg.error(off < 0 ? 'early' : 'timing', {});
      g.sound.creak();
      creaks++;
      stir = Math.min(1, stir + STIR);
      if (stir >= COUGH) g.sound.cough();
    });
    const done = await until(mg, ({ dt }) => {
      stir = Math.max(0, stir - CALM * dt);
      send('stir', stir);
      const at = +g.get('sneak_at') || 0;
      mg.plate.set({ fill: at, glow: stir >= COUGH ? 'bad' : 'idle' });
      return at >= DOOR;
    });
    if (!done) return this.skipped;
    send('stir', 0);
    await mg.end({ as: creaks ? 'flawed' : 'clean' });
    return { creaks };
  },
};
