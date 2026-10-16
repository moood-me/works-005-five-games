// The square — what the scene's paintings, animate and script share: the place in metres (G), the painters of the
// fronts round the square, the light of an hour and an era (LIGHT), the camera's shots (CAM), the people of each
// beat (cast) and the film itself (FILM: the beats, scene.kit.beats).
// Metres: x — across (east +), z — distance from the square's south edge (north +); the start is at (0, 0), looking
// north. A card's "facing" is where its face looks (90 — east); its painting's +x runs along heading facing − 90.
const TAU = Math.PI * 2;
const hash = (n, s) => anim.hash(n, s);
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));

// ── the place ────────────────────────────────────────────────────────────────────────────────────────────────────
const G = {
  DOOR: [-12, 12],                 // the Paradiso's doors (its face at x −12)
  BOOTH: [-11.9, 16, 6],           // the booth's window on the square (the beam's mouth)
  ALF_DOOR: [-12, 3],              // Alfredo's door
  ALF_SEAT: [-11.38, 3.12, 0.45],  // his chair by it
  ALF_STEP: [-11.62, 2.05, 0.2],   // the doorstep beside it (Toto sits there at seventeen)
  BANK_DOOR: [12, 13],
  CHAIR: [11.3, 15.6, 0.45],       // Toto's chair by the bank's wall (the wall on his left)
  FOUNT: [0, 13], FOUNT_R: 1.4, RIM: 0.5,
  SCREEN: [2, 26, 4.5],            // the middle of the film on the white wall
  MOTHER_WIN: [-9, 26, 5],
  // the beam's spot: on the stone and the heads under the window (aim 0) … up the white wall (aim 1)
  AIM0: [-8.6, 15.2, 1.1], AIM_GROUND: [1.6, 25.4, 1.1],
  // the hearse's way: from the street along the west side, past the Paradiso, to the church steps
  CART: [[-9.6, -8], [-9.6, 21], [4.6, 22.6]],
};
// the beam from the booth window to where `aim` puts its end → {heading (plan, degrees), tilt (radians down), len}
function aimPoint(aim) {
  const a = clamp(aim);
  let p;
  if (a <= 0.82) { const u = a / 0.82; p = G.AIM0.map((v, i) => v + (G.AIM_GROUND[i] - v) * anim.ease.inOut(u)); }
  else { const u = (a - 0.82) / 0.18; p = [mixN(G.AIM_GROUND[0], G.SCREEN[0], u), mixN(G.AIM_GROUND[1], G.SCREEN[1] - 0.05, u), mixN(G.AIM_GROUND[2], G.SCREEN[2], anim.ease.inOut(u))]; }
  return p;
}
function mixN(a, b, u) { return a + (b - a) * u; }
function beamOf(aim) {
  const p = aimPoint(aim), [bx, bz, by] = G.BOOTH, dx = p[0] - bx, dz = p[1] - bz, dy = p[2] - by;
  const flat = Math.hypot(dx, dz);
  return { heading: Math.atan2(dx, dz) * 180 / Math.PI, tilt: Math.atan2(-dy, flat), len: Math.hypot(flat, dy) };
}
const BEAM_LEN = 18;
// the sky (the world's sky): the moon over the sea, north-north-east, over the lane's end
const SKY = { horizon: 0.5, round: true, moon: 15, glow: -60 }; // the beam is painted this long; its reach is the share of it
// the hearse's way: a point at share u of it → [x, z, heading]
const CART_L = (() => { let L = 0; for (let i = 1; i < G.CART.length; i++) L += Math.hypot(G.CART[i][0] - G.CART[i - 1][0], G.CART[i][1] - G.CART[i - 1][1]); return L; })();
function cartAt(u, back = 0) {
  let d = clamp(u) * CART_L - back;
  for (let i = 1; i < G.CART.length; i++) {
    const a = G.CART[i - 1], b = G.CART[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (d <= l || i === G.CART.length - 1) {
      const t = clamp(d / l, -1, 1);
      return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, Math.atan2(b[0] - a[0], b[1] - a[1]) * 180 / Math.PI];
    }
    d -= l;
  }
}
// a point `fwd` metres ahead and `side` to the right of a place [x, z] facing heading h
function off(p, h, fwd, side) {
  const r = h * Math.PI / 180;
  return [p[0] + Math.sin(r) * fwd + Math.cos(r) * side, p[1] + Math.cos(r) * fwd - Math.sin(r) * side];
}
const brg = (a, b) => { const d = Math.atan2(b[0] - a[0], b[1] - a[1]) * 180 / Math.PI; return d < 0 ? d + 360 : d; };

// ── the light of an hour and an era: the scene's looks (their keys), what a beat's `from` carries ───────────────────
// hour 0…1 (0.25 dawn, 0.3 morning, 0.78 dusk, 0.9 night); era past — the warm night; now — the cool 1988
function LIGHT(era, hour) {
  const h = ((hour % 1) + 1) % 1, day = h >= 0.22 && h < 0.6, eve = h >= 0.6 && h < 0.84;
  return { era, hour, dusk_k: eve ? 1 : 0, now_k: era === 'now' ? 1 : 0, morning_k: era === 'now' && day ? 1 : 0 };
}
// how much of the night it is (the windows' light): night 1, dusk 0.65, day 0
const nightOf = hour => { const h = ((hour % 1) + 1) % 1; return h >= 0.22 && h < 0.6 ? 0 : h >= 0.6 && h < 0.84 ? 0.65 : 1; };

// ── painting: plaster, stone, windows, doors ─────────────────────────────────────────────────────────────────────
const PAL = { lime: '#d2b98f', ochre: '#c9a271', honey: '#d8bd8a', pale: '#e2d3b4', white: '#e9e2d2', stone: '#b9a47f',
  shade: '#8f7b5f', shutter: '#5f705f', shutter2: '#6b6f5a', door: '#4e3a2a', dark: '#1e1a17', iron: '#26231f' };
// plaster over w×h from (x, y) (y down), stains and a soft fall of grime under the cornice
function plaster(g, x, y, w, h, base, seed, k = 1) {
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
  g.fillStyle = base; g.fillRect(x, y, w, h);
  const n = Math.min(260, Math.round(w * h * 1.4 * k));
  for (let i = 0; i < n; i++) {
    const px = x + hash(i, seed) * w, py = y + hash(i, seed + 1) * h, r = 0.15 + hash(i, seed + 2) * 0.7;
    g.fillStyle = i % 3 ? 'rgba(70,50,30,0.045)' : 'rgba(255,240,215,0.05)';
    g.beginPath(); g.ellipse(px, py, r, r * (0.4 + hash(i, seed + 3) * 0.6), hash(i, seed + 4) * 3, 0, TAU); g.fill();
  }
  const gr = g.createLinearGradient(0, y, 0, y + h * 0.35);
  gr.addColorStop(0, 'rgba(60,45,30,0.22)'); gr.addColorStop(1, 'rgba(60,45,30,0)');
  g.fillStyle = gr; g.fillRect(x, y, w, h * 0.35);
  const gb = g.createLinearGradient(0, y + h - 1.2, 0, y + h);
  gb.addColorStop(0, 'rgba(60,45,30,0)'); gb.addColorStop(1, 'rgba(60,45,30,0.25)');
  g.fillStyle = gb; g.fillRect(x, y + h - 1.2, w, 1.2);
  g.restore();
}
// a cornice along the top, a string course at height y
function cornice(g, x, w, y, deep = 0.35) {
  g.fillStyle = PAL.stone; g.fillRect(x - 0.15, y - deep, w + 0.3, deep);
  g.fillStyle = 'rgba(40,30,20,0.35)'; g.fillRect(x - 0.15, y, w + 0.3, 0.08);
  g.fillStyle = 'rgba(255,245,225,0.25)'; g.fillRect(x - 0.15, y - deep, w + 0.3, 0.05);
}
function course(g, x, w, y) {
  g.fillStyle = PAL.stone; g.fillRect(x, y - 0.12, w, 0.14);
  g.fillStyle = 'rgba(40,30,20,0.25)'; g.fillRect(x, y + 0.02, w, 0.05);
}
// a window: its middle at x, its sill at y (y up negative), w×h; kind 'shut' (persiane closed), 'half' (one leaf open,
// the glass dark), 'glass' (dark panes), 'hole' (cut through: the room behind shows). Its stone surround.
function windowAt(g, x, y, w, h, kind, seed = 0) {
  const x0 = x - w / 2, y0 = y - h;
  g.fillStyle = PAL.pale; g.fillRect(x0 - 0.12, y0 - 0.14, w + 0.24, h + 0.22);
  g.fillStyle = 'rgba(40,30,20,0.2)'; g.fillRect(x0 - 0.12, y - 0.02, w + 0.24, 0.1);
  if (kind === 'hole') return;
  g.fillStyle = PAL.dark; g.fillRect(x0, y0, w, h);
  if (kind === 'glass' || kind === 'half') {
    g.fillStyle = '#2b3036'; g.fillRect(x0 + 0.05, y0 + 0.05, w - 0.1, h - 0.1);
    g.fillStyle = '#3a3229'; g.fillRect(x - 0.025, y0, 0.05, h); g.fillRect(x0, y0 + h * 0.4, w, 0.04);
  }
  if (kind === 'shut' || kind === 'half') {
    const col = hash(seed, 7) < 0.5 ? PAL.shutter : PAL.shutter2;
    const leaves = kind === 'shut' ? [[x0, w / 2], [x, w / 2]] : [[x0 - w * 0.48, w / 2]];
    for (const [lx, lw] of leaves) {
      g.fillStyle = col; g.fillRect(lx, y0, lw, h);
      g.strokeStyle = 'rgba(20,20,15,0.35)'; g.lineWidth = 0.02;
      for (let k = y0 + 0.08; k < y; k += 0.07) { g.beginPath(); g.moveTo(lx + 0.04, k); g.lineTo(lx + lw - 0.04, k); g.stroke(); }
      g.strokeStyle = 'rgba(20,20,15,0.5)'; g.lineWidth = 0.03; g.strokeRect(lx, y0, lw, h);
    }
  }
}
// a small iron balcony under a window: slab and railing (painted flat on the front)
function balconyFlat(g, x, y, w) {
  g.fillStyle = PAL.stone; g.fillRect(x - w / 2 - 0.15, y, w + 0.3, 0.14);
  g.strokeStyle = PAL.iron; g.lineWidth = 0.025;
  g.beginPath(); g.moveTo(x - w / 2 - 0.1, y - 0.85); g.lineTo(x + w / 2 + 0.1, y - 0.85); g.stroke();
  for (let k = x - w / 2 - 0.05; k <= x + w / 2 + 0.06; k += 0.11) { g.beginPath(); g.moveTo(k, y); g.lineTo(k, y - 0.85); g.stroke(); }
}
// a door: middle x, w×h from the ground (y 0); kind 'wood', 'boards' (boarded up)
function doorAt(g, x, w, h, col = PAL.door, arch = false) {
  g.fillStyle = PAL.pale; g.fillRect(x - w / 2 - 0.18, -h - 0.25, w + 0.36, h + 0.25);
  g.fillStyle = col;
  if (arch) { g.beginPath(); g.moveTo(x - w / 2, 0); g.lineTo(x - w / 2, -h + w / 2); g.arc(x, -h + w / 2, w / 2, Math.PI, 0); g.lineTo(x + w / 2, 0); g.fill(); }
  else g.fillRect(x - w / 2, -h, w, h);
  g.strokeStyle = 'rgba(15,10,5,0.4)'; g.lineWidth = 0.03;
  g.beginPath(); g.moveTo(x, -h + (arch ? w / 2 : 0)); g.lineTo(x, 0); g.stroke();
  for (const s of [-1, 1]) { g.strokeRect(x + s * w / 4 - w * 0.17, -h * 0.85, w * 0.34, h * 0.3); g.strokeRect(x + s * w / 4 - w * 0.17, -h * 0.45, w * 0.34, h * 0.3); }
}
// boards nailed across an opening (x0…x1, y0…y1)
function boards(g, x0, x1, y0, y1, seed) {
  const n = Math.max(3, Math.round((y1 - y0) / 0.32));
  for (let i = 0; i < n; i++) {
    const y = y0 + (y1 - y0) * (i + 0.5) / n, tilt = (hash(i, seed) - 0.5) * 0.12;
    g.save(); g.translate((x0 + x1) / 2, y); g.rotate(tilt);
    g.fillStyle = i % 2 ? '#7d6a52' : '#8a765b'; g.fillRect(-(x1 - x0) / 2 - 0.12, -0.12, x1 - x0 + 0.24, 0.24);
    g.fillStyle = 'rgba(30,20,10,0.35)'; g.fillRect(-(x1 - x0) / 2 - 0.12, 0.09, x1 - x0 + 0.24, 0.03);
    g.restore();
  }
}
// the plain fronts round the square: a spec each (see FRONTS); paint the stone, its windows and doors; the windows
// that may be lit go to the twin element `<id>_win` (glows): litWindows
function front(g, e, f) {
  plaster(g, 0, -f.h, f.w, f.h, f.base, f.seed);
  if (f.course) for (const y of f.course) course(g, 0, f.w, y);
  cornice(g, 0, f.w, -f.h + 0.35, 0.4);
  for (const w of f.windows ?? []) {
    windowAt(g, w[0], w[1], w[2], w[3], w[4], w[0] * 13 + w[1] + f.seed);
    if (w[5]) balconyFlat(g, w[0], w[1], w[2] + 0.4);
  }
  for (const d of f.doors ?? []) doorAt(g, d[0], d[1], d[2], d[3] ?? PAL.door, d[4]);
  if (f.paint) f.paint(g, e);
  // the windows cut through (a room behind them)
  g.globalCompositeOperation = 'destination-out';
  for (const w of f.windows ?? []) if (w[4] === 'hole') g.fillRect(w[0] - w[2] / 2, w[1] - w[3], w[2], w[3]);
  g.globalCompositeOperation = 'source-over';
  // a wall lamp on its bracket: a pale light (no warmth: that is the cinema's)
  if (f.lamp) {
    const [lx, ly] = f.lamp;
    g.strokeStyle = PAL.iron; g.lineWidth = 0.04; g.beginPath(); g.moveTo(lx, ly - 0.5); g.lineTo(lx, ly - 0.75); g.stroke();
    g.fillStyle = PAL.iron; g.beginPath(); g.moveTo(lx - 0.16, ly - 0.2); g.lineTo(lx + 0.16, ly - 0.2); g.lineTo(lx + 0.09, ly - 0.5); g.lineTo(lx - 0.09, ly - 0.5); g.closePath(); g.fill();
    g.fillStyle = '#efe9d8'; g.fillRect(lx - 0.1, ly - 0.42, 0.2, 0.2);
    e.light(lx, ly - 0.3, 0.22, '#e6e2d4', 0.9, 'lamp');
    e.at(lx, ly - 0.3, 'lamp');
  }
  for (const [name, x, y] of f.points ?? []) e.at(x, y, name);
}
// the lit glass of the windows that may be lit (kind 'half' or 'glass' with lit: true — w[6]) and their light
function litWindows(g, e, f) {
  const lit = (f.windows ?? []).filter(w => w[6]);
  e.layer('lit', {}, l => {
    for (const w of lit) {
      const x0 = w[0] - w[2] / 2, y0 = w[1] - w[3];
      const gr = l.createLinearGradient(0, y0, 0, w[1]);
      gr.addColorStop(0, '#ffd59a'); gr.addColorStop(1, '#f2a85e');
      l.fillStyle = gr; l.fillRect(x0 + 0.05, y0 + 0.05, w[2] - 0.1, w[3] - 0.1);
      l.fillStyle = 'rgba(70,40,20,0.7)'; l.fillRect(w[0] - 0.025, y0, 0.05, w[3]); l.fillRect(x0, y0 + w[3] * 0.4, w[2], 0.04);
      if (w[4] === 'half') { l.fillStyle = 'rgba(90,60,30,0.35)'; l.fillRect(x0 + w[2] * 0.55, y0 + 0.05, w[2] * 0.4, w[3] - 0.1); }
    }
  });
  lit.forEach((w, i) => e.light(w[0], w[1] - w[3] / 2, 1.1, '#ffbf75', 0.75, 'w' + i));
}
// animate of a `<id>_win`: each lit window as the night, the era's past (it lights them one by one as the square
// goes back in time) and the party's warmth say: 0.3 + 0.6·warm at night, never in 1988
function windowsMove(e, n, seed) {
  const S = e.state, base = (0.3 + 0.6 * clamp(S.warm ?? 0.5)) * nightOf(S.hour ?? 0.9), past = clamp(S.past ?? 1);
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const thr = 0.1 + 0.8 * hash(i, seed), k = past > thr ? base : 0;
    e.glow('w' + i, k); sum += k;
  }
  e.layer('lit').alpha = n ? Math.min(1, sum / n / Math.max(0.01, base) * (base > 0 ? 1 : 0)) * Math.min(1, base * 1.4) : 0;
}

// the fronts: [x, sill y, w, h, kind, balcony, lit]
const FRONTS = {
  // Alfredo's house, west side south of the Paradiso (anchor x −12, z 0, facing east; +x north)
  f_alf: { w: 6, h: 8.6, base: PAL.ochre, seed: 11, course: [-3.4],
    windows: [[1.1, -1.0, 0.7, 0.9, 'glass'], [1.5, -4.4, 0.9, 1.6, 'half', false, true], [4.5, -4.4, 0.9, 1.6, 'shut', true], [1.5, -7.2, 0.8, 1.2, 'shut'], [4.5, -7.2, 0.8, 1.2, 'glass', false, true]],
    doors: [[3.0, 1.1, 2.3, '#3f4a3c']], lamp: [1.6, -3.0], points: [['door', 3.0, -1.2]],
    paint: g => { g.fillStyle = PAL.stone; g.fillRect(2.2, -0.2, 1.6, 0.2); } },
  f_w2: { w: 6, h: 9.2, base: PAL.lime, seed: 13, course: [-3.6],
    windows: [[1.4, -1.2, 0.9, 1.4, 'shut'], [4.4, -1.2, 0.9, 1.4, 'shut'], [1.4, -4.6, 0.9, 1.6, 'glass', true, true], [4.4, -4.6, 0.9, 1.6, 'shut'], [1.4, -7.6, 0.8, 1.3, 'half', false, true], [4.4, -7.6, 0.8, 1.3, 'shut']] },
  // north side, west of the white wall: the arch to the mother's lane, her window (cut through: her room behind)
  f_n1: { w: 7, h: 10, base: PAL.honey, seed: 17, course: [-3.8],
    windows: [[3.0, -4.3, 1.0, 1.4, 'hole'], [1.0, -4.3, 0.9, 1.4, 'shut'], [6.0, -4.3, 0.9, 1.4, 'glass', true, true], [1.0, -7.6, 0.8, 1.3, 'glass', false, true], [3.0, -7.6, 0.8, 1.3, 'shut'], [6.0, -7.6, 0.8, 1.3, 'half']],
    paint: (g) => {
      // the arch over the lane (x 5 → world x −7): dark, a lamp-less passage
      g.fillStyle = PAL.pale; g.beginPath(); g.moveTo(3.6, 0); g.lineTo(3.6, -2.4); g.arc(5, -2.4, 1.4, Math.PI, 0); g.lineTo(6.4, 0); g.fill();
      g.fillStyle = '#16130f'; g.beginPath(); g.moveTo(3.85, 0); g.lineTo(3.85, -2.4); g.arc(5, -2.4, 1.15, Math.PI, 0); g.lineTo(6.15, 0); g.fill();
      g.fillStyle = 'rgba(80,70,60,0.35)'; g.fillRect(4.3, -1.6, 1.4, 1.6);
    } },
  f_sw: { w: 7.35, h: 8.4, base: PAL.lime, seed: 19, course: [-3.3],
    windows: [[1.5, -1.1, 0.9, 1.3, 'shut'], [5.5, -1.1, 0.9, 1.3, 'glass'], [1.5, -4.3, 0.9, 1.5, 'half', false, true], [3.5, -4.3, 0.9, 1.5, 'shut', true], [5.5, -4.3, 0.9, 1.5, 'glass', false, true], [2.5, -7.0, 0.8, 1.2, 'shut'], [5.0, -7.0, 0.8, 1.2, 'glass']],
    doors: [[3.5, 1.2, 2.4]] },
  f_se: { w: 7.35, h: 9, base: PAL.ochre, seed: 23, course: [-3.5],
    windows: [[1.5, -4.4, 0.9, 1.5, 'glass', true, true], [3.5, -4.4, 0.9, 1.5, 'shut'], [5.5, -4.4, 0.9, 1.5, 'half', false, true], [1.5, -7.4, 0.8, 1.2, 'shut'], [3.5, -7.4, 0.8, 1.2, 'glass'], [5.5, -7.4, 0.8, 1.2, 'shut']],
    doors: [[1.6, 1.2, 2.5], [5.2, 1.6, 2.6, '#3a3027']] },
  f_e1: { w: 8, h: 9.4, base: PAL.honey, seed: 29, course: [-3.6],
    windows: [[1.2, -1.2, 0.9, 1.4, 'shut'], [6.8, -1.2, 0.9, 1.4, 'glass'], [1.2, -4.6, 0.9, 1.6, 'half', true, true], [4.0, -4.6, 0.9, 1.6, 'shut'], [6.8, -4.6, 0.9, 1.6, 'glass', false, true], [2.6, -7.7, 0.8, 1.3, 'glass', false, true], [5.4, -7.7, 0.8, 1.3, 'shut']],
    doors: [[4.0, 1.3, 2.5]], lamp: [6.0, -3.2] },
  f_e3: { w: 4, h: 10.4, base: PAL.lime, seed: 31, course: [-3.8],
    windows: [[2.0, -1.2, 0.9, 1.4, 'shut'], [2.0, -4.6, 0.9, 1.6, 'glass', true, true], [2.0, -8.0, 0.8, 1.3, 'shut']] },
  // the lane to the sea: its two sides (+x north)
  f_lane_w: { w: 22, h: 8, base: PAL.ochre, seed: 37, course: [-3.2],
    windows: [[1.5, -4.2, 0.8, 1.4, 'glass', false, true], [4.5, -4.2, 0.8, 1.4, 'shut'], [8, -4.2, 0.8, 1.4, 'half', true, true], [12, -4.2, 0.8, 1.4, 'shut'], [16, -4.2, 0.8, 1.4, 'glass'], [20, -4.2, 0.8, 1.4, 'shut'], [3, -1.2, 0.8, 1.2, 'shut'], [10, -1.2, 0.8, 1.2, 'glass']],
    doors: [[6, 1.1, 2.3], [14, 1.1, 2.3]], lamp: [3.5, -3.4] },
  f_lane_e: { w: 22, h: 8.6, base: PAL.honey, seed: 41, course: [-3.4],
    windows: [[2, -4.4, 0.8, 1.4, 'shut'], [6, -4.4, 0.8, 1.4, 'glass', false, true], [10, -4.4, 0.8, 1.4, 'shut', true], [14, -4.4, 0.8, 1.4, 'half', false, true], [18, -4.4, 0.8, 1.4, 'shut'], [21, -4.4, 0.8, 1.4, 'glass'], [8, -1.2, 0.8, 1.2, 'shut']],
    doors: [[4, 1.1, 2.3], [16, 1.1, 2.3]] },
  // the street south to the bus: west side (+x north, from z −34), east side (+x south, from z 0)
  f_st_w: { w: 34, h: 7.6, base: PAL.lime, seed: 43, course: [-3.2],
    windows: [[2, -4.2, 0.8, 1.4, 'shut'], [5, -4.2, 0.8, 1.4, 'glass'], [9, -4.2, 0.8, 1.4, 'half', false, true], [13, -4.2, 0.8, 1.4, 'shut', true], [17, -4.2, 0.8, 1.4, 'shut'], [21, -4.2, 0.8, 1.4, 'glass', false, true], [25, -4.2, 0.8, 1.4, 'shut'], [29, -4.2, 0.8, 1.4, 'half'], [32, -4.2, 0.8, 1.4, 'glass', false, true], [4, -1.2, 0.8, 1.2, 'shut'], [19, -1.2, 0.8, 1.2, 'shut'], [30, -1.2, 0.8, 1.2, 'glass']],
    doors: [[7, 1.1, 2.3], [15, 1.1, 2.3, '#3f4a3c'], [23, 1.2, 2.4], [27, 1.1, 2.3]], lamp: [11, -3.2] },
  f_st_e: { w: 34, h: 8, base: PAL.honey, seed: 47, course: [-3.3],
    windows: [[2, -4.3, 0.8, 1.4, 'glass', false, true], [6, -4.3, 0.8, 1.4, 'shut', true], [10, -4.3, 0.8, 1.4, 'shut'], [14, -4.3, 0.8, 1.4, 'half', false, true], [18, -4.3, 0.8, 1.4, 'glass'], [22, -4.3, 0.8, 1.4, 'shut'], [26, -4.3, 0.8, 1.4, 'glass', false, true], [30, -4.3, 0.8, 1.4, 'shut'], [12, -1.2, 0.8, 1.2, 'glass'], [28, -1.2, 0.8, 1.2, 'shut']],
    doors: [[4, 1.1, 2.3], [8, 1.2, 2.4, '#3a3027'], [20, 1.1, 2.3], [24, 1.1, 2.3]] },
  // the low house closing the street at the bus stop (facing north; +x west)
  f_st_end: { w: 12, h: 6.5, base: PAL.ochre, seed: 53, course: [-3],
    windows: [[3, -3.8, 0.8, 1.3, 'glass', false, true], [6, -3.8, 0.8, 1.3, 'shut'], [9, -3.8, 0.8, 1.3, 'half', false, true]],
    doors: [[6, 1.2, 2.3]],
    paint: g => {   // the bus stop's sign on its pole before it
      g.fillStyle = PAL.iron; g.fillRect(1.4, -2.6, 0.06, 2.6);
      g.fillStyle = '#c8b468'; g.beginPath(); g.arc(1.43, -2.75, 0.22, 0, TAU); g.fill();
      g.fillStyle = PAL.dark; g.font = '0.16px serif'; g.textAlign = 'center'; g.fillText('BUS', 1.43, -2.7);
    } },
};

// ── the Paradiso (anchor x −12, z 6; facing east; +x north; 14 m long, 10 high) ────────────────────────────────
// paradiso_state: old · burnt · new · shut · charged; poster, full_sign; past (shut → old: layers); collapse (charged)
const PAR = { w: 14, h: 10, door: 6, doorW: 2.8, doorH: 3.1, booth: 10, boothY: 6, boothW: 1.25, boothH: 0.95, poster: 8.6 };
function paradisoBase(g, s) {
  const { w, h } = PAR, burnt = s === 'burnt', fresh = s === 'new', old = s === 'shut' || s === 'charged';
  plaster(g, 0, -h, w, h, fresh ? '#e4cfa2' : old ? '#bfa883' : PAL.honey, 59, 1.2);
  // pilasters and the pediment line: a modest cinema of the thirties
  for (const x of [0.3, 3.6, 10.4, 13.7]) { g.fillStyle = 'rgba(255,240,215,0.25)'; g.fillRect(x - 0.3, -h + 0.4, 0.6, h - 0.4); g.fillStyle = 'rgba(70,50,30,0.15)'; g.fillRect(x + 0.24, -h + 0.4, 0.06, h - 0.4); }
  cornice(g, 0, w, -h + 0.5, 0.5);
  g.fillStyle = PAL.stone; g.beginPath(); g.moveTo(3.4, -h + 0.5); g.lineTo(7, -h - 0.6); g.lineTo(10.6, -h + 0.5); g.closePath(); g.fill();
  course(g, 0, w, -3.7);
  // the name on the frieze: CINEMA PARADISO (old, shut, charged — faded), NUOVO CINEMA PARADISO (new)
  g.textAlign = 'center'; g.font = 'bold 0.62px serif';
  g.fillStyle = burnt ? 'rgba(40,30,25,0.6)' : old ? 'rgba(90,70,50,0.55)' : '#6d3b22';
  g.fillText(fresh ? 'NUOVO CINEMA PARADISO' : 'CINEMA PARADISO', w / 2, -8.2);
  // the upper windows (shut) and the booth's window cut through (its room behind: booth_in)
  for (const x of [2.0, 12.0]) windowAt(g, x, -5.2, 0.9, 1.6, 'shut', x);
  g.fillStyle = PAL.pale; g.fillRect(PAR.booth - PAR.boothW / 2 - 0.14, -PAR.boothY - PAR.boothH / 2 - 0.14, PAR.boothW + 0.28, PAR.boothH + 0.28);
  g.globalCompositeOperation = 'destination-out';
  g.fillRect(PAR.booth - PAR.boothW / 2, -PAR.boothY - PAR.boothH / 2, PAR.boothW, PAR.boothH);
  g.globalCompositeOperation = 'source-over';
  // the doors: two leaves (glass and wood), the steps
  g.fillStyle = PAL.pale; g.fillRect(PAR.door - PAR.doorW / 2 - 0.25, -PAR.doorH - 0.3, PAR.doorW + 0.5, PAR.doorH + 0.3);
  g.fillStyle = burnt ? '#1a1410' : '#4a2e20'; g.fillRect(PAR.door - PAR.doorW / 2, -PAR.doorH, PAR.doorW, PAR.doorH);
  if (!burnt) {
    g.fillStyle = '#2a2420'; for (const sx of [-0.7, 0.7]) g.fillRect(PAR.door + sx - 0.45, -2.6, 0.9, 1.4);
    g.fillStyle = '#7a5a3a'; g.fillRect(PAR.door - 0.03, -PAR.doorH, 0.06, PAR.doorH);
  }
  // the side doors (exits) and the poster frames on either side of the doors
  for (const x of [1.6, 12.4]) doorAt(g, x, 1.2, 2.5, burnt ? '#1a1410' : '#4a3a2a');
  for (const x of [3.9, PAR.poster]) { g.fillStyle = '#3a2c20'; g.fillRect(x - 0.62, -2.9, 1.24, 1.9); }
  // the wall lamp between the posters and the doors (lit in every year: the street's)
  g.fillStyle = PAL.iron; g.fillRect(4.75, -3.55, 0.05, 0.3);
  g.beginPath(); g.moveTo(4.62, -3.2); g.lineTo(4.93, -3.2); g.lineTo(4.86, -3.5); g.lineTo(4.69, -3.5); g.closePath(); g.fill();
  g.fillStyle = '#efe9d8'; g.fillRect(4.7, -3.45, 0.15, 0.2);
  // soot over the booth's window and the doors (burnt)
  if (burnt) {
    for (const [cx, cy, r] of [[PAR.booth, -PAR.boothY - 1.2, 1.6], [PAR.door, -PAR.doorH - 0.8, 1.4]]) {
      const sg = g.createRadialGradient(cx, cy, 0, cx, cy, r * 1.6);
      sg.addColorStop(0, 'rgba(10,8,6,0.85)'); sg.addColorStop(1, 'rgba(10,8,6,0)');
      g.fillStyle = sg; g.beginPath(); g.ellipse(cx, cy - r * 0.4, r, r * 1.6, 0, 0, TAU); g.fill();
    }
  }
}
// what is in the poster frames
function posters(g, s, poster, full) {
  const frame = (x, draw) => { g.save(); g.beginPath(); g.rect(x - 0.55, -2.83, 1.1, 1.76); g.clip(); draw(x); g.restore(); };
  if (s === 'burnt') return;
  if (s === 'shut' || s === 'charged') {
    // torn paper, and the notice on the doors (girl): «Demolition on Saturday»
    frame(3.9, x => { g.fillStyle = '#b8ad96'; g.fillRect(x - 0.55, -2.83, 1.1, 1.76); g.fillStyle = 'rgba(70,60,50,0.4)'; g.fillRect(x - 0.3, -2.2, 0.8, 0.9); });
    frame(PAR.poster, x => { g.fillStyle = '#a99d86'; g.fillRect(x - 0.55, -2.83, 1.1, 1.76); g.fillStyle = 'rgba(120,40,30,0.25)'; g.fillRect(x - 0.5, -2.0, 0.6, 0.7); });
    return;
  }
  // «Gone with the Wind» (poster 1): two in an embrace, a fire behind; else the comedy's bill
  frame(PAR.poster, x => {
    if (poster) {
      const gr = g.createLinearGradient(0, -2.83, 0, -1.07); gr.addColorStop(0, '#3b2a2a'); gr.addColorStop(0.55, '#a2502c'); gr.addColorStop(1, '#2a1c18');
      g.fillStyle = gr; g.fillRect(x - 0.55, -2.83, 1.1, 1.76);
      g.fillStyle = '#d9874a'; for (let i = 0; i < 9; i++) { g.beginPath(); g.moveTo(x - 0.5 + i * 0.12, -1.5); g.lineTo(x - 0.44 + i * 0.12, -2.0 - hash(i, 3) * 0.4); g.lineTo(x - 0.38 + i * 0.12, -1.5); g.fill(); }
      g.fillStyle = '#17110e'; g.beginPath(); g.ellipse(x - 0.06, -1.62, 0.17, 0.42, 0.15, 0, TAU); g.fill(); g.beginPath(); g.ellipse(x + 0.12, -1.6, 0.15, 0.4, -0.2, 0, TAU); g.fill();
      g.beginPath(); g.arc(x - 0.02, -2.1, 0.08, 0, TAU); g.fill(); g.beginPath(); g.arc(x + 0.1, -2.05, 0.07, 0, TAU); g.fill();
      g.fillStyle = '#e8d6b0'; g.font = 'bold 0.1px serif'; g.textAlign = 'center'; g.fillText('VIA COL VENTO', x, -2.66);
    } else {
      g.fillStyle = '#d8cfb6'; g.fillRect(x - 0.55, -2.83, 1.1, 1.76);
      g.fillStyle = '#2a2420'; g.beginPath(); g.ellipse(x - 0.18, -1.7, 0.16, 0.3, 0, 0, TAU); g.fill(); g.fillRect(x + 0.12, -2.3, 0.06, 0.9);
      g.font = 'bold 0.11px serif'; g.textAlign = 'center'; g.fillText('I POMPIERI', x, -2.6); g.fillText('DI VIGGIÙ', x, -2.47);
    }
  });
  frame(3.9, x => {
    g.fillStyle = '#cdbf9c'; g.fillRect(x - 0.55, -2.83, 1.1, 1.76);
    g.fillStyle = '#3a2a22'; g.beginPath(); g.ellipse(x, -1.9, 0.22, 0.42, 0, 0, TAU); g.fill();
    g.font = 'bold 0.1px serif'; g.textAlign = 'center'; g.fillText('PROSSIMAMENTE', x, -2.63);
  });
  if (full) {   // «No seats»: a board hung on the door
    g.fillStyle = '#e9dfc6'; g.fillRect(PAR.door - 0.75, -2.35, 1.5, 0.5);
    g.strokeStyle = '#5a2a1a'; g.lineWidth = 0.03; g.strokeRect(PAR.door - 0.72, -2.32, 1.44, 0.44);
    g.fillStyle = '#7a2a1a'; g.font = 'bold 0.22px serif'; g.textAlign = 'center'; g.fillText(tr('NO SEATS'), PAR.door, -2.02);
  }
}
// the boarded front (shut, charged): boards over the doors and the windows, the notice; a layer (rewind lets it fall)
function paradisoBoards(g, charged) {
  boards(g, PAR.door - PAR.doorW / 2 - 0.1, PAR.door + PAR.doorW / 2 + 0.1, -PAR.doorH, 0, 3);
  for (const x of [1.6, 12.4]) boards(g, x - 0.65, x + 0.65, -2.5, 0, x);
  boards(g, PAR.booth - 0.7, PAR.booth + 0.7, -PAR.boothY - 0.5, -PAR.boothY + 0.5, 9);
  g.fillStyle = '#efe8d4'; g.fillRect(PAR.door - 0.55, -2.0, 1.1, 0.62);
  g.fillStyle = '#2a2420'; g.font = 'bold 0.13px serif'; g.textAlign = 'center';
  g.fillText(tr('DEMOLITION'), PAR.door, -1.72); g.fillText(tr('ON SATURDAY'), PAR.door, -1.52);
  if (charged) {   // the charges: red bundles at the pilasters' feet, the wires
    g.strokeStyle = '#6a1a12'; g.lineWidth = 0.025;
    g.beginPath(); g.moveTo(0.3, -0.6); g.lineTo(13.7, -0.6); g.stroke();
    for (const x of [0.3, 3.6, 10.4, 13.7]) { g.fillStyle = '#8a2a1a'; g.fillRect(x - 0.18, -1.0, 0.36, 0.5); g.fillStyle = '#2a1a12'; g.fillRect(x - 0.18, -0.82, 0.36, 0.05); }
  }
}

// ── the people ───────────────────────────────────────────────────────────────────────────────────────────────────
const IDS = ['toto', 'alfredo', 'maria', 'elena', 'daughter', 'madman', 'anna', 'bearer1', 'bearer2',
  'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10'];
const WEARS = { toto: 'toto_boy', alfredo: 'alfredo', maria: 'maria', madman: 'madman' };
const SIT = { motion: 'seated', loop: true };
const loop = motion => ({ motion, loop: true });
// who is in a beat and how they stand — every person's keys (those not named: not here)
function cast(who) {
  const o = {}, chars = kit.cast.characters;
  for (const id of IDS) {
    const p = who[id];
    o[id + '_here'] = !!p;
    if (!p) continue;
    o[id + '_a'] = p.at[0]; o[id + '_d'] = p.at[1];
    o[id + '_turn'] = p.turn ?? 180;
    o[id + '_do'] = p.do ?? 'stand';
    o[id + '_look'] = p.look ?? null;
    o[id + '_reach'] = p.reach ?? null;
    o[id + '_with'] = p.with ?? null;
    o[id + '_on'] = p.on ?? null;
    o[id + '_gait'] = p.gait ?? null;
    o[id + '_mood'] = p.mood ?? 'neutral';
    if (WEARS[id]) o[id + '_wear'] = chars[p.wear ?? WEARS[id]];
  }
  return o;
}

// ── the camera's shots (x, z — metres; yaw — degrees right of north; h — metres over the eye's 1.7; pitch up +) ───
const cam = (x, z, yaw, h = 0, pitch = 0) => ({ camera_target: null, camera_shot: null, camera_x: x, camera_z: z, camera_yaw: yaw, camera_h: h, camera_pitch: pitch, camera_roll: 0, camera_look: 0 });
// a camera at (x, z) turned to look at [x, z] at a height (the eye's 1.7 +h): a medium or close shot placed by hand
const aim = (x, z, at, head = 1.6, pitch = 0) => cam(x, z, Math.atan2(at[0] - x, at[1] - z) * 180 / Math.PI, head - 1.7, pitch);
// a camera on someone's face: `dist` metres from them, `side` degrees off the way they face (+ their right), at their
// head's height — the face 3/4 to the lens
function faceCam(at, facing, dist, side, head = 1.6, pitch = 0) {
  const h = (facing + side) * Math.PI / 180;
  return aim(at[0] + Math.sin(h) * dist, at[1] + Math.cos(h) * dist, at, head, pitch);
}
const CAM = {
  WIDE: cam(0, -4, -8, 0.3, 2),
  CROWD: cam(-6, 7, -45, 0.1, 3),
  PORCH: cam(-7.5, 9.5, -45, -0.15, 0),
  FOUNTAIN: cam(-2.2, 9.3, 31, -0.25, -1),
  WALL: cam(-4, 3, -10, -0.2, 6),
  DOOR: cam(-8.5, 1.5, -65, -0.25, -1),
  STEPS: cam(5.5, 25.8, 180, 0.9, -6),
  BALCONY: cam(10, 19.6, 165, -0.1, 12),
  EVE: cam(-1, -8, 3.6, 0.4, 3),
  GIRL: cam(-11, 8, 46, 0, 1),
  CHALK: cam(10, 14.2, 55, -0.4, -4),
  FUNERAL: cam(-5, 18, -150, 0.2, 1),
  RUIN: cam(6, 8, -85, 0.2, 8),
};
// a cut to a shot made ready first (shown whole)
async function cutTo(s, keys) { const sh = s.shot(keys); await s.until(() => sh.ready); sh.cut(); }
// someone brought into a beat that follows another (its from is not applied then): their keys set where the beat
// wants them, before they are made to be here — else they appear where the scene last left them (or never placed)
function bring(s, id, spec) {
  for (const [k, v] of Object.entries(cast({ [id]: spec }))) if (k.startsWith(id + '_') && k !== id + '_here') s.set(k, v);
  s.set(id + '_here', true);
}
// a camera glided to a shot over `over` seconds
function glide(s, keys, over = 2.5) {
  for (const k of ['camera_x', 'camera_z', 'camera_h', 'camera_pitch']) s.move(k, keys[k], { over, ease: 'inOut' });
  s.turn('camera_yaw', keys.camera_yaw, over, 'inOut');
}

// ── the beats ────────────────────────────────────────────────────────────────────────────────────────────────────
// the keys every beat starts from (all that is not a party's key; the party's — warm, place, with_mother — the game's)
const REST = { past: 1, paradiso_state: 'old', poster: 0, full_sign: 0, mother_light: 0, beam_on: 0, beam_aim: 0, beam_focus: 0,
  wall_film: 'none', wall_lit: 0, wall_burn: 0, smoke: 0, fireworks: 0, chalk: 0, mark_chalk: 0, night_kind: 'clear',
  elena_window: 0, viewfinder: 0, pan: 0, elena_x: 1, madman_x: -1, rec: 0, cart: 0, collapse: 0, dust: 0,
  beam_sky: 0, booth_flash: 0, booth_fig: 0, crowd_k: 0, crowd_sit: 0, chair_on: 0, bulbs: 1, flash: 0, rain: 0, wind_k: 0, cold_k: 0,
  garland: 0, fade: 0, fw: 0, dust_burst: 0, follow: 0, sal_rail: 0, crowd_x: 0, crowd_z: -60, crowd_f: 180, ...cartKeys(0) };
function cartKeys(u) { const c = cartAt(u); return { hearse_a: c[0], hearse_d: c[1], hearse_f: c[2] }; }
// where the painted crowd stands: [x, z, facing]; it is seen whole or not at all (crowd_k 0 / 1)
const crowdAt = (x, z, f, k = 1, sit = 0) => ({ crowd_x: x, crowd_z: z, crowd_f: f, crowd_k: k, crowd_sit: sit });
const PAST_NIGHT = () => ({ ...REST, ...LIGHT('past', 0.9) });
const PAST_DUSK = () => ({ ...REST, ...LIGHT('past', 0.8) });
const NOW = (hour, state = 'shut') => ({ ...REST, ...LIGHT('now', hour), past: 0, paradiso_state: state, ...crowdAt(0, -60, 180, 0) });
// people's places for the beats (faces 3/4 to the shots that see them)
const P = {
  // after the show, by the Paradiso's doors: the boy nearest (he faces the lens, looks up at his mother), the mother
  // on the left facing him and the lens, Alfredo on the right coming out of the doors
  TOTO_P: [-9.3, 11.37], MARIA_P: [-10.29, 10.95], ALF_P: [-9.09, 12.43], COINS: [-9.42, 12.02, 0.92],
  // the paper: the two of them stop by the poster
  MARIA_PAPER: [-10.5, 12.6], TOTO_PAPER: [-10.9, 13.3],
  // the fountain: Alfredo on the rim, the boy beside; Elena and Toto at seventeen
  ALF_RIM: [-1.22, 12.32], BOY_RIM: [-2.0, 11.6], ELENA_F: [-0.27, 11.64], TOTO_F: [-1.19, 11.85],
  // by Alfredo's door (DOOR shot)
  BOY_DOOR: [-11.62, 2.0],
  // the steps: Toto on the lowest
  TOTO_STEPS: [5.5, 23.35], ELENA_SEEN: [0.6, 14.7],
  // midnight: the two of them by the bank's wall (her face over his shoulder, to the lens)
  TOTO_HUG: [11.25, 15.32], ELENA_HUG: [10.75, 14.8],
  // 1988 by the boarded door (GIRL shot)
  SAL_GIRL: [-8.23, 11.55], SAL_DOOR: [-11.3, 12.5], DAUGHTER_STOP: [10.5, 25.6],
  SAL_FUNERAL: [-11.25, 12.9], ANNA_LATE: [-10.2, 12.2], ANNA_W: [-8.2, 17.0], SAL_W: [-7.4, 17.6],
};
const F_MARIA = 92, F_ALF = 175, F_TOTO = 175; // where the porch's three face
const film = {};
const B = (name, b) => { film[name] = b; };

// The prologue: the square of 1988 at dusk, the mother's window; the booth's window flares and the square goes back
const MARIA_PHONE = { at: [-9, 26.45], turn: 180, wear: 'maria_old', do: 'stand', reach: { r: 'maria#head' }, with: ['phone'], mood: 'sad' };
const REWIND_END = cam(-3.2, 2.5, -24, 0.4, 5);
B('now_open', {
  from: () => ({ ...NOW(0.78), fade: 1, ...cast({ maria: MARIA_PHONE }), maria_here: false, ...CAM.WIDE }),
  run: async s => {
    await s.move('fade', 0, { over: 2, ease: 'out' });
    await s.wait(4);
    s.set('maria_here', true);
    s.move('mother_light', 1, { over: 0.6 });
    s.tell('now_open:window');
    await s.wait(4);
  },
});
B('rewind', {
  after: ['now_open'],
  from: () => ({ ...NOW(0.78), mother_light: 1, ...cast({ maria: MARIA_PHONE }), ...CAM.WIDE }),
  run: async s => {
    const flash = s.shot({ ...REWIND_END, ...LIGHT('past', 0.9), paradiso_state: 'old', past: 1, booth_flash: 0, beam_on: 0, beam_sky: 0, mother_light: 0,
      crowd_x: -1.5, crowd_z: 15, crowd_f: 180, crowd_k: 1, crowd_sit: 0, flash: 1,
      ...cast({ c1: { at: [-6.5, 9.5], turn: 300 }, c2: { at: [-5.6, 10.6], turn: 250 }, c3: { at: [-2.2, 16.5], turn: 210, look: 'c4' },
        c4: { at: [-1.4, 15.6], turn: 30, look: 'c3' }, c5: { at: [1.8, 9.0], turn: 160 }, c6: { at: [4.6, 18.2], turn: 240 },
        c7: { at: [3.6, 12.0], turn: 120 }, c8: { at: [-8.2, 19.0], turn: 120 }, c9: { at: [-4.2, 7.4], turn: 300 } }) });
    await s.move('booth_flash', 1, { over: 0.35, ease: 'out' });
    s.tell('rewind:beam');
    s.set('beam_sky', 1);
    s.move('beam_on', 1, { over: 1.2 });
    s.move('booth_flash', 0.6, { over: 1 });
    // the camera goes slowly toward the Paradiso as it comes back
    glide(s, REWIND_END, 10);
    s.set('crowd_x', -1.5); s.set('crowd_z', 15); s.set('crowd_f', 180); s.set('crowd_sit', 0);
    s.move('crowd_k', 1, { over: 9, ease: 'in' });
    s.move('now_k', 0, { over: 9, ease: 'inOut' });
    s.move('dusk_k', 0, { over: 9, ease: 'inOut' });
    s.move('mother_light', 0, { over: 6 });
    await s.move('past', 1, { over: 9, ease: 'inOut' });
    // the flash: the night of the past, the people of the square there at once
    s.set('flash', 1);
    flash.cut();
    s.move('flash', 0, { over: 1.2, ease: 'out' });
    await s.wait(1.5);
    s.tell('rewind:past');
    await s.wait(0.6);
  },
});

// I.3 Milk: out of the cinema, the mother, the coins
const PORCH2 = aim(-7.95, 9.85, [-9.8, 11.15], 1.42);        // mother and boy, medium
const PORCH3 = aim(-7.3, 9.45, [-9.55, 11.6], 1.45);         // the three, medium: the choice
const COINS_CLOSE = aim(-7.75, 11.09, [-9.3, 12.2], 1.3, -4);    // his palm and his face     // Alfredo's palm with the coins
const BOY = (more = {}) => ({ at: P.TOTO_P, turn: F_TOTO, look: 'maria', mood: 'afraid', reach: { r: 'maria#hand_l' }, ...more });
const MUM = (more = {}) => ({ at: P.MARIA_P, turn: F_MARIA, look: 'toto', mood: 'angry', reach: { l: 'toto#hand_r' }, ...more });
B('after_show', {
  from: () => ({ ...PAST_NIGHT(), ...cast({
    toto: { at: [-11.2, 12.2], turn: 100 }, maria: { at: [-6.2, 5.2], turn: 330, mood: 'angry' },
    c1: { at: [-11.4, 11.6], turn: 110 }, c2: { at: [-11.3, 12.8], turn: 80 }, c3: { at: [-10.6, 13.6], turn: 60 },
    c4: { at: [-10.9, 10.9], turn: 130 }, c6: { at: [-10.4, 12.9], turn: 90 }, c7: { at: [-11.0, 14.0], turn: 70 },
    alfredo: { at: [-11.3, 12.1], turn: 90, mood: 'smile' } }), alfredo_here: false, ...CAM.CROWD }),
  run: async s => {
    const toto = s.person('toto'), maria = s.person('maria');
    const out = [['c1', [[-8, 8.4], [-3, 3.5]]], ['c2', [[-8.2, 14.2], [-2.5, 20]]], ['c3', [[-7.6, 16.4], [-4.2, 22.8]]],
      ['c4', [[-8.8, 9.0], [-6.5, 2.5]]], ['c6', [[-7.4, 13.4], [1.5, 14.5]]], ['c7', [[-8.4, 17.2], [-6.8, 24.5]]]];
    out.forEach(([id, path], i) => (async () => { await s.wait(0.2 + i * 0.45 + s.random() * 0.3); await s.person(id).walk(path); s.person(id).here(false); })());
    await s.wait(0.8);
    const boy = toto.walk([[-10.2, 11.9], P.TOTO_P]);
    await s.wait(0.6);
    const mum = maria.walk([[-8.6, 8.9], P.MARIA_P]);
    maria.look('toto');
    await boy;
    await toto.turn(F_TOTO);
    toto.look('maria'); toto.mood('afraid');
    await mum;
    await maria.turn(F_MARIA);
    glide(s, PORCH2, 2.2);
    maria.reach({ l: 'toto#hand_r' }); toto.reach({ r: 'maria#hand_l' });
    await s.wait(2.4);
    s.tell('after_show:caught');
    await s.wait(0.6);
  },
});
B('alfredo_down', {
  after: ['after_show'],
  from: () => ({ ...PAST_NIGHT(), ...cast({ toto: BOY(), maria: MUM(), alfredo: { at: [-11.3, 12.1], turn: 90, mood: 'smile' } }), alfredo_here: false, ...PORCH2 }),
  run: async s => {
    const alf = s.person('alfredo'), toto = s.person('toto'), maria = s.person('maria');
    bring(s, 'alfredo', { at: [-11.3, 12.1], turn: 90, mood: 'smile' });
    glide(s, PORCH3, 4);
    alf.reach({ r: 'alfredo#pocket' });
    const walk = alf.walk([[-10.4, 12.6], P.ALF_P]);
    await s.wait(1.4);
    alf.with(['coins']); alf.reach(null);
    await walk;
    await alf.turn(F_ALF);
    alf.look('maria'); maria.look('alfredo'); toto.look('alfredo');
    alf.reach({ r: P.COINS });
    alf.do('give_coins');
    s.tell('alfredo_down:coins');
    // close: his palm, the coins on it — they are his
    await cutTo(s, COINS_CLOSE);
    await s.wait(2.4);
    await cutTo(s, PORCH3);
    maria.look('toto'); toto.look('maria');
    await s.wait(1.2);
  },
});
const PORCH_THREE = (alfMood = 'smile') => ({ toto: BOY({ look: 'alfredo' }), maria: MUM({ look: 'alfredo' }),
  alfredo: { at: P.ALF_P, turn: F_ALF, look: 'maria', mood: alfMood, with: ['coins'], do: 'give_coins', reach: { r: P.COINS } } });
B('coins_taken', {
  after: ['alfredo_down'],
  from: () => ({ ...PAST_NIGHT(), ...cast(PORCH_THREE()), ...PORCH3 }),
  run: async s => {
    const alf = s.person('alfredo'), toto = s.person('toto'), maria = s.person('maria');
    maria.reach({ r: 'alfredo#hand_r', l: 'toto#hand_r' }); maria.mood('neutral');
    await s.wait(1.5);
    s.tell('coins_taken:take');
    alf.with(null); alf.do('stand'); alf.reach(null); maria.reach({ l: 'toto#hand_r' });
    await s.wait(1.4);
    const away = [[-9.0, 15.0], [-7.4, 22.5], [-7.0, 26.4]];
    const m = maria.walk(away);
    await s.wait(0.25);
    const t = toto.walk(away.map(p => [p[0] + 0.45, p[1] - 0.3]));
    toto.look('alfredo');
    // Alfredo watches them go, raises his hand: his face
    await alf.turn(20);
    glide(s, faceCam(P.ALF_P, 20, 2.0, -35, 1.55), 2.4);
    alf.look('toto'); alf.do('wave'); alf.mood('smile');
    await s.wait(2.6);
    toto.look(null);
    await s.any(m, s.wait(3));
    s.tell('coins_taken:gone');
    await s.wait(0.5);
  },
});
B('slap', {
  after: ['alfredo_down'],
  from: () => ({ ...PAST_NIGHT(), ...cast(PORCH_THREE('neutral')), ...PORCH3 }),
  run: async s => {
    const alf = s.person('alfredo'), toto = s.person('toto'), maria = s.person('maria');
    await cutTo(s, faceCam(P.MARIA_P, F_MARIA, 1.4, 20, 1.55));
    const wide = s.shot(CAM.WIDE);
    maria.look('toto'); maria.mood('angry'); maria.reach({ r: [P.TOTO_P[0] - 0.05, P.TOTO_P[1] + 0.1, 1.7], l: 'toto#hand_r' });
    await s.wait(1.5);
    await s.until(() => wide.ready);
    wide.cut();
    s.tell('slap:cut');
    maria.reach({ l: 'toto#hand_r' }); toto.reach({ r: 'maria#hand_l' }); toto.mood('sad');
    alf.with(null); alf.do('stand'); alf.reach({ r: 'alfredo#pocket' });
    const away = [[-6.8, 15.2], [-7.0, 22.5], [-7.0, 26.4]];
    const m = maria.walk(away);
    await s.wait(0.2);
    toto.walk(away.map(p => [p[0] + 0.45, p[1] - 0.25]));
    await s.wait(1.6); alf.reach(null); alf.look('toto');
    await s.any(m, s.wait(4.5));
    await s.wait(0.4);
  },
});
// I.5 The Paper: dusk; the mother in black with the paper, the boy by her; the poster
const PAPER = aim(-8.2, 11.9, [-10.7, 12.95], 1.45, -2);
B('paper', {
  from: () => ({ ...PAST_DUSK(), poster: 1, ...cast({
    maria: { at: [-7.0, 25.6], turn: 180, mood: 'sad', with: ['paper_sheet'] },
    toto: { at: [-6.55, 25.35], turn: 180 } }), ...CAM.CROWD }),
  run: async s => {
    const maria = s.person('maria'), toto = s.person('toto');
    const m = maria.walk([[-7.4, 20], [-9.6, 15.2], P.MARIA_PAPER]);
    await s.wait(0.15);
    const t = toto.walk([[-6.95, 19.8], [-9.6, 16.0], P.TOTO_PAPER]);
    await s.wait(3.5);
    glide(s, PAPER, 6);
    await s.all(m, t);
    maria.do('sad_stand', { loop: true });
    maria.turn(115); maria.look([-8.4, 11.6, 1.0]); maria.reach({ r: [-10.25, 12.35, 1.2] });
    await toto.turn(320);
    toto.look('paradiso#poster');
    await s.wait(4);
    await toto.turn(150);
    toto.look('maria'); toto.mood('thinking');
    await s.wait(1.2);
    toto.reach({ l: 'maria#hand_l' });
    await s.wait(1.6);
    s.tell('paper:hand');
    await s.wait(3);
  },
});

// II.2 The Crowd, the beam on the wall, the fire
B('crowd', {
  from: () => ({ ...PAST_NIGHT(), full_sign: 1, ...crowdAt(-9.4, 13.4, 135, 1), ...cast({
    c1: { at: [-9.4, 10.6], turn: 250, do: loop('wave'), look: 'paradiso#booth_window', mood: 'angry' }, c2: { at: [-8.6, 11.5], turn: 250, look: 'paradiso#door', mood: 'angry' },
    c3: { at: [-9.9, 12.3], turn: 240, do: loop('wave'), mood: 'laugh' }, c5: { at: [-8.2, 12.6], turn: 230, look: 'paradiso#door' },
    c6: { at: [-7.9, 10.1], turn: 260, look: 'paradiso#booth_window', mood: 'angry' }, c7: { at: [-9.0, 13.6], turn: 230, do: loop('wave') },
    c8: { at: [-7.4, 13.4], turn: 225 }, madman: { at: [3.5, 9.5], turn: 250, wear: 'madman', gait: 'arms_wide_run', mood: 'laugh' } }), ...CAM.CROWD }),
  run: async s => {
    const mad = s.person('madman');
    const run = mad.walk([[-2.5, 8.6], [-5.2, 7.0], [-6.0, 2.0], [-3.5, -3.5]]);
    await s.wait(3); s.tell('crowd:madman');
    await s.wait(6); s.tell('crowd:shout');
    for (const id of ['c2', 'c5', 'c8']) s.person(id).do('wave');
    await s.any(run, s.wait(4));
    mad.here(false);
    await s.wait(1);
  },
});
const WALL_CROWD = () => cast({
  c1: { at: [-9.2, 14.6], turn: 120, look: 'paradiso#booth_window' }, c2: { at: [-8.4, 16.1], turn: 140, look: 'paradiso#booth_window' },
  c3: { at: [-7.5, 14.2], turn: 100, look: 'paradiso#booth_window' }, c4: { at: [-6.2, 18.4], turn: 20 },
  c5: { at: [-3.2, 17.0], turn: 10 }, c6: { at: [-1.4, 19.4], turn: 350 }, c7: { at: [0.9, 18.2], turn: 5 },
  c8: { at: [2.6, 20.1], turn: 355 }, c9: { at: [-4.6, 21.6], turn: 15 } });
B('beam_out', {
  from: () => ({ ...PAST_NIGHT(), ...crowdAt(-1.5, 21.5, 195, 1), booth_fig: 1, beam_on: 1, beam_aim: 0, ...WALL_CROWD(), ...CAM.WALL }),
  run: async s => {
    await s.wait(0.6);
    for (const id of ['c4', 'c5', 'c6', 'c7', 'c8', 'c9']) s.person(id).look('paradiso#booth_window');
    await s.wait(2);
    s.tell('beam_out:ready');
  },
});
B('wall_film', {
  after: ['beam_out'],
  from: () => ({ ...PAST_NIGHT(), ...crowdAt(-1.5, 21.5, 195, 1, 0), booth_fig: 1, beam_on: 1, beam_aim: 1, beam_focus: 1, wall_film: 'comedy', wall_lit: 1, ...WALL_CROWD(), ...CAM.WALL }),
  run: async s => {
    const order = ['c5', 'c7', 'c4', 'c8', 'c6', 'c9', 'c3', 'c1', 'c2'];
    for (const id of order) { s.person(id).look('wall#screen'); s.person(id).mood('laugh'); }
    s.set('crowd_sit', 1);
    order.forEach((id, i) => (async () => { await s.wait(0.4 + i * 0.7 + s.random() * 0.5); await s.person(id).do('sit_ground'); })());
    await s.wait(8); s.tell('wall_film:sit');
    await s.wait(9);
  },
});
const SAT_CROWD = () => {
  const o = WALL_CROWD();
  for (const id of ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9']) { o[id + '_do'] = { motion: 'sit_ground', from: 9, loop: false }; o[id + '_look'] = 'wall#screen'; }
  return o;
};
B('smoke', {
  from: () => ({ ...PAST_NIGHT(), ...crowdAt(-1.5, 21.5, 195, 1, 1), booth_fig: 0, beam_on: 1, beam_aim: 1, beam_focus: 1, wall_film: 'comedy', wall_lit: 1,
    ...SAT_CROWD(), ...CAM.WALL, ...smokeBoy() }),
  run: async s => {
    s.move('wall_burn', 1, { over: 3, ease: 'in' });
    await s.wait(1);
    s.tell('smoke:fire');
    s.move('smoke', 1, { over: 2 });
    s.move('beam_on', 0, { over: 3.5 });
    const ids = ['c5', 'c7', 'c4', 'c8', 'c6', 'c9', 'c3', 'c1', 'c2'];
    ids.forEach((id, i) => (async () => { await s.wait(0.6 + i * 0.25 + s.random() * 0.3); s.person(id).look('paradiso#booth_window'); s.person(id).mood('afraid'); await s.person(id).do('stand_from_kneel'); })());
    s.set('crowd_sit', 0);
    const toto = s.person('toto');
    toto.gait('run');
    const run = toto.walk([[-6.0, 13.6], [-10.6, 12.2], [-11.6, 12.0]]);
    await s.any(run, s.wait(5));
    toto.here(false);
    await s.wait(1.4);
  },
});
function smokeBoy() {
  const o = cast({ toto: { at: [-2.4, 15.2], turn: 270, look: 'paradiso#booth_window', mood: 'afraid' } });
  return Object.fromEntries(Object.entries(o).filter(([k]) => k.startsWith('toto_')));
}
// Alfredo on the fountain's rim: a close from the square's side, the burnt Paradiso behind him
const ALF_CLOSE = aim(-0.42, 11.22, P.ALF_RIM, 1.18, -2);
B('outside', {
  from: () => ({ ...PAST_NIGHT(), paradiso_state: 'burnt', smoke: 0.4, ...crowdAt(-1, 19.5, 200, 1), ...cast({
    alfredo: { at: P.ALF_RIM, turn: 205, on: [P.ALF_RIM[0], P.ALF_RIM[1], G.RIM], do: SIT, mood: 'tired', look: [P.ALF_RIM[0] - 0.2, P.ALF_RIM[1] - 1.5, 0.2] },
    toto: { at: P.BOY_RIM, turn: 80, look: 'alfredo', mood: 'afraid' },
    c1: { at: [-2.4, 13.8], turn: 140, look: 'alfredo' }, c2: { at: [0.9, 14.9], turn: 230, look: 'alfredo', mood: 'sad' },
    c3: { at: [1.7, 13.9], turn: 250, look: 'alfredo' }, c4: { at: [-1.0, 14.9], turn: 190, look: 'alfredo', mood: 'sad' } }), ...CAM.FOUNTAIN }),
  run: async s => {
    const alf = s.person('alfredo'), c1 = s.person('c1');
    await s.wait(1.5);
    c1.walk([[-1.75, 13.0]]);
    await s.wait(2.4);
    await c1.turn(brg([-1.75, 13.0], P.ALF_RIM));
    c1.reach({ r: 'alfredo#hand_r' }); c1.do('give');
    await s.wait(2.0);
    c1.reach(null); c1.walk([[-2.9, 14.6]]);
    await s.wait(1.2);
    // he lifts his face: the eyes don't see
    await cutTo(s, ALF_CLOSE);
    alf.look([ALF_CLOSE.camera_x - 0.4, ALF_CLOSE.camera_z - 0.6, 1.5]);
    await s.wait(1.6);
    s.tell('outside:sat');
    await s.wait(5);
  },
});
// II.4 the new sign
B('new_sign', {
  from: () => ({ ...PAST_NIGHT(), paradiso_state: 'new', bulbs: 0, fade: 1, ...cast({
    c1: { at: [-3.5, 11.0], turn: 280 }, c2: { at: [-2.2, 12.6], turn: 270 }, c5: { at: [-4.4, 13.8], turn: 250 },
    c6: { at: [-1.6, 9.5], turn: 290 }, c7: { at: [-0.6, 14.2], turn: 260 } }), ...CAM.CROWD }),
  run: async s => {
    await s.move('fade', 0, { over: 1.5 });
    s.move('bulbs', 1, { over: 5, ease: 'linear' });
    const go = (id, p) => (async () => { await s.wait(s.random() * 1.2); await s.person(id).walk(p); s.person(id).here(false); })();
    go('c1', [[-8.4, 11.6], [-11.4, 12.0]]); go('c2', [[-8.2, 12.6], [-11.4, 12.4]]); go('c5', [[-8.6, 13.0], [-11.4, 12.6]]);
    await s.wait(4.5); s.tell('new_sign:lit');
    go('c6', [[-7.8, 11.2], [-11.4, 11.7]]); go('c7', [[-8.0, 13.4], [-11.4, 12.2]]);
    await s.wait(5.5);
  },
});
// II.5 by Alfredo's door: the boy asks; together or alone
const ALF_SEATED = (mood = 'thinking', look = 'toto') => ({ at: [G.ALF_SEAT[0], G.ALF_SEAT[1]], turn: 95, on: G.ALF_SEAT, do: loop('cane_sit'), wear: 'alfredo_blind', mood, look });
const ALF_FACE = faceCam([G.ALF_SEAT[0], G.ALF_SEAT[1]], 95, 1.35, -18, 1.18);
B('door', {
  from: () => ({ ...PAST_NIGHT(), paradiso_state: 'new', ...cast({ alfredo: ALF_SEATED('thinking', null),
    toto: { at: [-6.6, 5.6], turn: 230 } }), ...CAM.DOOR }),
  run: async s => {
    const toto = s.person('toto'), alf = s.person('alfredo');
    await toto.walk([[-9.6, 3.2], P.BOY_DOOR]);
    await toto.turn(70);
    toto.look('alfredo'); toto.mood('afraid');
    alf.look('toto');
    await s.wait(1.6);
    s.tell('door:asked');
  },
});
B('go_together', {
  after: ['door'],
  from: () => ({ ...PAST_NIGHT(), paradiso_state: 'new', ...cast({ alfredo: ALF_SEATED(), toto: { at: P.BOY_DOOR, turn: 70, look: 'alfredo', mood: 'afraid' } }), ...CAM.DOOR }),
  run: async s => {
    const toto = s.person('toto'), alf = s.person('alfredo');
    alf.mood('smile');
    s.set('alfredo_on', null);
    await alf.go('rise', { from: [G.ALF_SEAT[0], G.ALF_SEAT[1]], turn: 95 });
    toto.mood('smile');
    alf.reach({ l: 'toto#shoulder_r' });
    alf.gait('walk_slow'); toto.gait('walk_slow');
    await toto.turn(20);
    const t = toto.walk([[-10.9, 5.0], [-10.4, 9.0], [-11.2, 11.6]]);
    await s.wait(0.2);
    const a = alf.walk([[-10.85, 4.4], [-10.95, 8.6], [-11.5, 11.1]]);
    await s.any(s.all(t, a), s.wait(10));
    s.tell('go_together:in');
  },
});
B('go_alone', {
  after: ['door'],
  from: () => ({ ...PAST_NIGHT(), paradiso_state: 'new', ...cast({ alfredo: ALF_SEATED(), toto: { at: P.BOY_DOOR, turn: 70, look: 'alfredo', mood: 'afraid' } }), ...CAM.DOOR }),
  run: async s => {
    const toto = s.person('toto'), alf = s.person('alfredo');
    toto.mood('sad');
    await s.wait(0.8);
    await toto.turn(20);
    toto.look(null);
    const t = toto.walk([[-10.6, 5.0], [-10.3, 9.0], [-11.2, 11.8]]);
    await s.wait(1.2);
    alf.look('toto'); alf.mood('sad');
    glide(s, ALF_FACE, 3);
    await s.any(t, s.wait(9));
    s.tell('go_alone:in');
    await s.wait(0.8);
  },
});

// III.1 The Camera: dusk; Toto on the steps; the girl at the fountain
const STEPS_WALKERS = () => cast({ c1: { at: [-3.0, 8.0], turn: 70 }, c2: { at: [6.0, 6.0], turn: 300 }, c3: { at: [-6.5, 18.5], turn: 140 }, c4: { at: [3.5, 16.0], turn: 220 } });
const TOTO_CAM = { at: P.TOTO_STEPS, turn: 200, wear: 'toto_teen', with: ['cam8'], do: loop('film8') };
B('dusk', {
  from: () => ({ ...PAST_DUSK(), fade: 1, ...STEPS_WALKERS(), ...cast({ toto: TOTO_CAM }), ...CAM.STEPS }),
  run: async s => {
    await s.move('fade', 0, { over: 1.4 });
    for (const [id, p] of [['c1', [[3.5, 12.5]]], ['c2', [[-2.0, 9.5]]], ['c3', [[-1.0, 10.0]]], ['c4', [[-4.0, 12.0]]]]) s.person(id).walk(p);
    await s.wait(0.6); s.tell('dusk:aim');
    await s.wait(5.5);
    s.set('viewfinder', 1);
    await s.wait(0.6);
  },
});
B('seen', {
  from: () => ({ ...PAST_DUSK(), viewfinder: 0, ...cast({ toto: { ...TOTO_CAM, do: 'stand', look: 'elena' },
    elena: { at: P.ELENA_SEEN, turn: 20, look: 'toto', mood: 'neutral' },
    c3: { at: [-1.0, 10.0], turn: 140 }, c4: { at: [-4.0, 12.0], turn: 250 } }), ...CAM.STEPS }),
  run: async s => {
    await s.wait(1.5);
    s.person('elena').mood('surprised');
    await s.wait(1.5);
    s.tell('seen:turned');
  },
});
B('film_on', {
  after: ['seen'],
  from: () => ({ ...PAST_DUSK(), ...cast({ toto: { ...TOTO_CAM, do: loop('film8'), look: 'elena' }, elena: { at: P.ELENA_SEEN, turn: 20, look: 'toto' } }), ...CAM.STEPS }),
  run: async s => {
    const el = s.person('elena'), toto = s.person('toto');
    el.look(null); el.mood('neutral');
    await s.wait(0.6);
    const w = el.walk([[5.0, 13.6], [9.6, 13.1], [11.6, 13.0]]);
    toto.look('elena');
    await s.wait(2); await toto.turn(170);
    await s.wait(2.4); await toto.turn(150);
    await s.any(w, s.wait(6));
    el.here(false);
    await s.wait(0.8);
    s.tell('film_on:door');
    await s.wait(0.6);
  },
});
const EL_F_TURN = brg(P.ELENA_F, P.TOTO_F) - 25, TO_F_TURN = brg(P.TOTO_F, P.ELENA_F);
B('hello', {
  after: ['seen'],
  from: () => ({ ...PAST_DUSK(), ...cast({ toto: { ...TOTO_CAM, do: 'stand', look: 'elena' }, elena: { at: P.ELENA_SEEN, turn: 20, look: 'toto' } }), ...CAM.STEPS }),
  run: async s => {
    await s.wait(0.4);
    await cutTo(s, { ...CAM.FOUNTAIN, elena_a: P.ELENA_F[0], elena_d: P.ELENA_F[1], elena_turn: 250, toto_a: 0.8, toto_d: 16.4, toto_turn: 225, toto_with: null, toto_do: 'stand' });
    const el = s.person('elena'), toto = s.person('toto');
    el.look('toto'); el.mood('smile');
    toto.mood('surprised');
    await toto.walk([[-1.8, 14.2], P.TOTO_F]);
    await toto.turn(TO_F_TURN);
    toto.look('elena');
    await el.turn(EL_F_TURN);
    await s.wait(0.4);
    // her face, then his
    await cutTo(s, faceCam(P.ELENA_F, EL_F_TURN, 1.2, -35, 1.58));
    s.tell('hello:met');
    await s.wait(2.6);
    await cutTo(s, faceCam(P.TOTO_F, TO_F_TURN, 1.2, 35, 1.62));
    await s.wait(1.4);
    await cutTo(s, CAM.FOUNTAIN);
    await s.wait(3.0);
    el.mood('laugh');
    await s.wait(0.6);
    const w = el.walk([[1.6, 11.6], [7.0, 12.8], [11.6, 13.0]]);
    toto.look('elena');
    await s.any(w, s.wait(3.4));
    await s.wait(0.2);
  },
});
// III.2 the soldier and the princess, at Alfredo's door
const TOTO_STEP_FACE = faceCam([G.ALF_STEP[0], G.ALF_STEP[1]], 60, 1.25, 30, 0.98);
B('story_door', {
  from: () => ({ ...PAST_NIGHT(), paradiso_state: 'new', ...cast({ alfredo: { ...ALF_SEATED('thinking', null), do: loop('cane_sit') },
    toto: { at: [G.ALF_STEP[0], G.ALF_STEP[1]], turn: 60, on: G.ALF_STEP, do: loop('seated_hunched'), wear: 'toto_teen', look: 'alfredo', mood: 'neutral' } }), ...CAM.DOOR }),
  run: async s => {
    const alf = s.person('alfredo'), toto = s.person('toto');
    await s.wait(1); s.tell('story_door:start');
    alf.look('toto'); alf.do('tell_hand', { loop: true });
    glide(s, faceCam([G.ALF_SEAT[0], G.ALF_SEAT[1]], 95, 2.2, -28, 1.25), 8);
    await s.wait(9); s.tell('story_door:99');
    await s.wait(7);
    // «Why?» — his face; «I don't know. When you figure it out, tell me» — Alfredo's
    await cutTo(s, TOTO_STEP_FACE);
    s.tell('story_door:why');
    toto.mood('surprised');
    await s.wait(1.6);
    await cutTo(s, ALF_FACE);
    alf.do('cane_sit', { loop: true }); alf.look([G.ALF_SEAT[0] + 4, G.ALF_SEAT[1] + 1, 2.4]);
    await s.wait(7.4);
  },
});
// III.3 the chair under the balcony; the hundred nights
const TOTO_CHAIR = (more = {}) => ({ at: [G.CHAIR[0], G.CHAIR[1]], turn: 180, on: G.CHAIR, do: SIT, wear: 'toto_teen', look: 'balcony', ...more });
B('chair', {
  from: () => ({ ...PAST_NIGHT(), chair_on: 0, ...cast({ toto: { at: [8.4, 19.2], turn: 150, wear: 'toto_teen', with: ['chair_carried'], gait: 'carry_chair' } }), ...CAM.BALCONY }),
  run: async s => {
    const toto = s.person('toto');
    await toto.walk([[10.4, 17.4], [11.0, 16.2]]);
    toto.with(null); toto.gait(null);
    s.set('chair_on', 1);
    await toto.go('sit_down', { to: [G.CHAIR[0], G.CHAIR[1]], turn: 180 });
    toto.do('seated', { loop: true });
    toto.look('balcony');
    s.tell('chair:sat');
    await s.wait(1);
  },
});
B('nights', {
  after: ['chair'],
  from: () => ({ ...PAST_NIGHT(), chair_on: 1, ...cast({ toto: TOTO_CHAIR() }), ...CAM.BALCONY }),
  run: async s => { await s.wait(3); },
});
// III.4 New Year's eve: the booth window lit across, the balcony; midnight
B('eve', {
  from: () => ({ ...PAST_NIGHT(), paradiso_state: 'new', chalk: 99, chair_on: 1, night_kind: 'cold', cold_k: 1, ...crowdAt(-7.6, 12.2, 160, 1),
    ...cast({ toto: TOTO_CHAIR({ look: 'paradiso#booth_window' }), c1: { at: [-3, 6], turn: 300 }, c2: { at: [-1.5, 9], turn: 290 }, c3: { at: [-4.5, 9.5], turn: 290 } }), ...CAM.EVE }),
  run: async s => {
    for (const [id, p] of [['c1', [[-11.4, 11.8]]], ['c2', [[-11.4, 12.3]]], ['c3', [[-11.4, 12.6]]]]) (async () => { await s.wait(s.random()); await s.person(id).walk(p); s.person(id).here(false); })();
    await s.wait(4);
    s.person('toto').look('balcony');
    await s.wait(4.5);
    s.tell('eve:ready');
  },
});
const EL_HUG_TURN = brg(P.ELENA_HUG, P.TOTO_HUG), TO_HUG_TURN = brg(P.TOTO_HUG, P.ELENA_HUG);
const MIDNIGHT_NEAR = aim(10.25, 18.4, [10.95, 15.0], 1.55, 0);
const HUG_CLOSE = faceCam(P.ELENA_HUG, EL_HUG_TURN, 1.15, -50, 1.56);
const bursts = async (s, n) => { for (let i = 0; i < n; i++) { s.set('fw', (s.get('fw') ?? 0) + 1); s.set('flash', 0.8); s.move('flash', 0.15, { over: 0.9 }); await s.wait(1.0 + s.random() * 0.8); } };
B('midnight', {
  after: ['eve'],
  from: () => ({ ...PAST_NIGHT(), paradiso_state: 'new', chalk: 99, chair_on: 1, night_kind: 'cold', cold_k: 1, ...cast({ toto: TOTO_CHAIR(), elena: { at: [11.55, 13.0], turn: 330, mood: 'laugh', look: 'toto' } }), elena_here: false, ...CAM.BALCONY }),
  run: async s => {
    await cutTo(s, { ...CAM.BALCONY, crowd_k: 0, c1_here: false, c2_here: false, c3_here: false, ...cast({ toto: TOTO_CHAIR(), elena: { at: [11.55, 13.0], turn: 330, mood: 'laugh', look: 'toto' } }), elena_here: false });
    const toto = s.person('toto'), el = s.person('elena');
    await s.wait(1.2);
    s.set('fireworks', 1);
    const fw = bursts(s, 14);
    await s.wait(1.4);
    s.move('elena_window', 1, { over: 1.4, ease: 'out' });
    await s.wait(2.4);
    s.tell('midnight:open');
    bring(s, 'elena', { at: [11.55, 13.0], turn: 330, mood: 'laugh', look: 'toto' });
    glide(s, MIDNIGHT_NEAR, 7);
    const walk = el.walk([P.ELENA_HUG]);
    await s.wait(1.2);
    s.set('toto_on', null);
    await toto.go('rise', { from: [G.CHAIR[0], G.CHAIR[1]], turn: 180 });
    toto.look('elena'); toto.mood('smile');
    await walk;
    await s.all(el.turn(EL_HUG_TURN), toto.turn(TO_HUG_TURN));
    toto.reach({ r: 'elena#back', l: 'elena#back' }); el.reach({ r: 'toto#nape', l: 'toto#nape' });
    el.look([MIDNIGHT_NEAR.camera_x, MIDNIGHT_NEAR.camera_z, 1.5]);
    await s.wait(1);
    s.tell('midnight:hug');
    await fw;
    await s.wait(1);
  },
});
const HUG = () => cast({ toto: { at: P.TOTO_HUG, turn: TO_HUG_TURN, wear: 'toto_teen', look: 'elena', mood: 'smile', reach: { r: 'elena#back', l: 'elena#back' } },
  elena: { at: P.ELENA_HUG, turn: EL_HUG_TURN, look: [HUG_CLOSE.camera_x, HUG_CLOSE.camera_z, 1.5], mood: 'laugh', reach: { r: 'toto#nape', l: 'toto#nape' } } });
B('midnight_close', {
  after: ['midnight'],
  from: () => ({ ...PAST_NIGHT(), paradiso_state: 'new', chalk: 99, chair_on: 1, elena_window: 1, fireworks: 1, night_kind: 'cold', cold_k: 1, ...HUG(), ...HUG_CLOSE }),
  run: async s => {
    await cutTo(s, { ...HUG_CLOSE });
    s.person('elena').look([HUG_CLOSE.camera_x, HUG_CLOSE.camera_z, 1.5]);
    await bursts(s, 3);
    await s.wait(0.5);
  },
});

// V.3 1988: the chalk, the girl like Elena
const SAL = (at, turn, more = {}) => ({ at, turn, wear: 'salvatore', ...more });
const DAUGHTER_CLOSE = faceCam(P.DAUGHTER_STOP, 215, 1.5, -20, 1.56);
B('girl', {
  from: () => ({ ...NOW(0.8), chalk: 99, ...cast({ toto: SAL(P.SAL_GIRL, 50, { look: [4, 16, 1.6] }),
    madman: { at: [7.5, 4.5], turn: 300, wear: 'madman_old', gait: 'arms_wide_run', mood: 'laugh' },
    daughter: { at: [11.6, 13.0], turn: 290 } }), madman_here: false, daughter_here: false, ...CAM.CHALK }),
  run: async s => {
    await s.wait(3);
    await cutTo(s, { ...CAM.GIRL });
    const mad = s.person('madman'), d = s.person('daughter'), sal = s.person('toto');
    mad.here(true);
    const run = (async () => { await mad.walk([[2.0, 10.0], [-3.0, 16.0], [-5.0, 24.0]]); mad.here(false); })();
    await s.wait(1.8);
    d.here(true);
    const w = d.walk([[9.6, 17.0], P.DAUGHTER_STOP]);
    await s.wait(1.4);
    sal.look('madman');
    await s.wait(2.2);
    sal.look('daughter');
    await w;
    await d.turn(215);
    d.look([DAUGHTER_CLOSE.camera_x, DAUGHTER_CLOSE.camera_z, 1.6]);
    // her face: the same as Elena's, thirty years ago
    await cutTo(s, DAUGHTER_CLOSE);
    s.tell('girl:seen');
    await s.wait(2.8);
    d.look('toto');
    await cutTo(s, { ...CAM.GIRL });
    await s.any(run, s.wait(2));
    await s.wait(1.5);
  },
});
B('follow', {
  after: ['girl'],
  from: () => ({ ...NOW(0.8), chalk: 99, ...cast({ toto: SAL(P.SAL_GIRL, 50, { look: 'daughter' }), daughter: { at: P.DAUGHTER_STOP, turn: 215, look: 'toto' } }), ...CAM.GIRL }),
  run: async s => {
    const d = s.person('daughter'), sal = s.person('toto');
    d.look(null);
    (async () => { await d.walk([[10.5, 30], [10.6, 40]]); d.here(false); })();
    await s.wait(1);
    const w = sal.walk([[-2, 15.5], [8.8, 24.6], [10.4, 31]]);
    await s.any(w, s.wait(9));
    s.tell('follow:gone');
  },
});
const SAL_DOOR_FACE = aim(-11.72, 11.05, P.SAL_DOOR, 1.62, 0);
B('let', {
  after: ['girl'],
  from: () => ({ ...NOW(0.8), chalk: 99, ...cast({ toto: SAL(P.SAL_GIRL, 50, { look: 'daughter' }), daughter: { at: P.DAUGHTER_STOP, turn: 215, look: 'toto' } }), ...CAM.GIRL }),
  run: async s => {
    const d = s.person('daughter'), sal = s.person('toto');
    d.look(null);
    (async () => { await d.walk([[10.5, 30], [10.6, 36]]); d.here(false); })();
    await s.wait(2.2);
    sal.look(null); sal.mood('sad');
    glide(s, cam(-10.4, 8, -10, 0, 1), 3);
    await sal.walk([P.SAL_DOOR]);
    await sal.turn(272);
    sal.look('paradiso#door'); sal.reach({ r: 'paradiso#door' });
    glide(s, SAL_DOOR_FACE, 2.5);
    await s.wait(1.2);
    s.tell('let:hand');
    await s.wait(1.6);
    sal.look([SAL_DOOR_FACE.camera_x - 0.6, SAL_DOOR_FACE.camera_z + 0.4, 1.5]);
    await s.wait(1.6);
  },
});

// V.4 the funeral: the procession comes up the west side toward the lens; Salvatore by the boarded door
const PROC = (u, more = {}) => {
  const back = cartAt(u, 1.75), h = back[2];
  const b1 = off(back, h, 0, -0.38), b2 = off(back, h, 0, 0.38);
  return { bearer1: { at: b1, turn: h, reach: { r: 'hearse#handle_l', l: 'hearse#handle_l' }, gait: 'walk_slow' },
    bearer2: { at: b2, turn: h, reach: { r: 'hearse#handle_r', l: 'hearse#handle_r' }, gait: 'walk_slow' }, ...more };
};
const MOURNERS = u => {
  const back = cartAt(u, 3.2), h = back[2];
  return { anna: { at: off(back, h, 0, 0.1), turn: h, gait: 'walk_slow', mood: 'sad' },
    c1: { at: off(back, h, -0.9, -0.5), turn: h, gait: 'walk_slow' }, c2: { at: off(back, h, -1.0, 0.6), turn: h, gait: 'walk_slow' },
    c3: { at: off(back, h, -2.0, -0.2), turn: h, gait: 'walk_slow' }, c4: { at: off(back, h, -2.1, 0.7), turn: h, gait: 'walk_slow' } };
};
// the procession walks with the hearse: the script keeps the bearers, the mourners and (walking behind) Salvatore at
// their places by the cart as `cart` moves (follow)
B('funeral', {
  from: () => ({ ...NOW(0.3), cart: 0.12, ...cartKeys(0.12), follow: 1, sal_rail: 0,
    ...cast({ ...PROC(0.12), ...MOURNERS(0.12), toto: SAL(P.SAL_FUNERAL, 120, { mood: 'tired' }) }), ...CAM.FUNERAL }),
  run: async s => {
    const sal = s.person('toto');
    sal.look('hearse');
    await s.move('cart', 0.4, { over: (0.28 * CART_L) / 0.6, ease: 'linear' });
    s.tell('funeral:passing');
    await s.wait(3.5);
  },
});
B('walk_behind', {
  after: ['funeral'],
  from: () => ({ ...NOW(0.3), cart: 0.4, ...cartKeys(0.4), follow: 1, sal_rail: 0,
    ...cast({ ...PROC(0.4), ...MOURNERS(0.4), toto: SAL(P.SAL_FUNERAL, 120, { mood: 'tired', look: 'hearse' }) }), ...CAM.FUNERAL }),
  run: async s => {
    const sal = s.person('toto');
    await sal.walk([railAt(0.4)]);
    sal.gait('walk_slow');
    s.set('sal_rail', 1);
    sal.reach({ r: 'hearse#rail' });
    for (const id of ['c1', 'c2', 'c3']) s.person(id).look('toto');
    s.turn('camera_yaw', -112, 9, 'inOut');
    const go = s.move('cart', 0.6, { over: (0.2 * CART_L) / 0.6, ease: 'linear' });
    await s.wait(2.4);
    s.tell('walk_behind:hand');
    await go;
    s.set('follow', 0);
    sal.reach(null);
    await s.wait(1);
  },
});
function railAt(u) { const back = cartAt(u, 1.1), h = back[2]; return off(back, h, 0, 0.95); }
const WIDOW2 = aim(-5.4, 17.0, [-7.8, 17.3], 1.5, 0);
B('widow', {
  after: ['walk_behind'],
  from: () => ({ ...NOW(0.3), cart: 0.6, ...cartKeys(0.6), follow: 0,
    ...cast({ ...PROC(0.6), ...MOURNERS(0.6), toto: SAL(railAt(0.6), 0, { mood: 'tired' }) }), ...cam(-5, 18, -112, 0.2, 1) }),
  run: async s => {
    const sal = s.person('toto'), anna = s.person('anna');
    glide(s, WIDOW2, 3);
    s.set('anna_gait', null); s.set('toto_gait', null);
    await s.all(anna.walk([P.ANNA_W]), sal.walk([P.SAL_W]));
    await s.all(anna.turn(brg(P.ANNA_W, P.SAL_W)), sal.turn(brg(P.SAL_W, P.ANNA_W)));
    anna.look('toto'); sal.look('anna');
    anna.with(['tin']); anna.do('give');
    await s.wait(2.4);
    s.tell('widow:tin');
    sal.do('take');
    await s.wait(1.4);
    anna.with(null); sal.with(['tin']);
    await cutTo(s, faceCam(P.SAL_W, brg(P.SAL_W, P.ANNA_W), 1.2, -40, 1.62));
    await s.wait(3.5);
  },
});
B('stay_door', {
  after: ['funeral'],
  from: () => ({ ...NOW(0.3), cart: 0.4, ...cartKeys(0.4), follow: 1, sal_rail: 0,
    ...cast({ ...PROC(0.4), ...MOURNERS(0.4), toto: SAL(P.SAL_FUNERAL, 120, { mood: 'tired', look: 'hearse' }) }), ...CAM.FUNERAL }),
  run: async s => {
    s.person('toto').look('hearse');
    s.turn('camera_yaw', -118, 8, 'inOut');
    await s.move('cart', 0.57, { over: (0.17 * CART_L) / 0.6, ease: 'linear' });
    s.tell('stay_door:passed');
  },
});
const LATE2 = aim(-8.6, 10.2, [-10.7, 12.55], 1.55, 0);
const ANNA_LATE_FACE = faceCam(P.ANNA_LATE, brg(P.ANNA_LATE, P.SAL_FUNERAL), 1.2, 30, 1.5);
B('widow_late', {
  after: ['stay_door'],
  from: () => ({ ...NOW(0.3), cart: 1, ...cartKeys(1), follow: 0,
    ...cast({ toto: SAL(P.SAL_FUNERAL, 120, { mood: 'tired' }), anna: { at: [1.5, 21.5], turn: 250, mood: 'sad' } }), ...CAM.FUNERAL }),
  run: async s => {
    // later: the square empty, the procession gone up to the church; the widow comes back alone
    await cutTo(s, { ...CAM.FUNERAL, cart: 1, ...cartKeys(1), follow: 0, ...cast({ toto: SAL(P.SAL_FUNERAL, 120, { mood: 'tired' }), anna: { at: [1.5, 21.5], turn: 250, mood: 'sad' } }) });
    const sal = s.person('toto'), anna = s.person('anna');
    const w = anna.walk([[-6.0, 16.0], P.ANNA_LATE]);
    sal.look('anna');
    await s.wait(3);
    glide(s, LATE2, 3);
    await w;
    await s.all(anna.turn(brg(P.ANNA_LATE, P.SAL_FUNERAL)), sal.turn(brg(P.SAL_FUNERAL, P.ANNA_LATE)));
    anna.look('toto');
    anna.with(['tin']); anna.do('give');
    await s.wait(1.4);
    // over his shoulder: her face
    await cutTo(s, ANNA_LATE_FACE);
    s.tell('widow_late:tin');
    sal.do('take');
    await s.wait(1.4);
    anna.with(null); sal.with(['tin']);
    await s.wait(3.4);
  },
});
// The epilogue: the demolition
const DEMO_CROWD = { c1: [-1.5, 8.2], c2: [-2.3, 9.8], c3: [-1.0, 11.4], c4: [-3.0, 11.0], c5: [-0.6, 6.8], c6: [-3.4, 8.0], c7: [-2.0, 12.6], c8: [-0.4, 10.2] };
B('demolition', {
  from: () => {
    const who = {};
    for (const [id, at] of Object.entries(DEMO_CROWD)) who[id] = { at, turn: 270, look: 'paradiso' };
    return { ...NOW(0.32, 'charged'), ...crowdAt(-5.0, 9.8, 90, 1), ...cast({ ...who, toto: SAL([0.4, 9.2], 270, { look: 'paradiso' }), anna: { at: [0.5, 8.4], turn: 270, look: 'paradiso', mood: 'sad' },
      maria: { at: [0.55, 9.9], turn: 270, wear: 'maria_old', look: 'paradiso', mood: 'sad' } }), ...CAM.RUIN };
  },
  run: async s => {
    // where Salvatore stands and whether his mother is by him: the party's keys (place, with_mother)
    const apart = s.get('place') === 'apart', mother = Number(s.get('with_mother')) === 1;
    const sal = s.person('toto');
    const at = apart ? [0.0, 5.2] : [0.4, 9.2];
    s.set('toto_a', at[0]); s.set('toto_d', at[1]);
    s.set('anna_here', !apart);
    s.set('maria_here', mother);
    if (mother) { s.set('maria_a', at[0] + 0.15); s.set('maria_d', at[1] + 0.62); s.set('maria_reach', { l: 'toto#hand_l' }); }
    await s.wait(10);
    s.tell('demolition:whistle');
    for (const id of Object.keys(DEMO_CROWD)) s.person(id).look('paradiso');
    await s.wait(3);
    s.tell('demolition:blast');
    s.set('dust_burst', 1);
    s.move('dust', 1, { over: 2.5, ease: 'out' });
    s.move('camera_roll', 0.8, { over: 0.15 }); s.move('camera_roll', 0, { over: 0.8, ease: 'spring', queue: true });
    await s.move('collapse', 1, { over: 4, ease: 'in' });
    sal.look(null);
    await s.wait(2.6);
  },
});
B('dust', {
  after: ['demolition'],
  from: () => ({ ...NOW(0.32, 'charged'), collapse: 1, dust: 1, ...crowdAt(-5.0, 9.8, 90, 1), ...cast({ toto: SAL([0.4, 9.2], 270), anna: { at: [0.5, 8.4], turn: 270, mood: 'sad' },
    madman: { at: [-9.5, 12.6], turn: 90, wear: 'madman_old', gait: 'arms_wide_run', mood: 'laugh' },
    ...Object.fromEntries(Object.entries(DEMO_CROWD).map(([id, at]) => [id, { at, turn: 270 }])) }), madman_here: false, ...CAM.RUIN }),
  run: async s => {
    s.set('dust_burst', (s.get('dust_burst') ?? 0) + 1);
    s.move('dust', 0.35, { over: 12, ease: 'out' });
    const mad = s.person('madman');
    s.set('madman_a', -9.5); s.set('madman_d', 12.6); s.set('madman_wear', kit.cast.characters.madman_old); s.set('madman_gait', 'arms_wide_run');
    await s.wait(3.5);
    mad.here(true);
    await mad.walk([[-5.8, 12.4]]);
    mad.gait(null); mad.do('arms_wide', { loop: true });
    await s.wait(1.4);
    s.tell('dust:madman');
    await s.wait(5);
  },
});

// ── the bank (anchor x 12, z 22; facing west; +x south; door at x 9 → z 13; the balcony over it) ─────────────────
const BANK = { w: 14, h: 11, door: 9 };
function bank(g, e) {
  const { w, h } = BANK;
  plaster(g, 0, -h, w, h, '#d9c7a2', 61, 1.1);
  g.fillStyle = 'rgba(70,55,35,0.14)'; for (let y = -0.5; y > -4.0; y -= 0.5) g.fillRect(0, y, w, 0.04);
  course(g, 0, w, -4.1); course(g, 0, w, -7.5); cornice(g, 0, w, -h + 0.45, 0.5);
  for (const x of [1.5, 3.4, 11.6, 13.0]) windowAt(g, x, -1.0, 0.9, 1.7, 'glass', x);
  for (const x of [1.5, 3.4, 11.0, 12.9]) windowAt(g, x, -4.7, 0.95, 1.9, x === 3.4 ? 'half' : 'shut', x);
  for (const x of [1.5, 3.4, 6.0, 9.0, 11.0, 12.9]) windowAt(g, x, -8.1, 0.85, 1.6, 'shut', x + 3);
  // the balcony's opening (its leaves and room: the elements `balcony`, `balcony_room`)
  g.fillStyle = PAL.pale; g.fillRect(BANK.door - 0.85, -6.9, 1.7, 2.65);
  g.fillStyle = '#19160f'; g.fillRect(BANK.door - 0.7, -6.7, 1.4, 2.35);
  // the door: heavy, two leaves, the name over it
  g.fillStyle = PAL.stone; g.fillRect(BANK.door - 1.15, -3.4, 2.3, 3.4);
  g.fillStyle = '#3a2a1f'; g.fillRect(BANK.door - 0.85, -3.0, 1.7, 3.0);
  g.strokeStyle = 'rgba(10,8,5,0.5)'; g.lineWidth = 0.03; g.beginPath(); g.moveTo(BANK.door, -3.0); g.lineTo(BANK.door, 0); g.stroke();
  for (const s2 of [-1, 1]) { g.strokeRect(BANK.door + s2 * 0.42 - 0.3, -2.6, 0.6, 0.9); g.strokeRect(BANK.door + s2 * 0.42 - 0.3, -1.4, 0.6, 1.0); }
  g.fillStyle = '#5a4430'; g.font = 'bold 0.36px serif'; g.textAlign = 'center'; g.fillText('BANCA', BANK.door, -3.6);
  g.fillStyle = PAL.stone; g.fillRect(BANK.door - 1.2, -0.18, 2.4, 0.18);
  // its wall lamp by the door, pale
  const lx = 7.5, ly = -3.0;
  g.fillStyle = PAL.iron; g.beginPath(); g.moveTo(lx - 0.15, ly); g.lineTo(lx + 0.15, ly); g.lineTo(lx + 0.09, ly - 0.32); g.lineTo(lx - 0.09, ly - 0.32); g.closePath(); g.fill();
  g.fillStyle = '#efe9d8'; g.fillRect(lx - 0.09, ly - 0.25, 0.18, 0.2);
  e.light(lx, ly - 0.15, 0.22, '#e8e4d6', 1, 'lamp'); e.at(lx, ly - 0.15, 'lamp');
  e.at(BANK.door, -1.4, 'door');
}
// the balcony's leaves (shutters): elena_window opens them (layers, animate); the warm room behind is `balcony_room`
function balconyLeaves(g, e) {
  for (const [name, x0, pivot] of [['sl', 0, 0], ['sr', 0.7, 1.4]]) {
    e.layer(name, { pivot: [pivot, -5.5] }, l => {
      l.fillStyle = '#5c6a58'; l.fillRect(x0, -6.7, 0.7, 2.35);
      l.strokeStyle = 'rgba(20,20,15,0.4)'; l.lineWidth = 0.02;
      for (let y = -6.6; y < -4.4; y += 0.07) { l.beginPath(); l.moveTo(x0 + 0.05, y); l.lineTo(x0 + 0.65, y); l.stroke(); }
      l.strokeStyle = 'rgba(20,20,15,0.6)'; l.lineWidth = 0.03; l.strokeRect(x0, -6.7, 0.7, 2.35);
    });
  }
  e.at(0.7, -5.5);
}
function balconyRoom(g, e) {
  e.layer('room', {}, l => {
    const gr = l.createRadialGradient(0.7, -5.6, 0.1, 0.7, -5.6, 1.4);
    gr.addColorStop(0, '#ffd59a'); gr.addColorStop(1, '#b06a32');
    l.fillStyle = gr; l.fillRect(0, -6.7, 1.4, 2.35);
    l.fillStyle = 'rgba(90,50,25,0.6)'; l.fillRect(0.95, -6.7, 0.45, 2.35);
  });
  e.light(0.7, -5.4, 1.2, '#ffc882', 1, 'room');
}
function balconyRail(g) {
  g.strokeStyle = PAL.iron; g.lineWidth = 0.035;
  g.beginPath(); g.moveTo(0, -5.25); g.lineTo(1.8, -5.25); g.stroke();
  g.lineWidth = 0.02;
  for (let x = 0.05; x < 1.8; x += 0.09) { g.beginPath(); g.moveTo(x, -4.25); g.lineTo(x, -5.25); g.stroke(); }
  g.lineWidth = 0.025;
  for (let x = 0.2; x < 1.7; x += 0.36) { g.beginPath(); g.arc(x + 0.09, -4.7, 0.09, 0, TAU); g.stroke(); }
}
// the chalk marks by the chair: rows of twenty from the chair northward (+x north: x 1.42 → 0.2), 0.8…1.4 high;
// faded thirty years on (era now)
function chalkMarks(g, e) {
  const n = Math.max(0, Math.min(99, Math.round(e.state.chalk ?? 0))), now = e.state.era === 'now';
  g.strokeStyle = now ? 'rgba(232,228,214,0.45)' : 'rgba(246,244,236,0.95)'; g.lineWidth = 0.016; g.lineCap = 'round';
  // tally marks: each five is four strokes and one across them; four fives a row, rows down the wall
  for (let i = 0; i < n; i++) {
    const five = Math.floor(i / 5), k = i % 5, row = Math.floor(five / 4), col = five % 4;
    const x0 = 1.4 - col * 0.3 - row * 0.02, y = -1.38 + row * 0.13, j = (hash(i, 71) - 0.5) * 0.012;
    g.beginPath();
    if (k < 4) { const x = x0 - k * 0.045; g.moveTo(x + j, y); g.lineTo(x - j + (hash(i, 72) - 0.5) * 0.01, y + 0.095); }
    else { g.moveTo(x0 + 0.03, y + 0.02); g.lineTo(x0 - 0.17, y + 0.075); }
    g.stroke();
  }
  e.at(1.2, -1.1, 'chalk');
}
// a plain wooden chair, side on (Toto's), or Alfredo's rush chair by his door
function chairPaint(g, rush) {
  g.fillStyle = rush ? '#6a4a2c' : '#5a3f2a';
  g.fillRect(-0.24, -0.47, 0.48, 0.05);
  for (const x of [-0.22, 0.18]) g.fillRect(x, -0.45, 0.04, 0.45);
  g.fillRect(0.18, -0.95, 0.04, 0.5);
  for (const y of [-0.9, -0.75, -0.6]) g.fillRect(0.12, y, 0.12, 0.03);
  if (rush) { g.fillStyle = '#a58a5a'; g.fillRect(-0.24, -0.5, 0.44, 0.04); }
}
// the white blind wall, the film's place (+x east from x −5): its plaster, old faded lettering, a drainpipe
function whiteWall(g, e) {
  plaster(g, 0, -8.5, 10.5, 8.5, PAL.white, 67, 0.8);
  cornice(g, 0, 10.5, -8.15, 0.35);
  g.fillStyle = 'rgba(120,90,60,0.12)'; g.font = 'bold 0.7px serif'; g.textAlign = 'left'; g.fillText('SALI E TABACCHI', 0.8, -7.3);
  g.fillStyle = '#6a6460'; g.fillRect(0.25, -8.2, 0.1, 8.2);
  e.at(7, -4.5, 'screen');
}
// the chapel at the top of the steps (+x east from x 5.5): a pediment, a door, a rose window, a bell gable
function chapel(g, e) {
  plaster(g, 0, -11, 3.6, 11, '#d6c39c', 73, 1);
  g.fillStyle = PAL.stone; g.beginPath(); g.moveTo(-0.15, -9.0); g.lineTo(1.8, -10.6); g.lineTo(3.75, -9.0); g.closePath(); g.fill();
  g.fillRect(1.25, -12.4, 1.1, 1.9);
  g.fillStyle = '#2a241d'; g.beginPath(); g.arc(1.8, -11.75, 0.32, 0, TAU); g.fill();
  g.fillStyle = '#6e5a3a'; g.beginPath(); g.arc(1.8, -11.6, 0.18, 0, TAU); g.fill();
  for (const x of [0.15, 3.45]) { g.fillStyle = 'rgba(255,240,215,0.3)'; g.fillRect(x - 0.15, -9, 0.3, 9); }
  g.fillStyle = PAL.pale; g.beginPath(); g.arc(1.8, -6.6, 0.62, 0, TAU); g.fill();
  g.fillStyle = '#2b2a33'; g.beginPath(); g.arc(1.8, -6.6, 0.5, 0, TAU); g.fill();
  doorAt(g, 1.8, 1.3, 3.0, '#3a2a1e', true);
}
// the stone floor of the square and its streets, from above (plane: x east, y toward the south; its middle at z 6)
function ground(g) {
  const Z = 6, y = z => Z - z;
  g.fillStyle = '#9a8a6e'; g.fillRect(-22, -50, 44, 100);
  g.fillStyle = '#b8a582'; g.fillRect(-12, y(26), 24, 26);
  g.strokeStyle = 'rgba(70,58,40,0.35)'; g.lineWidth = 0.025;
  for (let z = 0; z <= 26; z += 1.1) { g.beginPath(); g.moveTo(-12, y(z)); g.lineTo(12, y(z)); g.stroke(); }
  for (let z = 0, row = 0; z < 26; z += 1.1, row++) { g.beginPath(); for (let x = -12 + (row % 2) * 0.7; x < 12; x += 1.4) { g.moveTo(x, y(z)); g.lineTo(x, y(z + 1.1)); } g.stroke(); }
  for (let i = 0; i < 520; i++) {
    const x = -12 + hash(i, 81) * 24, z = hash(i, 82) * 26, r = 0.2 + hash(i, 83) * 0.9;
    g.fillStyle = i % 2 ? 'rgba(60,45,30,0.06)' : 'rgba(245,232,205,0.06)';
    g.beginPath(); g.ellipse(x, y(z), r, r * 0.7, hash(i, 84) * 3, 0, TAU); g.fill();
  }
  g.fillStyle = 'rgba(60,45,30,0.08)'; g.beginPath(); g.ellipse(-8, y(12), 4, 3, 0, 0, TAU); g.fill();
  g.strokeStyle = 'rgba(70,58,40,0.35)'; g.lineWidth = 0.06; g.beginPath(); g.arc(0, y(13), 2.3, 0, TAU); g.stroke();
  const st = g.createLinearGradient(0, y(0), 0, y(-6));
  st.addColorStop(0, '#b8a582'); st.addColorStop(1, '#a8967a');
  g.fillStyle = st; g.fillRect(-5, y(0), 10, 6); g.fillStyle = '#a8967a'; g.fillRect(-5, y(-6), 10, 30); g.fillRect(9.1, y(50), 2.9, 24);
  g.strokeStyle = 'rgba(60,48,34,0.16)'; g.lineWidth = 0.025;
  g.beginPath(); for (let z = -34; z < 0; z += 0.4) { g.moveTo(-5, y(z)); g.lineTo(5, y(z)); } g.stroke();
  g.beginPath(); for (let z = 26; z < 50; z += 0.4) { g.moveTo(9.1, y(z)); g.lineTo(12, y(z)); } g.stroke();
}
// a step's riser (one painting, copies at each step)
function riser(g) {
  g.fillStyle = '#b5a07a'; g.fillRect(-2.5, -0.25, 5, 0.25);
  g.fillStyle = 'rgba(50,38,25,0.35)'; g.fillRect(-2.5, -0.04, 5, 0.04);
  g.fillStyle = 'rgba(255,245,225,0.25)'; g.fillRect(-2.5, -0.25, 5, 0.03);
}
// the sea at the end of the lane (card at z 80, its top at the eye): the water to the horizon, the moon's road on it
function seaEnd(g, e) {
  const S = e.state, now = S.era === 'now', h = S.hour ?? 0.9, day = h >= 0.22 && h < 0.6;
  const gr = g.createLinearGradient(0, -11.7, 0, 0);
  gr.addColorStop(0, day ? '#8a8e98' : now ? '#3c3c54' : '#2a3c64'); gr.addColorStop(1, day ? '#5f6470' : now ? '#22243a' : '#142240');
  g.fillStyle = gr; g.fillRect(-30, -11.7, 60, 11.9);
  if (!day) for (let i = 0; i < 160; i++) {
    const t = hash(i, 91), yy = -11.6 + Math.pow(hash(i, 92), 0.7) * 11.4, wd = 0.3 + (yy + 11.7) * 0.25;
    g.fillStyle = `rgba(230,232,240,${0.25 + 0.4 * hash(i, 93)})`;
    g.fillRect(10.9 + (t - 0.5) * (1.2 + (yy + 11.7) * 0.4) - wd / 2, yy, wd, 0.05 + (yy + 11.7) * 0.012);
  }
}
// the painted crowd: heads and shoulders in three staggered rows (dim colours); sitting — lower
function crowdRows(g, e, sit) {
  const H = sit ? 1.0 : 1.62;
  for (let r = 0; r < 3; r++) {
    e.layer('r' + r, { pivot: [0, 0] }, l => {
      for (let i = 0; i < 26; i++) {
        const x = -5.8 + (i + (r % 2) * 0.5) * 0.45 + (hash(i * 3 + r, 17) - 0.5) * 0.18, s = (0.92 + hash(i, r + 5) * 0.16) * (1 - r * 0.05);
        const y = -r * 0.07, top = y - H * s;
        l.fillStyle = ['#6a5a4c', '#5a5258', '#7a6a56', '#4e5260', '#6e5e48', '#5c4c46'][(i + r) % 6];
        l.beginPath(); l.moveTo(x - 0.24 * s, y); l.lineTo(x - 0.22 * s, top + 0.3 * s); l.quadraticCurveTo(x, top + 0.18 * s, x + 0.22 * s, top + 0.3 * s); l.lineTo(x + 0.24 * s, y); l.fill();
        l.fillStyle = ['#b08a6c', '#c49a78', '#a07a5c'][(i + r) % 3]; l.beginPath(); l.ellipse(x, top + 0.1 * s, 0.1 * s, 0.12 * s, 0, 0, TAU); l.fill();
        l.fillStyle = ['#2a2018', '#3a2c20', '#1e1a18'][(i * 7 + r) % 3]; l.beginPath(); l.ellipse(x, top + 0.02 * s, 0.105 * s, 0.06 * s, 0, Math.PI, 0); l.fill();
        if (hash(i, r + 9) < 0.3) { l.fillStyle = '#2e2a26'; l.beginPath(); l.ellipse(x, top, 0.13 * s, 0.04 * s, 0, 0, TAU); l.fill(); }
      }
    });
  }
}
function crowdMove(e, sit) {
  const S = e.state, k = clamp(S.crowd_k ?? 0) * (sit ? clamp(S.crowd_sit ?? 0) : 1 - clamp(S.crowd_sit ?? 0));
  for (let r = 0; r < 3; r++) { const l = e.layer('r' + r); l.alpha = k; l.x = 0.04 * anim.drift(e.t * 0.3 + r * 7, r); l.y = 0.02 * anim.drift(e.t * 0.4 + r * 3, r + 4); }
}
// the hearse: its back (the pushers' handles, the coffin's end, flowers), its sides, its top
function wheel(g, x, y, r) {
  g.strokeStyle = '#5a4634'; g.lineWidth = 0.05; g.beginPath(); g.arc(x, y, r - 0.03, 0, TAU); g.stroke();
  g.strokeStyle = '#2a211a'; g.lineWidth = 0.02; g.beginPath(); g.arc(x, y, r, 0, TAU); g.stroke();
  g.strokeStyle = '#6a5440'; g.lineWidth = 0.025; g.beginPath();
  for (let k = 0; k < 10; k++) { const a = k * Math.PI / 5; g.moveTo(x, y); g.lineTo(x + Math.cos(a) * (r - 0.04), y + Math.sin(a) * (r - 0.04)); }
  g.stroke();
  g.fillStyle = '#8a7048'; g.beginPath(); g.arc(x, y, 0.07, 0, TAU); g.fill();
}
function drape(g, x0, x1, y0, y1) {
  g.fillStyle = '#1a1820'; g.fillRect(x0, y0, x1 - x0, y1 - y0);
  g.strokeStyle = 'rgba(200,190,170,0.5)'; g.lineWidth = 0.012; g.beginPath(); g.moveTo(x0, y0 + 0.03); g.lineTo(x1, y0 + 0.03); g.stroke();
  g.fillStyle = '#b8a070'; for (let x = x0; x < x1; x += 0.05) g.fillRect(x, y1, 0.012, 0.05);
}
function hearseBack(g, e) {
  drape(g, -0.6, 0.6, -0.98, -0.72);
  for (const x of [-0.5, 0.5]) wheel(g, x, -0.45, 0.42);
  g.fillStyle = '#5a3a26'; g.fillRect(-0.36, -1.42, 0.72, 0.47);
  g.strokeStyle = '#c9a65e'; g.lineWidth = 0.025; g.strokeRect(-0.33, -1.39, 0.66, 0.41);
  g.strokeStyle = '#3a2e22'; g.lineWidth = 0.045;
  for (const s of [-1, 1]) { g.beginPath(); g.moveTo(s * 0.5, -0.85); g.lineTo(s * 0.64, -0.96); g.stroke(); }
  g.fillStyle = '#dcd6c4'; for (let i = 0; i < 6; i++) { g.beginPath(); g.arc(-0.2 + i * 0.08, -1.48 - hash(i, 3) * 0.04, 0.04, 0, TAU); g.fill(); }
  e.at(-0.6, -0.95, 'handle_l'); e.at(0.6, -0.95, 'handle_r'); e.at(0.5, -0.98, 'rail'); e.at(0, -1.45);
}
function hearseSide(g) {
  drape(g, -1.2, 1.2, -0.98, -0.72);
  g.fillStyle = '#5a3a26'; g.fillRect(-1.0, -1.42, 2.0, 0.47);
  g.strokeStyle = '#c9a65e'; g.lineWidth = 0.025; g.strokeRect(-0.97, -1.39, 1.94, 0.41);
  for (const x of [-0.6, 0.6]) { g.fillStyle = '#c9a65e'; g.beginPath(); g.arc(x, -1.2, 0.035, 0, TAU); g.fill(); }
  for (const x of [-0.75, 0.75]) wheel(g, x, -0.45, 0.42);
  g.fillStyle = '#c9c2ae'; for (let i = 0; i < 9; i++) { g.beginPath(); g.arc(-0.6 + i * 0.15, -1.47 - hash(i, 5) * 0.05, 0.05, 0, TAU); g.fill(); }
}
function hearseTop(g) {
  g.fillStyle = '#5a3a26'; g.fillRect(-0.36, -1.0, 0.72, 2.0);
  g.strokeStyle = '#c9a65e'; g.lineWidth = 0.025; g.strokeRect(-0.3, -0.95, 0.6, 1.9);
  g.beginPath(); g.moveTo(0, -0.7); g.lineTo(0, -0.1); g.moveTo(-0.15, -0.5); g.lineTo(0.15, -0.5); g.stroke();
  for (let i = 0; i < 14; i++) { g.fillStyle = i % 3 ? '#dcd6c4' : '#7a2a2a'; g.beginPath(); g.arc((hash(i, 7) - 0.5) * 0.45, 0.35 + (hash(i, 8) - 0.5) * 0.4, 0.06, 0, TAU); g.fill(); }
}
// an iron lamppost of the square (a pale light)
function lamppost(g, e) {
  g.fillStyle = PAL.iron; g.fillRect(-0.06, -3.6, 0.12, 3.6); g.fillRect(-0.16, -0.3, 0.32, 0.3);
  g.beginPath(); g.moveTo(-0.22, -3.6); g.lineTo(0.22, -3.6); g.lineTo(0.14, -4.05); g.lineTo(-0.14, -4.05); g.closePath(); g.fill();
  g.fillStyle = '#efe9d8'; g.fillRect(-0.12, -3.98, 0.24, 0.32);
  e.light(0, -3.8, 0.25, '#e4e2d8', 1, 'lamp');
}
// the canopy's front over the Paradiso's doors (+x north from z 8.3; 7.4 long): its name and its bulbs
function canopyFront(gg, e) {
  const st = e.state.paradiso_state ?? 'old', burnt = st === 'burnt', fresh = st === 'new', dead = st === 'shut' || st === 'charged';
  e.layer('all', { pivot: [3.7, 0], box: [-0.2, -1.3, 7.6, 9] }, g => canopyPaint(g, e, st, burnt, fresh, dead));
  e.light(3.7, 0.2, 0.6, '#ffcf8a', 1, 'marquee');
  e.at(3.7, 0.3, 'marquee');
}
function canopyPaint(g, e, st, burnt, fresh, dead) {
  g.fillStyle = burnt ? '#1a1612' : fresh ? '#efe6cf' : dead ? '#9a8f7c' : '#e2d6b8'; g.fillRect(0, -0.55, 7.4, 0.55);
  g.fillStyle = burnt ? 'rgba(0,0,0,0.5)' : fresh ? '#7a2a1a' : dead ? 'rgba(80,60,45,0.5)' : '#5a2e1e';
  g.font = 'bold 0.3px serif'; g.textAlign = 'center';
  g.fillText(fresh ? 'NUOVO CINEMA PARADISO' : 'CINEMA PARADISO', 3.7, -0.17);
  for (let i = 0; i < 22; i++) {
    const x = 0.18 + i * (7.04 / 21);
    g.fillStyle = burnt || st === 'charged' ? '#3a3632' : '#f4e2b6'; g.beginPath(); g.arc(x, -0.48, 0.035, 0, TAU); g.fill();
    if (!burnt && st !== 'charged') e.light(x, -0.48, 0.12, '#ffd28a', 0.6, 'b' + i);
  }
}
// animate: the bulbs as the state says (old — all; new — one by one by `bulbs`; shut — while the square goes back)
function canopyMove(e) {
  const S = e.state, st = S.paradiso_state ?? 'old';
  const c = clamp(S.collapse ?? 0), l = e.layer('all');
  l.y = 9 * c * c; l.rotate = 0.25 * c; l.alpha = 1 - clamp((c - 0.7) * 3.3);
  if (st === 'burnt' || st === 'charged') return;
  const all = st === 'shut' ? clamp((S.past ?? 0) * 1.4 - 0.4) : 1;
  for (let i = 0; i < 22; i++) e.glow('b' + i, st === 'new' ? ((S.bulbs ?? 1) * 22 > i ? 1 : 0) : all);
  e.glow('marquee', st === 'new' ? clamp(S.bulbs ?? 1) : all);
}
// the booth's room behind its window on the square: a warm lamp, a projector's dark shape; the two in the window
// (booth_fig: Alfredo and the boy, small, against the light); dead (1988) — dark
function boothRoom(g, e) {
  const gr = g.createRadialGradient(0, -6.0, 0.05, 0, -6.0, 1.1);
  gr.addColorStop(0, '#ffe2a6'); gr.addColorStop(0.6, '#e8a45a'); gr.addColorStop(1, '#6a3a1a');
  g.fillStyle = gr; g.fillRect(-0.9, -6.7, 1.8, 1.4);
  g.fillStyle = 'rgba(40,24,12,0.8)'; g.fillRect(0.25, -5.9, 0.6, 0.55); g.fillRect(0.45, -6.1, 0.2, 0.2);
  e.layer('figs', {}, l => {
    l.fillStyle = '#1e140c';
    l.beginPath(); l.ellipse(-0.28, -6.12, 0.11, 0.13, 0, 0, TAU); l.fill(); l.fillRect(-0.48, -6.0, 0.4, 0.7);
    l.beginPath(); l.ellipse(0.12, -5.88, 0.08, 0.09, 0, 0, TAU); l.fill(); l.fillRect(0.0, -5.8, 0.24, 0.5);
    l.fillRect(-0.36, -6.27, 0.18, 0.05);
  });
  e.layer('dead', {}, l => { l.fillStyle = '#1b1a1e'; l.fillRect(-0.9, -6.7, 1.8, 1.4); l.fillStyle = 'rgba(70,70,80,0.4)'; l.fillRect(-0.6, -6.5, 0.5, 0.9); });
  e.light(0, -6.0, 1.3, '#ffc27a', 1, 'win');
  e.at(0, -6.0, 'win');
}
function boothMove(e) {
  const S = e.state, st = S.paradiso_state ?? 'old';
  let k = st === 'old' || st === 'new' ? 1 : st === 'shut' ? clamp(S.past ?? 0) : 0;
  k = Math.max(k, clamp(S.booth_flash ?? 0)) * (1 - clamp(S.collapse ?? 0));
  e.glow('win', k * (0.88 + 0.12 * anim.noise(e.t * 6, 3)));
  e.layer('dead').alpha = 1 - Math.min(1, k * 1.5);
  e.layer('figs').alpha = clamp(S.booth_fig ?? 0) * k;
}
// the mother's room behind her window: a lamp, the wall; lit by mother_light
function motherRoom(g, e) {
  g.fillStyle = '#211c1a'; g.fillRect(-0.8, -5.9, 1.6, 1.8);
  e.layer('lit', {}, l => {
    const gr = l.createRadialGradient(0.3, -5.2, 0.05, 0.3, -5.2, 1.2);
    gr.addColorStop(0, '#ffd79e'); gr.addColorStop(0.7, '#c27a3e'); gr.addColorStop(1, '#5a3218');
    l.fillStyle = gr; l.fillRect(-0.8, -5.9, 1.6, 1.8);
    l.fillStyle = 'rgba(60,35,20,0.6)'; l.fillRect(-0.7, -5.7, 0.45, 0.6);
  });
  e.light(0.3, -5.1, 0.9, '#ffbf75', 1, 'lamp');
  e.at(0.3, -5.1, 'lamp');
}
// the back wall of the house behind the Paradiso (seen once its front is down): grey, scarred, a stair's ghost
function backWall(g) {
  plaster(g, 0, -8, 14, 8, '#b4ab9c', 79, 0.8);
  cornice(g, 0, 14, -7.7, 0.3);
  for (const x of [1.5, 4.5, 9.5, 12.5]) windowAt(g, x, -4.6, 0.8, 1.3, 'shut', x);
  for (const x of [3, 7, 11]) windowAt(g, x, -1.4, 0.8, 1.2, 'glass', x);
  // the ghost of the cinema's roof and its stair on the wall it leaned on
  g.strokeStyle = 'rgba(80,70,60,0.35)'; g.lineWidth = 0.1;
  g.beginPath(); g.moveTo(0, -6.2); g.lineTo(7, -7.6); g.lineTo(14, -6.2); g.stroke();
  g.fillStyle = 'rgba(220,205,180,0.4)'; g.fillRect(5.6, -6.6, 2.8, 2.0);
}
// the rubble of the front at its foot (it rises as the front falls)
function rubble(g, e) {
  e.layer('heap', { pivot: [7, 0], box: [-0.5, -3.4, 14.5, 0.2] }, l => {
    for (let i = 0; i < 70; i++) {
      const x = 0.4 + hash(i, 91) * 13.2, h = 0.4 + 2.6 * Math.sin(Math.PI * (x / 14)) * (0.6 + 0.4 * hash(i, 92)), w = 0.4 + hash(i, 93) * 1.1;
      l.fillStyle = ['#b9a888', '#a8977a', '#8e7e66', '#c8b898', '#6a5a48'][i % 5];
      l.beginPath(); l.moveTo(x - w, 0); l.lineTo(x - w * 0.3, -h); l.lineTo(x + w * 0.4, -h * 0.85); l.lineTo(x + w, 0); l.closePath(); l.fill();
    }
    l.fillStyle = '#4a3a2a'; for (let i = 0; i < 14; i++) l.fillRect(0.5 + hash(i, 95) * 13, -0.4 - hash(i, 96) * 1.6, 0.9, 0.08);
  });
}
// the feast's garland across the bank's front: coloured bulbs (their glow by `garland`)
function garlandPaint(g, e) {
  const yy = x => -6.2 + 0.4 * Math.sin(Math.PI * (x % 4) / 4);
  e.layer('wire', {}, l => { l.strokeStyle = '#2a2622'; l.lineWidth = 0.02; l.beginPath(); l.moveTo(0, yy(0)); for (let x = 0.25; x <= 12; x += 0.25) l.lineTo(x, yy(x)); l.stroke(); });
  const cols = ['#ffd27a', '#ff9a7a', '#a8d0ff', '#c8ff9a'];
  e.layer('bulbs', {}, l => {
    for (let i = 0; i < 24; i++) { const x = 0.25 + i * 0.5, y = yy(x) + 0.06; l.fillStyle = cols[i % 4]; l.beginPath(); l.arc(x, y, 0.05, 0, TAU); l.fill(); }
  });
  for (let i = 0; i < 24; i += 2) { const x = 0.25 + i * 0.5; e.light(x, yy(x) + 0.06, 0.18, cols[i % 4], 0.6, 'g' + i); }
}
function garlandMove(e) {
  const k = clamp(e.state.garland ?? 0);
  e.layer('bulbs').alpha = k; e.layer('wire').alpha = k;
  for (let i = 0; i < 24; i += 2) e.glow('g' + i, k * (0.8 + 0.2 * anim.noise(e.t * 2 + i, 1)));
}
// the Paradiso's front as it stands — or in pieces that fall (charged: the demolition)
function paradisoPaint(g, e) {
  const S = e.state, st = S.paradiso_state ?? 'old';
  const all = gg => { paradisoBase(gg, st); posters(gg, st, S.poster, S.full_sign); };
  if (st !== 'charged') {
    all(g);
    if (st === 'shut') e.layer('boards', { box: [0, -10.5, 14, 7] }, l => paradisoBoards(l, false));
  } else {
    const cuts = [[0, 4.2], [4.2, 8.4], [8.4, 14]];
    cuts.forEach(([x0, x1], i) => e.layer('c' + i, { pivot: [(x0 + x1) / 2, 0], box: [x0 - 1, -11, x1 + 1, 12] }, l => {
      l.save(); l.beginPath(); l.rect(x0, -11, x1 - x0, 11);
      if (i === 2) l.rect(PAR.booth - 1.2, -PAR.boothY - 1.2, 2.4, 2.4);
      l.clip('evenodd'); all(l); paradisoBoards(l, true); l.restore();
    }));
    e.layer('c3', { pivot: [PAR.booth, -PAR.boothY + 1.2], box: [PAR.booth - 2.5, -PAR.boothY - 2.5, PAR.booth + 2.5, 12] }, l => {
      l.save(); l.beginPath(); l.rect(PAR.booth - 1.2, -PAR.boothY - 1.2, 2.4, 2.4); l.clip(); all(l); paradisoBoards(l, true); l.restore();
    });
  }
  e.light(4.77, -3.35, 0.2, '#e6e2d6', 1, 'lamp');
  e.at(4.77, -3.35, 'lamp');
  e.at(PAR.door, -1.3, 'door');
  e.at(PAR.booth, -PAR.boothY, 'booth_window');
  e.at(PAR.poster, -2.0, 'poster');
  e.at(PAR.door, -4.5);
}
// animate: the boards fall away as the square goes back (past); the slabs fall in the demolition (collapse)
function paradisoMove(e) {
  const S = e.state, st = S.paradiso_state ?? 'old';
  if (st === 'shut') {
    const u = clamp((S.past ?? 0) * 1.6 - 0.1), l = e.layer('boards');
    l.y = 6 * u * u; l.alpha = 1 - clamp((u - 0.5) * 2); l.rotate = 0.04 * u;
  } else if (st === 'charged') {
    const c = clamp(S.collapse ?? 0);
    [0, 0.12, 0.05, 0.4].forEach((d, i) => {
      const u = clamp((c - d) / (1 - d)), l = e.layer('c' + i);
      l.y = 11 * u * u; l.rotate = (i % 2 ? -1 : 1) * 0.22 * u; l.alpha = 1 - clamp((u - 0.75) * 4);
    });
  }
}

return { G, PAL, PAR, FRONTS, CAM, LIGHT, IDS, WEARS, aimPoint, beamOf, BEAM_LEN, cartAt, cartKeys, CART_L, off, brg, nightOf, clamp,
  plaster, cornice, course, windowAt, doorAt, boards, balconyFlat, front, litWindows, windowsMove,
  paradisoBase, posters, paradisoBoards, paradisoPaint, paradisoMove, BANK, bank, balconyLeaves, balconyRoom, balconyRail, chalkMarks, chairPaint,
  whiteWall, chapel, ground, riser, seaEnd, crowdRows, crowdMove, hearseBack, hearseSide, hearseTop, lamppost, canopyFront, canopyMove,
  boothRoom, boothMove, motherRoom, backWall, rubble, garlandPaint, garlandMove, SKY, FILM: film, ORDER: Object.keys(film), cast, REST };
