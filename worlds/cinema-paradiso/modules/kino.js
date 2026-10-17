// kino — all the cinema of Giancaldo (kino.md): the frames of the films of those years, the screen, the projector's
// beam, the projector, the tin, the strip of film, the changeover cue. Paintings only: what moves is the scene's
// animate (kino.screenMove, kino.beamMove help), the beam's smoke and motes are the world's shader
// (tools/kino-beam.wgsl, copied by tools/kino-beam.js). Warm is the cinema's light alone.
const TAU = Math.PI * 2;
const hash = (n, s) => anim.hash(n, s);

// ── the frames: one frame of a black-and-white film of the forties on a w×h rectangle at (x, y) ──────────────────
// silhouettes and profiles against the light, no faces; the print's own darkened corners and a little grain
const FRAMES = ['romance', 'romance_kiss', 'comedy', 'kiss_cut1', 'kiss_cut2', 'kiss_cut3',
  'kiss1', 'kiss2', 'kiss3', 'kiss4', 'kiss5', 'kiss6', 'kiss7', 'kiss8', 'elena8', 'white'];
function bg(g, x, y, w, h, a, b) {
  const gr = g.createLinearGradient(x, y, x + w, y + h);
  gr.addColorStop(0, a); gr.addColorStop(0.6, b); gr.addColorStop(1, a);
  g.fillStyle = gr; g.fillRect(x, y, w, h);
}
function vignette(g, x, y, w, h, k = 0.55) {
  const v = g.createRadialGradient(x + w / 2, y + h / 2, h * 0.3, x + w / 2, y + h / 2, w * 0.62);
  v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, `rgba(10,10,10,${k})`);
  g.fillStyle = v; g.fillRect(x, y, w, h);
}
function grain(g, x, y, w, h, seed) {
  for (let i = 0; i < 70; i++) {
    g.fillStyle = i % 2 ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)';
    g.fillRect(x + hash(i, seed) * w, y + hash(i, seed + 1) * h, w * 0.004, h * 0.004 + hash(i, seed + 2) * h * 0.03);
  }
}
// a man in profile facing right (dir 1) or left (−1), his head's centre at (hx, hy), s — the frame's height; hat
function man(g, hx, hy, s, { dir = 1, lean = 0, hat = true, cap = false, ink = '#141312' } = {}) {
  g.save(); g.translate(hx, hy); g.scale(dir, 1); g.rotate(lean);
  g.fillStyle = ink;
  g.beginPath(); g.moveTo(-0.17 * s, 0.85 * s); g.lineTo(-0.13 * s, 0.22 * s); g.quadraticCurveTo(-0.02 * s, 0.1 * s, 0.1 * s, 0.2 * s);
  g.lineTo(0.16 * s, 0.85 * s); g.fill();
  g.beginPath(); g.ellipse(0.01 * s, 0, 0.055 * s, 0.1 * s, 0.1, 0, TAU); g.fill();
  g.beginPath(); g.ellipse(0.05 * s, 0.01 * s, 0.025 * s, 0.025 * s, 0, 0, TAU); g.fill();
  if (hat) {
    g.fillRect(-0.09 * s, -0.11 * s, 0.2 * s, 0.025 * s);
    g.beginPath(); g.ellipse(0.01 * s, -0.12 * s, 0.06 * s, 0.06 * s, 0, Math.PI, 0); g.fill();
  } else if (cap) {
    g.beginPath(); g.ellipse(0.0, -0.09 * s, 0.065 * s, 0.035 * s, 0, Math.PI, 0); g.fill();
    g.fillRect(0.0, -0.1 * s, 0.09 * s, 0.015 * s);
  }
  g.restore();
}
// a woman in profile facing left (dir 1) or right (−1), hair up; head at (hx, hy)
function woman(g, hx, hy, s, { dir = 1, lean = 0, ink = '#262422', loose = false } = {}) {
  g.save(); g.translate(hx, hy); g.scale(dir, 1); g.rotate(lean);
  g.fillStyle = ink;
  g.beginPath(); g.moveTo(-0.1 * s, 0.85 * s); g.lineTo(-0.07 * s, 0.25 * s); g.quadraticCurveTo(-0.05 * s, 0.12 * s, 0.0, 0.11 * s);
  g.quadraticCurveTo(0.06 * s, 0.12 * s, 0.07 * s, 0.27 * s); g.lineTo(0.13 * s, 0.85 * s); g.fill();
  g.beginPath(); g.ellipse(-0.005 * s, 0, 0.042 * s, 0.09 * s, -0.15, 0, TAU); g.fill();
  if (loose) { g.beginPath(); g.ellipse(0.04 * s, 0.03 * s, 0.05 * s, 0.12 * s, 0.2, 0, TAU); g.fill(); }
  else { g.beginPath(); g.ellipse(0.025 * s, -0.04 * s, 0.05 * s, 0.075 * s, 0.4, 0, TAU); g.fill(); }
  g.restore();
}
// the two of them, heads come together at (cx, cy): he from the left, she from the right
function kissing(g, cx, cy, s, o = {}) {
  man(g, cx - 0.045 * s, cy + 0.02 * s, s, { lean: 0.2, hat: o.hat ?? true, cap: o.cap, ink: o.inkM });
  woman(g, cx + 0.04 * s, cy + 0.04 * s, s * 0.95, { lean: -0.24, loose: o.loose, ink: o.inkW });
}
// the cut edges of a frame spliced back: a slanted scar across the top and a strip of tape at the bottom
function splices(g, x, y, w, h) {
  g.strokeStyle = 'rgba(240,236,224,0.7)'; g.lineWidth = h * 0.012;
  g.beginPath(); g.moveTo(x, y + h * 0.05); g.lineTo(x + w, y + h * 0.02); g.stroke();
  g.fillStyle = 'rgba(210,200,170,0.28)'; g.fillRect(x, y + h * 0.9, w, h * 0.06);
  g.strokeStyle = 'rgba(20,18,16,0.6)'; g.lineWidth = h * 0.006;
  g.beginPath(); g.moveTo(x, y + h * 0.9); g.lineTo(x + w, y + h * 0.905); g.stroke();
}
function windowBars(g, wx, wy, ww, wh, w, h, bright = '#efede6') {
  g.fillStyle = bright; g.fillRect(wx, wy, ww, wh);
  g.fillStyle = '#4a4844'; g.fillRect(wx + ww / 2 - w * 0.008, wy, w * 0.016, wh); g.fillRect(wx, wy + wh * 0.45, ww, h * 0.02);
}
const SCENES = {
  romance(g, x, y, w, h, kiss) {
    bg(g, x, y, w, h, '#9c9a94', '#cfccc4');
    const wx = x + w * 0.56, wy = y + h * 0.1, ww = w * 0.3, wh = h * 0.62;
    windowBars(g, wx, wy, ww, wh, w, h);
    g.fillStyle = 'rgba(80,78,74,0.55)'; g.fillRect(wx - w * 0.04, wy - h * 0.04, w * 0.06, wh + h * 0.08);
    if (kiss) kissing(g, x + w * 0.5, y + h * 0.34, h);
    else { man(g, x + w * 0.27, y + h * 0.3, h); woman(g, wx + ww * 0.42, y + h * 0.37, h * 0.95); }
  },
  comedy(g, x, y, w, h) {
    // «Пожарные из Виджу»: the fat one at the foot of a ladder, the thin one high on it, arms flung out
    bg(g, x, y, w, h, '#8e8c86', '#d2cfc6');
    g.fillStyle = '#a9a69e'; g.fillRect(x + w * 0.55, y, w * 0.45, h);
    g.fillStyle = '#5d5b57'; for (const [u, v] of [[0.62, 0.15], [0.82, 0.15], [0.62, 0.48], [0.82, 0.48]]) g.fillRect(x + w * u, y + h * v, w * 0.1, h * 0.2);
    g.strokeStyle = '#2a2826'; g.lineWidth = w * 0.012;
    g.save(); g.translate(x + w * 0.42, y + h); g.rotate(0.42);
    g.beginPath(); g.moveTo(-w * 0.04, 0); g.lineTo(-w * 0.04, -h * 0.95); g.moveTo(w * 0.04, 0); g.lineTo(w * 0.04, -h * 0.95);
    for (let k = 1; k < 9; k++) { g.moveTo(-w * 0.04, -h * 0.1 * k); g.lineTo(w * 0.04, -h * 0.1 * k); } g.stroke(); g.restore();
    g.fillStyle = '#161514';
    const fx = x + w * 0.3, fy = y + h;
    g.beginPath(); g.ellipse(fx, fy - h * 0.3, w * 0.09, h * 0.24, 0, 0, TAU); g.fill();
    g.fillRect(fx - w * 0.06, fy - h * 0.12, w * 0.12, h * 0.12);
    g.beginPath(); g.ellipse(fx + w * 0.01, fy - h * 0.6, w * 0.04, h * 0.075, 0, 0, TAU); g.fill();
    g.beginPath(); g.ellipse(fx + w * 0.01, fy - h * 0.66, w * 0.055, h * 0.035, 0, Math.PI, 0); g.fill();
    const tx = x + w * 0.63, ty = y + h * 0.28;
    g.fillRect(tx - w * 0.012, ty, w * 0.024, h * 0.3);
    g.beginPath(); g.ellipse(tx, ty - h * 0.05, w * 0.025, h * 0.05, 0, 0, TAU); g.fill();
    g.lineWidth = w * 0.012; g.strokeStyle = '#161514';
    g.beginPath(); g.moveTo(tx, ty + h * 0.04); g.lineTo(tx - w * 0.08, ty - h * 0.06); g.moveTo(tx, ty + h * 0.04); g.lineTo(tx + w * 0.07, ty - h * 0.08);
    g.moveTo(tx, ty + h * 0.29); g.lineTo(tx - w * 0.05, ty + h * 0.42); g.moveTo(tx, ty + h * 0.29); g.lineTo(tx + w * 0.04, ty + h * 0.43); g.stroke();
  },
  // the three the boy saw cut (kiss_cut1…3): a drawing room by a lamp, a garden gate, a ballroom's door
  kiss_cut1(g, x, y, w, h) {
    bg(g, x, y, w, h, '#77746e', '#bcb8ae');
    const lx = x + w * 0.78, ly = y + h * 0.3;
    const lg = g.createRadialGradient(lx, ly, 0, lx, ly, h * 0.5); lg.addColorStop(0, 'rgba(250,246,236,0.9)'); lg.addColorStop(1, 'rgba(250,246,236,0)');
    g.fillStyle = lg; g.fillRect(x, y, w, h);
    g.fillStyle = '#3a3834'; g.fillRect(lx - w * 0.01, ly, w * 0.02, h * 0.7); g.beginPath(); g.moveTo(lx - w * 0.06, ly); g.lineTo(lx + w * 0.06, ly); g.lineTo(lx + w * 0.035, ly - h * 0.12); g.lineTo(lx - w * 0.035, ly - h * 0.12); g.fill();
    kissing(g, x + w * 0.45, y + h * 0.36, h);
  },
  kiss_cut2(g, x, y, w, h) {
    bg(g, x, y, w, h, '#86847e', '#d4d0c6');
    g.fillStyle = '#2c2b28';
    for (let i = 0; i < 9; i++) g.fillRect(x + w * (0.05 + i * 0.1), y + h * 0.45, w * 0.018, h * 0.55);
    g.fillRect(x, y + h * 0.5, w, h * 0.02); g.fillRect(x, y + h * 0.75, w, h * 0.02);
    g.beginPath(); g.ellipse(x + w * 0.12, y + h * 0.25, w * 0.2, h * 0.28, 0, 0, TAU); g.fill();
    kissing(g, x + w * 0.56, y + h * 0.33, h, { hat: false });
  },
  kiss_cut3(g, x, y, w, h) {
    bg(g, x, y, w, h, '#5e5c58', '#a7a39b');
    g.fillStyle = '#e8e4da'; g.fillRect(x + w * 0.35, y + h * 0.05, w * 0.3, h * 0.95);
    g.fillStyle = 'rgba(30,28,26,0.5)'; g.fillRect(x + w * 0.33, y + h * 0.03, w * 0.02, h * 0.97); g.fillRect(x + w * 0.65, y + h * 0.03, w * 0.02, h * 0.97);
    kissing(g, x + w * 0.5, y + h * 0.33, h, { hat: false, loose: true });
  },
  // the eight more of the reel (kiss1…8): a sailor and a girl, a couple in a doorway, under an umbrella in rain, in a
  // motor car, on a stair, at a train's window, on a balcony, by the sea
  kiss1(g, x, y, w, h) { // a sailor and a girl on a quay, masts behind
    bg(g, x, y, w, h, '#9a9a96', '#dcdad2');
    g.strokeStyle = '#4e4c48'; g.lineWidth = w * 0.006;
    for (const u of [0.1, 0.22, 0.8, 0.9]) { g.beginPath(); g.moveTo(x + w * u, y + h * 0.65); g.lineTo(x + w * u, y + h * 0.02); g.stroke(); }
    g.fillStyle = '#6a6864'; g.fillRect(x, y + h * 0.65, w, h * 0.35);
    kissing(g, x + w * 0.5, y + h * 0.32, h, { hat: false, cap: true });
  },
  kiss2(g, x, y, w, h) { // a couple in a doorway, light behind them
    bg(g, x, y, w, h, '#3e3c3a', '#5c5a56');
    g.fillStyle = '#f2efe6'; g.fillRect(x + w * 0.32, y + h * 0.04, w * 0.36, h * 0.96);
    kissing(g, x + w * 0.5, y + h * 0.33, h, { inkM: '#0e0d0c', inkW: '#141312' });
  },
  kiss3(g, x, y, w, h) { // under an umbrella in the rain
    bg(g, x, y, w, h, '#6e6e70', '#a8a8a6');
    g.strokeStyle = 'rgba(230,230,228,0.45)'; g.lineWidth = w * 0.002;
    for (let i = 0; i < 80; i++) { const rx = x + hash(i, 31) * w, ry = y + hash(i, 32) * h; g.beginPath(); g.moveTo(rx, ry); g.lineTo(rx - w * 0.01, ry + h * 0.08); g.stroke(); }
    kissing(g, x + w * 0.5, y + h * 0.4, h * 0.9);
    g.fillStyle = '#121110'; g.beginPath(); g.ellipse(x + w * 0.5, y + h * 0.24, w * 0.2, h * 0.12, 0, Math.PI, 0); g.fill();
    g.fillRect(x + w * 0.497, y + h * 0.12, w * 0.006, h * 0.3);
  },
  kiss4(g, x, y, w, h) { // in a motor car: the window's frame, the two inside
    bg(g, x, y, w, h, '#545250', '#8c8a84');
    g.fillStyle = '#bdbab2'; g.fillRect(x + w * 0.15, y + h * 0.15, w * 0.7, h * 0.5);
    kissing(g, x + w * 0.5, y + h * 0.4, h * 0.8);
    g.fillStyle = '#1a1918'; g.fillRect(x, y + h * 0.65, w, h * 0.35); g.fillRect(x, y, w, h * 0.15);
    g.fillRect(x, y, w * 0.15, h); g.fillRect(x + w * 0.85, y, w * 0.15, h);
  },
  kiss5(g, x, y, w, h) { // on a stair, he a step below
    bg(g, x, y, w, h, '#8c8a84', '#cac6bc');
    g.fillStyle = '#5a5854';
    for (let i = 0; i < 6; i++) g.fillRect(x + w * (0.1 + i * 0.12), y + h * (0.95 - i * 0.12), w * 0.9, h * 0.04);
    man(g, x + w * 0.44, y + h * 0.38, h, { lean: 0.25, hat: false });
    woman(g, x + w * 0.52, y + h * 0.28, h * 0.95, { lean: -0.3 });
  },
  kiss6(g, x, y, w, h) { // at a train's window: she leans out, he on the platform
    bg(g, x, y, w, h, '#757370', '#b2afa8');
    g.fillStyle = '#2a2927'; g.fillRect(x + w * 0.45, y, w * 0.55, h * 0.78);
    g.fillStyle = '#d8d5cc'; g.fillRect(x + w * 0.52, y + h * 0.1, w * 0.3, h * 0.32);
    woman(g, x + w * 0.56, y + h * 0.3, h * 0.9, { lean: -0.35 });
    man(g, x + w * 0.46, y + h * 0.36, h, { lean: 0.15 });
    g.fillStyle = 'rgba(240,240,236,0.5)'; g.beginPath(); g.ellipse(x + w * 0.2, y + h * 0.2, w * 0.18, h * 0.14, 0, 0, TAU); g.fill();
  },
  kiss7(g, x, y, w, h) { // on a balcony under the night
    bg(g, x, y, w, h, '#2e2e32', '#585856');
    g.fillStyle = '#e8e6de'; g.beginPath(); g.arc(x + w * 0.8, y + h * 0.18, h * 0.07, 0, TAU); g.fill();
    g.strokeStyle = '#121212'; g.lineWidth = w * 0.008;
    g.beginPath(); g.moveTo(x, y + h * 0.7); g.lineTo(x + w, y + h * 0.7); g.stroke();
    for (let i = 0; i < 14; i++) { g.beginPath(); g.moveTo(x + w * i / 13, y + h * 0.7); g.lineTo(x + w * i / 13, y + h); g.stroke(); }
    kissing(g, x + w * 0.45, y + h * 0.33, h, { inkM: '#0b0b0b', inkW: '#111' });
  },
  kiss8(g, x, y, w, h) { // by the sea: the horizon, the sun low
    bg(g, x, y, w, h, '#8a8884', '#e2dfd6');
    g.fillStyle = '#f6f4ee'; g.beginPath(); g.arc(x + w * 0.5, y + h * 0.58, h * 0.12, 0, TAU); g.fill();
    g.fillStyle = '#5e5c58'; g.fillRect(x, y + h * 0.6, w, h * 0.4);
    g.fillStyle = 'rgba(240,238,230,0.5)'; for (let i = 0; i < 6; i++) g.fillRect(x + w * (0.35 + hash(i, 7) * 0.3), y + h * (0.63 + i * 0.05), w * 0.12, h * 0.01);
    kissing(g, x + w * 0.5, y + h * 0.36, h * 1.05, { hat: false, loose: true });
  },
  // the faded colour of an 8 mm reel: the square at dusk, a girl walking across (her place: kino.elena8Girl, a layer)
  elena8(g, x, y, w, h) {
    const gr = g.createLinearGradient(x, y, x, y + h);
    gr.addColorStop(0, '#8a8aa0'); gr.addColorStop(0.5, '#c8a888'); gr.addColorStop(1, '#7a6a5a');
    g.fillStyle = gr; g.fillRect(x, y, w, h);
    g.fillStyle = '#a8957c'; g.fillRect(x, y + h * 0.25, w * 0.3, h * 0.5); g.fillRect(x + w * 0.72, y + h * 0.2, w * 0.28, h * 0.55);
    g.fillStyle = '#6e5e50'; g.fillRect(x + w * 0.8, y + h * 0.45, w * 0.06, h * 0.3);
    g.fillStyle = '#8c7a68'; g.fillRect(x, y + h * 0.75, w, h * 0.25);
    g.fillStyle = '#b8a688'; g.beginPath(); g.ellipse(x + w * 0.45, y + h * 0.78, w * 0.12, h * 0.04, 0, 0, TAU); g.fill();
  },
};
function frame(g, name, x, y, w, h) {
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
  if (name === 'white' || !SCENES[name] && !name.startsWith('romance')) {
    g.fillStyle = '#f4f2ec'; g.fillRect(x, y, w, h); g.restore(); return;
  }
  if (name === 'romance' || name === 'romance_kiss') SCENES.romance(g, x, y, w, h, name === 'romance_kiss');
  else SCENES[name](g, x, y, w, h);
  if (name.startsWith('kiss_cut')) splices(g, x, y, w, h);
  if (name !== 'elena8') { grain(g, x, y, w, h, FRAMES.indexOf(name) * 7 + 1); vignette(g, x, y, w, h); }
  else vignette(g, x, y, w, h, 0.4);
  g.restore();
}
// the girl in the 8 mm reel, small, walking (in her own layer: the scene's animate moves her across)
function elena8Girl(g, x, y, h) {
  g.fillStyle = '#e8dcc4';
  g.beginPath(); g.moveTo(x - h * 0.05, y); g.lineTo(x - h * 0.03, y - h * 0.22); g.lineTo(x + h * 0.03, y - h * 0.22); g.lineTo(x + h * 0.06, y); g.fill();
  g.fillStyle = '#3a2a20'; g.beginPath(); g.ellipse(x, y - h * 0.27, h * 0.03, h * 0.045, 0, 0, TAU); g.fill();
  g.fillStyle = '#c99d7a'; g.beginPath(); g.ellipse(x + h * 0.004, y - h * 0.265, h * 0.022, h * 0.03, 0, 0, TAU); g.fill();
}

// ── the screen: a white surface with the film on it ─────────────────────────────────────────────────────────────
// screen(g, e, {x, y, w, h, frames: [names], key, burn}) — the sheet (paint), and each frame its own layer
// (`f_<name>`, flickering a little), shown by animate (screenMove) as e.state[key] says; burn — a layer `burn`: the
// frame blisters and whitens from the middle (screenMove with the burn key). The element should be "glows": true —
// a lit screen is light, the night does not darken it. Its point: `#screen` (the middle).
function screen(g, e, o) {
  const { x, y, w, h } = o;
  g.fillStyle = o.sheet ?? '#e9e5da'; g.fillRect(x, y, w, h);
  for (const name of o.frames ?? []) e.layer(`f_${name}`, { flicker: 0.12 }, l => frame(l, name, x, y, w, h));
  if (o.burn) e.layer('burn', { pivot: [x + w / 2, y + h / 2], box: [x, y, x + w, y + h] }, l => {
    const c = [x + w / 2, y + h / 2];
    const r = l.createRadialGradient(c[0], c[1], 0, c[0], c[1], Math.max(w, h) * 0.6);
    r.addColorStop(0, '#fffdf6'); r.addColorStop(0.55, '#f6eedb'); r.addColorStop(0.75, 'rgba(160,110,60,0.9)'); r.addColorStop(0.82, 'rgba(40,24,12,0.8)'); r.addColorStop(1, 'rgba(40,24,12,0)');
    l.fillStyle = r; l.fillRect(x, y, w, h);
    for (let i = 0; i < 18; i++) {
      const a = hash(i, 51) * TAU, d = hash(i, 52) * Math.min(w, h) * 0.35;
      l.fillStyle = 'rgba(255,252,240,0.9)'; l.beginPath(); l.arc(c[0] + Math.cos(a) * d, c[1] + Math.sin(a) * d, Math.min(w, h) * (0.03 + hash(i, 53) * 0.06), 0, TAU); l.fill();
    }
  });
  e.at(x + w / 2, y + h / 2, 'screen');
}
// in animate: the frame named by e.state[key] seen (the others hidden), a quick cross of 0.15 s between; burn 0…1 —
// e.state[burnKey]: the blister grows from the middle; on — e.state[onKey] (0…1, default 1) dims all of it
function screenMove(e, frames, key, burnKey, onKey) {
  const now = e.state[key], on = onKey ? Math.max(0, Math.min(1, e.state[onKey] ?? 1)) : 1, m = e.mem;
  m.a ??= {};
  for (const name of frames) {
    const want = name === now ? 1 : 0, a = m.a[name] ?? want;
    m.a[name] = a + Math.max(-e.dt / 0.15, Math.min(e.dt / 0.15, want - a));
    e.layer(`f_${name}`).alpha = m.a[name] * on;
  }
  if (burnKey) {
    const b = Math.max(0, Math.min(1, e.state[burnKey] || 0)), l = e.layer('burn');
    l.alpha = Math.min(1, b * 1.6); l.scale = 0.05 + 0.95 * anim.ease.out(b);
  }
}
// the changeover cue: a dark round spot in the frame's upper right, its diameter 1/8 of the frame's height
function cue(g, x, y, w, h) {
  const r = h / 16;
  g.fillStyle = 'rgba(18,16,14,0.9)'; g.beginPath(); g.arc(x + w - w * 0.07 - r, y + h * 0.07 + r, r, 0, TAU); g.fill();
}

// ── the beam: a wedge of light from the lens ────────────────────────────────────────────────────────────────────
// beam(e, {len, top, bot, mouth: 0.05, dust: 260}) — painted in the vertical plane of the beam: x along it from the
// lens (the anchor: 0) to `len`, y down; at the far end it spans y top…bot. Layers: 1 `cone` (warm, brighter at the
// mouth), 2 `dust` (motes drifting toward the far end; the world's shader keeps them in the cone and breathes smoke
// through it), 3 `tip` — a glow and the warm light at the far end (e.light radius 1.5: it lays the spot of light on
// what the beam reaches — the stone, the heads, the wall); the element must be "glows": true and carry the world's
// shader (node tools/kino-beam.js <folder> <id>), its uniform `on`. Points: `#beam` (the middle), `#tip`, `#mouth`.
// What moves it is the scene's: beamMove.
function beam(e, o) {
  const len = o.len, top = o.top, bot = o.bot, mo = o.mouth ?? 0.05, n = o.dust ?? 260;
  e.layer('cone', { box: [-0.1, Math.min(top, -mo) - 0.2, len + 0.1, Math.max(bot, mo) + 0.2] }, c => {
    const gr = c.createLinearGradient(0, 0, len, 0);
    gr.addColorStop(0, 'rgba(255,232,186,1)'); gr.addColorStop(0.04, 'rgba(255,222,165,0.55)');
    gr.addColorStop(0.35, 'rgba(255,210,150,0.22)'); gr.addColorStop(1, 'rgba(255,205,145,0.12)');
    c.fillStyle = gr; c.beginPath(); c.moveTo(0, -mo); c.lineTo(len, top); c.lineTo(len, bot); c.lineTo(0, mo); c.closePath(); c.fill();
    const core = c.createLinearGradient(0, 0, len, 0);
    core.addColorStop(0, 'rgba(255,240,205,0.6)'); core.addColorStop(0.5, 'rgba(255,230,190,0.08)'); core.addColorStop(1, 'rgba(255,230,190,0.04)');
    c.fillStyle = core;
    c.beginPath(); c.moveTo(0, -mo * 0.4); c.lineTo(len, top * 0.62 + bot * 0.38); c.lineTo(len, top * 0.38 + bot * 0.62); c.lineTo(0, mo * 0.4); c.closePath(); c.fill();
  });
  e.layer('dust', { drift: [o.drift ?? 0.8, 0], box: [0, Math.min(top, -mo) - 0.1, len, Math.max(bot, mo) + 0.1] }, d => {
    for (let i = 0; i < n; i++) {
      const u = Math.pow(hash(i, 81), 1.3), x = u * len, y = mix(-mo, top, u) + hash(i, 82) * (mix(mo, bot, u) - mix(-mo, top, u));
      const r = (0.006 + hash(i, 83) * 0.02) * (0.4 + u) * Math.max(1, len / 15);
      d.fillStyle = 'rgba(255,236,200,' + (0.35 + hash(i, 84) * 0.5) + ')';
      d.beginPath(); d.arc(x, y, r, 0, TAU); d.fill();
    }
  });
  const mid = (top + bot) / 2;
  e.layer('tip', { box: [len - 1.6, mid - 1.6, len + 1.6, mid + 1.6] }, t => {
    e.light(len, mid, o.tipRadius ?? 1.5, '#ffd9a0', o.tipStrength ?? 1, 'tip');
    e.at(len, mid, 'tip');
  });
  e.light(0.02, 0, 0.08, '#ffe2b0', 1, 'mouth');
  e.at(0.02, 0, 'mouth');
  e.at(len / 2, mid / 2, 'beam');
}
const mix = (a, b, u) => a + (b - a) * u;
// in animate: on 0…1 (the shader's uniform and the glows); reach — the share of its length it reaches now (1 whole),
// tilt — radians the beam is turned down (+) or up about its mouth (the cone, the dust and the tip turned together)
const MOVED = ['cone', 'dust'];
function beamMove(e, on, reach = 1, tilt = 0, len) {
  on = Math.max(0, Math.min(1, on || 0));
  e.uniform('on', on);
  e.glow('mouth', on);
  e.glow('tip', on);
  for (const name of MOVED) { const l = e.layer(name); l.scaleX = reach; l.rotate = tilt; }
  if (len != null) {
    const t = e.layer('tip'), d = len * reach;
    t.x = d * Math.cos(tilt) - len; t.y = d * Math.sin(tilt);
    t.rotate = 0;
  }
}

// ── the projector of the forties, seen from its side (x toward the lens, y down from its top, the floor y 0) ─────
// pedestal, the mechanism, the lamp house with its chimney, the lens; the reels are layers (projectorReels);
// side: 'motor' — the face with the motor's crank (a layer `crank`) and the lever at its back, middle
function projector(g, side) {
  g.fillStyle = '#2b2a2c';
  g.beginPath(); g.moveTo(-0.3, 0); g.lineTo(0.34, 0); g.lineTo(0.2, -0.08); g.lineTo(0.1, -0.85); g.lineTo(-0.12, -0.85); g.lineTo(-0.2, -0.08); g.closePath(); g.fill();
  g.fillStyle = '#3c3b3f'; g.fillRect(-0.3, -1.08, 0.66, 0.26);
  g.fillStyle = '#46454a'; g.fillRect(-0.12, -1.55, 0.46, 0.5);
  g.fillStyle = '#56565c'; g.fillRect(-0.1, -1.52, 0.42, 0.04);
  g.fillStyle = '#323136'; g.fillRect(-0.4, -1.72, 0.3, 0.6);
  g.fillStyle = '#28272a'; g.fillRect(-0.33, -1.92, 0.15, 0.22);
  for (let k = 0; k < 4; k++) { g.fillStyle = '#1c1b1e'; g.fillRect(-0.37, -1.62 + k * 0.1, 0.24, 0.035); }
  g.fillStyle = '#1b1b1e'; g.fillRect(0.32, -1.42, 0.2, 0.13);
  g.fillStyle = '#8f8c84'; g.fillRect(0.5, -1.41, 0.03, 0.11);
  g.strokeStyle = '#2a292d'; g.lineWidth = 0.025;
  g.beginPath(); g.moveTo(0.1, -1.55); g.lineTo(0.06, -1.95); g.moveTo(0.05, -0.82); g.lineTo(0.02, -0.62); g.stroke();
  if (side === 'motor') g.fillStyle = '#5a4a32', g.fillRect(-0.04, -1.13, 0.07, 0.07);
}
function reel(r, x, y, R) {
  r.fillStyle = '#4a4b50'; r.beginPath(); r.arc(x, y, R, 0, TAU); r.fill();
  r.fillStyle = '#26272b'; r.beginPath(); r.arc(x, y, R * 0.72, 0, TAU); r.fill();
  r.fillStyle = '#6d6f75'; for (let k = 0; k < 3; k++) { const a = k * 2.094; r.beginPath(); r.ellipse(x + Math.cos(a) * R * 0.45, y + Math.sin(a) * R * 0.45, R * 0.17, R * 0.17, 0, 0, TAU); r.fill(); }
  r.fillStyle = '#a5a7ad'; r.beginPath(); r.arc(x, y, R * 0.1, 0, TAU); r.fill();
}
const REEL_TOP = [0.06, -2.2, 0.28], REEL_LOW = [0.02, -0.55, 0.24];
function projectorReels(e, flip) {
  const f = flip ? -1 : 1;
  e.layer('rt', { pivot: [f * REEL_TOP[0], REEL_TOP[1]] }, r => { r.scale(f, 1); reel(r, REEL_TOP[0], REEL_TOP[1], REEL_TOP[2]); });
  e.layer('rl', { pivot: [f * REEL_LOW[0], REEL_LOW[1]] }, r => { r.scale(f, 1); reel(r, REEL_LOW[0], REEL_LOW[1], REEL_LOW[2]); });
}
function reelsMove(e, flip, motor) {
  const m = e.mem, f = flip ? -1 : 1;
  m.ph = (m.ph || 0) + e.dt * 3.0 * (motor || 0);
  e.layer('rt').rotate = f * m.ph; e.layer('rl').rotate = f * m.ph * 1.25;
}

// ── the tin and the strip ───────────────────────────────────────────────────────────────────────────────────────
// a flat round film tin seen from above at an angle: (cx, cy) its middle, r its radius (metres), open — its lid aside
function tin(g, e, cx = 0, cy = 0, r = 0.18, open = false) {
  const lid = (x, y) => {
    g.fillStyle = '#7f807c'; g.beginPath(); g.ellipse(x, y, r, r * 0.42, 0, 0, TAU); g.fill();
    g.strokeStyle = '#5a5b58'; g.lineWidth = r * 0.04; g.beginPath(); g.ellipse(x, y, r * 0.8, r * 0.33, 0, 0, TAU); g.stroke();
  };
  g.fillStyle = '#595a57'; g.beginPath(); g.ellipse(cx, cy + r * 0.12, r, r * 0.42, 0, 0, TAU); g.fill();
  g.fillRect(cx - r, cy, 2 * r, r * 0.12);
  if (open) {
    g.fillStyle = '#2c2420'; g.beginPath(); g.ellipse(cx, cy, r * 0.92, r * 0.38, 0, 0, TAU); g.fill();
    g.fillStyle = '#3a2c22'; for (let i = 0; i < 9; i++) g.fillRect(cx - r * 0.6 + hash(i, 61) * r * 1.1, cy - r * 0.2 + hash(i, 62) * r * 0.3, r * 0.22, r * 0.08);
    lid(cx + r * 1.7, cy + r * 0.2);
  } else lid(cx, cy);
  e?.at(cx, cy, 'tin');
}
// a length of film from (x0, y) along +x, its height h: perforations on both edges, the frames (names) in a row;
// spliced — the cut lines between those that were cut and glued
function strip(g, x0, y, h, frames, { gap = 0.06 } = {}) {
  const fw = h * 0.72 * 1.33, fh = h * 0.72, step = fw + h * gap, w = frames.length * step;
  g.fillStyle = '#2a211b'; g.fillRect(x0, y - h / 2, w, h);
  g.fillStyle = '#d9cfb8';
  for (let x = x0 + h * 0.06; x < x0 + w; x += h * 0.14) { g.fillRect(x, y - h / 2 + h * 0.04, h * 0.07, h * 0.06); g.fillRect(x, y + h / 2 - h * 0.1, h * 0.07, h * 0.06); }
  frames.forEach((name, i) => frame(g, name, x0 + i * step + h * gap / 2, y - fh / 2, fw, fh));
  return { width: w, step, frameW: fw, frameH: fh };
}

return { FRAMES, frame, elena8Girl, screen, screenMove, cue, beam, beamMove, projector, projectorReels, reelsMove, reel,
  REEL_TOP, REEL_LOW, tin, strip, man, woman, kissing };
