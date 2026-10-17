// The village beyond the field: low log houses under snow, a few lit windows (their glows are the village's
// lights), bare birches. Metres, 220 wide; seen from 300 m it is a row of small lights on the horizon.
g.lineJoin = 'round';
let x = -104;
let lit = 0;
while (x < 100) {
  const w = 7 + e.rnd() * 5;
  const h = 3.2 + e.rnd() * 0.9;
  const roof = 2.4 + e.rnd() * 0.8;
  const back = e.rnd() * 3;
  // the house
  g.fillStyle = '#5a4a3e';
  g.fillRect(x, -h - back * 0.2, w, h + back * 0.2 + 0.3);
  g.fillStyle = '#4a3d35';
  g.beginPath();
  g.moveTo(x - 0.5, -h - back * 0.2);
  g.lineTo(x + w / 2, -h - roof - back * 0.2);
  g.lineTo(x + w + 0.5, -h - back * 0.2);
  g.closePath();
  g.fill();
  g.fillStyle = '#e1e8f1';
  g.beginPath();
  g.moveTo(x - 0.5, -h - back * 0.2);
  g.lineTo(x + w / 2, -h - roof - back * 0.2);
  g.lineTo(x + w + 0.5, -h - back * 0.2);
  g.lineTo(x + w / 2, -h - roof * 0.62 - back * 0.2);
  g.closePath();
  g.fill();
  // windows: some lit
  for (let k = 0; k < 2; k++) {
    const wx = x + w * (0.28 + 0.44 * k);
    const wy = -h * 0.55 - back * 0.2;
    const on = e.rnd() < 0.55;
    g.fillStyle = on ? '#f0a855' : '#2b2a2c';
    g.fillRect(wx - 0.45, wy - 0.5, 0.9, 1.0);
    if (on && lit < 16) {
      e.light(wx, wy, 1.6, '#e8963a', 2.2, `w${lit}`);
      lit++;
    }
  }
  // now and then a birch
  if (e.rnd() < 0.4) {
    g.strokeStyle = '#cfcac0';
    g.lineWidth = 0.35;
    g.beginPath();
    g.moveTo(x + w + 1.4, 0.2);
    g.lineTo(x + w + 1.6, -9 - e.rnd() * 3);
    g.stroke();
    g.strokeStyle = '#3a3533';
    g.lineWidth = 0.12;
    for (let b = 0; b < 6; b++) {
      const by = -4 - b * 1.1;
      g.beginPath();
      g.moveTo(x + w + 1.5, by);
      g.lineTo(x + w + 1.5 + (b % 2 ? 1.8 : -1.8), by - 1.6);
      g.stroke();
    }
  }
  x += w + 4 + e.rnd() * 9;
}
g.fillStyle = '#dfe6ef';
g.fillRect(-110, -0.3, 220, 0.6);
