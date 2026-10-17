// The far forest past the fields: a long dark ragged band of spruce and bare birch crowns, snow at its foot.
// Metres, 420 wide; seen from 100 m and more through the dusk's haze.
g.fillStyle = '#2c2e3e';
g.fillRect(-210, -7, 420, 7.4);
for (let x = -208; x <= 208; x += 1.6 + e.rnd() * 2.2) {
  const h = 9 + e.rnd() * 12;
  g.beginPath();
  g.moveTo(x - 1.4, -6);
  g.lineTo(x, -h);
  g.lineTo(x + 1.4, -6);
  g.closePath();
  g.fill();
}
g.fillStyle = 'rgba(70,64,84,0.9)';
for (let i = 0; i < 30; i++) {
  const x = -200 + e.rnd() * 400, h = 10 + e.rnd() * 8;
  g.beginPath();
  g.ellipse(x, -h * 0.75, 3 + e.rnd() * 3, h * 0.3, 0, 0, Math.PI * 2);
  g.fill();
}
g.fillStyle = '#d9dfea';
g.fillRect(-210, -0.6, 420, 1.1);
