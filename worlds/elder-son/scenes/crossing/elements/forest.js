// The spruce wood the track comes out of: a dark ragged wall, snow on the lower branches. Metres, 220 wide.
const spruce = (x, h, w) => {
  g.beginPath();
  g.moveTo(x, -h);
  const tiers = 7;
  for (let i = 1; i <= tiers; i++) {
    const y = -h + (h * 0.92 * i) / tiers;
    const half = (w * i) / tiers;
    g.lineTo(x + half, y);
    g.lineTo(x + half * 0.55, y - h * 0.03);
  }
  for (let i = tiers; i >= 1; i--) {
    const y = -h + (h * 0.92 * i) / tiers;
    const half = (w * i) / tiers;
    g.lineTo(x - half * 0.55, y - h * 0.03);
    g.lineTo(x - half, y);
  }
  g.closePath();
  g.fill();
};
g.fillStyle = '#26332f';
g.fillRect(-110, -9, 220, 9.3);
for (let x = -108; x <= 108; x += 2.2 + e.rnd() * 2.4) {
  const h = 15 + e.rnd() * 13 - Math.abs(x) * 0.05;
  spruce(x, h, 2.4 + e.rnd() * 1.6);
}
// snow lying on the lower boughs
g.fillStyle = '#c9d2df';
for (let i = 0; i < 160; i++) {
  const x = -108 + e.rnd() * 216;
  const y = -1 - e.rnd() * 9;
  g.fillRect(x, y, 0.8 + e.rnd() * 1.6, 0.25);
}
g.fillStyle = '#dfe6ef';
g.fillRect(-110, -0.6, 220, 0.9);
