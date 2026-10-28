// "Changeover" (IV.2, the booth, after the beat `changeover`; the shot PORTS): Toto changes the reels all evening and waits for Elena. Three changeovers;
// they switch to the projector that stands (`to`: 2, 1, 2 — 1 the element `projector`, 2 — `projector2`); the other has no marks.
// A wait of 6 s: the clock goes (`clock` 6 + k in 2 s); at the second — steps on the stair, passing. The first dot: `cue` 1 for 0.8 s
// (the look port blinks), a tick; a ring on the standing one's `#motor` with an arc of time 2.5 s — pressed: the motor (`motor{to}` 1).
// 3 s later — the second dot, a higher tick; a ring on `#lever`, the arc 2 s — pressed: switched (`active` to, `motor{from}` 0).
// The arc ran out — "fell behind", `missed` + 1, the ring waits (at the lever — the screen goes white, the hall whistles till they switch).
//   The feeling: Toto works and waits for Elena; he wants to miss neither a changeover nor her steps; unease; the player — to work while waiting.
//   → { missed: how many dots were missed (≥ 1 — Alfredo heard the whistling: L129) }
import { until, keys } from '../hands.js';

const TO = [2, 1, 2];
const WAIT = 6, CLOCK = 2; // s: the wait; the clock moves on
const CUE = 0.8; // s: the dot blinks
const MOTOR_TIME = 2.5, LEVER_TIME = 2, GAP = 3; // s
const STEPS = 2 * TO.length;
const el = n => (n === 1 ? 'projector' : 'projector2');

export default {
  file: 'changeover',
  title: 'Changeover', // as the author's map lists it
  about: 38,
  skipped: { missed: 0 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: tr('The reel is running out. Before its end a dot blinks in the corner of the frame, then a second') });
    const send = keys(g), acts = new Set();
    const move = (key, value, over) => { const a = b.act('state', 'move', key, value, { over }); acts.add(a); return a; };
    signal.addEventListener('abort', () => { for (const a of acts) a.cancel(); });
    mg.plate.set({ notches: Array.from({ length: STEPS - 1 }, (_, i) => (i + 1) / STEPS) });
    send('clock', 6); send('motor1', 1); send('motor2', 0); send('active', 1); send('white', 0); send('cue', 0);
    let missed = 0, step = 0;
    const wait = async s => { const t1 = mg.t; return until(mg, ({ t }) => { mg.plate.set({ fill: step / STEPS, glow: 'idle' }); return t - t1 >= s; }); };
    // one dot: the port blinked, a ring with an arc of time on the handle; → pressed (true) or the minigame left (false)
    const point = async (ref, seconds, sound, late) => {
      send('cue', 1);
      g.sound[sound]();
      const t1 = mg.t;
      const ring = mg.mark({ at: ref, kind: 'ring', time: 1 });
      const press = mg.press({ on: ring });
      if (step === 0) b.minigame.tricks.teach(mg, [press], { id: 'press', still: null });
      let pressed = false, over = false;
      press.on('press', () => { pressed = true; });
      const ok = await until(mg, ({ t }) => {
        const left = Math.max(0, 1 - (t - t1) / seconds);
        if (t - t1 >= CUE) send('cue', 0);
        ring.set({ time: over ? 0 : left });
        if (!over && left <= 0 && !pressed) { over = true; missed++; mg.error('behind', { at: ring }); late?.(); }
        mg.plate.set({ fill: step / STEPS, glow: over ? 'bad' : 'idle' });
        return pressed;
      });
      send('cue', 0);
      if (!ok) return false;
      mg.snap({ at: ring });
      ring.remove();
      step++;
      return true;
    };
    for (let k = 1; k <= TO.length; k++) {
      const to = TO[k - 1], from = to === 1 ? 2 : 1;
      move('clock', 6 + k, CLOCK);
      if (k === 2) g.sound.steps();
      if (!(await wait(WAIT))) return this.skipped;
      // the standing one's motor
      if (!(await point(`${el(to)}#motor`, MOTOR_TIME, 'tick'))) return this.skipped;
      send(`motor${to}`, 1);
      g.sound.motor();
      if (!(await wait(GAP))) return this.skipped;
      // the lever: switch over
      let white = false;
      const switched = await point(`${el(to)}#lever`, LEVER_TIME, 'tick2', () => { white = true; send('white', 1); g.sound.whistle(); });
      if (!switched) return this.skipped;
      send('active', to);
      send(`motor${from}`, 0);
      if (white) send('white', 0);
      g.sound.clunk();
    }
    move('clock', 10, CLOCK);
    if (!(await wait(CLOCK))) return this.skipped;
    await mg.end({ as: missed ? 'flawed' : 'clean' });
    return { missed };
  },
};
