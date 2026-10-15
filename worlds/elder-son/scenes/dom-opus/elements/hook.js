// The hooks by the door; Бусыгин's long grey coat hangs on one when `coat_b` is hook.
g.fillStyle = '#4a3a2c';
g.fillRect(-0.35, -1.82, 0.7, 0.06);
g.fillStyle = '#2a2420';
for (const x of [-0.22, 0, 0.22]) g.fillRect(x - 0.012, -1.78, 0.024, 0.08);
if (e.state.coat_b === 'hook') {
  g.fillStyle = '#4b4d53';
  g.beginPath();
  g.moveTo(-0.12, -1.72);
  g.lineTo(0.12, -1.72);
  g.quadraticCurveTo(0.26, -1.2, 0.24, -0.45);
  g.lineTo(-0.22, -0.45);
  g.quadraticCurveTo(-0.26, -1.2, -0.12, -1.72);
  g.closePath();
  g.fill();
  g.fillStyle = '#ddd6c6';
  g.fillRect(-0.04, -1.7, 0.08, 0.5);
}
e.at(0, -1.2, 'coat');
