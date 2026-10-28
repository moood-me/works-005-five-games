// Beds made in the page that the owner liked (2026-10-16, docs/history/2026-10-16-game-sounds.md): wind, a campfire,
// snow, a thaw, cicadas, a sledge's runners. Not noise through a filter swelling by a sine: noise only where the thing is
// noise (wind) — low, steep above, moved by slow random curves; the rest is made of what it is made of (crackles,
// drops, tones). sound.js's bed() builds them: built[name](kit(a, keep, every), out) — `a` its AudioContext, keep and
// every its own (a node stopped with the bed; fn now and five times a second while it sounds).
const rnd = (a, b) => a + Math.random() * (b - a);
const pick = xs => xs[Math.floor(Math.random() * xs.length)];
const made = new WeakMap(); // AudioContext → its buffers (noise, textures)
const kept = (a, key, make) => { const m = made.get(a) || made.set(a, new Map()).get(a); if (!m.has(key)) m.set(key, make()); return m.get(key); };

const fl = (a, type, frequency, Q = 0.7) => { const f = a.createBiquadFilter(); f.type = type; f.frequency.value = frequency; f.Q.value = Q; return f; };
const gain = (a, v) => { const g = a.createGain(); g.gain.value = v; return g; };

// noise, ten seconds of it, each ear its own; brown made to meet itself at the loop
const noiseBuf = (a, kind) => kept(a, `noise:${kind}`, () => {
  const n = a.sampleRate * 10, b = a.createBuffer(2, n, a.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = b.getChannelData(c);
    let last = 0, b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < n; i++) {
      const w = Math.random() * 2 - 1;
      if (kind === 'brown') d[i] = (last = (last + 0.02 * w) / 1.02) * 3.5;
      else { b0 = 0.99765 * b0 + w * 0.099; b1 = 0.963 * b1 + w * 0.2965; b2 = 0.57 * b2 + w * 1.0527; d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.2; }
    }
    const gap = d[n - 1] - d[0];
    for (let i = 0; i < n; i++) d[i] -= gap * i / (n - 1);
  }
  return b;
});
// a slow random curve −1…1 (cosine between random points, `rate` of them a second), 48 s round
function slowBuf(a, rate) {
  const sr = 8000, secs = 48, n = sr * secs, b = a.createBuffer(1, n, sr), d = b.getChannelData(0);
  const pts = Math.max(4, Math.round(secs * rate)), v = Array.from({ length: pts }, () => Math.random() * 2 - 1);
  for (let i = 0; i < n; i++) {
    const x = i / n * pts, k = Math.floor(x), s = (1 - Math.cos(Math.PI * (x - k))) / 2, p = v[k % pts], q = v[(k + 1) % pts];
    d[i] = p + (q - p) * s;
  }
  return b;
}
// textures: many small events written once into a stereo loop (an event past the end goes on from its start)
function texture(a, key, secs, fill) {
  return kept(a, key, () => {
    const sr = a.sampleRate, n = Math.floor(secs * sr), b = a.createBuffer(2, n, sr), L = b.getChannelData(0), R = b.getChannelData(1);
    fill((t0, pan, len, sample) => {
      const i0 = Math.floor(t0 * sr), m = Math.floor(len * sr), gl = Math.cos((pan + 1) * Math.PI / 4), gr = Math.sin((pan + 1) * Math.PI / 4);
      for (let i = 0; i < m; i++) { const v = sample(i / sr), j = (i0 + i) % n; L[j] += v * gl; R[j] += v * gr; }
    }, secs);
    let peak = 0;
    for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
    const k = peak ? 0.9 / peak : 1;
    for (let i = 0; i < n; i++) { L[i] *= k; R[i] *= k; }
    return b;
  });
}
const tick = (f, dec, amp) => t => amp * Math.exp(-t / dec) * Math.sin(2 * Math.PI * f * t);
const bub = (f0, dur, amp, rise) => t => amp * Math.min(1, t / 0.0008) * Math.exp(-t / (dur / 4)) * Math.sin(2 * Math.PI * (f0 * t + f0 * (rise - 1) * t * t / (2 * dur)));
function click(dec, amp, dark) { let lp = 0; return t => { lp += ((Math.random() * 2 - 1) - lp) * (1 - dark); return amp * lp * Math.exp(-t / dec); }; }
const many = (secs, perSec, make) => { for (let k = 0, n = Math.round(secs * perSec); k < n; k++) make(Math.random() * secs); };
const tex = {
  crackle: a => texture(a, 'crackle', 20, (put, s) => {
    const one = t => { const d = rnd(0.0004, 0.002); put(t, rnd(-0.5, 0.5), d * 6, click(d, 0.9 * Math.random() ** 2, rnd(0.2, 0.85))); };
    many(s, 6, one);
    many(s, 0.7, t => { for (let k = 0, n = Math.floor(rnd(3, 10)); k < n; k++) one(t + rnd(0, 0.18)); });
    many(s, 1.2, t => { const d = rnd(0.006, 0.014); put(t, rnd(-0.4, 0.4), d * 6, tick(rnd(250, 900), d, 0.3 * Math.random())); });
  }),
  drips: a => texture(a, 'drips', 30, (put, s) => {
    for (let t = 0; t < s; t += rnd(0.6, 3.5)) { const d = rnd(0.03, 0.07); put(t, rnd(-0.7, 0.7), d, bub(rnd(1100, 2600), d, rnd(0.3, 1), rnd(1.4, 2.2))); }
  }),
  // the runners on snow: crunching grains, thicker as the team pulls (a pull every 0.75 s)
  crunch: a => texture(a, 'crunch', 12, (put, s) => {
    for (let t = 0; t < s; t += 0.002) {
      const rate = 120 + 520 * Math.max(0, Math.sin(2 * Math.PI * t / 0.75)) ** 2;
      if (Math.random() < rate * 0.002) { const d = rnd(0.0005, 0.0015); put(t, rnd(-0.3, 0.3), d * 6, click(d, Math.random() ** 2, rnd(0.5, 0.8))); }
    }
  }),
};

// what a bed is built with: its sources looped from a random point, slow curves driving its params, things now and then
export function kit(a, keep, every) {
  const B = {
    a, keep, every,
    src(buf, rate = 1) { const s = a.createBufferSource(); s.buffer = buf; s.loop = true; s.playbackRate.value = rate; s.start(a.currentTime, Math.random() * buf.duration); return keep(s); },
    noise: kind => B.src(noiseBuf(a, kind)),
    slow: rate => B.src(slowBuf(a, rate)),
    drive(src, param, depth) { const g = gain(a, depth); src.connect(g).connect(param); return g; },
    events(first, gap, fn) {
      let next = a.currentTime + first;
      every(() => { const now = a.currentTime; while (next < now + 0.5) { const t = Math.max(next, now + 0.02); fn(t); next = t + gap(); } });
    },
  };
  return B;
}

// ── one-shot pieces ─────────────────────────────────────────────────────────
function bubble(a, t, dest, f0, dur, amp, rise = 1.5) {
  const o = a.createOscillator(), e = a.createGain();
  o.frequency.setValueAtTime(f0, t);
  o.frequency.exponentialRampToValueAtTime(f0 * rise, t + dur);
  e.gain.setValueAtTime(0, t);
  e.gain.linearRampToValueAtTime(amp, t + 0.002);
  e.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(e).connect(dest);
  o.start(t);
  o.stop(t + dur + 0.02);
}
function ring(a, t, dest, partials, attack = 0.003) {
  for (const [f, d, v] of partials) {
    const o = a.createOscillator(), e = a.createGain();
    o.frequency.value = f * (1 + (Math.random() - 0.5) * 0.004);
    e.gain.setValueAtTime(0, t);
    e.gain.linearRampToValueAtTime(v, t + attack);
    e.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(e).connect(dest);
    o.start(t);
    o.stop(t + d + 0.05);
  }
}
function jingle(a, t, dest, n, loud) {
  for (let i = 0; i < n; i++) {
    const at = t + i * rnd(0.05, 0.12), f = rnd(2400, 3800);
    ring(a, at, dest, [[f, 0.4, loud * rnd(0.5, 1)], [f * 1.5, 0.25, loud * 0.35], [f * 2.3, 0.12, loud * 0.15]], 0.002);
  }
}
function burst(a, t, dest, { kind = 'pink', type = 'bandpass', f, Q = 0.8, len, loud, attack = 0.004 }) {
  const s = a.createBufferSource(), e = a.createGain();
  s.buffer = noiseBuf(a, kind);
  s.connect(fl(a, type, f, Q)).connect(e).connect(dest);
  e.gain.setValueAtTime(0, t);
  e.gain.linearRampToValueAtTime(loud, t + attack);
  e.gain.exponentialRampToValueAtTime(0.0001, t + len);
  s.start(t, Math.random() * 9);
  s.stop(t + len + 0.05);
}

// ── layers ──────────────────────────────────────────────────────────────────
// wind: low noise, steep above, swelling and darkening with one slow random gust; howls — narrow tones riding it
function wind(B, dest, { lp = 500, lpDepth = 280, level = 0.4, gustRate = 0.07, gustDepth = 0.45, howls = [] }) {
  const a = B.a, gust = B.slow(gustRate), flutter = B.slow(gustRate * 6);
  const amp = gain(a, level), lp1 = fl(a, 'lowpass', lp, 0.5), lp2 = fl(a, 'lowpass', lp * 2, 0.5);
  B.noise('pink').connect(fl(a, 'highpass', 70, 0.5)).connect(lp1).connect(lp2).connect(amp).connect(dest);
  B.drive(gust, lp1.frequency, lpDepth);
  B.drive(gust, amp.gain, level * gustDepth);
  B.drive(flutter, amp.gain, level * gustDepth * 0.2);
  for (const [f, depth, Q, lv] of howls) {
    const b1 = fl(a, 'bandpass', f, Q), b2 = fl(a, 'bandpass', f, Q), ha = gain(a, lv * 0.6);
    B.noise('pink').connect(b1).connect(b2).connect(ha).connect(dest);
    B.drive(gust, b1.frequency, depth);
    B.drive(gust, b2.frequency, depth);
    B.drive(gust, ha.gain, lv * 0.55);
  }
}
// fire: a low roar flickering at random, crackles over it (two loops at two speeds, never in step)
function fire(B, dest, { roar = 0.3, roarLp = 280, crackle = 0.5, flick = 3 }) {
  const a = B.a, r = gain(a, roar), lp = fl(a, 'lowpass', roarLp, 0.6);
  B.noise('brown').connect(lp).connect(fl(a, 'lowpass', roarLp * 2, 0.5)).connect(r).connect(dest);
  B.drive(B.slow(flick), r.gain, roar * 0.45);
  B.drive(B.slow(flick * 0.4), lp.frequency, roarLp * 0.35);
  const c = gain(a, crackle);
  B.src(tex.crackle(a)).connect(c);
  B.src(tex.crackle(a), 0.83).connect(gain(a, 0.6)).connect(c);
  c.connect(fl(a, 'lowpass', 7000, 0.5)).connect(dest);
  B.drive(B.slow(0.2), c.gain, crackle * 0.4);
}

// ── the beds: built[name](B, out, k); k — the game's trim, bringing it to as loud as the bed it took the place of ──
const trimmed = (B, out, k) => { const g = gain(B.a, k); g.connect(out); return g; };
export const built = {
  wind: (B, out, k = 1) => wind(B, trimmed(B, out, k), { lp: 450, lpDepth: 250, level: 0.42, howls: [[380, 160, 12, 0.06]] }),
  wind_cold: (B, out, k = 1) => wind(B, trimmed(B, out, 1.6 * k), { lp: 360, lpDepth: 140, level: 0.22, gustRate: 0.05, gustDepth: 0.4, howls: [[700, 250, 22, 0.06], [1100, 300, 28, 0.03]] }),
  campfire: (B, out, k = 1) => fire(B, trimmed(B, out, 2.5 * k), { roar: 0.18, roarLp: 220, crackle: 0.55, flick: 2.5 }),
  snow: (B, out, k = 1) => {
    const a = B.a, o = trimmed(B, out, 3.5 * k), far = fl(a, 'lowpass', 3000, 0.6);
    wind(B, o, { lp: 200, lpDepth: 70, level: 0.1, gustRate: 0.04, gustDepth: 0.4 });
    far.connect(o);
    B.events(rnd(3, 8), () => rnd(10, 25), t => { for (let k = 0; k < 6; k++) jingle(a, t + k * 0.35, far, 2, 0.012); });
    B.events(rnd(8, 15), () => rnd(15, 30), t => burst(a, t, o, { kind: 'brown', type: 'lowpass', f: 500, len: 0.6, loud: 0.06, attack: 0.05 }));
  },
  thaw: (B, out, k = 1) => {
    const a = B.a, o = trimmed(B, out, k);
    B.src(tex.drips(a)).connect(gain(a, 0.45)).connect(o);
    B.events(0.5, () => rnd(0.08, 0.5), t => bubble(a, t, o, rnd(600, 1400), rnd(0.015, 0.03), 0.012, 1.5));
  },
  cicadas: (B, out, k = 1) => {
    const a = B.a, o = trimmed(B, out, 1.4 * k);
    for (let k = 0; k < 3; k++) {
      const f = rnd(4300, 5400), x = B.keep(a.createOscillator()), x2 = B.keep(a.createOscillator()), m = B.keep(a.createOscillator());
      const amp = gain(a, 0.5), lv = gain(a, 0.012), p = a.createStereoPanner();
      p.pan.value = rnd(-0.8, 0.8);
      x.frequency.value = f; x2.frequency.value = f * 2; m.type = 'square'; m.frequency.value = rnd(160, 260);
      x2.connect(gain(a, 0.2)).connect(amp);
      x.connect(amp);
      m.connect(gain(a, 0.5)).connect(amp.gain);
      amp.connect(lv).connect(p).connect(o);
      x.start(); x2.start(); m.start();
      B.drive(B.slow(0.12), lv.gain, 0.011);
    }
  },
  runners: (B, out, k = 1) => {
    const a = B.a, o = trimmed(B, out, 3 * k);
    B.src(tex.crunch(a)).connect(fl(a, 'lowpass', 3500, 0.5)).connect(gain(a, 0.45)).connect(o);
    B.events(0.2, () => 0.75, t => jingle(a, t, o, 2, 0.02));
  },
};
export { pick };
