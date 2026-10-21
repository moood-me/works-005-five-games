// The snow of the plain, seen from above (the plane's metres: x along the line, y toward the viewer — 985 − distance).
// Level white with wind-ruffled bands; the plowed bank along the line; the gorge's rock walls and the frozen river in
// its bed (the relief makes the slopes; this paints them); trodden snow and the road by the station and the fort; dry
// grass by the bridge and the station; far out, specks of brush. Near the line in the middle of the plain nothing to
// catch the eye: there the train and the sledge run «on the spot».
const L = e.lib, G = L.plan.gorge, F = L.plan.fort, Y = d => 985 - d, h = e.anim.hash, TAU = Math.PI * 2;
const { R } = L;
R(g, -2000, -1015, 2000, 1015, '#eef2f7');
// wind-ruffled bands, long along the line
for (let i = 0; i < 260; i++) {
  const x = -2000 + h(i, 1) * 4000, d = -30 + Math.pow(h(i, 2), 0.7) * 2000, w = 20 + 70 * h(i, 3);
  g.fillStyle = i % 3 ? 'rgba(214,224,238,0.55)' : 'rgba(255,255,255,0.7)';
  g.beginPath();
  g.ellipse(x, Y(d), w, 0.6 + 1.6 * h(i, 4) + d * 0.004, 0, 0, TAU);
  g.fill();
}
// the banks the snow was plowed into along the line
R(g, -2000, Y(25.8), 2000, Y(24.2), 'rgba(222,229,238,0.9)');
R(g, -2000, Y(19.8), 2000, Y(18.2), 'rgba(222,229,238,0.9)');
// the gorge: its walls rock with snow lying on the ledges, its bed the frozen river with a dark run of open water
for (const s of [-1, 1]) {
  g.fillStyle = '#8f877b';
  g.beginPath();
  g.moveTo(G.x + s * (G.bed + 0.3), Y(-30));
  g.lineTo(G.x + s * (G.top - 3), Y(-30));
  g.lineTo(G.x + s * (G.top - 3), Y(G.end0));
  g.lineTo(G.x + s * G.bed * 0.5, Y(G.end1));
  g.lineTo(G.x + s * (G.bed + 0.3), Y(G.end0));
  g.closePath();
  g.fill();
  // strata along the walls, and the snow on their ledges
  for (let k = 0; k < 9; k++) {
    const x = G.x + s * (G.bed + 1.5 + k * 2.3);
    g.strokeStyle = k % 2 ? '#7a7266' : '#a39a8c';
    g.lineWidth = 0.35;
    g.beginPath();
    g.moveTo(x, Y(-30));
    for (let d = -30; d < G.end0; d += 10) g.lineTo(x + s * 0.6 * Math.sin(d * 0.07 + k), Y(d));
    g.stroke();
  }
  g.fillStyle = '#eef2f6';
  for (let i = 0; i < 70; i++) {
    const d = -30 + h(i, 7 + s) * (G.end0 + 30), x = G.x + s * (G.bed + 1 + h(i, 9 + s) * (G.top - G.bed - 4));
    g.beginPath();
    g.ellipse(x, Y(d), 0.8 + 1.4 * h(i, 11), 1.5 + 4 * h(i, 13), 0, 0, TAU);
    g.fill();
  }
}
g.fillStyle = '#d4dfea';
g.beginPath();
g.moveTo(G.x - G.bed - 0.3, Y(-30));
g.lineTo(G.x + G.bed + 0.3, Y(-30));
g.lineTo(G.x + G.bed + 0.3, Y(G.end0));
g.lineTo(G.x, Y(G.end1));
g.lineTo(G.x - G.bed - 0.3, Y(G.end0));
g.closePath();
g.fill();
g.fillStyle = '#2f4b5f';
g.beginPath();
for (let d = -30; d <= G.end0; d += 5) g.lineTo(G.x + 1.8 * Math.sin(d * 0.045) - 0.9 - 0.5 * Math.sin(d * 0.13), Y(d));
for (let d = G.end0; d >= -30; d -= 5) g.lineTo(G.x + 1.8 * Math.sin(d * 0.045) + 0.9 + 0.6 * Math.sin(d * 0.11 + 1), Y(d));
g.closePath();
g.fill();
// by the station: the trodden snow, the road over the line to the fort's gate
g.fillStyle = 'rgba(214,220,228,0.8)';
g.beginPath();
g.ellipse(222, Y(14), 40, 2.6, 0, 0, TAU);
g.ellipse(186, Y(12.5), 9, 2.2, 0, 0, TAU);
g.ellipse(F.gate, Y(F.d - 3), 9, 4, 0, 0, TAU);
g.fill();
g.strokeStyle = 'rgba(196,204,214,0.9)';
g.lineWidth = 0.35;
for (const o of [-0.8, 0.8]) {
  g.beginPath();
  g.moveTo(178 + o, Y(12));
  g.bezierCurveTo(176 + o, Y(30), F.gate + o + 6, Y(45), F.gate + o, Y(F.d - 1));
  g.stroke();
}
// dry grass through the snow by the bridge and by the station
g.strokeStyle = '#a99f80';
g.lineWidth = 0.06;
g.beginPath();
for (let i = 0; i < 220; i++) {
  const byBridge = i < 110;
  const x = byBridge ? G.x + (h(i, 21) < 0.5 ? -1 : 1) * (G.top + 4 + 60 * h(i, 22)) : 150 + 130 * h(i, 23);
  const d = byBridge ? 3 + 70 * h(i, 24) : 5 + 60 * h(i, 25);
  if (!byBridge && d > 10 && d < 26) continue;
  for (let j = 0; j < 4; j++) {
    g.moveTo(x + j * 0.06, Y(d));
    g.lineTo(x + j * 0.06 + (j - 1.5) * 0.08, Y(d) - 0.25 - 0.2 * h(i + j, 26));
  }
}
g.stroke();
// far out: specks of brush on the white
g.fillStyle = 'rgba(140,138,124,0.8)';
for (let i = 0; i < 320; i++) {
  const x = -2000 + h(i, 31) * 4000, d = 160 + h(i, 32) * 1800;
  g.beginPath();
  g.ellipse(x, Y(d), 1.2 + 2 * h(i, 33), 0.5 + 0.6 * h(i, 34), 0, 0, TAU);
  g.fill();
}
