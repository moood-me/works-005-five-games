// Busygin's long grey coat hung over the back of his chair at the table (`coat_b` chair), seen from the side. Metres;
// the chair's back at x 0.
if (e.state.coat_b === 'chair') {
  g.fillStyle = '#4f525a';
  g.beginPath();
  g.moveTo(-0.07, -0.98);
  g.quadraticCurveTo(0, -1.02, 0.07, -0.98);
  g.lineTo(0.12, -0.3);
  g.quadraticCurveTo(0.06, -0.22, 0.02, -0.3);
  g.lineTo(-0.02, -0.5);
  g.lineTo(-0.1, -0.55);
  g.closePath();
  g.fill();
  g.fillStyle = 'rgba(0,0,0,0.2)';
  g.fillRect(0.0, -0.95, 0.02, 0.6);
  g.fillStyle = '#ddd6c6';
  g.fillRect(-0.06, -1.0, 0.12, 0.05);
}
