// The balcony's front (seen from the stage): a gilt moulding over a cream panel with garlands; over it the balcony's
// audience, heads and shoulders.
const W = 7;
for (let i = 0; i < 40; i++) {
  const x = -W + 0.2 + i * 0.35 + (anim.hash(i, 11) - 0.5) * 0.1;
  if (anim.hash(i, 12) < 0.18) continue;
  g.fillStyle = ['#2b2c33', '#3a3330', '#2e3540', '#433a30'][i % 4];
  g.beginPath(); g.moveTo(x - 0.2, -1.0); g.quadraticCurveTo(x - 0.22, -1.34, x - 0.12, -1.4); g.quadraticCurveTo(x, -1.44, x + 0.12, -1.4); g.quadraticCurveTo(x + 0.22, -1.34, x + 0.2, -1.0); g.fill();
  g.fillStyle = ['#d8b89e', '#caa286', '#e2c2a8', '#e8cbb2'][Math.floor(anim.hash(i, 13) * 4)];
  g.beginPath(); g.ellipse(x, -1.52, 0.08, 0.1, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = ['#2a2220', '#4a3626', '#6a5038', '#8a7258'][Math.floor(anim.hash(i, 14) * 4)];
  g.beginPath(); g.ellipse(x, -1.58, 0.083, 0.055, 0, Math.PI, 0); g.fill();
}
g.fillStyle = '#e2d4b8'; g.fillRect(-W, -1.05, 2 * W, 1.4);
g.fillStyle = '#c4a463'; g.fillRect(-W, -1.08, 2 * W, 0.1); g.fillRect(-W, 0.22, 2 * W, 0.12);
g.strokeStyle = '#b8955a'; g.lineWidth = 0.035;
for (let x = -W + 0.5; x < W; x += 1.0) {
  g.beginPath(); g.moveTo(x, -0.8); g.quadraticCurveTo(x + 0.5, -0.35, x + 1.0, -0.8); g.stroke();
  g.fillStyle = '#c4a463'; g.beginPath(); g.arc(x, -0.82, 0.05, 0, Math.PI * 2); g.fill();
}
