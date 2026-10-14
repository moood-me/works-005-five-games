
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
