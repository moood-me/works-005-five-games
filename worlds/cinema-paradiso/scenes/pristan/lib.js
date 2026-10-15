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



// ---- the sky (the world's nebo): the moon over the sea a little right of the mole, far capes east and west ----
const SKY = { horizon: 0.55, round: true, moon: 7, glow: -50,
  coast: [[28, 112, 0.045, 3], [48, 140, 0.026, 7], [-160, -58, 0.03, 11]], villages: [40, 100, 9] };

// ---- the film of the scene (the world's beats): film(scene) → { <beat>: { from, after, run } } ----
// Metres: x across, z north (toward the sea); camera yaw — degrees right of north.
const brg = (a, b) => { const d = Math.atan2(b[0] - a[0], b[1] - a[1]) * 180 / Math.PI; return d < 0 ? d + 360 : d; };
const IDS = ['toto', 'elena', 'daughter', 'alfredo', 'banker', 'c1', 'c2', 'c3', 'c4'];
const SIT = { motion: 'seated', loop: true };
const cam = (x, z, yaw, h = 0, pitch = 0) => ({ camera_target: null, camera_x: x, camera_z: z, camera_yaw: yaw, camera_h: h, camera_pitch: pitch, camera_roll: 0, camera_look: 0 });
// a camera at `at` looking at `to` (its yaw the bearing, −180…180)
const look = (at, to, h = 0, pitch = 0) => cam(at[0], at[1], +((brg(at, to) + 540) % 360 - 180).toFixed(1), h, pitch);
// places
const P = {
  EL_NOW: [-1.55, 58.35],             // 1988: Elena by the left headlamp of her car, the sea ahead
  SAL_STOP: [-1.45, 51.2],            // he stops ten paces off
  SAL_MEET: [-1.5, 56.9],             // two steps nearer: they stand a stride and a half apart
  SAL_ASK: [-1.52, 57.45],
  EL_BY: [-1.0, 59.5],                // she goes back to the car's front corner
  EL_DOOR: [1.25, 56.6],              // round the car's front to the driver's door (east side): hidden by the car
  HUG_T: [2.2, 59.55], HUG_E: [2.2, 58.95],   // the hug at the lantern: he north (his back to the sea), she south of him
};
function film(scene) {
  const CH = scene.kit.cast.characters;
  const CAM = {
    wide: cam(3.5, -1.0, -8, 0.5, 3),                     // the summer cinema: the beam over the chairs, the screen, the boats, the moon
    close: look([-0.5, 6.2], [-2.6, 9.6], -0.1, 2),           // Toto at the projector, Elena on her crate, the screen beyond
    head: look([-4.6, 12.6], [2.2, 2.6], 0, 0),           // behind Toto toward the quay: the car comes in the rain
    found: cam(1.0, 41, 2, 0.2, 1),                       // down the mole to Toto on his bollard by the lantern
    hug: look([5.3, 60.7], [2.2, 59.25], -0.1, 3),          // from the head's corner by the lantern: her face over his shoulder, lit
    alone: cam(1.6, 51.5, 6, 0.2, 2),                     // Toto alone, his back, the sea and the moon's path
    back: look([-3.0, 6.3], [-5.05, 7.6], -0.5, -1),  // the bench at dusk: Alfredo and Toto, faces 3/4, the mole and the sea behind
    carNow: look([0.4, 45.2], [-1.0, 58.4], 0.1, 1),      // 1988: the car on the head, Elena by it; the daughter goes; he comes
    meet: look([-5.3, 57.55], [-1.5, 57.6], -0.1, 1),     // from the west edge of the head, side on: the two in the headlamps' glow
    alone_now: look([-5.0, 51.4], [0.6, 59.4], 0.1, 2),   // he alone on the head, the lantern beyond him, the lamps going down the mole
  };
  // the keys a beat starts from
  const carKeys = (type, arrive = 1, go = 0) => {
    if (type !== 'old' && type !== 'new') return { car: 'none', car_arrive: 1, car_go: 0, headlights: 0 };
    const c = carAt(type, arrive, go);
    return { car: type, car_arrive: arrive, car_go: go, car_a: c.x, car_d: c.z, car_f: c.h };
  };
  const base = (era, hour) => ({
    era, hour, dusk_k: hour < 0.84 ? 1 : 0, now_k: era === 'now' ? 1 : 0,
    rain: 0, screen_up: 0, screen_film: 'romance', beam_on: 0, cover: 0, crowd: 0, boats_out: 1, headlights: 0,
    ...carKeys('none'),
  });
  // who is here and how: { id: { at, turn, do, look, reach, wear, with, mood } }; the others not here
  function cast(who) {
    const o = {};
    for (const id of IDS) {
      const p = who[id];
      o[id + '_here'] = !!p;
      if (!p) continue;
      o[id + '_a'] = p.at[0]; o[id + '_d'] = p.at[1];
      o[id + '_turn'] = p.turn ?? 180; o[id + '_do'] = p.do || 'stand';
      o[id + '_look'] = p.look ?? null; o[id + '_reach'] = p.reach ?? null; o[id + '_gait'] = null;
      o[id + '_mood'] = p.mood ?? 'neutral';
      if (id === 'toto' || id === 'elena') o[id + '_wear'] = p.wear ?? null;
      if (id === 'toto') o.toto_with = p.with ?? null;
    }
    return o;
  }
  const audience = () => ({
    c1: { at: G.C_SEATS.c1, turn: 0, do: SIT }, c2: { at: G.C_SEATS.c2, turn: 0, do: SIT },
    c3: { at: G.C_SEATS.c3, turn: 0, do: SIT }, c4: { at: G.C_SEATS.c4, turn: 0, do: SIT },
  });
  const letter = () => (scene.get('letter_in_hand') === 1 ? ['letter_sheet'] : null);
  // the banker's car where it stands; Elena's way to it, the banker round it
  const OLD = (side, fwd) => byCar('old', 1, 0, side, fwd);
  const EL_TURN = OLD(-0.45, 2.7), EL_DOOR = OLD(-1.35, 0.2), BK_IN = OLD(-1.3, -0.7), BK_BACK = OLD(0, -2.9), BK_OUT = OLD(1.5, -0.6);
  // the reverse on Elena turning at the car: from the side of the mole, Toto behind the camera, 4.2 m off her
  CAM.turn = (() => {
    const dx = G.TOTO_PROJ[0] - EL_TURN[0], dz = G.TOTO_PROJ[1] - EL_TURN[1], d = Math.hypot(dx, dz);
    const at = [EL_TURN[0] + dx / d * 3.7 + dz / d * 0.5, EL_TURN[1] + dz / d * 3.7 - dx / d * 0.5];
    return look(at, EL_TURN, -0.1, 1);
  })();
  const RUN = {
    c1: [[-3.6, 13.6], [-4.5, 11.6], [-4.95, 10.6]], c2: [[-2.6, 13.8], [-4.3, 12.0], [-4.95, 10.9]],
    c3: [[-0.4, 13.6], [-3.9, 12.6], [-4.95, 10.3]], c4: [[0.6, 13.9], [-3.6, 13.0], [-4.95, 11.1]],
  };
  const goSeconds = (type, speed) => { const r = road(type); return (r.L - r.park) / speed; };
  const nowWear = { toto: CH.salvatore, elena: CH.elena_grown };
  // the camera moved to a shot over `over` seconds (an operator's glide, not a cut)
  const glide = (s, shot, over) => {
    for (const [k, v] of Object.entries(shot)) if (typeof v === 'number') s.move(k, v, { over, ease: 'inOut' });
  };

  const B = {
    // the summer cinema on the pier; at 12 s the rain; the audience runs; the close shot at the projector
    summer: {
      from: () => ({ ...base('past', 0.9), screen_up: 1, beam_on: 1, crowd: 1, boats_out: 0,
        ...cast({ toto: { at: G.TOTO_PROJ, turn: 5, look: 'screen#screen', mood: 'smile' },
          elena: { at: G.CRATE, turn: 340, do: SIT, look: 'screen#screen', mood: 'smile' }, ...audience() }),
        ...CAM.wide }),
      run: async s => {
        const toto = s.person('toto'), elena = s.person('elena');
        const close = s.shot(CAM.close);
        await s.wait(3); s.tell('summer:screen');
        await s.wait(9);
        s.move('rain', 1, { over: 3, ease: 'in' }); s.tell('summer:rain');
        s.move('crowd', 0, { over: 3.5 }); s.move('boats_out', 1, { over: 10, ease: 'inOut' });
        toto.look([G.TOTO_PROJ[0] + 0.4, G.TOTO_PROJ[1] + 3, 6]); toto.mood('surprised'); elena.mood('surprised');
        const runs = ['c1', 'c2', 'c3', 'c4'].map(async (id, i) => {
          const p = s.person(id);
          await s.wait(0.2 + i * 0.35 + s.random() * 0.4);
          await p.go('rise', { from: G.C_SEATS[id], turn: 0 });
          p.gait('run');
          await p.walk(RUN[id]);
          p.here(false);
        });
        await s.wait(1.6);
        close.cut();
        toto.look('projector'); elena.look('toto'); elena.mood('laugh');
        await Promise.all(runs);
        await s.wait(0.6);
      },
    },
    // Toto draws the tarp over the projector; the beam goes; Elena gets up and stands by him in the rain
    covered: {
      after: ['summer'],
      from: () => ({ ...base('past', 0.9), screen_up: 1, beam_on: 1, rain: 1, crowd: 0, boats_out: 1,
        ...cast({ toto: { at: G.TOTO_PROJ, turn: 5, look: 'projector' }, elena: { at: G.CRATE, turn: 340, do: SIT, look: 'toto', mood: 'laugh' } }), ...CAM.close }),
      run: async s => {
        const toto = s.person('toto'), elena = s.person('elena');
        toto.look('projector#tarp'); toto.reach({ r: 'projector#tarp', l: 'projector#tarp' }); toto.do('pull_cover');
        const her = (async () => {
          await s.wait(0.6);
          await elena.go('rise', { from: G.CRATE, turn: 340 });
          await elena.walk([G.ELENA_BY]);
          await elena.turn(brg(G.ELENA_BY, G.TOTO_PROJ));
          elena.look('toto');
        })();
        await s.wait(0.3);
        const cover = s.move('cover', 1, { over: 2.8, ease: 'inOut' });
        await s.wait(1.7); s.move('beam_on', 0, { over: 1.0 });
        await cover;
        toto.reach(null); toto.do('stand'); toto.look('elena'); toto.mood('smile');
        await s.wait(0.5); s.tell('covered:done');
        await her;
      },
    },
    // a black car on the quay, its headlamps through the rain; the father; she goes to it, turns at the door, gets in;
    // the car goes
    headlights: {
      after: ['covered'],
      from: () => ({ ...base('past', 0.9), screen_up: 1, rain: 1, cover: 1, boats_out: 1,
        ...cast({ toto: { at: G.TOTO_PROJ, turn: 120, look: 'elena' }, elena: { at: G.ELENA_BY, turn: 290, look: 'toto' } }),
        banker_a: BK_IN[0], banker_d: BK_IN[1], ...carKeys('old', 0, 0), headlights: 1, ...CAM.head }),
      run: async s => {
        const toto = s.person('toto'), elena = s.person('elena'), banker = s.person('banker');
        // following `covered`: the car is put at the quay's end, then the cut over Toto's shoulder
        if (s.get('car') !== 'old') s.cut({ ...carKeys('old', 0, 0), headlights: 1, banker_here: false, banker_a: BK_IN[0], banker_d: BK_IN[1], ...CAM.head });
        const turnShot = s.shot(CAM.turn);
        toto.look('car_front'); toto.mood('thinking'); elena.mood('afraid');
        s.move('car_arrive', 1, { over: 3.2, ease: 'out' });
        await s.wait(1.4);
        elena.look('car_front');
        const walk = elena.walk([[-0.6, 5.2], [1.2, 3.0], EL_TURN]);
        await s.wait(1.6);
        s.tell('headlights:father');
        banker.here(true);
        const him = (async () => { await banker.walk([BK_BACK, BK_OUT]); await banker.turn(brg(BK_OUT, G.TOTO_PROJ)); })();
        await walk;
        turnShot.cut();
        await elena.turn(brg(EL_TURN, G.TOTO_PROJ)); elena.look('toto'); elena.mood('sad'); toto.look('elena');
        s.tell('headlights:turn');
        await s.wait(4.2);
        const backShot = s.shot(CAM.head);
        await elena.walk([EL_DOOR]); elena.here(false);
        await him;
        await banker.walk([BK_BACK, BK_IN]); banker.here(false);
        backShot.cut();
        toto.look('car_back'); toto.mood('sad');
        s.move('car_go', 1, { over: goSeconds('old', 8), ease: 'in' });
        await s.wait(2.8);
      },
    },
    // the night: Toto on the bollard by the lantern, his back; Elena runs down the mole; he gets up; they hold each
    // other at the lantern — her face over his shoulder, in its light
    found: {
      from: () => ({ ...base('past', 0.9),
        ...cast({ toto: { at: G.BOLLARD, turn: 0, do: SIT, mood: 'sad', look: [3.5, 90, 3] }, elena: { at: [-0.8, 37.5], turn: 0, mood: 'laugh' } }), ...CAM.found }),
      run: async s => {
        const toto = s.person('toto'), elena = s.person('elena');
        const hug = s.shot(CAM.hug);
        elena.gait('run');
        const run = elena.walk([[-0.3, 50], [1.4, 56.4], P.HUG_E]);
        s.move('camera_z', 51.6, { over: 6.5, ease: 'inOut' });
        s.move('camera_x', 1.3, { over: 6.5, ease: 'inOut' });
        await s.wait(3); s.tell('found:run');
        await s.wait(0.8);
        toto.look('elena');
        await toto.go('rise', { from: G.BOLLARD, turn: 0 });
        await toto.walk([P.HUG_T]);
        await toto.turn(180); toto.mood('surprised');
        await run; elena.gait(null);
        await elena.turn(0); elena.look('toto');
        hug.cut();
        toto.reach({ r: 'elena#back', l: 'elena#back' }); elena.reach({ r: 'toto#nape', l: 'toto#nape' });
        toto.look([P.HUG_E[0] + 0.3, P.HUG_E[1] - 1, 1.4]); elena.look([5.3, 60.7, 1.5]); toto.mood('smile');
        await s.wait(1.2); s.tell('found:hug');
        await s.wait(7);
      },
    },
    // Toto alone on the bollard, his back; the sea, the moon's path
    alone: {
      from: () => ({ ...base('past', 0.9), ...cast({ toto: { at: G.BOLLARD, turn: 0, do: SIT, mood: 'sad', look: [3.5, 90, 3] } }), ...CAM.alone }),
      run: async s => {
        s.move('camera_z', CAM.alone.camera_z + 1.2, { over: 10, ease: 'inOut' });
        await s.wait(6); s.tell('alone:sea');
        await s.wait(3.5);
      },
    },
    // dusk: blind Alfredo on the bench, hands on his cane; Toto (18) comes and sits by him — with her letter on his
    // knees when there is one; Alfredo turns his head to him as he speaks (≈ 12 s). The pose under the choice `stay`
    back: {
      from: () => ({ ...base('past', 0.78),
        ...cast({ alfredo: { at: G.BENCH_A, turn: 90, do: { motion: 'cane_sit', loop: true }, mood: 'sad', look: [4, 30, 1] },
          toto: { at: [-2.9, 7.4], turn: 270, with: letter(), mood: 'thinking' } }), ...CAM.back }),
      run: async s => {
        const toto = s.person('toto'), alf = s.person('alfredo');
        await toto.go('sit_down', { to: G.BENCH_B, turn: 90 });
        toto.do('seated', { loop: true });
        s.tell('back:sat');
        toto.look(letter() ? [G.BENCH_B[0] + 0.45, G.BENCH_B[1], 0.5] : [4, 26, 0.8]);
        await s.wait(8);
        alf.look('toto'); toto.look('alfredo');
        await s.wait(9);
      },
    },
    // Toto gets up (the letter into his shirt's pocket), his hand on Alfredo's shoulder, and walks away to the road
    rise_go: {
      after: ['back'],
      from: () => ({ ...base('past', 0.78),
        ...cast({ alfredo: { at: G.BENCH_A, turn: 90, do: { motion: 'cane_sit', loop: true }, look: 'toto', mood: 'sad' },
          toto: { at: G.BENCH_B, turn: 90, do: SIT, with: letter(), look: 'alfredo', mood: 'thinking' } }), ...CAM.back }),
      run: async s => {
        const toto = s.person('toto'), alf = s.person('alfredo');
        toto.with(null);
        await toto.go('rise', { from: G.BENCH_B, turn: 90 });
        toto.look('alfredo'); toto.reach({ r: 'alfredo#shoulder_l' });
        await s.wait(1.8);
        toto.reach(null); toto.look(null); alf.look('toto');
        const away = toto.walk([[-2.4, 5.6], [0.2, 2.4], [4.5, -2.5]]);
        await s.wait(3.4); s.tell('rise_go:gone');
        await away; toto.here(false);
      },
    },
    // 1988, night: Elena's car on the head, its lamps on the sea; she by it, her back to us; the daughter talks to her
    // and goes; Salvatore comes up the mole and stops ten paces off. Under the touch (`elena`)
    car: {
      from: () => ({ ...base('now', 0.9), ...carKeys('new', 1, 0), headlights: 1,
        ...cast({ elena: { at: P.EL_NOW, turn: 0, wear: nowWear.elena, look: [-1, 75, 0] },
          daughter: { at: [-0.9, 57.2], turn: 340, look: 'elena', mood: 'smile' },
          toto: { at: [2.2, 40.5], turn: 345, wear: nowWear.toto, mood: 'tired' } }), ...CAM.carNow }),
      run: async s => {
        const sal = s.person('toto'), d = s.person('daughter'), el = s.person('elena');
        await s.wait(2.2);
        el.look('daughter');
        await s.wait(1.2);
        const her = (async () => { await d.walk([[-2.3, 52.5], [-2.6, 44.5], [-3.0, 38]]); d.here(false); })();
        el.look([-1, 75, 0]);
        await s.wait(1.6);
        await sal.walk([[0.2, 46.5], P.SAL_STOP]);
        await sal.turn(brg(P.SAL_STOP, P.EL_NOW)); sal.look('elena'); sal.mood('surprised');
        await her;
        await s.wait(1);
      },
    },
    // she turns to him, he comes two steps nearer; the camera comes round to the side, the headlamps' glow on their
    // faces. The pose under the choice `ask`
    meet: {
      after: ['car'],
      from: () => ({ ...base('now', 0.9), ...carKeys('new', 1, 0), headlights: 1,
        ...cast({ elena: { at: P.EL_NOW, turn: 0, wear: nowWear.elena },
          toto: { at: P.SAL_STOP, turn: brg(P.SAL_STOP, P.EL_NOW), wear: nowWear.toto, look: 'elena', mood: 'surprised' } }), ...CAM.carNow }),
      run: async s => {
        const el = s.person('elena'), sal = s.person('toto');
        glide(s, CAM.meet, 3.2);
        await s.wait(0.4);
        await el.turn(brg(P.EL_NOW, P.SAL_MEET)); el.look('toto'); el.mood('smile'); s.tell('meet:turned');
        await s.wait(0.8);
        await sal.walk([P.SAL_MEET]); await sal.turn(brg(P.SAL_MEET, P.EL_NOW)); sal.look('elena'); sal.mood('tired');
        await s.wait(1.5); el.mood('sad');
        await s.wait(2);
      },
    },
    // he steps to her; she lays her palm on his chest, holds it, and goes back to the car
    ask: {
      after: ['meet'],
      from: () => ({ ...B.meet.from(), ...CAM.meet,
        ...cast({ elena: { at: P.EL_NOW, turn: brg(P.EL_NOW, P.SAL_MEET), wear: nowWear.elena, look: 'toto', mood: 'sad' },
          toto: { at: P.SAL_MEET, turn: brg(P.SAL_MEET, P.EL_NOW), wear: nowWear.toto, look: 'elena', mood: 'tired' } }) }),
      run: async s => {
        const el = s.person('elena'), sal = s.person('toto');
        await sal.walk([P.SAL_ASK]); await sal.turn(brg(P.SAL_ASK, P.EL_NOW));
        el.reach({ r: 'toto#chest' }); sal.mood('sad');
        await s.wait(1.2); s.tell('ask:hand');
        await s.wait(2.6);
        el.reach(null);
        await el.walk([P.EL_BY]);
      },
    },
    // he steps back; she nods — down, and up at him again — and goes back to the car
    bye: {
      after: ['meet'],
      from: () => B.ask.from(),
      run: async s => {
        const el = s.person('elena'), sal = s.person('toto');
        await sal.walk([[P.SAL_MEET[0], P.SAL_MEET[1] - 0.55]], { steps: false });
        el.look([P.SAL_MEET[0], P.SAL_MEET[1] + 0.6, 0.3]); el.mood('smile');
        await s.wait(1.0);
        el.look('toto'); s.tell('bye:nod');
        await s.wait(2.2);
        await el.walk([P.EL_BY]);
      },
    },
    // she gets into the car (round its front, the far side), the lamps go round the head and down the mole; he alone
    parting: {
      after: ['ask', 'bye'],
      from: () => ({ ...B.meet.from(), ...CAM.meet,
        ...cast({ elena: { at: P.EL_BY, turn: 90, wear: nowWear.elena },
          toto: { at: P.SAL_MEET, turn: brg(P.SAL_MEET, P.EL_NOW), wear: nowWear.toto, look: 'elena', mood: 'tired' } }) }),
      run: async s => {
        const el = s.person('elena'), sal = s.person('toto');
        await el.walk([[0.3, 59.8], [1.3, 58.4], P.EL_DOOR]);
        el.here(false);
        sal.look('car_side_l'); sal.mood('sad');
        s.move('car_go', 1, { over: goSeconds('new', 6.5), ease: 'in' });
        await s.wait(3.5);
        glide(s, CAM.alone_now, 5);
        await s.wait(6); s.tell('parting:gone');
        sal.look([-1.5, 75, 0.5]);
        await s.wait(2);
      },
    },
  };
  return B;
}

return { G, landAt, carAt, byCar, road, paving, stoneFace, chair, spectator, boat, carSide, SKY, P, film };
