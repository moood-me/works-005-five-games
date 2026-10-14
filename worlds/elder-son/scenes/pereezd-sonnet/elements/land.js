// The land seen from above: snow, the trodden road from the lower left to the crossing, the rails running off
// aslant to the far right, the planks of the crossing. Plane centre (across 20, distance 220): x = across - 20,
// y = 220 - distance.
const L = e.lib, X = a => a - 20, Y = d => 220 - d;
g.fillStyle = '#b6c1d8';
g.fillRect(-250, -240, 500, 480);
for (let i = 0; i < 170; i++) {
  const a = -70 + 170 * e.rnd(), d = -5 + 150 * e.rnd() ** 1.6, r = 1.5 + 5 * e.rnd();
  g.globalAlpha = 0.35;
  g.fillStyle = e.rnd() < 0.5 ? '#aebbd6' : '#e0e7f5';
  g.beginPath(); g.ellipse(X(a), Y(d), r * 1.8, r * 0.7, 0, 0, 6.283); g.fill();
}
g.globalAlpha = 1;
g.lineCap = 'round'; g.lineJoin = 'round';
const stroke = (pts, w, c, dx = 0, dy = 0) => {
  g.strokeStyle = c; g.lineWidth = w; g.beginPath();
  pts.forEach((p, i) => { const x = X(p[0]) + dx, y = Y(p[1]) + dy; if (i) g.lineTo(x, y); else g.moveTo(x, y); });
  g.stroke();
};
// the road: trodden, darker than the snow, two ruts
stroke(L.ROAD, 4.6, '#9aa6c0');
stroke(L.ROAD, 3.4, '#8b97b3');
stroke(L.ROAD, 0.35, '#74809c', -0.9);
stroke(L.ROAD, 0.35, '#74809c', 0.9);
// the track: snow on the ballast, sleepers, two rails
stroke(L.TRACK, 5.2, '#bcc7de');
stroke(L.TRACK, 3.4, '#5a5e70');
for (let s = -60; s < 70; s += 0.85) {
  const a = -9 + 0.91 * s, d = 10 + 0.41 * s;
  stroke([[a - 0.41 * 1.4, d + 0.91 * 1.4], [a + 0.41 * 1.4, d - 0.91 * 1.4]], 0.3, '#3a3430');
}
const side = (off, w, c) => {
  const pts = L.TRACK.map((p, i) => {
    const q = L.TRACK[Math.min(i + 1, L.TRACK.length - 1)], r = L.TRACK[Math.max(i - 1, 0)];
    let tx = q[0] - r[0], ty = q[1] - r[1]; const n = Math.hypot(tx, ty) || 1; tx /= n; ty /= n;
    return [p[0] - ty * off, p[1] + tx * off];
  });
  stroke(pts, w, c);
};
side(0.72, 0.16, '#262932'); side(-0.72, 0.16, '#262932');
side(0.72, 0.06, '#8d99b4'); side(-0.72, 0.06, '#8d99b4');
// the crossing: planks laid between and beside the rails, along the road
g.save();
g.translate(X(-1.8), Y(13.2));
g.rotate(-0.4224);
g.fillStyle = '#6b665f';
g.fillRect(-2.0, -2.4, 4.0, 4.8);
g.strokeStyle = '#4c4842'; g.lineWidth = 0.08;
for (let k = -2.0; k <= 2.0; k += 0.5) { g.beginPath(); g.moveTo(k, -2.4); g.lineTo(k, 2.4); g.stroke(); }
g.restore();
