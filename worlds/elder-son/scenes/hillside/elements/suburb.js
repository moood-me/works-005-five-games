// The suburb seen from the cemetery's slope, a kilometre-odd off: rows of low roofs under snow, the first lit windows,
// smoke going up, a water tower, the station's tall lamp. Metres, 320 wide.
let lit = 0;
for (let x = -158; x < 158; x += 7 + e.rnd() * 6) {
  const w = 6 + e.rnd() * 4, h = 3 + e.rnd() * 1, r = 2 + e.rnd() * 0.8, back = e.rnd() * 2.5;
  g.fillStyle = '#3c3236';
  g.fillRect(x, -h - back, w, h + back + 0.3);
  g.fillStyle = '#cfd5e2';
  g.beginPath();
  g.moveTo(x - 0.4, -h - back);
  g.lineTo(x + w / 2, -h - r - back);
  g.lineTo(x + w + 0.4, -h - back);
  g.closePath();
  g.fill();
  if (e.rnd() < 0.5) {
    const wx = x + w * (0.25 + e.rnd() * 0.5), wy = -h * 0.55 - back;
    g.fillStyle = '#f0a656';
    g.fillRect(wx - 0.45, wy - 0.45, 0.9, 0.9);
    if (lit < 14) e.light(wx, wy, 1.4, '#e8963a', 1.6, `w${lit++}`);
  }
}
// the water tower
g.fillStyle = '#3a3238';
g.fillRect(52, -16, 1.2, 16);
g.fillRect(48.5, -21, 8.2, 5.2);
g.beginPath();
g.moveTo(48, -21);
g.lineTo(52.6, -23.5);
g.lineTo(57.2, -21);
g.closePath();
g.fill();
// the station's lamp on its mast
g.fillRect(-80.2, -13, 0.4, 13);
g.fillStyle = '#fff0d0';
g.fillRect(-80.6, -13.4, 1.2, 0.5);
e.light(-80, -13, 0.8, '#f3dcae', 2.2, 'station');
g.fillStyle = '#d8dee9';
g.fillRect(-160, -0.4, 320, 0.9);
