// What the window looks out on: the gardens under snow, their fences, a shed, birches; far off the platform's lights
// on their masts, a few lit windows. Metres, 80 wide, 30 m off.
g.fillStyle = '#2a2f40';
for (let x = -40; x < 40; x += 2.5 + e.rnd() * 3) {
  const h = 3 + e.rnd() * 5;
  g.beginPath();
  g.moveTo(x - 1.2, 0);
  g.lineTo(x, -h);
  g.lineTo(x + 1.2, 0);
  g.closePath();
  g.fill();
}
g.fillStyle = '#3a3034';
g.fillRect(-14, -3, 6, 3);
g.fillStyle = '#cfd6e2';
g.beginPath();
g.moveTo(-14.4, -3);
g.lineTo(-11, -4.8);
g.lineTo(-7.6, -3);
g.closePath();
g.fill();
// the platform far off, its lamps
g.fillStyle = '#1e2230';
g.fillRect(4, -1.6, 30, 1.6);
for (const x of [8, 18, 28]) {
  g.fillRect(x - 0.12, -6.5, 0.24, 5);
  g.fillStyle = '#fff2d2';
  g.fillRect(x - 0.4, -6.7, 0.8, 0.3);
  e.light(x, -6.5, 0.7, '#f3dcae', 1.6, `p${x}`);
  g.fillStyle = '#1e2230';
}
g.fillStyle = '#e9a45a';
g.fillRect(-22, -2.2, 0.8, 0.8);
e.light(-21.6, -1.8, 0.8, '#e8963a', 1.2, 'far_window');
g.fillStyle = '#dfe6ef';
g.fillRect(-40, -0.3, 80, 0.6);
