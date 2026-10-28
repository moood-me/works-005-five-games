// The wall behind the viewer (seen only from the balcony side): the same wallpaper, the white door to the corridor.
function wallpaper(x0, x1) {
  g.fillStyle = '#d6c9ae'; g.fillRect(x0, -3.25, x1 - x0, 3.27);
  g.fillStyle = 'rgba(176,160,128,0.35)';
  for (let x = x0 + 0.05; x < x1; x += 0.22) g.fillRect(x, -3.0, 0.05, 2.1);
  g.fillStyle = 'rgba(150,132,100,0.3)';
  for (let x = x0 + 0.16; x < x1; x += 0.22) for (let y = -2.9; y < -0.95; y += 0.3) { g.beginPath(); g.ellipse(x, y, 0.025, 0.04, 0, 0, Math.PI * 2); g.fill(); }
  g.fillStyle = '#9d876a'; g.fillRect(x0, -0.9, x1 - x0, 0.9);
  g.fillStyle = '#b8a283'; g.fillRect(x0, -0.92, x1 - x0, 0.05);
  g.fillStyle = '#6e5a46'; g.fillRect(x0, -0.12, x1 - x0, 0.14);
  g.fillStyle = '#e4dccb'; g.fillRect(x0, -3.25, x1 - x0, 0.22);
  g.fillStyle = 'rgba(120,104,80,0.4)'; g.fillRect(x0, -3.03, x1 - x0, 0.03);
}
wallpaper(-2.8, 2.8);
g.fillStyle = '#e8e2d4'; g.fillRect(0.6, -2.3, 0.95, 2.3);
g.strokeStyle = 'rgba(150,140,120,0.6)'; g.lineWidth = 0.025;
g.strokeRect(0.7, -2.15, 0.75, 0.9); g.strokeRect(0.7, -1.1, 0.75, 0.95);
g.fillStyle = '#b08d4a'; g.beginPath(); g.arc(1.42, -1.15, 0.03, 0, Math.PI * 2); g.fill();
