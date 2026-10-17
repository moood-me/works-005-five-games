// The floor seen from above (y toward the start): cement tiles with a worn pattern in the room, old boards in Toto's
// corner (the east part behind the curtain). Painted once.
const G = e.lib.G, R = G.ROOM, C = G.CORNER;
const W = R.x1 - R.x0, D = R.z1 - R.z0;
// plane coordinates: x as across, y = 2.4 − z (its middle at z 2.4)
const Y = z => 2.4 - z;
g.fillStyle = '#8a7a66'; g.fillRect(-W / 2, -D / 2, W, D);
const t = 0.25;
for (let i = 0; i < W / t; i++) for (let j = 0; j < D / t; j++) {
  const x = -W / 2 + i * t, y = -D / 2 + j * t;
  const v = e.rnd();
  g.fillStyle = (i + j) % 2 ? `rgb(${138 + v * 10},${120 + v * 8},${98 + v * 8})` : `rgb(${118 + v * 10},${100 + v * 8},${82 + v * 6})`;
  g.fillRect(x + 0.004, y + 0.004, t - 0.008, t - 0.008);
  g.fillStyle = 'rgba(70,52,38,0.35)';
  g.beginPath(); g.arc(x + t / 2, y + t / 2, t * 0.22, 0, Math.PI * 2); g.fill();
}
// worn paths: to the table, to the door
const wear = g.createRadialGradient(-0.5, Y(3.0), 0, -0.5, Y(3.0), 1.4);
wear.addColorStop(0, 'rgba(200,185,160,0.18)'); wear.addColorStop(1, 'rgba(200,185,160,0)');
g.fillStyle = wear; g.fillRect(-W / 2, -D / 2, W, D);
// the corner's boards
g.fillStyle = '#6e5440'; g.fillRect(C.x0, Y(C.z1), C.x1 - C.x0, C.z1 - C.z0);
for (let k = 0; k < 9; k++) {
  g.fillStyle = k % 2 ? 'rgba(40,28,20,0.18)' : 'rgba(255,230,200,0.04)';
  g.fillRect(C.x0 + k * 0.18, Y(C.z1), 0.17, C.z1 - C.z0);
}
// a rag rug by the bed
g.fillStyle = '#7a5a48'; g.fillRect(1.55, Y(3.9), 0.45, 1.1);
g.strokeStyle = 'rgba(200,170,120,0.35)'; g.lineWidth = 0.02;
for (let k = 0; k < 6; k++) { g.beginPath(); g.moveTo(1.57, Y(3.85) + k * 0.18); g.lineTo(1.98, Y(3.85) + k * 0.18); g.stroke(); }
