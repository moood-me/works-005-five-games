// The floor of both rooms from above: painted boards, worn by the stove and the table; a striped runner in the room.
// Metres; 8 × 4 (across −2…6), y toward the near wall.
g.fillStyle = '#7a5a40';
g.fillRect(-4, -2, 8, 4);
g.strokeStyle = 'rgba(40,26,18,0.55)';
g.lineWidth = 0.012;
for (let x = -4; x < 4; x += 0.16) {
  g.beginPath();
  g.moveTo(x, -2);
  g.lineTo(x, 2);
  g.stroke();
}
g.fillStyle = 'rgba(200,170,130,0.18)';
g.beginPath();
g.ellipse(-2.6, 0.4, 0.9, 0.7, 0, 0, Math.PI * 2);
g.fill();
// the runner in the room
for (let i = 0; i < 9; i++) {
  g.fillStyle = ['#7b3a33', '#c9b892', '#3e5a4a'][i % 3];
  g.fillRect(0.6, -1.4 + i * 0.25, 2.6, 0.25);
}
