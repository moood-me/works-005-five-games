// The prairie — what the scene's elements, script and film share: the plan of the line across the winter plain (the gorge
// and the Medicine Bow bridge on the left, the open plain in the middle, the station by Fort Kearney on the right), the
// land, the painters of what several elements draw (the train's sides, wheels, the trestle, the track, the riders, the
// wolves), and the film in beats (film(scene), for the world's module beats).
//   Metres: `across` along the line (the train runs toward +across: east, to Omaha), `distance` away from the viewer,
// across the line; the rails lie at distance 22. The viewer stands on the near side; camera_x carries the view along.
const { mixc, rgba, css } = kit.light;

const plan = {
  track: 22,
  gauge: 1.44,
  // the gorge the bridge crosses: its middle, its half-width at the rim and at the bed, its depth; far out on the plain
  // it closes (end0 … end1 metres away)
  gorge: { x: -260, top: 30, bed: 7, depth: 30, end0: 160, end1: 240 },
  // the bridge, rim to rim (its deck at the line's level), and the middle span that breaks (in the bridge's metres)
  bridge: [-292, -228],
  breaks: [-11, 11],
  // the station: the platform (near side of the line), the lamp, the depot; the fort beyond the line, its gate
  platform: { x0: 196, x1: 256, d0: 16.4, d1: 20.4, h: 0.5 },
  lamp: [221.2, 17.0],
  depot: [186, 14.5],
  fort: { x: 150, d: 75, gate: 160 },
  // metres a second at `speed` 1 and `sl_speed` 1
  pace: 18,
  sailPace: 14,
  // the train: the engine's anchor at the tender's back end (the engine ahead to +20.6); the cars' anchor at their front
  // end, three cars back to −48.1; coupled, the cars stand `gap` behind the tender
  gap: 0.6,
  cars: { n: 3, len: 15.5, pitch: 16.3 },
  // the chains Passepartout goes by under the first car (the cars' metres), between its trucks and near enough that the
  // next is in the frame with him: c0 … c2 under its middle, c3 the coupling with the tender
  chains: [-9.6, -7.6, -5.6, 0.3],
  // the near side of the train, from the rails' middle
  side: 1.42,
};
const clamp01 = v => anim.clamp(typeof v === 'number' && Number.isFinite(v) ? v : 0, 0, 1);
const mod = (x, n) => ((x % n) + n) % n;
const TAU = Math.PI * 2;

// The land: level snow; the gorge cut across the line (closing far out on the plain); gentle swells far off, none by the
// gorge. 0 where the viewer stands and all along the line. (The relief asks it thousands of times a frame: arithmetic only.)
function ground(across, d) {
  const G = plan.gorge, x = Math.abs(across - G.x);
  let h = 0, edge = 1;
  if (x < G.top + 40) {
    const reach = 1 - anim.ease.smooth(anim.clamp((d - G.end0) / (G.end1 - G.end0), 0, 1));
    if (x < G.top) h = -G.depth * reach * (1 - anim.ease.smooth(anim.clamp((x - G.bed) / (G.top - G.bed), 0, 1)));
    edge = 1 - reach * (1 - anim.clamp((x - G.top) / 40, 0, 1));
  }
  const far = anim.clamp((d - 70) / 90, 0, 1);
  return h + edge * far * (2.2 * Math.sin(across * 0.011 + 1.3) * Math.sin(d * 0.017) + 1.4 * Math.sin(across * 0.023 - d * 0.009));
}

// How far the plain has run past, metres — the train «on the spot» (speed) or the sledge (sl_speed): each running thing's
// animate adds it up in its own e.mem (e.mem.v — the metres a second now). Things run back along the line by it.
function advance(e) {
  const m = e.mem, st = e.state;
  m.v = clamp01(st.speed) * plan.pace + clamp01(st.sl_speed) * plan.sailPace;
  m.run = ((m.run ?? 0) + m.v * e.dt) % 1e5;
  return m.run;
}

// where Passepartout's hands are under the cars at `pp_car` (0 at c0 … 3 at the coupling), x in the cars' metres
function ppX(v) {
  const C = plan.chains, k = anim.clamp(typeof v === 'number' ? v : 0, 0, 3), i = Math.min(2, Math.floor(k));
  return C[i] + (C[i + 1] - C[i]) * (k - i);
}

// The sledge's sail: its facing for the sheet (0 let out … 1 hauled in) and the wind (−1 from the left of the sledge —
// the far side, north —, 0 from astern, 1 from its right, the near side): the boom swings to leeward, 75° out let go,
// 12° hauled in. Facing 180 — along the sledge, the boom astern.
function sailFace(sheet, wind) {
  const a = 12 + 63 * (1 - clamp01(sheet));
  return 180 + ((wind ?? 0) >= 0 ? a : -a);
}

// ── painting helpers (the element's metres, y down) ──
const R = (g, x0, y0, x1, y1, c) => { g.fillStyle = c; g.fillRect(x0, y0, x1 - x0, y1 - y0); };
const P = (g, pts, c) => {
  g.fillStyle = c;
  g.beginPath();
  g.moveTo(pts[0], pts[1]);
  for (let i = 2; i < pts.length; i += 2) g.lineTo(pts[i], pts[i + 1]);
  g.closePath();
  g.fill();
};
const C = (g, x, y, r, c) => { g.fillStyle = c; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); };
const dim = (c, k) => css(mixc(c, '#20232a', k));
// a painted text a person reads (tr'd by the caller), centred, at a size in metres
function text(g, s, x, y, size, c, weight = '600') {
  g.save();
  g.translate(x, y);
  g.scale(size / 100, size / 100);
  g.font = `${weight} 100px Georgia, serif`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillStyle = c;
  g.fillText(s, 0, 0);
  g.restore();
}
// a spoked wheel round (0, 0)
function wheel(g, r, body, spokes = 12) {
  C(g, 0, 0, r, '#26231f');
  C(g, 0, 0, r * 0.87, body);
  C(g, 0, 0, r * 0.75, '#1d1b19');
  g.strokeStyle = body;
  g.lineWidth = r * 0.11;
  g.beginPath();
  for (let i = 0; i < spokes; i++) {
    const a = (i / spokes) * TAU, c = Math.cos(a), s = Math.sin(a);
    g.moveTo(c * r * 0.18, s * r * 0.18);
    g.lineTo(c * r * 0.8, s * r * 0.8);
  }
  g.stroke();
  C(g, 0, 0, r * 0.22, body);
  C(g, 0, 0, r * 0.09, '#c9a24a');
}
// a wheel as a layer turning about its axle (animate: e.layer(name).rotate)
const wheelLayer = (e, name, x, y, r, body, spokes) =>
  e.layer(name, { pivot: [x, y], box: [x - r - 0.02, y - r - 0.02, x + r + 0.02, y + r + 0.02] }, g => { g.translate(x, y); wheel(g, r, body, spokes); });

// ── the engine: an American 4-4-0 of 1870 and its tender, side-on (the engine's metres: x from the tender's back end
// forward, y up from the rails' top negative). far — the far side, seen only under the boiler and through the cab ──
const LOCO = {
  drivers: [[11.4, 0.8], [13.5, 0.8]], truck: [[15.95, 0.42], [17.25, 0.42]], tender: [[1.08, 0.42], [2.32, 0.42], [4.68, 0.42], [5.92, 0.42]],
  crank: 0.35, rodEnd: [16.2, -1.25],
};
// the wheels' radii in the order of their layers w0…w7
LOCO.radii = [...LOCO.drivers, ...LOCO.truck, ...LOCO.tender].map(w => w[1]);
const LC = { tender: '#2f5a3e', cab: '#8f3d26', boiler: '#45556a', iron: '#25272b', frame: '#2a2622', brass: '#c9a24a', red: '#a3302a', rod: '#9a9ea4' };
function paintLoco(g, e, far) {
  const c = far ? k => dim(LC[k], 0.35) : k => LC[k];
  // the tender: its frame, its tank, the coal heaped on it
  R(g, 0.1, -1.3, 6.9, -1.05, c('frame'));
  R(g, 0.25, -3.0, 6.75, -2.88, dim(LC.tender, far ? 0.5 : 0.25));
  R(g, 0.3, -2.9, 6.7, -1.3, c('tender'));
  if (!far) {
    P(g, [0.7, -2.95, 1.4, -3.35, 2.6, -3.55, 3.8, -3.42, 5.0, -3.6, 6.0, -3.35, 6.4, -2.95], '#242220');
    g.fillStyle = '#e9eef4';
    for (const [x, y, rx] of [[1.6, -3.36, 0.35], [2.7, -3.55, 0.5], [3.9, -3.43, 0.35], [5.0, -3.6, 0.45]]) { g.beginPath(); g.ellipse(x, y, rx, 0.05, 0, 0, TAU); g.fill(); }
    g.strokeStyle = LC.brass;
    g.lineWidth = 0.05;
    g.strokeRect(0.5, -2.75, 6.0, 1.3);
    text(g, tr('Union Pacific').toUpperCase(), 3.5, -2.1, 0.34, LC.brass);
  }
  for (const cx of [1.7, 5.3]) {
    R(g, cx - 1.05, -0.95, cx + 1.05, -0.7, c('frame'));
    R(g, cx - 0.25, -1.1, cx + 0.25, -0.6, c('frame'));
  }
  // the cab: its walls round a big window (open: who is in it is seen), its roof with snow on it
  R(g, 7.3, -1.5, 10.2, -1.05, c('frame'));
  // (the cab's back is open — the gangway to the tender: who stands there is seen whole)
  g.fillStyle = c('cab');
  g.beginPath();
  g.rect(8.15, -3.95, 2.05, 2.45);
  g.rect(8.4, -3.45, 1.55, 1.15);
  g.rect(7.1, -3.95, 1.05, 0.3);
  g.fill('evenodd');
  R(g, 7.1, -3.95, 7.2, -1.5, c('cab'));
  g.strokeStyle = far ? dim('#e9dcc0', 0.35) : '#e9dcc0';
  g.lineWidth = 0.07;
  g.strokeRect(8.4, -3.45, 1.55, 1.15);
  if (!far) {
    g.strokeStyle = LC.brass;
    g.lineWidth = 0.04;
    g.strokeRect(7.25, -2.15, 2.8, 0.55);
  }
  P(g, [6.95, -3.95, 10.45, -3.95, 10.4, -4.2, 7.0, -4.2], c('frame'));
  R(g, 7.0, -4.32, 10.4, -4.2, '#eef2f6');
  // the boiler (round: a little darker below), its brass bands, domes, bell, whistle
  const lg = g.createLinearGradient(0, -3.45, 0, -2.05);
  lg.addColorStop(0, far ? dim('#5a6b80', 0.35) : '#5a6b80');
  lg.addColorStop(0.35, c('boiler'));
  lg.addColorStop(1, far ? dim('#2c3644', 0.35) : '#2c3644');
  g.fillStyle = lg;
  g.fillRect(10.2, -3.45, 6.8, 1.4);
  if (!far) {
    for (const x of [11.6, 13.9, 16.2]) R(g, x - 0.05, -3.45, x + 0.05, -2.05, LC.brass);
    R(g, 10.3, -3.12, 16.9, -3.07, LC.brass);
    const dome = (x, w, h, col) => {
      g.fillStyle = col;
      g.beginPath();
      g.moveTo(x - w, -3.4);
      g.lineTo(x - w * 0.9, -3.4 - h * 0.6);
      g.quadraticCurveTo(x, -3.4 - h * 1.4, x + w * 0.9, -3.4 - h * 0.6);
      g.lineTo(x + w, -3.4);
      g.closePath();
      g.fill();
    };
    dome(12.6, 0.45, 0.55, LC.brass);
    dome(15.3, 0.36, 0.45, LC.boiler);
    R(g, 15.05, -3.9, 15.55, -3.82, LC.brass);
    R(g, 13.95, -3.75, 14.25, -3.45, '#3a3a3c');
    P(g, [13.92, -3.62, 13.98, -3.95, 14.22, -3.95, 14.28, -3.62], LC.brass);
    R(g, 10.4, -4.15, 10.5, -3.45, LC.brass);
  }
  // the smokebox and the funnel stack (its top: the smoke's point)
  R(g, 17.0, -3.6, 18.6, -1.9, c('iron'));
  R(g, 18.5, -3.62, 18.62, -1.88, far ? dim('#3a3d42', 0.35) : '#3a3d42');
  if (!far) {
    R(g, 17.58, -4.05, 18.02, -3.55, '#1f2125');
    P(g, [17.58, -4.05, 17.2, -4.8, 18.4, -4.8, 18.02, -4.05], '#1f2125');
    R(g, 17.15, -4.95, 18.45, -4.78, '#2c2f34');
    // the headlamp on its bracket
    R(g, 18.05, -3.75, 18.25, -3.55, '#2a2a2a');
    R(g, 17.95, -4.45, 18.7, -3.75, '#2f3a2c');
    g.strokeStyle = LC.brass;
    g.lineWidth = 0.04;
    g.strokeRect(18.0, -4.4, 0.65, 0.6);
    R(g, 18.25, -4.6, 18.4, -4.45, '#2f3a2c');
    e.light(18.72, -4.1, 0.3, '#ffe2a8', 1.0, 'lamp');
    // the firebox's glow on the cab's floor: it lights who is in the cab
    e.light(9.0, -1.9, 0.15, '#ff9a50', 0.6, 'fire');
    e.at(17.8, -5.0, 'chimney');
    e.at(9.2, -2.9, 'cab');
  }
  // the running board, the frame, the cylinder and its steam chest, the leading truck's frame
  R(g, 10.2, -1.95, 18.6, -1.85, far ? dim('#3a3836', 0.35) : '#3a3836');
  R(g, 10.2, -1.85, 18.6, -1.25, c('frame'));
  R(g, 16.4, -1.95, 17.7, -1.65, c('boiler'));
  R(g, 16.3, -1.65, 17.8, -0.95, c('boiler'));
  if (!far) {
    R(g, 16.3, -1.65, 16.4, -0.95, LC.brass);
    R(g, 17.7, -1.65, 17.8, -0.95, LC.brass);
    R(g, 15.95, -1.42, 17.6, -1.37, '#6e7176');
    R(g, 15.95, -1.13, 17.6, -1.08, '#6e7176');
    // brass splashers over the drivers
    g.fillStyle = LC.brass;
    for (const [x] of LOCO.drivers) { g.beginPath(); g.arc(x, -0.8, 0.96, Math.PI, TAU); g.arc(x, -0.8, 0.87, TAU, Math.PI, true); g.closePath(); g.fill(); }
  }
  R(g, 15.5, -0.75, 17.7, -0.55, c('frame'));
  // the pilot (cowcatcher) and its beam
  R(g, 18.6, -1.5, 18.95, -1.15, c('red'));
  P(g, [18.6, -1.15, 18.85, -1.15, 20.6, -0.06, 18.6, -0.06], c('red'));
  g.strokeStyle = dim(LC.red, far ? 0.6 : 0.4);
  g.lineWidth = 0.04;
  g.beginPath();
  for (let x = 18.75; x < 20.45; x += 0.22) { const top = x <= 18.85 ? -1.15 : -1.15 + ((x - 18.85) / 1.75) * 1.09; g.moveTo(x, top); g.lineTo(x, -0.06); }
  g.stroke();
  // the wheels, each a layer turning (animate)
  LOCO.drivers.forEach(([x, r], i) => wheelLayer(e, `w${i}`, x, -0.8, r, c('red'), 14));
  LOCO.truck.forEach(([x, r], i) => wheelLayer(e, `w${2 + i}`, x, -r, r, c('red'), 10));
  LOCO.tender.forEach(([x, r], i) => wheelLayer(e, `w${4 + i}`, x, -r, r, c('red'), 10));
  if (far) return;
  // the rods: the side rod coupling the drivers' crank pins, the main rod to the crosshead, the crosshead (animate)
  const k = LOCO.crank, [d0, d1] = LOCO.drivers, [hx, hy] = LOCO.rodEnd;
  e.layer('siderod', { box: [d0[0] - 0.2, -1.4, d1[0] + k + 0.8, -0.2] }, g => {
    R(g, d0[0] + k, -0.86, d1[0] + k, -0.74, LC.rod);
    C(g, d0[0] + k, -0.8, 0.09, LC.rod);
    C(g, d1[0] + k, -0.8, 0.09, LC.rod);
  });
  e.layer('main', { pivot: [d1[0] + k, -0.8], box: [d1[0] - 0.6, -2.2, hx + 0.9, 0.6] }, g => {
    g.strokeStyle = LC.rod;
    g.lineWidth = 0.12;
    g.lineCap = 'round';
    g.beginPath();
    g.moveTo(d1[0] + k, -0.8);
    g.lineTo(hx, hy);
    g.stroke();
  });
  e.layer('xhead', { box: [hx - 0.9, hy - 0.2, hx + 0.8, hy + 0.2] }, g => R(g, hx - 0.15, hy - 0.13, hx + 0.25, hy + 0.13, '#8a8e94'));
}
// the rods as the drivers turn (a — the drivers' angle, radians): the side rod with the crank pins, the main rod from
// its pin to the crosshead sliding on its bars
function rods(e, a) {
  const k = LOCO.crank, [, d1] = LOCO.drivers, [hx, hy] = LOCO.rodEnd;
  const cx = k * Math.cos(a), cy = k * Math.sin(a);
  const side = e.layer('siderod');
  side.x = cx - k;
  side.y = cy;
  const len = Math.hypot(hx - d1[0] - k, hy + 0.8), py = -0.8 + cy, dy = hy - py, dx = Math.sqrt(Math.max(0.01, len * len - dy * dy));
  const main = e.layer('main');
  main.x = cx - k;
  main.y = cy;
  main.rotate = Math.atan2(dy, dx) - Math.atan2(hy + 0.8, hx - d1[0] - k);
  e.layer('xhead').x = d1[0] + cx + dx - hx;
}

// ── the cars: three wooden passenger cars, side-on (the cars' metres: x from the first car's front end back) ──
const CC = { body: '#8b3a2b', board: '#7a3226', cream: '#e8dcbc', glass: '#33404f', roof: '#4a443f', frame: '#2a2622', gold: '#c9a24a' };
const carX = k => -plan.cars.pitch * k;
// the windows of a car (their left edges), the same for every car
const WINDOWS = Array.from({ length: 10 }, (_, i) => -13.4 + i * 1.24);
function paintCars(g, e, far) {
  const c = far ? k => dim(CC[k], 0.4) : k => CC[k];
  for (let k = 0; k < plan.cars.n; k++) {
    const x0 = carX(k);
    // the platforms' floors
    R(g, x0 - 1.0, -1.2, x0, -1.05, c('frame'));
    R(g, x0 - 15.5, -1.2, x0 - 14.5, -1.05, c('frame'));
    // the trucks
    for (const tx of [x0 - 2.9, x0 - 12.6]) {
      R(g, tx - 1.1, -0.92, tx + 1.1, -0.66, c('frame'));
      R(g, tx - 0.3, -1.02, tx + 0.3, -0.66, far ? dim('#3a3632', 0.4) : '#3a3632');
      [-0.85, 0.85].forEach((dx, j) => wheelLayer(e, `w${k * 4 + (tx < x0 - 7 ? 2 : 0) + j}`, tx + dx, -0.42, 0.42, c('frame'), 10));
    }
    // the body (a layer: it sways on its springs)
    e.layer(`body${k}`, { pivot: [x0 - 7.75, -1.0], box: [x0 - 15.6, -4.3, x0 + 0.1, -0.3] }, g => {
      // the roof, its clerestory and its little windows, snow on both
      R(g, x0 - 15.4, -3.72, x0 - 0.1, -3.45, c('roof'));
      R(g, x0 - 13.7, -4.12, x0 - 1.8, -3.72, c('roof'));
      if (!far) for (let x = x0 - 13.4; x < x0 - 2.2; x += 0.9) R(g, x, -4.02, x + 0.45, -3.82, '#2b3340');
      R(g, x0 - 15.4, -3.78, x0 - 0.1, -3.72, '#eef2f6');
      R(g, x0 - 13.7, -4.2, x0 - 1.8, -4.12, '#eef2f6');
      // the side, its letterboard, its windows, its belt rail and panels
      R(g, x0 - 14.5, -3.45, x0 - 1.0, -1.0, c('body'));
      R(g, x0 - 14.5, -3.45, x0 - 1.0, -3.1, c('board'));
      if (!far) {
        text(g, tr('Union Pacific').toUpperCase(), x0 - 7.75, -3.28, 0.24, CC.cream);
        for (const wx of WINDOWS) {
          R(g, x0 + wx, -2.95, x0 + wx + 0.66, -2.0, CC.glass);
          g.strokeStyle = CC.cream;
          g.lineWidth = 0.05;
          g.strokeRect(x0 + wx, -2.95, 0.66, 0.95);
        }
        R(g, x0 - 14.5, -1.95, x0 - 1.0, -1.88, CC.cream);
        g.strokeStyle = CC.gold;
        g.lineWidth = 0.03;
        g.beginPath();
        for (const wx of WINDOWS) { g.moveTo(x0 + wx - 0.29, -1.85); g.lineTo(x0 + wx - 0.29, -1.1); }
        g.stroke();
      }
      R(g, x0 - 14.6, -1.08, x0 - 0.9, -0.98, c('frame'));
      // the platforms' railings and steps
      for (const [a, b] of [[x0 - 1.0, x0], [x0 - 15.5, x0 - 14.5]]) {
        R(g, a, -2.2, b, -2.12, c('frame'));
        R(g, a, -1.75, b, -1.7, c('frame'));
        for (const x of [a + 0.04, b - 0.04]) R(g, x - 0.03, -2.15, x + 0.03, -1.15, c('frame'));
        const out = a < x0 - 7 ? a : b; // the outer end
        const sx = out === a ? a + 0.05 : b - 0.7;
        for (const y of [-0.85, -0.5]) R(g, sx, y - 0.05, sx + 0.65, y, c('frame'));
        R(g, sx, -1.15, sx + 0.05, -0.4, c('frame'));
        R(g, sx + 0.6, -1.15, sx + 0.65, -0.4, c('frame'));
      }
    });
  }
  if (far) return;
  // the passengers' faces at the windows (a layer: the riders come — `faces`)
  e.layer('faces', { box: [-48.4, -3.0, 0.2, -1.95] }, g => {
    const SKIN = ['#e0b898', '#d8aa88', '#ecc8aa', '#c99a78'], HAT = ['#2a2a2e', '#4a3a2a', '#6a2e2a', '#3a4458'];
    let n = 0;
    for (let k = 0; k < plan.cars.n; k++) for (let i = 0; i < WINDOWS.length; i++) {
      if (anim.hash(k * 10 + i, 5) < 0.45) continue;
      const x = carX(k) + WINDOWS[i] + 0.33 + (anim.hash(n, 6) - 0.5) * 0.14, y = -2.38;
      R(g, x - 0.22, y + 0.2, x + 0.22, -2.0, ['#3a3a44', '#5a4436', '#2e3a4e'][n % 3]);
      C(g, x, y, 0.12, SKIN[n % 4]);
      g.fillStyle = '#1e1c1c';
      g.beginPath();
      g.arc(x - 0.04, y - 0.01, 0.017, 0, TAU);
      g.arc(x + 0.04, y - 0.01, 0.017, 0, TAU);
      g.fill();
      const hat = n % 3;
      if (hat === 0) { R(g, x - 0.1, y - 0.33, x + 0.1, y - 0.1, HAT[n % 4]); R(g, x - 0.16, y - 0.12, x + 0.16, y - 0.08, HAT[n % 4]); }
      else if (hat === 1) { g.fillStyle = HAT[(n + 1) % 4]; g.beginPath(); g.arc(x, y - 0.03, 0.15, Math.PI, TAU); g.fill(); }
      else { R(g, x - 0.13, y - 0.17, x + 0.13, y - 0.1, HAT[(n + 2) % 4]); }
      n++;
    }
  });
  e.at(-24.4, -2.4, 'middle');
  e.at(-47.6, -2.0, 'rear');
}
// the cars' bodies on their springs: they rise and fall a little, out of step (swing — how far, at — the phase of the
// sway, 0.5 the cars come together)
function sway(e, swing, at) {
  for (let k = 0; k < plan.cars.n; k++) {
    const b = e.layer(`body${k}`), s = Math.sin(TAU * at + k * 1.3) * swing;
    b.y = -0.035 * s;
    b.rotate = 0.0025 * Math.cos(TAU * at + k * 0.9) * swing;
  }
}

// ── the trestle: the bridge at Medicine Bow, one face of it (the bridge's metres: x along it from its middle, y down
// from the deck's top; the land under it — the gorge — from the relief). Its west part, the middle span (which falls) and
// its east part are layers; far — the far face, darker, seen through the bracing ──
const BENTS = Array.from({ length: 11 }, (_, i) => -32 + 6.4 * i);
function trestle(g, e, far) {
  const wood = far ? '#4e4236' : '#6c5844', brace = far ? '#463a30' : '#5e4b39', beam = far ? '#40352b' : '#584636', snow = far ? '#c9d0da' : '#eef2f6';
  const depth = x => Math.max(0, -ground(plan.gorge.x + x, plan.track));
  const span = (lo, hi) => g => {
    g.lineCap = 'butt';
    for (const x of BENTS) {
      if (x < lo - 0.01 || x > hi + 0.01) continue;
      const d = depth(x);
      if (d < 1.2) continue;
      // a bent's post, from under the stringers to the ground
      R(g, x - 0.17, 0.9, x + 0.17, d + 0.4, wood);
      // the bracing to the next bent: storeys of X and the girts between them, as far down as both stand
      const n = x + 6.4;
      if (n > hi + 0.01) continue;
      const low = Math.min(d, depth(n));
      g.strokeStyle = brace;
      g.lineWidth = 0.16;
      g.beginPath();
      for (let y = 0.9; y + 3 < low; y += 6) {
        const y1 = Math.min(y + 6, low);
        g.moveTo(x, y);
        g.lineTo(n, y1);
        g.moveTo(x, y1);
        g.lineTo(n, y);
      }
      g.stroke();
      for (let y = 6.9; y < low; y += 6) {
        R(g, x, y - 0.12, n, y + 0.12, beam);
        R(g, x, y - 0.18, n, y - 0.12, snow);
      }
    }
    // the deck: the stringers' side, the ties' ends, the rail, snow along the top
    const a = Math.max(lo, -37), b = Math.min(hi, 37);
    R(g, a, 0.0, b, 0.9, beam);
    R(g, a, 0.88, b, 0.95, wood);
    g.fillStyle = far ? '#3a3028' : '#4a3a2c';
    for (let x = a; x < b; x += 0.6) g.fillRect(x, -0.2, 0.26, 0.22);
    R(g, a, -0.36, b, -0.2, far ? '#45474c' : '#5d6066');
    R(g, a, -0.06, b, 0.02, snow);
  };
  // the stone abutments at the rims, from the deck down the slope
  for (const s of [-1, 1]) {
    g.fillStyle = far ? '#6a655d' : '#8a847a';
    g.beginPath();
    g.moveTo(s * 26, 0.9);
    g.lineTo(s * 37, 0.9);
    for (let x = 37; x >= 26; x -= 1) g.lineTo(s * x, Math.max(1, depth(s * x)) + 0.4);
    g.closePath();
    g.fill();
  }
  const [b0, b1] = plan.breaks;
  e.layer('w', { box: [-37.5, -0.5, b0 + 0.3, 31] }, span(-37, b0));
  e.layer('e', { box: [b1 - 0.3, -0.5, 37.5, 31] }, span(b1, 37));
  // the middle span, pivoting on its west end as it goes; on the near face the cracked brace and the split stringer
  e.layer('mid', { pivot: [b0, 0.5], box: [b0 - 0.5, -0.5, b1 + 0.5, 31] }, g => {
    span(b0, b1)(g);
    if (far) return;
    // the split through the stringers by the east end, splinters standing out of it
    g.fillStyle = '#16110d';
    g.beginPath();
    g.moveTo(b1 - 1.9, -0.05);
    g.lineTo(b1 - 1.1, -0.05);
    g.lineTo(b1 - 1.5, 0.3);
    g.lineTo(b1 - 1.05, 0.55);
    g.lineTo(b1 - 1.45, 0.95);
    g.lineTo(b1 - 1.9, 0.95);
    g.lineTo(b1 - 1.55, 0.55);
    g.lineTo(b1 - 2.0, 0.3);
    g.closePath();
    g.fill();
    g.strokeStyle = '#c9a882';
    g.lineWidth = 0.05;
    g.beginPath();
    for (const [x, y, dx, dy] of [[-1.9, 0.2, -0.35, -0.2], [-1.5, 0.6, -0.3, 0.15], [-1.1, 0.3, 0.3, -0.2], [-1.2, 0.8, 0.35, 0.1]]) { g.moveTo(b1 + x, y); g.lineTo(b1 + x + dx, y + dy); }
    g.stroke();
    // a brace snapped: its two halves bent away from each other
    g.strokeStyle = '#5e4b39';
    g.lineWidth = 0.18;
    g.beginPath();
    g.moveTo(6.4, 0.9);
    g.lineTo(8.5, 3.1);
    g.moveTo(9.2, 4.2);
    g.lineTo(11, 6.4);
    g.stroke();
    e.at(b1 - 1.4, 0.4, 'bridge');
  });
}
// the trestle's span as the bridge trembles (shake) and its middle falls (down 0…1): it drops and turns into the gorge
function quake(e, shake, down) {
  const t = e.t, j = 0.05 * shake;
  for (const n of ['w', 'e', 'mid']) {
    const l = e.layer(n);
    l.x = j * anim.noise(t * 23, n === 'w' ? 1 : n === 'e' ? 2 : 3);
    l.y = j * anim.noise(t * 19, n === 'w' ? 4 : n === 'e' ? 5 : 6);
  }
  const m = e.layer('mid'), u = anim.ease.in(down);
  m.y += 34 * u;
  m.rotate = 0.012 + 0.55 * anim.ease.out(anim.clamp(down * 1.6, 0, 1));
}

// ── the track: ballast, ties, rails (a plane's metres: x along the line from its middle, y across, toward the viewer
// +). The ties are a layer that runs back while the train runs (animate), blurred into streaks at speed ──
function track(g, e, x0, x1, ties0, ties1) {
  R(g, x0, -1.6, x1, 1.6, '#a9a499');
  g.fillStyle = '#e6ebf1';
  for (let i = 0; i < (x1 - x0) / 9; i++) {
    const x = x0 + anim.hash(i, 3) * (x1 - x0), y = (anim.hash(i, 4) - 0.5) * 2.6;
    g.beginPath();
    g.ellipse(x, y, 0.6 + 2 * anim.hash(i, 5), 0.2 + 0.25 * anim.hash(i, 6), 0, 0, TAU);
    g.fill();
  }
  // far out, where no tie is told apart, a band of their colour
  R(g, x0, -1.3, ties0, 1.3, rgba('#5a4a3a', 0.55));
  R(g, ties1, -1.3, x1, 1.3, rgba('#5a4a3a', 0.55));
  e.layer('ties', { box: [ties0 - 0.7, -1.35, ties1 + 0.7, 1.35] }, g => {
    g.fillStyle = '#5a4a3a';
    g.beginPath();
    for (let x = ties0; x < ties1 + 0.62; x += 0.62) g.rect(x, -1.3, 0.22, 2.6);
    g.fill();
  });
  e.layer('streaks', { box: [ties0, -1.35, ties1, 1.35] }, g => {
    R(g, ties0, -1.3, ties1, 1.3, rgba('#6a5a48', 0.5));
    for (const y of [-1.05, -0.4, 0.3, 1.0]) R(g, ties0, y - 0.04, ties1, y + 0.04, rgba('#8a7c6a', 0.6));
  });
  e.layer('rails', { box: [x0, -0.85, x1, 0.85] }, g => {
    for (const y of [-plan.gauge / 2, plan.gauge / 2]) {
      R(g, x0, y - 0.04, x1, y + 0.04, '#5e6168');
      R(g, x0, y - 0.015, x1, y + 0.015, '#a6abb3');
    }
  });
}
function trackRun(e) {
  const run = advance(e), k = anim.clamp(e.mem.v / plan.pace, 0, 1);
  e.layer('ties').x = -mod(run, 0.62);
  e.layer('ties').alpha = 1 - 0.85 * k;
  e.layer('streaks').alpha = k;
}

// ── the riders: a Sioux on his pony, at a gallop toward +x, in one of four strides (f), side-on: a horse of a few
// shapes, the rider in a robe, feathers in his hair; some with a rifle raised (its muzzle — the smoke's point) ──
const STRIDES = [
  { fore: [[0.95, 0.15], [0.6, 0.3]], hind: [[-0.85, -0.25], [-0.55, -0.1]], bob: 0, tail: 0.1 },
  { fore: [[0.05, 0.1], [-0.25, 0.4]], hind: [[0.25, -0.6], [-0.05, -0.4]], bob: -0.04, tail: 0.25 },
  { fore: [[-0.4, 1.3], [-0.55, 1.1]], hind: [[0.55, -1.1], [0.7, -0.9]], bob: -0.1, tail: 0.35 },
  { fore: [[0.5, 1.2], [0.25, 1.3]], hind: [[-0.25, 0.05], [0.0, -0.1]], bob: 0.02, tail: 0.2 },
];
function rider(g, x, f, look) {
  const S = STRIDES[f], y0 = S.bob, hc = look.horse, dk = dim(hc, 0.35);
  const leg = (tx, ty, [a, b], col, w) => {
    const kx = tx + 0.55 * Math.sin(a), ky = ty + 0.55 * Math.cos(a), fx = kx + 0.55 * Math.sin(a - b), fy = ky + 0.55 * Math.cos(a - b);
    g.strokeStyle = col;
    g.lineCap = 'round';
    g.lineWidth = w;
    g.beginPath();
    g.moveTo(tx, ty);
    g.lineTo(kx, ky);
    g.stroke();
    g.lineWidth = w * 0.6;
    g.beginPath();
    g.moveTo(kx, ky);
    g.lineTo(fx, fy);
    g.stroke();
    C(g, fx, fy, w * 0.38, '#1e1a16');
  };
  // the far legs first, darker
  leg(x + 0.62, -1.25 + y0, S.fore[1], dk, 0.17);
  leg(x - 0.6, -1.25 + y0, S.hind[1], dk, 0.2);
  // the tail streaming back
  g.strokeStyle = dim(hc, 0.55);
  g.lineWidth = 0.14;
  g.beginPath();
  g.moveTo(x - 0.9, -1.55 + y0);
  g.quadraticCurveTo(x - 1.35, -1.6 + y0 + S.tail * 0.3, x - 1.6, -1.15 + y0 + S.tail);
  g.stroke();
  // body, neck, head, ears, mane
  g.fillStyle = hc;
  g.beginPath();
  g.ellipse(x, -1.38 + y0, 0.98, 0.38, 0, 0, TAU);
  g.fill();
  P(g, [x + 0.55, -1.55 + y0, x + 1.15, -2.1 + y0, x + 1.42, -2.0 + y0, x + 0.95, -1.25 + y0], hc);
  g.beginPath();
  g.ellipse(x + 1.52, -1.92 + y0, 0.3, 0.13, 0.55, 0, TAU);
  g.fill();
  P(g, [x + 1.2, -2.1 + y0, x + 1.26, -2.3 + y0, x + 1.33, -2.08 + y0], hc);
  if (look.patches) {
    g.fillStyle = '#efe9df';
    g.beginPath();
    g.ellipse(x - 0.35, -1.42 + y0, 0.32, 0.22, 0.3, 0, TAU);
    g.ellipse(x + 0.4, -1.22 + y0, 0.22, 0.16, -0.2, 0, TAU);
    g.fill();
  }
  g.strokeStyle = dim(hc, 0.6);
  g.lineWidth = 0.08;
  g.beginPath();
  g.moveTo(x + 0.6, -1.62 + y0);
  g.lineTo(x + 1.15, -2.15 + y0);
  g.stroke();
  // the near legs
  leg(x + 0.62, -1.25 + y0, S.fore[0], hc, 0.18);
  leg(x - 0.6, -1.25 + y0, S.hind[0], hc, 0.21);
  // the rider: leg astride, the robe round him, his arms, his head, the feathers
  const ry = -1.72 + y0;
  g.strokeStyle = look.leggings;
  g.lineWidth = 0.13;
  g.beginPath();
  g.moveTo(x + 0.05, ry);
  g.lineTo(x + 0.36, ry + 0.32);
  g.lineTo(x + 0.22, ry + 0.62);
  g.stroke();
  P(g, [x - 0.22, ry + 0.05, x + 0.3, ry + 0.05, x + 0.36, ry - 0.62, x + 0.02, ry - 0.72, x - 0.2, ry - 0.5], look.robe);
  R(g, x - 0.19, ry - 0.3, x + 0.32, ry - 0.2, look.stripe);
  const hx = x + 0.24, hy = ry - 0.88;
  C(g, hx, hy, 0.12, '#a86e4c');
  g.fillStyle = '#16120f';
  g.beginPath();
  g.arc(hx - 0.02, hy - 0.02, 0.125, Math.PI * 0.95, TAU * 1.02);
  g.fill();
  R(g, hx - 0.13, hy - 0.02, hx - 0.08, hy + 0.3, '#16120f');
  for (const [dx, a] of [[-0.06, -0.35], [-0.12, -0.6]]) {
    g.save();
    g.translate(hx + dx, hy - 0.1);
    g.rotate(a);
    g.fillStyle = '#f2ede2';
    g.beginPath();
    g.ellipse(0, -0.17, 0.035, 0.17, 0, 0, TAU);
    g.fill();
    R(g, -0.035, -0.34, 0.035, -0.26, '#1e1a16');
    g.restore();
  }
  g.strokeStyle = look.robe;
  g.lineWidth = 0.1;
  g.beginPath();
  if (look.rifle) {
    g.moveTo(x + 0.25, ry - 0.6);
    g.lineTo(x + 0.55, ry - 1.0);
    g.stroke();
    g.strokeStyle = '#3a2a1e';
    g.lineWidth = 0.06;
    g.beginPath();
    g.moveTo(x + 0.3, ry - 0.82);
    g.lineTo(x + 1.0, ry - 1.4);
    g.stroke();
  } else {
    g.moveTo(x + 0.25, ry - 0.55);
    g.lineTo(x + 0.75, ry - 0.3);
    g.stroke();
    g.strokeStyle = '#2a201a';
    g.lineWidth = 0.025;
    g.beginPath();
    g.moveTo(x + 0.75, ry - 0.3);
    g.lineTo(x + 1.45, -1.95 + y0);
    g.stroke();
  }
}
// the muzzle of a rider's rifle (as rider() paints it), for the smoke of his shot
const muzzle = x => [x + 1.0, -1.72 - 1.4];

// ── the wolves: grey, loping toward +x, in one of three strides ──
const LOPES = [
  { fore: [0.55, 0.2], hind: [-0.5, -0.1], bob: 0 },
  { fore: [-0.2, 0.6], hind: [0.35, -0.5], bob: -0.06 },
  { fore: [0.15, 0.9], hind: [-0.1, -0.2], bob: 0.03 },
];
function wolf(g, x, f, col) {
  const S = LOPES[f], y = S.bob, dk = dim(col, 0.4);
  const leg = (tx, a, b, c) => {
    const kx = tx + 0.3 * Math.sin(a), ky = -0.55 + y + 0.3 * Math.cos(a);
    g.strokeStyle = c;
    g.lineWidth = 0.08;
    g.lineCap = 'round';
    g.beginPath();
    g.moveTo(tx, -0.55 + y);
    g.lineTo(kx, ky);
    g.lineTo(kx + 0.28 * Math.sin(a - b), ky + 0.28 * Math.cos(a - b));
    g.stroke();
  };
  leg(x + 0.4, S.fore[0] - 0.3, S.fore[1], dk);
  leg(x - 0.4, S.hind[0] + 0.3, S.hind[1], dk);
  g.fillStyle = col;
  g.beginPath();
  g.ellipse(x, -0.66 + y, 0.55, 0.18, -0.05, 0, TAU);
  g.fill();
  P(g, [x + 0.4, -0.75 + y, x + 0.72, -0.9 + y, x + 0.98, -0.78 + y, x + 0.72, -0.62 + y], col);
  P(g, [x + 0.66, -0.88 + y, x + 0.7, -1.02 + y, x + 0.78, -0.88 + y], col);
  g.strokeStyle = col;
  g.lineWidth = 0.1;
  g.beginPath();
  g.moveTo(x - 0.5, -0.7 + y);
  g.quadraticCurveTo(x - 0.85, -0.72 + y, x - 1.0, -0.55 + y);
  g.stroke();
  leg(x + 0.4, S.fore[0], S.fore[1], col);
  leg(x - 0.4, S.hind[0], S.hind[1], col);
}
// a beast at its stride: the layer of frame f of the k-th shown alone (n frames, so many strides a second)
function stride(e, prefix, count, frames, rate, shown) {
  for (let k = 0; k < count; k++) {
    const f = Math.floor(mod(e.t * rate * frames + anim.hash(k, 9) * frames, frames));
    for (let i = 0; i < frames; i++) e.layer(`${prefix}${k}f${i}`).alpha = i === f ? shown : 0;
  }
}

// ── the sagebrush under the snow: a few grey-green clumps in a stretch `sp` metres long (from x 0), snow on their tops;
// a layer that runs back by the stretch while the train or the sledge runs (the element's copies stand `sp` apart) ──
function scrub(e, sp, seed) {
  e.layer('b', { box: [-sp - 1, -2.6, sp + 1, 0.2] }, g => {
    const n = 2 + Math.floor(sp / 35);
    for (let i = 0; i < n; i++) {
      const x = (i + 0.2 + 0.6 * anim.hash(i, seed)) * (sp / n), h = 0.5 + 1.1 * anim.hash(i, seed + 1), w = h * (1.3 + anim.hash(i, seed + 2));
      g.strokeStyle = '#5e5a4c';
      g.lineWidth = 0.05;
      g.beginPath();
      for (let j = 0; j < 4; j++) { const sx = x + (anim.hash(i * 7 + j, seed + 5) - 0.5) * w * 0.6; g.moveTo(sx, 0.05); g.lineTo(sx + (j - 1.5) * 0.12, -h * 0.5); }
      g.stroke();
      for (let j = 0; j < 6; j++) {
        const bx = x + (anim.hash(i * 7 + j, seed + 3) - 0.5) * w, by = -h * (0.35 + 0.45 * anim.hash(i * 7 + j, seed + 4)), r = w * (0.18 + 0.1 * anim.hash(j, seed + 6));
        g.fillStyle = j % 2 ? '#7c8070' : '#6f7465';
        g.beginPath();
        g.ellipse(bx, by, r, r * 0.75, 0, 0, TAU);
        g.fill();
        g.fillStyle = '#eef2f6';
        g.beginPath();
        g.ellipse(bx, by - r * 0.45, r * 0.8, r * 0.35, 0, 0, TAU);
        g.fill();
      }
    }
  });
}

// ── the sledge: two long runners curling up at the bow, the frame on its posts, a buffalo robe hanging over the side
// (the sledge's metres: x along it, the bow at +3.8; y up from the snow negative). far — the far side ──
function sledgeSide(g, far) {
  const wood = far ? '#5e4630' : '#7a5a3c', dark = far ? '#3e2e20' : '#4e3a28';
  g.strokeStyle = dark;
  g.lineWidth = 0.13;
  g.lineCap = 'round';
  g.beginPath();
  g.moveTo(-2.8, -0.07);
  g.lineTo(2.5, -0.07);
  g.quadraticCurveTo(3.5, -0.08, 3.7, -0.85);
  g.stroke();
  for (const x of [-2.3, -0.8, 0.8, 2.2]) R(g, x - 0.05, -0.45, x + 0.05, -0.08, dark);
  R(g, -2.75, -0.64, 2.85, -0.44, wood);
  R(g, -2.75, -0.66, 2.85, -0.62, dark);
  if (far) return;
  // a buffalo robe over the side, its edge ragged
  g.fillStyle = '#5a3e28';
  g.beginPath();
  g.moveTo(-1.7, -0.66);
  g.lineTo(1.3, -0.66);
  for (let x = 1.3; x >= -1.7; x -= 0.25) g.lineTo(x, -0.28 - 0.06 * anim.hash(Math.round(x * 8), 2));
  g.closePath();
  g.fill();
  R(g, -1.7, -0.66, 1.3, -0.6, '#6e4e34');
}

// ── people ──
const WHO =['fogg', 'passepartout', 'aouda', 'fix', 'driver', 'captain', 'mudge', 's1', 's2', 's3', 's4', 's5'];
const SOLDIERS = ['s1', 's2', 's3', 's4', 's5'];
const TOPHAT = { hat: 'tophat' };
const OFF = id => ({ [`${id}_a`]: 120, [`${id}_d`]: -60, [`${id}_here`]: false, [`${id}_do`]: 'stand', [`${id}_turn`]: 180,
  [`${id}_look`]: null, [`${id}_reach`]: null, [`${id}_with`]: null, [`${id}_gait`]: null, [`${id}_on`]: null, [`${id}_mood`]: null, [`${id}_wear`]: null });
const NOBODY = () => Object.assign({}, ...WHO.map(OFF));
const at = (id, a, d, turn, more = {}) => ({ [`${id}_a`]: a, [`${id}_d`]: d, [`${id}_here`]: true, [`${id}_turn`]: turn,
  ...Object.fromEntries(Object.entries(more).map(([k, v]) => [`${id}_${k}`, v])) });
const loop = (motion, from = 0) => ({ motion, loop: true, from });
// Aouda's look: her travelling dress (aouda_dress), whitening in four steps as the snow settles on her (snow 0…1)
function aoudaWear(K, dress, snow) {
  const base = dress > 0.5 ? K.wears.aouda_dress : null, step = Math.floor(clamp01(snow) * 4 + 1e-6) / 4;
  if (!step) return base;
  const own = base?.colors ?? K.characters.aouda.colors, white = '#eef2f6', colors = { ...own };
  for (const k of ['top', 'garment', 'hair']) if (own[k]) colors[k] = css(mixc(own[k], white, (k === 'hair' ? 0.6 : 0.8) * step));
  return { ...(base ?? {}), colors };
}
const CAM0 = { camera_glide: 0, camera_target: null, camera_shot: null, camera_frame: null, camera_x: 0, camera_z: 0, camera_h: 0, camera_yaw: 0, camera_pitch: 0, camera_look: 0, camera_roll: 0 };
// the light of the day's moments
const LIGHT = {
  day: { night: 0, dawn: 0, snowing: 0, lamps: 0, town: 'kearney' },
  snow: { night: 0, dawn: 0, snowing: 0.75, lamps: 0.3, town: 'kearney' },
  night: { night: 1, dawn: 0, snowing: 0.45, lamps: 1, town: 'kearney' },
  dawn: { night: 0.15, dawn: 1, snowing: 0.1, lamps: 0.6, town: 'kearney' },
};
// the train standing coupled (train_x — the engine's anchor), the riders away, the minigame's keys at rest, no snow on
// Aouda (only the night lays it on her)
const TRAIN = (x, more = {}) => ({ train_x: x, cars_x: x - plan.gap, speed: 0, steam: 0.5, uncouple: 0, bridge_down: 0, bridge_splash: 0, shake: 0,
  pp_car: 0, swing_at: 0, riders: 0, riders_x: 0, riders_d: 400, firing: 0, faces: 0, stop_at: 0, gate: 0, snow_on_aouda: 0, ...more });
// the sledge out of the way, its sail furled, the minigame's keys at rest
const SLEDGE_AWAY = { sl_x: 266, sl_d: 13.2, sail_up: 0, sail_face: 180, sl_speed: 0, sledge: 0, sheet: 0.6, wind: 0.45, drift: 0, ridge_x: 400, ridge_h: 0, wolves: 0, wolves_x: -400, omaha_near: 0 };
// the train standing at the station (the cars along the platform, the engine past its end)
const AT_STATION = 256;
// the cars' world place along the line → where the camera stands to watch Passepartout under them (at pp_car)
const underCam = (carsX, pp) => carsX + (ppX(pp) + ppX(Math.min(3, Math.floor(pp + 0.01) + 1))) / 2 - 0.3;

function film(scene) {
  const K = scene.kit.cast;
  const num = (k, or = 0) => { const v = scene.get(k); return typeof v === 'number' ? v : or; };
  const yes = k => num(k) > 0.5;
  const fogg = (a, d, turn, more = {}) => at('fogg', a, d, turn, { wear: TOPHAT, ...more });
  const aouda = (a, d, turn, more = {}) => (yes('with_aouda') ? at('aouda', a, d, turn, { wear: aoudaWear(K, num('aouda_dress'), 0), ...more }) : {});
  const fix = (a, d, turn, more = {}) => (yes('with_fix') ? at('fix', a, d, turn, { wear: yes('fix_bruise') ? K.wears.fix_bruise : null, ...more }) : {});
  const soldier = (id, a, d, turn, more = {}) => at(id, a, d, turn, { with: ['rifle'], ...more });
  // the engine and the cars driven together (coupled): one move each, the same way and time
  const drive = (s, x, o) => s.all(s.move('train_x', x, o), s.move('cars_x', x - plan.gap, o));
  // where the cars come to rest by the fort (their front end), by how far past it they run (the game's stop_at)
  const restAt = () => 252 + 130 * clamp01(scene.get('stop_at'));

  // ---- the bridge, the train standing before it
  const LOCO_STOP = -326;
  const DRIVER = [-303.4, 19.4], PP_ARGUE = [-300.6, 19.0];
  const STOP = () => ({
    ...LIGHT.day, ...CAM0, ...NOBODY(), ...TRAIN(LOCO_STOP), ...SLEDGE_AWAY,
    ...at('driver', ...DRIVER, 100, { look: 'passepartout#head' }),
    ...at('passepartout', ...PP_ARGUE, 260, { look: 'driver#head', gait: 'pp_walk' }),
    ...fogg(-309.6, 19.1, 80, { look: 'passepartout#head' }),
    ...aouda(-311.0, 18.6, 85, { look: 'passepartout#head' }),
    ...fix(-308.2, 18.3, 70, { look: 'driver#head' }),
  });
  // in the cab: the driver at the regulator, Passepartout pressed beside him (both in the cab's window)
  const CAB = () => ({
    ...LIGHT.day, ...CAM0, ...NOBODY(), ...TRAIN(LOCO_STOP, { steam: 0.9 }), ...SLEDGE_AWAY,
    driver_here: true, driver_on: 'cab_floor#driver', driver_turn: 90, driver_look: { on: 'loco', at: [60, 0, 2.5] },
    passepartout_here: true, passepartout_on: 'cab_floor#pp', passepartout_turn: 150, passepartout_mood: 'afraid', passepartout_look: { on: 'loco', at: [9, -3, 1.2] },
    camera_target: 'passepartout', camera_shot: 0.9, camera_frame: [0.5, 0.42],
  });
  // running in the middle of the plain, the riders alongside on the near side; Passepartout on the last car's platform
  const RUN = () => ({
    ...LIGHT.day, ...CAM0, ...NOBODY(), ...TRAIN(0, { speed: 1, steam: 1, riders: 1, riders_x: -14, riders_d: 10, firing: 1, faces: 1 }), ...SLEDGE_AWAY,
    driver_here: true, driver_on: 'cab_floor#gangway', driver_turn: 200, driver_look: 'riders',
    passepartout_here: true, passepartout_on: 'rear_floor#pp', passepartout_turn: 170, passepartout_look: 'riders', passepartout_mood: 'surprised',
  });
  // under the cars: Passepartout on his back by the chains, the camera low beside the line, the next chain ahead in view
  const UNDER = () => ({
    ...RUN(), riders: 0, firing: 0, faces: 0,
    passepartout_on: 'chain#pp', passepartout_do: 'lie_limp', passepartout_turn: 90, passepartout_mood: 'angry',
    passepartout_look: 'chain#c1', passepartout_reach: { r: 'chain#hand_r', l: 'chain#hand_l' },
    camera_x: underCam(-plan.gap, 0), camera_z: 17.6, camera_h: -1.3,
  });
  // the station, the cars at rest by the platform (no engine)
  const PLATFORM = () => ({ ...LIGHT.day, ...CAM0, ...NOBODY(), ...TRAIN(3000, { cars_x: restAt(), uncouple: 1, gate: 1, steam: 0 }), ...SLEDGE_AWAY });
  const ON_PLATFORM = { fogg: [224.2, 18.1], captain: [226.6, 18.6], aouda: [222.8, 17.4], fix: [221.6, 18.7] };
  const SOLDIERS_AT = [[214.0, 17.6], [216.2, 18.8], [232.5, 17.5], [234.3, 18.9], [210.0, 15.0]];
  // the column's way out into the white: off the platform's west end, over the line, away north-west
  const COLUMN_FROM = { fogg: [194.5, 19.8], s1: [191.6, 18.6], s2: [194.4, 18.4], s3: [191.4, 20.8], s4: [194.2, 21.0], s5: [192.6, 22.2] };
  const COLUMN_WAY = [-12, 30];
  // the platform's west end, where Aouda and Fix wait
  const WEST_END = { aouda: [197.0, 18.0], fix: [198.8, 18.6] };
  // the sledge: who sits where on it (the sledge's metres: along it, across it, up), Mudge standing at the stern
  // (all on the near half: the sail stands on the sledge's middle and hides who sits beyond it)
  const SEATS = [['fogg', 'sl_fogg', [0.3, -0.5]], ['aouda', 'sl_aouda', [-0.5, -0.55]], ['passepartout', 'sl_pp', [-1.3, -0.5]], ['fix', 'sl_fix', [-2.0, -0.5]]];
  const SLEDGE = (x, d) => {
    const v = { mudge_here: true, mudge_on: 'sledge_deck#mudge', mudge_turn: 140, mudge_a: x, mudge_d: d, mudge_look: { on: 'sledge', at: [30, 0, 2] } };
    for (const [id, k, [a, b]] of SEATS) {
      if (!yes(k)) continue;
      Object.assign(v, { [`${id}_here`]: true, [`${id}_on`]: { on: 'sledge', at: [a, b, 0.95] }, [`${id}_do`]: loop('sit_calm', a * 1.3 + 2), [`${id}_turn`]: 90,
        [`${id}_a`]: x, [`${id}_d`]: d, [`${id}_look`]: { on: 'sledge', at: [30, b, 1.5] } });
    }
    if (v.fogg_here) v.fogg_wear = TOPHAT;
    if (v.aouda_here) v.aouda_wear = aoudaWear(K, num('aouda_dress'), 0);
    if (v.fix_here) v.fix_wear = yes('fix_bruise') ? K.wears.fix_bruise : null;
    // the sheet in the hands of who leads the sail: Fogg, or Passepartout alone with Mudge
    const holder = v.fogg_here ? 'fogg' : v.passepartout_here ? 'passepartout' : null;
    if (holder) v[`${holder}_with`] = ['sheet'];
    return v;
  };

  return {
    // ---- The train stands before the bridge; its truss has cracked. Passepartout argues with the driver at the
    // engine; Fogg, Aouda, Fix by the first car. Under the choice (driver#head · passepartout#head).
    bridge_stop: {
      // from the river under the bridge, looking up at the cracked span
      from: () => ({ ...STOP(), camera_x: -253, camera_z: -16, camera_pitch: 14 }),
      run: async s => {
        const pp = s.person('passepartout'), driver = s.person('driver');
        await s.wait(2.4);
        // the train stopped short of the rim, the driver and Passepartout before the engine, the others by its cab
        const wide = s.shot({ ...STOP(), camera_x: -304, camera_z: 4 });
        await s.until(() => wide.ready);
        wide.cut();
        const two = s.shot({ ...STOP(), camera_target: 'passepartout', camera_shot: 0.45, camera_frame: [0.6, 0.5] });
        await s.wait(2.2);
        await s.until(() => two.ready);
        two.cut();
        await s.wait(0.4);
        // the driver: at full speed over it — his arm flung up toward the bridge
        driver.mood('smile');
        driver.look([-270, 22, 1]);
        driver.reach({ r: [-296.5, 19.2, 2.8] });
        await s.wait(1.6);
        driver.reach(null);
        driver.look('passepartout#head');
        // Passepartout: walk across first — his hand toward the bridge, then his hands spread: is it not plain?
        pp.mood('thinking');
        pp.look([-268, 22, 0]);
        pp.reach({ r: [-297.6, 18.7, 1.2] });
        s.tell('bridge_stop:argue');
        await s.wait(1.6);
        pp.reach(null);
        pp.look('driver#head');
        await pp.do('spread_hands');
      },
    },
    // ---- Full steam: Passepartout in the cab, his eyes shut; the train runs over the bridge, it shakes, and its middle
    // falls into the gorge behind the last car.
    bridge_run: {
      from: CAB,
      run: async s => {
        await s.wait(0.4);
        s.move('shake', 0.25, { over: 2 });
        // (gathering speed: 27 m in 3 s, to 18 m/s)
        const off = drive(s, -299, { over: 3, ease: 'in' });
        await s.wait(1.6);
        // the bridge from the river below it, looking up at the trestle against the sky
        const rim = s.shot({ camera_target: null, camera_shot: null, camera_frame: null, camera_glide: 0, camera_x: -256, camera_z: -16, camera_pitch: 14 });
        await s.until(() => rim.ready);
        rim.cut();
        s.move('shake', 0.8, { over: 1.5 });
        await off;
        // (full speed, 19 m/s, till the last car is past the middle span: the engine at −200)
        await drive(s, -200, { over: 99 / 19, ease: 'linear' });
        drive(s, -40, { over: 160 / 19, ease: 'linear' });
        s.move('shake', 0, { over: 1.2 });
        await s.move('bridge_down', 1, { over: 1.6, ease: 'in' });
        s.set('bridge_splash', 1);
        s.tell('bridge_run:down');
        await s.wait(2.5);
      },
    },
    // ---- Passepartout's way: the passengers walk over the bridge in the snow; the empty train creeps after them; the
    // bridge creaks and holds.
    bridge_walk: {
      from: () => ({
        ...LIGHT.day, snowing: 0.35, ...CAM0, ...NOBODY(), ...TRAIN(-318, { shake: 0.06, steam: 0.6 }), ...SLEDGE_AWAY,
        driver_here: true, driver_on: 'cab_floor#driver', driver_turn: 90,
        ...at('passepartout', -289.0, 21.0, 90, { gait: 'pp_walk' }),
        ...aouda(-291.2, 21.5, 90),
        ...fogg(-292.8, 20.8, 90, { gait: 'fogg_walk' }),
        ...fix(-295.0, 21.4, 90),
        camera_x: -297, camera_z: 9,
      }),
      run: async s => {
        const walk = (id, to) => (s.get(`${id}_here`) ? s.person(id).walk(to) : null);
        drive(s, -313, { over: 4, ease: 'linear' });
        walk('passepartout', [[-268, 20.8]]);
        walk('aouda', [[-270, 21.4]]);
        walk('fogg', [[-271.8, 20.8]]);
        walk('fix', [[-274, 21.4]]);
        await s.wait(3.2);
        // from the east rim: they come on over the last spans
        const B = {
          ...at('passepartout', -232.5, 20.8, 90, { gait: 'pp_walk' }), ...aouda(-234.5, 21.4, 90), ...fogg(-236.0, 20.8, 90, { gait: 'fogg_walk' }), ...fix(-238.0, 21.4, 90),
          train_x: -302, cars_x: -302 - plan.gap, camera_x: -230, camera_z: 10,
        };
        const rim = s.shot(B);
        await s.until(() => rim.ready);
        rim.cut();
        drive(s, -290, { over: 12, ease: 'linear' });
        const ppw = walk('passepartout', [[-224.0, 20.4], [-221.6, 19.6]]);
        const aw = walk('aouda', [[-225.8, 19.0]]);
        const fw = walk('fogg', [[-227.2, 20.0]]);
        const xw = walk('fix', [[-228.8, 21.2]]);
        await fw;
        s.tell('bridge_walk:over');
        await s.all(...[ppw, aw, xw].filter(Boolean));
        s.person('fogg').turn(270);
        s.person('fogg').look([-262, 22, 0]);
        await s.wait(2);
      },
    },
    // ---- The Sioux: riders gallop along the train, snow from under the hooves, puffs of smoke, faces at the windows;
    // the train flies on; the driver falls in the cab; Passepartout on the last car's platform.
    attack: {
      from: () => ({ ...RUN(), camera_x: -14, camera_z: -6 }),
      run: async s => {
        s.move('riders_x', -8, { over: 9, ease: 'inOut' });
        await s.wait(3.2);
        // the cab's open back: the driver in it, looking back at the riders — he falls
        const cab = s.shot({ camera_x: 0, camera_z: 0, camera_target: 'driver', camera_shot: 0.55, camera_frame: [0.45, 0.42], camera_glide: 0 });
        await s.until(() => cab.ready);
        cab.cut();
        await s.wait(0.6);
        s.person('driver').mood('surprised');
        s.person('driver').do('knocked_down');
        await s.wait(1.1);
        s.tell('attack:driver');
        await s.wait(1.4);
        // Passepartout on the rear platform: his arm out ahead — the fort! — then his eyes down to the couplings
        const pp = s.shot({ camera_target: 'passepartout', camera_shot: 0.5, camera_frame: [0.45, 0.42], camera_glide: 0,
          passepartout_mood: 'angry', passepartout_turn: 120, passepartout_look: { on: 'cars', at: [60, -2, 3] } });
        await s.until(() => pp.ready);
        pp.cut();
        s.person('passepartout').reach({ r: { on: 'cars', at: [-44.2, -1.4, 3.1] } });
        await s.wait(2.4);
        s.person('passepartout').reach(null);
        s.person('passepartout').look({ on: 'cars', at: [-46.4, -0.6, 0.5] });
        await s.wait(1.0);
      },
    },
    // ---- «The coupling» (the game's): under the cars, low, the snow streaming; Passepartout on his back, hand over hand
    // along the chains toward the engine (pp_car), the cars swaying (swing; its phase swing_at), the coupling's pin
    // (uncouple). The beat only cuts here; the minigame plays it (script.js: the camera goes along with him).
    under: {
      from: UNDER,
      run: async s => {
        await s.wait(1.5);
      },
    },
    // ---- The cars roll and stand by the platform (stop_at — how far past it, the game's); soldiers run out of the
    // fort; the riders go off into the plain. No Passepartout.
    stop: {
      from: () => {
        const F = restAt(), G = plan.fort.gate;
        return { ...PLATFORM(), cars_x: F - 80, gate: 0, riders: 1, riders_x: F - 110, riders_d: 110, camera_x: F - 45, camera_z: -6,
          ...Object.fromEntries(SOLDIERS.flatMap((id, i) => Object.entries(soldier(id, G - 2 + i, plan.fort.d - 3, 180, { here: false })))) };
      },
      run: async s => {
        const F = restAt(), G = plan.fort.gate;
        // (the riders gallop on east and away over the plain)
        s.move('riders_d', 380, { over: 18, ease: 'in' });
        s.move('riders_x', F + 200, { over: 18, ease: 'linear' });
        const roll = s.move('cars_x', F, { over: 8, ease: 'out' });
        await s.wait(2.6);
        // near the fort: its gate opens, the soldiers run out toward the cars
        const gate = s.shot({ camera_x: G, camera_z: 50 });
        await s.until(() => gate.ready);
        gate.cut();
        s.move('gate', 1, { over: 1.2 });
        await s.wait(0.8);
        SOLDIERS.forEach((id, i) => {
          s.set(`${id}_here`, true);
          s.person(id).walk([[G + 8 + i * 1.2, 60], [F - 52 + i * 1.6, 25.6 + (i % 2) * 0.9]], { gait: 'run' });
        });
        await roll;
        s.tell('stop:still');
        await s.wait(2);
      },
    },
    // ---- The platform: Fogg, Aouda, Fix and the captain; the soldiers about. Under the choice (fogg#head · captain#head).
    fort: {
      from: () => ({
        ...PLATFORM(),
        ...fogg(...ON_PLATFORM.fogg, 100, { look: 'captain#head' }),
        ...at('captain', ...ON_PLATFORM.captain, 250, { look: [150, 75, 3] }),
        ...aouda(...ON_PLATFORM.aouda, 110, { look: 'captain#head' }),
        ...fix(...ON_PLATFORM.fix, 120, { look: 'captain#head' }),
        ...Object.fromEntries(SOLDIERS.flatMap((id, i) => Object.entries(soldier(id, ...SOLDIERS_AT[i], 160 + i * 12)))),
        camera_target: 'captain', camera_shot: 0.42, camera_frame: [0.62, 0.5],
      }),
      run: async s => {
        await s.wait(1.2);
        const cap = s.person('captain');
        cap.look('fogg#head');
        await cap.turn(255);
        s.tell('fort:captain');
        await s.wait(2.4);
      },
    },
    // ---- «Then I will go alone»: Fogg looks at Aouda a moment; the column of soldiers goes out with him into the white.
    column: {
      from: () => ({
        ...PLATFORM(), ...LIGHT.snow,
        ...fogg(...COLUMN_FROM.fogg, 120, { gait: 'fogg_walk', look: 'aouda#head' }),
        ...Object.fromEntries(SOLDIERS.flatMap(id => Object.entries(soldier(id, ...COLUMN_FROM[id], 330)))),
        ...aouda(...WEST_END.aouda, 260, { look: 'fogg#head' }),
        ...fix(...WEST_END.fix, 255, { look: 'fogg#head' }),
        camera_target: 'fogg', camera_shot: 0.4, camera_frame: [0.3, 0.45],
      }),
      run: async s => {
        await s.wait(2.4);
        // from behind them: they go off over the line into the falling snow
        const away = s.shot({ camera_target: null, camera_shot: null, camera_frame: null, camera_x: 200, camera_z: 4, fogg_turn: 345, fogg_look: null });
        await s.until(() => away.ready);
        away.cut();
        // (they walk on into the white after the beat: its end is a living pose of a column going away)
        for (const [id, [a, d]] of Object.entries(COLUMN_FROM)) s.person(id).walk([[a + COLUMN_WAY[0], d + COLUMN_WAY[1]]]);
        await s.wait(6.5);
        s.tell('column:gone');
        await s.wait(1.5);
      },
    },
    // ---- Night. Aouda on the platform by the lamp, looking where they went; the snow settles on her; Fix stamps his
    // feet.
    night_wait: {
      from: () => ({
        ...PLATFORM(), ...LIGHT.night, snow_on_aouda: 0,
        ...aouda(223.6, 17.8, 300, { look: [185, 60, 2] }),
        ...fix(225.6, 18.4, 250, { do: loop('fidget_paper') }),
        camera_target: 'aouda', camera_shot: 0.6, camera_frame: [0.42, 0.45],
      }),
      run: async s => {
        const snow = s.move('snow_on_aouda', 1, { over: 12, ease: 'linear' });
        await s.wait(9.5);
        s.tell('night_wait:snow');
        await snow;
        await s.wait(1);
      },
    },
    // ---- Dawn. Out of the snow come the soldiers, Passepartout and Fogg (fogg_went); Aouda and Fix at the platform's
    // end.
    return: {
      from: () => ({
        ...PLATFORM(), ...LIGHT.dawn,
        ...at('passepartout', 186.5, 46, 160, { gait: 'pp_walk' }),
        ...(yes('fogg_went') ? fogg(188.2, 46.8, 160, { gait: 'fogg_walk' }) : {}),
        ...Object.fromEntries(SOLDIERS.flatMap((id, i) => Object.entries(soldier(id, 182 + i * 1.7, 50 + (i % 2) * 1.6, 165)))),
        ...aouda(...WEST_END.aouda, 330, { look: [188, 40, 1.7] }),
        ...fix(...WEST_END.fix, 325, { look: [188, 40, 1.7] }),
        camera_x: 200, camera_z: 14,
      }),
      run: async s => {
        const go = (id, p) => (s.get(`${id}_here`) ? s.person(id).walk([p]) : null);
        go('passepartout', [194.6, 26.4]);
        go('fogg', [196.4, 27.0]);
        SOLDIERS.forEach((id, i) => go(id, [186 + i * 1.6, 30 + (i % 2) * 1.4]));
        await s.wait(2.6);
        // nearer: Passepartout coming up to the platform, Aouda turning to him
        const near = s.shot({
          ...at('passepartout', 194.6, 26.4, 165, { gait: 'pp_walk', mood: 'smile' }),
          ...(yes('fogg_went') ? fogg(196.4, 27.0, 165, { gait: 'fogg_walk' }) : {}),
          ...aouda(...WEST_END.aouda, 20, { look: 'passepartout#head' }),
          camera_x: 0, camera_z: 0, camera_target: 'passepartout', camera_shot: 0.38, camera_frame: [0.36, 0.45], camera_glide: 0,
        });
        await s.until(() => near.ready);
        near.cut();
        const pp = go('passepartout', [197.4, 20.8]);
        go('fogg', [195.6, 21.8]);
        await s.wait(2.2);
        s.tell('return:pp');
        if (s.get('fix_here')) s.person('fix').look('passepartout#head');
        await pp;
        s.person('passepartout').look(s.get('aouda_here') ? 'aouda#head' : 'fogg#head');
        await s.wait(1.5);
      },
    },
    // ---- The train leaves the station: with fogg_on_train Fogg on its rear platform looking back; else they on the
    // platform (Passepartout back with them) watch it go.
    train_leaves: {
      from: () => {
        const on = yes('fogg_on_train');
        return {
          ...LIGHT.day, gate: 1, ...CAM0, ...NOBODY(), ...TRAIN(AT_STATION, { steam: 0.9 }), ...SLEDGE_AWAY,
          ...(on ? { ...fogg(AT_STATION - 48, 22, 250, { on: 'rear_floor#fogg', look: [190, 18, 1.7] }), camera_target: 'fogg', camera_shot: 0.5, camera_frame: [0.45, 0.45] }
            : { ...fogg(215.0, 18.0, 80, { look: 'cars_side#middle' }), ...at('passepartout', 213.0, 18.6, 75, { look: 'cars_side#middle' }),
              ...aouda(213.6, 17.4, 70, { look: 'cars_side#middle' }), ...fix(216.6, 17.6, 85, { look: 'cars_side#middle' }),
              camera_target: 'fogg', camera_shot: 0.42, camera_frame: [0.38, 0.45] }),
        };
      },
      run: async s => {
        const on = yes('fogg_on_train');
        await s.wait(1.0);
        const go = drive(s, 470, { over: 12, ease: 'in' });
        if (on) {
          // the operator goes with Fogg a little; then the train going away from the platform
          await s.wait(3.0);
          const away = s.shot({ camera_target: null, camera_shot: null, camera_frame: null, camera_x: 226, camera_z: 6 });
          await s.until(() => away.ready);
          away.cut();
          await s.wait(3.0);
        } else await s.wait(6);
        s.tell('train_leaves:gone');
        await go;
        await s.wait(0.5);
      },
    },
    // ---- Mudge's sledge with its great sail by the platform; who rides sits in it (sl_*); the sail goes up.
    sledge: {
      from: () => {
        const v = { ...LIGHT.day, gate: 1, ...CAM0, ...NOBODY(), ...TRAIN(3000, { cars_x: -3000 }), ...SLEDGE_AWAY, ...SLEDGE(266, 13.2) };
        // the one who speaks first: Fix with his idea, or Passepartout alone with Mudge
        const who = v.fogg_here && v.fix_here ? 'fix' : v.passepartout_here ? 'passepartout' : 'mudge';
        return { ...v, camera_target: who, camera_shot: 0.5, camera_frame: [0.45, 0.52] };
      },
      run: async s => {
        await s.wait(1.4);
        const mudge = s.person('mudge');
        mudge.look('sail#peak');
        s.camera({ target: 'mudge', shot: 0.3, frame: [0.42, 0.62], glide: 2 });
        await s.move('sail_up', 1, { over: 3.2, ease: 'out' });
        s.tell('sledge:sail');
        mudge.look({ on: 'sledge', at: [30, 0, 2] });
        s.camera({ target: 'mudge', shot: 0.45, frame: [0.45, 0.48], glide: 1.2 });
        await s.wait(2.6);
      },
    },
    // ---- «The sail» (the game's): the sledge flies under its sail along the line; the plain and the sky run. Only the
    // cut: the minigame plays it.
    sail: {
      from: () => ({
        ...LIGHT.day, ...CAM0, ...NOBODY(), ...TRAIN(3000, { cars_x: -3000 }), ...SLEDGE_AWAY, ...SLEDGE(0, 13.2),
        sl_x: 0, sail_up: 1, sl_speed: 0.55, sheet: 0.6, wind: 0.45, sail_face: sailFace(0.6, 0.45),
        camera_x: 3, camera_z: 2, camera_h: 0.6,
      }),
      run: async s => {
        await s.wait(1.5);
      },
    },
    // ---- Omaha: the town's smoke, the train at the station. Passepartout alone (sl_fogg 0): with omaha_train he runs to
    // the last car and Fogg gives him his hand from its platform; else the train goes before he is there. All in the
    // sledge: they come to the last car, Fogg hands Aouda up.
    omaha: {
      from: () => {
        const alone = !yes('sl_fogg');
        const v = { ...LIGHT.day, town: 'omaha', gate: 1, ...CAM0, ...NOBODY(), ...TRAIN(AT_STATION, { steam: 0.9 }), ...SLEDGE_AWAY,
          sl_x: 194, sl_d: 12.6, sail_up: 0.15, sail_face: 180,
          mudge_here: true, mudge_on: 'sledge_deck#mudge', mudge_turn: 90, mudge_a: 194, mudge_d: 12.6, mudge_look: 'passepartout#head' };
        if (alone) return { ...v, ...fogg(AT_STATION - 48, 22, 250, { on: 'rear_floor#fogg', look: 'passepartout#head' }), ...at('passepartout', 197.0, 14.2, 75, { gait: 'run' }),
          camera_x: 202, camera_z: 11 };
        return { ...v, ...fogg(206.6, 19.5, 270, { look: 'aouda#head' }), ...at('passepartout', 203.2, 18.8, 80, { look: 'cars_side#rear' }),
          ...aouda(205.4, 19.0, 90, { look: 'fogg#head' }), ...fix(204.2, 19.6, 85, { look: 'cars_side#rear' }),
          camera_target: 'fogg', camera_shot: 0.45, camera_frame: [0.6, 0.45] };
      },
      run: async s => {
        const pp = s.person('passepartout'), fogg = s.person('fogg');
        if (yes('sl_fogg')) {
          // all of them at the last car: Fogg hands Aouda up (or Fix, without her)
          const up = s.get('aouda_here') ? 'aouda' : s.get('fix_here') ? 'fix' : 'passepartout';
          await s.wait(1.0);
          fogg.reach({ r: `${up}#hand_r` });
          s.person(up).reach({ r: 'fogg#hand_r' });
          await s.wait(1.3);
          s.tell('omaha:hand');
          await s.wait(1.2);
          fogg.reach(null);
          s.person(up).reach(null);
          await s.wait(1);
          return;
        }
        const RP = [AT_STATION - plan.gap - 47.6, 19.6];
        if (yes('omaha_train')) {
          await pp.walk([[202, 17.0], RP]);
          // nearer: Fogg's hand down from the platform, Passepartout's up to it
          const near = s.shot({ camera_x: 205.6, camera_z: 14.8 });
          await s.until(() => near.ready);
          near.cut();
          pp.turn(10);
          pp.look('fogg#head');
          pp.mood('smile');
          fogg.reach({ r: 'passepartout#hand_r' });
          pp.reach({ r: 'fogg#hand_r' });
          await s.wait(1.3);
          s.tell('omaha:hand');
          await s.wait(1.2);
          s.set('passepartout_on', 'rear_floor#pp');
          s.set('passepartout_turn', 250);
          s.set('passepartout_gait', null);
          fogg.reach(null);
          pp.reach(null);
          await s.wait(0.8);
          // the train pulls out with him
          drive(s, 480, { over: 12, ease: 'in' });
          await s.wait(5);
        } else {
          const go = drive(s, 480, { over: 10, ease: 'in' });
          await s.wait(1.5);
          await pp.walk([[201, 18.4]]);
          pp.gait(null);
          pp.turn(80);
          pp.look('cars_side#rear');
          pp.mood('sad');
          await go;
        }
        await s.wait(0.5);
      },
    },
  };
}

// the showcase's own beats: the party (Aouda and Fix with them, as most plays have it), and the two minigames played a
// little, as the game would
const SHOWCASE_ONLY = scene => {
  const F = film(scene);
  return {
    company: { from: () => ({ with_aouda: 1, with_fix: 1, aouda_dress: 1 }), run: async s => { await s.wait(0.1); } },
    under_show: {
      from: F.under.from,
      run: async s => {
        await s.wait(1);
        for (let k = 1; k <= 6; k++) {
          await s.move('pp_car', k / 2, { over: 0.4 });
          await s.wait(0.9);
        }
        await s.move('uncouple', 1, { over: 1.4, ease: 'in' });
        await s.wait(2.5);
      },
    },
    sail_show: {
      from: F.sail.from,
      run: async s => {
        s.move('sledge', 1, { over: 22, ease: 'linear' });
        await s.move('sl_speed', 1, { over: 3 });
        s.move('wolves', 1, { over: 6 });
        await s.wait(3);
        s.move('wind', -0.6, { over: 3 });
        await s.move('sheet', 0.5, { over: 2 });
        await s.wait(2);
        s.move('wolves', 0, { over: 5 });
        await s.move('drift', 0.9, { over: 3, ease: 'linear' });
        s.move('sheet', 0.1, { over: 1 });
        await s.move('sl_speed', 0.4, { over: 1 });
        s.set('drift', 0);
        await s.move('sl_speed', 0.9, { over: 2 });
        await s.wait(2);
      },
    },
  };
};
const SHOWCASE = ['company', 'bridge_stop', 'bridge_run', 'bridge_walk', 'attack', 'under_show', 'stop', 'fort', 'column', 'night_wait', 'return', 'train_leaves', 'sledge', 'sail_show', 'omaha'];

return {
  plan, ground, advance, ppX, sailFace, underCam, clamp01, mod, mixc, rgba, css, R, P, C, dim, text,
  paintLoco, rods, LOCO, paintCars, sway, carX, WINDOWS, trestle, quake, track, trackRun, rider, muzzle, wolf, stride, scrub, sledgeSide,
  aoudaWear, film, SHOWCASE_ONLY, SHOWCASE, WHO, SOLDIERS,
};
