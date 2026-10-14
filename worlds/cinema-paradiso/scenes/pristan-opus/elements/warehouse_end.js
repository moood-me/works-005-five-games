// The warehouse's south end, toward the quay: plaster, a small shuttered door, the corner stones.
const an = e.anim, W = 6.5, H = 5.6;
g.fillStyle = '#c9b48f'; g.fillRect(-W / 2, -H, W, H);
for (let i = 0; i < 30; i++) {
  const x = -W / 2 + an.hash(i, 71) * W, y = -0.4 - an.hash(i, 72) * (H - 0.8);
  g.fillStyle = '#b39d79'; g.beginPath(); g.ellipse(x, y, 0.3 + an.hash(i, 73) * 0.8, 0.2 + an.hash(i, 74) * 0.4, 0, 0, Math.PI * 2); g.fill();
}
g.fillStyle = '#b7a27e'; g.fillRect(-W / 2, -H, W, 0.35);
for (let y = -H + 0.4; y < -0.6; y += 0.55) { g.fillStyle = '#d6c6a6'; g.fillRect(W / 2 - 0.45, y, 0.45, 0.48); g.fillRect(-W / 2, y + 0.27, 0.45, 0.48); }
g.fillStyle = '#3e5450'; g.fillRect(-1.6, -2.4, 1.1, 2.4);
g.fillStyle = '#5a6f6a'; g.fillRect(0.9, -3.6, 0.9, 1.1);
