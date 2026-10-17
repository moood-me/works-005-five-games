// The jungle's plan, its plants (where each stands — the elements paint their share), the things several elements
// paint, and the film in beats (FILM: the world's module beats). Metres: `across` along the panorama (left negative),
// `d` ahead of the viewer's line.
const plan = {
  // the trail runs the whole panorama, wandering about this far ahead
  trail: { d: 10, w: 2.2 },
  // the end of the rails: the line comes in on its embankment from the left and stops here
  rails: { d: 20, end: -30, height: 1.0 },
  // the stream: from the viewer's feet it goes off under the trail into the forest in its channel — `w` either side of
  // its middle, `depth` deep — its water at `level`
  stream: { w: 2.6, depth: 0.9, level: -0.45, to: 42 },
  // the clearing by the river, the great fig behind the temple [across, d], and the river beyond
  clearing: { from: 22, to: 85 },
  fig: [67, 25],
  river: { level: -0.35 },
  // the temple by the river (on its site, metres in its own turn): a plinth, the sanctum on it with a pillared porch
  // before it, its tower rising in two stages — half-widths at the foot of each and at the top
  temple: { plinth: [4.2, 3.6, 0.8], cella: [2.0, 3.2, 1.0], porch: [2.2, 1.9, 3.0], tower: [[2.1, 0], [1.75, 3.6], [0.85, 6.0]] },
  // the hut by the line: walls, the ridge of its thatch
  hut: { w: 2.2, d: 1.7, wall: 2.2, ridge: 3.8, eaves: 0.45 },
  // the elephant's shed: posts, the ridge of its roof
  shed: { w: 4.4, d: 2.2, posts: 4.6, ridge: 5.8, eaves: 0.4 },
};
const h = anim.hash;
// 0 → 1 as v goes from a to b, easing in and out: the land's slopes start and end without a crease (the light lies on
// the land by its slope)
const ramp = (v, a, b) => anim.ease.smooth(anim.span(v, a, b));
// where the trail is (its middle), `across` along it
const trail = across => plan.trail.d + 1.4 * Math.sin(across / 17) + 0.6 * Math.sin(across / 6.3 + 1);
// the procession's head, `across`, as far as the column has come (`procession` 0…1): from the left of the station to
// past the clearing, 170 m along the trail
const columnHead = p => -75 + 170 * anim.clamp(p, 0, 1);
// where the stream is (its middle), `d` ahead
const stream = d => 0.8 + 0.3 * d + 0.9 * Math.sin(d / 4.5);
// where the river's shore is, `across` along it: close by the clearing, farther past the pagoda, curving off into the
// forest on the left
const bank = across => 21 + 0.12 * Math.max(0, 30 - across) ** 2 + 0.8 * Math.sin(across / 7) + 6 * ramp(across, 45, 62);

// colours and the soft patch are the world's (modules/svet)
const { mixc, rgba, glow } = kit.svet;

// The land: the embankment the rails end on, the stream's channel, the bank down to the river. 0 where the viewer
// stands.
function ground(across, d) {
  const R = plan.rails;
  // the embankment, 6 m across under the rails; it stops unfinished, sloping down past its end
  const rise = ramp(d, R.d - 5, R.d - 3) * (1 - ramp(d, R.d + 3, R.d + 5)) * (1 - ramp(across, R.end - 2, R.end + 4));
  // the stream's channel, its banks sloping down to its bed
  const S = plan.stream;
  const k = anim.clamp(1 - Math.abs(across - stream(d)) / S.w, 0, 1);
  const bed = anim.ease.smooth(k) * ramp(d, 1.5, 3) * (1 - ramp(d, S.to - 4, S.to));
  // the shore going gently down into the river, on the right
  const river = ramp(d, bank(across) - 8, bank(across) + 2);
  return R.height * rise - S.depth * bed - 0.6 * river;
}

// Where the land comes up to a water's level between lo (under it) and hi (above it): the water's edge, found along
// the way from lo to hi (f — the land's height there).
function shoreline(f, lo, hi, level) {
  if (f(lo) >= level) return null;
  for (let i = 0; i < 20; i++) {
    const m = (lo + hi) / 2;
    if (f(m) < level) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}

// ── The plants: where each stands, chosen once (the same every time — seeded) ──
// is there room at (across, d)? — not on the trail, the open clearing, by the river, on the embankment where the rails
// end, nor in the stream's channel (opening as it goes off into the forest)
const free = (across, d, room) => {
  const P = plan;
  if (d < trail(across) + P.trail.w / 2 + room) return false;
  if (across > P.clearing.from + 3 && across < P.clearing.to - 6) return false;
  if (d > bank(across) - 2) return false;
  if (across < P.rails.end + 3 && d > P.rails.d - 5 && d < P.rails.d + 5) return false;
  const s = Math.abs(across - stream(d));
  return s > P.stream.w + room && (d < 24 || s > 4 + 0.25 * (d - 24));
};
// the station's ground, where the line ends: the train, the shed, the sign and the hut seen from the trail
const station = (across, d) => across > -70 && across < -16 && d < 28;
// each plant: { a (across), d, h (its height), v (a steady 0…1 giving it its looks) }
const TREES = [], PALMS = [], BAMBOO = [], LOW = [], SHORE = [];
for (let i = 0; i < 170; i++) {
  const a = -105 + 210 * h(i, 1), d = 14 + 56 * Math.pow(h(i, 2), 1.3);
  if (free(a, d, 1) && !station(a, d)) TREES.push({ a, d, h: 22 + 16 * h(i, 3), v: h(i, 4) });
}
for (let i = 0; i < 60; i++) {
  const a = -100 + 200 * h(i, 21), d = trail(a) + 3 + 22 * h(i, 22);
  if (free(a, d, 0.5) && !station(a, d)) PALMS.push({ a, d, h: 3.5 + 4.5 * h(i, 23), v: h(i, 24) });
}
// bamboo along the trail's far edge — not before the station, where the line ends
for (let i = 0; i < 18; i++) {
  const a = -22 + 115 * h(i, 11), d = trail(a) + plan.trail.w / 2 + 1 + 2 * h(i, 13);
  if (free(a, d, 0.5)) BAMBOO.push({ a, d, h: 6 + 5 * h(i, 12), v: h(i, 14) });
}
// ferns and broad leaves between the trunks
for (let i = 0; i < 110; i++) {
  const a = -100 + 200 * h(i, 31), d = trail(a) + plan.trail.w / 2 + 0.6 + 26 * Math.pow(h(i, 32), 1.5);
  if (free(a, d, 0)) LOW.push({ a, d, h: 1 + 1.4 * h(i, 33), v: h(i, 34), fern: h(i, 35) < 0.6 });
}
// palms on the clearing's shore, leaning out over the water
for (let i = 0; i < 7; i++) {
  const a = plan.clearing.from + 6 + (plan.clearing.to - plan.clearing.from - 10) * h(i, 41);
  if (Math.abs(a - plan.fig[0]) >= 8) SHORE.push({ a, d: bank(a) - 3, h: 6 + 3 * h(i, 42), v: 0.75 + 0.25 * h(i, 43) });
}
// What is close to the viewer, dark against the lit forest: great trunks before the trail (their places chosen for the
// views), ferns and broad leaves at the feet — a few in every view, not in the stream's channel nor before the clearing
// (the view to the river open) —, lianas hanging into the top of the view.
const wet = (a, d) => Math.abs(a - stream(d)) < plan.stream.w + 0.3;
const open = a => a > plan.clearing.from + 4 && a < plan.clearing.to;
const NEAR_TRUNKS = [-98, -78, -62, -21, -6, 7, 19, 92].map((a, i) => ({ a, d: 6 + 1.5 * h(i, 2), w: 0.5 + 0.3 * h(i, 3) }));
const NEAR_LOW = [];
for (let i = 0; i < 130; i++) {
  const a = -100 + 1.55 * (i + h(i, 11)), d = 2.6 + 4.4 * h(i, 12);
  if (!wet(a, d) && !open(a)) NEAR_LOW.push({ a, d, h: 0.7 + 0.6 * h(i, 13), v: h(i, 14), fern: h(i, 15) < 0.55 });
}
const LIANAS = [];
for (let i = 0; i < 26; i++) LIANAS.push({ a: -100 + 200 * h(i, 21), d: 3 + 3 * h(i, 22), low: 2.5 + 0.9 * h(i, 23) });

// Each plant as a layer of an element standing at `anchor` metres ahead (its own depth behind the element's card, its
// foot on the land there): what its painting is offset by, and its box round its foot ([l, t, r, b] of its height).
function plantLayer(e, name, p, anchor, box, wind, paint) {
  const y = -(ground(p.a, p.d) - ground(0, anchor));
  e.layer(name, { depth: anchor - p.d, pivot: [p.a + (box.pivot?.[0] ?? 0) * p.h, y + (box.pivot?.[1] ?? 0) * p.h], wind,
    box: [p.a + box[0] * p.h, y + box[1] * p.h, p.a + box[2] * p.h, y + box[3] * p.h] }, g => { g.translate(p.a, y); paint(g); });
}

// ── What the plants are ──
// A tall jungle tree's trunk, its foot at (0, 0): straight and grey on buttress roots, a branch either side up into the
// crown (h — its height, v — its looks).
function trunk(g, H, v, bark) {
  const w = H * (0.022 + 0.014 * v);
  g.fillStyle = bark;
  g.beginPath();
  g.moveTo(-w * 3, 0);
  g.quadraticCurveTo(-w * 1.1, -H * 0.03, -w, -H * 0.12);
  g.lineTo(-w * 0.7, -H * 0.78);
  g.lineTo(w * 0.7, -H * 0.78);
  g.lineTo(w, -H * 0.12);
  g.quadraticCurveTo(w * 1.1, -H * 0.03, w * 3, 0);
  g.closePath();
  g.fill();
  // its bark, in long grooves; moss low on the buttresses
  g.fillStyle = 'rgba(20,24,16,0.14)';
  for (let k = 0; k < 3; k++) g.fillRect(-w * 0.6 + w * 0.5 * k + w * 0.2 * h(k, 2 + v * 97), -H * 0.76, w * 0.1, H * 0.7);
  g.fillStyle = 'rgba(70,96,52,0.35)';
  g.beginPath();
  g.moveTo(-w * 2.6, 0);
  g.quadraticCurveTo(-w * 1.05, -H * 0.02, -w * 0.95, -H * 0.07);
  g.lineTo(w * 0.95, -H * 0.05);
  g.quadraticCurveTo(w * 1.05, -H * 0.02, w * 2.6, 0);
  g.closePath();
  g.fill();
  g.strokeStyle = bark;
  g.lineCap = 'round';
  g.lineWidth = w * 0.5;
  for (const s of [-1, 1]) {
    g.beginPath();
    g.moveTo(0, -H * 0.7);
    g.quadraticCurveTo(s * H * 0.08, -H * 0.78, s * H * 0.16, -H * 0.86);
    g.stroke();
  }
}
// Its crown over the trunk (the same foot): clusters of many small leaf masses, deeper green within and lighter where
// they spread out, lianas hanging from it.
function crown(g, H, v, leaf, deep) {
  for (const [col, k0, grow, lift] of [[deep, 0, 1, 0], [leaf, 16, 0.8, 0.012]]) {
    g.fillStyle = col;
    for (let c = 0; c < 6; c++) {
      const cx = (h(c, 3 + v * 97) - 0.5) * H * 0.5;
      const cy = -H * (0.8 + 0.18 * h(c, 5 + v * 97) + lift);
      const r = H * (0.06 + 0.05 * h(c, 7 + v * 97)) * grow;
      for (let k = 0; k < 16; k++) {
        const a = h(c * 16 + k + k0, 13 + v * 31) * Math.PI * 2;
        const rr = r * Math.sqrt(h(c * 16 + k + k0, 17 + v * 31));
        g.beginPath();
        g.ellipse(cx + Math.cos(a) * rr * 1.5, cy + Math.sin(a) * rr * 0.7, r * 0.34, r * 0.16, (h(c * 16 + k + k0, 19 + v * 31) - 0.5) * 1.2, 0, Math.PI * 2);
        g.fill();
      }
    }
  }
  // lianas, long and thin, hanging from the crown
  g.strokeStyle = deep;
  g.lineWidth = Math.max(0.03, H * 0.0025);
  for (let i = 0; i < 3; i++) {
    const x0 = (h(i, 9 + v * 97) - 0.5) * H * 0.45;
    const len = H * (0.3 + 0.4 * h(i, 11 + v * 97));
    g.beginPath();
    g.moveTo(x0, -H * 0.8);
    g.quadraticCurveTo(x0 + H * 0.02, -H * 0.8 + len * 0.6, x0 - H * 0.01, -H * 0.8 + len);
    g.stroke();
  }
}

// The great fig, its foot at (0, 0): a short massive trunk of many fused stems, its spreading limbs, aerial roots hanging
// down to the ground (figWood) — and a broad low dome of a crown over it (figCrown) (H — its height).
function figWood(g, H) {
  const bark = '#6a6656', W = H * 0.9;
  g.strokeStyle = bark;
  g.lineCap = 'round';
  for (const [x, y, w] of [[-0.75, 0.42, 0.7], [-0.4, 0.5, 0.6], [0.45, 0.48, 0.6], [0.8, 0.4, 0.7]]) {
    g.lineWidth = w;
    g.beginPath();
    g.moveTo(0, -H * 0.28);
    g.quadraticCurveTo(x * W * 0.4, -H * (y + 0.05), x * W, -H * y);
    g.stroke();
  }
  g.fillStyle = bark;
  for (let i = 0; i < 26; i++) {
    const x = (h(i, 71) - 0.5) * 1.7 * W;
    const top = -H * (0.4 + 0.1 * (1 - Math.abs(x) / W));
    const w = h(i, 72) < 0.25 ? 0.35 : 0.06;
    const low = w > 0.1 ? 0 : -H * 0.08 * h(i, 73);
    g.fillRect(x - w / 2, top, w, low - top);
  }
  g.beginPath();
  g.moveTo(-2.6, 0);
  g.quadraticCurveTo(-1.2, -0.4, -1.1, -2.5);
  g.lineTo(-0.9, -H * 0.32);
  g.lineTo(0.9, -H * 0.32);
  g.lineTo(1.1, -2.5);
  g.quadraticCurveTo(1.2, -0.4, 2.6, 0);
  g.closePath();
  g.fill();
}
function figCrown(g, H) {
  const W = H * 0.9;
  for (const [col, n0, grow] of [['#2c4228', 0, 1], ['#3a5434', 220, 0.75]]) {
    g.fillStyle = col;
    for (let k = 0; k < 220; k++) {
      const u = h(k + n0, 74) * 2 - 1;
      const dome = Math.sqrt(1 - u * u);
      const x = u * W;
      const y = -H * (0.42 + 0.5 * dome * h(k + n0, 75) + (grow < 1 ? 0.02 : 0));
      const r = H * (0.05 + 0.04 * h(k + n0, 76)) * grow;
      g.beginPath();
      g.ellipse(x, y, r * 1.4, r * 0.75, (h(k + n0, 77) - 0.5) * 0.8, 0, Math.PI * 2);
      g.fill();
    }
  }
}

// A clump of bamboo, its foot at (0, 0): tall jointed canes arching out, feathery leaves along their tops.
function bamboo(g, H, v, leaf, cane) {
  g.lineCap = 'round';
  for (let i = 0; i < 11; i++) {
    const a = h(i, 21 + v * 53);
    const lean = (a - 0.5) * 0.7;
    const hh = H * (0.7 + 0.3 * h(i, 23 + v * 53));
    const x0 = (a - 0.5) * 0.7;
    const tip = [x0 + lean * hh, -hh * (1 - Math.abs(lean) * 0.2)];
    g.strokeStyle = cane;
    g.lineWidth = 0.06;
    g.beginPath();
    g.moveTo(x0, 0);
    g.quadraticCurveTo(x0 + lean * hh * 0.2, -hh * 0.6, tip[0], tip[1]);
    g.stroke();
    // its joints, darker rings up the cane
    g.strokeStyle = 'rgba(40,50,28,0.6)';
    g.lineWidth = 0.075;
    for (let k = 1; k < 7; k++) {
      const u = k / 7, px = x0 + (tip[0] - x0) * u * u, py = tip[1] * u;
      g.beginPath();
      g.moveTo(px - 0.002, py);
      g.lineTo(px + 0.002, py - 0.04);
      g.stroke();
    }
    // leaves: narrow blades drooping in sprays along the last third
    g.fillStyle = leaf;
    for (let k = 0; k < 6; k++) {
      const u = 0.62 + 0.38 * (k / 5);
      const px = x0 + (tip[0] - x0) * u * u;
      const py = tip[1] * u;
      const dir = (h(i * 7 + k, 25 + v * 53) - 0.5) * 2.2 + lean;
      g.save();
      g.translate(px, py);
      g.rotate(dir + Math.PI * 0.6 * Math.sign(dir || 1));
      g.beginPath();
      g.moveTo(0, 0);
      g.quadraticCurveTo(0.09, 0.3, 0, 0.7);
      g.quadraticCurveTo(-0.09, 0.3, 0, 0);
      g.fill();
      g.restore();
    }
  }
}

// A palm of the understorey, its foot at (0, 0): a thin leaning stem, a fan of long fronds arching out and down, each a
// midrib with its leaflets hanging from it.
function palm(g, H, v, leaf, stem) {
  const lean = (v - 0.5) * 0.25 * H;
  g.strokeStyle = stem;
  g.lineWidth = 0.05 + 0.012 * H;
  g.lineCap = 'round';
  g.beginPath();
  g.moveTo(0, 0);
  g.quadraticCurveTo(lean * 0.2, -H * 0.5, lean, -H);
  g.stroke();
  const n = 7 + Math.floor(4 * v);
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (i / (n - 1) - 0.5) * 3.3 + 0.2 * (h(i, 41 + v * 19) - 0.5);
    const len = H * (0.35 + 0.15 * h(i, 43 + v * 19));
    frond(g, lean, -H, a, len, len * 0.2, leaf, 0.55 + 0.3 * Math.abs(Math.cos(a)));
  }
}

// One frond from (x, y) going off at angle a and drooping (droop 0…1): a thin midrib arching over, its leaflets in pairs
// along it, slanting toward the tip and shorter toward it (w — the longest).
function frond(g, x, y, a, len, w, color, droop) {
  const at = u => [x + Math.cos(a) * len * u, y + Math.sin(a) * len * u + droop * len * u * u * 0.8];
  g.strokeStyle = color;
  g.fillStyle = color;
  g.lineWidth = Math.max(0.012, w * 0.08);
  g.beginPath();
  for (let k = 0; k <= 12; k++) g.lineTo(...at(k / 12));
  g.stroke();
  const n = 11;
  for (let k = 1; k <= n; k++) {
    const u = k / (n + 1);
    const [px, py] = at(u);
    const [qx, qy] = at(u + 0.02);
    const dir = Math.atan2(qy - py, qx - px);
    const l = w * (0.35 + 0.65 * Math.sin(Math.PI * Math.min(1, 0.25 + u * 0.85)));
    for (const side of [-1, 1]) {
      g.save();
      g.translate(px, py);
      g.rotate(dir + side * 0.95);
      g.beginPath();
      g.ellipse(l / 2, 0, l / 2, l * 0.16, 0, 0, Math.PI * 2);
      g.fill();
      g.restore();
    }
  }
}

// A fern, its foot at (0, 0): a few fronds arching up and out from the middle, their tips nodding but off the ground.
function fern(g, H, v, color) {
  const n = 5 + Math.floor(4 * v);
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (i / (n - 1) - 0.5) * 1.7 + 0.2 * (h(i, 51 + v * 23) - 0.5);
    const len = H * (0.9 + 0.4 * h(i, 53 + v * 23));
    frond(g, 0, 0, a, len, len * 0.2, color, 0.45 * Math.abs(Math.cos(a)));
  }
}

// Broad leaves on long stalks from the ground — an elephant's ear, a young banana — their feet at (0, 0).
function broadleaf(g, H, v, color, rib) {
  const n = 3 + Math.floor(3 * v);
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (i / Math.max(1, n - 1) - 0.5) * 1.1 + 0.3 * (h(i, 61 + v * 29) - 0.5);
    const stalk = H * (0.55 + 0.3 * h(i, 63 + v * 29));
    const L = H * (0.4 + 0.15 * h(i, 65 + v * 29));
    const bx = Math.cos(a) * stalk;
    const by = Math.sin(a) * stalk;
    g.strokeStyle = color;
    g.lineWidth = 0.035;
    g.beginPath();
    g.moveTo(0, 0);
    g.quadraticCurveTo(bx * 0.3, by * 0.7, bx, by);
    g.stroke();
    // the blade hangs from the stalk's end, tipped out and down
    const tip = a + 0.9 * Math.sign(Math.cos(a) || 1) + (Math.PI / 2 + a) * 0.4;
    const tx = bx + Math.cos(tip) * L;
    const ty = by + Math.sin(tip) * L;
    const nx = -Math.sin(tip) * L * 0.32;
    const ny = Math.cos(tip) * L * 0.32;
    g.fillStyle = color;
    g.beginPath();
    g.moveTo(bx, by);
    g.bezierCurveTo(bx + nx, by + ny, tx + nx * 0.6, ty + ny * 0.6, tx, ty);
    g.bezierCurveTo(tx - nx * 0.6, ty - ny * 0.6, bx - nx, by - ny, bx, by);
    g.fill();
    g.strokeStyle = rib;
    g.lineWidth = 0.02;
    g.beginPath();
    g.moveTo(bx, by);
    g.lineTo(tx, ty);
    g.stroke();
  }
}

// A liana with its leaves hanging from the branches overhead to `low` metres over the ground, its top at (0, −9).
function liana(g, low, leaf) {
  g.strokeStyle = leaf;
  g.lineWidth = 0.025;
  g.beginPath();
  g.moveTo(0, -9);
  g.quadraticCurveTo(0.3, -(low + 9) / 2, 0, -low);
  g.stroke();
  g.fillStyle = leaf;
  for (let k = 0; k < 7; k++) {
    const side = k % 2 ? 1 : -1;
    g.beginPath();
    g.ellipse(side * 0.12, -low - k * 0.35 + 0.08, 0.06, 0.16, side * 0.5, 0, Math.PI * 2);
    g.fill();
  }
}

// Dressed stone: a face of it, x0…x1 wide, from its foot (0) up to `top` (negative), in courses `step` apart.
function stone(g, x0, x1, top, step = 0.45) {
  g.fillStyle = '#c2ae8e';
  g.fillRect(x0, top, x1 - x0, -top);
  g.fillStyle = 'rgba(90,70,48,0.3)';
  for (let y = -step; y > top; y -= step) g.fillRect(x0, y, x1 - x0, 0.04);
}

// A stage of the temple's tower, one face of it, leaning in (the card's tilt): a trapezoid `a` wide either side at its
// foot and `b` at its top, `s` up its slope; its courses, and the band up its middle standing out a little.
function towerFace(g, a, b, s) {
  const w = u => a + (b - a) * u;
  g.fillStyle = '#c2ae8e';
  g.beginPath();
  g.moveTo(-a, 0);
  g.lineTo(-b, -s);
  g.lineTo(b, -s);
  g.lineTo(a, 0);
  g.closePath();
  g.fill();
  g.fillStyle = 'rgba(90,70,48,0.3)';
  for (let y = 0.4; y < s; y += 0.4) g.fillRect(-w(y / s), -y, 2 * w(y / s), 0.05);
  for (const x of [-0.3, 0.3]) {
    g.beginPath();
    g.moveTo(x * a, 0);
    g.lineTo(x * b, -s);
    g.lineTo(x * b + 0.04 * Math.sign(x), -s);
    g.lineTo(x * a + 0.04 * Math.sign(x), 0);
    g.fill();
  }
}

// Thatch seen from above (a roof's slope as a plane): w × d, its straw running down the slope (y toward its eaves).
function thatch(g, w, d, color) {
  g.fillStyle = color;
  g.fillRect(-w / 2, -d / 2, w, d);
  g.fillStyle = 'rgba(40,30,16,0.18)';
  for (let x = -w / 2; x < w / 2; x += 0.12) g.fillRect(x, -d / 2, 0.025, d * (0.9 + 0.1 * h(x * 50, 7)));
}

// A bank of mist lying low (a drifting layer's): soft flat ellipses at `y` over the ground, painted round its box `W` wide
// so its ends meet (each one again a box's width either side).
function mistBank(g, x0, W, n, seed, y0, y1, color, alpha) {
  for (let i = 0; i < n; i++) {
    const x = x0 + W * h(i, seed), y = y0 + (y1 - y0) * h(i, seed + 1), rw = 6 + 14 * h(i, seed + 2);
    for (const dx of [-W, 0, W]) {
      g.save();
      g.translate(x + dx, y);
      g.scale(1, 0.09);
      const rg = g.createRadialGradient(0, 0, 0, 0, 0, rw);
      rg.addColorStop(0, rgba(color, alpha));
      rg.addColorStop(1, rgba(color, 0));
      g.fillStyle = rg;
      g.fillRect(-rw, -rw, 2 * rw, 2 * rw);
      g.restore();
    }
  }
}

// ── The pyre's fire: a funeral pyre burns man-high. Each flame of a row is a body of fire (a broad soft mass), tongues
// rising out of it (broad red ones, narrower hot ones within) and licks torn off its top — each a layer painted once at
// its full size, its foot its pivot; the element's animate (flameMotion) makes each leap, lean and waver in its own
// time, the licks rise and go out one after another, all as tall as the fire is (`pyre_fire`) ──
// the layers of a row of flames — `flames`: [[x, k] …], where each flame stands along the pyre and how tall it is at
// full blaze (metres)
function tongues(flames, seed) {
  const out = [];
  flames.forEach(([cx, k], f) => {
    const s = seed + f * 13.7;
    out.push({ name: `t${out.length}`, kind: 'body', x: cx, h: k * 0.62, w: k * 0.3, s });
    for (const [count, size, hot] of [[5, 1, 0], [3, 0.62, 1]]) {
      for (let i = 0; i < count; i++) {
        const c = (i - (count - 1) / 2) / ((count - 1) / 2), v = anim.hash(i + hot * 7, s);
        out.push({ name: `t${out.length}`, kind: 'tongue', x: cx + c * 0.27 * k * size, h: k * size * (0.6 + 0.4 * (1 - Math.abs(c))) * (0.9 + 0.2 * v),
          w: 0.17 * k * size, curl: (v - 0.5) * 0.8, hot, s: s + i * 5.3 + hot * 31 });
      }
    }
    for (let i = 0; i < 2; i++) out.push({ name: `t${out.length}`, kind: 'lick', x: cx + (anim.hash(i, s + 3) - 0.5) * 0.4 * k, h: 0.2 * k, w: 0.055 * k, k, s: s + i * 0.37 + 91 });
  });
  return out;
}
// the pyre's two rows: the tall one behind those on it (over a standing man's head), the lower one before them (to his
// thighs: who stands on the pyre stands in the fire)
const FLAMES = {
  far: tongues([[-1.15, 2.0], [-0.42, 2.6], [0.38, 2.8], [1.1, 2.1]], 3),
  near: tongues([[-1.35, 0.7], [-0.7, 0.9], [0.02, 1.0], [0.72, 0.9], [1.35, 0.7]], 57),
};
function flamePaint(e, T) {
  for (const q of T) {
    const top = q.kind === 'lick' ? -q.h / 2 : -q.h, low = q.kind === 'lick' ? q.h / 2 : q.w * 0.5;
    e.layer(q.name, { pivot: [q.x, 0], blend: 'add', box: [q.x - q.w * 1.5 - 0.05, top - 0.03, q.x + q.w * 1.5 + 0.05, low + 0.03] }, g => {
      if (q.kind === 'body') {
        // the body of the fire: brightest at its heart, thinning to its edges
        const cy = -q.h * 0.46, gr = g.createRadialGradient(q.x, cy, 0, q.x, cy, 1);
        gr.addColorStop(0, 'rgba(255,214,130,0.75)');
        gr.addColorStop(0.45, 'rgba(255,150,52,0.5)');
        gr.addColorStop(1, 'rgba(255,90,24,0)');
        g.save();
        g.translate(q.x, cy);
        g.scale(q.w * 1.4, q.h * 0.52);
        g.translate(-q.x, -cy);
        g.fillStyle = gr;
        g.fillRect(q.x - 1, cy - 1, 2, 2);
        g.restore();
        return;
      }
      if (q.kind === 'lick') {
        // a lick torn off the fire: a small flame, pointed at both ends
        g.fillStyle = 'rgba(255,150,50,0.85)';
        g.beginPath();
        g.moveTo(q.x, -q.h / 2);
        g.quadraticCurveTo(q.x + q.w * 1.3, 0, q.x, q.h / 2);
        g.quadraticCurveTo(q.x - q.w * 1.3, 0, q.x, -q.h / 2);
        g.fill();
        return;
      }
      // a tongue: wide in its belly a fifth of the way up, drawn out into a point that curls aside
      const gr = g.createLinearGradient(0, 0, 0, -q.h), tip = q.x + q.curl * q.w;
      gr.addColorStop(0, q.hot ? 'rgba(255,240,190,1)' : 'rgba(255,200,110,0.95)');
      gr.addColorStop(0.45, q.hot ? 'rgba(255,212,124,0.9)' : 'rgba(255,132,44,0.85)');
      gr.addColorStop(0.82, 'rgba(255,96,26,0.6)');
      gr.addColorStop(1, 'rgba(255,70,16,0.1)');
      g.fillStyle = gr;
      g.beginPath();
      g.moveTo(q.x - q.w * 0.8, 0);
      g.bezierCurveTo(q.x - q.w * 1.35, -q.h * 0.3, q.x - q.w * 0.35 + (tip - q.x) * 0.2, -q.h * 0.62, tip, -q.h);
      g.bezierCurveTo(q.x + q.w * 0.5 + (tip - q.x) * 0.5, -q.h * 0.6, q.x + q.w * 1.35, -q.h * 0.3, q.x + q.w * 0.8, 0);
      g.quadraticCurveTo(q.x, q.w * 0.5, q.x - q.w * 0.8, 0);
      g.fill();
    });
  }
}
function flameMotion(e, T) {
  const n = anim.noise, t = e.t, fire = anim.clamp(e.state.pyre_fire ?? 0, 0, 1);
  const size = 0.2 + 0.8 * fire, lit = anim.span(fire, 0.01, 0.12);
  for (let i = 0; i < T.length; i++) {
    const q = T[i], l = e.layer(q.name);
    if (q.kind === 'lick') {
      // (each rises off the fire's top in its own time, shrinking, and goes out; then the next)
      const u = (t * (0.55 + 0.25 * anim.hash(i, 7)) + q.s) % 1, sway = n(t * 0.9 + q.s * 9, 40 + i);
      l.alpha = lit * Math.sin(Math.PI * u) ** 0.6;
      l.brightness = 1.2;
      l.scale = size * (1.15 - 0.6 * u);
      l.x = (0.1 * sway + 0.1 * u) * q.k * size;
      l.y = -(0.62 + 0.55 * u) * q.k * size;
      l.rotate = 0.3 * sway + 0.12;
      continue;
    }
    const body = q.kind === 'body';
    l.alpha = lit;
    l.brightness = body ? 0.6 : q.hot ? 1.25 : 0.95;
    l.scaleX = size * (1 + 0.1 * n(t * 2.3 + q.s, 50 + i));
    // (a slow heave and a quick flutter over it)
    l.scaleY = size * (body ? 1 + 0.12 * n(t * 1.3 + q.s, 60 + i) : 0.84 + 0.2 * n(t * 1.7 + q.s, i + 9) + 0.1 * n(t * 5.3 + q.s, 70 + i));
    // (leaning as the air draws the fire toward the river, each in its own time)
    l.rotate = body ? 0.04 : 0.06 + 0.18 * n(t * 1.1 + q.s * 0.6, 10 + i) + 0.06 * n(t * 4.1 + q.s, 80 + i);
    l.x = 0.04 * n(t * 0.8 + q.s, 30 + i);
  }
}

// ── Kiouni, the elephant: an element of the scene (people do not move as he does). He is built on his anchor `kiouni`
// (its place — kiouni_x, kiouni_d, kiouni_facing, kiouni_el, kiouni_tilt — the scene's) as two flanks seen from the side
// (`kiouni_l`, `kiouni_r`: one is near, whichever way he faces, and shows all of him; the far one only its two legs
// between his near ones), the howdah's rails (`gauda_l`, `gauda_r`) on his back, the people sat in it on points of his
// frame (KIOUNI_SEATS). His parts are layers of a flank, painted once; his legs, head, ears, trunk, tail move by its
// animate (kiouniMove): the legs walk by the way he has come (his own step — never sliding), fold as he kneels; the trunk
// takes its poses (`trunk`), the ears fan (`ears`, `balk`), the head lifts as he trumpets.
// His own metres, as painted: his head toward +x, the ground at y 0, up negative.
const KI = {
  // the legs: where the hip is, the upper and lower bones; the near pair and the far pair a little apart
  front: { x: 0.8, hip: -1.62, a: 0.84, b: 0.78 },
  hind: { x: -1.0, hip: -1.66, a: 0.86, b: 0.8 },
  farX: -0.17,
  // the head turns about the neck; the trunk hangs from its face, five pieces (their lengths, their half-widths at the
  // root of each); the ear turns about its top
  neck: [0.98, -2.45], base: [2.02, -2.02], ear: [1.36, -2.8], tail: [-1.56, -2.32], eye: [1.68, -2.48],
  trunk: [0.44, 0.42, 0.4, 0.36, 0.33], tw: [0.2, 0.165, 0.135, 0.11, 0.085, 0.065],
  // his back, where the howdah's floor is (elevation on his anchor), and how far each flank stands from his middle
  back: 2.86, side: 0.85,
  // the walk: a stride (metres a step cycle) at a walk and at a run; how high a foot lifts
  stride: 1.75, strideRun: 2.6, lift: 0.24,
};
// The trunk's poses: each piece's way from its root (radians: 0 hanging down, + toward the front, π straight up)
const TRUNK = {
  rest: [0.14, 0.06, -0.04, -0.22, -0.6],
  up: [1.2, 1.95, 2.5, 2.9, 3.35],
  sugar: [1.05, 1.95, 2.75, 3.3, 3.75],
  lift: [0.75, 1.15, 1.85, 2.75, 3.6],
  // folded as he kneels (his head near the ground)
  low: [0.55, 0.95, 1.35, 1.65, 1.95],
};
// each piece's root and way at rest — how the layers are painted
const TRUNK_REST = (() => {
  const out = [];
  let [x, y] = KI.base;
  KI.trunk.forEach((len, i) => {
    const a = TRUNK.rest[i];
    out.push({ x, y, a, len });
    x += Math.sin(a) * len;
    y += Math.cos(a) * len;
  });
  return out;
})();
const SKIN = '#7a726d', SKIN_DK = '#665f5a', SKIN_LT = '#8c847d', PINK = '#c99c8e', NAIL = '#ddd4c0';
const CLOTH = '#a42e27', GOLD = '#d4a94c', PAINT = ['#f0c23c', '#efe7d2', '#d8572c'];

// A flank's layers (painted once): `dir` — +1 when it is the flank whose painting has his head to its right.
function kiouniPaint(e, dir) {
  const L = (name, pivot, box, paint) => e.layer(name, { pivot: [dir * pivot[0], pivot[1]],
    box: dir > 0 ? box : [-box[2], box[1], -box[0], box[3]] }, g => { g.scale(dir, 1); paint(g); });
  const fill = (g, c, pts, close = true) => {
    g.fillStyle = c;
    g.beginPath();
    g.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) {
      const p = pts[i];
      if (p.length === 4) g.quadraticCurveTo(p[0], p[1], p[2], p[3]);
      else if (p.length === 6) g.bezierCurveTo(p[0], p[1], p[2], p[3], p[4], p[5]);
      else g.lineTo(p[0], p[1]);
    }
    if (close) g.closePath();
    g.fill();
  };
  const wrinkles = (g, x0, x1, y0, y1, n, seed, color = 'rgba(52,44,40,0.35)') => {
    g.strokeStyle = color;
    g.lineWidth = 0.018;
    g.lineCap = 'round';
    for (let i = 0; i < n; i++) {
      const y = y0 + ((y1 - y0) * (i + 0.5)) / n + 0.03 * (h(i, seed) - 0.5), xa = x0 + 0.05 * h(i, seed + 1), xb = x1 - 0.05 * h(i, seed + 2);
      g.beginPath();
      g.moveTo(xa, y);
      g.quadraticCurveTo((xa + xb) / 2, y + 0.035, xb, y);
      g.stroke();
    }
  };
  // the tail: a rope of a tail, its tuft of dark hair
  L('tail', KI.tail, [-1.9, -2.45, -1.3, -0.9], g => {
    g.strokeStyle = SKIN_DK;
    g.lineCap = 'round';
    g.lineWidth = 0.075;
    g.beginPath();
    g.moveTo(-1.56, -2.32);
    g.quadraticCurveTo(-1.74, -1.9, -1.66, -1.3);
    g.stroke();
    fill(g, '#2e2622', [[-1.71, -1.36], [-1.62, -1.36], [-1.56, -1.05], [-1.66, -0.98], [-1.76, -1.06]]);
  });
  // the body: the great round barrel of him, his back highest in the middle; the cloth over it under the howdah, red
  // with a gold border and tassels; a girth strap
  L('body', [0, 0], [-1.8, -3.0, 1.35, -0.9], g => {
    fill(g, SKIN, [[-1.62, -1.55], [-1.72, -2.1, -1.55, -2.55], [-1.2, -2.86, -0.2, -2.92], [0.8, -2.9, 1.12, -2.62],
      [1.28, -2.2, 1.18, -1.7], [1.08, -1.26, 0.6, -1.16], [-0.2, -1.02, -0.85, -1.16], [-1.42, -1.25, -1.62, -1.55]]);
    // the light along his back, the shade under his belly
    fill(g, SKIN_LT, [[-1.45, -2.52], [-1.1, -2.82, -0.2, -2.88], [0.7, -2.86, 0.98, -2.66], [0.3, -2.7, -0.4, -2.72], [-1.1, -2.66, -1.45, -2.52]]);
    fill(g, SKIN_DK, [[-1.3, -1.28], [-0.4, -1.18, 0.5, -1.22], [0.8, -1.3], [0.4, -1.08, -0.2, -1.04], [-0.9, -1.1, -1.3, -1.28]]);
    wrinkles(g, -1.55, -1.1, -2.2, -1.5, 4, 3);
    // the cloth
    fill(g, CLOTH, [[-0.78, -2.9], [0.98, -2.9], [1.0, -1.82], [0.1, -1.7, -0.8, -1.82]]);
    g.strokeStyle = GOLD;
    g.lineWidth = 0.06;
    g.beginPath();
    g.moveTo(-0.72, -2.86);
    g.lineTo(-0.74, -1.88);
    g.quadraticCurveTo(0.1, -1.76, 0.94, -1.88);
    g.lineTo(0.92, -2.86);
    g.stroke();
    g.fillStyle = GOLD;
    for (let i = 0; i < 9; i++) {
      const x = -0.7 + (1.62 * i) / 8, y = -1.86 + 0.05 * Math.sin((i / 8) * Math.PI);
      g.beginPath();
      g.moveTo(x - 0.035, y);
      g.lineTo(x + 0.035, y);
      g.lineTo(x, y + 0.14);
      g.closePath();
      g.fill();
    }
    // a pattern of the cloth: gold lozenges in a row
    for (let i = 0; i < 5; i++) {
      const x = -0.45 + 0.29 * i, y = -2.28;
      g.beginPath();
      g.moveTo(x, y - 0.12);
      g.lineTo(x + 0.08, y);
      g.lineTo(x, y + 0.12);
      g.lineTo(x - 0.08, y);
      g.closePath();
      g.fill();
    }
  });
  // the legs: thick round columns, an upper and a lower piece each (the lower with the round foot and its pale nails),
  // the near pair at their places, the far pair a little apart (darker: in his own shade)
  for (const [k, P] of [['front', KI.front], ['hind', KI.hind]]) {
    const x = P.x, knee = P.hip + P.a;
    L(`${k}_up`, [x, P.hip], [x - 0.4, P.hip - 0.35, x + 0.4, knee + 0.2], g => {
      fill(g, SKIN, [[x - 0.27, P.hip - 0.3], [x + 0.27, P.hip - 0.3], [x + 0.25, P.hip + 0.3, x + 0.21, knee + 0.1], [x - 0.21, knee + 0.1],
        [x - 0.25, P.hip + 0.3, x - 0.27, P.hip - 0.3]]);
      g.strokeStyle = 'rgba(52,44,40,0.4)';
      g.lineWidth = 0.022;
      g.beginPath();
      g.moveTo(x + (k === 'front' ? 0.26 : -0.26), P.hip - 0.2);
      g.quadraticCurveTo(x + (k === 'front' ? 0.26 : -0.26), P.hip + 0.3, x + (k === 'front' ? 0.2 : -0.2), knee);
      g.stroke();
    });
    L(`${k}_lo`, [x, knee], [x - 0.36, knee - 0.15, x + 0.36, 0.06], g => {
      fill(g, SKIN, [[x - 0.21, knee - 0.08], [x + 0.21, knee - 0.08], [x + 0.2, -0.3], [x + 0.25, -0.08, x + 0.24, 0], [x - 0.24, 0],
        [x - 0.25, -0.08, x - 0.2, -0.3]]);
      wrinkles(g, x - 0.19, x + 0.19, knee + 0.05, -0.35, 5, 7 + (k === 'front' ? 0 : 11));
      g.fillStyle = NAIL;
      for (const dx of [-0.13, 0, 0.13]) {
        g.beginPath();
        g.ellipse(x + dx + (k === 'front' ? 0.03 : 0), -0.035, 0.05, 0.035, 0, Math.PI, 0);
        g.fill();
      }
    });
  }
  // the trunk: five pieces, each from its root at rest, tapering, ringed with soft folds, freckled pink near the face
  TRUNK_REST.forEach((s, i) => {
    const w0 = KI.tw[i], w1 = KI.tw[i + 1], ex = s.x + Math.sin(s.a) * s.len, ey = s.y + Math.cos(s.a) * s.len;
    const pad = 0.25;
    L(`t${i + 1}`, [s.x, s.y], [Math.min(s.x, ex) - pad, Math.min(s.y, ey) - pad, Math.max(s.x, ex) + pad, Math.max(s.y, ey) + pad], g => {
      // its way's normal
      const nx = Math.cos(s.a), ny = -Math.sin(s.a), over = 0.06;
      const bx = s.x - Math.sin(s.a) * over, by = s.y - Math.cos(s.a) * over;
      const tx = ex + Math.sin(s.a) * (i === 4 ? 0 : over), ty = ey + Math.cos(s.a) * (i === 4 ? 0 : over);
      g.fillStyle = SKIN;
      g.beginPath();
      g.moveTo(bx + nx * w0, by + ny * w0);
      g.lineTo(tx + nx * w1, ty + ny * w1);
      if (i === 4) g.quadraticCurveTo(tx + Math.sin(s.a) * 0.09, ty + Math.cos(s.a) * 0.09, tx - nx * w1, ty - ny * w1);
      else g.lineTo(tx - nx * w1, ty - ny * w1);
      g.lineTo(bx - nx * w0, by - ny * w0);
      g.closePath();
      g.fill();
      g.beginPath();
      g.arc(s.x, s.y, w0, 0, Math.PI * 2);
      g.fill();
      // the folds across it
      g.strokeStyle = 'rgba(52,44,40,0.32)';
      g.lineWidth = 0.014;
      for (let k = 1; k <= 4; k++) {
        const u = k / 5, cx = s.x + (ex - s.x) * u, cy = s.y + (ey - s.y) * u, w = w0 + (w1 - w0) * u;
        g.beginPath();
        g.moveTo(cx + nx * w * 0.9, cy + ny * w * 0.9);
        g.quadraticCurveTo(cx + Math.sin(s.a) * 0.025, cy + Math.cos(s.a) * 0.025, cx - nx * w * 0.9, cy - ny * w * 0.9);
        g.stroke();
      }
      if (i < 2) {
        g.fillStyle = 'rgba(201,156,142,0.7)';
        for (let k = 0; k < 7; k++) {
          const u = h(k, 40 + i), v = h(k, 50 + i) * 2 - 1;
          g.beginPath();
          g.arc(s.x + (ex - s.x) * u + nx * v * w0 * 0.7, s.y + (ey - s.y) * u + ny * v * w0 * 0.7, 0.022, 0, Math.PI * 2);
          g.fill();
        }
      }
      // the nostril's finger at the tip
      if (i === 4) {
        g.fillStyle = SKIN_DK;
        g.beginPath();
        g.arc(tx, ty, 0.035, 0, Math.PI * 2);
        g.fill();
      }
    });
  });
  // the head: the high domed brow, the face down to the trunk, the jaw and the small smiling lip, a short tusk with a
  // brass ring; the brow painted for a journey — a lotus of yellow and white, dots down the face; the kind eye, lashes
  L('head', KI.neck, [0.8, -3.3, 2.5, -1.4], g => {
    fill(g, SKIN, [[0.85, -2.8], [1.0, -3.02, 1.38, -3.1], [1.62, -3.14, 1.82, -3.0], [2.02, -2.86, 2.08, -2.46], [2.12, -2.2, 2.06, -1.98],
      [1.96, -1.78, 1.72, -1.72], [1.42, -1.66, 1.1, -1.84], [0.86, -2.0], [0.82, -2.4]]);
    fill(g, SKIN_LT, [[1.08, -2.98], [1.4, -3.08, 1.66, -3.06], [1.88, -2.96, 1.98, -2.7], [1.7, -2.9, 1.4, -2.94], [1.2, -2.96, 1.08, -2.98]]);
    // the lip, a little smile
    fill(g, PINK, [[1.62, -1.78], [1.8, -1.84, 1.92, -1.8], [1.82, -1.7, 1.66, -1.72]]);
    g.strokeStyle = 'rgba(60,40,36,0.6)';
    g.lineWidth = 0.02;
    g.beginPath();
    g.moveTo(1.58, -1.8);
    g.quadraticCurveTo(1.72, -1.76, 1.9, -1.84);
    g.stroke();
    // the tusk
    fill(g, '#efe6cf', [[1.9, -1.92], [2.08, -1.86, 2.3, -1.66], [2.33, -1.6, 2.26, -1.62], [2.06, -1.76, 1.88, -1.82]]);
    g.strokeStyle = GOLD;
    g.lineWidth = 0.04;
    g.beginPath();
    g.moveTo(2.1, -1.85);
    g.lineTo(2.06, -1.74);
    g.stroke();
    // the painted brow: a lotus and dots
    const [cx, cy] = [1.86, -2.62];
    for (let k = 0; k < 5; k++) {
      const a = -Math.PI / 2 + (k - 2) * 0.45;
      g.fillStyle = k % 2 ? PAINT[1] : PAINT[0];
      g.beginPath();
      g.ellipse(cx + Math.cos(a) * 0.1, cy + Math.sin(a) * 0.1, 0.1, 0.035, a, 0, Math.PI * 2);
      g.fill();
    }
    g.fillStyle = PAINT[2];
    g.beginPath();
    g.arc(cx, cy, 0.05, 0, Math.PI * 2);
    g.fill();
    for (let k = 0; k < 5; k++) {
      g.fillStyle = PAINT[k % 2];
      g.beginPath();
      g.arc(1.98 + 0.02 * k, -2.42 + 0.09 * k, 0.026, 0, Math.PI * 2);
      g.fill();
    }
    // the eye
    const [ex, ey] = KI.eye;
    g.fillStyle = '#efe4d2';
    g.beginPath();
    g.ellipse(ex, ey, 0.085, 0.055, -0.15, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = '#6a4224';
    g.beginPath();
    g.arc(ex + 0.012, ey + 0.004, 0.048, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = '#140e0a';
    g.beginPath();
    g.arc(ex + 0.016, ey + 0.004, 0.027, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = '#ffffff';
    g.beginPath();
    g.arc(ex + 0.03, ey - 0.012, 0.012, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = '#2e2420';
    g.lineWidth = 0.016;
    g.beginPath();
    g.ellipse(ex, ey, 0.09, 0.06, -0.15, Math.PI * 1.05, Math.PI * 1.95);
    g.stroke();
    for (let k = 0; k < 4; k++) {
      const a = Math.PI * (1.15 + 0.18 * k), x0 = ex + Math.cos(a) * 0.09, y0 = ey + Math.sin(a) * 0.06;
      g.beginPath();
      g.moveTo(x0, y0);
      g.lineTo(x0 + Math.cos(a) * 0.05, y0 + Math.sin(a) * 0.05 - 0.01);
      g.stroke();
    }
    wrinkles(g, ex - 0.12, ex + 0.1, ey + 0.09, ey + 0.2, 2, 21);
  });
  // the eyelid, shut for a blink (its animate shows it a moment)
  L('lid', KI.neck, [1.55, -2.6, 1.8, -2.36], g => {
    const [ex, ey] = KI.eye;
    g.fillStyle = SKIN;
    g.beginPath();
    g.ellipse(ex, ey, 0.095, 0.064, -0.15, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = '#2e2420';
    g.lineWidth = 0.018;
    g.beginPath();
    g.moveTo(ex - 0.09, ey + 0.01);
    g.quadraticCurveTo(ex, ey + 0.045, ex + 0.09, ey - 0.005);
    g.stroke();
  });
  // the ear, like a map of India hanging behind the eye: a little lighter, its rim freckled pink
  L('ear', KI.ear, [0.7, -3.0, 1.6, -1.55], g => {
    const pts = [[1.4, -2.86], [1.12, -2.98, 0.9, -2.76], [0.76, -2.5, 0.84, -2.2], [0.92, -1.9, 1.12, -1.72], [1.22, -1.84, 1.26, -2.12],
      [1.34, -2.4, 1.42, -2.56]];
    fill(g, SKIN_LT, pts);
    g.fillStyle = 'rgba(201,156,142,0.85)';
    for (let k = 0; k < 16; k++) {
      const u = h(k, 61), x = 0.86 + 0.08 * Math.sin(u * 6) + 0.06 * h(k, 62), y = -2.75 + 0.95 * u;
      g.beginPath();
      g.arc(x, y, 0.02 + 0.014 * h(k, 63), 0, Math.PI * 2);
      g.fill();
    }
    g.strokeStyle = 'rgba(52,44,40,0.35)';
    g.lineWidth = 0.02;
    g.beginPath();
    g.moveTo(1.36, -2.7);
    g.quadraticCurveTo(1.08, -2.6, 1.08, -2.0);
    g.stroke();
  });
}

// Where his parts are now (his own metres) and the layers moved there: each frame, from the state and what he keeps
// (e.mem: the way walked, the step's phase, the trunk's pose easing to its new one).
const rot = ([x, y], [px, py], t) => { const c = Math.cos(t), s = Math.sin(t); return [px + (x - px) * c - (y - py) * s, py + (x - px) * s + (y - py) * c]; };
function kiouniMove(e, dir, flank) {
  const S = e.state, m = e.mem, A = anim, t = e.t;
  // which flank is near: walking right (facing 0…180) the left one (its painting head-right)
  const f = (((S.kiouni_facing ?? 90) % 360) + 360) % 360, right = f > 0 && f < 180;
  const near = flank === 'l' ? right : !right, here = (S.kiouni_here ?? 1) > 0.5;
  // the way he has come: a step cycle per stride; how much he is walking now (smoothed — he settles when he stops)
  const x = S.kiouni_x ?? 0, d = S.kiouni_d ?? 0;
  m.x ??= x; m.d ??= d; m.ph ??= 0; m.mv ??= 0;
  const step = Math.hypot(x - m.x, d - m.d), dt = Math.min(0.1, e.dt || 0.016);
  const v = step < 2 ? step / Math.max(dt, 1e-3) : 0;
  m.x = x; m.d = d;
  const run = A.clamp(Math.max(A.span(v, 1.6, 3.2), S.pace ?? 0), 0, 1), stride = KI.stride + (KI.strideRun - KI.stride) * run;
  if (step < 2) m.ph = (m.ph + step / stride) % 1;
  m.mv += (A.span(v, 0.05, 0.6) - m.mv) * Math.min(1, dt * 4);
  const mv = m.mv, kneel = A.clamp(S.kneel ?? 0, 0, 1), balk = A.clamp(S.balk ?? 0, 0, 1), blow = A.clamp(S.kiouni_blow ?? 0, 0, 1);
  const ph = m.ph;
  // the body's bob and the head's nod in the step; the head up as he trumpets or balks, down as he kneels
  const bob = mv * (0.025 + 0.025 * run) * Math.cos(ph * 4 * Math.PI);
  const nod = mv * 0.035 * Math.sin(ph * 2 * Math.PI) + 0.012 * A.drift(t * 0.25, 3);
  const head = nod - 0.16 * blow - 0.1 * balk + 0.1 * kneel;
  // his anchor's place in his own metres: where the land is under his feet (as he kneels and tips, the ground comes up)
  const el = S.kiouni_el ?? 0, tilt = ((S.kiouni_tilt ?? 0) * Math.PI) / 180;
  const toBody = ([qx, qy]) => rot([qx, qy + el], [0, 0], tilt);
  const set = (name, dx, dy, r, alpha = 1) => {
    const Ly = e.layer(name);
    Ly.x = dir * dx;
    Ly.y = dy;
    Ly.rotate = dir * r;
    Ly.alpha = here ? alpha : 0;
  };
  const show = near ? 1 : 0;
  set('body', 0, bob, 0, show);
  set('tail', 0, bob, 0.22 * A.drift(t * 0.5, 7) + 0.12 * mv * Math.sin(ph * 2 * Math.PI), show);
  // the legs: the near pair a quarter of a cycle apart, the far pair half a cycle after them
  const lag = flank === 'l' ? 0 : 0.5, swing = (p, P) => {
    p = (((p % 1) + 1) % 1);
    const amp = 0.65 * stride * mv;
    if (p < 0.65) return [amp / 2 - (amp * p) / 0.65, 0];
    const u = (p - 0.65) / 0.35;
    return [-amp / 2 + amp * A.ease.smooth(u), -KI.lift * mv * Math.sin(Math.PI * u) * (0.8 + 0.4 * run)];
  };
  const farDx = near ? 0 : KI.farX;
  for (const [k, P, off] of [['hind', KI.hind, 0], ['front', KI.front, 0.25]]) {
    const hip = [P.x + farDx, P.hip + bob], [gx, gy] = swing(ph + off + lag, P);
    // the foot on the land: as he kneels, drawn back under him
    const foot = toBody([P.x + farDx + gx - 0.55 * kneel, gy]);
    const knee = A.joint(hip[0], hip[1], foot[0], foot[1], P.a, P.b, -1);
    const up = Math.atan2(knee[0] - hip[0], knee[1] - hip[1]), lo = Math.atan2(foot[0] - knee[0], foot[1] - knee[1]);
    set(`${k}_up`, farDx, bob, -up, near ? 1 : 0.9);
    set(`${k}_lo`, knee[0] - P.x, knee[1] - (P.hip + P.a), -lo, near ? 1 : 0.9);
  }
  // the head about the neck, the lid with it (a blink now and then)
  set('head', 0, bob, head, show);
  m.blink ??= 3;
  if (t > m.blink + 0.16) m.blink = t + 2.5 + 4 * A.hash(Math.floor(t), 9);
  set('lid', 0, bob, head, show && t > m.blink ? 1 : 0);
  const neck = [KI.neck[0], KI.neck[1] + bob], R = p => { const q = rot([p[0], p[1] + bob], neck, head); return q; };
  // the ear: flapping now and then; fanned out (`ears`, balking, trumpeting)
  const fan = Math.max(A.clamp(S.ears ?? 0, 0, 1), balk, blow, 0.35 * run * mv);
  const flap = Math.pow(Math.max(0, Math.sin(t * 2.1 + 3 * A.drift(t * 0.13, 5))), 6);
  const ep = R(KI.ear), earL = e.layer('ear');
  earL.x = dir * (ep[0] - KI.ear[0]);
  earL.y = ep[1] - KI.ear[1];
  earL.rotate = dir * (head - 0.35 * fan);
  earL.scaleX = (1 + 0.18 * fan) * (1 - 0.28 * flap * (1 - fan));
  earL.alpha = here ? show : 0;
  // the trunk: its pose eases to `trunk` (rest, up, sugar, lift) — up while he trumpets, folded as he kneels — and
  // sways; its pieces one after another from the face
  const want = blow > 0.05 ? 'up' : S.trunk ?? 'rest', goal = TRUNK[want] ?? TRUNK.rest;
  m.tr ??= TRUNK.rest.slice();
  for (let i = 0; i < 5; i++) {
    const g = A.mix(goal[i], TRUNK.low[i], want === 'rest' ? kneel : 0) + (want === 'rest' ? 0.1 * (i + 1) * 0.4 * A.drift(t * 0.35 + i * 0.4, 11) + mv * 0.08 * Math.sin(ph * 2 * Math.PI - i * 0.5) : 0.03 * A.drift(t * 0.5 + i, 13));
    m.tr[i] += (g - m.tr[i]) * Math.min(1, dt * (2.2 + 0.3 * i));
  }
  let [bx, by] = R(KI.base);
  for (let i = 0; i < 5; i++) {
    const s = TRUNK_REST[i], a = m.tr[i] - head;
    set(`t${i + 1}`, bx - s.x, by - s.y, s.a - a, show);
    if (i === 3 && near) e.at(dir * (bx + Math.sin(a) * s.len * 0.5), by + Math.cos(a) * s.len * 0.5 - 0.35, 'lift');
    bx += Math.sin(a) * s.len;
    by += Math.cos(a) * s.len;
  }
  if (near) {
    e.at(dir * bx, by, 'tip');
    const eye = R(KI.eye);
    e.at(dir * eye[0], eye[1], 'eye');
  }
}

// The howdah's rail, one side (the same seen from either: painted symmetric): a low box on his back, red and gold, its
// carved posts and top rail, cushions within; its floor at his back.
function gaudaPaint(g) {
  const W = 0.86;
  g.fillStyle = '#6a3a22';
  g.fillRect(-W, -0.32, 2 * W, 0.34);
  g.fillStyle = CLOTH;
  g.fillRect(-W + 0.05, -0.27, 2 * W - 0.1, 0.22);
  g.fillStyle = GOLD;
  g.fillRect(-W, -0.34, 2 * W, 0.05);
  g.fillRect(-W, -0.02, 2 * W, 0.04);
  for (let i = 0; i < 6; i++) {
    const x = -W + 0.15 + (2 * W - 0.3) * (i / 5);
    g.beginPath();
    g.arc(x, -0.16, 0.035, 0, Math.PI * 2);
    g.fill();
  }
  // the rail: posts and a top rail
  g.fillStyle = '#7a4a2a';
  for (let i = 0; i < 7; i++) {
    const x = -W + 0.04 + (2 * W - 0.08) * (i / 6);
    g.fillRect(x - 0.025, -0.62, 0.05, 0.3);
  }
  g.fillStyle = GOLD;
  g.fillRect(-W - 0.04, -0.66, 2 * W + 0.08, 0.05);
  for (const x of [-W - 0.02, W + 0.02]) {
    g.beginPath();
    g.arc(x, -0.7, 0.05, 0, Math.PI * 2);
    g.fill();
  }
}
// The seats of the howdah and his neck (points of his frame: across, distance — toward his tail —, elevation), the way
// those sat there face (their turn in his frame: 180 — his way; 270 / 90 — out to his left / right side)
const KIOUNI_SEATS = { guide: [0, -1.25, 2.72], front: [0, -0.5, 3.08], mid: [0, 0.08, 3.08], back: [0, 0.62, 3.08] };
const seat = name => ({ on: 'kiouni', at: KIOUNI_SEATS[name] });

// ── The people and the film (the world's module beats; notes.md lists the beats and the keys) ──
const toward = ([a, d], [a2, d2]) => ((Math.atan2(a2 - a, d2 - d) * 180) / Math.PI + 360) % 360;
const loop = (motion, from = 0) => ({ motion, loop: true, from });

// the procession: who walks where in the column — metres behind its head, and to the side of the trail's middle (−
// toward us); the widow led between two priests, a hand of each at her shoulder
const COLUMN = [
  ['pb1', 0, -0.35], ['pb2', 1.6, 0.4], ['dr1', 4.2, -0.3], ['dr2', 5.0, 0.35],
  ['pr1', 8.4, -0.62], ['aouda', 8.6, 0], ['pr2', 8.8, 0.62], ['pb3', 11.8, -0.3], ['pb4', 13.2, 0.35],
];
const GAIT = { pb1: 'torch_walk', pb2: 'torch_walk', pb3: 'torch_walk', pb4: 'torch_walk', dr1: 'drum_walk', dr2: 'drum_walk',
  pr1: 'priest_walk', pr2: 'priest_walk', aouda: 'stagger_walk' };
const TORCH = { pb1: ['torch'], pb2: ['torch'], pb3: ['torch'], pb4: ['torch'] };
// where each of the column stands with its head at `p` (`procession`)
const inColumn = (p, id) => { const [, behind, side] = COLUMN.find(c => c[0] === id), a = columnHead(p) - behind; return [a, trail(a) + side]; };
// where the column stands when it has stopped on the trail, under the viewer's eyes; where it is as the night begins
// (its head just out of the view on the left)
const STOPPED = 0.476, COMING = 0.382;
// The column sent to `p`: each walks along the trail to their place in it at their gait's own pace (those already there
// stay). Returns the walks.
function march(scene, p) {
  const out = [];
  // (not come yet: nobody of it in the scene)
  if (p <= 0) { for (const [id] of COLUMN) scene.set(`${id}_here`, false); return out; }
  for (const [id] of COLUMN) {
    const [a, d] = inColumn(p, id), a0 = scene.get(`${id}_a`), d0 = scene.get(`${id}_d`);
    if (typeof a0 !== 'number' || Math.hypot(a - a0, d - d0) < 0.3) continue;
    if (!scene.get(`${id}_here`)) scene.set(`${id}_here`, true);
    const n = Math.max(1, Math.ceil(Math.abs(a - a0) / 2)), side = d - trail(a), pts = [];
    for (let k = 1; k <= n; k++) { const x = a0 + ((a - a0) * k) / n; pts.push([x, trail(x) + side]); }
    out.push(scene.person(id).walk(pts));
  }
  return out;
}
// the column standing where `p` has it (a cut): its places, who is in the scene
const column = p => Object.fromEntries(COLUMN.flatMap(([id]) => { const [a, d] = inColumn(p, id); return [[`${id}_a`, a], [`${id}_d`, d], [`${id}_here`, p > 0]]; }));
// the state of the column as it walks (its gaits, torches, the widow veiled and led)
const COLUMN_STATE = Object.assign(Object.fromEntries(COLUMN.flatMap(([id]) => [
  [`${id}_do`, 'stand'], [`${id}_turn`, 90], [`${id}_gait`, GAIT[id]], [`${id}_with`, TORCH[id] ?? null], [`${id}_look`, null],
  [`${id}_reach`, null], [`${id}_on`, null], [`${id}_wear`, null],
])), { aouda_wear: { hood: true }, pr1_reach: { l: 'aouda#shoulder_r' }, pr2_reach: { r: 'aouda#shoulder_l' } });

// the four who hide in the thicket before the trail, crouching, facing it; where they come from along it
const PARTY = ['cromarty', 'fogg', 'passepartout', 'guide'];
const HIDE = { cromarty: [-5.4, 5.2], fogg: [-4.4, 5.6], passepartout: [-3.3, 4.9], guide: [-2.4, 5.4] };
const FROM = { cromarty: -16, fogg: -14.6, passepartout: -13, guide: -11.6 };
const HIDDEN = { cromarty: 'crouch_hide', fogg: 'crouch_hide', passepartout: 'kneel_up', guide: 'kneel_up' };
// where the drums are heard from — and the torches first seen
const DRUMS = [-30, 12, 1.4];

// the pyre on the clearing (its top a plane they stand on, its stepped end the way down), the crowd kneeling round it,
// Fogg held back by Cromarty at the clearing's edge, the way to the trees
const PYRE = [40, 14], ON_PYRE = { aouda: [40.5, 14.05], passepartout: [39.4, 13.95] };
const KINDLE = { pr1: [[38.9, 12.9], [39.2, 13.5, 0.9]], pr2: [[41.3, 12.9], [41.0, 13.5, 0.9]] };
const EDGE = { fogg: [35.6, 8.3], cromarty: [34.9, 8.0] };
const CROWD = [[37.2, 11.2], [38.8, 10.6], [40.4, 10.3], [42.0, 10.7], [43.4, 11.4], [36.0, 12.4], [44.6, 12.6], [41.2, 9.3]];
const CROWD_IDS = CROWD.map((_, i) => `v${i + 1}`);
const WAY = [ON_PYRE.passepartout, [37.4, 14.0], [36.2, 14.0], [35.0, 12.0], [32.2, 9.4]];
// the raja's body on the pyre — Passepartout under the shroud: a white robe over him, his head covered
const SHROUD = { garment: 'robe', hood: true, colors: { garment: '#e4dccb', top: '#e4dccb', skin: '#7e5640' } };
// the crowd at the pyre: face down, or looking up (each a little after the one before)
const crowdDo = (i, up) => loop(up ? 'kneel_up' : 'prostrate', i * 0.7);

// The «raja» carrying the widow from the pyre to the trees as far as `walk` (0…1) says: the way's point there, and the
// way to it from where he stands now (its corners between).
const segs = WAY.slice(1).map((q, i) => Math.hypot(q[0] - WAY[i][0], q[1] - WAY[i][1])), wayLen = segs.reduce((a, b) => a + b, 0);
function along(v) {
  let s = anim.clamp(v, 0, 1) * wayLen;
  for (let i = 0; i < segs.length; i++) {
    if (s <= segs[i] || i === segs.length - 1) { const f = Math.min(1, s / segs[i]); return [WAY[i][0] + (WAY[i + 1][0] - WAY[i][0]) * f, WAY[i][1] + (WAY[i + 1][1] - WAY[i][1]) * f]; }
    s -= segs[i];
  }
}
// where along the way (0…1) a point is: the nearest point of the way
function wayAt([a, d]) {
  let best = 0, bestD = Infinity, s0 = 0;
  for (let i = 0; i < segs.length; i++) {
    const [x0, y0] = WAY[i], [x1, y1] = WAY[i + 1], dx = x1 - x0, dy = y1 - y0;
    const f = anim.clamp(((a - x0) * dx + (d - y0) * dy) / (segs[i] * segs[i]), 0, 1), dd = Math.hypot(x0 + dx * f - a, y0 + dy * f - d);
    if (dd < bestD) { bestD = dd; best = (s0 + f * segs[i]) / wayLen; }
    s0 += segs[i];
  }
  return best;
}
function carry(scene, v) {
  const a0 = scene.get('passepartout_a'), d0 = scene.get('passepartout_d');
  if (typeof v !== 'number' || typeof a0 !== 'number') return null;
  const [a, d] = along(v);
  if (Math.hypot(a - a0, d - d0) < 0.3) return null;
  const u0 = wayAt([a0, d0]), pts = [];
  let s = 0;
  for (let i = 0; i < segs.length; i++) {
    s += segs[i];
    const u = s / wayLen;
    if (v > u0 ? u > u0 && u < v : u < u0 && u > v) pts.push(WAY[i + 1]);
  }
  if (v < u0) pts.reverse();
  pts.push([a, d]);
  return scene.person('passepartout').walk(pts);
}

// ── where the beats begin ──
const OFF = id => ({ [`${id}_a`]: -80, [`${id}_d`]: trail(-80), [`${id}_here`]: false, [`${id}_do`]: 'stand', [`${id}_turn`]: 90,
  [`${id}_look`]: null, [`${id}_reach`]: null, [`${id}_with`]: null, [`${id}_wear`]: null, [`${id}_on`]: null, [`${id}_gait`]: null });
// dusk on the trail: the four coming along it from the left; the column not come yet, nobody at the pyre
const START = () => ({
  day: 0.35, dawn: 0.5, procession: 0, torches: 0, pyre_fire: 0, smoke: 0, heads: 1, walk: 0, camera_x: -5, camera_z: 0.8, camera_h: 0,
  ...Object.assign({}, ...COLUMN.map(([id]) => OFF(id)), ...PARTY.map(OFF), ...CROWD_IDS.map(OFF)), ...COLUMN_STATE,
  ...Object.fromEntries(PARTY.flatMap(id => [[`${id}_a`, FROM[id]], [`${id}_d`, trail(FROM[id])], [`${id}_here`, true]])),
});
// night: the four hidden in the thicket; the column coming along the trail from the left, its torches lit
const NIGHT = () => ({
  ...START(), day: 0.15, procession: COMING, ...column(COMING), camera_x: -2.6, camera_z: 3.6, camera_h: -0.4,
  ...Object.fromEntries(PARTY.flatMap((id, i) => [[`${id}_a`, HIDE[id][0]], [`${id}_d`, HIDE[id][1]], [`${id}_turn`, 0],
    [`${id}_do`, loop(HIDDEN[id], i * 1.3)], [`${id}_look`, DRUMS]])),
});
// dawn on the clearing: the pyre — the widow lying on it beside the shrouded body; the priests with their torches, the
// crowd kneeling; Fogg and Cromarty at the clearing's edge
const DAWN = () => ({
  ...START(), day: 0.3, dawn: 1, torches: 1, smoke: 0.3, camera_x: 42, camera_z: 0, camera_h: 0, heads: 1,
  ...Object.assign({}, ...COLUMN.map(([id]) => OFF(id)), ...PARTY.map(OFF)),
  aouda_a: ON_PYRE.aouda[0], aouda_d: ON_PYRE.aouda[1], aouda_here: true, aouda_do: loop('lie_limp'), aouda_turn: 90, aouda_wear: { hood: true },
  passepartout_a: ON_PYRE.passepartout[0], passepartout_d: ON_PYRE.passepartout[1], passepartout_here: true,
  passepartout_do: loop('lie_limp', 3.1), passepartout_turn: 270, passepartout_wear: SHROUD,
  ...Object.fromEntries(['pr1', 'pr2'].flatMap((id, i) => { const at = [KINDLE[id][0][0] - 2.4 + 4.8 * i, 11.6]; return [[`${id}_a`, at[0]], [`${id}_d`, at[1]],
    [`${id}_here`, true], [`${id}_with`, ['torch']], [`${id}_turn`, toward(at, PYRE)], [`${id}_gait`, 'priest_walk']]; })),
  ...Object.fromEntries(['fogg', 'cromarty'].flatMap(id => [[`${id}_a`, EDGE[id][0]], [`${id}_d`, EDGE[id][1]], [`${id}_here`, true],
    [`${id}_turn`, toward(EDGE[id], PYRE)], [`${id}_look`, 'pyre']])),
  ...Object.fromEntries(CROWD_IDS.flatMap((id, i) => [[`${id}_a`, CROWD[i][0]], [`${id}_d`, CROWD[i][1]], [`${id}_here`, true],
    [`${id}_turn`, toward(CROWD[i], PYRE)], [`${id}_do`, loop('kneel_up', i * 0.9)]])),
});
// the pyre burning: the priests by it, Fogg straining, held back
const LIT = () => ({
  ...DAWN(), smoke: 0.7, pyre_fire: 0.85, camera_x: 37, camera_z: 4.5, camera_h: -0.3,
  ...Object.fromEntries(['pr1', 'pr2'].flatMap(id => [[`${id}_a`, KINDLE[id][0][0]], [`${id}_d`, KINDLE[id][0][1]], [`${id}_turn`, toward(KINDLE[id][0], PYRE)],
    [`${id}_look`, KINDLE[id][1]]])),
  fogg_do: loop('strain'), fogg_look: 'aouda#head', cromarty_reach: { r: 'fogg#shoulder_r', l: 'fogg#shoulder_l' }, cromarty_look: 'fogg#head',
});
// the «raja» risen in the smoke, the widow in his arms, the crowd on its face (the shot low and close on the pyre)
const RISEN = { passepartout_do: loop('carry_stand'), passepartout_turn: 225, aouda_on: { at: 'passepartout#hands', up: -0.08 },
  aouda_do: loop('lie_limp'), aouda_turn: 90, camera_x: 39.8, camera_z: 8.6, camera_h: -0.5 };
const ROSE = () => ({
  ...LIT(), ...RISEN, smoke: 0.6, heads: 0, ...Object.fromEntries(CROWD_IDS.map((id, i) => [`${id}_do`, crowdDo(i, false)])),
  pr1_do: loop('prostrate'), pr2_do: loop('prostrate'), fogg_do: 'stand', cromarty_reach: null,
  fogg_look: 'passepartout#head', cromarty_look: 'passepartout#head',
});

// Each beat ends in a living pose; whatever a beat waits for is something happening (someone arriving, coming into
// view), time only where it truly is — a held breath.
const FILM = {
  // ---- Dusk. The four come along the trail; the guide hears the drums far off: they leave the trail and hide in the
  // thicket, crouching, facing it.
  drums: { from: START, run: async s => {
    s.move('day', 0.15, { over: 8, ease: 'linear' });
    const on = [];
    for (const id of PARTY) { on.push(s.person(id).walk([[FROM[id] + 5.5, trail(FROM[id] + 5.5)]])); await s.wait(0.3); }
    await s.all(...on);
    s.tell('drums:heard');
    s.person('guide').turn(270);
    s.set('guide_look', DRUMS);
    await s.wait(0.5);
    s.set('cromarty_look', 'guide#head');
    await s.wait(0.8);
    const hide = PARTY.map((id, i) => s.sequence(async q => {
      await q.wait(0.25 * i);
      const p = q.person(id);
      await p.walk([HIDE[id]]);
      await p.turn(0);
      p.do(HIDDEN[id], { loop: true, from: i * 1.3 });
      q.set(`${id}_look`, DRUMS);
    }));
    await s.all(...hide);
    s.tell('drums:hidden');
    await s.wait(1.5);
  } },
  // ---- Night (a cut: closer, over the shoulders of the hidden four). Along the trail from the left: torches, drums,
  // priests, the widow led by the arms, staggering. The column stops before them (and holds, under the choice).
  procession: { from: NIGHT, run: async s => {
    s.move('day', 0, { over: 2 });
    s.move('torches', 1, { over: 1.5 });
    s.set('procession', STOPPED);
    await s.until(() => s.state.pb1_a > -9);
    s.tell('procession:torches');
    for (const [i, id] of PARTY.entries()) s.after(0.4 * i, () => s.set(`${id}_look`, 'pb1#head'));
    await s.until(() => s.state.aouda_a > -7);
    s.tell('procession:widow');
    for (const [i, id] of PARTY.entries()) s.after(0.5 * i, () => s.set(`${id}_look`, 'aouda#head'));
    await s.until(() => COLUMN.every(([id]) => Math.hypot(s.state[`${id}_a`] - inColumn(STOPPED, id)[0], s.state[`${id}_d`] - inColumn(STOPPED, id)[1]) < 0.3));
    s.tell('procession:stopped');
    s.set('passepartout_look', 'fogg#head');
    await s.wait(0.9);
    s.set('fogg_look', 'cromarty#head');
    await s.wait(1.1);
    s.set('fogg_look', 'aouda#head');
    await s.wait(1);
  } },
  // ---- Dawn on the clearing. The pyre: the raja's body and the widow on it; the crowd on their knees round it; the
  // priests set their torches to it. Fogg strains forward — Cromarty holds him back.
  pyre: { from: DAWN, run: async s => {
    s.move('smoke', 0.7, { over: 6 });
    const kindle = ['pr1', 'pr2'].map((id, i) => s.sequence(async q => {
      await q.wait(0.4 + 0.5 * i);
      const p = q.person(id);
      await p.walk([KINDLE[id][0]]);
      await p.turn(toward(KINDLE[id][0], PYRE));
      q.set(`${id}_look`, KINDLE[id][1]);
      q.set(`${id}_reach`, { r: KINDLE[id][1] });
    }));
    await s.wait(1.8);
    s.person('fogg').do('strain', { loop: true });
    await s.wait(0.2);
    s.set('cromarty_reach', { r: 'fogg#shoulder_r', l: 'fogg#shoulder_l' });
    s.set('cromarty_look', 'fogg#head');
    s.set('fogg_look', 'aouda#head');
    await s.all(...kindle);
    await s.wait(0.6);
    s.tell('pyre:kindled');
    const fire = s.move('pyre_fire', 0.85, { over: 5, ease: 'in' });
    s.move('camera_x', 37, { over: 4, ease: 'inOut' });
    s.move('camera_z', 4.5, { over: 4, ease: 'inOut' });
    s.move('camera_h', -0.3, { over: 4, ease: 'inOut' });
    await s.wait(2.4);
    s.set('pr1_reach', null);
    await s.wait(0.4);
    s.set('pr2_reach', null);
    await fire;
    await s.wait(1.5);
  } },
  // ---- The dead raja rises out of the smoke with the widow in his arms; the crowd falls on its face.
  rise: { after: 'pyre', from: LIT, run: async s => {
    const shot = s.shot({ ...RISEN });
    s.move('camera_x', 39.5, { over: 1.6, ease: 'inOut' });
    s.move('camera_z', 7.5, { over: 1.6, ease: 'inOut' });
    await s.move('smoke', 1, { over: 1.6 });
    await s.until(() => shot.ready);
    shot.cut();
    s.tell('rise:risen');
    await s.wait(0.6);
    s.set('heads', 0);
    s.after(0.4, () => s.set('pr1_do', loop('prostrate')));
    s.after(0.7, () => s.set('pr2_do', loop('prostrate')));
    await s.wait(0.8);
    s.set('fogg_do', 'stand');
    s.set('cromarty_reach', null);
    await s.wait(0.4);
    s.set('fogg_look', 'passepartout#head');
    await s.wait(0.4);
    s.set('cromarty_look', 'passepartout#head');
    await s.move('smoke', 0.6, { over: 4 });
  } },
  // ---- (the game's «Like the dead»: `walk`, `heads`, `smoke`) He carries her down from the pyre and across the clearing
  // toward the trees, as stiffly as the dead; the crowd lifts its heads; the smoke thins.
  walk: { after: 'rise', from: ROSE, run: async s => {
    s.set('passepartout_gait', 'carry_walk');
    // the camera back from the pyre to see him come down and away across the clearing
    s.move('camera_x', 36, { over: 3, ease: 'inOut' });
    s.move('camera_z', 2.5, { over: 3, ease: 'inOut' });
    s.move('camera_h', -0.2, { over: 3, ease: 'inOut' });
    s.set('walk', 1);
    await s.until(() => s.state.passepartout_a < 36.5);
    s.tell('walk:down');
    s.set('heads', 1);
    s.move('smoke', 0.25, { over: 8 });
    await s.until(() => s.state.passepartout_a < 34.5);
    s.set('fogg_look', null);
    const fogg = s.person('fogg');
    await fogg.walk([[34.2, 9.0]]);
    fogg.turn(toward([34.2, 9.0], WAY.at(-1)));
    await s.until(() => wayAt([s.state.passepartout_a, s.state.passepartout_d]) > 0.97);
    s.tell('walk:away');
    await s.wait(1.5);
  } },
};
const SHOWCASE = ['drums', 'procession', 'pyre', 'rise', 'walk'];

return {
  plan, trail, columnHead, stream, bank, mixc, rgba, glow, ground, shoreline, ramp,
  TREES, PALMS, BAMBOO, LOW, SHORE, NEAR_TRUNKS, NEAR_LOW, LIANAS, plantLayer,
  trunk, crown, figWood, figCrown, bamboo, palm, frond, fern, broadleaf, liana, stone, towerFace, thatch, mistBank,
  KI, TRUNK, kiouniPaint, kiouniMove, gaudaPaint, KIOUNI_SEATS, seat,
  COLUMN, CROWD_IDS, crowdDo, march, carry, inColumn, START, FILM, SHOWCASE, FLAMES, flamePaint, flameMotion,
};
