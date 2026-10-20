// The floor of both rooms from above: painted boards running in from the door, worn pale before the stove and round
// the table; a rag rug by the front door, the doorway's threshold, a striped runner in the room. Metres; 8 × 4 —
// x = the plan's x − 4 (the kitchen −4…0, the room 0…4), y = 2 − the plan's z.
g.fillStyle = '#86583a';
g.fillRect(-4, -2, 4, 4);
g.fillStyle = '#7a5236';
g.fillRect(0, -2, 4, 4);
g.strokeStyle = 'rgba(40,24,14,0.5)';
g.lineWidth = 0.012;
for (let x = -4; x < 4; x += 0.15) {
  g.beginPath();
  g.moveTo(x, -2);
  g.lineTo(x, 2);
  g.stroke();
}
for (let i = 0; i < 40; i++) {
  const x = -4 + Math.floor(e.rnd() * 53) * 0.15, y = -2 + e.rnd() * 4;
  g.beginPath();
  g.moveTo(x, y);
  g.lineTo(x + 0.15, y);
  g.stroke();
}
// worn where they stand: before the stove, round the table
const worn = (x, y, rx, ry) => {
  const r = Math.max(rx, ry), c = g.createRadialGradient(0, 0, 0, 0, 0, r);
  c.addColorStop(0, 'rgba(196,160,118,0.35)');
  c.addColorStop(1, 'rgba(196,160,118,0)');
  g.save();
  g.translate(x, y);
  g.scale(rx / r, ry / r);
  g.fillStyle = c;
  g.fillRect(-r, -r, 2 * r, 2 * r);
  g.restore();
};
worn(-2.8, 0.4, 0.6, 0.5);
worn(-2.2, -0.7, 1.0, 1.3);
// the rag rug by the door
const rug = ['#8c3b31', '#c8b48c', '#3f5a6a', '#b4723a', '#d9cdb0'];
for (let i = 0; i < 12; i++) {
  g.fillStyle = rug[i % rug.length];
  g.fillRect(-1.3, 1.15 + i * 0.058, 1.0, 0.058);
}
// the doorway's threshold
g.fillStyle = '#5a3c28';
g.fillRect(-0.03, -1.52, 0.09, 1.04);
// the runner in the room
for (let i = 0; i < 14; i++) {
  g.fillStyle = ['#7b3a33', '#c9b892', '#3e5a4a', '#c9b892'][i % 4];
  g.fillRect(1.35, -1.1 + i * 0.15, 1.6, 0.15);
}
