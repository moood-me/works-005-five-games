// The chair by the camp bed's head, seen from the room: his long grey coat thrown over its back at night (`coat_b`
// cot). Its point: coat. Metres; x = the plan's z − 2.4.
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
if (e.state.coat_b === 'cot') {
  g.fillStyle = '#4f525a';
  g.beginPath();
  g.moveTo(-0.22, -0.98);
  g.quadraticCurveTo(0, -1.02, 0.22, -0.98);
  g.lineTo(0.26, -0.5);
  g.quadraticCurveTo(0.28, -0.25, 0.22, -0.12);
  g.lineTo(-0.2, -0.14);
  g.quadraticCurveTo(-0.27, -0.4, -0.24, -0.6);
  g.closePath();
  g.fill();
  g.fillStyle = 'rgba(0,0,0,0.18)';
  g.fillRect(-0.01, -0.95, 0.02, 0.8);
  g.fillStyle = '#ddd6c6';
  g.fillRect(-0.12, -1.0, 0.24, 0.06);
}
e.at(0, -0.72, 'coat');
