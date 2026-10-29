// The lane's far end: beyond the rows of houses, roofs one over another, a church with its belfry and domes (muted gold);
// the snow on the roofs (the thaw: wet iron). A card at distance 75, painted once.
const L = e.lib;
const season = L.seasonOf(e.state.season);
const P = L.PAINT;
const rnd = () => e.rnd();
const tones = ['#c9c2b4', '#b8bfc4', '#cdbfa6', '#aeb6ae'];
for (let row = 2; row >= 0; row--) {
  const base = -row * 2.2;
  let k = row;
  for (let x = -40; x < 40; x += 4 + rnd() * 5) {
    const w = 4 + rnd() * 6, h = 7 + rnd() * 6 + row * 2;
    g.fillStyle = tones[k++ % tones.length];
    g.fillRect(x, base - h, w, h);
    g.fillStyle = 'rgba(54,64,76,0.6)';
    for (let wy = base - h + 1.2; wy < base - 1; wy += 2.6) for (let wx = x + 0.6; wx < x + w - 0.6; wx += 1.4) g.fillRect(wx, wy, 0.6, 1.0);
    g.fillStyle = season === 'thaw' ? '#4a5052' : P.SNOW;
    g.beginPath();
    g.moveTo(x - 0.2, base - h);
    g.lineTo(x + w / 2, base - h - 1.6 - rnd());
    g.lineTo(x + w + 0.2, base - h);
    g.closePath();
    g.fill();
  }
}
// the church: a white belfry with a spire, a body with a drum and three domes
const cx = -4;
g.fillStyle = '#ece6da';
g.fillRect(cx - 4, -20, 8, 14);
g.fillRect(cx - 1.4, -26, 2.8, 6);
g.fillRect(cx + 7, -27, 3, 21);
g.fillStyle = '#c9b27a';
const dome = (x, yb, r) => {
  g.beginPath();
  g.moveTo(x - r, yb);
  g.quadraticCurveTo(x - r * 1.1, yb - r * 1.4, x, yb - r * 2.2);
  g.quadraticCurveTo(x + r * 1.1, yb - r * 1.4, x + r, yb);
  g.closePath();
  g.fill();
  g.fillRect(x - 0.05, yb - r * 2.2 - 1.2, 0.1, 1.2);
  g.fillRect(x - 0.35, yb - r * 2.2 - 0.9, 0.7, 0.08);
};
dome(cx, -26, 1.3);
for (const dx of [-3, 3]) dome(cx + dx, -20, 0.8);
g.beginPath();
g.moveTo(cx + 7, -27);
g.lineTo(cx + 8.5, -33);
g.lineTo(cx + 10, -27);
g.closePath();
g.fill();
if (season !== 'thaw') {
  P.snowLedge(g, season, cx - 4, cx + 4, -20, 0.25, rnd);
  P.snowLedge(g, season, cx + 7, cx + 10, -27, 0.2, rnd);
}
g.fillStyle = 'rgba(70,80,96,0.55)';
for (const wx of [cx - 2.6, cx - 0.4, cx + 1.8]) g.fillRect(wx, -17, 0.8, 2.2);
g.fillRect(cx + 8, -24, 1, 2);
