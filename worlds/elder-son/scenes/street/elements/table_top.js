// The table top from above: the checked oilcloth, a bread bin, two glasses in holders. Metres; 1.3 × 0.8.
g.fillStyle = '#cdc8b6';
g.fillRect(-0.65, -0.4, 1.3, 0.8);
g.fillStyle = 'rgba(80,110,140,0.3)';
for (let x = -0.65; x < 0.65; x += 0.12) g.fillRect(x, -0.4, 0.06, 0.8);
for (let y = -0.4; y < 0.4; y += 0.12) g.fillRect(-0.65, y, 1.3, 0.06);
g.fillStyle = '#7a5a3c';
g.fillRect(-0.45, -0.25, 0.3, 0.18);
g.fillStyle = '#8f8a80';
for (const x of [0.15, 0.32]) {
  g.beginPath();
  g.arc(x, 0.05, 0.04, 0, Math.PI * 2);
  g.fill();
}
