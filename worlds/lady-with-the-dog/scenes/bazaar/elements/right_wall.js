
function wallpaper(x0, x1) {
  g.fillStyle = '#6f7a6e'; g.fillRect(x0, -3.45, x1 - x0, 3.47);
  g.fillStyle = 'rgba(150,160,140,0.25)';
  for (let x = x0 + 0.1; x < x1; x += 0.3) for (let y = -3.0; y < -1.0; y += 0.32) {
    g.beginPath(); g.moveTo(x, y - 0.08); g.quadraticCurveTo(x + 0.06, y, x, y + 0.08); g.quadraticCurveTo(x - 0.06, y, x, y - 0.08); g.fill();
  }
  g.fillStyle = '#4f5249'; g.fillRect(x0, -0.95, x1 - x0, 0.95);
  g.fillStyle = '#8d8f80'; g.fillRect(x0, -0.97, x1 - x0, 0.05);
  g.fillStyle = '#3d3a32'; g.fillRect(x0, -0.13, x1 - x0, 0.15);
  g.fillStyle = '#d4ccbc'; g.fillRect(x0, -3.45, x1 - x0, 0.25);
}
// The right wall (facing left; x running toward us): a framed engraving.
wallpaper(-3.4, 3.4);
g.fillStyle = '#3a2e24'; g.fillRect(-1.2, -2.4, 0.8, 0.6);
g.fillStyle = '#c9c0ac'; g.fillRect(-1.14, -2.34, 0.68, 0.48);
g.fillStyle = 'rgba(80,70,60,0.5)'; g.fillRect(-1.05, -2.2, 0.5, 0.25);
