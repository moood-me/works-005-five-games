// The street's near side, seen in the shots looking back: a lower fence of palings and a wooden house's corner.
const S = e.lib.SEASONS[e.state.season] || e.lib.SEASONS.winter;
for (let x = -1.25; x < 1.25; x += 0.12) { g.fillStyle = '#7a746c'; g.fillRect(x, -1.7, 0.08, 1.7); g.beginPath(); g.moveTo(x, -1.7); g.lineTo(x + 0.04, -1.78); g.lineTo(x + 0.08, -1.7); g.fill(); }
g.fillStyle = '#6a645c'; g.fillRect(-1.25, -1.45, 2.5, 0.06); g.fillRect(-1.25, -0.4, 2.5, 0.06);
if (S.snow) { g.fillStyle = S.snow; g.fillRect(-1.25, -0.22, 2.5, 0.22); }
