// The roadway, seen from above: granite setts in courses across it, wet — the engine mirrors the houses, the
// lamps and the lit windows in it (reflect, rough). Painted only where it is painted now (e.area).
const P = e.lib.plan;
const ax = 5; // the plane's across
const zc = 9; // its distance
const [l, t, r, b] = e.area;
g.fillStyle = '#4a4c4f';
g.fillRect(l, t, r - l, b - t);
// the gutters along the kerbs, darker and wetter
g.fillStyle = 'rgba(20,22,26,0.35)';
for (const d of P.road) g.fillRect(l, zc - d - 0.25, r - l, 0.5);
// the courses and the joints of the setts
const h = e.anim.hash;
const row = 0.15;
g.fillStyle = 'rgba(16,17,19,0.55)';
for (let i = Math.floor((t + zc - P.road[1]) / row) - 1; ; i++) {
  const y = zc - P.road[1] + i * row;
  if (y > b) break;
  if (y < t - row) continue;
  g.fillRect(l, y, r - l, 0.018);
  const off = h(i, 3) * 0.3;
  for (let x = Math.floor((l + ax - off) / 0.3) * 0.3 + off - ax; x < r; x += 0.3) g.fillRect(x, y, 0.016, row);
}
// stones a shade lighter or darker, here and there
const [s0, s1] = P.street;
for (let i = 0; i < 1400; i++) {
  const x = s0 - ax + (s1 - s0) * h(i, 5);
  const y = zc - P.road[1] + (P.road[1] - P.road[0]) * h(i, 6);
  if (x < l - 1 || x > r + 1 || y < t - 1 || y > b + 1) continue;
  g.fillStyle = h(i, 7) < 0.5 ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)';
  g.fillRect(x, y, 0.28, row - 0.02);
}
