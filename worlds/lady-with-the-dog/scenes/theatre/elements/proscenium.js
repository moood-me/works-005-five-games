// The proscenium round the stage's opening (x ±5, from the boards 1 m up to 6.6 m): cream and gilt, a lyre and two
// masks over the opening; the opening itself is a hole.
g.fillStyle = '#ddd0b4'; g.fillRect(-7, -9.05, 14, 9.05);
g.fillStyle = '#c4a463';
g.fillRect(-5.35, -6.95, 10.7, 0.35); g.fillRect(-5.35, -6.95, 0.35, 5.95); g.fillRect(5.0, -6.95, 0.35, 5.95);
g.fillStyle = '#b8955a';
g.beginPath(); g.ellipse(0, -7.75, 0.55, 0.65, 0, 0, Math.PI * 2); g.fill();
g.fillStyle = '#ddd0b4'; g.beginPath(); g.ellipse(0, -7.75, 0.35, 0.45, 0, 0, Math.PI * 2); g.fill();
g.strokeStyle = '#b8955a'; g.lineWidth = 0.05;
for (const dx of [-0.15, 0, 0.15]) { g.beginPath(); g.moveTo(dx, -8.05); g.lineTo(dx, -7.45); g.stroke(); }
for (const sx of [-1, 1]) {
  g.fillStyle = '#c4a463'; g.beginPath(); g.ellipse(sx * 1.6, -7.7, 0.32, 0.4, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#5a4630'; g.beginPath(); g.ellipse(sx * 1.6 - 0.1, -7.78, 0.06, 0.04, 0, 0, Math.PI * 2); g.ellipse(sx * 1.6 + 0.1, -7.78, 0.06, 0.04, 0, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.ellipse(sx * 1.6, -7.55, 0.12, 0.05, 0, sx > 0 ? 0 : Math.PI, sx > 0 ? Math.PI : 0); g.fill();
}
g.save(); g.globalCompositeOperation = 'destination-out'; g.fillRect(-5.0, -6.6, 10.0, 6.6); g.restore();
