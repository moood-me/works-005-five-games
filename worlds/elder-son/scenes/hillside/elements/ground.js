// The cemetery's land from above: snow; the road along the bottom, rutted; the icy path zigzag from the grave down to
// the gate, its three glassy stretches; trodden snow round the fresh grave. Metres; centre (10, 25); y toward the viewer.
const L = e.lib;
const CX = 10, CD = 25;
const X = a => a - CX, Y = d => CD - d;
g.fillStyle = '#e6ebf3';
g.fillRect(-65, -35, 130, 70);
for (let i = 0; i < 140; i++) {
  const a = -50 + e.rnd() * 110, d = -5 + e.rnd() * 60;
  g.fillStyle = i % 3 ? 'rgba(250,251,255,0.55)' : 'rgba(200,206,222,0.45)';
  g.beginPath();
  g.ellipse(X(a), Y(d), 0.8 + e.rnd() * 2.6, 0.25 + e.rnd() * 0.7, (e.rnd() - 0.5) * 0.4, 0, Math.PI * 2);
  g.fill();
}
// the road: packed, grey-brown ruts
g.fillStyle = '#d4d3d2';
g.fillRect(-65, Y(L.ROAD_D + 1.8), 130, 3.6);
for (const d of [L.ROAD_D - 0.8, L.ROAD_D + 0.7]) {
  g.strokeStyle = '#a19c96';
  g.lineWidth = 0.34;
  g.beginPath();
  for (let a = -55; a <= 75; a += 1.5) {
    const y = Y(d + Math.sin(a * 0.19 + d) * 0.1);
    if (a === -55) g.moveTo(X(a), y);
    else g.lineTo(X(a), y);
  }
  g.stroke();
}
// trodden snow round the grave, the grave's raw earth
g.fillStyle = 'rgba(176,170,168,0.6)';
g.beginPath();
g.ellipse(X(L.GRAVE[0] + 0.5), Y(L.GRAVE[1] - 0.4), 4.2, 2.4, 0, 0, Math.PI * 2);
g.fill();
g.fillStyle = '#5a4a40';
g.fillRect(X(L.GRAVE[0]) - 0.9, Y(L.GRAVE[1]) - 1.2, 1.8, 2.4);
// the path: trodden, then glassy where it is ice
g.lineCap = 'round';
g.lineJoin = 'round';
g.strokeStyle = '#c7c8cf';
g.lineWidth = 1.0;
g.beginPath();
L.PATH.forEach(([a, d], i) => (i ? g.lineTo(X(a), Y(d)) : g.moveTo(X(a), Y(d))));
g.stroke();
for (const u of L.ICE) {
  const a = L.pathAt(u - 0.035), b = L.pathAt(u + 0.035);
  g.strokeStyle = '#9fb2cc';
  g.lineWidth = 0.85;
  g.beginPath();
  g.moveTo(X(a[0]), Y(a[1]));
  g.lineTo(X(b[0]), Y(b[1]));
  g.stroke();
  g.strokeStyle = 'rgba(240,246,255,0.8)';
  g.lineWidth = 0.12;
  g.stroke();
}
// footprints by the fence where the two stand
g.fillStyle = 'rgba(150,156,170,0.5)';
for (let i = 0; i < 40; i++) {
  const a = -20 + i * 0.45, d = L.ROAD_D + (i % 2 ? 0.3 : -0.1) + (i > 36 ? 0.9 : 0);
  g.beginPath();
  g.ellipse(X(a), Y(d), 0.09, 0.15, 0.3, 0, Math.PI * 2);
  g.fill();
}
