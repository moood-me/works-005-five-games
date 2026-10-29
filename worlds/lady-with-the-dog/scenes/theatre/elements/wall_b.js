// The back wall (seen from the stage): under the balcony the doors to the foyer; over the balcony the gallery — a rail and
// a dark mass of the cheap seats' heads.
const W = 7;
g.fillStyle = '#d6c8ae'; g.fillRect(-W, -9.05, 2 * W, 9.05);
g.fillStyle = '#4a3a2e'; g.fillRect(-W, -1.1, 2 * W, 1.1);
// the doors under the balcony
for (const x of [-4.8, 0, 4.8]) {
  g.fillStyle = '#2a201a'; g.fillRect(x - 0.7, -2.5, 1.4, 2.5);
  g.fillStyle = '#5a4630'; g.fillRect(x - 0.78, -2.58, 1.56, 0.08); g.fillRect(x - 0.78, -2.58, 0.08, 2.58); g.fillRect(x + 0.7, -2.58, 0.08, 2.58);
  g.fillStyle = '#4c5e4a'; g.fillRect(x - 0.68, -2.48, 0.3, 2.48); g.fillRect(x + 0.38, -2.48, 0.3, 2.48);
}
// the gallery over the balcony: its rail and the heads behind it
g.fillStyle = '#c9b48a'; g.fillRect(-W, -6.3, 2 * W, 0.18);
g.fillStyle = '#3a3230'; g.fillRect(-W, -7.4, 2 * W, 1.1);
for (let i = 0; i < 46; i++) {
  const x = -W + 0.2 + i * 0.3 + (anim.hash(i, 5) - 0.5) * 0.08;
  g.fillStyle = ['#d8b89e', '#caa286', '#e2c2a8'][i % 3];
  g.beginPath(); g.ellipse(x, -6.62 - anim.hash(i, 6) * 0.08, 0.08, 0.1, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = ['#2a2220', '#4a3626', '#6a5038'][Math.floor(anim.hash(i, 7) * 3)];
  g.beginPath(); g.ellipse(x, -6.7 - anim.hash(i, 6) * 0.08, 0.085, 0.05, 0, Math.PI, 0); g.fill();
}
g.fillStyle = '#b39a6a'; g.fillRect(-W, -6.12, 2 * W, 0.1);
