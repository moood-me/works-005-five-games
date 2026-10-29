// The street before the fence (from above): autumn — dark mud, cart ruts with water in them, leaves; winter — packed
// snow, sledge runners' tracks, a horse's trodden line; thaw — slush and dark puddles (the plane mirrors by `wet_k`).
const S = e.lib.SEASONS[e.state.season] || e.lib.SEASONS.winter, season = e.state.season, W = 70;
g.fillStyle = season === 'autumn' ? '#4e463e' : season === 'thaw' ? '#8c8a88' : '#dfe1e8';
g.fillRect(-W, -4.5, 2 * W, 9);
for (const y of [-1.2, -0.1, 1.4, 2.5]) {
  g.strokeStyle = season === 'autumn' ? 'rgba(30,26,22,0.6)' : season === 'thaw' ? 'rgba(70,68,66,0.6)' : 'rgba(170,176,192,0.7)';
  g.lineWidth = 0.14;
  g.beginPath(); g.moveTo(-W, y); for (let x = -W; x <= W; x += 4) g.lineTo(x, y + 0.08 * Math.sin(x * 0.21 + y)); g.stroke();
}
if (season !== 'winter') {
  for (let i = 0; i < 70; i++) {
    const x = -W + e.anim.hash(i, 11) * 2 * W, y = -4 + e.anim.hash(i, 12) * 7.6, r = 0.3 + e.anim.hash(i, 13) * 1.1;
    g.fillStyle = season === 'autumn' ? 'rgba(44,46,54,0.75)' : 'rgba(56,58,64,0.8)';
    g.beginPath(); g.ellipse(x, y, r * 1.6, r * 0.55, 0, 0, Math.PI * 2); g.fill();
  }
}
if (S.leaf) for (let i = 0; i < 500; i++) {
  g.fillStyle = S.leaf[i % 3];
  const x = -W + e.anim.hash(i, 21) * 2 * W, y = -4.5 + e.anim.hash(i, 22) * 9;
  g.beginPath(); g.ellipse(x, y, 0.06, 0.035, e.anim.hash(i, 23) * 3, 0, Math.PI * 2); g.fill();
}
if (S.snow) {   // snow heaped along the fence's foot and the near side
  g.fillStyle = S.snow;
  g.fillRect(-W, -4.5, 2 * W, 0.5);
  g.fillRect(-W, 3.6, 2 * W, 0.9);
}
