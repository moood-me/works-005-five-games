// A poplar: a tall narrow crown, dusty green with the first yellow, on a short grey trunk (metres, origin at its foot).
// The crown stirs in the wind as a layer.
const rnd = e.rnd, H = 15;
g.fillStyle = '#5c5650'; g.fillRect(-0.18, -2.4, 0.36, 2.4);
function crown(gc, color, k) {
  gc.fillStyle = color;
  gc.beginPath(); gc.moveTo(0, -H);
  for (let i = 0; i <= 24; i++) { const u = i / 24, y = -H + u * (H - 1.8), w = 1.6 * k * Math.sin(Math.min(1, u * 1.25) * Math.PI * 0.55) * (1 - 0.2 * u); gc.lineTo(w * (1 + 0.15 * (rnd() - 0.5)), y); }
  for (let i = 24; i >= 0; i--) { const u = i / 24, y = -H + u * (H - 1.8), w = 1.6 * k * Math.sin(Math.min(1, u * 1.25) * Math.PI * 0.55) * (1 - 0.2 * u); gc.lineTo(-w * (1 + 0.15 * (rnd() - 0.5)), y); }
  gc.closePath(); gc.fill();
}
crown(g, '#4f5a45', 1.05);
e.layer('crown', { wind: { strength: 0.12, gust: 0.4, scale: 8 }, pivot: [0, -2.4] }, gc => {
  crown(gc, '#66704f', 0.9);
  for (let i = 0; i < 70; i++) {
    const y = -2.6 - rnd() * (H - 3.5), w = 1.2 * Math.sin(Math.min(1, (y + H) / H * 1.25) * Math.PI * 0.55);
    gc.fillStyle = rnd() < 0.2 ? '#b9a24e' : (rnd() < 0.5 ? '#7a8257' : '#58624a');
    gc.beginPath(); gc.ellipse((rnd() - 0.5) * 1.6 * w, y, 0.25 + rnd() * 0.25, 0.4, 0, 0, Math.PI * 2); gc.fill();
  }
});
