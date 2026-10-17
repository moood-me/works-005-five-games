// "Pull Him Out" (II.3, the booth in smoke, after the beat `smoke_in`; the shot FLOOR): the boy drags Alfredo along the floor to the door.
// Pull against resistance: a ring on the boy's hands (`toto#hand_r`), the way — from the projector (`floor#path0`) to the door
// (`floor#path1`), down the frame; Alfredo follows the finger heavily (the pull is the language's); `drag` — where he is on the way,
// the scene leads the two and says where they are now (`drag_at`). The breath: pulling longer than 3 s on end — a cough: the mistake "slipped",
// `cough` 1 (the boy straightens up), Alfredo slides back by 0.05, a second when pulling is not taken. Let go and took hold again —
// a breath taken, no mistake. The end — at the door (`drag` 1 and `drag_at` ≥ 0.97).
//   The feeling: the boy drags Alfredo out of the smoke; he wants to save him; fear and stubbornness; the player — effort and breath.
//   → {} (the cough costs only seconds; what the hands give — that Alfredo is alive)
import { until, keys } from '../hands.js';

const BREATH = 3; // s: pulling on end while the air lasts
const SLIDE = 0.05; // how far he slides back at a cough
const STILL = 1; // s after the cough — no pulling
const STAND = 0.6; // s: the boy straightens up (cough 1)
const SHUFFLE = 0.1; // a rustle on the boards — at every such share of the way
const AT_DOOR = 0.97;

export default {
  file: 'pull-out',
  title: 'Pull Him Out', // as the author's map lists it
  about: 18,
  skipped: {},
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: tr('Smoke hangs under the ceiling. Near the floor you can still breathe — not for long') });
    const send = keys(g);
    const hands = mg.mark({ at: 'toto#hand_r', kind: 'dash' });
    const pull = mg.pull({ on: hands, to: 'floor#path1', heavy: true });
    b.minigame.tricks.teach(mg, [pull], { id: 'pull:heavy' });
    let drag = clamp(+g.get('drag') || 0), held = 0, frozenTill = -1, frozen = drag, standTill = -1, shuffled = drag;
    pull.set({ u: drag });
    pull.on('up', () => { held = 0; });
    const done = await until(mg, ({ t, dt }) => {
      const s = pull.state;
      if (t < frozenTill) pull.set({ u: frozen });
      else if (s.held) {
        held += dt;
        if (held > BREATH) {
          // the cough
          held = 0;
          frozen = Math.max(0, s.u - SLIDE);
          pull.set({ u: frozen });
          frozenTill = t + STILL;
          standTill = t + STAND;
          send('cough', 1);
          g.sound.cough();
          mg.error('jerk', { at: pull });
        }
      }
      if (t >= standTill) send('cough', 0);
      drag = pull.state.u;
      send('drag', drag);
      if (drag - shuffled >= SHUFFLE) { shuffled = drag; g.sound.drag(); } else if (drag < shuffled) shuffled = drag;
      mg.plate.set({ fill: drag, glow: t < frozenTill ? 'bad' : s.held ? 'good' : 'idle' });
      return drag >= 1 && (+g.get('drag_at') || 0) >= AT_DOOR;
    });
    if (!done) return this.skipped;
    send('cough', 0);
    mg.snap({ at: hands });
    await mg.end({ as: 'clean' });
    return {};
  },
};
function clamp(v, a = 0, b = 1) { return Math.min(b, Math.max(a, v)); }
