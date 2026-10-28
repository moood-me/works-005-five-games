// Beyond the line on the left (`town` kearney): Fort Kearney — a stockade of pointed logs, a blockhouse at each corner
// with its upper storey jutting out, the barracks' snowy roofs over the wall, the flag on its white pole (a layer in the
// wind), the gate of two leaves (layers: they open by `gate`; point `gate`). Or (`town` omaha) Omaha: false-fronted
// stores, houses, a white church with its steeple, a warehouse, all under snow. `chimney` — where the smoke rises.
const L = e.lib, { R, P } = L, h = e.anim.hash, F = L.plan.fort, GX = F.gate - F.x;
const snow = '#eef2f6';
if (e.state.town === 'omaha') {
  const houses = [
    [-62, 9, 6.5, '#8a6a4a', 'front'], [-52, 8, 7.5, '#a07a52', 'front'], [-43, 7, 5.5, '#7a5e44', 'gable'], [-35, 9, 6, '#9a8468', 'gable'],
    [-24, 10, 7, '#8e6e50', 'front'], [-13, 7, 5, '#a88e70', 'gable'], [-5, 12, 6, '#7a5a40', 'barn'], [9, 7, 5.5, '#946e4c', 'gable'],
    [18, 8, 6.5, '#8a6a4a', 'front'], [40, 9, 6, '#a07a52', 'gable'], [50, 8, 5, '#7a5e44', 'gable'], [59, 10, 7, '#8e6e50', 'front'],
  ];
  for (const [x, w, hgt, col, kind] of houses) {
    if (kind === 'front') {
      R(g, x - w / 2, -hgt, x + w / 2, 0.2, col);
      R(g, x - w / 2 - 0.2, -hgt - 0.3, x + w / 2 + 0.2, -hgt, L.dim(col, 0.3));
      R(g, x - w / 2 - 0.2, -hgt - 0.42, x + w / 2 + 0.2, -hgt - 0.3, snow);
    } else {
      const top = kind === 'barn' ? 3.5 : 2.6;
      R(g, x - w / 2, -hgt, x + w / 2, 0.2, col);
      P(g, [x - w / 2 - 0.4, -hgt, x, -hgt - top, x + w / 2 + 0.4, -hgt], '#5a524a');
      P(g, [x - w / 2 - 0.4, -hgt, x, -hgt - top, x + w / 2 + 0.4, -hgt, x + w / 2 - 0.4, -hgt - 0.1, x, -hgt - top + 0.5, x - w / 2 + 0.4, -hgt - 0.1], snow);
    }
    for (let k = 0; k < Math.floor(w / 2.5); k++) R(g, x - w / 2 + 1 + k * 2.5, -hgt + 1.4, x - w / 2 + 1.8 + k * 2.5, -hgt + 2.6, '#3a4656');
    R(g, x + w / 4, -hgt - 3.2, x + w / 4 + 0.5, -hgt - 1.2, '#4a4440');
  }
  // the church: white boards, a tall steeple
  R(g, 27, -7, 34, 0.2, '#e4e0d6');
  P(g, [26.6, -7, 30.5, -9.6, 34.4, -7], '#5a524a');
  R(g, 29.5, -12, 31.5, -7, '#e4e0d6');
  P(g, [29.3, -12, 30.5, -16.5, 31.7, -12], '#5a524a');
  P(g, [29.7, -12.6, 30.5, -16.5, 31.3, -12.6, 30.5, -14.5], snow);
  R(g, 30.1, -10.5, 30.9, -9.3, '#3a4656');
  e.at(-30, -9, 'chimney');
  e.at(0, -6);
} else {
  // the yard seen through the open gate
  R(g, GX - 2.2, -4.2, GX + 2.2, 0.2, '#e2e8f0');
  R(g, GX - 2.2, -4.2, GX + 2.2, -2.6, '#7d6a55');
  // the barracks' roofs over the wall
  for (const [a, b] of [[-42, -14], [16, 44]]) {
    P(g, [a, -4.4, a + 2, -6.6, b - 2, -6.6, b, -4.4], '#5a524a');
    P(g, [a + 0.6, -5.0, a + 2, -6.6, b - 2, -6.6, b - 0.6, -5.0], snow);
  }
  R(g, -30, -8.6, -29.3, -6.2, '#4a4440');
  // the stockade: pointed logs, their seams, snow on the points
  g.fillStyle = '#7d6a55';
  g.beginPath();
  g.moveTo(-55, 0.2);
  for (let x = -55; x < 55; x += 0.45) {
    if (x > GX - 2.2 && x < GX + 2.2) { g.lineTo(x, 0.2); continue; }
    g.lineTo(x, -4.3 - 0.15 * h(Math.round(x * 3), 1));
    g.lineTo(x + 0.225, -4.75 - 0.15 * h(Math.round(x * 3), 2));
  }
  g.lineTo(55, -4.3);
  g.lineTo(55, 0.2);
  g.closePath();
  g.fill();
  g.strokeStyle = '#5e4e3e';
  g.lineWidth = 0.04;
  g.beginPath();
  for (let x = -55; x < 55; x += 0.45) { if (x > GX - 2.2 && x < GX + 2.2) continue; g.moveTo(x, 0.2); g.lineTo(x, -4.3); }
  g.stroke();
  R(g, -55, -3.2, GX - 2.2, -3.0, '#5e4e3e');
  R(g, GX + 2.2, -3.2, 55, -3.0, '#5e4e3e');
  g.fillStyle = snow;
  for (let x = -55; x < 55; x += 0.45) {
    if (x > GX - 2.2 && x < GX + 2.2) continue;
    g.beginPath();
    g.ellipse(x + 0.225, -4.62, 0.16, 0.07, 0, 0, Math.PI * 2);
    g.fill();
  }
  // a blockhouse at each corner
  for (const x of [-55, 55]) {
    R(g, x - 3, -5.6, x + 3, 0.2, '#6e5c48');
    R(g, x - 3.7, -9.2, x + 3.7, -5.6, '#7d6a55');
    R(g, x - 3.8, -5.75, x + 3.8, -5.55, '#5e4e3e');
    for (const dx of [-2.2, 0, 2.2]) R(g, x + dx - 0.25, -7.8, x + dx + 0.25, -7.4, '#2a2420');
    for (const dx of [-1.5, 1.5]) R(g, x + dx - 0.2, -3.2, x + dx + 0.2, -2.9, '#2a2420');
    P(g, [x - 4.2, -9.2, x, -11.6, x + 4.2, -9.2], '#5a524a');
    P(g, [x - 4.2, -9.2, x, -11.6, x + 4.2, -9.2, x + 3.2, -9.3, x, -11.0, x - 3.2, -9.3], snow);
  }
  // the gate's frame and its two leaves (layers, hinged at the posts)
  R(g, GX - 2.5, -5.0, GX - 2.2, 0.2, '#5e4e3e');
  R(g, GX + 2.2, -5.0, GX + 2.5, 0.2, '#5e4e3e');
  R(g, GX - 2.6, -5.2, GX + 2.6, -4.85, '#5e4e3e');
  for (const [name, a, b] of [['gate_l', GX - 2.2, GX], ['gate_r', GX, GX + 2.2]]) {
    e.layer(name, { pivot: [name === 'gate_l' ? a : b, -2], box: [a - 0.05, -4.4, b + 0.05, 0.25] }, g => {
      R(g, a, -4.2, b, 0.2, '#6e5c48');
      g.strokeStyle = '#4e3e2e';
      g.lineWidth = 0.05;
      g.beginPath();
      for (let x = a + 0.3; x < b; x += 0.36) { g.moveTo(x, -4.2); g.lineTo(x, 0.2); }
      g.moveTo(a, -3.4); g.lineTo(b, -3.4); g.moveTo(a, -0.8); g.lineTo(b, -0.8);
      g.stroke();
    });
  }
  // the flag on its white pole
  const FX = -8;
  R(g, FX - 0.09, -14, FX + 0.09, -4.4, '#e8e4dc');
  e.layer('flag', { pivot: [FX + 0.09, -13.3], box: [FX, -14.1, FX + 2.7, -12.4], wind: { strength: 0.8, gust: 0.4 } }, g => {
    for (let i = 0; i < 13; i++) R(g, FX + 0.09, -13.9 + i * 0.1, FX + 2.5, -13.8 + i * 0.1, i % 2 ? '#f2eee6' : '#b8322a');
    R(g, FX + 0.09, -13.9, FX + 1.1, -13.2, '#2c3a6e');
    g.fillStyle = '#f2eee6';
    for (let i = 0; i < 12; i++) g.fillRect(FX + 0.2 + (i % 4) * 0.24, -13.82 + Math.floor(i / 4) * 0.2, 0.06, 0.06);
  });
  e.at(GX, -2, 'gate');
  e.at(-29.6, -8.6, 'chimney');
  e.at(0, -5);
}
