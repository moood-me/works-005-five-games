// "Peeking" (I.1, the hall, after the beat `peek`; the shot CURTAIN): the boy behind the curtain at the side door, in the fifth row
// Father Adelfio watches the film alone. Hold anywhere (the fill and the arc — at the curtain's gap `curtain#gap`): held — the boy
// peeks out (`peek` toward 1 at 2 a second), let go — he hides (toward 0 at 3 a second). The film runs by itself: three kisses at
// the 6th, the 15th, the 24th second — `screen_film` romance_kiss, 1.2 s later the bell (`bell` 1, the scene plays bell_ring), 0.8 s
// later `bell` 0 and romance again; peeking at a ring — he saw it (`seen`). Twice in the film the priest looks round at the
// curtain (`turn`), his seat creaking 0.8 s before: the arc of danger; peeking while he looks — caught.
//   The feeling: the boy peeks from behind the curtain at what he mustn't see; he wants to see what the priest cuts;
//   frightening and funny; the player — an accomplice.
//   opts: { onFirstBell() — at the first ring (L04), not waited for; onCaught() — the first time he is caught (L05) }
//   → { seen: how many rings he saw (0…3), caught: how many times he was caught }
import { until, keys } from '../hands.js';

const KISSES = [6, 15, 24]; // s from the beginning: a kiss on the screen
const BELL = 1.2, BELL_OFF = 0.8; // s: the bell after the kiss; how long it rings
const TURNS = [[8, 12], [18, 22]]; // s: within these spans he looks round (the moment — at random)
const CREAK = 0.8, TURN_IN = 0.4, TURN_HOLD = 1.6, TURN_OUT = 0.4; // s
const FILM = 26; // s: the fill — the film's time
const AFTER = 2; // s after the third ring — the end
const BLOCK = 2; // s: caught — the hold is not taken
const PEEK = 0.5; // he peeks out when above this
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export default {
  file: 'podglyadyvat',
  title: 'Peeking', // as the author's ☰ lists it
  about: 28,
  skipped: { seen: 3, caught: 0 },
  async run(g, b, opts, signal) {
    const mg = g.minigame({ phrase: tr('Father Adelfio watches the film alone. Before he turns round, his seat creaks') });
    const send = keys(g);
    const gap = mg.mark({ at: 'curtain#gap', kind: 'groove' });
    // (held — he peeks out: the fill is `peek` itself — 2 a second there, 3 back)
    const hold = mg.hold({ on: null, show: gap, seconds: 0.5, drain: 1 / 3 });
    b.minigame.tricks.teach(mg, [hold], { id: 'hold:anywhere' });
    mg.plate.set({ notches: KISSES.map(k => (k + BELL) / FILM) });
    // when he looks round: the turn's beginning within its span
    const turns = TURNS.map(([a, z]) => a + CREAK + Math.random() * (z - a - CREAK));
    const turnAt = t => {
      for (const T of turns) {
        if (t >= T && t < T + TURN_IN) return (t - T) / TURN_IN;
        if (t >= T + TURN_IN && t < T + TURN_IN + TURN_HOLD) return 1;
        if (t >= T + TURN_IN + TURN_HOLD && t < T + TURN_IN + TURN_HOLD + TURN_OUT) return 1 - (t - T - TURN_IN - TURN_HOLD) / TURN_OUT;
      }
      return 0;
    };
    const dangerAt = t => {
      for (const T of turns) {
        if (t >= T - CREAK && t < T) return (t - T + CREAK) / CREAK;
        if (t >= T && t < T + TURN_IN + TURN_HOLD + TURN_OUT) return Math.max(0.15, turnAt(t));
      }
      return 0;
    };
    let seen = 0, caught = 0, toldCaught = false, blockedTill = -1;
    const fired = new Set(); // the film's events that have happened
    const once = (name, fn) => { if (!fired.has(name)) { fired.add(name); fn(); } };
    send('screen_film', 'romance');
    const t0 = mg.t;
    const done = await until(mg, ({ t: now }) => {
      const t = now - t0;
      // caught — the hold is not taken: the boy is behind the curtain
      if (t < blockedTill) hold.set({ fill: 0 });
      const peek = hold.state.fill;
      send('peek', peek);
      // the film: a kiss, the bell, the film again
      KISSES.forEach((K, i) => {
        if (t >= K) once(`kiss${i}`, () => send('screen_film', 'romance_kiss'));
        if (t >= K + BELL) once(`bell${i}`, () => {
          send('bell', 1);
          g.sound.bell();
          if (i === 0) opts.onFirstBell?.();
          if (peek > PEEK) { seen++; mg.snap({ at: gap }); }
        });
        if (t >= K + BELL + BELL_OFF) once(`off${i}`, () => { send('bell', 0); send('screen_film', 'romance'); });
      });
      // he looks round: the creak, the arc grows; held while he looks — caught
      turns.forEach((T, i) => {
        if (t >= T - CREAK) once(`creak${i}`, () => g.sound.creak());
        if (t >= T && t < T + TURN_IN + TURN_HOLD + TURN_OUT && turnAt(t) > 0.5 && peek > PEEK) once(`caught${i}`, () => {
          caught++;
          mg.error('danger', { at: gap });
          if (!toldCaught) { toldCaught = true; opts.onCaught?.(); }
          hold.set({ fill: 0 });
          blockedTill = t + BLOCK;
        });
      });
      const turn = turnAt(t), danger = dangerAt(t);
      send('turn', turn);
      gap.set({ danger });
      mg.plate.set({ fill: clamp(t / FILM), glow: danger > 0.5 && hold.state.held ? 'bad' : hold.state.held ? 'good' : 'idle' });
      return t >= KISSES[2] + BELL + AFTER;
    });
    if (!done) return this.skipped;
    await mg.end({ as: caught ? 'flawed' : 'clean' });
    return { seen, caught };
  },
};
