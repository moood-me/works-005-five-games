// The gallery's front over the landing: a fascia and a banister of turned balusters, its rail where the schoolboys lean.
g.fillStyle = '#5a4634'; g.fillRect(-1.3, -0.06, 2.6, 0.36);
g.fillStyle = '#6a5440'; g.fillRect(-1.3, -1.0, 2.6, 0.08);
for (let x = -1.2; x <= 1.21; x += 0.16) {
  g.fillStyle = '#7a6248';
  g.beginPath(); g.moveTo(x - 0.025, -0.92); g.quadraticCurveTo(x - 0.05, -0.5, x - 0.025, -0.06); g.lineTo(x + 0.025, -0.06); g.quadraticCurveTo(x + 0.05, -0.5, x + 0.025, -0.92); g.fill();
}
