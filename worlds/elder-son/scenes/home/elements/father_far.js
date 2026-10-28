// Sarafanov far off across the gardens in the morning, small: the dark coat, the fur hat, the case in his right hand.
// Seen only when `father_on`. Metres; he walks to the right (father_x).
if (e.state.father_on) {
  g.fillStyle = '#2f2b2a';
  g.beginPath();
  g.moveTo(-0.2, -1.32);
  g.quadraticCurveTo(-0.26, -0.7, -0.24, -0.38);
  g.lineTo(0.22, -0.38);
  g.quadraticCurveTo(0.26, -0.7, 0.2, -1.32);
  g.closePath();
  g.fill();
  g.fillRect(-0.15, -0.4, 0.11, 0.4);
  g.fillRect(0.04, -0.4, 0.11, 0.4);
  g.fillStyle = '#c9a487';
  g.beginPath();
  g.arc(0, -1.42, 0.1, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = '#4b3c31';
  g.beginPath();
  g.ellipse(0, -1.52, 0.13, 0.08, 0, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = '#d9d3c4';
  g.fillRect(-0.16, -1.3, 0.32, 0.07);
  g.fillStyle = '#1e1b1a';
  g.fillRect(0.24, -0.78, 0.3, 0.12);
}
