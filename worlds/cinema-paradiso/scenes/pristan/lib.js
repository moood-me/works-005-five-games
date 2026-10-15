// Пристань — what the paintings, the relief and the script share: the place in metres, the car's road, a few
// painted things used by several elements. Metres: across x (right of the start's line of sight), distance z (north,
// toward the sea). The start stands on the quay at the root of the mole, looking north along it.

const G = {
  MOLE_W: 3.5, MOLE_END: 50,            // the mole: x -3.5..3.5, z 4..50
  HEAD: [-7, 7, 50, 64],                // its head: a wider platform at the end
  QUAY_EDGE: 4,                         // the quay: z < 4
  JETTY: [-12, -3.5, 1, 14],            // the warehouse's own platform beside the mole's root
  WALL_X: -5.5,                         // the warehouse's long wall (its face looks east, at the mole)
  SEA: -0.6,                            // the water's level (the deck is 0)
  FLOOR: -1.2,                          // the land under the water
  PROJ: [-3.0, 9.5],                    // the projector's table (the projector looks north along the mole)
  LENS: [-3.0, 9.85, 1.35],
  SCREEN: [0.5, 34], SCREEN_SPAN: [1.4, 5.4], SCREEN_HALF: 3.5,
  TOTO_PROJ: [-3.3, 8.9],               // behind the projector
  CRATE: [-1.9, 10.4],                  // Elena's crate (her hips)
  ELENA_BY: [-2.4, 8.45],               // beside Toto, under the rain
  ROWS: [15, 16.1, 17.2, 18.3, 19.4, 20.5, 21.6],
  COLS: [-2.5, -1.5, -0.5, 0.5, 1.5, 2.5],
  C_SEATS: { c1: [-2.5, 15], c2: [-1.5, 15], c3: [0.5, 15], c4: [1.5, 15] },
  DOOR: [-4.95, 10.6],                  // the warehouse door (on the long wall)
  BENCH_A: [-5.05, 7.0], BENCH_B: [-5.05, 8.2], CANE: [-4.5, 7.3],
  BOLLARD: [2.5, 59.6], LANTERN: [5.5, 62.5], STREET: [7.5, -4.5],
};

// The land: the quay, the mole, its head and the jetty stand at 0; elsewhere the sea's bed.
function landAt(x, z) {
  if (z < G.QUAY_EDGE) return 0;
  if (Math.abs(x) <= G.MOLE_W && z <= G.MOLE_END) return 0;
  if (x >= G.HEAD[0] && x <= G.HEAD[1] && z >= G.HEAD[2] && z <= G.HEAD[3]) return 0;
  if (x >= G.JETTY[0] && x <= G.JETTY[1] && z <= G.JETTY[3]) return 0;
  return G.FLOOR;
}

// The car's roads: control points, densified by Catmull-Rom; `park` is the point where it stands.
// old — the banker's car comes along the quay from the east, stops by the mole's root, leaves to the west;
// new — Elena's car stands on the mole's head looking at the sea, turns round the head and goes down the mole.
const ROADS = {
  old: { pts: [[40, -2], [20, -2], [9, -1.4], [4.5, 0.6], [1.0, 1.9], [-2.5, 0.2], [-6.5, -2], [-20, -2.2], [-60, -2.2]], park: 3 },
  new: { pts: [[0, 57], [0.3, 59.2], [2.2, 60.6], [4.4, 59.8], [5.0, 57], [3.6, 52.5], [1.6, 47], [1.3, 30], [1.2, 9], [2.6, 2.2], [7, -1.5], [20, -2], [70, -2]], park: 0 },
};
const dense = {};
function road(type) {
  if (dense[type]) return dense[type];
  const R = ROADS[type], P = R.pts, out = [], N = 14;
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
    for (let k = 0; k < N; k++) {
      const t = k / N, t2 = t * t, t3 = t2 * t;
      const f = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push(P[P.length - 1].slice());
  const s = [0];
  for (let i = 1; i < out.length; i++) s.push(s[i - 1] + Math.hypot(out[i][0] - out[i - 1][0], out[i][1] - out[i - 1][1]));
  return (dense[type] = { pts: out, s, L: s[s.length - 1], park: s[R.park * N] });
}
// where the car is: arrive 0…1 brings it to where it stands, go 0…1 takes it from there to the road's end
function carAt(type, arrive, go) {
  const r = road(type);
  const want = r.park * arrive + (r.L - r.park) * go;
  let i = 1;
  while (i < r.s.length - 1 && r.s[i] < want) i++;
  const a = r.pts[i - 1], b = r.pts[i], u = Math.max(0, Math.min(1, (want - r.s[i - 1]) / ((r.s[i] - r.s[i - 1]) || 1)));
  const x = a[0] + (b[0] - a[0]) * u, z = a[1] + (b[1] - a[1]) * u;
  let h = Math.atan2(b[0] - a[0], b[1] - a[1]) * 180 / Math.PI;
  if (h < 0) h += 360;
  return { x, z, h };
}
// a point by the car: `side` metres to its right, `fwd` metres ahead of its middle
function byCar(type, arrive, go, side, fwd) {
  const c = carAt(type, arrive, go), h = c.h * Math.PI / 180;
  return [c.x + Math.sin(h) * fwd + Math.cos(h) * side, c.z + Math.cos(h) * fwd - Math.sin(h) * side];
}

// ---- painted things ----
const hash = (n, s) => anim.hash(n, s);

// limestone paving seen from above: half x, half y (metres)
function paving(g, W, D, seed, base) {
  const tones = base || ['#b29e7e', '#a69276', '#bba887', '#9e8c71', '#b7a383'];
  g.fillStyle = '#8f7f66'; g.fillRect(-W, -D, 2 * W, 2 * D);
  g.save(); g.beginPath(); g.rect(-W, -D, 2 * W, 2 * D); g.clip();
  let row = 0;
  for (let y = -D; y < D; y += 0.62, row++) {
    const off = (row % 2) * 0.55;
    let k = 0;
    for (let x = -W - off; x < W; x += 1.12, k++) {
      g.fillStyle = tones[Math.floor(hash(row * 131 + k, seed) * tones.length)];
      g.fillRect(x + 0.03, y + 0.03, 1.06, 0.56);
    }
  }
  // damp stains and wear
  for (let i = 0; i < W * D * 0.6; i++) {
    const x = (hash(i, seed + 5) * 2 - 1) * W, y = (hash(i, seed + 6) * 2 - 1) * D, r = 0.3 + hash(i, seed + 7) * 1.1;
    g.fillStyle = i % 2 ? 'rgba(70,60,48,0.10)' : 'rgba(210,196,170,0.08)';
    g.beginPath(); g.ellipse(x, y, r, r * 0.6, hash(i, seed + 8) * 3, 0, Math.PI * 2); g.fill();
  }
  g.restore();
}

// a sea wall's face: `len` metres long from x 0, from the bed (its anchor, y 0) up to the deck (y −1.2)
function stoneFace(g, len, seed) {
  g.save(); g.translate(0, -1.2);
  g.fillStyle = '#8c7b62'; g.fillRect(0, -0.02, len, 1.24);
  let row = 0;
  for (let y = 0; y < 1.2; y += 0.4, row++) {
    let k = 0;
    for (let x = -(row % 2) * 0.6; x < len; x += 1.2, k++) {
      const h = hash(row * 977 + k, seed);
      g.fillStyle = h < 0.33 ? '#9a876b' : h < 0.66 ? '#8a785e' : '#a28f72';
      g.fillRect(Math.max(0, x) + 0.04, y + 0.04, Math.min(1.12, len - x), 0.33);
    }
  }
  g.fillStyle = '#c3b090'; g.fillRect(0, -0.02, len, 0.16);                    // the coping stones
  const w = g.createLinearGradient(0, 0.45, 0, 1.2);                           // wet and green at the water
  w.addColorStop(0, 'rgba(40,52,44,0)'); w.addColorStop(1, 'rgba(32,48,40,0.85)');
  g.fillStyle = w; g.fillRect(0, 0.45, len, 0.77);
  g.restore();
}

// a folding wooden chair, as one sees it from behind a row
function chair(g) {
  g.strokeStyle = '#5a4532'; g.lineWidth = 0.035; g.lineCap = 'round';
  g.beginPath();
  g.moveTo(-0.2, 0); g.lineTo(-0.18, -0.86); g.moveTo(0.2, 0); g.lineTo(0.18, -0.86);
  g.moveTo(-0.2, -0.02); g.lineTo(0.16, -0.44); g.moveTo(0.2, -0.02); g.lineTo(-0.16, -0.44);
  g.stroke();
  g.fillStyle = '#6b5440';
  g.fillRect(-0.2, -0.86, 0.4, 0.12); g.fillRect(-0.2, -0.66, 0.4, 0.06); g.fillRect(-0.22, -0.47, 0.44, 0.04);
}

// a seated spectator seen from behind: kind 0 a man in a cap, 1 a woman in a headscarf
function spectator(g, kind, top, coat) {
  g.fillStyle = coat;
  g.beginPath();
  g.moveTo(-0.22, -0.44); g.quadraticCurveTo(-0.25, -0.9, -0.17, -1.02); g.quadraticCurveTo(0, -1.1, 0.17, -1.02);
  g.quadraticCurveTo(0.25, -0.9, 0.22, -0.44); g.closePath(); g.fill();
  g.fillStyle = '#2a211b'; g.beginPath(); g.ellipse(0, -1.16, 0.095, 0.11, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = top;
  if (kind === 0) { g.beginPath(); g.ellipse(0, -1.23, 0.11, 0.055, 0, Math.PI, 0); g.fill(); g.fillRect(-0.12, -1.24, 0.24, 0.025); }
  else { g.beginPath(); g.moveTo(-0.12, -1.06); g.quadraticCurveTo(-0.12, -1.3, 0, -1.29); g.quadraticCurveTo(0.12, -1.3, 0.12, -1.06); g.lineTo(0.06, -1.0); g.lineTo(-0.06, -1.0); g.fill(); }
}

// a fishing boat in profile with people in it (its stripe Sicilian), drawn about its waterline (y 0)
function boat(g, seed, folk) {
  const L = 4.6;
  g.fillStyle = '#3d3a3a';
  g.beginPath(); g.moveTo(-L / 2, -0.62); g.quadraticCurveTo(-L / 2 + 0.2, 0.1, -0.6, 0.12); g.lineTo(0.8, 0.12);
  g.quadraticCurveTo(L / 2 - 0.1, 0.05, L / 2 + 0.1, -0.78); g.lineTo(L / 2 - 0.15, -0.6); g.lineTo(-L / 2 + 0.1, -0.5); g.closePath(); g.fill();
  g.fillStyle = hash(seed, 2) < 0.5 ? '#2e5a7a' : '#8a3a30';
  g.fillRect(-L / 2 + 0.25, -0.5, L - 0.45, 0.09);
  g.fillStyle = '#d9cdb4'; g.fillRect(-L / 2 + 0.2, -0.6, L - 0.4, 0.05);
  g.strokeStyle = '#2a2622'; g.lineWidth = 0.03; g.beginPath(); g.moveTo(L / 2 + 0.1, -0.78); g.lineTo(L / 2 + 0.16, -1.0); g.stroke();
  for (let i = 0; i < folk; i++) {
    const x = -1.2 + i * 1.05 + hash(seed * 7 + i, 3) * 0.3;
    g.save(); g.translate(x, -0.08); g.scale(0.92, 0.92);
    spectator(g, (seed + i) % 2, i % 2 ? '#4b3f39' : '#3a3836', ['#2e3338', '#463a33', '#353a44'][i % 3]);
    g.restore();
  }
}

// one frame of an old black-and-white film on a w×h rectangle at (x, y) — `romance`: a man in a hat and a woman at
// a window, in profile, against the light; no faces
function film(g, name, x, y, w, h) {
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
  const bg = g.createLinearGradient(x, y, x + w, y + h);
  bg.addColorStop(0, '#9c9a94'); bg.addColorStop(0.6, '#cfccc4'); bg.addColorStop(1, '#7b7974');
  g.fillStyle = bg; g.fillRect(x, y, w, h);
  // the window: bright panes, dark bars, a curtain
  const wx = x + w * 0.58, wy = y + h * 0.12, ww = w * 0.3, wh = h * 0.62;
  g.fillStyle = '#efede6'; g.fillRect(wx, wy, ww, wh);
  g.fillStyle = '#4a4844'; g.fillRect(wx + ww / 2 - w * 0.008, wy, w * 0.016, wh); g.fillRect(wx, wy + wh * 0.45, ww, h * 0.02);
  g.fillStyle = 'rgba(80,78,74,0.55)'; g.fillRect(wx - w * 0.04, wy - h * 0.04, w * 0.06, wh + h * 0.08);
  // the woman at the window, in profile, facing left
  g.fillStyle = '#262422';
  const fx = wx + ww * 0.42, fy = y + h;
  g.beginPath();
  g.moveTo(fx - w * 0.07, fy); g.lineTo(fx - w * 0.05, fy - h * 0.42); g.quadraticCurveTo(fx - w * 0.04, fy - h * 0.55, fx, fy - h * 0.56);
  g.quadraticCurveTo(fx + w * 0.045, fy - h * 0.55, fx + w * 0.05, fy - h * 0.4); g.lineTo(fx + w * 0.08, fy); g.fill();
  g.beginPath(); g.ellipse(fx - w * 0.005, fy - h * 0.63, w * 0.03, h * 0.075, -0.15, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.ellipse(fx + w * 0.02, fy - h * 0.66, w * 0.035, h * 0.08, 0.3, 0, Math.PI * 2); g.fill();
  // the man in a hat, nearer, at the left, facing right
  const mx = x + w * 0.27;
  g.fillStyle = '#141312';
  g.beginPath(); g.moveTo(mx - w * 0.13, fy); g.lineTo(mx - w * 0.1, fy - h * 0.5); g.quadraticCurveTo(mx, fy - h * 0.62, mx + w * 0.09, fy - h * 0.5);
  g.lineTo(mx + w * 0.13, fy); g.fill();
  g.beginPath(); g.ellipse(mx + w * 0.01, fy - h * 0.7, w * 0.04, h * 0.1, 0.1, 0, Math.PI * 2); g.fill();
  g.fillRect(mx - w * 0.065, fy - h * 0.8, w * 0.15, h * 0.025);
  g.beginPath(); g.ellipse(mx + w * 0.01, fy - h * 0.82, w * 0.045, h * 0.05, 0, Math.PI, 0); g.fill();
  // the film's own darkened corners
  const v = g.createRadialGradient(x + w / 2, y + h / 2, h * 0.3, x + w / 2, y + h / 2, w * 0.62);
  v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(10,10,10,0.55)');
  g.fillStyle = v; g.fillRect(x, y, w, h);
  g.restore();
}

// a car's profile, front at x < 0, the ground at y 0; old — a rounded black saloon of the fifties, new — a boxy
// eighties saloon
function carSide(g, type) {
  const old = type === 'old';
  const body = old ? '#17181d' : '#4b5363';
  g.fillStyle = body;
  g.beginPath();
  if (old) {
    g.moveTo(-2.12, -0.32); g.lineTo(-2.15, -0.62); g.quadraticCurveTo(-2.0, -0.86, -1.2, -0.92);
    g.lineTo(-0.62, -0.98); g.quadraticCurveTo(-0.35, -1.44, 0.15, -1.47); g.quadraticCurveTo(0.95, -1.47, 1.25, -1.05);
    g.quadraticCurveTo(1.95, -0.98, 2.12, -0.62); g.lineTo(2.1, -0.32);
  } else {
    g.moveTo(-2.25, -0.3); g.lineTo(-2.28, -0.78); g.lineTo(-1.05, -0.86); g.lineTo(-0.55, -1.36); g.lineTo(0.95, -1.38);
    g.lineTo(1.5, -0.92); g.lineTo(2.26, -0.86); g.lineTo(2.28, -0.3);
  }
  g.closePath(); g.fill();
  // windows
  g.fillStyle = '#1d2738';
  g.beginPath();
  if (old) { g.moveTo(-0.52, -0.98); g.quadraticCurveTo(-0.3, -1.36, 0.15, -1.38); g.quadraticCurveTo(0.85, -1.38, 1.1, -1.03); g.closePath(); }
  else { g.moveTo(-0.92, -0.9); g.lineTo(-0.5, -1.3); g.lineTo(0.9, -1.31); g.lineTo(1.38, -0.92); g.closePath(); }
  g.fill();
  g.fillStyle = body; g.fillRect(0.28, -1.4, 0.07, 0.5);
  // chrome line, door seams, handles
  g.fillStyle = old ? '#b8b6ae' : '#8d93a0'; g.fillRect(-2.0, -0.6, 4.0, 0.025);
  g.fillStyle = 'rgba(0,0,0,0.35)'; g.fillRect(-0.55, -0.92, 0.02, 0.6); g.fillRect(0.95, -0.95, 0.02, 0.62);
  // wheels
  for (const wx of old ? [-1.38, 1.32] : [-1.45, 1.42]) {
    g.fillStyle = '#0d0d0f'; g.beginPath(); g.arc(wx, -0.32, 0.32, 0, Math.PI * 2); g.fill();
    g.fillStyle = old ? '#c9c6bd' : '#7d828c'; g.beginPath(); g.arc(wx, -0.32, 0.13, 0, Math.PI * 2); g.fill();
  }
  if (old) { g.fillStyle = body; g.beginPath(); g.ellipse(-1.38, -0.55, 0.42, 0.24, 0, Math.PI, 0); g.fill(); g.beginPath(); g.ellipse(1.32, -0.55, 0.42, 0.24, 0, Math.PI, 0); g.fill(); }
}

return { G, landAt, carAt, byCar, road, paving, stoneFace, chair, spectator, boat, film, carSide };
