// The warehouse's south end, toward the quay: plaster, a small shuttered door, the corner stones.
const an = e.anim, W = 6.5, H = 5.6;
g.fillStyle = '#c9b48f'; g.fillRect(-W / 2, -H, W, H);
// a plinth of bare limestone blocks along the foot, fine streaks down from the cornice
g.fillStyle = '#b39d7a'; g.fillRect(-W / 2, -0.9, W, 0.9);
g.strokeStyle = 'rgba(80,66,50,0.45)'; g.lineWidth = 0.025;
for (let r = 0; r < 3; r++) { const y = -0.9 + r * 0.3; g.beginPath(); g.moveTo(-W / 2, y); g.lineTo(W / 2, y); g.stroke();
  for (let x = -W / 2 + (r % 2) * 0.35; x < W / 2; x += 0.7) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 0.3); g.stroke(); } }
for (let i = 0; i < 40; i++) {
  g.fillStyle = 'rgba(120,100,76,' + (0.05 + an.hash(i, 73) * 0.07) + ')';
  g.fillRect(-W / 2 + an.hash(i, 71) * W, -H + 0.45, 0.03 + an.hash(i, 74) * 0.08, 0.6 + an.hash(i, 72) * 2.4);
}
g.fillStyle = '#b7a27e'; g.fillRect(-W / 2, -H, W, 0.35);
for (let y = -H + 0.4; y < -0.6; y += 0.55) { g.fillStyle = '#d6c6a6'; g.fillRect(W / 2 - 0.45, y, 0.45, 0.48); g.fillRect(-W / 2, y + 0.27, 0.45, 0.48); }
g.fillStyle = '#3e5450'; g.fillRect(-1.6, -2.4, 1.1, 2.4);
g.fillStyle = '#5a6f6a'; g.fillRect(0.9, -3.6, 0.9, 1.1);
