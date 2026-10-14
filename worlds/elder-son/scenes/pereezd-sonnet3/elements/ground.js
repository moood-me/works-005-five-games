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
