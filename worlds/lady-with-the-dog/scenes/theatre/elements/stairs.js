// The stairs going down beyond the opening in the left wall: steps falling away into the dusk below, a banister's
// curve; the point `stairs#down` is where she goes.
g.fillStyle = '#3a3430'; g.fillRect(0, -2.75, 1.8, 2.75);
for (let i = 0; i < 9; i++) {
  g.fillStyle = `rgba(150,140,124,${0.75 - i * 0.07})`;
  g.fillRect(0.05 + i * 0.07, -0.3 + i * 0.03, 1.7 - i * 0.14, 0.05);
  g.fillStyle = `rgba(80,72,62,${0.6 - i * 0.05})`;
  g.fillRect(0.05 + i * 0.07, -0.25 + i * 0.03, 1.7 - i * 0.14, 0.03);
}
g.strokeStyle = '#6a5440'; g.lineWidth = 0.06;
g.beginPath(); g.moveTo(1.75, -1.0); g.quadraticCurveTo(1.2, -0.75, 0.4, -0.5); g.stroke();
g.lineWidth = 0.02;
for (let x = 0.5; x < 1.75; x += 0.14) { const t = (x - 0.4) / 1.35; g.beginPath(); g.moveTo(x, -0.48 - t * 0.5); g.lineTo(x, -0.05); g.stroke(); }
e.at(0.9, -1.3, 'down');
