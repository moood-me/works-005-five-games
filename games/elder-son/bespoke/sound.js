// The sounds of “The Elder Son”, made in the page (Web Audio): nothing to load; as loud as the page's "sounds" slider says
// (MooodVolume.output). The page may be heard only after the player's first touch: game.js wakes it as the map is left
// (a touch); till then its time stands, and what was asked for begins at the touch. (game.md §8.)
//   wake() — the page may be heard from now on (game.js: as the map is left — a touch; again, it changes nothing)
//   pause(on) — all of it stands while the play is paused (the page's ⏸: game.js b.onPause) and goes on from there after
//   unheard() → {sounds, wake()} — the same, unheard, for a step played unseen (jump.js); a step plays them as g.sound
// One AudioContext → the master level → a compressor. Two airs a sound goes out into: the street's (open, dark, 1.5 s)
// and the room's (a small room, 0.5 s).
// The beds — what lasts; one of each for the page, as loud as `level` (0 — silence, and the bed is taken down), getting
// there over `seconds`:
//   beds(levels, seconds) — the named beds to their levels, every other one to silence (g.beds)
//   wind — low wind in random gusts (ambience.js) · rails — the far railway: every 20–40 s
//   far wheels (“ta-ta, ta-ta”), now and then a far horn · train — the electric train close by: the motor's hum, the
//   wheels on the joints · freight — the goods train: heavier, faster wheels, the screech, the diesel · crossing — the
//   level crossing's bell, twice a second · room — the room's hum and the stove's crackle · clock — the wall clock: tick
//   and tock in turn, every 0.5 s · fire — a fire · crowd — people far off · pour — tea into a glass: recordings
//   (sounds/)
// Played once:
//   horn(level) · doors · knock · dog · door · creak · cough · tick · strike(n) · rub · spill · box · glass ·
//   splash(level) · crunch · thud · scrape · dance(seconds)
// Played till stopped (or till over) — a handle {loud(v, seconds), stop(seconds)}:
//   clarinet({times, resolve, far}) — the clarinet behind the wall: the oratorio's phrase (PHRASE), broken off at the
//     first breath of its seventh note; times — how many times, 3 s apart; resolve — the seventh found at last, whole,
//     and the phrase goes on to its end; far — still more muffled and quiet (heard from the street, through the window).
//     Over by itself; the step stops it when it is left
//   march() — the funeral band far off: four brass voices a little out of tune, the bass drum on the strong beats
import { built, kit } from './ambience.js';

// The world's key is A♭ major / F minor (A_FLAT_MAJOR_F_MINOR): the phrase and the march are in F minor.
// PHRASE — the oratorio “All Men Are Brothers”, the place he cannot get past: C F A♭ G F E, and the seventh — D♭ — breaks
// off at its first 80 ms (the same intervals as game.md's D-minor reading: A D F E D C♯ | B♭). Resolved: the seventh is
// F — found — whole, and on: G A♭ C, and F an octave up, long. [midi, beats]
export const PHRASE = [[60, 1], [65, 2], [68, 1], [67, 1], [65, 1], [64, 2.5]];
const BROKEN = 61; // D♭4 — where it always stops
export const RESOLVED = [[65, 1.5], [67, 1], [68, 1], [72, 1.5], [77, 4]];
const PHRASE_BEAT = 0.72; // s

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
    for (const [name, seconds, curve, dark, back] of [['street', 1.5, 2.2, 0.75, 0.8], ['room', 0.5, 2, 0.4, 0.9]]) {
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
  // (a context the browser held back resumes at the next touch)
  if (!awake) for (const touch of ['pointerdown', 'keydown']) addEventListener(touch, audio, { once: true, capture: true });
  awake = true;
  audio();
}
export function pause(on) {
  held = !!on;
  if (!ctx || !awake) return;
  if (held) ctx.suspend();
  else ctx.resume();
}

// where a sound goes: straight out, and `wet` of it into a room's air ('street' — open, or 'room' — a small room)
const airs = {};
function air(wet, room = 'street') {
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
const hz = m => 440 * 2 ** ((m - 69) / 12);
const rnd = (a, b) => a + Math.random() * (b - a);
const now = (d = 0.02) => audio().currentTime + d;

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
// noise through a band with an envelope of its own [[seconds, level], …] (a swoosh, a breath, a hiss)
function swell(t, dest, { kind = 'pink', f, Q = 1, type = 'bandpass', points, sweep }) {
  const a = audio(), e = a.createGain(), band = filter({ type, frequency: f, Q }), len = points.at(-1)[0];
  if (sweep) shape(band.frequency, t, sweep, f);
  hiss(kind, t, len + 0.05).connect(band).connect(e).connect(dest);
  shape(e.gain, t, points);
  return e;
}
// a voice's syllable: noise through two formants (a vowel), up and down in `len` — far voices, a cough, a bark
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
// wheels over a rail joint: two knocks a bogie, “ta-ta” — `gap` between the two, `loud`, `f` how deep
function joint(t, dest, { gap = 0.12, loud = 0.5, f = 160 }) {
  for (const s of [0, gap]) {
    burst(t + s, dest, { kind: 'brown', f, Q: 1.2, len: 0.09, loud });
    burst(t + s, dest, { f: f * 9, Q: 2.5, len: 0.02, loud: loud * 0.15 });
  }
}
// a train's horn: two saws a third apart through a low-pass; `len` s
function hornAt(t, dest, { len = 1.6, loud = 0.4, lp = 1800 }) {
  const a = audio(), e = a.createGain(), lpf = filter({ type: 'lowpass', frequency: lp, Q: 0.6 });
  for (const f of [330, 415]) {
    const o = a.createOscillator();
    o.type = 'sawtooth';
    o.frequency.value = f;
    o.connect(lpf);
    o.start(t);
    o.stop(t + len + 0.3);
  }
  lpf.connect(e).connect(dest);
  shape(e.gain, t, [[0.08, loud], [len - 0.15, loud * 0.9], [len + 0.2, 0]]);
}

// recordings (sounds/ — CC0, from Freesound: sounds/README.md): fetched and decoded once each; a bed plays one of its own
// round and round from a random point, `gain` bringing it to as loud as the bed it took the place of
const recordings = {};
function recording(file) {
  return (recordings[file] ??= fetch(new URL(`sounds/${file}`, import.meta.url)).then(r => r.arrayBuffer()).then(b => audio().decodeAudioData(b)));
}
function recorded(files, gain) {
  return ({ a, out, keep }) => {
    const s = a.createBufferSource(), g = a.createGain();
    let on = true;
    keep({ stop() { on = false; if (s.buffer) s.stop(); } });
    g.gain.value = gain;
    s.loop = true;
    s.connect(g).connect(out);
    recording(files[Math.floor(Math.random() * files.length)]).then(buf => { if (on) { s.buffer = buf; s.start(a.currentTime, Math.random() * buf.duration); } });
  };
}

// the beds: one of each for the page, built when first heard and taken down once silent: build({a, t, out, noise,
// sway, keep, every}) → optionally tune(level, seconds)
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
// (what comes at its times, scheduled 0.4 s ahead of the sounds' clock: `next` → the next time)
function schedule(a, first, fn) {
  let next = first;
  return () => {
    const t = a.currentTime;
    if (next < t) next = t;
    while (next < t + 0.4) next = fn(next);
  };
}

export function wind(level = 1, seconds = 2) { bed('wind', 0.2, 'street', ({ a, out, keep, every }) => built.wind(kit(a, keep, every), out, 1.3), level, seconds); }

export function rails(level = 1, seconds = 2) {
  bed('rails', 0.6, 'street', ({ a, t, out, every }) => {
    // the far railway: a train passing somewhere — its wheels “ta-ta, ta-ta” swelling and fading; now and then a horn
    const far = filter({ type: 'lowpass', frequency: 700, Q: 0.5 }), e = a.createGain();
    e.gain.value = 0.6;
    far.connect(e).connect(out);
    every(schedule(a, t + rnd(3, 10), at => {
      const n = Math.floor(rnd(10, 18));
      for (let i = 0; i < n; i++) {
        const k = Math.sin(Math.PI * (i + 0.5) / n); // swelling and fading
        joint(at + i * 0.62, far, { gap: 0.13, loud: 0.35 * k, f: 130 });
      }
      if (Math.random() < 0.35) hornAt(at + rnd(1, 4), far, { len: 1.4, loud: 0.12, lp: 900 });
      return at + rnd(20, 40);
    }));
  }, level, seconds);
}

export function train(level = 1, seconds = 2) {
  bed('train', 0.3, 'street', ({ a, t, out, keep, sway, every }) => {
    // the electric train close by: the motor's hum (two saws 90/180 Hz through a low-pass) and the wheels on the joints
    const hum = a.createGain(), lp = filter({ type: 'lowpass', frequency: 420, Q: 0.7 });
    hum.gain.value = 0.18;
    for (const f of [90, 180]) {
      const o = keep(a.createOscillator());
      o.type = 'sawtooth';
      o.frequency.value = f;
      o.connect(lp);
      o.start();
      sway(o.frequency, 0.13, f * 0.01);
    }
    lp.connect(hum).connect(out);
    every(schedule(a, t + 0.3, at => {
      joint(at, out, { gap: 0.1, loud: 0.45, f: 170 });
      return at + rnd(0.9, 1.1);
    }));
  }, level, seconds);
}

export function freight(level = 1, seconds = 2) {
  bed('freight', 0.25, 'street', ({ a, t, out, keep, noise, sway, every }) => {
    // the goods train: the diesel's growl, the wheels heavier and faster, the screech of the cars
    const diesel = a.createGain(), lp = filter({ type: 'lowpass', frequency: 260, Q: 0.8 });
    diesel.gain.value = 0.25;
    for (const f of [55, 82.5]) {
      const o = keep(a.createOscillator());
      o.type = 'sawtooth';
      o.frequency.value = f;
      o.connect(lp);
      o.start();
    }
    lp.connect(diesel).connect(out);
    sway(diesel.gain, 3.1, 0.06);
    const screech = filter({ type: 'bandpass', frequency: 3100, Q: 18 }), sg = a.createGain();
    sg.gain.value = 0.04;
    noise('white').connect(screech).connect(sg).connect(out);
    sway(screech.frequency, 0.3, 500);
    sway(sg.gain, 0.17, 0.035);
    every(schedule(a, t + 0.2, at => {
      joint(at, out, { gap: 0.09, loud: 0.8, f: 120 });
      return at + rnd(0.42, 0.5);
    }));
  }, level, seconds);
}

export function crossing(level = 1, seconds = 2) {
  bed('crossing', 0.35, 'street', ({ a, t, out, every }) => {
    // the level crossing's bell: a metal “ding” twice a second (two sines 1.9 / 2.4 kHz, a quick fall)
    every(schedule(a, t + 0.1, at => {
      ring(at, out, [[1900, 0.32, 0.12], [2400, 0.26, 0.08], [4750, 0.1, 0.02]], 0.002);
      return at + 0.5;
    }));
  }, level, seconds);
}

export function room(level = 1, seconds = 2) {
  bed('room', 0.4, 'room', ({ a, t, out, noise, sway, every }) => {
    // the room's quiet hum, and the stove crackling now and then
    const hum = a.createGain();
    hum.gain.value = 0.08;
    noise('brown').connect(filter({ type: 'lowpass', frequency: 160 })).connect(hum).connect(out);
    sway(hum.gain, 0.05, 0.02);
    every(schedule(a, t + 0.5, at => {
      burst(at, out, { f: rnd(900, 3500), Q: 1.5, len: rnd(0.008, 0.03), loud: 0.04 + Math.random() ** 3 * 0.25 });
      return at + rnd(0.3, 2.8);
    }));
  }, level, seconds);
}

export function clock(level = 1, seconds = 2) {
  bed('clock', 0.3, 'room', ({ a, t, out, every }) => {
    // the wall clock: “tick” and “tock” in turn, each every 0.5 s — short clicks of two pitches through a 3 kHz resonance
    const res = filter({ type: 'peaking', frequency: 3000, Q: 4, gain: 9 });
    res.connect(out);
    let tick = true;
    every(schedule(a, t + 0.1, at => {
      burst(at, res, { f: tick ? 2600 : 2100, Q: 6, len: 0.025, loud: 0.3 });
      ring(at, res, [[tick ? 3100 : 2500, 0.05, 0.03]], 0.001);
      tick = !tick;
      return at + 0.5;
    }));
  }, level, seconds);
}

// a fire: a recording
export function fire(level = 1, seconds = 2) { bed('fire', 0.05, 'street', recorded(['stove-346321.mp3'], 7.17), level, seconds); }

// a crowd: a recording
export function crowd(level = 1, seconds = 2) { bed('crowd', 0.05, 'street', recorded(['people-far-405317.mp3'], 0.78), level, seconds); }

// tea poured: a recording
export function pour(level = 1, seconds = 2) { bed('pour', 0.05, 'street', recorded(['pour-627625.mp3'], 8.0), level, seconds); }

const BEDS = { wind, rails, train, freight, crossing, room, clock, fire, crowd, pour };
export function beds(levels = {}, seconds = 2) {
  for (const [name, play] of Object.entries(BEDS)) play(levels[name] ?? 0, seconds);
}

// what plays till stopped: `out` is its loudness (base — its own); stopping, it is closed once silent
function handle(out, base, close) {
  let stopped = false;
  return {
    loud(v, seconds = 0.3) {
      if (stopped) return;
      to(out.gain, base * v, seconds);
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

// ── once ───────────────────────────────────────────────────────────────────────────────────────────────────────────

// the electric train's horn, far (the street's air)
export function horn(level = 1) { hornAt(now(), air(0.7, 'street'), { len: 1.6, loud: 0.45 * level, lp: 1500 }); }
// the doors' pneumatics: a hiss of 0.6 s and a dull knock
export function doors() {
  const t = now(), out = air(0.3, 'street');
  swell(t, out, { kind: 'white', f: 3500, Q: 0.6, type: 'highpass', points: [[0.04, 0.22], [0.45, 0.15], [0.6, 0]] });
  burst(t + 0.62, out, { kind: 'brown', f: 140, Q: 1, len: 0.2, loud: 0.9, attack: 0.002 });
  burst(t + 0.62, out, { f: 900, Q: 2, len: 0.04, loud: 0.15 });
}
// three knocks of knuckles on glass or a door
export function knock() {
  const t = now(), out = air(0.3, 'street');
  for (const s of [0, 0.22, 0.41]) {
    burst(t + s, out, { kind: 'brown', f: 420, Q: 1.6, len: 0.07, loud: 0.7, attack: 0.002 });
    burst(t + s, out, { f: 2400, Q: 3, len: 0.015, loud: 0.12 });
  }
}
// a dog far off: two or three barks
export function dog() {
  const t = now(), out = air(0.8, 'street'), far = filter({ type: 'lowpass', frequency: 1400 });
  far.connect(out);
  const n = Math.random() < 0.5 ? 2 : 3;
  for (let i = 0; i < n; i++) syllable(t + i * rnd(0.32, 0.45), far, { f1: 650, f2: 1400, len: 0.13, loud: 0.5, kind: 'white', pitch: rnd(330, 420) });
}
// the door's spring: a creak (a saw 120–200 Hz through a resonance), then the slam
export function door() {
  const a = audio(), t = now(), out = air(0.35, 'room'), o = a.createOscillator(), e = a.createGain();
  o.type = 'sawtooth';
  o.frequency.setValueAtTime(120, t);
  o.frequency.linearRampToValueAtTime(200, t + 0.35);
  o.frequency.linearRampToValueAtTime(150, t + 0.5);
  for (const [f, Q] of [[650, 7], [1400, 6]]) o.connect(filter({ type: 'bandpass', frequency: f, Q })).connect(e);
  shape(e.gain, t, [[0.05, 0.12], [0.4, 0.08], [0.5, 0]]);
  e.connect(out);
  o.start(t);
  o.stop(t + 0.55);
  burst(t + 0.62, out, { kind: 'brown', f: 90, Q: 0.9, len: 0.35, loud: 1.2, attack: 0.002 });
  for (let i = 1; i < 5; i++) burst(t + 0.62 + i * 0.035, out, { f: 700, Q: 2, len: 0.03, loud: 0.15 / i });
}
// a floorboard: a short rub of 0.3 s
export function creak() {
  const a = audio(), t = now(), o = a.createOscillator(), e = a.createGain();
  o.type = 'sawtooth';
  o.frequency.setValueAtTime(rnd(95, 120), t);
  o.frequency.linearRampToValueAtTime(rnd(150, 190), t + 0.3);
  for (const [f, Q] of [[600, 9], [1250, 7]]) o.connect(filter({ type: 'bandpass', frequency: f, Q })).connect(e);
  shape(e.gain, t, [[0.04, 0.22], [0.22, 0.16], [0.3, 0]]);
  e.connect(air(0.3, 'room'));
  o.start(t);
  o.stop(t + 0.35);
}
// a muffled cough behind the wall: two bursts through a low-pass
export function cough() {
  const t = now(), out = air(0.4, 'room'), wall = filter({ type: 'lowpass', frequency: 700 });
  wall.connect(out);
  for (const [s, v] of [[0, 0.35], [0.26, 0.26]]) {
    syllable(t + s, wall, { f1: 600, f2: 1100, len: 0.17, loud: 2 * v, kind: 'white', pitch: 150 });
    burst(t + s, wall, { kind: 'brown', f: 250, Q: 1, len: 0.08, loud: 0.3 * v });
  }
}
// one tick of the wall clock
export function tick() {
  const t = now(), out = air(0.3, 'room');
  burst(t, out, { f: 2600, Q: 6, len: 0.025, loud: 0.35 });
  ring(t, out, [[3100, 0.05, 0.04]], 0.001);
}
// the clock strikes n: a little bell with a tail, every 1.1 s
export function strike(n = 1) {
  const t = now(0.05), out = air(0.45, 'room');
  for (let i = 0; i < n; i++) ring(t + i * 1.1, out, [[784, 2.2, 0.12], [1568, 1.2, 0.05], [2134, 0.8, 0.03], [392, 2.6, 0.04]], 0.003);
}
// palms rubbed together
export function rub() {
  swell(now(), air(0.15, 'room'), { kind: 'white', f: 2200, Q: 0.8, points: [[0.06, 0.12], [0.22, 0.08], [0.32, 0]] });
}
// tea over the brim
export function spill() {
  const t = now(), out = air(0.2, 'room');
  swell(t, out, { kind: 'white', f: 1600, Q: 2, points: [[0.03, 0.25], [0.35, 0.12], [0.6, 0]], sweep: [[0.6, 900]] });
  for (let i = 0; i < 5; i++) ring(t + 0.1 + i * rnd(0.06, 0.12), out, [[rnd(900, 1800), 0.05, 0.03]], 0.002);
}
// the snuffbox's lid: a thin silver click
export function box() {
  const t = now(), out = air(0.2, 'room');
  burst(t, out, { f: 5200, Q: 4, len: 0.012, loud: 0.3 });
  ring(t, out, [[4100, 0.25, 0.05], [6900, 0.15, 0.025], [9300, 0.08, 0.01]], 0.001);
}
// faceted glasses meet
export function glass() {
  const t = now(), out = air(0.35, 'room');
  ring(t, out, [[2350, 0.9, 0.09], [3730, 0.6, 0.05], [5100, 0.35, 0.025]], 0.001);
  ring(t + 0.012, out, [[2480, 0.8, 0.07], [3960, 0.5, 0.04]], 0.001);
}
// water on fire: a splash and the hiss of steam
export function splash(level = 1) {
  const t = now(), out = air(0.4, 'street');
  burst(t, out, { kind: 'pink', f: 600, Q: 0.8, len: 0.35, loud: 0.8 * level, attack: 0.01 });
  swell(t + 0.08, out, { kind: 'white', f: 4500, Q: 0.7, type: 'highpass', points: [[0.15, 0.2 * level], [1.2, 0.1 * level], [2, 0]] });
}
// snow crunching under a foot
export function crunch() {
  const t = now(), out = air(0.25, 'street');
  for (let i = 0; i < 9; i++) burst(t + i * rnd(0.012, 0.025), out, { f: rnd(1800, 4200), Q: 2, len: 0.015, loud: rnd(0.06, 0.16) });
  burst(t, out, { kind: 'brown', f: 300, Q: 1, len: 0.1, loud: 0.25 });
}
// a soft fall into snow
export function thud() {
  const t = now(), out = air(0.3, 'street');
  burst(t, out, { kind: 'brown', f: 110, Q: 0.8, len: 0.3, loud: 1, attack: 0.008 });
  swell(t, out, { kind: 'white', f: 2600, Q: 0.6, points: [[0.03, 0.08], [0.3, 0]] });
}
// a fingernail over rime: a thin rustle
export function scrape() {
  swell(now(), air(0.15, 'room'), { kind: 'white', f: 6000, Q: 1.2, points: [[0.05, 0.07], [0.25, 0.05], [0.4, 0]], sweep: [[0.4, 7500]] });
}

// the dance music from the club's open door: a muffled foxtrot — the accordion's chords off the beat, the bass on it
// (A♭ major: I vi ii V), for `seconds`, then fading
export function dance(seconds = 3) {
  const a = audio(), t = now(0.05), out = air(0.6, 'street'), far = filter({ type: 'lowpass', frequency: 1200, Q: 0.5 }), e = a.createGain();
  far.connect(e).connect(out);
  shape(e.gain, t, [[0.4, 0.4], [seconds, 0.4], [seconds + 1.5, 0]]);
  const BEAT_S = 0.42, CHORDS = [[56, 60, 63], [53, 56, 60], [58, 61, 65], [51, 55, 58]], BASS = [44, 41, 46, 39];
  const voice = (m, at, len, loud, type) => {
    const o = a.createOscillator(), g = a.createGain();
    o.type = type;
    o.frequency.value = hz(m);
    o.detune.value = rnd(-8, 8);
    shape(g.gain, at, [[0.02, loud], [len * 0.7, loud * 0.6], [len, 0]]);
    o.connect(g).connect(far);
    o.start(at);
    o.stop(at + len + 0.05);
  };
  for (let k = 0; k * BEAT_S < seconds + 1.5; k++) {
    const at = t + k * BEAT_S, bar = Math.floor(k / 4) % 4;
    if (k % 2 === 0) voice(BASS[bar] + (k % 4 === 2 ? 7 : 0), at, BEAT_S * 0.9, 0.22, 'triangle');
    else for (const m of CHORDS[bar]) voice(m, at, BEAT_S * 0.6, 0.06, 'sawtooth');
  }
}

// ── the clarinet ───────────────────────────────────────────────────────────────────────────────────────────────────
// one reed: a wave of the odd harmonics (~1/n) with a faint even, the breath's noise, a scoop up into each attack, a
// vibrato of 5 Hz once the note has settled; behind the wall — a low-pass at 1.2 kHz, the room's air. far — through the
// window from the street: still lower (700 Hz), quieter, more air
let reed = null;
function reedWave(a) {
  if (reed) return reed;
  const n = 16, re = new Float32Array(n), im = new Float32Array(n);
  for (let k = 1; k < n; k++) im[k] = k % 2 ? 1 / k : 0.04 / k;
  return (reed = a.createPeriodicWave(re, im));
}
export function clarinet({ times = 1, resolve = false, far = false } = {}) {
  const a = audio(), t0 = now(0.1), out = far ? air(0.9, 'street') : air(0.6, 'room');
  const wall = filter({ type: 'lowpass', frequency: far ? 700 : 1200, Q: 0.5 }), body = filter({ type: 'peaking', frequency: 350, Q: 1, gain: 4 });
  const e = a.createGain();
  e.gain.value = far ? 0.13 : 0.3;
  body.connect(wall).connect(e).connect(out);
  const nodes = new Set(); // (the oscillators sounding: stopped with the handle)
  // one phrase from `at`: → when it is over
  const phrase = (at, whole) => {
    const notes = whole ? [...PHRASE, ...RESOLVED] : [...PHRASE, [BROKEN, 0.08 / PHRASE_BEAT]];
    const o = a.createOscillator(), env = a.createGain(), vib = a.createOscillator(), depth = a.createGain();
    o.setPeriodicWave(reedWave(a));
    vib.frequency.value = 5;
    depth.gain.value = 0;
    vib.connect(depth).connect(o.detune);
    const breath = a.createGain();
    hiss('pink', at, 30).connect(filter({ type: 'bandpass', frequency: 1800, Q: 0.7 })).connect(breath).connect(body);
    breath.gain.setValueAtTime(0, at);
    o.connect(env).connect(body);
    env.gain.setValueAtTime(0, at);
    let s = at;
    notes.forEach(([m, beats], i) => {
      // (the last of the whole phrase slows: a ritardando into the long note)
      const len = beats * PHRASE_BEAT * (whole && i >= notes.length - 3 ? 1.25 : 1), f = hz(m);
      const cut = !whole && i === notes.length - 1; // the seventh: broken off at its first breath
      o.frequency.setValueAtTime(f * 0.985, s); // (the scoop up into it)
      o.frequency.exponentialRampToValueAtTime(f, s + 0.06);
      env.gain.setTargetAtTime(cut ? 0.5 : 0.85, s, 0.025);
      breath.gain.setTargetAtTime(0.05, s, 0.03);
      depth.gain.setTargetAtTime(0, s, 0.02);
      if (!cut && len > 0.5) depth.gain.setTargetAtTime(14, s + 0.35, 0.15);
      if (cut) {
        env.gain.setTargetAtTime(0, s + len, 0.008); // (stops dead)
        breath.gain.setTargetAtTime(0, s + len, 0.01);
      } else if (i < notes.length - 1) env.gain.setTargetAtTime(0.62, s + len - 0.05, 0.02); // (a legato dip)
      s += len;
    });
    if (whole) { env.gain.setTargetAtTime(0, s - 0.6, 0.3); breath.gain.setTargetAtTime(0, s - 0.6, 0.3); }
    for (const n of [o, vib]) { n.start(at); n.stop(s + 1.5); nodes.add(n); n.onended = () => nodes.delete(n); }
    return s;
  };
  let at = t0;
  for (let i = 0; i < times; i++) at = phrase(at, resolve && i === times - 1) + 3;
  return handle(e, e.gain.value, () => { for (const n of nodes) n.stop(); });
}

// ── the march ──────────────────────────────────────────────────────────────────────────────────────────────────────
// the funeral band far off on the hillside: four brass voices (saws with a vibrato, each 10–20 cents off — a little out
// of tune) through a low-pass, the bass drum on the strong beats; slow, F minor; round and round till stopped
const MARCH_BEAT = 1.05; // s
// [melody midi, beats] and the chord under each bar
const MARCH = [
  { notes: [[65, 1], [65, 0.75], [65, 0.25], [65, 2]], chord: [53, 56, 60] },
  { notes: [[68, 0.75], [67, 0.25], [67, 0.75], [65, 0.25], [65, 0.75], [64, 0.25], [65, 1]], chord: [53, 56, 60] },
  { notes: [[65, 1], [65, 0.75], [65, 0.25], [65, 2]], chord: [52, 55, 58] },
  { notes: [[68, 0.75], [67, 0.25], [67, 0.75], [65, 0.25], [65, 0.75], [64, 0.25], [65, 1]], chord: [53, 56, 60] },
];
export function march() {
  const a = audio(), out = a.createGain(), far = filter({ type: 'lowpass', frequency: 900, Q: 0.6 }), t0 = now(0.1);
  out.gain.value = 0;
  to(out.gain, 0.5, 1.5);
  far.connect(out).connect(air(0.8, 'street'));
  const nodes = new Set();
  const brass = (m, at, len, loud, cents) => {
    const o = a.createOscillator(), g = a.createGain(), vib = a.createOscillator(), d = a.createGain();
    o.type = 'sawtooth';
    o.frequency.value = hz(m);
    o.detune.value = cents;
    vib.frequency.value = rnd(4.5, 5.5);
    d.gain.value = 9;
    vib.connect(d).connect(o.detune);
    shape(g.gain, at, [[0.07, loud], [len * 0.8, loud * 0.8], [len, 0]]);
    o.connect(g).connect(far);
    for (const n of [o, vib]) { n.start(at); n.stop(at + len + 0.05); nodes.add(n); n.onended = () => nodes.delete(n); }
  };
  const drum = at => burst(at, far, { kind: 'brown', f: 70, Q: 0.9, len: 0.6, loud: 1.1, attack: 0.004 });
  let next = t0, bar = 0;
  const timer = setInterval(() => {
    while (next < a.currentTime + 1.2) {
      const { notes, chord } = MARCH[bar % MARCH.length];
      let s = next;
      for (const [m, beats] of notes) { brass(m, s, beats * MARCH_BEAT * 0.95, 0.12, rnd(10, 20)); s += beats * MARCH_BEAT; }
      chord.forEach((m, i) => brass(m, next, 4 * MARCH_BEAT * 0.97, 0.06, (i % 2 ? -1 : 1) * rnd(10, 20)));
      drum(next);
      drum(next + 2 * MARCH_BEAT);
      next += 4 * MARCH_BEAT;
      bar++;
    }
  }, 250);
  return handle(out, 0.5, () => { clearInterval(timer); for (const n of nodes) n.stop(); });
}

// the sounds of a step played unseen (jump.js): nothing heard meanwhile — the beds heard from then on as loud as the
// step left them; what was played once is over by then, and a handle begun meanwhile is mute
export function unheard() {
  const levels = {}, none = () => {}, mute = () => ({ loud() {}, stop() {} });
  const bedOf = name => (level = 1) => { levels[name] = level; };
  return {
    sounds: {
      wake: none,
      beds(set = {}) { for (const name in BEDS) levels[name] = set[name] ?? 0; },
      wind: bedOf('wind'), rails: bedOf('rails'), train: bedOf('train'), freight: bedOf('freight'), crossing: bedOf('crossing'),
      room: bedOf('room'), clock: bedOf('clock'), fire: bedOf('fire'), crowd: bedOf('crowd'), pour: bedOf('pour'),
      march: mute,
      horn: none, doors: none, knock: none, dog: none, door: none, creak: none, cough: none, tick: none, strike: none,
      rub: none, spill: none, box: none, glass: none, splash: none, crunch: none, thud: none, scrape: none,
      clarinet: mute, dance: none,
    },
    wake() { for (const [name, level] of Object.entries(levels)) BEDS[name](level, 1); },
  };
}
