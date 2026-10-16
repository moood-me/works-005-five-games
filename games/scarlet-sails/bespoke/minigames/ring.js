// «The ring» (the wood, the beat `ring`): Gray on his knees, the ring in his fingers; he puts it on the sleeping Assol's finger. A groove on
// his hand with the ring (`grey#ring`): while it is held, the fill grows — the hand reaches out, the scene shows it by the key `ring_at`.
// The sleeping girl stirs (`stir`) — that is the danger arc on the mark: while it is held she stirs more and more, while not —
// she calms down, and now and then she sighs. Reached the edge under the finger — she has almost woken: the hand draws back, and one must
// keep still till her breathing evens out (no holding for a second). When `ring_at` has reached 1, the scene tells `ring:on` —
// that is the end. Her breathing is heard (the thing's sound).
// → { on: true, stirs: how many times she almost woke, seconds: from the start to the end }
import { until, keys } from '../hands.js';

const REACH = 0.11; // ring_at a second, while it is held
const SPOOK = 0.25; // stir a second, while it is held
const CALM = 0.35; // stir a second, while it is not
const SIGH = [4, 7]; // a sigh once in so many seconds
const SIGH_BY = 0.3; // how much a sigh adds to stir
const WAKING_STIR = 0.6; // stir after «she almost woke»
const RECOIL = 0.15; // how far the hand draws back
const STILL = 1; // seconds after that with no holding
const ON_WITHIN = 3000; // how long to wait for the scene's `ring:on`, ms
const BREATH = [0.2, 0.8]; // the breathing: g.sound.breath(BREATH[0] + BREATH[1] * stir, 0.2)

export default {
  title: 'The ring', // (as the author's ☰ lists it)
  about: 25,
  skipped: { on: false, stirs: 0, seconds: 0 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: tr('She slept lightly, as children sleep') });
    const send = keys(g), tension = mg.layer('tension');
    const mark = mg.mark({ at: 'grey#ring', kind: 'groove' });
    const hold = mg.hold({ on: mark, seconds: 1 / REACH, drain: 0 });
    hold.set({ fill: Math.min(1, +b.get('ring_at') || 0) });
    b.minigame.tricks.teach(mg, [hold], { id: 'hold' });
    signal.addEventListener('abort', () => g.sound.breath(BREATH[0], 0.5)); // (the bed as the chapter set it before)
    let stir = 0, stirs = 0, still = 0, frozen = 0, sigh = mg.t + SIGH[0] + (SIGH[1] - SIGH[0]) * Math.random();
    const t0 = mg.t;
    const done = await until(mg, ({ t, dt }) => {
      const held = hold.state.held;
      // (still: the hand must not go on — what is held stands where it is)
      if (still > 0) { still = Math.max(0, still - dt); hold.set({ fill: frozen }); }
      const reaching = held && still === 0;
      stir = Math.max(0, Math.min(1, stir + (reaching ? SPOOK : -CALM) * dt));
      if (t > sigh) {
        stir = Math.min(1, stir + SIGH_BY);
        sigh = t + SIGH[0] + (SIGH[1] - SIGH[0]) * Math.random();
      }
      if (reaching && stir >= 1 && hold.state.fill < 1) { // she is almost awake: the hand draws back, and must be still
        frozen = Math.max(0, hold.state.fill - RECOIL);
        hold.set({ fill: frozen });
        stir = WAKING_STIR;
        still = STILL;
        stirs++;
        mg.error('danger', { at: mark });
      }
      mark.set({ danger: stir });
      tension.set({ u: held ? stir : 0 });
      g.sound.breath(BREATH[0] + BREATH[1] * stir, 0.2);
      if (hold.state.fill < 1) send('ring_at', hold.state.fill); // (the 1 — once its tell is waited for)
      send('stir', stir);
      mg.plate.set({ fill: hold.state.fill, glow: stir > 0.7 && held ? 'bad' : reaching ? 'good' : 'idle' });
      return hold.state.fill >= 1;
    });
    if (!done) return this.skipped;
    const on = g.told('ring:on', ON_WITHIN); // (asked before its cause)
    g.set('ring_at', 1);
    mg.snap({ at: mark });
    const heard = await on;
    if (signal.aborted) return this.skipped;
    const seconds = Math.round(mg.t - t0);
    await mg.end({ as: stirs ? 'flawed' : 'clean' });
    return { on: heard, stirs, seconds };
  },
};
