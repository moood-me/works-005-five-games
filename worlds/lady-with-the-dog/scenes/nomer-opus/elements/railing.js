// The balcony's railing: a stone rail on round balusters (metres, origin at its foot).
g.fillStyle = '#b9b5b0';
g.fillRect(-1.7, -1.05, 3.4, 0.1);
g.fillRect(-1.7, -0.12, 3.4, 0.12);
for (let x = -1.6; x <= 1.6; x += 0.2) {
  g.beginPath(); g.moveTo(x - 0.04, -0.12); g.bezierCurveTo(x - 0.08, -0.35, x - 0.02, -0.6, x - 0.035, -0.95);
  g.lineTo(x + 0.035, -0.95); g.bezierCurveTo(x + 0.02, -0.6, x + 0.08, -0.35, x + 0.04, -0.12); g.closePath(); g.fill();
}
