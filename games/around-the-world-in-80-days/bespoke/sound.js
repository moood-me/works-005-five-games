// The sounds of «Вокруг света за 80 дней», made in the page (Web Audio): nothing to load; as loud as the page's
// "sounds" slider says (MooodVolume.output). The page may be heard only after the player's first touch: game.js wakes
// it then. The frame (the airs, the beds, the struck things) is «Парадизо»'s; the sounds are this game's (game.md §9).
//   wake() — the page may be heard from now on (called on the first touch)
//   pause(on) — all of it stands while the play is paused (ui.js ⏸) and goes on from there after
//   unheard() → {sounds, wake()} — the same, unheard, for a step played unseen (jump.js); a step plays them as g.sound
// Two airs a sound goes out into: the open air ('square', 1.6 s) and a room ('booth', 0.4 s).
// The beds — what lasts; one of each for the page, as loud as `level`, getting there over `seconds`:
//   beds(levels, seconds) — the named beds to their levels, every other one to silence (g.beds)
//   clock — the leitmotif: Fogg's watch and Passepartout's ticking, the club's pendulum under them
//   wheels — the train on the rail joints · jungle — birds and leaves · elephant — Kiouni's footfall and the howdah
//   drums — drums at night, far · storm — a gale at sea · runners — the sledge on snow · fog — London in the fog
//   furnace — the «Henrietta»'s fire and engine · town — far voices, steps (a harbour, a street) · crowd — a crowd
//   close · sea — the sea at a quay or a ship's side · fire — a fire's roar and crackle · wind_cold — a thin cold wind
// Played once: motif() — the theme's first five notes on a celesta; trumpet · tock · cannon · shots · crack · splash ·
//   stamp · notes · hooves; and the frame's: bell · creak · click · clunk · tick · tick2 · laugh · roar · applause ·
//   whistle · whisper · coins · slap · flame · drag · cough · steps · door · trainHiss · trainWhistle · church · paper ·
//   puff · whistleBlow · blast
// Played till stopped — a handle {loud(v, seconds), stop(seconds)}: theme() — the game's own tune on strings

// THEME — the tune of «Вокруг света»: sixteen bars in 3/4, A♭ major (the world's key: A_FLAT_MAJOR_F_MINOR), ♩ = 120,
// light and going, a journey's step. Each bar: its notes [pitch, beats] and the chord held under it (lowest first).
// The motif is its first five notes (E♭ A♭ C E♭ D♭: a rise to the octave, a step back).
export const THEME = [
  { notes: [['Eb4', 1.5], ['Ab4', 0.5], ['C5', 1]], chord: ['Ab2', 'Eb3', 'C4', 'Eb4'] },
  { notes: [['Eb5', 2], ['Db5', 1]], chord: ['Db2', 'Ab2', 'F3', 'Ab3'] },
  { notes: [['C5', 1], ['Bb4', 1], ['Ab4', 1]], chord: ['Ab1', 'Eb2', 'C3', 'Eb3'] },
  { notes: [['Bb4', 3]], chord: ['Eb2', 'Bb2', 'Db3', 'G3'] },
  { notes: [['Eb4', 1.5], ['Ab4', 0.5], ['C5', 1]], chord: ['Ab2', 'Eb3', 'C4', 'Eb4'] },
  { notes: [['F5', 2], ['Eb5', 1]], chord: ['F2', 'C3', 'Ab3', 'C4'] },
  { notes: [['Db5', 1], ['C5', 1], ['Bb4', 1]], chord: ['Bb1', 'F2', 'Db3', 'F3'] },
  { notes: [['C5', 3]], chord: ['Ab1', 'Eb2', 'C3', 'Eb3'] },
  { notes: [['Db5', 1], ['Eb5', 1], ['F5', 1]], chord: ['Db2', 'Ab2', 'F3', 'Ab3'] },
  { notes: [['G5', 2], ['F5', 1]], chord: ['Eb2', 'Bb2', 'G3', 'Bb3'] },
  { notes: [['Eb5', 1], ['Db5', 1], ['C5', 1]], chord: ['F2', 'C3', 'Ab3', 'C4'] },
  { notes: [['Bb4', 3]], chord: ['Eb2', 'Bb2', 'Db3', 'G3'] },
  { notes: [['Ab4', 1.5], ['Bb4', 0.5], ['C5', 1]], chord: ['Db2', 'Ab2', 'F3', 'Ab3'] },
  { notes: [['Eb5', 2], ['C5', 1]], chord: ['Eb2', 'C3', 'Ab3', 'C4'] },
  { notes: [['Bb4', 1], ['Ab4', 1], ['G4', 1]], chord: ['Eb2', 'Bb2', 'Db3', 'G3'] },
  { notes: [['Ab4', 3]], chord: ['Ab1', 'Eb2', 'C3', 'Eb3'] },
];
const BEAT = 0.5, BAR = 3 * BEAT; // seconds
const ROUND = THEME.length + 2; // bars: the tune, and two of rest (the chord of E held) before it comes round
const MOTIF = THEME[0].notes.concat(THEME[1].notes).slice(0, 5); // G♯4 A4 B4 E5 D♯5, with their beats

let ctx = null, master = null, rooms = null, still = null, awake = false, held = false;
// a room's tail: decaying noise, low-passed by `dark` (0 bright … 1 dull)
function impulse(a, seconds, curve, dark) {
  const n = Math.floor(a.sampleRate * seconds), ir = a.createBuffer(2, n, a.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = ir.getChannelData(c);
    for (let i = 0, lp = 0; i < n; i++) {
      const k = 1 - dark * (0.2 + 0.75 * i / n);
      lp += ((Math.random() * 2 - 1) - lp) * k;
      d[i] = lp * Math.pow(1 - i / n, curve);
    }
  }
  return ir;
}
function audio() {
  if (!ctx) {
    ctx = new AudioContext();
    if (!awake) ctx.suspend();
    const limit = ctx.createDynamicsCompressor();
    limit.threshold.value = -12;
    limit.ratio.value = 4;
    master = ctx.createGain();
    master.gain.value = 0.85;
    master.connect(limit).connect(MooodVolume.output(ctx)).connect(ctx.destination);
    rooms = {};
    for (const [name, seconds, curve, dark, back] of [['square', 1.6, 2.4, 0.55, 0.8], ['booth', 0.4, 2, 0.35, 0.9]]) {
      const r = ctx.createConvolver(), g = ctx.createGain();
      r.buffer = impulse(ctx, seconds, curve, dark);
      g.gain.value = back;
      r.connect(g).connect(master);
      rooms[name] = r;
    }
    still = ctx.createGain();
    still.gain.value = 0;
    still.connect(master);
  }
  if (awake && !held && ctx.state === 'suspended') ctx.resume();
  return ctx;
}
export function wake() {
  awake = true;
  audio();
  for (const touch of ['pointerdown', 'keydown']) addEventListener(touch, audio, { once: true, capture: true });
}
export function pause(on) {
  held = !!on;
  if (!ctx || !awake) return;
  if (held) ctx.suspend();
  else ctx.resume();
}

// where a sound goes: straight out, and `wet` of it into a room's air ('square' — open, or 'booth' — a small room)
const airs = {};
function air(wet, room = 'square') {
  const k = `${room}:${wet}`;
  if (airs[k]) return airs[k];
  const a = audio(), out = a.createGain(), send = a.createGain();
  send.gain.value = wet;
  out.connect(master);
  out.connect(send).connect(rooms[room]);
  return (airs[k] = out);
}
// fn once `seconds` of the sounds' own time have gone by (it stands with them)
function after(seconds, fn) {
  const a = audio(), clock = a.createConstantSource();
  clock.connect(still);
  clock.onended = fn;
  clock.start();
  clock.stop(a.currentTime + seconds);
  return clock;
}
function setup(f, { type, frequency, Q = 1, gain = 0 }) {
  f.type = type;
  f.frequency.value = frequency;
  f.Q.value = Q;
  f.gain.value = gain;
  return f;
}
const filter = how => setup(audio().createBiquadFilter(), how);
function to(param, v, seconds) {
  const t = audio().currentTime;
  param.cancelScheduledValues(t);
  param.setValueAtTime(param.value, t);
  param.linearRampToValueAtTime(v, t + Math.max(0.02, seconds));
}
function shape(param, t, points, from = 0) {
  param.setValueAtTime(from, t);
  for (const [s, v] of points) param.linearRampToValueAtTime(v, t + s);
}
const noises = {};
function noise(kind) {
  if (noises[kind]) return noises[kind];
  const a = audio(), n = a.sampleRate * 4, buf = a.createBuffer(1, n, a.sampleRate), d = buf.getChannelData(0);
  let last = 0, b0 = 0, b1 = 0, b2 = 0;
  for (let i = 0; i < n; i++) {
    const w = Math.random() * 2 - 1;
    if (kind === 'brown') d[i] = (last = (last + 0.02 * w) / 1.02) * 3.5;
    else if (kind === 'pink') {
      b0 = 0.99765 * b0 + w * 0.099; b1 = 0.963 * b1 + w * 0.2965; b2 = 0.57 * b2 + w * 1.0527;
      d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.2;
    } else d[i] = w;
  }
  return (noises[kind] = buf);
}
function hiss(kind, t, seconds) {
  const s = audio().createBufferSource();
  s.buffer = noise(kind);
  s.loop = true;
  s.start(t, Math.random() * 3);
  if (seconds) s.stop(t + seconds);
  return s;
}
function drift(param, rate, depth) {
  const a = audio(), o = a.createOscillator(), g = a.createGain();
  o.frequency.value = rate;
  g.gain.value = depth;
  o.connect(g).connect(param);
  o.start();
  return o;
}
const midi = p => {
  if (typeof p === 'number') return p;
  const [, n, acc, oct] = /^([A-G])(#|b)?(-?\d)$/.exec(p);
  return 12 * (Number(oct) + 1) + { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[n] + (acc === '#' ? 1 : acc === 'b' ? -1 : 0);
};
const hz = m => 440 * 2 ** ((m - 69) / 12);
const rnd = (a, b) => a + Math.random() * (b - a);

// something struck: its partials ringing down, [hz, seconds, loudness]
function ring(t, dest, partials, attack = 0.004) {
  const a = audio();
  for (const [f, d, v] of partials) {
    const o = a.createOscillator(), e = a.createGain();
    o.frequency.value = f * (1 + (Math.random() - 0.5) * 0.004);
    e.gain.setValueAtTime(0, t);
    e.gain.linearRampToValueAtTime(v, t + attack);
    e.gain.exponentialRampToValueAtTime(0.0005, t + d);
    o.connect(e).connect(dest);
    o.start(t);
    o.stop(t + d + 0.05);
  }
}
// a burst of noise through a band, dying away: a click, a thud, a slam
function burst(t, dest, { kind = 'white', f, Q = 1, len, loud, attack = Math.min(0.006, len / 4) }) {
  const a = audio(), e = a.createGain();
  hiss(kind, t, len + 0.05).connect(filter({ type: 'bandpass', frequency: f, Q })).connect(e);
  e.gain.setValueAtTime(0, t);
  e.gain.linearRampToValueAtTime(loud, t + attack);
  e.gain.exponentialRampToValueAtTime(0.0005, t + len);
  e.connect(dest);
}
// noise through a band with an envelope of its own [[seconds, level], …] (a swoosh, a breath, a roar)
function swell(t, dest, { kind = 'pink', f, Q = 1, type = 'bandpass', points, sweep }) {
  const a = audio(), e = a.createGain(), band = filter({ type, frequency: f, Q }), len = points.at(-1)[0];
  if (sweep) shape(band.frequency, t, sweep, f);
  hiss(kind, t, len + 0.05).connect(band).connect(e).connect(dest);
  shape(e.gain, t, points);
  return e;
}
// a drop of water: a short note bending
function drop(t, dest, f, bend, loud) {
  const a = audio(), o = a.createOscillator(), e = a.createGain();
  o.frequency.setValueAtTime(f, t);
  o.frequency.exponentialRampToValueAtTime(f * bend, t + 0.05);
  e.gain.setValueAtTime(0, t);
  e.gain.linearRampToValueAtTime(loud, t + 0.003);
  e.gain.exponentialRampToValueAtTime(0.0005, t + 0.14);
  o.connect(e).connect(dest);
  o.start(t);
  o.stop(t + 0.18);
}
// a voice's syllable: noise through two formants (a vowel), up and down in `len` — far voices, a laugh, a cough
function syllable(t, dest, { f1, f2, len, loud, kind = 'pink', pitch }) {
  const a = audio(), e = a.createGain(), src = a.createGain();
  if (pitch) { // voiced: a buzz under the breath
    const o = a.createOscillator();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(pitch, t);
    o.frequency.linearRampToValueAtTime(pitch * rnd(0.85, 1.1), t + len);
    const og = a.createGain();
    og.gain.value = 0.25;
    o.connect(og).connect(src);
    o.start(t);
    o.stop(t + len + 0.05);
  }
  hiss(kind, t, len + 0.05).connect(src);
  for (const [f, q, v] of [[f1, 5, 1], [f2, 7, 0.6]]) {
    const g = a.createGain();
    g.gain.value = v;
    src.connect(filter({ type: 'bandpass', frequency: f, Q: q })).connect(g).connect(e);
  }
  shape(e.gain, t, [[len * 0.25, loud], [len * 0.6, loud * 0.7], [len, 0]]);
  e.connect(dest);
}
const VOWELS = [[700, 1200], [500, 1500], [400, 2000], [600, 1000], [300, 2300]];

// a bowed string: a sawtooth and the hair's grit through the instrument's body; the bow takes 80 ms to bite, the
// vibrato comes once the note is settled
function bowed(dest, { body = 1 } = {}) {
  const a = audio(), t = a.currentTime;
  const saw = a.createOscillator(), saw2 = a.createOscillator(), wobble = a.createOscillator(), depth = a.createGain(),
    grit = a.createGain(), env = a.createGain();
  saw.type = 'sawtooth';
  saw2.type = 'sawtooth';
  saw2.detune.value = 7;
  wobble.frequency.value = 5.4;
  depth.gain.value = 0;
  wobble.connect(depth).connect(saw.detune);
  depth.connect(saw2.detune);
  grit.gain.value = 0.22;
  const hair = hiss('pink', t);
  hair.connect(filter({ type: 'bandpass', frequency: 3200, Q: 0.8 })).connect(grit).connect(env);
  const mixg = a.createGain();
  mixg.gain.value = 0.6;
  saw.connect(mixg);
  saw2.connect(mixg);
  mixg.connect(env);
  env.gain.value = 0;
  env.connect(filter({ type: 'highpass', frequency: 170 }))
    .connect(filter({ type: 'peaking', frequency: 280, Q: 1.4, gain: 4 * body }))
    .connect(filter({ type: 'peaking', frequency: 520, Q: 1.6, gain: 3 }))
    .connect(filter({ type: 'peaking', frequency: 2600, Q: 1.5, gain: 2 }))
    .connect(filter({ type: 'lowpass', frequency: 3400, Q: 0.6 })).connect(dest);
  saw.start(t);
  saw2.start(t);
  wobble.start(t);
  const rest = at => { env.gain.setTargetAtTime(0, at, 0.18); };
  return {
    play(m, at, len, v, { join = false, vibrato = 16 } = {}) {
      const f = hz(m);
      if (join) {
        saw.frequency.setTargetAtTime(f, at, 0.03);
        saw2.frequency.setTargetAtTime(f, at, 0.03);
        env.gain.setTargetAtTime(v, at, 0.08);
      } else {
        env.gain.setTargetAtTime(v * 0.25, Math.max(0, at - 0.06), 0.03);
        saw.frequency.setValueAtTime(f, at);
        saw2.frequency.setValueAtTime(f, at);
        env.gain.setTargetAtTime(v, at, 0.07);
        depth.gain.setTargetAtTime(0, at, 0.02);
      }
      depth.gain.setTargetAtTime(vibrato, at + Math.min(0.3, len * 0.3), 0.2);
      if (len > 1.2) { // a long note swells and eases
        env.gain.setTargetAtTime(v * 1.2, at + len * 0.2, len * 0.2);
        env.gain.setTargetAtTime(v * 0.75, at + len * 0.7, len * 0.15);
      }
    },
    rest,
    end(at) {
      rest(at);
      for (const o of [saw, saw2, wobble, hair]) o.stop(at + 1.2);
    },
  };
}

// the beds: one of each for the page, built when first heard and taken down once silent (as AP's): build({a, t, out,
// noise, sway, keep, every}) → optionally tune(level, seconds)
const sounding = {};
function bed(name, wet, room, build, level, seconds) {
  let b = sounding[name];
  if (!b) {
    if (!level) return;
    const a = audio(), out = a.createGain(), stops = [];
    const keep = node => { stops.push(() => node.stop()); return node; };
    out.gain.value = 0;
    out.connect(air(wet, room));
    b = sounding[name] = { out, stops, closing: null };
    b.tune = build({
      a, out, keep, t: a.currentTime,
      noise: kind => keep(hiss(kind, a.currentTime)),
      sway: (param, rate, depth) => keep(drift(param, rate, depth)),
      every(fn) {
        fn();
        const timer = setInterval(fn, 200);
        stops.push(() => clearInterval(timer));
      },
    });
  }
  if (b.closing) {
    b.closing.onended = null;
    b.closing = null;
  }
  to(b.out.gain, level, seconds);
  b.tune?.(level, seconds);
  if (!level) b.closing = after(Math.max(0.02, seconds) + 0.1, () => {
    for (const stop of b.stops) stop();
    b.out.disconnect();
    delete sounding[name];
  });
}

// a place full of people: voices far or near, syllables in many vowels and pitches
function voices(name, { wet, rate, loud, far, steps }, level, seconds) {
  bed(name, wet, 'square', ({ a, t, out, noise, sway, every }) => {
    const dist = filter({ type: 'lowpass', frequency: far ? 1800 : 3200 });
    dist.connect(out);
    const body = a.createGain();
    body.gain.value = loud * 0.5;
    noise('pink').connect(filter({ type: 'bandpass', frequency: 600, Q: 0.8 })).connect(body).connect(dist);
    sway(body.gain, 0.09, loud * 0.15);
    let next = t + 0.1, step = t + 2;
    every(() => {
      const now = a.currentTime;
      if (next < now) next = now;
      for (; next < now + 0.4; next -= Math.log(1 - Math.random()) / rate) {
        const [f1, f2] = VOWELS[Math.floor(Math.random() * VOWELS.length)], k = rnd(0.85, 1.2);
        syllable(next, dist, { f1: f1 * k, f2: f2 * k, len: rnd(0.12, 0.35), loud: loud * rnd(0.3, 1), pitch: rnd(110, 260) });
      }
      if (steps && step < now + 0.4) { // a few steps on stone, someone crossing
        for (let i = 0; i < 4; i++) burst(Math.max(step, now) + i * 0.52, out, { kind: 'brown', f: 900, Q: 1.5, len: 0.05, loud: 0.12 });
        step = now + rnd(6, 14);
      }
    });
  }, level, seconds);
}
export function town(level = 1, seconds = 2) { voices('town', { wet: 0.35, rate: 6, loud: 0.32, far: true, steps: true }, level, seconds); }
export function crowd(level = 1, seconds = 2) { voices('crowd', { wet: 0.25, rate: 26, loud: 0.26, far: false }, level, seconds); }

export function sea(level = 1, seconds = 2) {
  bed('sea', 0.25, 'square', ({ a, t, out, noise, sway, every }) => {
    const deep = a.createGain();
    deep.gain.value = 0.5;
    noise('brown').connect(filter({ type: 'lowpass', frequency: 450 })).connect(deep).connect(out);
    sway(deep.gain, 0.05, 0.12);
    const tone = filter({ type: 'lowpass', frequency: 350 }), body = a.createGain(), foam = a.createGain();
    body.gain.value = 0;
    foam.gain.value = 0;
    noise('brown').connect(tone).connect(body).connect(out);
    noise('pink').connect(filter({ type: 'highpass', frequency: 2200 })).connect(foam).connect(out);
    let next = t + 1;
    every(() => {
      const now = a.currentTime;
      if (next > now + 0.5) return;
      const at = Math.max(next, now), big = 0.5 + Math.random() * 0.4;
      // against stone, not sand: the wave slaps the mole and falls back
      shape(body.gain, at, [[2.2, 0.8 * big], [2.6, 0.6 * big], [5, 0]]);
      shape(tone.frequency, at, [[2.2, 900], [5, 350]], 350);
      shape(foam.gain, at, [[2.1, 0], [2.5, 0.45 * big], [3.4, 0.2 * big], [5.6, 0]]);
      next = at + 7 + Math.random() * 2;
    });
  }, level, seconds);
}

export function fire(level = 1, seconds = 2) {
  bed('fire', 0.25, 'booth', ({ a, t, out, noise, sway, every }) => {
    const roar = a.createGain(), flame = a.createGain();
    roar.gain.value = 0.55;
    noise('brown').connect(filter({ type: 'lowpass', frequency: 190 })).connect(roar).connect(out);
    sway(roar.gain, 0.3, 0.15);
    flame.gain.value = 0.14;
    noise('pink').connect(filter({ type: 'bandpass', frequency: 520, Q: 0.7 })).connect(flame).connect(out);
    sway(flame.gain, 6.1, 0.06);
    sway(flame.gain, 0.5, 0.04);
    let next = t + 0.1;
    every(() => {
      const now = a.currentTime;
      if (next < now) next = now;
      for (; next < now + 0.4; next -= Math.log(1 - Math.random()) / 9) {
        const at = Math.max(next, now);
        if (Math.random() < 0.1) burst(at, out, { f: rnd(500, 900), Q: 2, len: 0.07, loud: 0.4 });
        else burst(at, out, { f: rnd(1500, 5000), Q: 1.5, len: rnd(0.006, 0.025), loud: 0.05 + Math.random() ** 2 * 0.3 });
      }
    });
  }, level, seconds);
}

export function wind_cold(level = 1, seconds = 2) {
  bed('wind_cold', 0.2, 'square', ({ a, out, noise, sway }) => {
    // a thin wind, 200–600 Hz, now fuller, now thinner; a faint whistle high in it
    const band = filter({ type: 'bandpass', frequency: 380, Q: 1.4 }), amp = a.createGain();
    amp.gain.value = 0.6;
    noise('pink').connect(band).connect(amp).connect(out);
    sway(band.frequency, 0.06, 170);
    sway(band.frequency, 0.027, 60);
    sway(amp.gain, 0.1, 0.2);
    sway(amp.gain, 0.037, 0.12);
    const whine = filter({ type: 'bandpass', frequency: 1700, Q: 14 }), wa = a.createGain();
    wa.gain.value = 0.04;
    noise('pink').connect(whine).connect(wa).connect(out);
    sway(whine.frequency, 0.05, 250);
    sway(wa.gain, 0.08, 0.035);
  }, level, seconds);
}

// the clocks — the game's leitmotif: Fogg's exact watch (bright, quick), Passepartout's big silver one (a little behind
// it, deeper), and under them, when `level` > 0.6, the club's pendulum (a slow wooden tock every second). Each tick a
// struck thing: never two alike
export function clock(level = 1, seconds = 2) {
  bed('clock', 0.15, 'booth', ({ a, t, out, every }) => {
    let next = t + 0.05, k = 0;
    every(() => {
      const now = a.currentTime;
      if (next < now) next = now;
      for (; next < now + 0.4; next += 0.5, k++) {
        ring(next, out, [[2900 * rnd(0.99, 1.01), 0.05, 0.11], [5800, 0.03, 0.03]], 0.001);
        ring(next + 0.023, out, [[1850 * rnd(0.99, 1.01), 0.07, 0.06], [3700, 0.04, 0.02]], 0.001);
        if (k % 2 === 0) burst(next + 0.01, out, { kind: 'brown', f: 520, Q: 3, len: 0.09, loud: 0.12 });
      }
    });
  }, level, seconds);
}

// the wheels: the train's rhythm on the rail joints (ta-ta… ta-ta), the carriage's low rumble, a creak now and then
export function wheels(level = 1, seconds = 2) {
  bed('wheels', 0.12, 'booth', ({ a, t, out, noise, sway, every }) => {
    const rumble = a.createGain();
    rumble.gain.value = 0.4;
    noise('brown').connect(filter({ type: 'lowpass', frequency: 220 })).connect(rumble).connect(out);
    sway(rumble.gain, 0.4, 0.08);
    let next = t + 0.1;
    every(() => {
      const now = a.currentTime;
      if (next < now) next = now;
      for (; next < now + 0.4; next += 1.15) {
        for (const d of [0, 0.13]) burst(next + d, out, { kind: 'brown', f: 260, Q: 1.4, len: 0.11, loud: 0.5 });
        for (const d of [0.52, 0.65]) burst(next + d, out, { kind: 'brown', f: 240, Q: 1.4, len: 0.1, loud: 0.38 });
        if (Math.random() < 0.08) swell(next + 0.3, out, { f: 1900, Q: 9, points: [[0.2, 0.03], [0.6, 0]] });
      }
    });
  }, level, seconds);
}

// the jungle by day: birds far off (a whistle bending), insects in a thin band, leaves
export function jungle(level = 1, seconds = 2) {
  bed('jungle', 0.3, 'square', ({ a, t, out, noise, sway, every }) => {
    const leaves = a.createGain();
    leaves.gain.value = 0.08;
    noise('pink').connect(filter({ type: 'bandpass', frequency: 2400, Q: 0.6 })).connect(leaves).connect(out);
    sway(leaves.gain, 0.12, 0.05);
    let next = t + 0.5;
    every(() => {
      const now = a.currentTime;
      if (next > now + 0.4) return;
      const at = Math.max(next, now), f = rnd(1800, 3400), n = 1 + Math.floor(Math.random() * 3);
      for (let i = 0; i < n; i++) {
        const o = a.createOscillator(), e = a.createGain(), s = at + i * 0.18;
        o.frequency.setValueAtTime(f, s);
        o.frequency.exponentialRampToValueAtTime(f * rnd(0.6, 1.4), s + 0.14);
        shape(e.gain, s, [[0.02, 0.03], [0.15, 0]]);
        o.connect(e).connect(out);
        o.start(s);
        o.stop(s + 0.2);
      }
      next = at + rnd(1.2, 4);
    });
  }, level, seconds);
}

// the elephant's walk: a heavy soft footfall, four to a stride, the howdah's ropes creaking with the sway
export function elephant(level = 1, seconds = 2) {
  bed('elephant', 0.25, 'square', ({ a, t, out, every }) => {
    let next = t + 0.2, k = 0;
    every(() => {
      const now = a.currentTime;
      if (next < now) next = now;
      for (; next < now + 0.4; next += 0.62, k++) {
        burst(next, out, { kind: 'brown', f: 90, Q: 1.2, len: 0.32, loud: 0.7, attack: 0.03 });
        if (k % 4 === 1) swell(next + 0.1, out, { f: rnd(700, 1100), Q: 12, points: [[0.15, 0.04], [0.5, 0]] });
      }
    });
  }, level, seconds);
}

// drums at night: frame drums and a dhol far off, coming in fours, a little ragged
export function drums(level = 1, seconds = 2) {
  bed('drums', 0.45, 'square', ({ a, t, out, every }) => {
    const far = filter({ type: 'lowpass', frequency: 900 });
    far.connect(out);
    let next = t + 0.2, k = 0;
    every(() => {
      const now = a.currentTime;
      if (next < now) next = now;
      for (; next < now + 0.4; next += 0.42 + rnd(-0.02, 0.02), k++) {
        const strong = k % 4 === 0;
        burst(next, far, { kind: 'brown', f: strong ? 110 : 170, Q: 2, len: strong ? 0.35 : 0.18, loud: strong ? 0.8 : 0.45 });
        if (k % 8 === 6) burst(next + 0.21, far, { kind: 'white', f: 700, Q: 2, len: 0.06, loud: 0.2 });
      }
    });
  }, level, seconds);
}

// the storm at sea: the gale's roar and whine, big waves breaking, spray
export function storm(level = 1, seconds = 2) {
  bed('storm', 0.2, 'square', ({ a, t, out, noise, sway, every }) => {
    const gale = filter({ type: 'bandpass', frequency: 500, Q: 0.8 }), g = a.createGain();
    g.gain.value = 0.55;
    noise('pink').connect(gale).connect(g).connect(out);
    sway(gale.frequency, 0.09, 250);
    sway(g.gain, 0.13, 0.2);
    const whine = filter({ type: 'bandpass', frequency: 1300, Q: 10 }), w = a.createGain();
    w.gain.value = 0.05;
    noise('pink').connect(whine).connect(w).connect(out);
    sway(whine.frequency, 0.07, 400);
    let next = t + 1;
    every(() => {
      const now = a.currentTime;
      if (next > now + 0.5) return;
      const at = Math.max(next, now), big = rnd(0.6, 1);
      swell(at, out, { kind: 'brown', f: 300, type: 'lowpass', points: [[1.5, 0.9 * big], [2.2, 0.6 * big], [4.5, 0]] });
      swell(at + 1.3, out, { kind: 'white', f: 3000, type: 'highpass', points: [[0.3, 0.25 * big], [2.5, 0]] });
      next = at + rnd(4.5, 6.5);
    });
  }, level, seconds);
}

// the sledge: the runners hissing on the snow, a soft thump on each wave of it, the sail's cloth
export function runners(level = 1, seconds = 2) {
  bed('runners', 0.2, 'square', ({ a, t, out, noise, sway, every }) => {
    const hissing = a.createGain();
    hissing.gain.value = 0.3;
    noise('white').connect(filter({ type: 'bandpass', frequency: 4200, Q: 0.7 })).connect(hissing).connect(out);
    sway(hissing.gain, 0.6, 0.1);
    let next = t + 0.5;
    every(() => {
      const now = a.currentTime;
      if (next > now + 0.4) return;
      const at = Math.max(next, now);
      burst(at, out, { kind: 'brown', f: 140, Q: 1, len: 0.2, loud: 0.3 });
      if (Math.random() < 0.3) swell(at + 0.1, out, { f: 600, Q: 1.5, points: [[0.08, 0.15], [0.4, 0]] });
      next = at + rnd(0.9, 2);
    });
  }, level, seconds);
}

// London in the fog: a low city hum, hooves and wheels far off now and then, a cab passing
export function fog(level = 1, seconds = 2) {
  bed('fog', 0.4, 'square', ({ a, t, out, noise, sway, every }) => {
    const hum = a.createGain();
    hum.gain.value = 0.18;
    noise('brown').connect(filter({ type: 'lowpass', frequency: 160 })).connect(hum).connect(out);
    sway(hum.gain, 0.05, 0.05);
    const far = filter({ type: 'lowpass', frequency: 1400 });
    far.connect(out);
    let next = t + 2;
    every(() => {
      const now = a.currentTime;
      if (next > now + 0.4) return;
      const at = Math.max(next, now), n = 6 + Math.floor(Math.random() * 6);
      for (let i = 0; i < n; i++) burst(at + i * 0.26 + (i % 2) * 0.05, far, { kind: 'brown', f: 800, Q: 2.5, len: 0.05, loud: 0.12 * Math.sin((i + 1) / (n + 1) * Math.PI) });
      next = at + rnd(6, 13);
    });
  }, level, seconds);
}

// the furnace of the «Henrietta»: the fire's roar through an open hatch, the engine's thud and the screw
export function furnace(level = 1, seconds = 2) {
  bed('furnace', 0.2, 'booth', ({ a, t, out, noise, sway, every }) => {
    const roar = a.createGain();
    roar.gain.value = 0.55;
    noise('brown').connect(filter({ type: 'lowpass', frequency: 260 })).connect(roar).connect(out);
    sway(roar.gain, 0.4, 0.2);
    let next = t + 0.1;
    every(() => {
      const now = a.currentTime;
      if (next < now) next = now;
      for (; next < now + 0.4; next += 0.55) {
        burst(next, out, { kind: 'brown', f: 70, Q: 1.5, len: 0.25, loud: 0.4 });
        if (Math.random() < 0.3) burst(next + 0.2, out, { f: rnd(1500, 4000), Q: 1.5, len: 0.02, loud: 0.15 });
      }
    });
  }, level, seconds);
}

const BEDS = { clock, wheels, jungle, elephant, drums, storm, runners, fog, furnace, town, crowd, sea, fire, wind_cold };
export function beds(levels = {}, seconds = 2) {
  for (const [name, play] of Object.entries(BEDS)) play(levels[name] ?? 0, seconds);
}

// ── the theme ───────────────────────────────────────────────────────────────────────────────────────────────────
// what plays till stopped: `out` is its loudness (base — its own); stopping, it is closed once silent
function handle(out, base, close, tune) {
  let stopped = false;
  return {
    loud(v, seconds = 0.3) {
      if (stopped) return;
      to(out.gain, base * v, seconds);
      tune?.(v, seconds);
    },
    stop(seconds = 1) {
      if (stopped) return;
      stopped = true;
      to(out.gain, 0, seconds);
      after(Math.max(0.02, seconds) + 0.05, () => {
        close();
        out.disconnect();
      });
    },
  };
}
// the theme on strings: the melody bowed (a second desk an octave under it in the second half), the chords held by
// four soft desks; the louder, the warmer (the strings open up). It comes in over 2 s at 0.6 of its own; loud() moves it from there
export function theme() {
  const a = audio(), out = a.createGain(), t0 = a.currentTime + 0.1;
  out.gain.value = 0;
  out.connect(air(0.45));
  const warmth = filter({ type: 'lowpass', frequency: 1400, Q: 0.5 });
  warmth.connect(out);
  const lead = bowed(warmth), under = bowed(warmth, { body: 1.5 });
  // the chord's desks: two detuned saws each, a slow vibrato
  const pad = a.createGain(), pads = [];
  pad.gain.value = 0.5;
  pad.connect(filter({ type: 'lowpass', frequency: 900, Q: 0.4 })).connect(warmth);
  for (let i = 0; i < 4; i++) {
    const v = a.createGain(), vib = a.createOscillator(), vd = a.createGain(), oscs = [];
    v.gain.value = 0;
    vib.frequency.value = rnd(4.6, 5.6);
    vd.gain.value = 6;
    vib.connect(vd);
    for (const c of [-6, 5]) {
      const o = a.createOscillator();
      o.type = 'sawtooth';
      o.detune.value = c;
      vd.connect(o.detune);
      o.connect(v);
      o.start(t0);
      oscs.push(o);
    }
    vib.start(t0);
    v.connect(pad);
    pads.push({ v, oscs, vib, loud: [0.07, 0.05, 0.045, 0.04][i] });
  }
  let k = 0, stopped = false;
  const plan = () => {
    if (stopped) return;
    const now = a.currentTime;
    for (; t0 + k * BAR < now + 1.5; k++) {
      const at = t0 + k * BAR, n = k % ROUND, bar = THEME[n];
      if (at < now - 0.05) continue;
      if (!bar) { // the rest bars: the tonic held, the bow lifted
        lead.rest(at);
        under.rest(at);
        THEME[15].chord.forEach((p, i) => { const d = pads[i]; for (const o of d.oscs) o.frequency.setTargetAtTime(hz(midi(p)), at, 0.05); d.v.gain.setTargetAtTime(d.loud * 0.6, at, 0.6); });
        continue;
      }
      let s = at;
      bar.notes.forEach(([p, beats], i) => {
        lead.play(midi(p), s, beats * BEAT, 0.16, { join: i > 0 });
        if (n >= 8) under.play(midi(p) - 12, s, beats * BEAT, 0.09, { join: i > 0 });
        s += beats * BEAT;
      });
      if (n === 15) { lead.rest(at + BAR - 0.2); under.rest(at + BAR - 0.2); }
      bar.chord.forEach((p, i) => {
        const d = pads[i], turn = Math.max(0.25, at + (Math.random() - 0.5) * 0.08);
        d.v.gain.setTargetAtTime(d.loud * 0.45, turn - 0.2, 0.07);
        for (const o of d.oscs) o.frequency.setTargetAtTime(hz(midi(p)), turn, 0.03);
        d.v.gain.setTargetAtTime(d.loud, turn + 0.05, 0.45);
      });
    }
  };
  plan();
  const timer = setInterval(plan, 250);
  to(out.gain, 0.8 * 0.6, 2); // (it comes in by itself, half loud; loud() takes it from wherever it is)
  return handle(out, 0.8, () => {
    stopped = true;
    clearInterval(timer);
    const at = a.currentTime;
    lead.end(at);
    under.end(at);
    for (const d of pads) { for (const o of d.oscs) o.stop(at + 0.5); d.vib.stop(at + 0.5); }
  }, (v, seconds) => to(warmth.frequency, 1100 + 2600 * v ** 1.3, seconds));
}

// the motif: the theme's first five notes on a celesta (a sine and a faint octave, a long tail), in the theme's rhythm
export function motif() {
  const a = audio(), t = a.currentTime + 0.03, out = air(0.5);
  let s = 0;
  MOTIF.forEach(([p, beats], i) => {
    const f = hz(midi(p) + 12), last = i === MOTIF.length - 1;
    ring(t + s, out, [[f, last ? 4.5 : 2.4, 0.12], [f * 2, last ? 1.4 : 0.8, 0.02], [f * 4.02, 0.25, 0.008]], 0.006);
    s += beats * 0.32;
  });
}

// ── played once ─────────────────────────────────────────────────────────────────────────────────────────────────
const now = (d = 0.02) => audio().currentTime + d;

export function bell() {
  const t = now(), out = air(0.4, 'booth');
  for (let i = 0; i < 3; i++) ring(t + i * 0.17, out, [[2100, 0.9, 0.06], [3400, 0.5, 0.035], [5250, 0.2, 0.012]], 0.002);
}
// a seat creaks: a rasp through the wood's resonance
export function creak() {
  const a = audio(), t = now(), o = a.createOscillator(), e = a.createGain();
  o.type = 'sawtooth';
  o.frequency.setValueAtTime(120, t);
  o.frequency.linearRampToValueAtTime(180, t + 0.3);
  o.frequency.linearRampToValueAtTime(140, t + 0.5);
  for (const [f, Q] of [[700, 8], [1500, 6]]) o.connect(filter({ type: 'bandpass', frequency: f, Q })).connect(e);
  shape(e.gain, t, [[0.05, 0.2], [0.3, 0.14], [0.5, 0]]);
  e.connect(air(0.3, 'booth'));
  o.start(t);
  o.stop(t + 0.55);
}
// scissors through film: two short metal clicks
export function scissors() {
  const t = now(), out = air(0.15, 'booth');
  for (const s of [0, 0.09]) {
    burst(t + s, out, { f: 4200, Q: 2, len: 0.025, loud: 0.3 });
    ring(t + s, out, [[3100, 0.06, 0.03], [5300, 0.04, 0.02]]);
  }
}
// the splicing press shut: a dull click
export function press() {
  const t = now(), out = air(0.2, 'booth');
  burst(t, out, { kind: 'brown', f: 220, Q: 1, len: 0.09, loud: 0.8 });
  burst(t, out, { f: 1600, Q: 2, len: 0.015, loud: 0.15 });
}
// chalk on a slate: a short dry stroke
export function chalk() {
  const a = audio(), t = now(), e = a.createGain(), len = rnd(0.12, 0.2);
  hiss('white', t, len + 0.05).connect(filter({ type: 'bandpass', frequency: 2600, Q: 1.2 })).connect(e).connect(air(0.15, 'booth'));
  e.gain.setValueAtTime(0, t);
  for (let s = 0; s < len; s += 0.012) e.gain.linearRampToValueAtTime(rnd(0.05, 0.16), t + s);
  e.gain.linearRampToValueAtTime(0, t + len);
}
// …and its squeak: the hand jerked
export function chalkSqueak() {
  const a = audio(), t = now(), o = a.createOscillator(), e = a.createGain(), wob = a.createOscillator(), wd = a.createGain();
  o.frequency.setValueAtTime(2900, t);
  o.frequency.linearRampToValueAtTime(3300, t + 0.22);
  wob.frequency.value = 37;
  wd.gain.value = 60;
  wob.connect(wd).connect(o.frequency);
  shape(e.gain, t, [[0.02, 0.05], [0.18, 0.04], [0.25, 0]]);
  o.connect(e).connect(air(0.15, 'booth'));
  o.start(t); wob.start(t);
  o.stop(t + 0.3); wob.stop(t + 0.3);
  chalk();
}
// a sprocket's tooth: a small precise click
export function click() {
  const t = now(), out = air(0.15, 'booth');
  burst(t, out, { f: 3000, Q: 2, len: 0.012, loud: 0.55 });
  ring(t, out, [[1800, 0.05, 0.03]]);
}
// a lever thrown: iron on iron
export function clunk() {
  const t = now(), out = air(0.3, 'booth');
  burst(t, out, { kind: 'brown', f: 130, Q: 1, len: 0.14, loud: 1 });
  ring(t, out, [[620, 0.25, 0.05], [1430, 0.15, 0.03], [2390, 0.08, 0.015]]);
}
// a motor started: a hum rising in 0.6 s
export function motor() {
  const a = audio(), t = now(), o = a.createOscillator(), e = a.createGain(), lp = filter({ type: 'lowpass', frequency: 300 });
  o.type = 'sawtooth';
  o.frequency.setValueAtTime(14, t);
  o.frequency.exponentialRampToValueAtTime(50, t + 0.6);
  shape(e.gain, t, [[0.1, 0.12], [0.6, 0.18], [1.1, 0]]);
  o.connect(lp).connect(e).connect(air(0.3, 'booth'));
  o.start(t);
  o.stop(t + 1.2);
  burst(t, air(0.3, 'booth'), { f: 2500, Q: 2, len: 0.02, loud: 0.2 });
}
// the changeover's cue: a quiet click; the second higher and brighter
export function tick() { ring(now(), air(0.2, 'booth'), [[1500, 0.14, 0.16], [3020, 0.06, 0.06]], 0.001); }
export function tick2() { ring(now(), air(0.2, 'booth'), [[2800, 0.18, 0.17], [5650, 0.08, 0.07], [4200, 0.12, 0.05]], 0.001); }

// a hall laughing: a wave of many voices' "ha", the house shaking with it, dying down
export function laugh() {
  const t = now(0.05), out = air(0.35, 'booth');
  for (let p = 0; p < 22; p++) {
    const start = t + rnd(0, 0.8), pitch = rnd(110, 300), [f1, f2] = VOWELS[0], n = 3 + Math.floor(Math.random() * 6), loud = rnd(0.12, 0.28);
    for (let i = 0; i < n; i++) syllable(start + i * rnd(0.16, 0.22), out, { f1: f1 * rnd(0.9, 1.15), f2: f2 * rnd(0.9, 1.15), len: 0.13, loud: loud * (1 - i / (n + 1)), pitch: pitch * (1 - i * 0.03) });
  }
}
// a roar of the hall: voices up, whistles, stamping
export function roar() {
  const t = now(), out = air(0.35, 'booth');
  swell(t, out, { f: 700, Q: 0.6, points: [[0.4, 0.5], [2, 0.4], [3.5, 0]] });
  for (let p = 0; p < 30; p++) {
    const [f1, f2] = VOWELS[Math.floor(Math.random() * VOWELS.length)];
    syllable(t + rnd(0, 2.5), out, { f1, f2, len: rnd(0.3, 0.7), loud: rnd(0.05, 0.12), pitch: rnd(130, 320) });
  }
  whistle();
  for (let i = 0; i < 10; i++) burst(t + rnd(0, 2.8), out, { kind: 'brown', f: 120, Q: 1, len: 0.1, loud: 0.4 });
}
// applause: many hands, swelling and falling away
export function applause() {
  const a = audio(), t = now(), out = air(0.35), len = 3.5;
  let s = 0;
  while (s < len) {
    const u = s / len, rate = 15 + 85 * Math.sin(Math.PI * Math.min(1, u * 1.3));
    burst(t + s, out, { f: rnd(1200, 3200), Q: 1.4, len: rnd(0.012, 0.03), loud: rnd(0.08, 0.2) * (1 - u * 0.6) });
    s += -Math.log(1 - Math.random()) / rate;
  }
}
// whistling: two or three of them, up and over, a wolf whistle among them
export function whistle() {
  const a = audio(), t = now(), out = air(0.4);
  for (let i = 0, n = 2 + Math.floor(Math.random() * 2); i < n; i++) {
    const at = t + rnd(0, 0.6), base = rnd(1900, 2800), o = a.createOscillator(), e = a.createGain(), len = rnd(0.5, 0.9);
    o.frequency.setValueAtTime(base * 0.8, at);
    o.frequency.exponentialRampToValueAtTime(base * 1.15, at + len * 0.35);
    o.frequency.exponentialRampToValueAtTime(base * 0.75, at + len);
    shape(e.gain, at, [[0.04, 0.05], [len * 0.8, 0.04], [len, 0]]);
    o.connect(e).connect(out);
    o.start(at);
    o.stop(at + len + 0.05);
  }
}
// people whispering behind his back: breath through the vowels, quiet
export function whisper() {
  const t = now(), out = air(0.3);
  for (let p = 0; p < 9; p++) {
    const [f1, f2] = VOWELS[Math.floor(Math.random() * VOWELS.length)];
    syllable(t + rnd(0, 2.2), out, { f1: f1 * 1.5, f2: f2 * 1.3, len: rnd(0.2, 0.45), loud: rnd(0.05, 0.12), kind: 'white' });
  }
}
// a girl's laugh: short bright bursts, falling a little
export function giggle() {
  const t = now(), out = air(0.3);
  const n = 4 + Math.floor(Math.random() * 2);
  for (let i = 0; i < n; i++) syllable(t + i * 0.13, out, { f1: 850, f2: 2400, len: 0.1, loud: 0.3 * (1 - i * 0.12), pitch: 330 - i * 12 });
}
// coins in the palm
export function coins() {
  const t = now(), out = air(0.3);
  for (let i = 0; i < 5; i++) {
    const f = rnd(3200, 5800);
    ring(t + i * rnd(0.05, 0.11), out, [[f, 0.35, 0.045], [f * 1.51, 0.2, 0.025], [f * 2.27, 0.1, 0.012]], 0.001);
  }
}
// a slap: a sharp clap of skin and the flat under it
export function slap() {
  const t = now(0.01), out = air(0.4);
  burst(t, out, { f: 1300, Q: 0.8, len: 0.09, loud: 0.9, attack: 0.001 });
  burst(t, out, { kind: 'brown', f: 260, Q: 1, len: 0.07, loud: 0.6, attack: 0.001 });
}
// film flaring in the gate: a quick whoosh opening up
export function flame() {
  const t = now(), out = air(0.25, 'booth');
  swell(t, out, { kind: 'white', type: 'lowpass', f: 300, Q: 0.7, points: [[0.12, 0.42], [0.6, 0.25], [1.4, 0]], sweep: [[0.15, 4500], [1.4, 900]] });
  for (let i = 0; i < 8; i++) burst(t + rnd(0.05, 1), out, { f: rnd(2000, 5000), Q: 2, len: 0.015, loud: 0.15 });
}
// a body dragged over boards
export function drag() {
  const a = audio(), t = now(), e = a.createGain(), len = rnd(0.6, 0.9);
  hiss('pink', t, len + 0.05).connect(filter({ type: 'bandpass', frequency: 650, Q: 1.3 })).connect(e).connect(air(0.25, 'booth'));
  e.gain.setValueAtTime(0, t);
  for (let s = 0; s < len; s += 0.04) e.gain.linearRampToValueAtTime(rnd(0.15, 0.4) * Math.sin(Math.PI * s / len), t + s);
  e.gain.linearRampToValueAtTime(0, t + len);
}
// a boy coughing in smoke: two hard breaths through the throat
export function cough() {
  const t = now(), out = air(0.25, 'booth');
  for (const [s, v] of [[0, 0.3], [0.24, 0.22]]) {
    syllable(t + s, out, { f1: 750, f2: 1300, len: 0.17, loud: 2 * v, kind: 'white', pitch: 360 });
    burst(t + s, out, { kind: 'brown', f: 300, Q: 1, len: 0.08, loud: 0.3 * v });
  }
}
// a small band far off, for the feast: three chords of brass, a drum under them
export function band() {
  const a = audio(), t = now(0.05), far = filter({ type: 'lowpass', frequency: 1100, Q: 0.5 }), e = a.createGain();
  e.gain.value = 0.6;
  far.connect(e).connect(air(0.7));
  [[53, 57, 60, 65], [52, 55, 60, 64], [53, 57, 60, 65]].forEach((chord, k) => {
    const at = t + k * 0.65, len = k === 2 ? 1.3 : 0.5;
    for (const m of chord) {
      const o = a.createOscillator(), g = a.createGain();
      o.type = 'sawtooth';
      o.frequency.value = hz(m);
      shape(g.gain, at, [[0.04, 0.035], [len * 0.8, 0.028], [len, 0]]);
      o.connect(g).connect(far);
      o.start(at);
      o.stop(at + len + 0.05);
    }
    burst(at, far, { kind: 'brown', f: 90, Q: 1, len: 0.3, loud: 0.9 });
  });
}
// a shutter: wood on wood, and its rattle
export function shutter() {
  const t = now(), out = air(0.5);
  burst(t, out, { kind: 'brown', f: 260, Q: 1.2, len: 0.12, loud: 0.5 });
  for (let i = 1; i < 4; i++) burst(t + i * 0.045, out, { f: 900, Q: 2, len: 0.03, loud: 0.12 / i });
}
// fireworks: thuds going up, bangs, the crackle falling — four seconds
export function fireworks() {
  const t = now(), out = air(0.6);
  for (let i = 0; i < 6; i++) {
    const at = t + i * rnd(0.5, 0.75);
    burst(at, out, { kind: 'brown', f: 80, Q: 0.8, len: 0.6, loud: 0.9, attack: 0.003 });
    for (let k = 0; k < 14; k++) burst(at + 0.15 + rnd(0, 1.2), out, { f: rnd(2500, 6000), Q: 2, len: 0.012, loud: rnd(0.04, 0.12) });
  }
}
// the tail of the film slapping the reel, quick, slowing, gone
export function reelEnd() {
  const t = now(), out = air(0.3, 'booth');
  let s = 0, gap = 0.07;
  for (let i = 0; i < 28; i++) {
    burst(t + s, out, { f: 1800, Q: 1, len: 0.025, loud: 0.3 * (1 - i / 30) });
    s += gap;
    gap *= 1.05;
  }
}
// steps on the stair, passing (game: the door does not open)
export function steps() {
  const t = now(), out = air(0.4, 'booth');
  for (let i = 0; i < 7; i++) {
    const at = t + i * 0.42, v = Math.sin(Math.PI * (i + 0.5) / 7);
    burst(at, out, { kind: 'brown', f: 160, Q: 1, len: 0.12, loud: 0.7 * v });
    burst(at + 0.02, out, { f: 1200, Q: 1.5, len: 0.03, loud: 0.06 * v });
  }
}
// a door slammed
export function door() {
  const t = now(), out = air(0.4, 'booth');
  burst(t, out, { kind: 'brown', f: 90, Q: 0.9, len: 0.35, loud: 1.2, attack: 0.002 });
  for (let i = 1; i < 5; i++) burst(t + i * 0.035, out, { f: 700, Q: 2, len: 0.03, loud: 0.15 / i });
}
// an old car's engine: it pulls away and goes off
export function car() {
  const a = audio(), t = now(), o = a.createOscillator(), o2 = a.createOscillator(), e = a.createGain(), lp = filter({ type: 'lowpass', frequency: 420 });
  o.type = 'sawtooth';
  o2.type = 'square';
  shape(o.frequency, t, [[0.6, 34], [2.2, 58], [5, 46]], 30);
  shape(o2.frequency, t, [[0.6, 17], [2.2, 29], [5, 23]], 15);
  shape(lp.frequency, t, [[1.5, 700], [5, 250]], 420);
  shape(e.gain, t, [[0.3, 0.09], [1.8, 0.11], [5, 0]]);
  o.connect(lp); o2.connect(lp);
  lp.connect(e).connect(air(0.4));
  o.start(t); o2.start(t);
  o.stop(t + 5.1); o2.stop(t + 5.1);
}
// steam let off the engine
export function trainHiss() {
  const t = now(), out = air(0.4);
  swell(t, out, { kind: 'white', type: 'highpass', f: 2200, Q: 0.7, points: [[0.15, 0.25], [1.5, 0.15], [3, 0]] });
}
// the engine's whistle: a steam chord, coming up to pitch
export function trainWhistle() {
  const a = audio(), t = now(), e = a.createGain(), out = air(0.6);
  for (const f of [587, 740, 880]) {
    const o = a.createOscillator();
    o.type = 'triangle';
    o.frequency.setValueAtTime(f * 0.94, t);
    o.frequency.linearRampToValueAtTime(f, t + 0.2);
    o.connect(e);
    o.start(t);
    o.stop(t + 2.2);
  }
  swell(t, out, { kind: 'white', f: 3000, Q: 2, points: [[0.1, 0.05], [1.8, 0.04], [2.1, 0]] });
  shape(e.gain, t, [[0.12, 0.07], [1.7, 0.06], [2.1, 0]]);
  e.connect(filter({ type: 'lowpass', frequency: 2500 })).connect(out);
}
// the church bell, five strokes, far
export function church() {
  const t = now(0.05), far = filter({ type: 'lowpass', frequency: 1600 });
  far.connect(air(0.8));
  for (let i = 0; i < 5; i++) {
    const at = t + i * 2.2, f = 196;
    ring(at, far, [[f * 0.5, 5, 0.06], [f, 4, 0.09], [f * 1.2, 3, 0.05], [f * 1.5, 2.6, 0.04], [f * 2, 2, 0.04], [f * 2.6, 1.2, 0.02]], 0.003);
  }
}
// pigeons taking off: wings beating, two or three birds
export function pigeons() {
  const t = now(), out = air(0.4, 'booth');
  for (let b = 0; b < 3; b++) {
    const start = t + rnd(0, 0.4), rate = rnd(9, 12);
    for (let i = 0; i < 14; i++) burst(start + i / rate, out, { kind: 'pink', f: rnd(700, 1100), Q: 0.8, len: 0.06, loud: 0.3 * (1 - i / 16), attack: 0.01 });
  }
}
// a sheet unfolded or folded
export function paper() {
  const a = audio(), t = now(0.01), e = a.createGain(), len = rnd(0.4, 0.6);
  hiss('white', t, len + 0.1).connect(filter({ type: 'bandpass', frequency: 3200, Q: 0.7 }))
    .connect(filter({ type: 'highpass', frequency: 1300 })).connect(e).connect(air(0.1));
  e.gain.setValueAtTime(0, t);
  for (let s = 0; s < len; s += rnd(0.03, 0.09)) {
    e.gain.linearRampToValueAtTime(rnd(0.09, 0.29), t + s + 0.008);
    e.gain.linearRampToValueAtTime(0.04, t + s + 0.025);
  }
  e.gain.linearRampToValueAtTime(0, t + len);
}
// a little cloud of dust
export function puff() {
  swell(now(), air(0.2, 'booth'), { kind: 'pink', type: 'lowpass', f: 900, Q: 0.6, points: [[0.06, 0.3], [0.7, 0]] });
}
// the demolition's whistle: a trilling blast, then another
export function whistleBlow() {
  const a = audio(), t = now(), out = air(0.6);
  for (const [s, len] of [[0, 1.1], [1.4, 1.6]]) {
    const o = a.createOscillator(), e = a.createGain(), tr = a.createOscillator(), td = a.createGain();
    o.frequency.value = 3100;
    tr.frequency.value = 28;
    td.gain.value = 140;
    tr.connect(td).connect(o.frequency);
    shape(e.gain, t + s, [[0.03, 0.06], [len - 0.1, 0.055], [len, 0]]);
    o.connect(e).connect(out);
    o.start(t + s); tr.start(t + s);
    o.stop(t + s + len + 0.05); tr.stop(t + s + len + 0.05);
  }
}
// the blast: a low blow, then the long roar of falling stone, its debris
export function blast() {
  const a = audio(), t = now(), out = air(0.7);
  const o = a.createOscillator(), e = a.createGain();
  o.frequency.setValueAtTime(70, t);
  o.frequency.exponentialRampToValueAtTime(26, t + 1.2);
  shape(e.gain, t, [[0.01, 0.6], [1.5, 0]]);
  o.connect(e).connect(out);
  o.start(t);
  o.stop(t + 1.6);
  swell(t, out, { kind: 'brown', type: 'lowpass', f: 400, Q: 0.6, points: [[0.05, 0.75], [1.5, 0.55], [4, 0.3], [7, 0]], sweep: [[0.2, 900], [7, 150]] });
  for (let i = 0; i < 60; i++) burst(t + 0.8 + rnd(0, 5) ** 1.2, out, { kind: i % 3 ? 'white' : 'brown', f: rnd(300, 2500), Q: 1.2, len: rnd(0.03, 0.15), loud: rnd(0.05, 0.25) });
}

// the sounds of a step played unseen (jump.js): nothing heard meanwhile — the beds heard from then on as loud as the
// step left them; what was played once is over by then, and a handle begun meanwhile is mute

// ── this game's own, played once ─────────────────────────────────────────────────────────────────────────────────
// the elephant trumpets: a brassy blare bending up and down, a breathy edge
export function trumpet() {
  const a = audio(), t = a.currentTime + 0.02, out = air(0.4), o = a.createOscillator(), e = a.createGain();
  o.type = 'sawtooth';
  o.frequency.setValueAtTime(380, t);
  o.frequency.linearRampToValueAtTime(620, t + 0.25);
  o.frequency.linearRampToValueAtTime(540, t + 0.9);
  o.frequency.linearRampToValueAtTime(300, t + 1.3);
  shape(e.gain, t, [[0.08, 0.16], [1.0, 0.12], [1.35, 0]]);
  o.connect(filter({ type: 'bandpass', frequency: 1100, Q: 1.2 })).connect(e).connect(out);
  o.start(t);
  o.stop(t + 1.4);
  swell(t, out, { f: 2400, Q: 1, points: [[0.1, 0.08], [1.2, 0.05], [1.4, 0]] });
}
// the club's pendulum: one deep wooden tock
export function tock() { burst(now(), air(0.5, 'booth'), { kind: 'brown', f: 420, Q: 4, len: 0.16, loud: 0.5 }); }
// a gun at sea: the bang, the rolling echo over the water
export function cannon() {
  const t = now(), out = air(0.7);
  burst(t, out, { kind: 'brown', f: 120, Q: 0.6, len: 0.9, loud: 1, attack: 0.002 });
  burst(t, out, { kind: 'white', f: 1500, Q: 0.5, len: 0.12, loud: 0.5 });
  swell(t + 0.2, out, { kind: 'brown', f: 200, type: 'lowpass', points: [[0.3, 0.3], [2.4, 0]] });
}
// rifle shots far off, a few, ragged
export function shots() {
  const t = now(), out = air(0.6);
  for (let i = 0; i < 4; i++) burst(t + i * rnd(0.25, 0.6), out, { kind: 'white', f: 1100, Q: 0.7, len: 0.08, loud: rnd(0.25, 0.5) });
}
// timber cracking: the bridge, the masts — a snap and the groan after it
export function crack() {
  const t = now(), out = air(0.5);
  burst(t, out, { kind: 'white', f: 1800, Q: 0.8, len: 0.06, loud: 0.7 });
  swell(t + 0.05, out, { kind: 'brown', f: 300, Q: 3, points: [[0.2, 0.3], [1.1, 0]], sweep: [[1.1, 160]] });
}
// a fall into water, or a wave over the side
export function splash() {
  const t = now(), out = air(0.4);
  swell(t, out, { kind: 'white', f: 2200, type: 'highpass', points: [[0.05, 0.6], [1.4, 0]] });
  burst(t, out, { kind: 'brown', f: 180, Q: 0.8, len: 0.4, loud: 0.6 });
}
// a visa stamp coming down on paper
export function stamp() {
  const t = now(), out = air(0.2, 'booth');
  burst(t, out, { kind: 'brown', f: 260, Q: 1.2, len: 0.1, loud: 0.6, attack: 0.002 });
  burst(t + 0.005, out, { kind: 'white', f: 3000, Q: 1, len: 0.03, loud: 0.15 });
}
// banknotes counted out: a few crisp flicks
export function notes() {
  const t = now(), out = air(0.15, 'booth');
  for (let i = 0; i < 5; i++) swell(t + i * 0.09, out, { kind: 'white', f: 4200, Q: 1.2, points: [[0.01, 0.2], [0.07, 0]] });
}
// a horse's trot on stone, a few strides
export function hooves() {
  const t = now(), out = air(0.4);
  for (let i = 0; i < 8; i++) burst(t + i * 0.19 + (i % 2) * 0.04, out, { kind: 'brown', f: 900, Q: 2.5, len: 0.05, loud: 0.3 });
}

// the sounds of a step played unseen (jump.js): nothing heard meanwhile — the beds heard from then on as loud as the
// step left them; what was played once is over by then, and a handle begun meanwhile is mute
const ONCE = ['motif', 'trumpet', 'tock', 'cannon', 'shots', 'crack', 'splash', 'stamp', 'notes', 'hooves', 'bell', 'creak',
  'click', 'clunk', 'tick', 'tick2', 'laugh', 'roar', 'applause', 'whistle', 'whisper', 'coins', 'slap', 'flame', 'drag',
  'cough', 'steps', 'door', 'trainHiss', 'trainWhistle', 'church', 'paper', 'puff', 'whistleBlow', 'blast'];
export function unheard() {
  const levels = {}, none = () => {}, mute = () => ({ loud() {}, stop() {} });
  const sounds = { wake: none, theme: mute, beds(set = {}) { for (const name in BEDS) levels[name] = set[name] ?? 0; } };
  for (const name in BEDS) sounds[name] = (level = 1) => { levels[name] = level; };
  for (const name of ONCE) sounds[name] = none;
  return { sounds, wake() { for (const [name, level] of Object.entries(levels)) BEDS[name](level, 1); } };
}
