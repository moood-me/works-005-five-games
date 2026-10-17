
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
// The wall behind the viewer — seen only in the mirror.
wallpaper(-2.8, 2.8);
