// The chandelier over the middle of the parterre: a gilt ring with three tiers of crystal drops and candle-lamps, hung
// on a chain from the ceiling's rosette. Its light is the hall's light (`hall_light`).
g.strokeStyle = '#8a7046'; g.lineWidth = 0.03;
g.beginPath(); g.moveTo(0, -3.4); g.lineTo(0, -1.3); g.stroke();
for (const [y, rx, n] of [[-1.25, 0.35, 8], [-0.85, 0.75, 12], [-0.45, 1.0, 16]]) {
  g.strokeStyle = '#b8955a'; g.lineWidth = 0.04;
  g.beginPath(); g.ellipse(0, y, rx, rx * 0.18, 0, 0, Math.PI * 2); g.stroke();
  for (let i = 0; i < n; i++) {
    const x = Math.cos(i / n * Math.PI * 2) * rx, dy = Math.sin(i / n * Math.PI * 2) * rx * 0.18;
    g.fillStyle = 'rgba(236,240,248,0.85)';
    g.beginPath(); g.moveTo(x, y + dy); g.lineTo(x - 0.025, y + dy + 0.12); g.lineTo(x, y + dy + 0.2); g.lineTo(x + 0.025, y + dy + 0.12); g.fill();
    if (i % 2 === 0) { g.fillStyle = '#fff2d2'; g.beginPath(); g.ellipse(x, y + dy - 0.07, 0.025, 0.05, 0, 0, Math.PI * 2); g.fill(); }
  }
}
g.fillStyle = '#b8955a'; g.beginPath(); g.ellipse(0, -0.2, 0.12, 0.2, 0, 0, Math.PI * 2); g.fill();
e.light(0, -0.8, 0.9, '#ffe2b0', 1.2);
