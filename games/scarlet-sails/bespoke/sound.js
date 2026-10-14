// Sounds of the game's own, made in the page (Web Audio): nothing to load; they are as loud as the page's "sounds" slider
// says (MooodVolume.output). The page may be heard only after the
// player's first touch: game.js wakes it then; till then its time stands, and what was asked for begins at the touch.
//   wake() — the page may be heard from now on (called on the first touch)
//   pause(on) — all of it stands while the play is paused (bespoke.pause: ui.js ⏸) and goes on from there after — its
//     sounds' own time (the audio's clock) stands with the play's
//   unheard() → {sounds, wake()} — the same, unheard, for a step played unseen (jump.js); a step plays them as g.sound
// The beds — what lasts; one of each for the page, as loud as `level` (0 — silence, and the bed is taken down),
// getting there over `seconds`:
//   beds(levels, seconds) — the named beds to their levels, every other one to silence (g.beds)
//   sea(level, seconds) — the sea from the shore: its low body, a wave every 7–9 s, the foam hissing back
//   stream(level, seconds) — a brook over stones
//   wind(level, seconds) — wind in the rigging, wandering
//   storm(level, seconds) — a gale, lower and harder, and the waves slamming
//   campfire(level, seconds) · hearth(level, seconds) — a fire crackling: in the open; in the castle's great fireplace
//   breath(level, seconds) — a sleeper breathing, in and out in 3.5 s; the higher the level, the quicker and the
//     less even (she stirs)
//   orchestra(level, seconds) — strings holding the chords under the motif, round and round; the level opens their
//     tone and brings more of them in
// Played once:
//   motif() — the sail's motif: four rising notes (D, F#, A, D), a soft bell
//   tuning() — a fiddler tuning: the open strings in fifths, each brought to pitch; about 6 s
//   gulls() — two or three cries, far · knife() — three strokes of a knife on wood · silk() — silk sliding
//   brush() — one stroke of a paintbrush · rigging() — a rope and a block creaking · burn() — a rope through the palms
//   splash() — something into water · oars() — a stroke of oars: a splash, the oar on its pin, a splash
//   horn() — a steamer's horn, far · chain() — an anchor chain running out, and the anchor in
//   knock() — three knocks on a door · chime() — a thin ring of metal · paper() — a sheet unfolded or folded
// Played till stopped — a handle {loud(v, seconds), stop(seconds)}: as loud as v (0…1) of its own; stop fades it out
// and takes it down:
//   violin() — one bowed violin playing SONG, round after round
//   song() — the crew's song: four men humming SONG low, without words
// The two play SONG together: whoever comes in second joins at the next bar of the first.

// SONG — the sail's motif and what grows out of it: sixteen bars in 3/4, D major; each bar its notes [pitch, beats]
// (the violin's; the men's lead an octave lower) and the chord the other three men hold under it (lowest first)
export const SONG = [
  { notes: [['D4', 1], ['F#4', 1], ['A4', 1]], chord: ['D2', 'A2', 'F#3'] },
  { notes: [['D5', 3]], chord: ['D2', 'A2', 'F#3'] },
  { notes: [['C#5', 1], ['B4', 1], ['A4', 1]], chord: ['A2', 'E3', 'A3'] },
  { notes: [['B4', 2], ['F#4', 1]], chord: ['B2', 'D3', 'F#3'] },
  { notes: [['G4', 1], ['B4', 1], ['D5', 1]], chord: ['G2', 'D3', 'G3'] },
  { notes: [['E5', 2], ['D5', 1]], chord: ['A2', 'C#3', 'E3'] },
  { notes: [['C#5', 1], ['B4', 1], ['C#5', 1]], chord: ['A2', 'E3', 'G3'] },
  { notes: [['A4', 3]], chord: ['A2', 'C#3', 'E3'] },
  { notes: [['D4', 1], ['F#4', 1], ['A4', 1]], chord: ['D2', 'A2', 'F#3'] },
  { notes: [['D5', 2], ['F#5', 1]], chord: ['B2', 'D3', 'F#3'] },
  { notes: [['E5', 1], ['D5', 1], ['B4', 1]], chord: ['G2', 'D3', 'G3'] },
  { notes: [['A4', 2], ['G4', 1]], chord: ['A2', 'C#3', 'E3'] },
  { notes: [['F#4', 1], ['A4', 1], ['D5', 1]], chord: ['D2', 'A2', 'D3'] },
  { notes: [['E5', 2], ['C#5', 1]], chord: ['A2', 'E3', 'G3'] },
  { notes: [['D5', 3]], chord: ['D2', 'A2', 'F#3'] },
  { notes: [['D5', 3]], chord: ['D2', 'A2', 'F#3'] },
];
const BEAT = 0.64, BAR = 3 * BEAT; // seconds
const ROUND = SONG.length + 2; // bars: the tune, and two of rest before it comes round
// the motif itself, as the bell plays it
const MOTIF = ['D5', 'F#5', 'A5', 'D6'];
// the strings' chords under it (D, B minor, G, A with the fourth held), the eight voices low to high, as MIDI
// numbers; each holds for CHORD seconds
const CHORDS = [
  [38, 45, 50, 54, 57, 62, 66, 69],
  [35, 42, 50, 54, 59, 62, 66, 71],
  [43, 50, 50, 55, 59, 62, 67, 71],
  [45, 52, 52, 57, 62, 64, 69, 74],
];
const CHORD = 4.4;

let ctx = null, master = null, room = null, still = null, awake = false, held = false;
function audio() {
  if (!ctx) {
    ctx = new AudioContext();
    if (!awake) ctx.suspend();
    const limit = ctx.createDynamicsCompressor();
    limit.threshold.value = -12;
    limit.ratio.value = 4;
    master = ctx.createGain();
    master.gain.value = 0.85;
    // (the site's "sounds" slider: MooodVolume.output — the sounds go to the speakers through it)
    master.connect(limit).connect(MooodVolume.output(ctx)).connect(ctx.destination);
    // the open air: a short bright tail
    room = ctx.createConvolver();
    const n = Math.floor(ctx.sampleRate * 1.8), ir = ctx.createBuffer(2, n, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = ir.getChannelData(c);
      for (let i = 0, lp = 0; i < n; i++) { lp += ((Math.random() * 2 - 1) - lp) * 0.75; d[i] = lp * Math.pow(1 - i / n, 2.6); }
    }
    room.buffer = ir;
    room.connect(master);
    // (where `after` keeps its clocks running, unheard)
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
  // (called with no touch behind it — the author gone straight to a minigame: the browser lets it be heard only
  // from the first touch or key, so it is asked again then)
  for (const touch of ['pointerdown', 'keydown']) addEventListener(touch, audio, { once: true, capture: true });
}
export function pause(on) {
  held = !!on;
  if (!ctx || !awake) return;
  if (held) ctx.suspend();
  else ctx.resume();
}

// where a sound goes: the air, carrying `wet` of it on
const airs = {};
function air(wet) {
  if (airs[wet]) return airs[wet];
  const a = audio(), out = a.createGain(), send = a.createGain();
  send.gain.value = wet;
  out.connect(master);
  out.connect(send).connect(room);
  return (airs[wet] = out);
}
// fn once `seconds` of the sounds' own time have gone by (it stands with them); → what to forget it by (onended = null)
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
// a value moved to v over `seconds` from where it is
function to(param, v, seconds) {
  const t = audio().currentTime;
  param.cancelScheduledValues(t);
  param.setValueAtTime(param.value, t);
  param.linearRampToValueAtTime(v, t + Math.max(0.02, seconds));
}
// an envelope: from `from` at t through [[seconds from t, value], …], each reached in a straight line
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
// noise playing from t (for `seconds`, or till stopped)
function hiss(kind, t, seconds) {
  const s = audio().createBufferSource();
  s.buffer = noise(kind);
  s.loop = true;
  s.start(t, Math.random() * 3);
  if (seconds) s.stop(t + seconds);
  return s;
}
// a slow wandering of a value: a very slow oscillator added to it (till stopped)
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
// a drop of water: a short note bending (down — a drip; up — a bubble)
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
// something going into water: the slap, the hollow under it, the drops falling back
function plop(t, dest, loud) {
  const a = audio(), e = a.createGain(), low = filter({ type: 'lowpass', frequency: 3000, Q: 0.7 });
  low.frequency.setValueAtTime(3000, t);
  low.frequency.exponentialRampToValueAtTime(500, t + 0.5);
  hiss('white', t, 0.8).connect(low).connect(e).connect(dest);
  e.gain.setValueAtTime(0, t);
  e.gain.linearRampToValueAtTime(loud, t + 0.012);
  e.gain.exponentialRampToValueAtTime(0.0005, t + 0.7);
  burst(t, dest, { kind: 'brown', f: 150, Q: 0.8, len: 0.25, loud: loud * 2 });
  for (let s = 0.12; s < 0.6; s += 0.05 + Math.random() * 0.12) drop(t + s, dest, 1200 + Math.random() * 1500, 0.6, loud * 0.15);
}

// the beds: one of each for the page, built when first heard and taken down once silent. build({a, t, out, noise,
// sway, keep, every}) makes it into `out`: noise(kind) and sway(param, rate, depth) last as long as the bed does,
// keep(node) — so does a node of its own, every(fn) — fn now and five times a second (to plan what comes: the
// audio's clock decides when); → optionally tune(level, seconds): what the level changes besides the loudness
const sounding = {};
function bed(name, wet, build, level, seconds) {
  let b = sounding[name];
  if (!b) {
    if (!level) return;
    const a = audio(), out = a.createGain(), stops = [];
    const keep = node => { stops.push(() => node.stop()); return node; };
    out.gain.value = 0;
    out.connect(air(wet));
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
const BEDS = { sea, stream, wind, storm, campfire, hearth, breath, orchestra };
export function beds(levels = {}, seconds = 2) {
  for (const [name, play] of Object.entries(BEDS)) play(levels[name] ?? 0, seconds);
}

export function sea(level = 1, seconds = 2) {
  bed('sea', 0.25, ({ a, t, out, noise, sway, every }) => {
    // the water's body, always there
    const deep = a.createGain();
    deep.gain.value = 0.5;
    noise('brown').connect(filter({ type: 'lowpass', frequency: 500 })).connect(deep).connect(out);
    sway(deep.gain, 0.05, 0.12);
    // a wave: it gathers and opens as it breaks, and its foam runs back down the sand hissing
    const tone = filter({ type: 'lowpass', frequency: 350 }), swell = a.createGain(), foam = a.createGain();
    swell.gain.value = 0;
    foam.gain.value = 0;
    noise('brown').connect(tone).connect(swell).connect(out);
    noise('pink').connect(filter({ type: 'highpass', frequency: 2200 })).connect(foam).connect(out);
    let next = t + 1;
    every(() => {
      const now = a.currentTime;
      if (next > now + 0.5) return;
      const at = Math.max(next, now), big = 0.6 + Math.random() * 0.4;
      shape(swell.gain, at, [[2.4, 0.9 * big], [3.1, 0.5 * big], [5.5, 0]]);
      shape(tone.frequency, at, [[2.4, 950], [5.5, 350]], 350);
      shape(foam.gain, at, [[2.2, 0], [2.9, 0.5 * big], [4, 0.25 * big], [6.4, 0]]);
      next = at + 7 + Math.random() * 2;
    });
  }, level, seconds);
}

export function stream(level = 1, seconds = 2) {
  bed('stream', 0.15, ({ a, t, out, noise, sway, every }) => {
    // the run of it: a band between 1.5 and 4 kHz that never keeps still
    const run = filter({ type: 'bandpass', frequency: 2500, Q: 0.9 }), amp = a.createGain();
    amp.gain.value = 0.35;
    noise('white').connect(run).connect(amp).connect(out);
    sway(run.frequency, 0.8, 550);
    sway(run.frequency, 6.3, 350);
    sway(amp.gain, 9.1, 0.06);
    sway(amp.gain, 0.23, 0.06);
    // and the bubbles in it
    let next = t;
    every(() => {
      const now = a.currentTime;
      if (next < now) next = now; // (the page was hidden: what was missed then is not made up for)
      for (; next < now + 0.4; next += 0.05 + Math.random() * 0.25)
        drop(Math.max(next, now), out, 900 + Math.random() * 1800, 1.4, 0.015 + Math.random() * 0.03);
    });
  }, level, seconds);
}

export function wind(level = 1, seconds = 2) {
  bed('wind', 0.2, ({ a, out, noise, sway }) => {
    // a band wandering between 300 and 900 Hz, now fuller, now thinner
    const band = filter({ type: 'bandpass', frequency: 600, Q: 1.3 }), amp = a.createGain();
    amp.gain.value = 0.7;
    noise('pink').connect(band).connect(amp).connect(out);
    sway(band.frequency, 0.07, 200);
    sway(band.frequency, 0.031, 100);
    sway(amp.gain, 0.11, 0.22);
    sway(amp.gain, 0.043, 0.13);
  }, level, seconds);
}

export function storm(level = 1, seconds = 2) {
  bed('storm', 0.3, ({ a, t, out, noise, sway, every }) => {
    // the gale: the wind lower and harder, a howl in it, the sea's roar under
    const band = filter({ type: 'bandpass', frequency: 330, Q: 1.1 }), amp = a.createGain();
    amp.gain.value = 0.8;
    noise('pink').connect(band).connect(amp).connect(out);
    sway(band.frequency, 0.09, 130);
    sway(band.frequency, 0.21, 50);
    sway(amp.gain, 0.13, 0.35);
    const howl = filter({ type: 'bandpass', frequency: 780, Q: 7 }), howlAmp = a.createGain();
    howlAmp.gain.value = 0.35;
    noise('pink').connect(howl).connect(howlAmp).connect(out);
    sway(howl.frequency, 0.06, 260);
    sway(howlAmp.gain, 0.17, 0.2);
    const roar = a.createGain();
    roar.gain.value = 0.6;
    noise('brown').connect(filter({ type: 'lowpass', frequency: 200 })).connect(roar).connect(out);
    // the waves slamming, and their spray
    let next = t + 0.8;
    every(() => {
      const now = a.currentTime;
      if (next > now + 0.5) return;
      const at = Math.max(next, now), hard = 0.6 + Math.random() * 0.4;
      burst(at, out, { kind: 'brown', f: 140, Q: 0.6, len: 1.8, loud: 1.2 * hard, attack: 0.12 });
      burst(at + 0.15, out, { f: 3600, Q: 0.6, len: 1.2, loud: 0.07 * hard, attack: 0.2 });
      next = at + 2.5 + Math.random() * 3;
    });
  }, level, seconds);
}

// a fire: its low glow, the flutter of the flame, and the wood cracking — `pops` a second, around `tone` Hz
function fire(name, { wet, pops, tone, glow }, level, seconds) {
  bed(name, wet, ({ a, t, out, noise, sway, every }) => {
    const low = a.createGain(), flame = a.createGain();
    low.gain.value = glow.loud;
    noise('brown').connect(filter({ type: 'lowpass', frequency: glow.frequency })).connect(low).connect(out);
    sway(low.gain, 0.09, glow.loud * 0.25);
    flame.gain.value = 0.08;
    noise('pink').connect(filter({ type: 'bandpass', frequency: 420, Q: 0.8 })).connect(flame).connect(out);
    sway(flame.gain, 7.3, 0.04);
    sway(flame.gain, 0.4, 0.03);
    let next = t + 0.2;
    every(() => {
      const now = a.currentTime;
      if (next < now) next = now; // (the page was hidden: what was missed then is not made up for)
      for (; next < now + 0.4; next -= Math.log(1 - Math.random()) / pops) {
        const at = Math.max(next, now);
        if (Math.random() < 0.08) burst(at, out, { f: 500 + Math.random() * 400, Q: 2, len: 0.06, loud: 0.35 }); // a knot goes
        else burst(at, out, { f: tone * (0.5 + Math.random() * 1.5), Q: 1.5, len: 0.006 + Math.random() * 0.02, loud: 0.05 + Math.random() ** 2 * 0.3 });
      }
    });
  }, level, seconds);
}
export function campfire(level = 1, seconds = 2) {
  fire('campfire', { wet: 0.1, pops: 5, tone: 3200, glow: { frequency: 220, loud: 0.35 } }, level, seconds);
}
export function hearth(level = 1, seconds = 2) {
  fire('hearth', { wet: 0.4, pops: 2.2, tone: 2200, glow: { frequency: 140, loud: 0.6 } }, level, seconds);
}

export function breath(level = 1, seconds = 2) {
  bed('breath', 0.1, ({ a, t, out, noise, every }) => {
    const throat = filter({ type: 'lowpass', frequency: 600 }), amp = a.createGain();
    amp.gain.value = 0;
    noise('pink').connect(throat).connect(amp).connect(out);
    let next = t + 0.2, stir = 0;
    every(() => {
      const now = a.currentTime;
      if (next > now + 0.4) return;
      const at = Math.max(next, now), len = 3.5 / (1 + 1.2 * stir) * (1 + (Math.random() - 0.5) * 0.9 * stir);
      // in, higher; a moment's rest; out, lower and longer
      shape(amp.gain, at, [[len * 0.36, 1.4], [len * 0.42, 0.25], [len * 0.55, 1.8], [len * 0.92, 0.1], [len, 0]]);
      shape(throat.frequency, at, [[len * 0.36, 750], [len * 0.45, 420], [len, 380]], 520);
      next = at + len;
    });
    return level => { stir = Math.min(1, Math.max(0, (level - 0.2) / 0.8)); };
  }, level, seconds);
}

export function orchestra(level = 1, seconds = 2) {
  bed('orchestra', 0.55, ({ a, t, out, keep, sway, every }) => {
    const tone = filter({ type: 'lowpass', frequency: 500, Q: 0.5 }), lift = a.createGain();
    tone.connect(filter({ type: 'peaking', frequency: 320, Q: 1, gain: 3 })).connect(lift).connect(out);
    sway(lift.gain, 0.11, 0.1);
    // eight desks, low to high: each two bows a few cents apart, with a vibrato of its own; the two highest come in
    // as the level rises
    const desks = CHORDS[0].map((m, i) => {
      const bow = a.createGain(), open = a.createGain(), vibrato = keep(a.createOscillator()), depth = a.createGain();
      const loud = 0.06 - 0.004 * i;
      bow.gain.value = loud;
      open.gain.value = i < 6 ? 1 : 0;
      vibrato.frequency.value = 4.9 + Math.random() * 1.1;
      depth.gain.value = 5 + i;
      vibrato.connect(depth);
      vibrato.start(t);
      const saws = [-7, 6].map(cents => {
        const o = keep(a.createOscillator());
        o.type = 'sawtooth';
        o.frequency.value = hz(m);
        o.detune.value = cents + (Math.random() - 0.5) * 4;
        depth.connect(o.detune);
        o.connect(bow);
        o.start(t);
        return o;
      });
      bow.connect(open).connect(tone);
      return { saws, bow, open, loud };
    });
    // the chords go round: at each the bows turn, not quite together — a dip, the new note, a slow swell
    let n = 1, next = t + CHORD;
    every(() => {
      const now = a.currentTime;
      if (next > now + 0.6) return;
      const at = Math.max(next, now + 0.4);
      CHORDS[n % CHORDS.length].forEach((m, i) => {
        const d = desks[i], turn = at + (Math.random() - 0.5) * 0.12;
        d.bow.gain.setTargetAtTime(d.loud * 0.4, turn - 0.28, 0.09);
        for (const o of d.saws) o.frequency.setTargetAtTime(hz(m), turn, 0.03);
        d.bow.gain.setTargetAtTime(d.loud, turn + 0.04, 0.5);
      });
      n++;
      next = at + CHORD;
    });
    return (level, seconds) => {
      to(tone.frequency, 500 + 2700 * level ** 1.5, seconds);
      to(lift.gain, 1.6 - 0.6 * level, seconds); // (quiet, it is still there)
      to(desks[6].open.gain, Math.min(1, Math.max(0, (level - 0.35) / 0.2)), seconds);
      to(desks[7].open.gain, Math.min(1, Math.max(0, (level - 0.6) / 0.2)), seconds);
    };
  }, level, seconds);
}

export function motif() {
  const a = audio(), t = a.currentTime + 0.03, out = air(0.5);
  MOTIF.forEach((p, i) => {
    const f = hz(midi(p)), last = i === MOTIF.length - 1;
    ring(t + i * 0.38, out, [[f, last ? 4.2 : 2.6, 0.13], [f * 2, last ? 1.6 : 1, 0.022]], 0.015);
  });
}

// a bowed string: a sawtooth and the hair's grit through the instrument's body; the bow takes 80 ms to bite, the
// vibrato (5.5 Hz) comes once the note is settled
//   play(m, at, len, v, {join, from, vibrato}) — the note m at `at` for len seconds, as loud as v; join — on the
//     same bow as the one before; from — it begins that many cents off and is brought true; vibrato — its depth, cents
//   rest(at) — the bow lifted · end(at) — and the string put away
function bowed(dest) {
  const a = audio(), t = a.currentTime;
  const saw = a.createOscillator(), wobble = a.createOscillator(), depth = a.createGain(), grit = a.createGain(), env = a.createGain();
  saw.type = 'sawtooth';
  wobble.frequency.value = 5.5;
  depth.gain.value = 0;
  wobble.connect(depth).connect(saw.detune);
  grit.gain.value = 0.35;
  const hair = hiss('pink', t);
  hair.connect(filter({ type: 'bandpass', frequency: 3500, Q: 0.8 })).connect(grit).connect(env);
  saw.connect(env);
  env.gain.value = 0;
  env.connect(filter({ type: 'highpass', frequency: 190 }))
    .connect(filter({ type: 'peaking', frequency: 290, Q: 1.4, gain: 5 }))
    .connect(filter({ type: 'peaking', frequency: 480, Q: 1.6, gain: 4 }))
    .connect(filter({ type: 'peaking', frequency: 2700, Q: 1.5, gain: 5 }))
    .connect(filter({ type: 'lowpass', frequency: 4200, Q: 0.7 })).connect(dest);
  saw.start(t);
  wobble.start(t);
  const rest = at => { env.gain.setTargetAtTime(0, at, 0.12); };
  return {
    play(m, at, len, v, { join = false, from = 0, vibrato = 20 } = {}) {
      const f = hz(m);
      if (join) {
        saw.frequency.setTargetAtTime(f, at, 0.012);
        env.gain.setTargetAtTime(v, at, 0.05);
      } else {
        env.gain.setTargetAtTime(0, Math.max(0, at - 0.09), 0.025);
        saw.frequency.setValueAtTime(f, at);
        env.gain.setTargetAtTime(v, at, 0.03);
        depth.gain.setTargetAtTime(0, at, 0.02);
      }
      saw.detune.setValueAtTime(from, at);
      if (from) saw.detune.linearRampToValueAtTime(0, at + Math.min(1.2, len * 0.6));
      depth.gain.setTargetAtTime(vibrato, at + Math.min(0.25, len * 0.3), 0.15);
      if (len > 1.2) { // a long note swells and eases
        env.gain.setTargetAtTime(v * 1.25, at + len * 0.25, len * 0.2);
        env.gain.setTargetAtTime(v * 0.7, at + len * 0.75, len * 0.12);
      }
    },
    rest,
    end(at) {
      rest(at);
      for (const o of [saw, wobble, hair]) o.stop(at + 1);
    },
  };
}

// a man humming, mouth closed: a soft tone with `buzz` of rasp in it through the chest's low formant, a slow vibrato
// and a pitch that does not quite hold — each man's his own, so four of them are a choir
//   sing(m, at, v, join) — the note m from `at`, as loud as v; join — in the same breath as the one before
//   rest(at) · end(at)
function hummer(dest, buzz) {
  const a = audio(), t = a.currentTime;
  const tone = a.createOscillator(), rasp = a.createOscillator(), raspAmp = a.createGain(), env = a.createGain();
  tone.type = 'triangle';
  rasp.type = 'sawtooth';
  raspAmp.gain.value = buzz;
  const vibrato = a.createOscillator(), depth = a.createGain(), waver = a.createOscillator(), waverAmp = a.createGain();
  vibrato.frequency.value = 4.7 + Math.random() * 0.9;
  depth.gain.value = 0;
  waver.frequency.value = 0.17 + Math.random() * 0.12;
  waverAmp.gain.value = 7 + Math.random() * 6;
  vibrato.connect(depth);
  waver.connect(waverAmp);
  for (const o of [tone, rasp]) {
    depth.connect(o.detune);
    waverAmp.connect(o.detune);
  }
  tone.connect(env);
  rasp.connect(raspAmp).connect(env);
  env.gain.value = 0;
  env.connect(filter({ type: 'peaking', frequency: 260, Q: 1.2, gain: 5 })).connect(filter({ type: 'lowpass', frequency: 950, Q: 0.7 })).connect(dest);
  const all = [tone, rasp, vibrato, waver];
  for (const o of all) o.start(t);
  const rest = at => { env.gain.setTargetAtTime(0, at, 0.15); };
  return {
    sing(m, at, v, join) {
      const f = hz(m);
      for (const o of [tone, rasp]) {
        if (join) o.frequency.setTargetAtTime(f, at, 0.04);
        else o.frequency.setValueAtTime(f, at);
      }
      if (!join) {
        env.gain.setTargetAtTime(0, Math.max(0, at - 0.25), 0.06);
        depth.gain.setTargetAtTime(0, at, 0.02);
      }
      env.gain.setTargetAtTime(v, at, join ? 0.12 : 0.09);
      depth.gain.setTargetAtTime(14, at + 0.3, 0.3);
    },
    rest,
    end(at) {
      rest(at);
      for (const o of all) o.stop(at + 1);
    },
  };
}

// SONG's time, one for all who play it: bar 0 began at `began`. play(bar, at, n) — for each bar as it comes: the
// n-th of the round, at `at`; bar undefined — a bar of rest. → {leave() — no longer one of its players (the last one
// gone, the next begins it anew), stop() — no more bars}
let began = 0, players = 0;
function score(play) {
  const a = audio();
  if (!players++) began = a.currentTime + 0.15;
  const from = began;
  let k = Math.max(0, Math.ceil((a.currentTime + 0.1 - from) / BAR));
  const plan = () => {
    const now = a.currentTime;
    for (; from + k * BAR < now + 1.5; k++) if (from + k * BAR >= now) play(SONG[k % ROUND], from + k * BAR, k % ROUND);
  };
  plan();
  const timer = setInterval(plan, 250);
  return { leave() { players--; }, stop() { clearInterval(timer); } };
}
// what plays till stopped: `out` is its loudness (base — its own); stopping, it leaves at once and is closed once silent
function handle(out, base, leave, close) {
  let stopped = false;
  return {
    loud(v, seconds = 0.3) {
      if (!stopped) to(out.gain, base * v, seconds);
    },
    stop(seconds = 1) {
      if (stopped) return;
      stopped = true;
      leave();
      to(out.gain, 0, seconds);
      after(Math.max(0.02, seconds) + 0.05, () => {
        close();
        out.disconnect();
      });
    },
  };
}

export function violin() {
  const a = audio(), out = a.createGain(), string = bowed(out);
  out.gain.value = 0.5;
  out.connect(air(0.45));
  // each bar on a new bow, its notes slurred
  const tune = score((bar, at) => {
    if (!bar) return string.rest(at);
    let s = at;
    bar.notes.forEach(([p, beats], i) => {
      string.play(midi(p), s, beats * BEAT, 0.2 * (0.9 + Math.random() * 0.2), { join: i > 0 });
      s += beats * BEAT;
    });
  });
  return handle(out, 0.5, tune.leave, () => {
    tune.stop();
    string.end(a.currentTime);
  });
}

export function tuning() {
  const a = audio(), t = a.currentTime + 0.05, out = air(0.4), one = bowed(out), two = bowed(out);
  // the A first; then each neighbour against a string already true, brought up or down to its fifth
  one.play(midi('A4'), t, 2.9, 0.1, { from: -30, vibrato: 0 });
  two.play(midi('D4'), t + 1, 1.9, 0.1, { from: -45, vibrato: 0 });
  one.play(midi('G3'), t + 3, 1.5, 0.1, { from: 40, vibrato: 0 });
  two.play(midi('D4'), t + 3, 1.5, 0.09, { vibrato: 0 });
  one.play(midi('A4'), t + 4.5, 1.5, 0.09, { vibrato: 0 });
  two.play(midi('E5'), t + 4.5, 1.5, 0.09, { from: -40, vibrato: 0 });
  one.end(t + 6);
  two.end(t + 6);
}

export function song() {
  const a = audio(), out = a.createGain();
  out.gain.value = 0.4;
  out.connect(air(0.5));
  // bass, baritone, second tenor — the chord; and the lead, the tune an octave under the violin's
  const men = [0.4, 0.3, 0.22].map(buzz => hummer(out, buzz)), lead = hummer(out, 0.18);
  let fresh = true;
  const tune = score((bar, at, n) => {
    if (!bar) {
      for (const man of [...men, lead]) man.rest(at);
      fresh = true;
      return;
    }
    const breath = fresh || n % 4 === 0; // they breathe before each phrase
    bar.chord.forEach((p, i) => men[i].sing(midi(p), at, 0.15, !breath));
    let s = at;
    bar.notes.forEach(([p, beats], i) => {
      lead.sing(midi(p) - 12, s, 0.17, !(breath && i === 0));
      s += beats * BEAT;
    });
    fresh = false;
  });
  return handle(out, 0.4, tune.leave, () => {
    tune.stop();
    for (const man of [...men, lead]) man.end(a.currentTime);
  });
}

export function gulls() {
  const a = audio(), out = air(0.5);
  let t = a.currentTime + 0.05;
  for (let i = 0, n = 2 + Math.floor(Math.random() * 2); i < n; i++) {
    // a cry: up in an instant, then falling fast
    const top = 2000 + Math.random() * 400, len = 0.32 + Math.random() * 0.2, loud = 0.05 + Math.random() * 0.03;
    for (const [k, v] of [[1, 1], [2, 0.3]]) {
      const o = a.createOscillator(), e = a.createGain();
      o.frequency.setValueAtTime(top * 0.75 * k, t);
      o.frequency.linearRampToValueAtTime(top * k, t + 0.04);
      o.frequency.exponentialRampToValueAtTime(top * 0.6 * k, t + len);
      shape(e.gain, t, [[0.03, loud * v], [len * 0.5, loud * v * 0.8], [len, 0]]);
      o.connect(e).connect(out);
      o.start(t);
      o.stop(t + len + 0.05);
    }
    t += len + 0.12 + Math.random() * 0.5;
  }
}

export function knife() {
  const a = audio(), out = air(0.1);
  let t = a.currentTime + 0.03;
  for (let i = 0; i < 3; i++) {
    // a stroke along the grain, its pitch rising; the shaving comes off
    const len = 0.16 + Math.random() * 0.06, e = a.createGain(), band = filter({ type: 'bandpass', frequency: 2200, Q: 1.4 });
    band.frequency.setValueAtTime(2200, t);
    band.frequency.linearRampToValueAtTime(4600, t + len);
    hiss('white', t, len + 0.05).connect(band).connect(e).connect(out);
    shape(e.gain, t, [[0.02, 0.16], [len * 0.7, 0.12], [len, 0]]);
    burst(t + len, out, { f: 700, Q: 3, len: 0.03, loud: 0.1 });
    t += len + 0.22 + Math.random() * 0.1;
  }
}

export function silk() {
  const a = audio(), t = a.currentTime + 0.01, out = air(0.1), e = a.createGain();
  hiss('white', t, 0.6).connect(filter({ type: 'highpass', frequency: 5000 })).connect(e).connect(out);
  // it slides, catching lightly
  e.gain.setValueAtTime(0, t);
  for (let s = 0.04; s < 0.42; s += 0.05 + Math.random() * 0.07) e.gain.linearRampToValueAtTime(0.05 + Math.random() * 0.06, t + s);
  e.gain.linearRampToValueAtTime(0, t + 0.5);
}

export function brush() {
  const a = audio(), t = a.currentTime + 0.01, out = air(0.1), e = a.createGain();
  hiss('pink', t, 0.4).connect(filter({ type: 'bandpass', frequency: 800, Q: 1 })).connect(e).connect(out);
  shape(e.gain, t, [[0.1, 0.4 + Math.random() * 0.15], [0.2, 0.3], [0.3, 0]]);
}

export function rigging() {
  const a = audio(), t = a.currentTime + 0.02, out = air(0.2), o = a.createOscillator(), e = a.createGain(), LEN = 0.8;
  // the rope taking the strain and giving: a rasp rising and falling through the block's wood
  o.type = 'sawtooth';
  o.frequency.setValueAtTime(90 + Math.random() * 15, t);
  o.frequency.linearRampToValueAtTime(140, t + LEN * 0.55);
  o.frequency.linearRampToValueAtTime(100 + Math.random() * 20, t + LEN);
  for (const [f, Q] of [[620 + Math.random() * 200, 9], [1400, 6]]) o.connect(filter({ type: 'bandpass', frequency: f, Q })).connect(e);
  shape(e.gain, t, [[LEN * 0.12, 0.16], [LEN * 0.5, 0.1 + Math.random() * 0.08], [LEN * 0.85, 0.13], [LEN, 0]]);
  e.connect(out);
  o.start(t);
  o.stop(t + LEN + 0.05);
}

export function burn() {
  const a = audio(), t = a.currentTime + 0.01, e = a.createGain();
  hiss('white', t, 0.3).connect(filter({ type: 'highpass', frequency: 3000 })).connect(e).connect(air(0.1));
  e.gain.setValueAtTime(0, t);
  e.gain.linearRampToValueAtTime(0.13, t + 0.01);
  e.gain.exponentialRampToValueAtTime(0.0005, t + 0.25);
}

export function splash() {
  plop(audio().currentTime + 0.01, air(0.2), 0.2);
}

export function oars() {
  const t = audio().currentTime + 0.02, out = air(0.4);
  plop(t, out, 0.1);
  burst(t + 0.55, out, { f: 320, Q: 4, len: 0.07, loud: 0.25 }); // the oar on its pin
  ring(t + 0.55, out, [[210, 0.12, 0.06]]);
  plop(t + 1.3, out, 0.09);
}

export function horn() {
  const a = audio(), t = a.currentTime + 0.05, e = a.createGain(), far = filter({ type: 'lowpass', frequency: 520, Q: 0.7 });
  for (const f of [175, 233]) {
    const o = a.createOscillator();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(f * 0.97, t); // the steam coming up to pitch
    o.frequency.linearRampToValueAtTime(f, t + 0.25);
    o.connect(far);
    o.start(t);
    o.stop(t + 1.6);
  }
  far.connect(e).connect(air(0.7));
  shape(e.gain, t, [[0.18, 0.11], [1.15, 0.1], [1.5, 0]]);
}

export function chain() {
  const t = audio().currentTime + 0.03, out = air(0.3);
  // link after link over the iron lip of the hawse, the whole of it rumbling; then the anchor goes in
  for (let s = 0; s < 1.5; s += 0.04 + Math.random() * 0.035) {
    const f = 1700 + Math.random() * 1600, loud = 0.03 + Math.random() * 0.05;
    ring(t + s, out, [[f, 0.05, loud], [f * 1.47, 0.035, loud * 0.6], [f * 2.09, 0.025, loud * 0.4]]);
    burst(t + s, out, { f: 900, Q: 1.5, len: 0.02, loud: loud * 1.5 });
  }
  burst(t, out, { kind: 'brown', f: 160, Q: 0.7, len: 1.6, loud: 0.5, attack: 0.1 });
  plop(t + 1.5, out, 0.16);
}

export function knock() {
  const out = air(0.3);
  let t = audio().currentTime + 0.03;
  for (let i = 0; i < 3; i++) {
    burst(t, out, { kind: 'brown', f: 170, Q: 1, len: 0.1, loud: 1 }); // the door's wood
    burst(t, out, { f: 1100, Q: 1.2, len: 0.02, loud: 0.12 }); // the knuckles
    ring(t, out, [[150, 0.14, 0.1], [330, 0.08, 0.05]]);
    t += 0.3;
  }
}

export function chime() {
  ring(audio().currentTime + 0.02, air(0.5), [[2349, 2.4, 0.055], [3520, 1.6, 0.03]]);
}

export function paper() {
  const a = audio(), t = a.currentTime + 0.01, e = a.createGain(), len = 0.4 + Math.random() * 0.2;
  hiss('white', t, len + 0.1).connect(filter({ type: 'bandpass', frequency: 3200, Q: 0.7 }))
    .connect(filter({ type: 'highpass', frequency: 1300 })).connect(e).connect(air(0.1));
  // crinkles: short catches in a soft slide
  e.gain.setValueAtTime(0, t);
  for (let s = 0; s < len; s += 0.03 + Math.random() * 0.06) {
    e.gain.linearRampToValueAtTime(0.09 + Math.random() * 0.2, t + s + 0.008);
    e.gain.linearRampToValueAtTime(0.04, t + s + 0.025);
  }
  e.gain.linearRampToValueAtTime(0, t + len);
}

// the sounds of a step played unseen (a jump, a dry run: jump.js): nothing heard meanwhile — the beds heard from
// then on as loud as the step left them; what was played once is over by then, and a handle begun meanwhile is mute
export function unheard() {
  const levels = {}, none = () => {}, mute = () => ({ loud() {}, stop() {} });
  return {
    sounds: {
      wake: none,
      beds(set = {}) { for (const name in BEDS) levels[name] = set[name] ?? 0; },
      sea(level = 1) { levels.sea = level; },
      stream(level = 1) { levels.stream = level; },
      wind(level = 1) { levels.wind = level; },
      storm(level = 1) { levels.storm = level; },
      campfire(level = 1) { levels.campfire = level; },
      hearth(level = 1) { levels.hearth = level; },
      breath(level = 1) { levels.breath = level; },
      orchestra(level = 1) { levels.orchestra = level; },
      violin: mute, song: mute,
      motif: none, tuning: none, gulls: none, knife: none, silk: none, brush: none, rigging: none, burn: none, splash: none,
      oars: none, horn: none, chain: none, knock: none, chime: none, paper: none,
    },
    wake() { for (const [name, level] of Object.entries(levels)) BEDS[name](level, 1); },
  };
}
