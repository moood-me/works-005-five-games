// The street seen from above: snow, the road's frozen ruts along the middle, trodden ways to the gates and the
// porches, the path down the bank from the platform on the left. Metres; centre (0, 20); y toward the viewer.
const D0 = 20;
const X = a => a, Y = d => D0 - d;
g.fillStyle = '#e8eef6';
g.fillRect(-75, -45, 150, 90);
// soft drifts, a little bluer or whiter
for (let i = 0; i < 120; i++) {
  const a = -70 + e.rnd() * 140, d = -18 + e.rnd() * 70;
  g.fillStyle = i % 3 ? 'rgba(252,253,255,0.6)' : 'rgba(205,215,232,0.5)';
  g.beginPath();
  g.ellipse(X(a), Y(d), 1 + e.rnd() * 3, 0.3 + e.rnd() * 0.8, (e.rnd() - 0.5) * 0.4, 0, Math.PI * 2);
  g.fill();
}
// the road: packed snow, two dark frozen ruts
g.fillStyle = '#d9dcdf';
g.fillRect(-75, Y(7.6), 150, 5.2);
for (const d of [3.6, 5.3]) {
  g.strokeStyle = '#a9aaa8';
  g.lineWidth = 0.38;
  g.beginPath();
  for (let a = -75; a <= 75; a += 1.5) {
    const y = Y(d + Math.sin(a * 0.21 + d) * 0.12);
    if (a === -75) g.moveTo(X(a), y);
    else g.lineTo(X(a), y);
  }
  g.stroke();
  g.strokeStyle = '#8f8f8d';
  g.lineWidth = 0.12;
  g.stroke();
}
// trodden ways: to the porch, through the gate, to Makarskaya's window, along the far houses
g.strokeStyle = 'rgba(190,196,204,0.8)';
g.lineCap = 'round';
g.lineWidth = 0.8;
const way = pts => {
  g.beginPath();
  pts.forEach(([a, d], i) => (i ? g.lineTo(X(a), Y(d)) : g.moveTo(X(a), Y(d))));
  g.stroke();
};
way([[25.2, 7.5], [25.2, 10.2]]);
way([[20.2, 7.5], [20.2, 9.4], [21.6, 11.2]]);
way([[27.0, 7.8], [27.4, 10.7], [30.5, 11.3], [32.2, 12.3]]);
way([[36.9, 7.6], [36.9, 12.8]]);
way([[-25, 13.2], [14, 13.2]]);
// the path down the bank from the platform
g.lineWidth = 1.1;
way([[-55, 12], [-48, 10.5], [-42, 8.4], [-37, 6.6]]);
// footprints on the path
g.fillStyle = 'rgba(150,158,172,0.55)';
for (let i = 0; i < 60; i++) {
  const t = i / 60, a = -50 + t * 14 + (i % 2) * 0.25, d = 10 - t * 3.5 + (i % 2 ? 0.2 : -0.2);
  g.beginPath();
  g.ellipse(X(a), Y(d), 0.1, 0.16, 0.6, 0, Math.PI * 2);
  g.fill();
}
