// The sounds of «Дама с собачкой», made in the page (Web Audio): nothing to load; as loud as the page's "sounds"
// slider says (MooodVolume.output). The page may be heard only after the player's first touch: game.js wakes it then;
// till then its time stands, and what was asked for begins at the touch. (game.md §8 «Звуки страницы».)
//   wake() — the page may be heard from now on (called on the first touch)
//   pause(on) — all of it stands while the play is paused (ui.js ⏸) and goes on from there after
//   unheard() → {sounds, wake()} — the same, unheard, for a step played unseen (jump.js); a step plays them as g.sound
// Two airs a sound goes out into: the open air (light, 1.8 s — the quay, the garden, the station, the street) and a
// room (0.6 s — the hotel rooms, the theatre, a hall).
// The beds — what lasts; one of each for the page, as loud as `level` (0 — silence, and the bed is taken down),
// getting there over `seconds` (a bed may be called by itself too — a gust: wind(0.7, 1)):
//   beds(levels, seconds) — the named beds to their levels, every other one to silence (g.beds)
//   crickets — 4–5 kHz trills out of step · wires — the telegraph wires' hum, 100 and 150 Hz beating · room — a clock
//   ticking, a faint hum
//   wind — low wind in random gusts · snow — the snow's silence: a low wind barely there, far bells now and then ·
//   thaw — rare drops · cicadas — three ringing tones trembling, swelling and fading (these four: ambience.js)
//   recordings (sounds/): sea — the sea from the shore · crowd — voices on the pier · steam — a steam engine at the
//   station · hall — the theatre before the curtain · weep — quiet weeping
// Played till stopped — a handle {loud(v, seconds), stop(seconds)}: as loud as v (0…1) of its own; stop fades it out:
//   band() — a brass band far off in the city garden: the waltz «Дунайские волны» (Ion Ivanovici, 1880; public domain)
//   piano(tune, {wall}) — a piano heard through a window and the snow: tune 'waltz' — the same waltz, 'etude' — scales
//     and a simple study; wall: true — through a wall, duller and quieter
// Played once:
//   tuning · bark · yap · growl · clink · heart · knife · horn · bell(level) · whistle(level) · wheels · sleigh · gate ·
//   door · pour · spill · paper · watch
import { built, kit } from './ambience.js';

// The waltz, its first theme twice and its second strain, from Ivanovici's tune (A minor) set in F minor — the world's
// key (A_FLAT_MAJOR_F_MINOR): four semitones down, nothing else changed. In beats of 3/4 from the first downbeat; the
// pickup of the next round is the last note. [beat, beats, midi]
const WALTZ = [[0, 4, 60], [4, 1, 64], [5, 1, 65], [6, 4, 67], [10, 1, 64], [11, 1, 60], [12, 4, 68], [16, 1, 67],
  [17, 1, 65], [18, 4, 72], [23, 1, 72], [24, 4, 73], [28, 1, 72], [29, 1, 70], [30, 4, 72], [34, 1, 70], [35, 1, 68],
  [36, 4, 67], [40, 1, 68], [41, 1, 67], [42, 4, 65], [47, 1, 60], [48, 4, 60], [52, 1, 64], [53, 1, 65], [54, 4, 67],
  [58, 1, 64], [59, 1, 60], [60, 4, 68], [64, 1, 67], [65, 1, 65], [66, 4, 72], [71, 1, 72], [72, 4, 73], [76, 1, 72],
  [77, 1, 70], [78, 4, 72], [82, 1, 70], [83, 1, 68], [84, 4, 67], [88, 1, 68], [89, 1, 67], [90, 3, 65],
  [93, 0.25, 67], [93.5, 0.25, 68], [94, 0.25, 70], [94.5, 0.25, 72], [95, 0.25, 73], [95.5, 0.25, 75],
  [96, 0.5, 77], [97, 0.5, 77], [98, 0.5, 77], [99, 0.5, 77], [100, 0.5, 77], [101, 0.5, 77], [102, 1, 77], [103, 1.5, 75],
  [104.5, 0.5, 74], [105, 3, 75], [108, 0.5, 73], [109, 0.5, 73], [110, 0.5, 73], [111, 0.5, 73], [112, 0.5, 73],
  [113, 0.5, 73], [114, 1, 73], [115, 1.5, 72], [116.5, 0.5, 71], [117, 3, 72], [120, 0.5, 70], [121, 0.5, 70],
  [122, 0.5, 70], [123, 0.5, 70], [124, 0.5, 70], [125, 0.5, 70], [126, 1, 70], [127, 1.5, 68], [128.5, 0.5, 67],
  [129, 2, 65], [131, 1, 77], [132, 1, 73], [133, 1, 70], [134, 0.875, 67], [134.875, 0.125, 70], [135, 2, 68],
  [137, 1, 67], [138, 2, 65], [140, 1, 60]];
// the harmony of each bar (47), as in A minor before it was set down — the bass and the chord the after-beats play
const A = { Am: [45, [57, 60, 64]], E: [40, [56, 59, 64]], E7: [40, [56, 59, 62]], Dm: [38, [57, 62, 65]], D7: [38, [54, 57, 60]], G: [43, [55, 59, 62]] };
const THEME = ['Am', 'E', 'E', 'E', 'Am', 'Am', 'Am', 'Am', 'Dm', 'Dm', 'E7', 'E7', 'E7', 'E7', 'Am', 'Am'];
const HARMONY = [...THEME, ...THEME.slice(0, 15), 'E7', 'Am', 'Am', 'D7', 'G', 'Dm', 'Dm', 'E', 'E', 'Dm', 'Dm', 'Am', 'Am', 'Dm', 'E7', 'Am']
  .map(c => [A[c][0] - 4, A[c][1].map(m => m - 4)]);
const BARS = HARMONY.length; // 47

// Anna's study (game.md §8: 'etude'): A♭ major up and down two octaves, a broken-chord study in A♭ (I IV V⁷ I), F minor's
// harmonic scale up and down, a rest — round and round. [beat, beats, midi] (right hand), and the left hand's chords
const ETUDE = (() => {
  const notes = [], left = [];
  let t = 0;
  const run = (steps, from, len) => { let m = from; for (const s of steps) { notes.push([t, len, m]); m += s; t += len; } notes.push([t, len * 2, m]); t += len * 2; };
  const major = [2, 2, 1, 2, 2, 2, 1], harmonic = [2, 1, 2, 2, 1, 3, 1];
  const up = scale => [...scale, ...scale], down = scale => [...scale, ...scale].reverse().map(s => -s);
  left.push([t, 8, [44, 51, 56]]);
  run(up(major), 56, 0.5); run(down(major), 80, 0.5);
  t += 1;
  for (const [chord, bass] of [[[60, 63, 68], 44], [[61, 65, 68], 49], [[67, 70, 73], 39], [[60, 63, 68], 44]]) {
    left.push([t, 4, [bass, bass + 12]]);
    for (let r = 0; r < 2; r++) for (const i of [0, 2, 1, 2]) { notes.push([t, 0.5, chord[i]]); t += 0.5; }
  }
  t += 1;
  left.push([t, 8, [41, 48, 53]]);
  run(up(harmonic), 53, 0.5); run(down(harmonic), 77, 0.5);
  t += 3;
  return { notes, left, beats: t };
})();

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
    // the open air: long and light; a room: short, a little dull
    for (const [name, seconds, curve, dark, back] of [['open', 1.8, 2.6, 0.3, 0.7], ['room', 0.6, 2, 0.45, 0.85]]) {
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

// where a sound goes: straight out, and `wet` of it into a room's air ('open' or 'room')
const airs = {};
function air(wet, room = 'open') {
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
function drift(param, rate, depth, type = 'sine') {
  const a = audio(), o = a.createOscillator(), g = a.createGain();
  o.type = type;
  o.frequency.value = rate;
  g.gain.value = depth;
  o.connect(g).connect(param);
  o.start();
  return o;
}
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
// a burst of noise through a band, dying away: a click, a thud, a knock
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
// a drop of water: a short note bending
function drop(t, dest, f, bend, loud, len = 0.14) {
  const a = audio(), o = a.createOscillator(), e = a.createGain();
  o.frequency.setValueAtTime(f, t);
  o.frequency.exponentialRampToValueAtTime(f * bend, t + 0.05);
  e.gain.setValueAtTime(0, t);
  e.gain.linearRampToValueAtTime(loud, t + 0.003);
  e.gain.exponentialRampToValueAtTime(0.0005, t + len);
  o.connect(e).connect(dest);
  o.start(t);
  o.stop(t + len + 0.04);
}
// a voice's syllable: noise through two formants (a vowel), up and down in `len` — far voices, a sob, a bark's throat
function syllable(t, dest, { f1, f2, len, loud, kind = 'pink', pitch, fall = rnd(0.85, 1.1) }) {
  const a = audio(), e = a.createGain(), src = a.createGain();
  if (pitch) { // voiced: a buzz under the breath
    const o = a.createOscillator();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(pitch, t);
    o.frequency.linearRampToValueAtTime(pitch * fall, t + len);
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
// small bells: a sleigh's, far or near — a few quick jingles
function jingle(t, dest, n, loud) {
  for (let i = 0; i < n; i++) {
    const at = t + i * rnd(0.06, 0.13), f = rnd(2600, 4200);
    ring(at, dest, [[f, 0.35, loud * rnd(0.5, 1)], [f * 1.48, 0.22, loud * 0.4], [f * 2.31, 0.12, loud * 0.2]], 0.002);
  }
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
      sway: (param, rate, depth, type) => keep(drift(param, rate, depth, type)),
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

// the sea: a recording
export function sea(level = 1, seconds = 2) { bed('sea', 0.05, 'open', recorded(['sea-shore-517945.mp3', 'sea-shore-240645.mp3'], 2.24), level, seconds); }

export function cicadas(level = 1, seconds = 2) { bed('cicadas', 0.25, 'open', ({ a, out, keep, every }) => built.cicadas(kit(a, keep, every), out, 1.26), level, seconds); }

// a crowd: a recording
export function crowd(level = 1, seconds = 2) { bed('crowd', 0.05, 'open', recorded(['crowd-550916.mp3'], 0.48), level, seconds); }
// a theatre hall: a recording
export function hall(level = 1, seconds = 2) { bed('hall', 0.05, 'open', recorded(['hall-735472.mp3', 'hall-850562.mp3'], 0.39), level, seconds); }

export function wind(level = 1, seconds = 2) { bed('wind', 0.2, 'open', ({ a, out, keep, every }) => built.wind(kit(a, keep, every), out, 1.45), level, seconds); }

export function crickets(level = 1, seconds = 2) {
  bed('crickets', 0.3, 'open', ({ a, t, keep, sway, out }) => {
    // four of them, 4–5 kHz: each a sine trilled ~30 times a second, in chirps of its own rhythm — out of step
    for (const [f, trill, chirp, loud] of [[4200, 31, 1.7, 0.05], [4550, 27, 2.3, 0.04], [4850, 34, 1.3, 0.035], [4400, 29, 2.9, 0.03]]) {
      const o = keep(a.createOscillator()), trills = a.createGain(), ch = a.createGain(), amp = a.createGain();
      o.frequency.value = f;
      trills.gain.value = 0.5;
      ch.gain.value = 0.5;
      amp.gain.value = loud;
      o.connect(trills).connect(ch).connect(amp).connect(out);
      o.start(t);
      sway(trills.gain, trill, 0.5, 'square');
      sway(ch.gain, chirp, 0.5, 'square');
      sway(amp.gain, rnd(0.03, 0.08), loud * 0.5);
    }
  }, level, seconds);
}

export function wires(level = 1, seconds = 2) {
  bed('wires', 0.15, 'open', ({ a, t, keep, sway, out }) => {
    // 100 and 150 Hz, each with a partner a little off: a slow beating hum
    for (const [f, v] of [[100, 0.05], [100.6, 0.04], [150, 0.03], [150.4, 0.025]]) {
      const o = keep(a.createOscillator()), g = a.createGain();
      o.frequency.value = f;
      g.gain.value = v;
      o.connect(g).connect(out);
      o.start(t);
    }
  }, level, seconds);
}

// a steam engine: a recording
export function steam(level = 1, seconds = 2) { bed('steam', 0.05, 'open', recorded(['steam-473904.mp3'], 1.32), level, seconds); }

export function snow(level = 1, seconds = 2) { bed('snow', 0.4, 'open', ({ a, out, keep, every }) => built.snow(kit(a, keep, every), out), level, seconds); }

export function thaw(level = 1, seconds = 2) { bed('thaw', 0.35, 'open', ({ a, out, keep, every }) => built.thaw(kit(a, keep, every), out, 1.29), level, seconds); }

export function room(level = 1, seconds = 2) {
  bed('room', 0.25, 'room', ({ a, t, out, noise, every }) => {
    // a clock on the wall: tick and tock, once a second; under it a hum barely heard
    const hum = a.createGain();
    hum.gain.value = 0.05;
    noise('brown').connect(filter({ type: 'lowpass', frequency: 140 })).connect(hum).connect(out);
    let next = t + 0.2, k = 0;
    every(() => {
      const now = a.currentTime;
      if (next < now) next = now;
      for (; next < now + 0.4; next += 1, k++) {
        const f = k % 2 ? 2300 : 2600;
        ring(next, out, [[f, 0.05, 0.05], [f * 1.7, 0.03, 0.02]], 0.001);
        burst(next, out, { f: 900, Q: 1.5, len: 0.02, loud: 0.06 });
      }
    });
  }, level, seconds);
}

// weeping: a recording
export function weep(level = 1, seconds = 2) { bed('weep', 0.05, 'open', recorded(['weep-171947.mp3', 'weep-172738.mp3'], 0.48), level, seconds); }

const BEDS = { sea, cicadas, crowd, wind, crickets, wires, steam, snow, thaw, room, hall, weep };
export function beds(levels = {}, seconds = 2) {
  for (const [name, play] of Object.entries(BEDS)) play(levels[name] ?? 0, seconds);
}

// ── played till stopped ─────────────────────────────────────────────────────────────────────────────────────────
// `out` is its loudness (base — its own); stopping, it is closed once silent
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
// a round of music scheduled ahead as its time comes: plan(at, k) for each beat k (from 0) whose time is near
function rounds(a, t0, beat, plan) {
  let k = 0, stopped = false;
  const go = () => {
    if (stopped) return;
    const now = a.currentTime;
    for (; t0 + k * beat < now + 1.2; k++) {
      const at = t0 + k * beat;
      if (at >= now - 0.05) plan(at, k);
    }
  };
  go();
  const timer = setInterval(go, 250);
  return () => { stopped = true; clearInterval(timer); };
}

// a brass voice: two saws a little apart, the lip's bite in the first 40 ms, a low-pass that opens with the breath
function brass(dest, m, at, len, v, { bright = 1800, vibrato = 0 } = {}) {
  const a = audio(), e = a.createGain(), lp = filter({ type: 'lowpass', frequency: bright * 0.5, Q: 0.8 });
  const f = hz(m), oscs = [];
  for (const d of [-5, 6]) {
    const o = a.createOscillator();
    o.type = 'sawtooth';
    o.frequency.value = f;
    o.detune.value = d;
    o.connect(lp);
    o.start(at);
    o.stop(at + len + 0.15);
    oscs.push(o);
  }
  if (vibrato && len > 0.6) {
    const w = a.createOscillator(), wd = a.createGain();
    w.frequency.value = 5.2;
    wd.gain.setValueAtTime(0, at);
    wd.gain.linearRampToValueAtTime(vibrato, at + 0.35);
    w.connect(wd);
    for (const o of oscs) wd.connect(o.detune);
    w.start(at);
    w.stop(at + len + 0.15);
  }
  lp.frequency.setValueAtTime(bright * 0.4, at);
  lp.frequency.linearRampToValueAtTime(bright, at + 0.04);
  lp.frequency.linearRampToValueAtTime(bright * 0.7, at + Math.min(len, 0.3));
  e.gain.setValueAtTime(0, at);
  e.gain.linearRampToValueAtTime(v, at + 0.03);
  e.gain.linearRampToValueAtTime(v * 0.75, at + Math.min(len * 0.5, 0.25));
  e.gain.setValueAtTime(v * 0.75, at + Math.max(0.03, len - 0.06));
  e.gain.linearRampToValueAtTime(0, at + len + 0.1);
  lp.connect(e).connect(dest);
}
// the band in the garden: the cornet's tune (with a slow vibrato), the tuba's bass on each bar's first beat — the root
// and the fifth by turns —, the horns' chord on the second and third («ум-па-па»), a drum's soft thud under the bass;
// far, under a low-pass, much of it the garden's air. ♩ = 160
export function band() {
  const a = audio(), out = a.createGain(), t0 = a.currentTime + 0.2, beat = 0.375, round = BARS * 3;
  out.gain.value = 0;
  out.connect(air(0.6));
  const far = filter({ type: 'lowpass', frequency: 1500, Q: 0.5 });
  far.connect(out);
  const tune = (at, k) => {
    const b = k % round;
    for (const [s, len, m] of WALTZ) if (s >= b && s < b + 1) brass(far, m, at + (s - b) * beat, Math.max(0.12, len * beat - 0.04), 0.1, { bright: 2400, vibrato: 12 });
    const bar = Math.floor(b / 3), [bass, chord] = HARMONY[bar], on = b % 3;
    if (on === 0) {
      brass(far, bar % 2 ? (bass + 7 > 43 ? bass - 5 : bass + 7) : bass, at, beat * 0.9, 0.14, { bright: 500 });
      burst(at, far, { kind: 'brown', f: 80, Q: 1, len: 0.22, loud: 0.5 });
    } else for (const m of chord) brass(far, m, at, beat * 0.55, 0.035, { bright: 1300 });
  };
  const stop = rounds(a, t0, beat, tune);
  to(out.gain, 0.7, 3);
  return handle(out, 0.7, stop);
}

// a piano's note: a hammer's knock and partials 1…7, the higher ones a little sharp and dying sooner; the pedal lets it
// ring past its length
function key(dest, m, at, len, v) {
  const a = audio(), f = hz(m), sustain = Math.min(4, 1.2 + len) * (m < 60 ? 1.4 : 1);
  for (let n = 1; n <= 7; n++) {
    const fn = f * n * (1 + 0.0004 * n * n), d = sustain / (0.6 + n * 0.4), loud = (v / n ** 1.35) * (n === 1 ? 1 : 0.8);
    if (fn > 9000) break;
    const o = a.createOscillator(), e = a.createGain();
    o.frequency.value = fn;
    e.gain.setValueAtTime(0, at);
    e.gain.linearRampToValueAtTime(loud, at + 0.004);
    e.gain.exponentialRampToValueAtTime(loud * 0.35, at + Math.min(0.25, d * 0.2));
    e.gain.exponentialRampToValueAtTime(0.0003, at + d);
    o.connect(e).connect(dest);
    o.start(at);
    o.stop(at + d + 0.05);
  }
  burst(at, dest, { f: 1800, Q: 0.8, len: 0.025, loud: v * 0.25 });
}
// the piano: `tune` 'waltz' — the garden's waltz, the left hand's «ум-па-па», ♩ = 132; 'etude' — her scales and study,
// ♩ = 104; heard through a window and the snow (a low-pass at 1.2 kHz) — or, wall: true, through a wall (600 Hz, quieter)
export function piano(tune = 'waltz', { wall = false } = {}) {
  const a = audio(), out = a.createGain(), t0 = a.currentTime + 0.2;
  out.gain.value = 0;
  out.connect(air(wall ? 0.5 : 0.35, wall ? 'room' : 'open'));
  const dull = filter({ type: 'lowpass', frequency: wall ? 600 : 1200, Q: 0.4 });
  dull.connect(out);
  let stop;
  if (tune === 'etude') {
    const beat = 0.58, round = Math.ceil(ETUDE.beats);
    stop = rounds(a, t0, beat, (at, k) => {
      const b = k % round;
      for (const [s, len, m] of ETUDE.notes) if (s >= b && s < b + 1) key(dull, m, at + (s - b) * beat + rnd(-0.01, 0.015), len * beat, 0.16);
      for (const [s, len, chord] of ETUDE.left) if (s >= b && s < b + 1) for (const m of chord) key(dull, m, at + (s - b) * beat, len * beat, 0.08);
    });
  } else {
    const beat = 0.45, round = BARS * 3;
    stop = rounds(a, t0, beat, (at, k) => {
      const b = k % round;
      for (const [s, len, m] of WALTZ) if (s >= b && s < b + 1) key(dull, m, at + (s - b) * beat + rnd(-0.008, 0.012), len * beat, 0.17);
      const bar = Math.floor(b / 3), [bass, chord] = HARMONY[bar], on = b % 3;
      if (on === 0) key(dull, bar % 2 ? bass + 7 : bass, at, beat, 0.12);
      else for (const m of chord) key(dull, m, at, beat * 0.6, 0.045);
    });
  }
  const base = wall ? 0.45 : 0.9;
  to(out.gain, base, 2);
  return handle(out, base, stop);
}

// ── played once ─────────────────────────────────────────────────────────────────────────────────────────────────
const now = (d = 0.02) => audio().currentTime + d;

// a creak: a rasp through the wood's (or the hinge's) resonances, its pitch wavering
function creakAt(t, dest, loud, { from = 120, to: peak = 180, len = 0.5, bands = [[700, 8], [1500, 6]] } = {}) {
  const a = audio(), o = a.createOscillator(), e = a.createGain();
  o.type = 'sawtooth';
  o.frequency.setValueAtTime(from, t);
  o.frequency.linearRampToValueAtTime(peak, t + len * 0.6);
  o.frequency.linearRampToValueAtTime(from * 1.15, t + len);
  for (const [f, Q] of bands) o.connect(filter({ type: 'bandpass', frequency: f, Q })).connect(e);
  shape(e.gain, t, [[0.05, loud], [len * 0.6, loud * 0.7], [len, 0]]);
  e.connect(dest);
  o.start(t);
  o.stop(t + len + 0.05);
}

// the theatre's orchestra tuning, ~6 s: the oboe's A, then strings and winds on A and its fifths, coming in out of
// tune and finding it (the A is the orchestra's, not the world's key: so orchestras tune)
export function tuning() {
  const a = audio(), t = now(0.05), out = air(0.45, 'room'), lp = filter({ type: 'lowpass', frequency: 2600 });
  lp.connect(out);
  const voice = (at, f, len, v, type, off) => {
    const o = a.createOscillator(), e = a.createGain(), w = a.createOscillator(), wd = a.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f * (1 + off), at);
    o.frequency.linearRampToValueAtTime(f, at + len * 0.6);
    w.frequency.value = rnd(4.5, 6);
    wd.gain.value = type === 'sawtooth' ? 9 : 4;
    w.connect(wd).connect(o.detune);
    shape(e.gain, at, [[0.25, v], [len * 0.8, v * 0.8], [len, 0]]);
    o.connect(filter({ type: 'lowpass', frequency: type === 'square' ? 1400 : 2200 })).connect(e).connect(lp);
    o.start(at); w.start(at);
    o.stop(at + len + 0.05); w.stop(at + len + 0.05);
  };
  voice(t, 440, 2.6, 0.05, 'square', 0);
  for (let i = 0; i < 9; i++) {
    const f = [440, 440, 220, 293.66, 329.63, 659.26, 146.83, 880, 196][i];
    voice(t + 0.8 + rnd(0, 3.2), f, rnd(1.5, 2.8), rnd(0.02, 0.04), i % 3 ? 'sawtooth' : 'triangle', rnd(-0.015, 0.015));
  }
  for (let i = 0; i < 3; i++) { // a run on a clarinet, somewhere
    const at = t + rnd(1.5, 4.5);
    for (let k = 0; k < 6; k++) voice(at + k * 0.09, hz(64 + [0, 2, 4, 5, 7, 9][k]), 0.12, 0.015, 'square', 0);
  }
}
// the spitz: a bark (a short noisy burst through 800–1500 Hz over a small throat's tone); twice or three times
function barks(t, dest, n, { f = 1100, pitch = 560, gap = 0.22, loud = 0.4 } = {}) {
  for (let i = 0; i < n; i++) {
    const at = t + i * gap * rnd(0.9, 1.15), p = pitch * rnd(0.95, 1.08);
    syllable(at, dest, { f1: f * 0.7, f2: f * 1.35, len: 0.11, loud, kind: 'white', pitch: p, fall: 0.7 });
    burst(at, dest, { f, Q: 1.6, len: 0.07, loud: loud * 0.5 });
  }
}
export function bark() { barks(now(), air(0.25), 2 + Math.floor(Math.random() * 2)); }
// glad: higher, quick, two by two
export function yap() {
  const t = now(), out = air(0.25);
  barks(t, out, 2, { f: 1400, pitch: 760, gap: 0.12, loud: 0.33 });
  barks(t + 0.45, out, 2, { f: 1450, pitch: 800, gap: 0.12, loud: 0.3 });
}
// a growl: low, 120–200 Hz, trembling, a second
export function growl() {
  const a = audio(), t = now(), out = air(0.2), o = a.createOscillator(), e = a.createGain(), trem = a.createOscillator(), td = a.createGain();
  o.type = 'sawtooth';
  o.frequency.setValueAtTime(150, t);
  o.frequency.linearRampToValueAtTime(180, t + 0.4);
  o.frequency.linearRampToValueAtTime(130, t + 1);
  trem.frequency.value = 24;
  td.gain.value = 0.5;
  const g = a.createGain();
  g.gain.value = 0.5;
  trem.connect(td).connect(g.gain);
  o.connect(filter({ type: 'bandpass', frequency: 420, Q: 1.5 })).connect(g).connect(e);
  hiss('pink', t, 1.1).connect(filter({ type: 'bandpass', frequency: 300, Q: 2 })).connect(g);
  shape(e.gain, t, [[0.15, 0.35], [0.8, 0.3], [1, 0]]);
  e.connect(out);
  o.start(t); trem.start(t);
  o.stop(t + 1.05); trem.stop(t + 1.05);
}
// the lorgnette dropped on the boards: two short bright knocks
export function clink() {
  const t = now(), out = air(0.3);
  for (const [s, v] of [[0, 1], [0.16, 0.55]]) {
    ring(t + s, out, [[2950, 0.18, 0.06 * v], [4330, 0.12, 0.035 * v], [6100, 0.06, 0.02 * v]], 0.001);
    burst(t + s, out, { kind: 'brown', f: 500, Q: 1, len: 0.05, loud: 0.3 * v });
  }
}
// her heart: two dull beats
export function heart() {
  const a = audio(), t = now(), out = air(0.05);
  for (const [s, v] of [[0, 0.5], [0.24, 0.35]]) {
    const o = a.createOscillator(), e = a.createGain();
    o.frequency.setValueAtTime(62, t + s);
    o.frequency.exponentialRampToValueAtTime(38, t + s + 0.18);
    e.gain.setValueAtTime(0, t + s);
    e.gain.linearRampToValueAtTime(v, t + s + 0.012);
    e.gain.exponentialRampToValueAtTime(0.0005, t + s + 0.22);
    o.connect(e).connect(out);
    o.start(t + s);
    o.stop(t + s + 0.25);
  }
}
// the knife in the melon: a short wet crunch through 1–3 kHz
export function knife() {
  const a = audio(), t = now(), out = air(0.2, 'room'), e = a.createGain(), len = rnd(0.18, 0.26);
  hiss('white', t, len + 0.05).connect(filter({ type: 'bandpass', frequency: rnd(1400, 2200), Q: 0.9 })).connect(e).connect(out);
  e.gain.setValueAtTime(0, t);
  for (let s = 0; s < len; s += rnd(0.012, 0.03)) e.gain.linearRampToValueAtTime(rnd(0.05, 0.22), t + s);
  e.gain.linearRampToValueAtTime(0, t + len);
  burst(t + len * 0.3, out, { kind: 'brown', f: 700, Q: 1, len: 0.06, loud: 0.15 });
}
// the steamer's horn: two saws, F and B♭ (175 and 233 Hz), low-passed, 1.5 s, far over the water
export function horn() {
  const a = audio(), t = now(0.05), e = a.createGain(), lp = filter({ type: 'lowpass', frequency: 900, Q: 0.7 });
  for (const f of [174.6, 233.1]) {
    const o = a.createOscillator();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(f * 0.97, t);
    o.frequency.linearRampToValueAtTime(f, t + 0.25);
    o.connect(lp);
    o.start(t);
    o.stop(t + 1.7);
  }
  shape(e.gain, t, [[0.2, 0.09], [1.3, 0.08], [1.6, 0]]);
  lp.connect(e).connect(air(0.75));
}
// a bell: the station's bell or the theatre's — three strokes of a metal tone (partials not in tune with one another),
// on E♭ — the world's key's fifth
export function bell(level = 1) {
  const t = now(), out = air(0.5);
  const f = 622.25;
  for (let i = 0; i < 3; i++) ring(t + i * 0.55, out, [[f, 1.8, 0.07 * level], [f * 2.01, 1.1, 0.035 * level], [f * 2.76, 0.8, 0.03 * level], [f * 5.4, 0.3, 0.012 * level]], 0.002);
}
// the engine's whistle: a saw through a band, 1.2 s, on E♭ (≈ 622 Hz)
export function whistle(level = 1) {
  const a = audio(), t = now(), out = air(0.6), o = a.createOscillator(), e = a.createGain();
  o.type = 'sawtooth';
  o.frequency.setValueAtTime(590, t);
  o.frequency.linearRampToValueAtTime(622, t + 0.15);
  o.connect(filter({ type: 'bandpass', frequency: 1250, Q: 2 })).connect(e);
  swell(t, e, { kind: 'white', f: 2500, Q: 2, points: [[0.1, 0.2], [1.1, 0.15], [1.25, 0]] });
  shape(e.gain, t, [[0.08, 0.09 * level], [1.05, 0.08 * level], [1.25, 0]]);
  e.connect(out);
  o.start(t);
  o.stop(t + 1.3);
}
// the train moving off, ~8 s: the wheels knocking on the rails' joints (two knocks a car), quicker and quicker, going
// away; the engine's puffs at first
export function wheels() {
  const t = now(0.05), out = air(0.45);
  let s = 0, gap = 1.1;
  while (s < 8) {
    const v = 0.5 * Math.min(1, 0.4 + s / 3) * Math.max(0, 1 - Math.max(0, s - 3.5) / 4.5);
    for (const d of [0, 0.13]) {
      burst(t + s + d, out, { kind: 'brown', f: 220, Q: 1.2, len: 0.09, loud: v });
      burst(t + s + d, out, { f: 2400, Q: 2, len: 0.02, loud: v * 0.15 });
    }
    s += gap;
    gap = Math.max(0.36, gap * 0.86);
  }
  for (let i = 0; i < 4; i++) swell(t + i * 0.9, out, { kind: 'white', type: 'highpass', f: 1500, Q: 0.7, points: [[0.05, 0.2 * (1 - i / 5)], [0.5, 0]] });
}
// a sleigh going by left to right: its bells, the runners' hiss on the snow, the horse's hooves muffled
export function sleigh() {
  const a = audio(), t = now(0.05), pan = a.createStereoPanner(), e = a.createGain(), len = 4.5;
  pan.pan.setValueAtTime(-0.9, t);
  pan.pan.linearRampToValueAtTime(0.9, t + len);
  shape(e.gain, t, [[len * 0.45, 1], [len * 0.6, 1], [len, 0]], 0.1);
  e.connect(pan).connect(air(0.4));
  for (let s = 0; s < len; s += rnd(0.18, 0.3)) jingle(t + s, e, 2, 0.05);
  swell(t, e, { kind: 'pink', f: 2600, Q: 0.6, points: [[0.6, 0.06], [len - 0.6, 0.07], [len, 0]] });
  for (let s = 0.1; s < len; s += 0.33) burst(t + s, e, { kind: 'brown', f: 260, Q: 1, len: 0.06, loud: 0.12 });
}
// the gate: its hinge creaks, the latch knocks
export function gate() {
  const t = now(), out = air(0.4);
  creakAt(t, out, 0.22, { from: 260, to: 380, len: 0.85, bands: [[900, 9], [1700, 7], [2600, 6]] });
  burst(t + 0.9, out, { kind: 'brown', f: 300, Q: 1.2, len: 0.08, loud: 0.5 });
  ring(t + 0.9, out, [[1500, 0.15, 0.03], [2700, 0.08, 0.015]]);
}
// a door: a short creak, and it shuts softly
export function door() {
  const t = now(), out = air(0.4, 'room');
  creakAt(t, out, 0.14, { from: 150, to: 210, len: 0.45 });
  burst(t + 0.55, out, { kind: 'brown', f: 110, Q: 0.9, len: 0.25, loud: 0.7, attack: 0.004 });
  burst(t + 0.56, out, { f: 900, Q: 2, len: 0.03, loud: 0.06 });
}
// tea from the samovar's tap into the glass, 2 s: running water, its tone rising as the glass fills
export function pour() {
  const a = audio(), t = now(), out = air(0.25, 'room');
  swell(t, out, { kind: 'white', f: 650, Q: 3, points: [[0.1, 0.12], [1.8, 0.1], [2, 0]], sweep: [[2, 1250]] });
  for (let s = 0.05; s < 1.95; s += rnd(0.03, 0.08)) drop(t + s, out, rnd(700, 1100) * (1 + s * 0.35), rnd(1.1, 1.4), rnd(0.01, 0.03), 0.06);
}
// spilt into the saucer: a short hiss of drops
export function spill() {
  const t = now(), out = air(0.25, 'room');
  swell(t, out, { kind: 'white', type: 'highpass', f: 2500, Q: 0.7, points: [[0.03, 0.12], [0.5, 0]] });
  for (let i = 0; i < 9; i++) drop(t + rnd(0, 0.45), out, rnd(1500, 3000), 0.7, rnd(0.02, 0.05), 0.08);
}
// a sheet unfolded or folded
export function paper() {
  const a = audio(), t = now(0.01), e = a.createGain(), len = rnd(0.4, 0.6);
  hiss('white', t, len + 0.1).connect(filter({ type: 'bandpass', frequency: 3200, Q: 0.7 }))
    .connect(filter({ type: 'highpass', frequency: 1300 })).connect(e).connect(air(0.1, 'room'));
  e.gain.setValueAtTime(0, t);
  for (let s = 0; s < len; s += rnd(0.03, 0.09)) {
    e.gain.linearRampToValueAtTime(rnd(0.09, 0.29), t + s + 0.008);
    e.gain.linearRampToValueAtTime(0.04, t + s + 0.025);
  }
  e.gain.linearRampToValueAtTime(0, t + len);
}
// the pocket watch: its lid clicks open, then two seconds of its quick quiet ticking
export function watch() {
  const t = now(), out = air(0.15, 'room');
  burst(t, out, { f: 3200, Q: 2, len: 0.02, loud: 0.3 });
  ring(t, out, [[3700, 0.12, 0.05], [5900, 0.07, 0.025]], 0.001);
  for (let s = 0.35; s < 2.35; s += 0.2) ring(t + s, out, [[4200, 0.025, 0.025], [6300, 0.015, 0.01]], 0.001);
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
      sea: bedOf('sea'), cicadas: bedOf('cicadas'), crowd: bedOf('crowd'), wind: bedOf('wind'), crickets: bedOf('crickets'),
      wires: bedOf('wires'), steam: bedOf('steam'), snow: bedOf('snow'), thaw: bedOf('thaw'), room: bedOf('room'),
      hall: bedOf('hall'), weep: bedOf('weep'),
      band: mute, piano: mute,
      tuning: none, bark: none, yap: none, growl: none, clink: none, heart: none, knife: none, horn: none, bell: none,
      whistle: none, wheels: none, sleigh: none, gate: none, door: none, pour: none, spill: none, paper: none, watch: none,
    },
    wake() { for (const [name, level] of Object.entries(levels)) BEDS[name](level, 1); },
  };
}
