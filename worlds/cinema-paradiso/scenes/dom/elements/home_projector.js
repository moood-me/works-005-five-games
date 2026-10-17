// The home 8 mm projector on the shelf, seen from its side (its x runs south: the lens at +x, toward the partition):
// a small grey body, two reel arms, the lens; only if he kept the reel (`reel8`). Its lens glows when it is on
// (animate). Its point — itself (the player switches it on) and `switch`.
if (!e.state.reel8) return;
g.fillStyle = '#5c5c5e'; g.fillRect(-0.14, -0.16, 0.26, 0.14);
g.fillStyle = '#48484a'; g.fillRect(-0.12, -0.02, 0.22, 0.02);
g.fillStyle = '#2a2a2c'; g.fillRect(0.12, -0.12, 0.06, 0.05);
g.fillStyle = '#c9c4b2'; g.fillRect(0.175, -0.115, 0.01, 0.04);
g.strokeStyle = '#2a2a2c'; g.lineWidth = 0.01;
g.beginPath(); g.moveTo(-0.06, -0.16); g.lineTo(-0.1, -0.28); g.moveTo(0.04, -0.16); g.lineTo(0.08, -0.28); g.stroke();
for (const [cx, cy] of [[-0.1, -0.3], [0.08, -0.3]]) {
  g.fillStyle = '#3a3a3c'; g.beginPath(); g.arc(cx, cy, 0.07, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#6a6a6c'; g.beginPath(); g.arc(cx, cy, 0.015, 0, Math.PI * 2); g.fill();
}
g.fillStyle = '#9a8a6a'; g.fillRect(-0.12, -0.13, 0.03, 0.03);
e.light(0.185, -0.095, 0.04, '#ffe2b0', 0.8, 'lens');
e.at(-0.02, -0.2);
e.at(-0.105, -0.115, 'switch');
