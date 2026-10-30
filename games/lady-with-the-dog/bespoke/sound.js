// The sounds of “The Lady with the Dog” (Web Audio), as loud as the page's "sounds" slider says (MooodVolume.output).
// The page runs the audio: it sounds once the browser lets it (the first touch), and waits with the scene's music — the
// play paused, its scene standing —, fading out and back in. (game.md §8, the page's sounds.)
//   Real recordings (sounds/ — CC0 from Freesound, the waltz a public-domain record of 1914: sounds/README.md) for the
// places and the things; made in the page only what is a tone, a tick, a beat (the owner liked these made so: the
// clock, the wires — 2026-10-16), the heart, and the waltz on Anna's piano (no free recording of it on a piano).
// Each recording plays at a gain from its measured loudness, not its peak: the beds from their integrated LUFS (level 1
// ≈ −22 LUFS heard at the page's default "sounds" 0.4: under the scenes' music at the levels the game gives), the
// one-offs from their loudest 0.4 s (`loud` 1 ≈ −18 heard: over the music, under the voices) — as «The Canterville
// Ghost» has it.
//   unheard() → {sounds} — the same, unheard, for a step played unseen (jump.js); a step plays them as g.sound
// Two airs a sound goes out into: the open air (light, 1.8 s — the quay, the garden, the station, the street) and a
// room (0.6 s — the hotel rooms, the theatre, a hall); the recordings carry their own air and send little to these.
// The beds — what lasts; one of each for the page, as loud as `level` (0 — silence, and the bed is taken down),
// getting there over `seconds` (a bed may be called by itself too — a gust: wind(0.7, 1)):
//   background(levels, seconds) — the named beds to their levels, every other one to silence: the game's background as
//     the page sounds it (bespoke.onBackground — at a scene's cut with its music, or at once: the game declares it,
//     g.beds and g.scene's beds, and never times it)
//   recordings: sea — the sea from the shore · crowd — voices on the pier · hall — the theatre before the curtain ·
//   steam — a steam engine at the station · weep — quiet weeping · cicadas — a southern summer day · crickets — a warm
//   night · wind — a wind off the sea, the autumn wind in the town · snow — a town under falling snow · thaw — drops
//   from the roofs
//   made here: wires — the telegraph wires' hum, 100 and 150 Hz beating · room — a clock ticking, a faint hum
// Played till stopped — a handle {loud(v, seconds), stop(seconds)}: as loud as v (0…1) of its own; stop fades it out:
//   band() — a brass band far off in the city garden: the waltz “Waves of the Danube” (Ion Ivanovici, 1880), a wind
//     band's record of 1914, far, through the garden's air
//   piano(tune, {wall}) — a piano heard through a window and the snow: tune 'etude' — someone practising (a scale,
//     Hanon's exercise: recordings, by turns); 'waltz' — the same waltz, made here; wall: true — through a wall,
//     duller and quieter
// Played once (a recording each, but the heart):
//   tuning · bark · yap · growl · clink · heart · knife · horn · bell(level) — the station's · chime — the theatre's ·
//   whistle(level) · wheels · sleigh · gate · door · pour · spill · paper · watch

// the beds' recordings: {files, lufs — their loudness (integrated, measured: sounds/README.md)}
const BED_AT = -13.1; // the file's loudness that plays at level 1 (−22 heard, the master and the slider after it)
const BEDS_REC = {
  sea: { files: ['sea-shore-517945.mp3', 'sea-shore-240645.mp3'], lufs: -20.6 },
  crowd: { files: ['crowd-550916.mp3'], lufs: -22.3 },
  hall: { files: ['hall-735472.mp3', 'hall-850562.mp3'], lufs: -21.5 },
  steam: { files: ['steam-473904.mp3'], lufs: -21.0 },
  weep: { files: ['weep-171947.mp3', 'weep-172738.mp3'], lufs: -19.0 },
  cicadas: { files: ['cicadas.mp3'], lufs: -21.1 },
  crickets: { files: ['crickets.mp3'], lufs: -21.3 },
  wind: { files: ['wind.mp3'], lufs: -25.3 },
  snow: { files: ['snow.mp3'], lufs: -23.8 },
  thaw: { files: ['thaw.mp3'], lufs: -30.2 },
};
// the one-offs: name → [file, its loudest 0.4 s (dBFS RMS), how loud it is in its scene (0…1), its air: [wet, room]] —
// each brought to the same loudness at `loud` 1, its gain at most ×8
const ONCE_AT = -9.1;
const ONE = {
  tuning: ['tuning.mp3', -12.8, 0.55, [0.3, 'room']], bark: ['bark.mp3', -17.7, 0.8, [0.15, 'open']],
  yap: ['yap.mp3', -15.2, 0.75, [0.15, 'open']], growl: ['growl.mp3', -13.8, 0.6, [0.1, 'open']],
  clink: ['clink.mp3', -17.6, 0.7, [0.15, 'open']], knife: ['knife.mp3', -22.0, 0.6, [0.1, 'room']],
  horn: ['horn.mp3', -10.7, 0.55, [0.5, 'open']], bell: ['bell.mp3', -11.8, 0.6, [0.4, 'open']],
  chime: ['bell_theatre.mp3', -12.9, 0.55, [0.35, 'room']], whistle: ['whistle.mp3', -9.5, 0.6, [0.4, 'open']],
  wheels: ['wheels.mp3', -11.8, 0.6, [0.3, 'open']], sleigh: ['sleigh.mp3', -17.7, 0.55, [0.3, 'open']],
  gate: ['gate.mp3', -22.1, 0.75, [0.3, 'open']], door: ['door.mp3', -13.8, 0.7, [0.25, 'room']],
  pour: ['pour.mp3', -19.8, 0.6, [0.15, 'room']], spill: ['spill.mp3', -22.3, 0.55, [0.15, 'room']],
  paper: ['paper.mp3', -19.3, 0.5, [0.1, 'room']], watch: ['watch.mp3', -24.7, 0.6, [0.1, 'room']],
};
// someone practising at the piano: the pieces by turns, a pause between ([file, lufs]); the band's waltz
const PRACTICE = [['scales.mp3', -22.1], ['hanon.mp3', -21.0]], PAUSE = 2.5;
const WALTZ_REC = ['waltz.mp3', -22.8];

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

let ctx = null, master = null, rooms = null, still = null;
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
  return ctx;
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
function filter({ type, frequency, Q = 1 }) {
  const f = audio().createBiquadFilter();
  f.type = type;
  f.frequency.value = frequency;
  f.Q.value = Q;
  return f;
}
function to(param, v, seconds) {
  const t = audio().currentTime;
  param.cancelScheduledValues(t);
  param.setValueAtTime(param.value, t);
  param.linearRampToValueAtTime(v, t + Math.max(0.02, seconds));
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
const hz = m => 440 * 2 ** ((m - 69) / 12);
const rnd = (a, b) => a + Math.random() * (b - a);
// the gain that brings a recording measured at `lufs` to `at`
const gainOf = (at, lufs) => 10 ** ((at - lufs) / 20);

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
// recordings (sounds/): fetched and decoded once each
const recordings = {};
function recording(file) {
  return (recordings[file] ??= fetch(new URL(`sounds/${file}`, import.meta.url))
    .then(r => { if (!r.ok) throw new Error(`no sound ${file}`); return r.arrayBuffer(); })
    .then(b => audio().decodeAudioData(b)));
}
// a bed played from a recording: one of its files round and round from a random point, at the gain its loudness asks
function recorded({ files, lufs }) {
  return ({ a, out, keep }) => {
    const s = a.createBufferSource(), g = a.createGain();
    let on = true;
    keep({ stop() { on = false; if (s.buffer) s.stop(); } });
    g.gain.value = gainOf(BED_AT, lufs);
    s.loop = true;
    s.connect(g).connect(out);
    recording(files[Math.floor(Math.random() * files.length)])
      .then(buf => { if (on) { s.buffer = buf; s.start(a.currentTime, Math.random() * buf.duration); } }, () => {});
  };
}

// the beds: one of each for the page, built when first heard and taken down once silent: build({a, t, out, noise,
// keep, every})
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
    build({
      a, out, keep, t: a.currentTime,
      noise: kind => keep(hiss(kind, a.currentTime)),
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
  if (!level) b.closing = after(Math.max(0.02, seconds) + 0.1, () => {
    for (const stop of b.stops) stop();
    b.out.disconnect();
    delete sounding[name];
  });
}
// a bed of a recording: (level, seconds)
const recordedBed = (name, wet, room = 'open') => (level = 1, seconds = 2) => bed(name, wet, room, recorded(BEDS_REC[name]), level, seconds);
export const sea = recordedBed('sea', 0.05);
export const crowd = recordedBed('crowd', 0.05);
export const hall = recordedBed('hall', 0.05, 'room');
export const steam = recordedBed('steam', 0.05);
export const weep = recordedBed('weep', 0.1, 'room');
export const cicadas = recordedBed('cicadas', 0.1);
export const crickets = recordedBed('crickets', 0.1);
export const wind = recordedBed('wind', 0.1);
export const snow = recordedBed('snow', 0.15);
export const thaw = recordedBed('thaw', 0.15);

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

const BEDS = { sea, cicadas, crowd, wind, crickets, wires, steam, snow, thaw, room, hall, weep };
export function background(levels, seconds) {
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
// recordings played into `dest` — the pieces by turns, `pause` s between (one piece and no pause: looped from a random
// point), each at its gain; → a stop
function pieces(a, dest, list, pause = 0) {
  let on = true, k = 0, src = null, timer = 0;
  const next = () => {
    if (!on) return;
    const [file, gain] = list[k++ % list.length];
    recording(file).then(buf => {
      if (!on) return;
      const s = src = a.createBufferSource(), g = a.createGain();
      s.buffer = buf;
      g.gain.value = gain;
      s.connect(g).connect(dest);
      if (list.length === 1 && !pause) { s.loop = true; s.start(a.currentTime + 0.05, Math.random() * buf.duration); return; }
      s.onended = () => { timer = setTimeout(next, pause * 1000); };
      s.start(a.currentTime + 0.05);
    }, () => {});
  };
  next();
  return () => {
    on = false;
    clearTimeout(timer);
    if (src) { src.onended = null; src.stop(); }
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

// the band in the garden: the 1914 record of the waltz, far — under a low-pass, much of it the garden's air
export function band() {
  const a = audio(), out = a.createGain(), far = filter({ type: 'lowpass', frequency: 2200, Q: 0.5 });
  out.gain.value = 0;
  out.connect(air(0.6));
  far.connect(out);
  const stop = pieces(a, far, [[WALTZ_REC[0], gainOf(BED_AT, WALTZ_REC[1])]]);
  to(out.gain, 0.45, 3);
  return handle(out, 0.45, stop);
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
// the piano: `tune` 'etude' — someone practising (the recordings by turns); 'waltz' — the garden's waltz made here, the
// left hand's “oom-pah-pah”, ♩ = 132; heard through a window and the snow (a low-pass at 1.2 kHz) — or, wall: true,
// through a wall (600 Hz, quieter)
export function piano(tune = 'waltz', { wall = false } = {}) {
  const a = audio(), out = a.createGain(), t0 = a.currentTime + 0.2;
  out.gain.value = 0;
  out.connect(air(wall ? 0.5 : 0.35, wall ? 'room' : 'open'));
  const dull = filter({ type: 'lowpass', frequency: wall ? 600 : 1200, Q: 0.4 });
  dull.connect(out);
  let stop, base;
  if (tune === 'etude') {
    stop = pieces(a, dull, PRACTICE.map(([file, lufs]) => [file, gainOf(BED_AT, lufs)]), PAUSE);
    base = wall ? 0.35 : 0.7;
  } else {
    const beat = 0.45, round = BARS * 3;
    stop = rounds(a, t0, beat, (at, k) => {
      const b = k % round;
      for (const [s, len, m] of WALTZ) if (s >= b && s < b + 1) key(dull, m, at + (s - b) * beat + rnd(-0.008, 0.012), len * beat, 0.17);
      const bar = Math.floor(b / 3), [bass, chord] = HARMONY[bar], on = b % 3;
      if (on === 0) key(dull, bar % 2 ? bass + 7 : bass, at, beat, 0.12);
      else for (const m of chord) key(dull, m, at, beat * 0.6, 0.045);
    });
    base = wall ? 0.45 : 0.9;
  }
  to(out.gain, base, 2);
  return handle(out, base, stop);
}

// ── played once ─────────────────────────────────────────────────────────────────────────────────────────────────
// a one-off recording, `loud` of its own loudness; far — duller, more of it the air
function once(name, { loud = 1, far = false } = {}) {
  const [file, at, own, [wet, room]] = ONE[name], a = audio();
  recording(file).then(buf => {
    const s = a.createBufferSource(), g = a.createGain();
    s.buffer = buf;
    g.gain.value = Math.min(8, gainOf(ONCE_AT, at)) * own * loud;
    (far ? s.connect(filter({ type: 'lowpass', frequency: 1500, Q: 0.5 })) : s).connect(g);
    g.connect(air(far ? Math.max(wet, 0.5) : wet, room));
    s.start(a.currentTime + 0.02);
  }, () => {});
}
export const tuning = () => once('tuning');
export const bark = () => once('bark');
export const yap = () => once('yap');
export const growl = () => once('growl');
export const clink = () => once('clink');
export const knife = () => once('knife');
// the steamer's horn: far over the water
export const horn = () => once('horn', { far: true });
// the station's bell; level under 0.5 — far
export const bell = (level = 1) => once('bell', { loud: level, far: level < 0.5 });
// the theatre's bell
export const chime = () => once('chime');
// the engine's whistle; level under 0.5 — far
export const whistle = (level = 1) => once('whistle', { loud: level, far: level < 0.5 });
export const wheels = () => once('wheels');
export const sleigh = () => once('sleigh');
export const gate = () => once('gate');
export const door = () => once('door');
export const pour = () => once('pour');
export const spill = () => once('spill');
export const paper = () => once('paper');
export const watch = () => once('watch');
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

// the sounds of a step played unseen (jump.js): nothing heard meanwhile — what was played once is over by then, and a
// handle begun meanwhile is mute (the background the step declared is the jump's: j.background)
export function unheard() {
  const none = () => {}, mute = () => ({ loud() {}, stop() {} });
  return {
    sounds: {
      sea: none, cicadas: none, crowd: none, wind: none, crickets: none,
      wires: none, steam: none, snow: none, thaw: none, room: none,
      hall: none, weep: none,
      band: mute, piano: mute,
      tuning: none, bark: none, yap: none, growl: none, clink: none, heart: none, knife: none, horn: none, bell: none,
      chime: none, whistle: none, wheels: none, sleigh: none, gate: none, door: none, pour: none, spill: none, paper: none,
      watch: none,
    },
  };
}
