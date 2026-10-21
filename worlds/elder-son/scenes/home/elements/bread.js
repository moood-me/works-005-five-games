// The wooden bread bin on the oilcloth, its rounded lid half open, a loaf in it; put away when the table is laid
// (`table_set`). Metres.
if (!e.state.table_set) {
  g.fillStyle = '#7a5434';
  g.fillRect(-0.16, -0.1, 0.32, 0.1);
  g.fillStyle = '#8d6340';
  g.beginPath();
  g.moveTo(-0.16, -0.1);
  g.quadraticCurveTo(-0.16, -0.17, -0.08, -0.17);
  g.lineTo(0.02, -0.17);
  g.lineTo(-0.02, -0.1);
  g.closePath();
  g.fill();
  g.fillStyle = '#c08a4e';
  g.beginPath();
  g.ellipse(0.06, -0.11, 0.09, 0.04, 0, Math.PI, Math.PI * 2);
  g.fill();
  g.fillStyle = '#5a3c26';
  g.fillRect(-0.16, -0.012, 0.32, 0.012);
}
