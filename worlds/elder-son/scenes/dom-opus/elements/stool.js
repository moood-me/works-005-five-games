// The stool by the door; the old man's fur hat on it once he has put it there (`hat_on_stool`).
g.fillStyle = '#5a4434';
g.fillRect(-0.2, -0.48, 0.4, 0.05);
g.fillRect(-0.18, -0.45, 0.04, 0.45);
g.fillRect(0.14, -0.45, 0.04, 0.45);
if (e.state.hat_on_stool) {
  g.fillStyle = '#4b3c31';
  g.beginPath();
  g.ellipse(0, -0.56, 0.13, 0.09, 0, 0, Math.PI * 2);
  g.fill();
}
