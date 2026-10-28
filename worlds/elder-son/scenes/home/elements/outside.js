// What the window looks out on: the gardens under snow running off to a row of birches and the dark wood, a neighbour's
// shed and house (one window lit), the fences; far on the right the platform under its lamps. Daylight colours: the
// night is the scene's light. Metres, 80 wide, 30 m off (the window sees about across 0…40 of it).
g.fillStyle = '#dfe5ee';
g.fillRect(-40, -1.2, 80, 1.5);
// the wood far off, a soft dark band, birches before it
g.fillStyle = '#4b4f5a';
g.beginPath();
g.moveTo(-40, -1.0);
for (let x = -40; x <= 40; x += 0.8) g.lineTo(x, -3.2 - 1.6 * e.rnd() - 0.8 * Math.sin(x * 0.21));
g.lineTo(40, -1.0);
g.closePath();
g.fill();
for (let i = 0; i < 34; i++) {
  const x = -38 + i * 2.3 + e.rnd() * 1.5, h = 5 + e.rnd() * 3.5;
  g.strokeStyle = '#d8d6cf';
  g.lineWidth = 0.14;
  g.beginPath();
  g.moveTo(x, -0.9);
  g.lineTo(x + 0.2 * (e.rnd() - 0.5), -h);
  g.stroke();
  g.strokeStyle = 'rgba(70,64,62,0.55)';
  g.lineWidth = 0.05;
  for (let b = 0; b < 6; b++) {
    const y = -h * (0.45 + 0.09 * b), s = e.rnd() < 0.5 ? -1 : 1;
    g.beginPath();
    g.moveTo(x, y);
    g.quadraticCurveTo(x + s * 0.6, y - 0.4, x + s * (0.9 + e.rnd()), y - 0.2 - e.rnd() * 0.6);
    g.stroke();
  }
}
// a neighbour's house and shed, left
g.fillStyle = '#6b5a4c';
g.fillRect(-16, -3.2, 7, 3.2);
g.fillStyle = '#e6eaf0';
g.beginPath();
g.moveTo(-16.6, -3.2);
g.lineTo(-12.5, -5.6);
g.lineTo(-8.4, -3.2);
g.closePath();
g.fill();
g.fillStyle = '#efa75a';
g.fillRect(-14.6, -2.3, 0.9, 1.0);
e.light(-14.15, -1.8, 0.9, '#e8963a', 1.3, 'neighbour');
g.fillStyle = '#57493e';
g.fillRect(-4, -2.2, 3.6, 2.2);
g.fillStyle = '#e6eaf0';
g.fillRect(-4.2, -2.5, 4, 0.35);
// the platform far off on the right, its lamps on their masts, a shelter
g.fillStyle = '#3e4048';
g.fillRect(14, -1.3, 26, 1.3);
g.fillRect(22, -3.4, 6, 2.2);
g.fillStyle = '#e6eaf0';
g.fillRect(21.6, -3.6, 6.8, 0.3);
for (const x of [16, 24, 32, 39]) {
  g.fillStyle = '#2e3038';
  g.fillRect(x - 0.1, -6.4, 0.2, 5.1);
  g.fillStyle = '#fff2d2';
  g.fillRect(x - 0.35, -6.6, 0.7, 0.25);
  e.light(x, -6.4, 0.8, '#f3dcae', 1.6, `lamp${x}`);
}
// the fences across the gardens
g.strokeStyle = '#5a4d42';
g.lineWidth = 0.08;
for (let x = -40; x < 40; x += 0.45) {
  g.beginPath();
  g.moveTo(x, -0.05);
  g.lineTo(x, -1.1 - 0.15 * e.rnd());
  g.stroke();
}
