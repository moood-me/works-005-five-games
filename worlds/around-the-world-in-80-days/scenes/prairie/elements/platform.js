// The station's wooden platform, from above (the plane's metres: x along the line, y toward the viewer): planks along
// it, grey and worn, snow lying on them where nobody walks, a trodden path down its middle.
const { R } = e.lib, h = e.anim.hash;
R(g, -30, -2, 30, 2, '#8a7558');
g.strokeStyle = '#6e5c46';
g.lineWidth = 0.025;
g.beginPath();
for (let y = -1.8; y < 2; y += 0.22) { g.moveTo(-30, y); g.lineTo(30, y); }
for (let i = 0; i < 70; i++) { const x = -30 + h(i, 1) * 60, y = -2 + Math.floor(h(i, 2) * 18) * 0.22; g.moveTo(x, y); g.lineTo(x, y + 0.22); }
g.stroke();
g.fillStyle = '#eef2f6';
for (let i = 0; i < 46; i++) {
  const x = -30 + h(i, 3) * 60, y = h(i, 4) < 0.5 ? -1.7 + 0.5 * h(i, 5) : 1.2 + 0.7 * h(i, 5);
  g.beginPath();
  g.ellipse(x, y, 0.6 + 1.8 * h(i, 6), 0.2 + 0.3 * h(i, 7), 0, 0, Math.PI * 2);
  g.fill();
}
R(g, -30, 1.85, 30, 2, '#eef2f6');
R(g, -30, -2, 30, -1.85, '#eef2f6');
