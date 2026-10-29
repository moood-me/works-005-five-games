// The porch before the front door: three wooden steps, two posts, a little roof (snow on it in winter).
const S = e.lib.SEASONS[e.state.season] || e.lib.SEASONS.winter;
g.fillStyle = '#6e6660'; for (let i = 0; i < 3; i++) g.fillRect(-0.9 + i * 0.1, -0.18 * (i + 1), 1.8 - i * 0.2, 0.18);
g.fillStyle = '#5a5450'; g.fillRect(-0.95, -2.9, 0.1, 2.9); g.fillRect(0.85, -2.9, 0.1, 2.9);
g.fillStyle = '#4e4a48'; g.beginPath(); g.moveTo(-1.1, -2.85); g.lineTo(0, -3.2); g.lineTo(1.1, -2.85); g.fill();
if (S.snow) { g.fillStyle = S.snow; g.beginPath(); g.moveTo(-1.1, -2.88); g.lineTo(0, -3.24); g.lineTo(1.1, -2.88); g.lineTo(0, -3.15); g.fill(); g.fillRect(-0.9, -0.6, 1.4, 0.05); }
