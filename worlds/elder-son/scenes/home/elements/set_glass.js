// A small faceted glass of wine at each place of the laid table (`table_set`). Metres.
if (e.state.table_set) {
  g.fillStyle = 'rgba(210,218,224,0.55)';
  g.beginPath();
  g.moveTo(-0.028, -0.09);
  g.lineTo(0.028, -0.09);
  g.lineTo(0.022, 0);
  g.lineTo(-0.022, 0);
  g.closePath();
  g.fill();
  g.fillStyle = 'rgba(128,28,36,0.85)';
  g.beginPath();
  g.moveTo(-0.025, -0.05);
  g.lineTo(0.025, -0.05);
  g.lineTo(0.022, -0.004);
  g.lineTo(-0.022, -0.004);
  g.closePath();
  g.fill();
}
