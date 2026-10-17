// “The Rucksack” (IV.1, the Platform, after the beat `strap`; the insert `strap` open, the carriage doors behind it open; game.md §7):
// a ring with a groove on `strap#grip`, held; the arc of danger — how Vasenka pulls (`pull`). He pulls: `pull` grows
// 0.12 a second and by jerks of +0.15 every 2–3 s. Held — the fist clenched (`grip` 1), `pull` −0.2 a second (not below 0);
// let go — `grip` 0, `pull` +0.25 a second. `pull` 1 — torn free: a mistake (jerked away), counted in `slips`, `pull` 0.6, the fist
// clenched again for 1 s (caught). After 22 s — the scene goes its own way: the doors hiss and shut (`door_bg` → 1 over 1.5 s),
// the strap goes slack (`pull` → 0 over 1 s), the end (clean / flawed).
//   Feeling: holding the younger one by his rucksack while saying “I'm not holding you”; wants him not to leave; funny and painful; the player — “I'm not
//   holding you” — and holding.
//   → { slips }
import { until, keys } from '../hands.js';

const PULL = 0.12, JERK = 0.15; // a second; a jerk
const JERK_EVERY = [2, 3]; // s between jerks
const HELD = -0.2, LOOSE = 0.25; // a second: held; let go
const CAUGHT = 1; // s — caught again
const DOORS = 22; // s — the doors shut

export default {
  title: 'The Rucksack', // (as the author's ☰ lists it)
  about: 25,
  skipped: { slips: 0 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: tr('The carriage doors are open. Vasenka pulls the rucksack his way') });
    const send = keys(g), acts = new Set();
    const move = (key, value, over) => { const a = b.act('state', 'move', key, value, { over }); acts.add(a); return a; };
    signal.addEventListener('abort', () => { for (const a of acts) a.cancel?.(); });
    const grip = mg.mark({ at: 'strap#grip', kind: 'groove', danger: 0 });
    const hold = mg.hold({ on: grip, seconds: 0.4, drain: 0.3 });
    b.minigame.tricks.teach(mg, [hold], { id: 'hold' });
    let pull = 0, touched = false, slips = 0, jerkAt = JERK_EVERY[0], caughtTill = -1;
    send('door_bg', 0);
    const done = await until(mg, ({ t, dt }) => {
      const held = hold.state.held || t < caughtTill;
      if (held) touched = true;
      // (till the first touch he pulls by himself; then — held or let go)
      pull += (held ? HELD : touched ? LOOSE : PULL) * dt;
      if (t >= jerkAt) { pull += JERK; jerkAt = t + JERK_EVERY[0] + Math.random() * (JERK_EVERY[1] - JERK_EVERY[0]); }
      pull = Math.max(0, pull);
      if (pull >= 1) {
        slips++;
        mg.error('jerk', { at: grip });
        pull = 0.6;
        caughtTill = t + CAUGHT;
      }
      send('pull', pull);
      send('grip', held ? 1 : 0);
      grip.set({ danger: Math.min(1, pull) });
      mg.plate.set({ fill: Math.min(1, t / DOORS), glow: held ? 'good' : 'bad' });
      return t >= DOORS;
    });
    if (!done) return this.skipped;
    g.sound.doors();
    move('door_bg', 1, 1.5);
    move('pull', 0, 1);
    send('grip', 1);
    await mg.end({ as: slips ? 'flawed' : 'clean' });
    return { slips };
  },
};
