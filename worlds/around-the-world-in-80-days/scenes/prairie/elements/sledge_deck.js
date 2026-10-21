// The sledge's deck, from above (the plane's metres: x along it, the bow +x; y toward the viewer): planks, buffalo robes
// spread where they sit, a coil of rope by the mast; where Mudge stands at the stern (`mudge`).
const { R } = e.lib, TAU = Math.PI * 2;
R(g, -2.8, -1.1, 2.8, 1.1, '#8a6a48');
g.strokeStyle = '#6e5238';
g.lineWidth = 0.02;
g.beginPath();
for (let y = -0.9; y < 1.1; y += 0.22) { g.moveTo(-2.8, y); g.lineTo(2.8, y); }
g.stroke();
g.fillStyle = '#5a3e28';
for (const [x, y, rx, ry] of [[-0.3, -0.5, 1.4, 0.45], [-1.4, 0.45, 1.0, 0.5], [-0.1, 0.45, 0.8, 0.45]]) {
  g.beginPath();
  g.ellipse(x, y, rx, ry, 0, 0, TAU);
  g.fill();
}
g.strokeStyle = '#c8b48a';
g.lineWidth = 0.04;
for (const r of [0.2, 0.15, 0.1]) { g.beginPath(); g.arc(1.2, 0.5, r, 0, TAU); g.stroke(); }
R(g, -2.8, -1.1, 2.8, -1.02, '#eef2f6');
e.at(-2.5, 0.05, 'mudge');
