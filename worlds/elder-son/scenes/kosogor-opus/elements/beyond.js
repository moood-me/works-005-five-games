// The fields past the crest from above: snow, long faint furrows, a dark line of a road across them. Metres; 420 × 120.
g.fillStyle = '#e2e7f0';
g.fillRect(-210, -60, 420, 120);
g.strokeStyle = 'rgba(196,204,220,0.6)';
g.lineWidth = 0.6;
for (let y = -58; y < 60; y += 4 + e.rnd() * 3) {
  g.beginPath();
  g.moveTo(-210, y);
  g.lineTo(210, y + (e.rnd() - 0.5) * 6);
  g.stroke();
}
g.strokeStyle = '#a9a7a8';
g.lineWidth = 2.2;
g.beginPath();
g.moveTo(-210, 10);
g.quadraticCurveTo(0, -12, 210, -4);
g.stroke();
