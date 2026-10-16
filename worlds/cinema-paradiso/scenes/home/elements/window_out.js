// What the window on the square shows: the sky of Giancaldo (sky.pane, its tone by hour and era), the fronts across
// the square, a lit window there in the past, the bell tower against the sky. Behind the wall's hole; it glows its own
// (painted dim: the night is in its colours). Painted once a tone.
const S = e.state, an = e.anim, past = S.era !== 'now';
const tone = e.kit.sky.tone(S.hour, S.era);
e.kit.sky.pane(g, -0.9, -2.5, 0.9, -0.5, S.hour, S.era, an);
const dark = { night: '#1a1e2c', dusk: '#3a3a4c', dawn: '#55586a', evening: '#252636', morning: '#6a6c74' }[tone];
const mid = { night: '#262b3c', dusk: '#4b4a5c', dawn: '#6c6c78', evening: '#31324a', morning: '#7d7e86' }[tone];
// the bell tower, far
g.fillStyle = dark;
g.fillRect(0.28, -2.45, 0.16, 0.9);
g.beginPath(); g.moveTo(0.26, -2.45); g.lineTo(0.36, -2.62); g.lineTo(0.46, -2.45); g.fill();
// the fronts across the square
g.fillStyle = mid;
g.beginPath(); g.moveTo(-0.9, -1.25);
for (const [x, y] of [[-0.9, -1.3], [-0.55, -1.3], [-0.55, -1.42], [-0.15, -1.42], [-0.15, -1.22], [0.25, -1.22], [0.25, -1.36], [0.9, -1.36]]) g.lineTo(x, y);
g.lineTo(0.9, -0.5); g.lineTo(-0.9, -0.5); g.closePath(); g.fill();
g.fillStyle = dark;
for (let i = 0; i < 8; i++) g.fillRect(-0.82 + i * 0.22, -1.15 + (i % 2) * 0.04, 0.07, 0.12);
// a lit window across the square, in the past only
if (past && (tone === 'night' || tone === 'dusk')) {
  g.fillStyle = '#e8b56c'; g.fillRect(-0.38, -1.13, 0.07, 0.12);
  e.light(-0.345, -1.07, 0.06, '#ffcf8a', 0.5, 'far');
}
