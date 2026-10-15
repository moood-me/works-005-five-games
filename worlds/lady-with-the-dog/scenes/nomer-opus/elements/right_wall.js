
function wallpaper(x0, x1) {
  g.fillStyle = '#d6c9ae'; g.fillRect(x0, -3.25, x1 - x0, 3.27);
  g.fillStyle = 'rgba(176,160,128,0.35)';
  for (let x = x0 + 0.05; x < x1; x += 0.22) g.fillRect(x, -3.0, 0.05, 2.1);
  g.fillStyle = 'rgba(150,132,100,0.3)';
  for (let x = x0 + 0.16; x < x1; x += 0.22) for (let y = -2.9; y < -0.95; y += 0.3) { g.beginPath(); g.ellipse(x, y, 0.025, 0.04, 0, 0, Math.PI * 2); g.fill(); }
  g.fillStyle = '#9d876a'; g.fillRect(x0, -0.9, x1 - x0, 0.9);          // the dado
  g.fillStyle = '#b8a283'; g.fillRect(x0, -0.92, x1 - x0, 0.05);
  g.fillStyle = '#6e5a46'; g.fillRect(x0, -0.12, x1 - x0, 0.14);         // the skirting
  g.fillStyle = '#e4dccb'; g.fillRect(x0, -3.25, x1 - x0, 0.22);          // the cornice
  g.fillStyle = 'rgba(120,104,80,0.4)'; g.fillRect(x0, -3.03, x1 - x0, 0.03);
}
// The right wall (facing left; metres, x running toward us along it): a narrow mirror in a dark frame.
wallpaper(-3.2, 3.2);
g.fillStyle = '#4e3c2c'; g.fillRect(-2.2, -2.3, 0.6, 1.0);
g.fillStyle = '#7f8796'; g.fillRect(-2.15, -2.25, 0.5, 0.9);
