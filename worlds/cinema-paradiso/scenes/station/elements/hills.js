
// the low hills north of the line, olive-grey, a farmhouse; far and hazed
const now = e.state.era === 'now', an = e.anim;
g.fillStyle = now ? '#56566a' : '#8c9488';
g.beginPath(); g.moveTo(-400, 0);
for (let x = -400; x <= 400; x += 4) g.lineTo(x, -6 - 9 * (0.5 + 0.5 * Math.sin(x * 0.021 + 1.3)) * (0.6 + 0.4 * an.noise(x * 0.05, 3)));
g.lineTo(400, 0.05); g.closePath(); g.fill();
g.fillStyle = now ? '#6a687a' : '#b8a88a'; g.fillRect(24, -10.5, 6, 3); g.fillStyle = now ? '#4a465a' : '#7a5a44'; g.beginPath(); g.moveTo(23.5, -10.5); g.lineTo(27, -12.3); g.lineTo(30.5, -10.5); g.fill();
