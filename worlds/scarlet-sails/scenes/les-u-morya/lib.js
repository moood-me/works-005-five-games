// The wood by the sea: its land (the relief reads it), the stream, where everything stands — the trees,
// the stones, the glade's grass, the undergrowth, the mist's banks (each chosen once, the same every time) —, what
// they are painted as, the sky's sun and moon, the bank Assol runs down after her yacht, and the film in beats
// (film(scene): the world's module beats).
// World metres: X to the right, Z ahead (east, to the sea), heights from the forest floor where the viewer starts.
// Everything is painted once, in daylight; the hour is the scene's light (light.looks, the sun and the moon) and the
// world's sky (kit.nebo); what moves is moved by the engine (layers' wind and drift, animate, particles).
// tools/les-u-morya.js (the world's repository) reads the lists here and writes the elements that stand one by one
// (crown_…, grass_…, tuft_…, mist_…, spray_…) into scene.json — run it after changing them.
const HORIZON = 0.45;
const SEA = -3;
const { clamp, mix, span } = anim;
const smooth = anim.ease.smooth;

// A smooth line through points [a, b] along a (Catmull–Rom): b at a
function curve(points, a) {
  const n = points.length;
  if (a <= points[0][0]) return points[0][1];
  if (a >= points[n - 1][0]) return points[n - 1][1];
  let i = 0;
  while (points[i + 1][0] < a) i++;
  const p0 = points[Math.max(0, i - 1)][1];
  const p1 = points[i][1];
  const p2 = points[i + 1][1];
  const p3 = points[Math.min(n - 1, i + 2)][1];
  const t = (a - points[i][0]) / (points[i + 1][0] - points[i][0]);
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * (2 * p1 + (p2 - p0) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (3 * p1 - p0 - 3 * p2 + p3) * t3);
}

// ── the stream ──
// It comes from behind the viewer (out of the wood, 46 m back) and steps down through the wood from pool to pool, over stones,
// to the beach, and fans out over the sand into the sea. [Z, X] of its middle; half its width.
// Its pools — [from Z, to Z, the water's level] — and between them, falls over stones.
const COURSE = [[-46, 5.0], [-25, 3.6], [-6, 3.0], [0, 2.4], [5, 1.3], [10, 1.7], [15, 0.8], [20, 1.4], [24, 2.6], [29, 3.2], [33, 3.4], [38, 3.0], [44, 2.0], [50, 1.0]];
const streamX = (Z) => curve(COURSE, Z);
// (wider in its pools, narrow over the falls, never quite even)
function halfWidth(Z) {
  if (Z >= 32) return mix(1.2, 9, smooth(span(Z, 32, 46)));
  const pool = POOLS.reduce((k, [a, b]) => Math.max(k, Math.sin(Math.PI * clamp((Z - a) / (b - a), 0, 1))), 0);
  return mix(0.75, 1.15, span(Z, 0, 30)) * (0.8 + 0.45 * pool + 0.12 * anim.noise(Z * 0.45, 3));
}
const POOLS = [[-6, 8.6, -0.35], [10, 18.6, -1.05], [20, 26.4, -1.9]];
// (below its last fall it is the sea's own water, come up over the sand)
const MOUTH_WATER = SEA;
const FALLS = [[8.6, 10], [18.6, 20], [26.4, 32]];
function water(Z) {
  const levels = [...POOLS.map((p) => p[2]), MOUTH_WATER];
  for (let i = 0; i < FALLS.length; i++) {
    if (Z < FALLS[i][0]) return levels[i];
    if (Z < FALLS[i][1]) return mix(levels[i], levels[i + 1], smooth(span(Z, ...FALLS[i])));
  }
  return MOUTH_WATER;
}

// ── the land ──
// The wood's floor steps down toward the sea with the stream — terraces at 0, −0.7 and −1.55 m —
// rising a little to the left; then it falls to the beach (Z 26…32), and the beach slopes into the
// water (the shore near Z 40).
const STEPS = [[8, 10, -0.7], [18, 20, -0.85], [26, 32, -1.0]];
function floorAt(Z) {
  let h = 0;
  for (const [a, b, drop] of STEPS) h += drop * smooth(span(Z, a, b));
  return Z > 32 ? Math.min(h, beach(Z)) : h;
}
const wood = (X) => Math.min(2.5, 0.06 * Math.max(0, -X - 3));
const beach = (Z) => SEA + 0.45 - 0.08 * (Z - 34);
const lowland = (X, Z) => floorAt(Z) + wood(X) * (1 - smooth(span(Z, 26, 34)));

// The headland on the right, in the relief: from the wood the land rises gently to its top, TOP high
// (the glade), and over the cove and the sea it drops sheer. Its own axes — as the scene's
// `headland` (an unseen anchor on its top) turns: a (across: along its edge, + toward the start) and
// b (distance: inland from its edge). Its edge is b = EDGE: sheer from its end in the sea (a = END)
// to the beach's end (a = RISE); farther toward the wood its side goes down to the stream's valley as
// a steep wooded bank (`side`, BANK degrees). Its top is flat from a = CAPE to RISE, goes down gently toward the sea beyond CAPE
// and toward the wood beyond RISE. The cliff's face (`cliff_face`) stands on the edge.
const HEAD = { x: 25.94, z: 41.98, facing: 278.76, edge: -8, end: -52.4, cape: -9, fall: 14.2, rise: 9, slope: 16, bank: 35, foot: -3.3 };
const TOP = 10;
const HA = [-Math.cos((HEAD.facing * Math.PI) / 180), Math.sin((HEAD.facing * Math.PI) / 180)];
const HB = [-HA[1], HA[0]];
const headFrame = (X, Z) => ({
  a: (X - HEAD.x) * HA[0] + (Z - HEAD.z) * HA[1],
  b: (X - HEAD.x) * HB[0] + (Z - HEAD.z) * HB[1],
});
const headWorld = (a, b) => [HEAD.x + a * HA[0] + b * HB[0], HEAD.z + a * HA[1] + b * HB[1]];
const tan = (deg) => Math.tan((deg * Math.PI) / 180);
const headTop = (a) => TOP - Math.max(0, a - HEAD.rise) * tan(HEAD.slope) - Math.max(0, HEAD.cape - a) * tan(HEAD.fall);
// how far its edge at a is a slope rather than sheer (0 — the cliff, 1 — the wooded side)
const side = (a) => smooth(span(a, HEAD.rise + 6, HEAD.rise + 16));
function headland(X, Z) {
  const { a, b } = headFrame(X, Z);
  if (a < HEAD.end) return -Infinity;
  if (b >= HEAD.edge) return headTop(a);
  const k = side(a);
  return k > 0 ? headTop(a) - ((HEAD.edge - b) * tan(HEAD.bank)) / k : -Infinity;
}
// where its top comes down to the wood's floor along its edge (a)
function headFoot() {
  let lo = HEAD.rise;
  let hi = HEAD.rise + 60;
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2;
    if (headTop(mid) > lowland(...headWorld(mid, HEAD.edge))) lo = mid;
    else hi = mid;
  }
  return lo;
}
const land = (X, Z) => Math.max(lowland(X, Z), headland(X, Z));
// the stream's bed: below its water in the middle, its banks rising over it; beyond them the land
function bed(X, Z) {
  const d = Math.abs(X - streamX(Z));
  const w = halfWidth(Z);
  if (Z < FALLS[2][1]) return d > w + 0.9 ? Infinity : water(Z) - 0.25 + 0.7 * smooth(span(d, 0.3 * w, w + 0.9));
  return d > w + 3 ? Infinity : MOUTH_WATER - 0.08 + 0.6 * smooth(span(d, 0.7 * w, w + 3));
}
const ground = (X, Z) => Math.min(land(X, Z), bed(X, Z));

// The glade on the headland's top, by its own axes: from the cliff's edge inland, along it over the
// mouth.
const GLADE = { a0: -7, a1: 9, b0: HEAD.edge, b1: 10 };

// ── what stands ──
// Trees: [X, Z, height, kind (0 a birch, 1 a pine), seed] — the wood on both banks, thinning toward
// the beach, keeping the stream's way to the sea open; on the headland's slope and behind the glade.
// Not in the water, on the sand, by the cliff's edge or on the glade.
// A tree is one of a few shapes of its kind (SHAPES: so many birches, so many pines) — its height and the seed its
// trunk and crown are painted by: `pick` 0…1 chooses, the low ones first. Trees of one shape paint the same calls in
// the same boxes, and the engine holds such paintings once (its virtual texture: one content, one block of its page
// table) — a tree of its own each asked for more of that table than there is.
const SHAPES = [16, 8];
const shape = (kind, pick) => {
  const k = Math.min(SHAPES[kind] - 1, Math.floor(pick * SHAPES[kind]));
  return [11 + (7 * (k + 0.5)) / SHAPES[kind], kind, 9000 + 100 * kind + k];
};
const TREES = [
  [5.4, 7.4, ...shape(0, 0.65)], [8.8, 13.6, ...shape(0, 0.8)], [6.6, 19.8, ...shape(0, 0.45)], [11.2, 17.5, ...shape(1, 0.3)],
];
for (let i = 0; i < 1400 && TREES.length < 170; i++) {
  const X = -46 + anim.hash(i, 31) * 110;
  const Z = 1.5 + Math.pow(anim.hash(i, 32), 0.8) * 62;
  const g = ground(X, Z);
  const d = Math.abs(X - streamX(Z));
  const { a, b } = headFrame(X, Z);
  const head = headland(X, Z) > lowland(X, Z);
  if (g < SEA + 0.6 || d < halfWidth(Z) + 2.2 + Z * 0.12) continue;
  const sheer = a > HEAD.end && side(a) < 0.5;
  if (head ? (b < HEAD.edge + 2.5 && sheer) || (a < HEAD.rise + 2 && b < GLADE.b1 + 4) : Z > 26 || (b > HEAD.edge - 3 && sheer)) continue;
  if (TREES.some(([x, z]) => Math.hypot(x - X, z - Z) < 2.6)) continue;
  TREES.push([X, Z, ...shape(anim.hash(i, 34) < 0.75 ? 0 : 1, anim.hash(i, 33))]);
}
// and the headland's slope down into the wood, wooded thick
for (let i = 0; i < 500; i++) {
  const a = HEAD.rise + 2 + anim.hash(i, 35) * (headFoot() - HEAD.rise - 2);
  const b = HEAD.edge - 12 + anim.hash(i, 36) * 42;
  const [X, Z] = headWorld(a, b);
  if (headland(X, Z) <= lowland(X, Z) || TREES.some(([x, z]) => Math.hypot(x - X, z - Z) < 2.4)) continue;
  TREES.push([X, Z, ...shape(anim.hash(i, 38) < 0.7 ? 0 : 1, anim.hash(i, 37))]);
}
// and the wood behind the start, as far back as the land is laid: seen from the glade, looking back over the stream
for (let i = 0, n = 0; i < 500 && n < 70; i++) {
  const X = -46 + anim.hash(i, 71) * 110;
  const Z = -34 + anim.hash(i, 72) * 35;
  if (Math.abs(X - streamX(Z)) < halfWidth(Z) + 2.2 || headland(X, Z) > lowland(X, Z)) continue;
  if (TREES.some(([x, z]) => Math.hypot(x - X, z - Z) < 2.6)) continue;
  TREES.push([X, Z, ...shape(anim.hash(i, 74) < 0.75 ? 0 : 1, anim.hash(i, 73))]);
  n++;
}
// Stones: [X, Z, radius, seed] — in the stream and along its banks, more of them on the fall
const STONES = [];
for (let i = 0; i < 110; i++) {
  const Z = -3 + anim.hash(i, 41) * 37;
  const fall = FALLS.some(([a, b]) => Z > a - 1 && Z < b + 0.5);
  const across = (anim.hash(i, 42) - 0.5) * 2 * (halfWidth(Z) + (fall ? 0.4 : 1.2));
  STONES.push([streamX(Z) + across, Z, (fall ? 0.22 : 0.07) + anim.hash(i, 43) ** 2 * (fall ? 0.35 : 0.2), i]);
}
// and at each fall's lip, boulders the water goes round and over
FALLS.forEach(([a], j) => {
  for (let k = 0; k < 4; k++) {
    const u = k / 3 - 0.5;
    const n = 500 + j * 4 + k;
    STONES.push([streamX(a) + u * 2.3 * halfWidth(a) + (anim.hash(n, 44) - 0.5) * 0.3, a + 0.1 + anim.hash(n, 45) * 0.3, 0.3 + 0.18 * anim.hash(n, 46), n]);
  }
});

// The land's colours, in daylight: the wood's floor (deeper, paler toward the sea), the meadow
const FLOOR = ["#b4b9b0", "#bfc3ba"];
const MEADOW = "#c5c9ba";

// ── painting the land, seen from above ── (a plane centred at (cx, cz): x across, y toward the eye)
// The wood's floor, the stream's banks and bed, the sand, the headland's meadow, as far as the sea.
function shoreZ(X) {
  for (let Z = 26; Z < 110; Z += 0.25) if (land(X, Z) < SEA) return Z;
  return 110;
}
// A draped plane's land painted, seen from above: centred at (cx, cz), w × d metres. Painted in world
// metres: u = X − cx, v = cz − Z.
function landPainting(g, cx, cz, w, d) {
  const to = (X, Z) => [X - cx, cz - Z];
  const [X0, X1, Z0, Z1] = [cx - w / 2, cx + w / 2, cz - d / 2, cz + d / 2];
  g.save();
  // what is above the sea
  g.beginPath();
  g.moveTo(...to(X0, Z0));
  g.lineTo(...to(X1, Z0));
  for (let X = X1; X >= X0; X -= 0.5) g.lineTo(...to(X, Math.min(shoreZ(X), Z1)));
  g.closePath();
  g.clip();
  // the wood's floor, paler toward the light of the sea, with soft patches of moss and old leaves
  const floor = g.createLinearGradient(0, cz, 0, cz - 30);
  floor.addColorStop(0, FLOOR[0]);
  floor.addColorStop(1, FLOOR[1]);
  g.fillStyle = floor;
  g.fillRect(X0 - cx, cz - Z1, X1 - X0, Z1 - Z0);
  for (let iz = Math.floor(Z0 / 2.5); iz <= Z1 / 2.5; iz++) {
    for (let ix = Math.floor(X0 / 2.5); ix <= X1 / 2.5; ix++) {
      const n = ix * 1009 + iz * 31;
      const [x, y] = to(ix * 2.5 + anim.hash(n, 51) * 2.5, iz * 2.5 + anim.hash(n, 52) * 2.5);
      const rr = 0.4 + 1.1 * anim.hash(n, 53);
      g.fillStyle = anim.hash(n, 54) < 0.5 ? "rgba(150,160,146,0.16)" : "rgba(205,206,194,0.14)";
      g.beginPath();
      g.ellipse(x, y, rr, rr * (0.3 + 0.3 * anim.hash(n, 55)), anim.hash(n, 56) * 3, 0, 7);
      g.fill();
    }
  }
  // the beach: from the wood's edge to the water, damp at the water (not on the headland: its top
  // is painted over it below)
  const sand = (S) => {
    g.beginPath();
    g.moveTo(...to(X0, 90));
    for (let X = X0; X <= X1; X += 0.5) g.lineTo(...to(X, S + 1.2 * Math.sin(X * 0.23) + 0.6 * Math.sin(X * 0.61)));
    g.lineTo(...to(X1, 90));
    g.closePath();
  };
  sand(31.5);
  g.fillStyle = "#d8d6cd";
  g.fill();
  sand(30.8);
  g.globalAlpha = 0.5;
  g.fill();
  g.globalAlpha = 1;
  // the headland's top: the meadow from its edge inland, paler on the glade by the edge, giving way
  // to the wood's floor down its slope toward the wood and to bare stone toward its end in the sea
  const head = (a0, a1) => {
    g.beginPath();
    [[a0, HEAD.edge], [a1, HEAD.edge], [a1, 120], [a0, 120]].forEach((p, i) => (i ? g.lineTo(...to(...headWorld(...p))) : g.moveTo(...to(...headWorld(...p)))));
    g.closePath();
  };
  const alongA = (a0, a1, stops) => {
    const gr = g.createLinearGradient(...to(...headWorld(a0, 0)), ...to(...headWorld(a1, 0)));
    stops.forEach(([u, c]) => gr.addColorStop(u, c));
    return gr;
  };
  head(HEAD.end, HEAD.rise + 14);
  g.fillStyle = alongA(HEAD.end, HEAD.rise + 14, [[0, "#d3d1c8"], [0.25, MEADOW], [0.8, MEADOW], [1, "rgba(197,201,186,0)"]]);
  g.fill();
  const gl = g.createLinearGradient(...to(...headWorld(0, HEAD.edge)), ...to(...headWorld(0, GLADE.b1 + 6)));
  gl.addColorStop(0, "#d3d5c6");
  gl.addColorStop(1, "rgba(211,213,198,0)");
  head(GLADE.a0 - 4, GLADE.a1 + 4);
  g.fillStyle = gl;
  g.fill();
  // along the stream: its bed of pale pebbles just past the water, moss soft on its banks
  const band = (left, right) => {
    g.beginPath();
    left.forEach(([X, Z], i) => (i ? g.lineTo(...to(X, Z)) : g.moveTo(...to(X, Z))));
    right.reverse().forEach(([X, Z]) => g.lineTo(...to(X, Z)));
    g.closePath();
  };
  const along = (off, extra, wave, S0, S1) => {
    const pts = [];
    for (let Z = S0; Z <= S1; Z += 0.5) pts.push([streamX(Z) + off * (halfWidth(Z) + extra + wave * (1 + anim.noise(Z * 0.37, off + 7))), Z]);
    return pts;
  };
  g.fillStyle = "rgba(160,170,152,0.45)";
  band(along(-1, 0.6, 0.8, -46, 31), along(1, 0.6, 0.8, -46, 31));
  g.fill();
  g.fillStyle = "#c2c3bb";
  band(along(-1, 0.1, 0.2, -46, 35), along(1, 0.1, 0.2, -46, 35));
  g.fill();
  g.restore();
}

// The stream's water seen from above, on a plane centred at (cx, cz), from Z0 to Z1: wherever the
// land under it is below its level
function edge(Z, level, side) {
  let lo = 0;
  let hi = halfWidth(Z) + 4;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (ground(streamX(Z) + side * mid, Z) < level) lo = mid;
    else hi = mid;
  }
  return streamX(Z) + side * lo;
}
function streamPainting(g, cx, cz, Z0, Z1, level, colour) {
  const to = (X, Z) => [X - cx, cz - Z];
  g.fillStyle = colour;
  g.beginPath();
  for (let Z = Z0; Z <= Z1; Z += 0.25) g.lineTo(...to(edge(Z, level, -1), Z));
  for (let Z = Z1; Z >= Z0; Z -= 0.25) g.lineTo(...to(edge(Z, level, 1), Z));
  g.closePath();
  g.fill();
}

// ── what grows, each where it stands ──
// The glade's grass: cards of knee-high blades over the headland's top, from the cliff's edge inland — [a, b, seed]
// by the headland's axes (a along the edge, b inland), each GRASS_W wide, thinning out inland.
const GRASS_W = 2.5;
const GRASS = [];
for (let a = GLADE.a0, r = 0; a <= GLADE.a1; a += 0.9, r++) {
  for (let s = 0; s < 8; s++) {
    const b0 = HEAD.edge + 0.1 + s * GRASS_W;
    if (b0 <= GLADE.b1 + 2) GRASS.push([a, b0 + GRASS_W / 2, r * 1000 + s * 50]);
  }
}
// The undergrowth on the wood's floor near the viewer and along the stream — tufts of grass, small ferns:
// [X, Z, size, fern, seed]
const UNDER = [];
for (let i = 0; i < 70; i++) {
  const Z = 0.8 + anim.hash(i, 61) * 24;
  const X = -14 + anim.hash(i, 62) * 26;
  const d = Math.abs(X - streamX(Z)) - halfWidth(Z);
  if (d < 0.3 || (d > 4 && anim.hash(i, 63) < 0.5) || (Math.abs(X) < 0.8 && Z < 2.5)) continue;
  UNDER.push([X, Z, 0.25 + 0.35 * anim.hash(i, 65), anim.hash(i, 64) < 0.35, i]);
}
// The mist's banks: [Z, X, half-width, height, metres a second along the shore] — among the trees, over the stream's
// lower pools, the cove and the sea; each lies on the land there, or on the sea
const MIST = [[12, -6, 22], [18, 8, 26], [26, -2, 34], [34, 4, 40], [48, -10, 60], [90, 10, 120], [200, -40, 260]].map(([Z, X, w], i) => [
  Z, X, w, 1.2 + 2.4 * anim.hash(i, 4), (i % 2 ? -1 : 1) * (0.25 + 0.2 * anim.hash(i, 2)) * (w / 60),
]);
const mistFoot = (i) => Math.max(ground(MIST[i][1], MIST[i][0]), SEA);
// The falls' white water: where the stream bends over each lip — [X, Z, half-width, the water's height over its bed]
const SPRAY = [];
for (const [a, b] of FALLS) {
  for (let Z = a + 0.2; Z < b; Z += 1.3) SPRAY.push([streamX(Z), Z, halfWidth(Z) * 1.05, water(Z) - ground(streamX(Z), Z)]);
}

// ── what they are painted as (in daylight; metres; a plant's foot at (0, 0), up is −y) ──
const LEAF = ["#c6cdbd", "#b5bdab", "#d5dacd"];
const NEEDLE = ["#97a596", "#8a998b", "#a5b0a2"];
function stem(g, H, r, top, light, shade) {
  g.fillStyle = light;
  g.beginPath();
  g.moveTo(-r, 0.05);
  g.lineTo(-top, -H);
  g.lineTo(top, -H);
  g.lineTo(r, 0.05);
  g.fill();
  g.fillStyle = shade;
  g.beginPath();
  g.moveTo(r * 0.25, 0.05);
  g.lineTo(top * 0.25, -H);
  g.lineTo(top, -H);
  g.lineTo(r, 0.05);
  g.fill();
}
// A tree's trunk — [X, Z, H, kind, n] of TREES: a birch's, tall, slender and pale, its dark marks denser and rougher
// toward the foot; a pine's, warm grey
function trunk(g, [, , H, kind, n]) {
  if (kind) {
    stem(g, H, 0.13 + 0.05 * anim.hash(n, 1), 0.04, "#b4aca0", "#9f978b");
    return;
  }
  const r = 0.09 + 0.05 * anim.hash(n, 1);
  stem(g, H * 0.97, r, 0.02, "#e6e7e3", "#cfd2ce");
  g.fillStyle = "#6f726d";
  for (let i = 0; i < 16; i++) {
    const k = anim.hash(n * 16 + i, 2);
    const y = -0.15 - k * k * H * 0.7;
    const half = r * (1 + y / H) * (0.25 + 0.5 * anim.hash(n * 16 + i, 3));
    g.fillRect(-half + (anim.hash(n * 16 + i, 4) - 0.5) * r * 0.6, y, half * 1.4, 0.025 + 0.02 * (1 - k));
  }
  g.fillStyle = "rgba(96,100,94,0.45)";
  g.beginPath();
  g.moveTo(-r, 0.05);
  for (let i = 0; i <= 6; i++) g.lineTo(-r + (2 * r * i) / 6, -0.25 - 0.35 * anim.hash(n * 7 + i, 5));
  g.lineTo(r, 0.05);
  g.fill();
}
// a spray of leaves hanging from (x, y): small soft dabs falling along a curve
function spray(g, x, y, len, side, n) {
  g.strokeStyle = "rgba(120,120,112,0.5)";
  g.lineWidth = 0.015;
  g.beginPath();
  g.moveTo(x, y);
  g.quadraticCurveTo(x + side * len * 0.6, y - len * 0.15, x + side * len * 0.8, y + len * 0.6);
  g.stroke();
  g.globalAlpha = 0.55;
  for (let i = 0; i < 16; i++) {
    const u = i / 15;
    const px = x + side * len * (0.15 + 0.65 * u) + (anim.hash(n * 17 + i, 1) - 0.5) * 0.4;
    const py = y - len * 0.15 * Math.sin(u * Math.PI) + len * 0.6 * u * u + (anim.hash(n * 17 + i, 2) - 0.5) * 0.35;
    const s = 0.06 + 0.08 * anim.hash(n * 17 + i, 3);
    g.fillStyle = LEAF[(n + i) % 3];
    g.beginPath();
    g.ellipse(px, py, s * 1.25, s, 0.5 * side, 0, 7);
    g.fill();
  }
  g.globalAlpha = 1;
}
// a birch's crown on one side of its trunk (side −1 left, 1 right): fine branches from half its height to the top,
// sprays of small leaves hanging from them, the sky through them
function birchCrown(g, H, n, side) {
  const w = 1.4 + 0.9 * anim.hash(n, 6);
  for (let i = 0; i < 34; i++) {
    if ((anim.hash(n * 31 + i, 8) < 0.5 ? -1 : 1) !== side) continue;
    const u = anim.hash(n * 31 + i, 7);
    const y = -H * (0.5 + 0.48 * u);
    const reach = w * (0.35 + 0.65 * anim.hash(n * 31 + i, 9)) * Math.sin(Math.PI * (0.15 + 0.85 * u));
    g.strokeStyle = "#a9aaa4";
    g.lineWidth = 0.025;
    g.beginPath();
    g.moveTo(0, y + 0.6);
    g.lineTo(side * reach * 0.5, y);
    g.stroke();
    spray(g, side * reach * 0.5, y, 0.6 + 0.7 * anim.hash(n * 31 + i, 10), side, n * 31 + i);
  }
}
// a pine's crown: a few flat layers of needles high up, as the wind left them — short level strokes
function pineCrown(g, H, n) {
  g.lineCap = "round";
  for (let k = 0; k < 5; k++) {
    const y = -H * (0.66 + 0.075 * k);
    const half = (2.0 - 0.33 * k) * (0.75 + 0.4 * anim.hash(n * 5 + k, 9));
    const dx = (anim.hash(n * 5 + k, 10) - 0.5) * 0.8;
    g.strokeStyle = "#8f8a80";
    g.lineWidth = 0.05;
    g.beginPath();
    g.moveTo(0, y + 0.3);
    g.lineTo(dx + half * 0.6 * (k % 2 ? 1 : -1), y);
    g.stroke();
    g.globalAlpha = 0.6;
    g.lineWidth = 0.09;
    for (let i = 0; i < 60; i++) {
      const m = n * 300 + k * 60 + i;
      const u = (anim.hash(m, 11) - 0.5) * 2;
      const x = dx + u * half;
      const yy = y + (anim.hash(m, 13) - 0.5) * 0.55 * (1 - 0.6 * Math.abs(u));
      const len = 0.25 + 0.35 * anim.hash(m, 12);
      g.strokeStyle = NEEDLE[i % 3];
      g.beginPath();
      g.moveTo(x - len / 2, yy + 0.03);
      g.lineTo(x + len / 2, yy - 0.03);
      g.stroke();
    }
    g.globalAlpha = 1;
  }
}
// The box of tree i's crown round its foot: [left, top, right, bottom]
const crownBox = (i) => {
  const H = TREES[i][2];
  return TREES[i][3] ? [-3.5, -H - 0.6, 3.5, -H * 0.6] : [-3.3, -H - 0.4, 3.3, -H * 0.3];
};
// Tree i's crown (the code of its element crown_<i>, standing at the tree's foot): layers the wind bends about
// where the limbs leave the trunk — a birch's two sides each by itself, a pine's layers together
function crown(e, i) {
  const [, , H, kind, n] = TREES[i];
  const [l, t, r, b] = crownBox(i);
  if (kind) e.layer("needles", { pivot: [0, -H * 0.6], wind: { strength: 0.035, gust: 0.6, scale: 3 }, box: [l, t, r, b] }, (g) => pineCrown(g, H, n));
  else {
    for (const side of [-1, 1]) {
      e.layer(side < 0 ? "left" : "right", { pivot: [0, -H * 0.45], wind: { strength: 0.06, gust: 0.7, scale: 3 }, box: side < 0 ? [l, t, 0.4, b] : [-0.4, t, r, b] }, (g) => birchCrown(g, H, n, side));
    }
  }
}

// Blades rooted along a line ({ x, y — the root, h — how tall, wide — how far aside it leans, draw(g) }), painted
// in tufts `width` metres wide: each tuft a layer bending in the wind about a point `below` metres under its roots
// (the roots hardly move, the tips most; neighbours sway together, never in step)
function tufts(e, blades, { width, wind, below, name }) {
  const groups = new Map();
  for (const b of blades) {
    const k = Math.floor(b.x / width);
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(b);
  }
  for (const [k, bs] of [...groups].sort((p, q) => p[0] - q[0])) {
    let x0 = Infinity;
    let x1 = -Infinity;
    let top = Infinity;
    let root = -Infinity;
    for (const b of bs) {
      x0 = Math.min(x0, b.x - b.wide);
      x1 = Math.max(x1, b.x + b.wide);
      top = Math.min(top, b.y - b.h);
      root = Math.max(root, b.y);
    }
    e.layer(`${name}${k}`, { pivot: [(x0 + x1) / 2, root + below], wind, box: [x0 - 0.05, top - 0.08, x1 + 0.05, root + 0.03] }, (g) => {
      g.lineCap = "round";
      for (const b of bs) b.draw(g);
    });
  }
}
// The glade's grass, card i of GRASS (the code of grass_<i>): thin knee-high blades, a seed head now and then
const GRASS_BOX = [-GRASS_W / 2 - 0.25, -0.85, GRASS_W / 2 + 0.25, 0.05];
function grass(e, i) {
  const [, b, seed] = GRASS[i];
  const blades = [];
  for (let k = 0; k < 34; k++) {
    const n = seed + k;
    const u = anim.hash(n, 1) * GRASS_W;
    if (b - GRASS_W / 2 + u > GLADE.b1 + 2 * anim.hash(n, 9)) continue;
    const x = u - GRASS_W / 2;
    const tall = 0.35 + 0.3 * anim.hash(n, 2);
    const lean = (anim.hash(n, 3) - 0.4) * 0.2;
    const colour = ["#b8bea4", "#a9b199", "#c7cab6"][k % 3];
    const head = anim.hash(n, 4) < 0.15;
    blades.push({
      x, y: 0, h: tall + 0.04, wide: Math.abs(lean) + 0.02,
      draw: (g) => {
        g.strokeStyle = colour;
        g.lineWidth = 0.012;
        g.beginPath();
        g.moveTo(x, 0);
        g.quadraticCurveTo(x + lean * 0.3, -tall * 0.6, x + lean, -tall);
        g.stroke();
        if (head) {
          g.fillStyle = "#d6d5c6";
          g.beginPath();
          g.ellipse(x + lean, -tall, 0.012, 0.035, lean, 0, 7);
          g.fill();
        }
      },
    });
  }
  tufts(e, blades, { width: 0.5, wind: { strength: 0.5, gust: 0.7, scale: 1.5 }, below: 0.25, name: "tuft" });
}
// Plant i of UNDER (the code of tuft_<i>): a tuft of grass or a small fern, bending from its foot
const underBox = (i) => {
  const s = UNDER[i][2] * 1.4;
  return [-s, -s, s, 0.05];
};
function undergrowth(e, i) {
  const [, , size, fern, n] = UNDER[i];
  e.layer("plant", { pivot: [0, 0.15], wind: { strength: fern ? 0.25 : 0.45, gust: 0.6, scale: 1.5 }, box: underBox(i) }, (g) => {
    const count = fern ? 7 : 12;
    for (let j = 0; j < count; j++) {
      const a = -Math.PI / 2 + (j / (count - 1) - 0.5) * (fern ? 2.2 : 1.2) + (anim.hash(n * 20 + j, 66) - 0.5) * 0.3;
      const len = size * (fern ? 1.2 : 0.8 + 0.5 * anim.hash(n * 20 + j, 67));
      const tx = Math.cos(a) * len;
      const ty = Math.sin(a) * len;
      g.strokeStyle = ["#98a387", "#a7af93", "#8c977d"][j % 3];
      g.lineWidth = fern ? 0.03 : 0.012;
      g.beginPath();
      g.moveTo(0, 0);
      g.quadraticCurveTo(tx * 0.4, ty * 0.9, tx, ty * (fern ? 0.55 : 1));
      g.stroke();
    }
  });
}
// Bank i of MIST (the code of mist_<i>): a low white bank, soft lumps along it — thickest a little over the ground,
// nothing under its foot —, painted round its box (its ends meet) and drifting along the shore; its animate (mistNow) makes it as thick and as high as `mist` says
const mistBox = (i) => {
  const [, , w, h] = MIST[i];
  return [-1.7 * w, -2.4 * h, 1.7 * w, 0];
};
function mist(e, i) {
  const [, , w, h, v] = MIST[i];
  const box = mistBox(i);
  const span = box[2] - box[0];
  e.layer("bank", { box, drift: [v, 0], pivot: [0, 0] }, (g) => {
    g.beginPath();
    g.rect(box[0], box[1], span, -box[1]);
    g.clip();
    for (const [u, k, a] of [[0.5, 1, 0.7], [0.14 + 0.1 * anim.hash(i, 7), 0.45, 0.4], [0.84 - 0.1 * anim.hash(i, 8), 0.55, 0.45]]) {
      for (const wrap of [-1, 0, 1]) {
        g.save();
        g.translate(box[0] + (u + wrap) * span, -h * 0.35);
        g.scale(1, (1.5 * h) / w);
        const gr = g.createRadialGradient(0, 0, 0, 0, 0, w * k);
        gr.addColorStop(0, `rgba(240,242,243,${a})`);
        gr.addColorStop(0.5, `rgba(240,242,243,${a * 0.5})`);
        gr.addColorStop(1, "rgba(240,242,243,0)");
        g.fillStyle = gr;
        g.fillRect(-w * k, -w * k, 2 * w * k, 2 * w * k);
        g.restore();
      }
    }
  });
}
function mistNow(e) {
  const m = anim.clamp(e.state.mist ?? 0, 0, 1);
  const bank = e.layer("bank");
  bank.alpha = m > 0.02 ? m : 0;
  bank.scaleY = (0.5 + m) / 1.5;
}

// ── the sky ── (the world's: kit.nebo.sky, nebo.skyMotion — elements/sky.js, sky.animate.js)
// The sea is ahead — east: the sun rises over it (u 0), goes round by the right (south) and sets behind the viewer
// (u 1); by night the moon is low over the sea. Where they are, degrees: bearing right of straight ahead, height.
const RAD = Math.PI / 180;
const sunBearing = (u) => 180 * clamp(u, 0, 1);
const sunHeight = (u, height) => 55 * height - (u < 0 || u > 1 ? 4 : 0);
const moonBearing = (u) => -50 + 110 * clamp(u, 0, 1);
const moonHeight = (u, height) => 12 * height - (u < 0 || u > 1 ? 4 : 0);
// ... and on this sky, a backdrop looked at straight ahead (out[0] comes as its middle): as far round as it shows
// (70° aside; farther round they are behind the frame's edge and stay there)
function onSky(bearing, height, out) {
  const r = clamp(bearing, -70, 70) * RAD;
  out[0] += Math.tan(r);
  out[1] = HORIZON - Math.tan(height * RAD) / Math.cos(r);
  return out;
}
const SKY = {
  horizon: HORIZON,
  sun: (u, height, state, out) => onSky(sunBearing(u), sunHeight(u, height), out),
  moon: (u, height, state, out) => onSky(moonBearing(u), moonHeight(u, height), out),
  clouds: [[0.4, 0.12, 1.1, 0.02], [1.3, 0.22, 0.9, 0.014], [0.9, 0.3, 1.2, 0.012]],
};
// The hour's light as the scene's keys: the world's (nebo.keys: the looks' weights, how much the sun and the moon
// shine) and where this scene has the sun and the moon (its lights "sun" and "moon" shine from there) — what
// script.js keeps as `hour` moves, and what a cut to another hour gives with it
function hourKeys(hour) {
  const N = kit.nebo;
  const s = N.sun(hour);
  const m = N.moon(hour);
  return {
    ...N.keys(hour),
    sun_bearing: sunBearing(s.u), sun_height: sunHeight(s.u, s.height),
    moon_bearing: moonBearing(m.u), moon_height: moonHeight(m.u, m.height),
  };
}

// ── the bank, chapter I ── «За корабликом»: Assol (eight) runs down the stream's left bank after her yacht.
// What a game says of it is 0…1 along the stream: 0 — where the yacht is put on the water, 1 — the mouth. Her way is
// as long as her run takes in RUN_SECONDS without a stop (the cast's `run` on her legs, RUN_PACE m/s: its root goes
// 2.8 m/s, she is 0.72 of a man), BANK_OFF metres left of the stream's middle, ending at the top of the beach (BANK_END).
const RUN_SECONDS = 24;
const RUN_PACE = 2.0;
const RUN_LENGTH = RUN_SECONDS * RUN_PACE;
const BANK_OFF = 2.0;
const BANK_END = 31;
// [u, X, Z] along it, down the stream: measured back from its end
const BANK = (() => {
  const back = [[0, streamX(BANK_END) - BANK_OFF, BANK_END]];
  while (back[back.length - 1][0] < RUN_LENGTH) {
    const [m, X, Z] = back[back.length - 1];
    const x = streamX(Z - 0.25) - BANK_OFF;
    back.push([m + Math.hypot(x - X, 0.25), x, Z - 0.25]);
  }
  return back.reverse().map(([m, X, Z]) => [1 - m / RUN_LENGTH, X, Z]);
})();
// the two of BANK that v lies between (v: u, or Z — column k), and how far from the first to the second
function between(v, k) {
  let i = 1;
  while (i < BANK.length - 1 && BANK[i][k] < v) i++;
  return [BANK[i - 1], BANK[i], clamp((v - BANK[i - 1][k]) / (BANK[i][k] - BANK[i - 1][k]), 0, 1)];
}
// where her way is at u: [X, Z]
function bankAt(u) {
  const [a, b, k] = between(u, 0);
  return [mix(a[1], b[1], k), mix(a[2], b[2], k)];
}
// how far along it she is (0…1), by how far down the stream she stands (Z)
function runAt(Z) {
  const [a, b, k] = between(Z, 2);
  return clamp(mix(a[0], b[0], k), 0, 1);
}
// which way (degrees, as people turn) her way goes at u
function bankTurn(u) {
  const [a, b] = between(u, 0);
  return (Math.atan2(b[1] - a[1], b[2] - a[2]) / RAD + 360) % 360;
}
// her way on from u to `to`: a point every metre and a half, and its end
function bankWay(u, to) {
  const way = [];
  for (let v = u + 1.5 / RUN_LENGTH; v < to; v += 1.5 / RUN_LENGTH) way.push(bankAt(v));
  way.push(bankAt(to));
  return way;
}
// Where she puts the yacht on the water: the stream's brink abreast of her way's start; she at it, facing the stream
// (90), the yacht set down just off it
const BRINK = [edge(bankAt(0)[1], water(bankAt(0)[1]), -1), bankAt(0)[1]];
const LAUNCH = [BRINK[0] - 0.15, BRINK[1]];
const PUT = [BRINK[0] + 0.25, BRINK[1]];
// The yacht on the stream at u — [across, distance, over the bed there: on the water]: in the stream's middle abreast
// of her way's point there (`out` 0 — still by the brink where she put it down, 1 — out in the current); past the last
// fall it goes on out into the mouth's water (TOY_ON metres farther than her way ends)
const TOY_ON = 3.2;
function toyAt(u, out = 1) {
  const v = clamp(u, 0, 1);
  const Z = bankAt(v)[1] + TOY_ON * smooth(span(v, 0.88, 1));
  const X = streamX(Z) - (1 - clamp(out, 0, 1)) * (streamX(PUT[1]) - PUT[0]);
  return [X, Z, water(Z) - ground(X, Z)];
}
// The two snags across her way (the elements `snag`, `snag2`: tools/les-u-morya.js stands them there) — how far
// along each lies. Each is low: she runs over it without breaking her run if she is let (script.js), else stops
// short of it (STOPS) — pulling up from her run (the cast's `halt`, begun HALT_IN before the stop). A game's tap
// lets her over the snag she is coming to from WINDOW before its stop on — her run then goes on to PAST it. NEAR —
// a couple of steps: less than that she does not set off for
const SNAGS = [0.4, 0.7];
const STOPS = SNAGS.map((u) => u - 0.8 / RUN_LENGTH);
const HALT_IN = 2.5 / RUN_LENGTH;
const WINDOW = 4 / RUN_LENGTH;
const PAST = 1.5 / RUN_LENGTH;
const NEAR = 1.2 / RUN_LENGTH;
const SNAG_AT = SNAGS.map((u) => [bankAt(u)[0] - 0.5, bankAt(u)[1]]);
// A snag (the code of `snag`, `snag2`): a fallen birch across the path along the left bank, bleached and bare, its
// roots up on the left; its point `snag`
function snag(g, e) {
  g.fillStyle = "#c9c8c1";
  g.beginPath();
  g.moveTo(-1.5, -0.12);
  g.lineTo(1.9, -0.22);
  g.lineTo(1.95, -0.06);
  g.lineTo(-1.5, 0);
  g.fill();
  g.fillStyle = "#a7a69f";
  g.fillRect(-1.5, -0.04, 3.4, 0.05);
  g.strokeStyle = "#9d9a92";
  g.lineWidth = 0.04;
  g.lineCap = "round";
  g.beginPath();
  for (let i = 0; i < 7; i++) {
    const a = -0.4 - (i / 6) * 2.4;
    g.moveTo(-1.5, -0.08);
    g.quadraticCurveTo(-1.5 + Math.cos(a) * 0.35, -0.08 + Math.sin(a) * 0.5, -1.5 + Math.cos(a) * 0.6, -0.08 + Math.sin(a) * 0.75);
  }
  g.stroke();
  e.at(0, -0.3, "snag");
}

// ── the film ── chapter I by the stream and at its mouth: the yacht put on the water, the chase, Egl; chapter III on
// the headland: the night fire, dawn, the sleeping girl, the ring, the morning.
// The world's module beats plays it (modules/beats.md): for a game one beat at a time by `beat` (script.js); outside
// games the showcase's, in order (showcase.js). Each beat is a sequence of the director: its people do what they do
// as long as it takes, at their own pace; time waits only where the film pauses. `from` — all a beat begins at when it
// does not follow one of `after` (a cut: a game may begin anywhere). The scene tells a beat's moments
// (scene.tell('<beat>:<moment>')) — notes.md lists them. film(scene): a `from` reads what the game's play has decided
// (`ring_kind`: which ring it is).
// The people are the engine's (the world's cast): Assol (seventeen; in chapter I a girl of eight — her look
// `assol_wear`), Grey, Letika, Egl — <id>_do, _turn (degrees: 0 away from the start — east, the sea; 90 right, 180
// back toward the wood, 270 left — over the cliff's edge, the bay), _look, _reach, _with, _wear, _on, _gait, _here;
// their places as_, gr_, le_, eg_ a/d.
// A point of the world as the director takes it — [across, distance, metres over the land there] — from a height
// given as the land's are (from the forest floor at the start)
const point = (X, Z, up) => [X, Z, up - ground(X, Z)];
// ... and one on the headland's top by its own axes (a along the edge, b inland from it), `up` over the top
const onHead = (a, b, up = 0) => [...headWorld(a, b), up];
const loop = (motion) => ({ motion, loop: true });
const done = (motion) => ({ motion, loop: false, from: 99 });
// which way (degrees, as people turn) it is from one place to another
const toward = ([X0, Z0], [X1, Z1]) => (Math.atan2(X1 - X0, Z1 - Z0) / RAD + 360) % 360;
// Where things are on the headland: the two fishing sit on the cliff's very edge, their legs over it, facing out over
// the bay (the cliff's way); the girl asleep in the grass of the glade; where Grey stops over her, where he kneels by
// her (facing her); her right hand lifted before her face, sitting (the ring on it), and laid out beside her as she
// sits looking at the sea; the bay below, the open sea
const OVER = 279;
const GREY_EDGE = onHead(-3, -7.75);
const LETIKA_EDGE = onHead(1, -7.75);
const SLEEP = [25.6, 40.5];
const OVER_HER = [24.35, 41.75];
const KNEEL = [25.07, 40.47];
const RING_UP = [25.27, 40.38, 0.65];
const RING_REST = [25.98, 40.8, 0.42];
const BAY = point(-20, 60, -2);
const OPEN_SEA = point(30, 300, 0);
const TO_SEA = Math.atan2(OPEN_SEA[0] - SLEEP[0], OPEN_SEA[1] - SLEEP[1]) / RAD;
// ... and at the stream's mouth: the old man in the shallow water (EGL_AT); where she comes out from behind the
// bushes (BEHIND, round their end: ROUND) and stops at the water's edge, the sea beyond him from where she stands
// (HALT); a step before her, where he kneels to her and gives her the yacht (BEFORE_HER); his way off along the
// water's edge toward the cape, hers back up the bank into the wood
const EGL_AT = [1.2, 38.8];
const HALT = [0.2, 35.8];
const BEHIND = [-4.2, 30];
const ROUND = [-2.4, 31.6];
const TO_EGL = toward(HALT, EGL_AT);
const TO_HER = toward(EGL_AT, HALT);
// (the way he turns to show her the sea: out over the bay, side on to her — his lifted arm is seen along its length)
const SEAWARD = 310;
const BEFORE_HER = [mix(HALT[0], EGL_AT[0], 0.28), mix(HALT[1], EGL_AT[1], 0.28)];
const ALONG_EDGE = [[5, 39.4], [11, 39]];
const INTO_WOOD = [bankAt(1), bankAt(0.96)];
// her hands pressed to her breast
const PRESSED = { r: "assol#chest", l: "assol#chest" };
// The cameras. The eye goes over the land by itself (1.7 m over it wherever camera_x, camera_z put it; camera_h —
// over that). Shots that look ahead, east, are the operator's (camera_target: measured by the person's height);
// those that look another way are placed (camera_yaw turns the lens; a walk's operator looks ahead only).
const CAMERA = { camera_target: null, camera_shot: null, camera_frame: null, camera_glide: null, camera_x: 0, camera_z: 0, camera_h: 0, camera_yaw: 0, camera_pitch: 0, camera_look: 0 };
const placed = (x, z, h, yaw, pitch) => ({ ...CAMERA, camera_x: x, camera_z: z, camera_h: h, camera_yaw: yaw, camera_pitch: pitch });
const operator = (target, shot, frame) => ({ ...CAMERA, camera_target: target, camera_shot: shot, camera_frame: frame });
const SHOTS = {
  // from up the stream, behind her left shoulder: she at the brink, the water before her
  launch: placed(LAUNCH[0] - 2.2, LAUNCH[1] - 3, -0.5, 34, -6),
  // behind her down the bank, the stream and the yacht on her right
  chase: operator("assol", 0.4, [0.42, 0.46]),
  // from the sea, looking back at the wood: the old man in the shallows, the bushes and the bank beyond him
  mouth: placed(4.6, 42.6, -0.3, -144, -3),
  // over the girl's right shoulder, low: Egl tall against the sea; ... turned after his hand to the empty horizon
  egl: placed(0.17, 34.45, -0.9, 14, 8),
  horizon: placed(0.17, 34.45, -0.9, -18, 4),
  // close behind her, lower: her nape thrown back, he over her against the sea
  nape: placed(0.25, 34.84, -1, 18, 14),
  // from the wood's side, the two of them at the water, the sea beyond; ... turned after his look out to sea
  hold: placed(-2.6, 33, -0.5, 37, 0),
  seaward: placed(-2.6, 33, -0.5, 14, 0),
  // from the side, close to both: he on his knee before her
  side: placed(-2.12, 37.05, -0.8, 108, 0),
  // the fire from inland: the two on the edge either side of it, the bay and the sea under the moon beyond
  fire: placed(21.64, 42.62, 0, -68, -6),
  // Grey crossing the glade, the sea and the rising sun beyond; the same as he goes
  walk: operator("grey", 0.42, [0.4, 0.3]),
  // close, over the grass, from the glade's side, looking out to the cliff's edge and the bay: she whole in the
  // grass — her hair, her shoulder, her hands; he a dark figure over her
  sleeping: placed(27.4, 40.5, -0.6, -80, -10),
  // closer, from beyond her head: he kneels by her, her hand
  ring: placed(25.2, 43.4, 0, 175, -18),
  // she asleep with the ring, he going off into the mist beyond her
  asleep: operator("assol", 0.6, [0.6, 0.84]),
  // the glade in the morning, she in the grass
  morning: operator("assol", 0.4, [0.55, 0.7]),
  // before her as she sits up; then her hand with the ring, close, her eyes on it
  sits: placed(23.55, 39.75, -0.7, 70, -10),
  hand: placed(24.45, 39.85, -0.9, 57, -2),
  // over her shoulder, the sea before her, her hand with the ring beside her
  sea: placed(26.1, 38.4, -0.6, -6, -6),
  // before her, the sea beyond; then close: her hands at her breast
  before: placed(23.5, 42.0, -0.4, 118, -4),
  hands: placed(24.4, 41.4, -0.45, 120, -7),
};
// a placed camera turned to another placed shot, over seconds: its moves (to wait for them: s.all)
const PLACED = ["camera_x", "camera_z", "camera_h", "camera_yaw", "camera_pitch"];
const pan = (s, shot, over) => PLACED.map((key) => s.move(key, shot[key], { over, ease: "inOut" }));
const PEOPLE = ["assol", "grey", "letika", "egl"];
const nobody = Object.fromEntries(PEOPLE.flatMap((id) => [
  [`${id}_here`, false], [`${id}_do`, "stand"], [`${id}_look`, null], [`${id}_reach`, null], [`${id}_with`, null], [`${id}_wear`, null], [`${id}_on`, null], [`${id}_gait`, null],
]));
// an hour of the scene: its light with it, no one here, no yacht on the stream, the scene's own camera
const hourOf = (hour, mist, more) => ({
  ...nobody, ...CAMERA, hour, ...hourKeys(hour), mist, fire: 0, fade: 0, ring: "none", ring_at: 0, stir: 0, toy_water: 0, toy_out: 1, reeds: 0, jump: 0, ...more,
});
// the wood by day, as the scene opens
const DAY = () => hourOf(0.5, 0.15);
// which ring it is — the cast's part: his mother's (`ring`) or his own old one (`ring_old`), as the play has decided
const ringPart = (scene) => (scene.get("ring_kind") === "mother" ? "ring" : "ring_old");
// chapter I: a forenoon, the sun over the sea ahead on the right; Assol a girl of eight
const CHILD = () => kit.cast.characters.assol_child;
const FORENOON = (more) => hourOf(0.4, 0.1, { assol_here: true, assol_wear: CHILD(), ...more });
// ... she at the brink with her yacht, the chase not begun
const LAUNCHING = () => FORENOON({
  ...SHOTS.launch, run: 0, run_at: 0, toy: 0, toy_out: 0,
  as_a: LAUNCH[0], as_d: LAUNCH[1], assol_turn: 90, assol_with: ["yacht"], assol_look: [...PUT, 0.1],
});
// ... the yacht on the water, out in the current; she standing over it
const AFLOAT = () => ({ ...LAUNCHING(), toy_water: 1, toy_out: 1, assol_with: null, assol_look: "toy#toy" });
// ... the mouth: the old man in the shallow water, turning the yacht in his hands; she behind the bushes, running
const MOUTH = () => FORENOON({
  ...SHOTS.mouth,
  as_a: BEHIND[0], as_d: BEHIND[1], assol_turn: toward(BEHIND, ROUND), assol_gait: "run",
  eg_a: EGL_AT[0], eg_d: EGL_AT[1], egl_here: true, egl_turn: 130, egl_do: loop("turn_toy"), egl_with: ["yacht"], egl_look: "egl#yacht",
});
// ... she has stopped at the water's edge; he has turned to her, the yacht in his right hand (over her shoulder)
const MET = () => ({
  ...MOUTH(), ...SHOTS.egl,
  as_a: HALT[0], as_d: HALT[1], assol_turn: TO_EGL, assol_gait: null, assol_do: done("halt"), assol_look: "egl",
  egl_turn: TO_HER, egl_do: "stand", egl_with: ["yacht_r"], egl_look: "assol",
});
// ... the two of them at the water, seen from the wood's side
const HELD = () => ({ ...MET(), ...SHOTS.hold });
// chapter III. The night: the fire up, the two of them on the edge with their rods
const NIGHT = () => hourOf(0.95, 0.1, {
  fire: 1, ...SHOTS.fire,
  gr_a: GREY_EDGE[0], gr_d: GREY_EDGE[1], grey_here: true, grey_on: GREY_EDGE, grey_turn: OVER, grey_do: loop("fish"), grey_with: ["rod"], grey_look: BAY,
  le_a: LETIKA_EDGE[0], le_d: LETIKA_EDGE[1], letika_here: true, letika_on: LETIKA_EDGE, letika_turn: OVER, letika_do: loop("fish"), letika_with: ["rod"], letika_look: BAY,
});
// dawn in the mist: the fire out; she asleep in the grass; he at the glade's far side, coming
const DAWN = () => hourOf(0.26, 0.75, {
  ...SHOTS.walk,
  as_a: SLEEP[0], as_d: SLEEP[1], assol_here: true, assol_turn: 250, assol_do: loop("sleep"),
  gr_a: 20.6, gr_d: 44.6, grey_here: true, grey_turn: 140, grey_gait: "careful", grey_look: [25, 40, 0.6],
});
// ... he has come and stands over her
const FOUND = () => ({ ...DAWN(), gr_a: OVER_HER[0], gr_d: OVER_HER[1], grey_gait: null, grey_look: "assol" });
// ... he kneels by her, the ring (the cast's part `part`) in his fingers
const KNEELING = (part) => ({ ...FOUND(), ...SHOTS.ring, gr_a: KNEEL[0], gr_d: KNEEL[1], grey_do: done("kneel_down"), grey_look: "assol#hand_r", ring: "grey", grey_with: [part] });
// ... the ring is on her finger
const RINGED = (part) => ({ ...KNEELING(part), ring: "finger", ring_at: 1, grey_with: null, assol_with: [part] });
// morning: the mist thinner; she asleep, the ring on her finger
const MORNING = (part) => hourOf(0.32, 0.3, {
  ...SHOTS.morning, ring: "finger",
  as_a: SLEEP[0], as_d: SLEEP[1], assol_here: true, assol_turn: 250, assol_do: loop("sleep"), assol_with: [part],
});
// ... she has sat up and looks at the ring on her lifted hand
const AWAKE = (part) => ({ ...MORNING(part), ...SHOTS.hand, assol_do: done("wake_sit"), assol_reach: { r: RING_UP }, assol_look: "assol#hand_r" });
// a cut made ready, then shown whole
async function cutTo(s, values) {
  const shot = s.shot(values);
  await s.until(() => shot.ready);
  shot.cut();
}
function film(scene) {
  const ring = () => ringPart(scene);
  return {
    // launch — a forenoon by the stream: Assol, eight, crouches at the brink and sets her yacht on the water; the
    // current takes it out; she gets up, her eyes on it
    launch: {
      from: LAUNCHING,
      run: async (s) => {
        const assol = s.person("assol");
        await s.wait(0.8);
        const put = assol.do("crouch_put");
        await s.wait(2.3);
        assol.with(null);
        s.set("toy_water", 1);
        await s.wait(0.5);
        s.move("toy_out", 1, { over: 3, ease: "in" });
        s.tell("launch:afloat");
        await put;
        assol.look("toy#toy");
        await s.wait(1);
      },
    },
    // chase — the camera behind her down the bank; she stands looking after the yacht, ready to run. A game's
    // «За корабликом» goes on from here (run, jump, toy, reeds: script.js)
    chase: {
      after: "launch",
      from: () => ({ ...AFLOAT(), ...SHOTS.chase, assol_gait: "run" }),
      run: async (s) => {
        const assol = s.person("assol");
        s.set("assol_do", "stand");
        assol.gait("run");
        assol.look("toy#toy");
        await cutTo(s, SHOTS.chase);
        await s.wait(1.5);
        s.tell("chase:ready");
        await s.wait(0.5);
      },
    },
    // mouth — the stream's mouth, seen from the sea: a tall old man stands in the shallow water, stooped over the
    // yacht he turns in his hands; Assol runs out from behind the bushes and stops short at the water's edge; he
    // looks up at her
    mouth: {
      from: MOUTH,
      run: async (s) => {
        const assol = s.person("assol");
        await s.wait(2.5);
        await assol.walk([ROUND]);
        await assol.go("halt", { to: HALT, turn: TO_EGL });
        assol.gait(null);
        assol.look("egl");
        s.person("egl").look("assol");
        s.tell("mouth:seen");
        await s.wait(1.5);
      },
    },
    // egl — over the girl's shoulder: Egl tall against the sea, the yacht with its scarlet sails in his hand. He
    // speaks; then turns to the sea — side on to her (SEAWARD) — and slowly lifts his hand out to the horizon (the
    // cast's `tell_sea`: the right arm forward to the shoulder's height, held, lowered) — the camera goes after it,
    // to the empty sea; the hand
    // comes down, he turns back and looks at her
    egl: {
      after: "mouth",
      from: MET,
      run: async (s) => {
        const egl = s.person("egl");
        await cutTo(s, MET());
        await s.wait(1.2);
        s.tell("egl:tale");
        await s.wait(5.5);
        egl.look(OPEN_SEA);
        s.tell("egl:sail");
        await egl.turn(SEAWARD);
        const tale = egl.do("tell_sea");
        pan(s, SHOTS.horizon, 5);
        await tale;
        egl.look("assol");
        pan(s, SHOTS.egl, 2);
        await egl.turn(TO_HER);
        s.tell("egl:boat");
        await s.wait(6.5);
      },
    },
    // assol_close — from behind her, close and low: her nape thrown back to him, her hands pressed to her breast;
    // over her Egl against the sea
    assol_close: {
      after: "egl",
      from: () => ({ ...MET(), ...SHOTS.nape, assol_reach: PRESSED }),
      run: async (s) => {
        s.person("assol").reach(PRESSED);
        await cutTo(s, SHOTS.nape);
        await s.wait(5);
      },
    },
    // egl_hold — the two of them at the water, from the wood's side; Egl holds the yacht (a game's choice: Egl)
    egl_hold: {
      after: ["egl", "assol_close"],
      from: HELD,
      run: async (s) => {
        s.person("assol").reach(null);
        await cutTo(s, SHOTS.hold);
        await s.wait(1.5);
        s.tell("egl_hold:ready");
        await s.wait(1.5);
      },
    },
    // egl_when — «Когда?»: Egl turns away to the sea and looks long at the horizon; she looks there too, and the
    // camera after them: the light on the water
    egl_when: {
      after: "egl_hold",
      from: HELD,
      run: async (s) => {
        const egl = s.person("egl");
        egl.look(OPEN_SEA);
        await egl.turn(350);
        s.tell("egl_when:sea");
        s.person("assol").look(OPEN_SEA);
        await s.all(pan(s, SHOTS.seaward, 4));
        await s.wait(1.5);
      },
    },
    // egl_how — «А как я его узнаю?»: Egl comes to her and goes down on his knee before her — they are of a height
    // (from the side, close to both)
    egl_how: {
      after: "egl_hold",
      from: HELD,
      run: async (s) => {
        const egl = s.person("egl");
        await cutTo(s, SHOTS.side);
        await egl.go("kneel_down", { to: BEFORE_HER, turn: TO_HER });
        s.tell("egl_how:down");
        await s.wait(1.5);
      },
    },
    // egl_goes — (off his knee, if he knelt; else coming to her) he holds the yacht out to her in both hands, she
    // takes it; he goes off along the water's edge; she runs back into the wood, the yacht pressed to her breast
    egl_goes: {
      after: ["egl_when", "egl_how"],
      from: HELD,
      run: async (s) => {
        const assol = s.person("assol"), egl = s.person("egl");
        const wide = s.shot(SHOTS.hold);
        egl.look("assol");
        assol.look("egl");
        if (s.get("egl_do")?.motion === "kneel_down") await egl.go("kneel_rise", { from: BEFORE_HER, turn: TO_HER });
        else {
          await egl.walk([BEFORE_HER]);
          await egl.turn(TO_HER);
        }
        await s.until(() => wide.ready);
        wide.cut();
        egl.with(["yacht"]);
        const give = egl.do("give");
        await s.wait(1.3);
        assol.reach({ r: "egl#yacht", l: "egl#yacht" });
        await s.wait(0.7);
        egl.with(null);
        assol.with(["yacht"]);
        assol.reach(PRESSED);
        assol.look("assol#yacht");
        s.tell("egl_goes:given");
        await give;
        egl.look(null);
        egl.walk(ALONG_EDGE);
        await s.wait(0.8);
        assol.look(null);
        assol.gait("run");
        await assol.walk(INTO_WOOD);
        assol.here(false);
        s.tell("egl_goes:gone");
        await s.wait(1);
      },
    },
    // fire — night: the fire at the cliff's edge; Grey and Letika sit on the edge with their rods, the sea below under
    // the moon; Letika turns his head to Grey («Рыба спит, капитан») and Grey to him; both look out again; the night
    // closes (a fade: the hours passing till dawn)
    fire: {
      from: () => ({ ...NIGHT(), fade: 1 }),
      run: async (s) => {
        const grey = s.person("grey");
        const letika = s.person("letika");
        await s.move("fade", 0, { over: 2, ease: "out" });
        await s.wait(2);
        letika.look("grey");
        s.tell("fire:letika");
        await s.wait(1);
        grey.look("letika");
        await s.wait(1.5);
        grey.look(BAY);
        letika.look(BAY);
        s.tell("fire:sea");
        await s.wait(2.2);
        await s.move("fade", 1, { over: 1.2, ease: "in" });
      },
    },
    // dawn_walk — dawn in the mist (the night's fade lifting): Grey crosses the glade, stepping carefully, and stops —
    // in the grass a girl is asleep
    dawn_walk: {
      from: () => ({ ...DAWN(), fade: 1 }),
      run: async (s) => {
        const grey = s.person("grey");
        s.move("fade", 0, { over: 1.2, ease: "out" });
        const walk = grey.walk([[22.6, 43.0], OVER_HER]);
        await s.until(() => s.state.gr_a > 23.2);
        grey.look("assol");
        s.tell("dawn_walk:seen");
        await walk;
        grey.gait(null);
        await grey.turn(140);
        s.tell("dawn_walk:found");
        await s.wait(2);
      },
    },
    // sleeping — close, over the grass: her hair, her shoulder rising with her breath, her hands; he a dark figure
    // standing over her
    sleeping: {
      after: "dawn_walk",
      from: () => ({ ...FOUND(), ...SHOTS.sleeping }),
      run: async (s) => {
        await cutTo(s, SHOTS.sleeping);
        await s.wait(6);
      },
    },
    // ring — he kneels by her, gently, his back straight, the ring in his fingers; he looks at her hand. A game's
    // «Кольцо» goes on from here (ring_at, stir: script.js); ring_on is the same done by the scene
    ring: {
      after: ["dawn_walk", "sleeping"],
      from: () => ({ ...FOUND(), ...SHOTS.ring }),
      run: async (s) => {
        const grey = s.person("grey");
        await cutTo(s, SHOTS.ring);
        s.set("ring", "grey");
        grey.look("assol#hand_r");
        await grey.go("kneel_down", { to: KNEEL, turn: 140 });
        s.tell("ring:kneeling");
        await s.wait(1.5);
      },
    },
    // ring_on — his hand with the ring goes to her hand; the ring is on her finger
    ring_on: {
      after: "ring",
      from: () => KNEELING(ring()),
      run: async (s) => {
        await s.move("ring_at", 1, { over: 4, ease: "inOut" });
        await s.wait(1.5);
      },
    },
    // leave — he gets up and goes off across the glade, looks back once; she sleeps on, the ring on her finger, he
    // going off into the mist beyond her
    leave: {
      after: ["ring", "ring_on"],
      from: () => RINGED(ring()),
      run: async (s) => {
        const grey = s.person("grey");
        s.set("ring_at", 1);
        grey.look(null);
        await grey.go("kneel_rise", { from: KNEEL, turn: 140 });
        const walk = grey.walk([[23.2, 44.4], [21.4, 48.6], [19.2, 55]]);
        await cutTo(s, SHOTS.walk);
        await s.until(() => s.state.gr_d > 44.4);
        grey.look("assol");
        s.tell("leave:back");
        await s.wait(1.6);
        grey.look(null);
        await cutTo(s, SHOTS.asleep);
        await walk;
        s.tell("leave:gone");
        await s.wait(1.5);
      },
    },
    // wake — morning (the night's fade lifting): the glade, she in the grass; she sits up — before her as she does —
    // lifts her hand before her face and looks: a ring on her finger (close: her hand, her eyes on it)
    wake: {
      from: () => ({ ...MORNING(ring()), fade: 1 }),
      run: async (s) => {
        const assol = s.person("assol");
        const before = s.shot(SHOTS.sits);
        await s.move("fade", 0, { over: 1.5, ease: "out" });
        const sit = assol.do("wake_sit");
        await s.wait(1.4);
        await s.until(() => before.ready);
        before.cut();
        await sit;
        s.tell("wake:up");
        assol.reach({ r: RING_UP });
        assol.look("assol#hand_r");
        await s.wait(1.2);
        await cutTo(s, SHOTS.hand);
        s.tell("wake:ring");
        await s.wait(4);
      },
    },
    // wake_hold — she lowers her hand beside her — the ring on it in the frame —, turns to the sea and sits in the
    // grass looking out (a game's choice: the ring)
    wake_hold: {
      after: "wake",
      from: () => AWAKE(ring()),
      run: async (s) => {
        const assol = s.person("assol");
        assol.reach({ r: RING_REST });
        assol.do("sit_look", { loop: true });
        const turn = assol.turn(TO_SEA);
        await cutTo(s, SHOTS.sea);
        assol.look(OPEN_SEA);
        await turn;
        s.tell("wake_hold:sea");
        await s.wait(3);
      },
    },
    // wear — she presses the ring on tighter with her other hand and gets up, looking out to sea
    wear: {
      after: ["wake", "wake_hold"],
      from: () => AWAKE(ring()),
      run: async (s) => {
        const assol = s.person("assol");
        const turn = assol.turn(TO_SEA);
        assol.reach({ l: "assol#hand_r" });
        assol.look("assol#hand_r");
        await cutTo(s, SHOTS.before);
        await turn;
        await s.wait(1.2);
        assol.reach(null);
        await assol.do("stand_from_kneel");
        assol.look(OPEN_SEA);
        s.tell("wear:up");
        await s.wait(2);
      },
    },
    // hide — she gets up, takes the ring off, hangs it on a cord and hides it under her dress (close: her hands at
    // her breast)
    hide: {
      after: ["wake", "wake_hold"],
      from: () => AWAKE(ring()),
      run: async (s) => {
        const assol = s.person("assol");
        const turn = assol.turn(TO_SEA);
        assol.reach(null);
        await cutTo(s, SHOTS.before);
        await turn;
        await assol.do("stand_from_kneel");
        assol.look("assol#hands");
        const hide = assol.do("hide_ring");
        await cutTo(s, SHOTS.hands);
        await hide;
        s.set("ring", "cord");
        s.tell("hide:hidden");
        await s.wait(1.5);
      },
    },
  };
}
// the film as the showcase plays it (after its own two beats: the stream by day, the hours at the mouth; and with
// its own «За корабликом» after `chase`): chapter I with both of Egl's answers, chapter III with both ways it ends
const SHOWCASE = [
  "launch", "chase", "mouth", "egl", "assol_close", "egl_hold", "egl_when", "egl_how", "egl_goes",
  "fire", "dawn_walk", "sleeping", "ring", "ring_on", "leave", "wake", "wake_hold", "wear", "hide",
];

return {
  HORIZON, TOP, SEA, HEAD, FALLS, MOUTH_WATER, GLADE, TREES, STONES, GRASS, GRASS_BOX, UNDER, MIST, SPRAY, SKY,
  streamX, halfWidth, water, ground, headTop, headWorld, mistFoot, landPainting, streamPainting,
  trunk, crown, crownBox, tufts, grass, undergrowth, underBox, mist, mistBox, mistNow, hourKeys,
  snag, bankAt, bankTurn, bankWay, runAt, toyAt, SNAG_AT, STOPS, SNAGS, HALT_IN, WINDOW, PAST, NEAR, ringPart,
  DAY, SHOTS, CAMERA, film, SHOWCASE,
};
