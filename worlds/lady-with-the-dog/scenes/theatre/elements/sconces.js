// A sconce on the hall's side wall: a gilt bracket, two candle-lamps under little shades (their light — the hall's).
g.fillStyle = '#b8955a';
g.fillRect(-0.02, -0.3, 0.04, 0.3);
g.beginPath(); g.moveTo(-0.22, -0.2); g.quadraticCurveTo(0, -0.05, 0.22, -0.2); g.lineWidth = 0.03; g.strokeStyle = '#b8955a'; g.stroke();
for (const x of [-0.22, 0.22]) {
  g.fillStyle = '#f2ead6'; g.fillRect(x - 0.015, -0.34, 0.03, 0.12);
  g.fillStyle = '#eadcb8'; g.beginPath(); g.moveTo(x - 0.08, -0.36); g.lineTo(x + 0.08, -0.36); g.lineTo(x + 0.05, -0.48); g.lineTo(x - 0.05, -0.48); g.fill();
}
e.light(0, -0.38, 0.25, '#ffd59a', 0.9);
