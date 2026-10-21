// A chair in the room by the right wall; the clarinet's black case lies on its seat when `case_on`. Metres.
g.strokeStyle = '#3e2c20';
g.lineCap = 'round';
g.lineWidth = 0.03;
g.beginPath();
g.moveTo(-0.18, 0);
g.lineTo(-0.17, -0.46);
g.moveTo(0.18, 0);
g.lineTo(0.17, -0.46);
g.moveTo(-0.16, -0.46);
g.bezierCurveTo(-0.2, -0.8, -0.14, -0.96, 0, -0.96);
g.bezierCurveTo(0.14, -0.96, 0.2, -0.8, 0.16, -0.46);
g.stroke();
g.fillStyle = '#5a3f2c';
g.fillRect(-0.21, -0.49, 0.42, 0.045);
if (e.state.case_on) {
  g.fillStyle = '#1e1b1a';
  g.fillRect(-0.3, -0.58, 0.6, 0.1);
  g.fillStyle = '#8a7a52';
  g.fillRect(-0.03, -0.56, 0.06, 0.03);
}
