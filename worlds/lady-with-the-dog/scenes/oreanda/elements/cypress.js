// The near cypress by the path: a tall dark flame, its crown stirring. Metres, origin at its foot.
// Its point `cicada` (somewhere in the crown) is there while the cicada sings (`cicada` 1).
const H = 11, rnd = e.rnd;
function flame(gc, w, h, color, n) {
  gc.fillStyle = color;
  gc.beginPath();
  gc.moveTo(0, -h);
  for (let i = 0; i <= n; i++) { const u = i / n, y = -h + u * h, half = w * Math.sin(Math.min(1, u * 1.15) * Math.PI * 0.62) * (1 - 0.15 * u); gc.lineTo(half * (1 + 0.12 * (rnd() - 0.5)), y); }
  for (let i = n; i >= 0; i--) { const u = i / n, y = -h + u * h, half = w * Math.sin(Math.min(1, u * 1.15) * Math.PI * 0.62) * (1 - 0.15 * u); gc.lineTo(-half * (1 + 0.12 * (rnd() - 0.5)), y); }
  gc.closePath(); gc.fill();
}
g.fillStyle = '#4a4036'; g.fillRect(-0.09, -0.7, 0.18, 0.7);
flame(g, 0.72, H - 0.3, '#3e4c3f', 40);
e.layer('crown', { wind: { strength: 0.18, gust: 0.3, scale: 6 }, pivot: [0, -1.5], depth: 0.05 }, gc => {
  flame(gc, 0.6, H, '#4d5c4a', 36);
  gc.fillStyle = '#5c6a55';
  for (let i = 0; i < 60; i++) { const y = -1.5 - rnd() * (H - 2.5), w = 0.45 * (1 - (-y) / H); gc.beginPath(); gc.ellipse((rnd() - 0.5) * w, y, 0.12 + rnd() * 0.12, 0.2, 0, 0, Math.PI * 2); gc.fill(); }
});
if (e.state.cicada) e.at(0.15, -4.4, 'cicada');
