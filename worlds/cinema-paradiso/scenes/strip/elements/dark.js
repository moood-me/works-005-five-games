// The booth: its plastered wall in the warm dark — boards of the panelling, a reel low on the left — lit by the lamp
// low on the right; the strip's band across the middle a little warmer. Painted once.
const A = e.aspect, L = e.lib.lampAt(A), X0 = -0.3, X1 = A + 0.3, Y0 = -0.35, Y1 = 1.25;
// the wall: dark umber, a shade lighter toward the lamp
const wall = g.createLinearGradient(0, Y0, 0, Y1);
wall.addColorStop(0, '#120d09');
wall.addColorStop(0.55, '#1b130c');
wall.addColorStop(1, '#100b07');
g.fillStyle = wall;
g.fillRect(X0, Y0, X1 - X0, Y1 - Y0);
const air = g.createRadialGradient(L.x, L.y, 0, L.x, L.y, 1.5);
air.addColorStop(0, 'rgba(150,96,46,0.42)');
air.addColorStop(0.4, 'rgba(92,58,28,0.18)');
air.addColorStop(1, 'rgba(0,0,0,0)');
g.fillStyle = air;
g.fillRect(X0, Y0, X1 - X0, Y1 - Y0);
// the panelling: boards, their seams a little darker, the grain faint
for (let x = X0; x < X1; x += 0.21) {
  g.fillStyle = 'rgba(0,0,0,0.22)';
  g.fillRect(x, 0.62, 0.006, Y1 - 0.62);
  g.fillStyle = 'rgba(255,220,170,0.025)';
  g.fillRect(x + 0.006, 0.62, 0.004, Y1 - 0.62);
}
g.fillStyle = 'rgba(0,0,0,0.3)';
g.fillRect(X0, 0.615, X1 - X0, 0.01);
g.fillStyle = 'rgba(255,214,160,0.06)';
g.fillRect(X0, 0.625, X1 - X0, 0.004);
// a big reel low on the left, its spokes' holes, half in the dark
const R = { x: 0.2, y: 0.95, r: 0.17 };
g.fillStyle = 'rgba(6,4,3,0.7)';
g.beginPath(); g.arc(R.x, R.y, R.r, 0, Math.PI * 2); g.fill();
g.strokeStyle = 'rgba(200,150,90,0.12)';
g.lineWidth = 0.004;
g.beginPath(); g.arc(R.x, R.y, R.r, 0, Math.PI * 2); g.stroke();
g.beginPath(); g.arc(R.x, R.y, R.r * 0.18, 0, Math.PI * 2); g.stroke();
for (let k = 0; k < 5; k++) {
  const a = -Math.PI / 2 + (k * 2 * Math.PI) / 5;
  g.beginPath(); g.arc(R.x + Math.cos(a) * R.r * 0.55, R.y + Math.sin(a) * R.r * 0.55, R.r * 0.22, 0, Math.PI * 2); g.stroke();
}
// the strip's band: the air a little warmer where the film runs
const band = g.createLinearGradient(0, 0.12, 0, 0.78);
band.addColorStop(0, 'rgba(90,60,30,0)');
band.addColorStop(0.5, 'rgba(90,60,30,0.14)');
band.addColorStop(1, 'rgba(90,60,30,0)');
g.fillStyle = band;
g.fillRect(X0, 0.12, X1 - X0, 0.66);
