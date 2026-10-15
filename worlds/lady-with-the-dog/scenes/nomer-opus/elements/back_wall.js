
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
// The wall with the balcony door (metres, origin at its foot's middle): the doorway is a hole — the night beyond it is
// the sky's; the door's leaves stand open into the room (their own cards).
const L = e.lib, D = L.DOOR;
g.save();
g.beginPath(); g.rect(-2.8, -3.25, 5.6, 3.27); g.rect(D.x1, -D.h, -(D.x1 - D.x0), D.h); g.clip('evenodd');
wallpaper(-2.8, 2.8);
g.restore();
// the doorway's frame
g.strokeStyle = '#e6dfd0'; g.lineWidth = 0.08;
g.beginPath(); g.moveTo(D.x0 - 0.04, 0); g.lineTo(D.x0 - 0.04, -D.h - 0.04); g.lineTo(D.x1 + 0.04, -D.h - 0.04); g.lineTo(D.x1 + 0.04, 0); g.stroke();
// a small framed picture of the sea over the bed
g.fillStyle = '#6e5534'; g.fillRect(-2.0, -2.35, 0.7, 0.5);
g.fillStyle = '#9fb0c0'; g.fillRect(-1.95, -2.3, 0.6, 0.4);
g.fillStyle = '#5f7488'; g.fillRect(-1.95, -2.08, 0.6, 0.18);
e.at((D.x0 + D.x1) / 2, -1.4, 'door');
