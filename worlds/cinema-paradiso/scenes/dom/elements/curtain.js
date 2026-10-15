// The curtain that closes Toto's corner, on its rod along x 1.2 (its x runs south from the north wall): two lengths of
// faded cotton gathered back — one toward the north wall, one toward the partition — the gap between them his door.
// Thin: the light behind comes through (translucent). Painted once.
const C = e.lib.G.CORNER, R = e.lib.G.ROOM, h = R.h;
const north = R.z1 - C.gap1, south0 = R.z1 - C.gap0, south1 = R.z1 - C.z0;
g.strokeStyle = '#2a221a'; g.lineWidth = 0.025;
g.beginPath(); g.moveTo(0, -2.28); g.lineTo(south1, -2.28); g.stroke();
const length = (x0, x1, seed) => {
  const gr = g.createLinearGradient(x0, 0, x1, 0);
  const n = Math.max(3, Math.round((x1 - x0) / 0.12));
  for (let i = 0; i <= n; i++) gr.addColorStop(i / n, i % 2 ? '#8a7258' : '#a48b6c');
  g.fillStyle = gr;
  g.beginPath(); g.moveTo(x0, -2.27); g.lineTo(x1, -2.27);
  g.quadraticCurveTo(x1 + 0.02, -1.2, x1 + 0.03, -0.04); g.lineTo(x0 - 0.02, -0.03); g.closePath(); g.fill();
  g.fillStyle = 'rgba(120,60,40,0.25)';
  for (let y = -2.1; y < -0.2; y += 0.28) g.fillRect(x0, y, x1 - x0, 0.035);
};
length(0, north, 1);
length(south0, south1, 2);
