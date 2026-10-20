// The night station behind the map (a sky: frame heights; it stands as the view moves, the chapters' points move over
// it). Low overcast lit from below by the yard's lamps; the yard's far tracks, one behind another toward the horizon,
// lamps on their masts, a far train standing (the world's trains); the near track across the
// whole frame — its far rail at 0.615, the near one at 0.632 of the frame's height, where the game's cars stand; snow.
const A = e.aspect, x0 = -0.35, w = A + 0.7;
const sky = g.createLinearGradient(0, -0.35, 0, 0.44);
sky.addColorStop(0, '#070a14');
sky.addColorStop(0.55, '#121a30');
sky.addColorStop(0.9, '#2b3150');
sky.addColorStop(1, '#4a4660');
g.fillStyle = sky;
g.fillRect(x0, -0.35, w, 0.8);
for (let i = 0; i < 12; i++) {
  const cx = x0 + e.rnd() * w, cy = 0.05 + e.rnd() * 0.25, rx = 0.25 + e.rnd() * 0.4, k = 0.15;
  const c = g.createRadialGradient(cx, cy / k, 0, cx, cy / k, rx);
  c.addColorStop(0, 'rgba(78,84,112,0.4)');
  c.addColorStop(1, 'rgba(78,84,112,0)');
  g.save();
  g.scale(1, k);
  g.fillStyle = c;
  g.fillRect(cx - rx, cy / k - rx, 2 * rx, 2 * rx);
  g.restore();
}
// the yard's snowy ground, its far tracks closer together toward the horizon
const ground = g.createLinearGradient(0, 0.43, 0, 1.25);
ground.addColorStop(0, '#5d6680');
ground.addColorStop(0.25, '#8a93ad');
ground.addColorStop(1, '#aeb6cb');
g.fillStyle = ground;
g.fillRect(x0, 0.43, w, 0.85);
for (const [y, s] of [[0.445, 0.25], [0.458, 0.35], [0.474, 0.45], [0.495, 0.6], [0.523, 0.75], [0.56, 0.9]]) {
  g.fillStyle = 'rgba(40,40,46,0.55)';
  g.fillRect(x0, y - 0.004 * s, w, 0.009 * s);
  g.fillStyle = 'rgba(30,30,34,0.5)';
  for (let x = x0; x < A + 0.35; x += 0.012 * s) g.fillRect(x, y - 0.003 * s, 0.004 * s, 0.009 * s);
  g.fillStyle = 'rgba(190,198,214,0.8)';
  g.fillRect(x0, y - 0.005 * s, w, 0.0015 * s + 0.0005);
}
// the masts and their lamps along the yard, a halo in the snowy air round each
for (let x = x0 + 0.08; x < A + 0.35; x += 0.36) {
  const top = 0.27 + 0.03 * e.rnd();
  g.fillStyle = '#20222a';
  g.fillRect(x - 0.002, top, 0.004, 0.44 - top);
  g.fillRect(x - 0.012, top, 0.024, 0.004);
  g.fillStyle = '#fff1d2';
  g.beginPath();
  g.arc(x, top + 0.008, 0.004, 0, Math.PI * 2);
  g.fill();
  const halo = g.createRadialGradient(x, top + 0.01, 0, x, top + 0.01, 0.07);
  halo.addColorStop(0, 'rgba(255,226,170,0.35)');
  halo.addColorStop(1, 'rgba(255,226,170,0)');
  g.fillStyle = halo;
  g.fillRect(x - 0.07, top - 0.06, 0.14, 0.14);
  e.light(x, top + 0.008, 0.012, '#ffe2aa', 0.8);
}
// a far train standing on a far track, its windows a chain of warm points (the world's trains)
g.save();
g.translate(A / 2 - 0.15, 0.472);
e.kit.trains.far_train(g, e, { len: 0.9, h: 0.018, cars: 8 });
g.restore();
// the near track across the frame: its ballast, the sleepers' ends, the two rails
g.fillStyle = '#6f7384';
g.fillRect(x0, 0.6, w, 0.09);
g.fillStyle = '#3a3532';
for (let x = x0; x < A + 0.35; x += 0.034) g.fillRect(x, 0.637, 0.016, 0.022);
g.fillStyle = 'rgba(228,234,244,0.85)';
for (let x = x0; x < A + 0.35; x += 0.034) if (e.rnd() < 0.6) g.fillRect(x - 0.004, 0.633 + 0.01 * e.rnd(), 0.02, 0.006);
for (const [y, t] of [[0.615, 0.006], [0.632, 0.008]]) {
  g.fillStyle = '#4c5058';
  g.fillRect(x0, y, w, t);
  g.fillStyle = '#c9d0dc';
  g.fillRect(x0, y, w, 0.0018);
}
// the snow before it, drifted, trodden along the track
g.fillStyle = '#c3cad9';
g.fillRect(x0, 0.69, w, 0.56);
for (let i = 0; i < 70; i++) {
  g.fillStyle = i % 2 ? 'rgba(232,236,244,0.55)' : 'rgba(150,160,182,0.35)';
  g.beginPath();
  g.ellipse(x0 + e.rnd() * w, 0.7 + e.rnd() * 0.5, 0.04 + e.rnd() * 0.12, 0.006 + e.rnd() * 0.015, 0, 0, Math.PI * 2);
  g.fill();
}
