
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
// The back wall: dark green-grey wallpaper; the doorway (left) and the tall window (right) are holes — the corridor
// and the evening are behind them; the mirror's gilt frame and glass are their own.
const L = e.lib, D = L.DOOR, Wn = L.WIN;
g.save();
g.beginPath(); g.rect(-2.8, -3.45, 5.6, 3.47);
g.rect(D.x1, -D.h, D.x0 - D.x1, D.h);
g.rect(Wn.x1, -Wn.top, Wn.x0 - Wn.x1, Wn.top - Wn.sill);
g.clip('evenodd');
wallpaper(-2.8, 2.8);
g.restore();
g.strokeStyle = '#d8d0c0'; g.lineWidth = 0.09;
g.beginPath(); g.moveTo(D.x0 - 0.05, 0); g.lineTo(D.x0 - 0.05, -D.h - 0.05); g.lineTo(D.x1 + 0.05, -D.h - 0.05); g.lineTo(D.x1 + 0.05, 0); g.stroke();
g.fillStyle = '#d8d0c0'; g.fillRect(Wn.x0 - 0.1, -Wn.sill, Wn.x1 - Wn.x0 + 0.2, 0.08);
