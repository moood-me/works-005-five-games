// The stool by the door; the old man's fur hat on it once he has put it there (`hat_on_stool`). Metres.
g.fillStyle = '#5a4434';
g.fillRect(-0.18, -0.48, 0.36, 0.05);
g.fillRect(-0.16, -0.45, 0.04, 0.45);
g.fillRect(0.12, -0.45, 0.04, 0.45);
g.fillRect(-0.15, -0.16, 0.3, 0.025);
if (e.state.hat_on_stool) {
  g.fillStyle = '#4b3c31';
  g.beginPath();
  g.ellipse(0, -0.55, 0.13, 0.08, 0, Math.PI, Math.PI * 2);
  g.fill();
  g.fillRect(-0.13, -0.56, 0.26, 0.08);
}
