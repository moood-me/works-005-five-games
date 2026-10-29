// The flight's side toward the landing (its x runs from the top, z 25.6, down to the bottom step, z 22.6): the
// panelled string under the steps and the banister over them.
g.fillStyle = '#5a4634';
g.beginPath(); g.moveTo(0, -2.0); g.lineTo(3.0, 0); g.lineTo(0, 0); g.closePath(); g.fill();
g.fillStyle = '#4a3a2c';
g.beginPath(); g.moveTo(0, -2.0); g.lineTo(3.0, 0); g.lineTo(2.85, 0); g.lineTo(0, -1.9); g.closePath(); g.fill();
g.fillStyle = '#6a5440';
g.beginPath(); g.moveTo(0, -3.04); g.lineTo(3.0, -1.04); g.lineTo(3.0, -0.96); g.lineTo(0, -2.96); g.closePath(); g.fill();
for (let x = 0.12; x < 3.0; x += 0.2) {
  const top = -3.0 + x * 2 / 3, bot = -2.0 + x * 2 / 3;
  g.fillStyle = '#7a6248'; g.fillRect(x - 0.02, top + 0.04, 0.04, bot - top - 0.04);
}
g.fillStyle = '#6a5440'; g.fillRect(2.92, -1.2, 0.12, 1.2);
