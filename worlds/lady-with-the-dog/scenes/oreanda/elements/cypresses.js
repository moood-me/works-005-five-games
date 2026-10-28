// The cypresses round the church: one painting, standing as copies (scaled, flipped, tinted). Origin at the foot.
const H = 10, rnd = e.rnd;
function flame(gc, w, h, color, n) {
  gc.fillStyle = color;
  gc.beginPath();
  gc.moveTo(0, -h);
  for (let i = 0; i <= n; i++) { const u = i / n, half = w * Math.sin(Math.min(1, u * 1.15) * Math.PI * 0.62) * (1 - 0.15 * u); gc.lineTo(half * (1 + 0.14 * (rnd() - 0.5)), -h + u * h); }
  for (let i = n; i >= 0; i--) { const u = i / n, half = w * Math.sin(Math.min(1, u * 1.15) * Math.PI * 0.62) * (1 - 0.15 * u); gc.lineTo(-half * (1 + 0.14 * (rnd() - 0.5)), -h + u * h); }
  gc.closePath(); gc.fill();
}
g.fillStyle = '#4a4036'; g.fillRect(-0.08, -0.6, 0.16, 0.6);
e.layer('crown', { wind: { strength: 0.14, gust: 0.3, scale: 6 }, pivot: [0, -1.2] }, gc => {
  flame(gc, 0.7, H, '#425043', 32);
  gc.fillStyle = '#556451';
  for (let i = 0; i < 40; i++) { const y = -1.2 - rnd() * (H - 2.2), w = 0.5 * (1 - (-y) / H); gc.beginPath(); gc.ellipse((rnd() - 0.5) * w, y, 0.14, 0.22, 0, 0, Math.PI * 2); gc.fill(); }
});
