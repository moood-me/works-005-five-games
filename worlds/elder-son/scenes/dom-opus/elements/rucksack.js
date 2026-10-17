// Vasenka's packed rucksack by his chair (`rucksack` chair): canvas, straps, a rolled blanket on top.
if (e.state.rucksack !== 'none') {
  g.fillStyle = '#5d6044';
  g.beginPath();
  g.moveTo(-0.2, 0);
  g.quadraticCurveTo(-0.26, -0.3, -0.18, -0.5);
  g.lineTo(0.18, -0.5);
  g.quadraticCurveTo(0.26, -0.3, 0.2, 0);
  g.closePath();
  g.fill();
  g.fillStyle = '#4a4c36';
  g.fillRect(-0.16, -0.32, 0.32, 0.12);
  g.fillStyle = '#7a3a2e';
  g.beginPath();
  g.ellipse(0, -0.56, 0.2, 0.07, 0, 0, Math.PI * 2);
  g.fill();
}
