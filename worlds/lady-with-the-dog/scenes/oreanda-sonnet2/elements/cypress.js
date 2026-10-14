g.scale(0.85, 0.85);
const h = 7;
g.fillStyle = '#4a3a2e'; g.fillRect(-0.08, -0.8, 0.16, 0.8);
const col = ['#2a3d33', '#34493c', '#23332a'];
for (let k = 0; k < 3; k++) {
  g.fillStyle = col[k];
  const s = 1 - k * 0.12;
  g.beginPath(); g.moveTo(0, -h);
  g.bezierCurveTo(0.9 * s, -h * 0.75, 1.15 * s, -h * 0.35, 0.8 * s, -0.7);
  g.lineTo(-0.8 * s, -0.7);
  g.bezierCurveTo(-1.15 * s, -h * 0.35, -0.9 * s, -h * 0.75, 0, -h); g.fill();
}
g.fillStyle = '#34493a'; g.globalAlpha = 0.5;
for (let i = 0; i < 60; i++) { const y = -0.9 - e.rnd() * (h - 1.3), w = 0.9 * Math.sin(Math.PI * Math.min(1, (-y) / h)); g.fillRect((e.rnd() - 0.5) * w * 1.6, y, 0.09, 0.28); }
g.globalAlpha = 1;
e.at(0.2, -2.8, 'cicada');
