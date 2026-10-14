// Generator of scenes/pereezd-sonnet3 (run: node tools/make-pereezd.js from the repository root).
// It writes scene.json and the files of the scene; edit here, not there.
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const dir = path.join(root, 'scenes', 'pereezd-sonnet3');
fs.mkdirSync(path.join(dir, 'elements'), { recursive: true });
fs.mkdirSync(path.join(root, 'modules'), { recursive: true });
const W = (rel, text) => fs.writeFileSync(path.join(dir, rel), text);

// ---------------------------------------------------------------- lib.js: the track, the train
const LIB = `
const PTS = [[-40, 4.5], [-11, 10], [6, 13.2], [14, 15.5], [24, 19.5], [36, 26.5], [42, 31], [50, 40], [58, 54], [64, 74], [68, 100], [70, 140], [70, 190]];
const seg = [];
let total = 0;
for (let i = 0; i < PTS.length - 1; i++) {
  const x0 = PTS[i][0], z0 = PTS[i][1], x1 = PTS[i + 1][0], z1 = PTS[i + 1][1];
  const len = Math.hypot(x1 - x0, z1 - z0);
  seg.push({ x0, z0, len, s0: total, ang: Math.atan2(z1 - z0, x1 - x0) });
  total += len;
}
// the point of the way T metres from its near-left end: [across, distance, angle]
function at(T) {
  let i = 0;
  if (T > 0) { while (i < seg.length - 1 && T > seg[i].s0 + seg[i].len) i++; }
  const s = seg[i], u = T - s.s0;
  return [s.x0 + Math.cos(s.ang) * u, s.z0 + Math.sin(s.ang) * u, s.ang];
}
const KINDS = ['tank', 'box', 'tank', 'flat', 'box', 'box', 'tank', 'hopper', 'box', 'flat', 'tank', 'box', 'tank', 'box'];
const cars = [{ kind: 'loco', len: 15, off: 7.5 }];
let off = 15;
for (const k of KINDS) { cars.push({ kind: k, len: 11.2, off: off + 5.6 }); off += 11.2; }
const trainLen = off;
const SPEED = 17;
const FAR = 0.04;
// the key 'freight' (0.04 … 1) in metres the front has gone from the far end of the way
function freightToX(f) { return Math.max(0, (f - FAR) / (1 - FAR)) * (total + trainLen); }

function snowCap(g, x0, x1, y, rnd) {
  g.fillStyle = '#e4eaf5';
  g.beginPath();
  g.moveTo(x0, y);
  for (let x = x0; x <= x1; x += 0.6) g.lineTo(x, y - 0.12 - rnd() * 0.16);
  g.lineTo(x1, y);
  g.closePath();
  g.fill();
}
function bogies(g, h) {
  g.fillStyle = '#1d2029';
  g.fillRect(-h + 0.7, -0.7, 2.7, 0.7);
  g.fillRect(h - 3.4, -0.7, 2.7, 0.7);
  g.fillStyle = '#2b2f3a';
  g.fillRect(-h, -1.0, h * 2, 0.34);
}
function car(g, kind, L, rnd) {
  const h = L / 2;
  bogies(g, h);
  if (kind === 'tank') {
    g.fillStyle = '#4a5160';
    g.beginPath(); g.ellipse(0, -2.15, h - 0.4, 1.15, 0, 0, 6.2832); g.fill();
    g.fillStyle = '#6a7388';
    g.fillRect(-h + 1.1, -3.15, L - 2.2, 0.16);
    g.fillStyle = '#2a2f3a';
    g.fillRect(-0.45, -3.55, 0.9, 0.35);
    snowCap(g, -h + 1, h - 1, -3.28, rnd);
  } else if (kind === 'box') {
    const cols = ['#6b4c4a', '#4e6460', '#5d6577'];
    g.fillStyle = cols[Math.floor(rnd() * 3)];
    g.fillRect(-h + 0.2, -3.6, L - 0.4, 2.6);
    g.fillStyle = 'rgba(0,0,0,0.28)';
    g.fillRect(-0.9, -3.45, 1.8, 2.35);
    for (let x = -h + 0.9; x < h - 0.5; x += 1.4) g.fillRect(x, -3.5, 0.08, 2.4);
    g.fillStyle = '#2a2d36';
    g.fillRect(-h + 0.1, -3.75, L - 0.2, 0.18);
    snowCap(g, -h + 0.2, h - 0.2, -3.75, rnd);
  } else if (kind === 'flat') {
    g.fillStyle = '#3d414c';
    g.fillRect(-h + 0.1, -1.55, L - 0.2, 0.55);
    g.fillStyle = '#6e5a49';
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 3; j++) {
        g.beginPath(); g.arc(-h + 1.3 + i * 1.62, -1.9 - j * 0.62 + (j % 2) * 0, 0.34, 0, 6.2832); g.fill();
      }
    }
    g.fillStyle = '#d9e0ee';
    g.fillRect(-h + 0.9, -3.45, L - 1.8, 0.2);
  } else {
    g.fillStyle = '#58606e';
    g.beginPath();
    g.moveTo(-h + 0.3, -3.4); g.lineTo(h - 0.3, -3.4); g.lineTo(h - 1.2, -1.35); g.lineTo(-h + 1.2, -1.35);
    g.closePath(); g.fill();
    g.fillStyle = '#d9e0ee';
    g.fillRect(-h + 0.5, -3.55, L - 1.0, 0.2);
  }
}
function loco(g, rnd) {
  const h = 7.5;
  bogies(g, h);
  g.fillStyle = '#4a5758';
  g.fillRect(-h + 0.1, -2.9, 9.0, 1.9);            // the nose (to the left, where the train goes)
  g.fillRect(-h + 8.6, -3.9, 5.3, 2.9);             // the cab
  g.fillStyle = '#2f3b3c';
  g.fillRect(-h + 0.1, -3.05, 9.0, 0.2);
  g.fillRect(-h + 8.4, -4.1, 5.7, 0.25);
  g.fillStyle = '#1b222a';
  g.fillRect(-h + 9.4, -3.6, 1.5, 1.0);             // cab windows
  g.fillRect(-h + 11.5, -3.6, 1.5, 1.0);
  g.fillStyle = '#c9d0de';
  g.fillRect(-h + 0.1, -1.95, 9.0, 0.16);           // a pale stripe
  g.fillStyle = '#233033';
  for (let x = -h + 1.0; x < -h + 8.5; x += 1.0) g.fillRect(x, -2.7, 0.5, 0.55);   // grilles
  snowCap(g, -h + 0.1, -h + 9.0, -3.05, rnd);
  snowCap(g, -h + 8.4, -h + 14.1, -4.1, rnd);
  // the lamp
  g.fillStyle = '#fff3d0';
  g.beginPath(); g.arc(-h + 0.35, -2.5, 0.22, 0, 6.2832); g.fill();
}
return { PTS, seg, total, at, cars, trainLen, SPEED, FAR, freightToX, car, loco };
`;
W('lib.js', LIB);

// default places of the cars at freight = FAR (the front at the far end)
const L = new Function('anim', 'kit', LIB)();
const carState = {};
L.cars.forEach((c, i) => {
  const p = L.at(L.total + c.off);
  carState['c' + i + '_a'] = +p[0].toFixed(2);
  carState['c' + i + '_d'] = +p[1].toFixed(2);
  carState['c' + i + '_f'] = +(180 - (p[2] * 180) / Math.PI).toFixed(2);
});

// ---------------------------------------------------------------- elements
const objects = [];
const files = {};
function el(spec, code, animate) {
  objects.push(spec);
  if (code) files['elements/' + spec.id + '.js'] = code;
  if (animate) files['elements/' + spec.id + '.animate.js'] = animate;
}

// the sky: cold dusk, the pale glow low on the right where the train will come from
el(
  { id: 'sky', name: 'Небо', sky: true },
  `
const A = e.aspect;
const gr = g.createLinearGradient(0, -0.35, 0, 1.25);
gr.addColorStop(0, '#0b1430');
gr.addColorStop(0.25, '#16264a');
gr.addColorStop(0.44, '#46628f');
gr.addColorStop(0.5, '#6a82b0');
gr.addColorStop(0.56, '#3b4c76');
gr.addColorStop(1, '#27345a');
g.fillStyle = gr;
g.fillRect(-0.3, -0.35, A + 0.6, 1.6);
e.layer('stars', { box: [-0.3, -0.35, A + 0.3, 0.42], flicker: 0.25 }, g => {
  for (let i = 0; i < 70; i++) {
    const x = -0.3 + e.rnd() * (A + 0.6), y = -0.35 + e.rnd() * 0.7;
    g.globalAlpha = 0.25 + e.rnd() * 0.5;
    g.fillStyle = '#dfe8ff';
    g.beginPath(); g.arc(x, y, 0.0016 + e.rnd() * 0.0016, 0, 6.2832); g.fill();
  }
});
e.layer('glow', { box: [A * 0.45, 0.1, A * 1.1, 0.48] }, g => {
  const r = g.createRadialGradient(A * 0.82, 0.41, 0, A * 0.82, 0.41, 0.5);
  r.addColorStop(0, 'rgba(190,208,236,0.75)');
  r.addColorStop(0.35, 'rgba(120,150,205,0.35)');
  r.addColorStop(1, 'rgba(60,90,160,0)');
  g.fillStyle = r;
  g.fillRect(A * 0.45, 0.0, A * 0.7, 0.5);
});
`,
  `
e.layer('glow').alpha = 1 - 0.55 * (e.state.night || 0);
e.layer('stars').alpha = 0.45 + 0.55 * (e.state.night || 0);
`,
);

// the land: snow, the road, the track
el(
  { id: 'field', name: 'Поле', plane: true, across: 0, distance: 650, width: 2600, depth: 1300, elevation: -0.03 },
  `g.fillStyle = '#cfd8e8'; g.fillRect(-1300, -650, 2600, 1300);`,
);
el(
  { id: 'ground', name: 'Снег и пути', plane: true, across: 30, distance: 97.5, width: 160, depth: 215, elevation: 0, walk: true },
  `
const L = e.lib, CX = 30, CZ = 97.5;
const P = (a, d) => [a - CX, CZ - d];
g.fillStyle = '#cfd8e8';
g.fillRect(-80, -108, 160, 215);
for (let i = 0; i < 260; i++) {
  const a = -48 + e.rnd() * 156, d = -8 + e.rnd() * 130;
  const p = P(a, d);
  g.fillStyle = e.rnd() < 0.5 ? 'rgba(255,255,255,0.4)' : 'rgba(110,132,182,0.16)';
  g.beginPath(); g.ellipse(p[0], p[1], 1 + e.rnd() * 5, 0.3 + e.rnd() * 1.2, 0, 0, 6.2832); g.fill();
}
// the road, from the lower left corner to the crossing and on to the field
const road = [[-10, -2], [-6, 2], [-3, 6.5], [-1.2, 10.5], [-0.2, 15], [0.8, 24], [1.8, 42], [2.8, 72], [3.4, 120]];
function roadPath(da) {
  g.beginPath();
  road.forEach((r, i) => { const p = P(r[0] + da, r[1]); if (i) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]); });
}
g.lineJoin = 'round'; g.lineCap = 'round';
roadPath(0); g.strokeStyle = '#e6ecf7'; g.lineWidth = 6.2; g.stroke();
roadPath(0); g.strokeStyle = '#9ba7be'; g.lineWidth = 4.2; g.stroke();
roadPath(-0.85); g.strokeStyle = 'rgba(88,102,138,0.55)'; g.lineWidth = 0.4; g.stroke();
roadPath(0.85); g.strokeStyle = 'rgba(88,102,138,0.55)'; g.lineWidth = 0.4; g.stroke();
// the track: a bed, sleepers, the crossing deck, the rails
const samples = [];
for (let T = -6; T < L.total + 4; T += (T < 120 ? 0.65 : 3)) samples.push(L.at(T));
g.beginPath();
samples.forEach((s, i) => { const p = P(s[0], s[1]); if (i) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]); });
g.strokeStyle = '#7d889f'; g.lineWidth = 3.6; g.stroke();
g.strokeStyle = 'rgba(224,231,244,0.55)'; g.lineWidth = 2.9; g.stroke();
g.strokeStyle = '#3f4453'; g.lineWidth = 0.26;
samples.forEach(s => {
  const nx = -Math.sin(s[2]), nz = Math.cos(s[2]);
  const a = P(s[0] - nx * 1.3, s[1] - nz * 1.3), b = P(s[0] + nx * 1.3, s[1] + nz * 1.3);
  g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
});
g.save();
const here = (function () { let best = 0, bd = 1e9; for (let T = 0; T < 80; T += 0.5) { const s = L.at(T); const d = Math.hypot(s[0] + 0.3, s[1] - 12.6); if (d < bd) { bd = d; best = T; } } return L.at(best); })();
g.translate(P(here[0], here[1])[0], P(here[0], here[1])[1]);
g.rotate(-here[2]);
g.fillStyle = '#505669'; g.fillRect(-2.9, -1.9, 5.8, 3.8);
g.strokeStyle = '#3a3f4d'; g.lineWidth = 0.07;
for (let x = -2.8; x < 2.9; x += 0.42) { g.beginPath(); g.moveTo(x, -1.9); g.lineTo(x, 1.9); g.stroke(); }
g.fillStyle = 'rgba(235,240,250,0.35)'; g.fillRect(-2.9, -0.4, 5.8, 0.8);
g.restore();
for (const side of [-0.72, 0.72]) {
  g.beginPath();
  samples.forEach((s, i) => {
    const p = P(s[0] + -Math.sin(s[2]) * side, s[1] + Math.cos(s[2]) * side);
    if (i) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]);
  });
  g.strokeStyle = '#b4bfd4'; g.lineWidth = 0.14; g.stroke();
}
`,
);

// the far forest behind the arc, and the village lights
el(
  { id: 'forest', name: 'Лес', across: 20, distance: 215, height: 30, box: [-340, -30, 340, 2] },
  `
for (let layer = 0; layer < 2; layer++) {
  g.fillStyle = layer ? '#1a2640' : '#222f4c';
  for (let x = -330; x < 330; x += 2.2 + e.rnd() * 2.4) {
    const h = 9 + e.rnd() * 14 + layer * 3, w = 2.4 + e.rnd() * 2.6;
    g.beginPath();
    g.moveTo(x - w, 1); g.lineTo(x, -h); g.lineTo(x + w, 1);
    g.closePath(); g.fill();
  }
}
g.fillStyle = '#1a2640'; g.fillRect(-340, -4, 680, 6);
`,
);
el(
  { id: 'posyolok', name: 'Огни посёлка', across: -23, distance: 44, height: 8, box: [-30, -8, 30, 0.5] },
  `
const houses = [[-24, 5.5, 3.4], [-15, 6.2, 3.8], [-5, 5.8, 3.2], [4, 6.5, 4], [13, 5.6, 3.3], [22, 6, 3.6]];
houses.forEach((hs, i) => {
  g.fillStyle = '#26324f';
  g.fillRect(hs[0] - hs[1] / 2, -hs[2], hs[1], hs[2]);
  g.beginPath(); g.moveTo(hs[0] - hs[1] / 2 - 0.4, -hs[2]); g.lineTo(hs[0], -hs[2] - 1.9); g.lineTo(hs[0] + hs[1] / 2 + 0.4, -hs[2]); g.closePath(); g.fill();
  g.fillStyle = '#c8d2e6';
  g.beginPath(); g.moveTo(hs[0] - hs[1] / 2 - 0.4, -hs[2]); g.lineTo(hs[0], -hs[2] - 1.9); g.lineTo(hs[0] + hs[1] / 2 + 0.4, -hs[2]); g.lineTo(hs[0] + hs[1] / 2 - 0.2, -hs[2] - 0.2); g.lineTo(hs[0], -hs[2] - 1.6); g.lineTo(hs[0] - hs[1] / 2 + 0.2, -hs[2] - 0.2); g.closePath(); g.fill();
  if (i % 2 === 0 || i === 3) {
    g.fillStyle = '#f2b868';
    g.fillRect(hs[0] - 0.5, -hs[2] * 0.7, 0.9, 0.7);
    e.light(hs[0], -hs[2] * 0.7 + 0.3, 2.2, '#ffb35a', 0.55);
  }
});
`,
);

// the crossing's things
el(
  { id: 'barrier', name: 'Шлагбаум', across: -5.2, distance: 8, height: 1.6, box: [-1.4, -6.2, 7.2, 0.2] },
  `
g.fillStyle = '#7f879b'; g.fillRect(-0.2, -1.3, 0.4, 1.3);
g.fillStyle = '#d3d9e6'; g.fillRect(-0.34, -1.52, 0.68, 0.5);
e.layer('arm', { pivot: [0, -1.25] }, g => {
  for (let i = 0; i < 9; i++) {
    g.fillStyle = i % 2 ? '#e3e8f1' : '#a8434a';
    g.fillRect(-0.8 + i * 0.75, -1.4, 0.75, 0.3);
  }
  g.fillStyle = '#434c64'; g.fillRect(-1.25, -1.62, 0.55, 0.68);
  g.fillStyle = '#7a1f25'; g.beginPath(); g.arc(5.7, -1.48, 0.14, 0, 6.2832); g.fill();
  e.light(5.7, -1.5, 0.5, '#ff4a3a', 0.9, 'tip');
});
e.at(2.2, -1.25);
`,
  `
const b = e.state.barrier || 0, r = -(1 - b) * 1.25;
e.layer('arm').rotate = r;
e.at(2.2 * Math.cos(r), -1.25 + 2.2 * Math.sin(r));
e.glow('tip', (e.state.bell || 0) * (Math.sin(e.t * 5.6) > 0 ? 1 : 0.15));
`,
);
el(
  { id: 'signal', name: 'Светофор переезда', across: 2.6, distance: 9.4, height: 3.8, box: [-1.2, -4.0, 1.2, 0.1] },
  `
g.fillStyle = '#9aa3b8'; g.fillRect(-0.07, -3.7, 0.14, 3.7);
for (let i = -1; i <= 1; i += 2) {
  g.save(); g.translate(0, -2.35); g.rotate(i * 0.62);
  g.fillStyle = '#e6eaf3'; g.fillRect(-0.7, -0.07, 1.4, 0.14);
  g.restore();
}
g.fillStyle = '#272c3b'; g.fillRect(-0.55, -3.65, 1.1, 0.55);
g.fillStyle = '#5a1f25';
g.beginPath(); g.arc(-0.24, -3.38, 0.15, 0, 6.2832); g.fill();
g.beginPath(); g.arc(0.24, -3.38, 0.15, 0, 6.2832); g.fill();
e.light(-0.24, -3.38, 0.45, '#ff4538', 1.0, 'a');
e.light(0.24, -3.38, 0.45, '#ff4538', 1.0, 'b');
`,
  `
const k = (e.state.bell || 0) * (Math.sin(e.t * 5.6) > 0 ? 1 : 0);
e.glow('a', k);
e.glow('b', (e.state.bell || 0) * (1 - k) );
`,
);
el(
  { id: 'budka', name: 'Будка дежурной', across: 6.2, distance: 10.5, height: 3.8, box: [-2.4, -5.2, 2.4, 0.2] },
  `
g.fillStyle = '#6e5c58'; g.fillRect(-1.8, -2.6, 3.6, 2.6);
g.fillStyle = 'rgba(30,22,26,0.4)';
for (let y = -2.4; y < 0; y += 0.32) g.fillRect(-1.8, y, 3.6, 0.04);
g.fillStyle = '#2d2b38';
g.beginPath(); g.moveTo(-2.2, -2.6); g.lineTo(0, -3.9); g.lineTo(2.2, -2.6); g.closePath(); g.fill();
g.fillStyle = '#e4eaf5';
g.beginPath(); g.moveTo(-2.3, -2.55); g.lineTo(0, -4.0); g.lineTo(2.3, -2.55); g.lineTo(2.0, -2.5); g.lineTo(0, -3.75); g.lineTo(-2.0, -2.5); g.closePath(); g.fill();
g.fillStyle = '#322e3a'; g.fillRect(0.9, -1.85, 0.7, 1.85);
g.fillStyle = '#4a4552'; g.fillRect(1.15, -4.3, 0.34, 0.9);
e.at(1.32, -4.35, 'chimney');
`,
);
el(
  { id: 'budka_win', name: 'Окно будки', across: 6.2, distance: 10.47, height: 1.2, glows: true, box: [-1.6, -2.2, 1.0, 0.2] },
  `
g.fillStyle = '#3a2f33'; g.fillRect(-1.02, -2.05, 1.24, 1.0);
g.fillStyle = '#f5b867'; g.fillRect(-0.95, -1.98, 1.1, 0.86);
g.fillStyle = '#fcd9a0'; g.fillRect(-0.95, -1.98, 1.1, 0.3);
g.fillStyle = '#3a2f33'; g.fillRect(-0.42, -1.98, 0.05, 0.86);
e.light(-0.4, -1.55, 1.8, '#ffb35a', 1.3, 'lamp');
`,
);

// the train: the loco and the wagons are cards that the script walks along the way
objects.push({ id: 'freight_glow', name: 'Огонь товарного', unseen: false, across: 70, distance: 191, elevation: 2.4, height: 6, glows: true, box: [-9, -9, 9, 9] });
files['elements/freight_glow.js'] = `
const r = g.createRadialGradient(0, 0, 0, 0, 0, 9);
r.addColorStop(0, 'rgba(255,246,214,1)');
r.addColorStop(0.15, 'rgba(255,236,190,0.65)');
r.addColorStop(1, 'rgba(255,230,180,0)');
g.fillStyle = r; g.fillRect(-9, -9, 18, 18);
e.light(0, 0, 4.5, '#fff0c8', 1.6, 'far');
`;
files['elements/freight_glow.animate.js'] = `
const f = e.state.freight || 0;
const lamp = e.state.freight_lamp || 0;
e.glow('far', lamp * (1 - Math.min(1, Math.max(0, (f - 0.05) / 0.12))));
`;
L.cars.forEach((c, i) => {
  const spec = {
    id: 'c' + i,
    name: i === 0 ? 'Товарный' : 'Вагон',
    across: carState['c' + i + '_a'],
    distance: carState['c' + i + '_d'],
    elevation: 0.16,
    facing: carState['c' + i + '_f'],
    height: 4.2,
    box: [-c.len / 2 - 0.4, -4.6, c.len / 2 + 0.4, 0.3],
    place: { across: 'c' + i + '_a', distance: 'c' + i + '_d', facing: 'c' + i + '_f' },
  };
  if (i === 0) {
    spec.id = 'freight';
    // the loco is the element 'freight' (the point freight#light)
    el(
      Object.assign({}, spec, { place: { across: 'c0_a', distance: 'c0_d', facing: 'c0_f' } }),
      `
e.lib.loco(g, e.rnd);
e.at(-7.15, -2.5, 'light');
e.light(-7.15, -2.5, 1.3, '#fff0c8', 1.1, 'lamp');
`,
      `
e.glow('lamp', e.state.freight_lamp || 0);
`,
    );
  } else {
    el(spec, "e.lib.car(g, '" + c.kind + "', " + c.len + ', e.rnd);');
  }
});

// the people
const PERSONS = [
  ['nina', 'Нина', -4.6, 2.6, 'nina_a', 'nina_d'],
  ['busygin', 'Бусыгин', -5.4, 2.1, 'busygin_a', 'busygin_d'],
];
PERSONS.forEach(p => {
  el({
    id: p[0],
    name: p[1],
    person: { cast: 'cast', who: p[0], turn: 0 },
    across: p[2],
    distance: p[3],
    place: { across: p[4], distance: p[5] },
    shadow: true,
  });
});

// the weather
objects.push({ id: 'snowfall', name: 'Снег', particles: { kind: 'snow', amount: 'snow', count: 4500, reach: 24 } });
objects.push({ id: 'budka_smoke', name: 'Дым', particles: { kind: 'smoke', at: 'budka#chimney', rate: 2.5, amount: 1, size: [0.3, 1.4], opacity: 0.4, color: '#c8d1e4', life: [3, 6] } });

// ---------------------------------------------------------------- state
const state = Object.assign(
  {
    beat: '',
    beat_next: '',
    beat_done: '',
    hour: 0.78,
    night: 0.4,
    barrier: 0,
    bell: 0,
    freight: 0.04,
    freight_x: 0,
    freight_lamp: 0,
    at_barrier: false,
    snow: 0.6,
    nina_a: -4.6,
    nina_d: 2.6,
    busygin_a: -5.4,
    busygin_d: 2.1,
    nina_turn: 0,
    busygin_turn: 0,
  },
  carState,
);
const states = {
  hour: { range: [0, 1], smooth: true, means: '0.78 — dusk, 0.82 — darker (the weight of the light looks)' },
  night: { range: [0, 1], smooth: true, means: 'derived from hour by the script: the night look' },
  beat: { type: 'string', means: 'the piece to play: wait, truth, roar, brother' },
  beat_next: { type: 'string', means: 'the piece the game plays next (the scene does not need it: every piece cuts to its own start)' },
  beat_done: { type: 'string', means: 'the name of the piece that ended last' },
  barrier: { range: [0, 1], smooth: true, means: '0 — the barrier up, 1 — down' },
  bell: { values: [0, 1], means: '1 — the bell rings, the red lights blink' },
  freight: { range: [0, 1], smooth: true, means: '0.04 — the lamp on the far arc; 0.1…0.9 — passing in front of them; 1 — gone to the left' },
  freight_x: { range: [0, 600], means: 'metres the front of the train has gone from the far end of the track (set by the script)' },
  freight_lamp: { range: [0, 1], smooth: true, means: 'the lamp of the freight lit' },
  at_barrier: { type: 'boolean', means: 'the two stand at the barrier (the script keeps it)' },
  snow: { range: [0, 1], means: 'the snowfall' },
  nina_a: { range: [-10, 10], means: 'Nina across, metres' },
  nina_d: { range: [0, 30], means: 'Nina distance, metres' },
  busygin_a: { range: [-10, 10], means: 'Busygin across, metres' },
  busygin_d: { range: [0, 30], means: 'Busygin distance, metres' },
};
L.cars.forEach((c, i) => {
  states['c' + i + '_a'] = { type: 'number', means: 'car ' + i + ' across (the script)' };
  states['c' + i + '_d'] = { type: 'number', means: 'car ' + i + ' distance (the script)' };
  states['c' + i + '_f'] = { type: 'number', means: 'car ' + i + ' facing (the script)' };
});

const scene = {
  engine: 3,
  title: 'Переезд',
  caption: 'Переезд за посёлком, темнеет.',
  horizon: 0.4,
  camera: { mode: 'picture' },
  light: {
    tint: '#6b86c8',
    tintStrength: 0.1,
    vignette: 0.35,
    grain: 0.22,
    haze: 0.12,
    hazeColor: '#41568a',
    hazeGlow: 0.6,
    brightness: 1.08,
    saturation: 0.95,
    ambient: 0.62,
    ambientColor: '#8aa0d2',
    bounce: 0.5,
    wind: [1, 0, 0.35],
    looks: {
      night: { ambient: 0.5, ambientColor: '#6a82c0', tint: '#2a3f84', tintStrength: 0.18, haze: 0.2, hazeColor: '#26365f' },
    },
  },
  lights: [
    { id: 'key', from: [165, 30], color: '#a9bde8', strength: 0.95 },
    { id: 'rim', from: [15, 12], color: '#7f95d6', strength: 0.5 },
    { id: 'win', of: 'budka_win', color: '#ffb25a', strength: 0.9, reach: 7 },
    { id: 'head', of: 'freight#lamp', color: '#fff0cc', strength: 0.9, reach: 16 },
  ],
  state,
  states,
  modules: ['cast'],
  objects,
  music: {
    prompts: [
      { text: 'very quiet cold ambient pad, distant wind over a snowy field', weight: 1.4 },
      { text: 'low sustained strings, barely moving, winter dusk', weight: 0.9 },
      { text: 'a single distant bell tone, metallic, sparse', weight: 0.4 },
      { text: 'soft felt piano, slow single notes, lonely', weight: 0.6 },
      { text: 'deep drone, slowly breathing, ominous calm', weight: 0.5 },
      { text: 'airy high texture like frost, glassy shimmer', weight: 0.3 },
      { text: 'sparse minimal pulse, heartbeat like, very low', weight: 0 },
      { text: 'old accordion, far off, melancholic', weight: 0 },
      { text: 'sub bass rumble of a distant train', weight: 0.3 },
      { text: 'gentle harp harmonics, cold air', weight: 0 },
      { text: 'slow cello, dry and soft, sorrow under a smile', weight: 0 },
      { text: 'tape hiss and soft low synth, 1970s soviet film score', weight: 0.4 },
      { text: 'whispering wind chimes, icy, sparse', weight: 0 },
      { text: 'muted piano interval, fading into silence', weight: 0 },
      { text: 'warm faint glow of a harmonium, a window far away', weight: 0.2 },
      { text: 'crunching snow footsteps texture, very soft', weight: 0 },
    ],
    bpm: 62,
    density: 0.2,
    brightness: 0.3,
  },
};

W('scene.json', JSON.stringify(scene, null, 2) + '\n');
for (const rel of Object.keys(files)) {
  fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true });
  W(rel, files[rel].replace(/^\n/, ''));
}

// ---------------------------------------------------------------- script
W(
  'script.js',
  `
const L = scene.lib;
const NCARS = L.cars.length;
const ST = { nina: [-1.6, 5.5], busygin: [-0.6, 5.5] };   // where they stand at the barrier
const ACROSS = { nina: [-1.2, 20], busygin: [-0.2, 20.5] };  // over the track and on

function placeCars() {
  const D = scene.get('freight_x');
  const Tf = L.total - D;
  for (let i = 0; i < NCARS; i++) {
    const p = L.at(Tf + L.cars[i].off);
    scene.set('c' + i + '_a', p[0]);
    scene.set('c' + i + '_d', p[1]);
    scene.set('c' + i + '_f', 180 - (p[2] * 180) / Math.PI);
  }
}
function onFreight() {
  scene.set('freight_x', L.freightToX(scene.get('freight')));
  placeCars();
}
function onHour() {
  const h = scene.get('hour');
  scene.set('night', Math.min(1, Math.max(0, (h - 0.7) / 0.2)));
}
scene.on('change', 'freight', onFreight);
scene.on('move', 'freight', onFreight);
scene.on('change', 'hour', onHour);
scene.on('move', 'hour', onHour);
scene.on('load', () => { onFreight(); onHour(); });

// the stand at the barrier, at once: the scene may be opened on any piece
function atBarrier(s) {
  s.set('nina_a', ST.nina[0]); s.set('nina_d', ST.nina[1]);
  s.set('busygin_a', ST.busygin[0]); s.set('busygin_d', ST.busygin[1]);
  s.set('nina_turn', 0); s.set('busygin_turn', 0);
  s.set('nina_look', null); s.set('busygin_look', null);
  s.set('nina_reach', null); s.set('busygin_reach', null);
  s.set('barrier', 1); s.set('bell', 1);
  s.set('freight', L.FAR); s.set('freight_lamp', 1);
  s.set('hour', 0.82);
  s.set('at_barrier', true);
}
function trainTime() { return (L.total + L.trainLen) / L.SPEED; }
// seconds the train needs from the far end to the moment the front is at metre D
function untilFront(s, T) {
  // the front is at T metres of the way from the near-left end
  return s.until(() => scene.get('freight_x') >= L.total - T);
}
function untilTail(s, T) {
  return s.until(() => scene.get('freight_x') >= L.total - T + L.trainLen);
}
function startTrain(s) {
  const from = scene.get('freight');
  const left = (1 - from) / (1 - L.FAR) * trainTime();
  s.move('freight', 1, { over: left, ease: 'linear' });
}
async function cross(s, together) {
  const n = s.person('nina'), b = s.person('busygin');
  s.set('bell', 0);
  await s.all(
    n.walk([[-1.2, 12.4], [ACROSS.nina[0], ACROSS.nina[1]]]),
    (async () => { await s.wait(0.9); await b.walk([[-0.4, 12.4], [ACROSS.busygin[0], ACROSS.busygin[1]]]); })(),
  );
  s.set('at_barrier', false);
}

const BEATS = {
  wait: async s => {
    const n = s.person('nina'), b = s.person('busygin');
    s.set('nina_a', -4.6); s.set('nina_d', 2.6); s.set('busygin_a', -5.4); s.set('busygin_d', 2.1);
    s.set('nina_turn', 0); s.set('busygin_turn', 0);
    s.set('nina_look', null); s.set('busygin_look', null); s.set('nina_reach', null); s.set('busygin_reach', null);
    s.set('barrier', 0); s.set('bell', 0); s.set('freight', L.FAR); s.set('freight_lamp', 0);
    s.set('hour', 0.78); s.set('at_barrier', false);
    s.move('hour', 0.82, { over: 20, ease: 'linear' });
    const walk = s.all(
      n.walk([[-3.0, 4.0], [ST.nina[0], ST.nina[1]]]),
      (async () => { await s.wait(0.5); await b.walk([[-3.8, 3.5], [-2.0, 4.6], [ST.busygin[0], ST.busygin[1]]]); })(),
    );
    await s.wait(3.0);
    s.set('bell', 1);
    s.move('barrier', 1, { over: 5, ease: 'inOut' });
    await walk;
    n.turn(10);
    n.look('barrier');
    await s.until(() => scene.get('barrier') >= 0.5);
    b.look('freight#light');
    s.move('freight_lamp', 1, { over: 1.6 });
    await s.wait(0.8);
    s.tell('wait:light');
    await s.until(() => scene.get('barrier') >= 1);
    await s.until(() => scene.get('hour') >= 0.82);
    s.set('at_barrier', true);
    s.set('beat_done', 'wait');
    s.tell('beat:wait');
  },
  truth: async s => {
    if (!s.get('at_barrier')) atBarrier(s);
    const n = s.person('nina'), b = s.person('busygin');
    startTrain(s);
    await s.wait(1.0);
    await b.turn(270);
    s.tell('truth:said');
    await s.wait(0.6);
    n.look('busygin#head');
    await n.turn(70);
    await untilFront(s, 22);
    n.look('freight');
    await n.turn(0);
    await untilTail(s, 22);
    s.move('barrier', 0, { over: 3 });
    s.set('bell', 0);
    s.tell('truth:passed');
    n.look('busygin#head');
    await n.turn(70);
    await s.wait(0.6);
    await cross(s);
    s.set('beat_done', 'truth');
    s.tell('beat:truth');
  },
  roar: async s => {
    if (!s.get('at_barrier')) atBarrier(s);
    const n = s.person('nina'), b = s.person('busygin');
    startTrain(s);
    await untilFront(s, 8);
    s.tell('roar:loud');
    await b.turn(270);
    await s.wait(0.4);
    n.look('busygin#head');
    await n.turn(70);
    await s.wait(1.6);
    n.look([ST.busygin[0] - 0.4, ST.busygin[1], 0.4]);
    await s.wait(0.9);
    n.look('busygin#head');
    await untilTail(s, 22);
    s.move('barrier', 0, { over: 3 });
    s.set('bell', 0);
    s.tell('roar:passed');
    await s.wait(0.5);
    await cross(s);
    s.set('beat_done', 'roar');
    s.tell('beat:roar');
  },
  brother: async s => {
    if (!s.get('at_barrier')) atBarrier(s);
    const n = s.person('nina'), b = s.person('busygin');
    startTrain(s);
    await s.wait(1.0);
    await n.turn(60);
    s.set('nina_reach', { r: 'busygin#hand_l' });
    s.set('busygin_reach', { l: 'nina#hand_r' });
    await s.wait(1.2);
    s.tell('brother:arm');
    await n.turn(0);
    await untilTail(s, 22);
    s.move('barrier', 0, { over: 3 });
    s.set('bell', 0);
    s.tell('brother:passed');
    await s.wait(0.5);
    await cross(s, true);
    s.set('nina_reach', null); s.set('busygin_reach', null);
    s.set('beat_done', 'brother');
    s.tell('beat:brother');
  },
};

function start(name) {
  const f = BEATS[name];
  if (f) scene.sequence(f, { name: 'film' });
}
scene.on('change', 'beat', v => start(v));
scene.on('load', () => { const b = scene.get('beat'); if (b) start(b); });
`,
);

W(
  'showcase.js',
  `
return [
  { name: 'wait', run: async s => { s.set('beat', 'wait'); await s.until(() => s.get('beat_done') === 'wait'); } },
  { name: 'truth', run: async s => { s.set('beat', 'truth'); await s.until(() => s.get('beat_done') === 'truth'); } },
];
`,
);

// ---------------------------------------------------------------- the world's cast
fs.writeFileSync(
  path.join(root, 'modules', 'cast.js'),
  `// the people of «Старший сын»: shadow figures with a rim of light, no faces
const base = { kind: 'shapes', style: 'shadow', paint: 'rim', line: false, face: 'none' };
return {
  characters: {
    busygin: Object.assign({}, base, {
      who: 'man', garment: 'coat', hat: 'none', hair: 'short', scarf: true,
      body: { height: 1.04 },
      colors: { garment: '#5d6781', accent: '#e8ebf2', hair: '#1d1f28', bottom: '#2b2f3c', shoes: '#1b1d25' },
    }),
    nina: Object.assign({}, base, {
      who: 'woman', garment: 'coat', hat: 'none', hair: 'long', scarf: true,
      body: { height: 0.93 },
      colors: { garment: '#8a6a76', accent: '#d9cdc6', hair: '#3a2a2c', bottom: '#2b2f3c', shoes: '#1b1d25' },
    }),
  },
};
`,
);
fs.writeFileSync(
  path.join(root, 'modules', 'cast.md'),
  `# cast

People of «Старший сын». Characters (\`person.who\`): \`busygin\` (tall, long dark-grey coat, light scarf, bare head, short hair),
\`nina\` (shorter, plum coat with a pale fur collar, long hair). Style \`shadow\`, paint \`rim\`, no faces.
Only these two are made so far (scene «Переезд»); the rest of the table of scenes.md «Люди мира» is to add.
`,
);
console.log('written', objects.length, 'elements');
