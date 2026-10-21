// A bottle of wine on the laid table (`table_set`): dark green glass, a pale label. Metres.
if (e.state.table_set) {
  g.fillStyle = '#25402c';
  g.beginPath();
  g.moveTo(-0.04, 0);
  g.lineTo(-0.04, -0.19);
  g.quadraticCurveTo(-0.04, -0.23, -0.014, -0.25);
  g.lineTo(-0.014, -0.31);
  g.lineTo(0.014, -0.31);
  g.lineTo(0.014, -0.25);
  g.quadraticCurveTo(0.04, -0.23, 0.04, -0.19);
  g.lineTo(0.04, 0);
  g.closePath();
  g.fill();
  g.fillStyle = '#e4d9b8';
  g.fillRect(-0.036, -0.13, 0.072, 0.06);
  g.fillStyle = '#8a2a24';
  g.fillRect(-0.016, -0.33, 0.032, 0.03);
}
