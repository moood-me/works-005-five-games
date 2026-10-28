// The snow outside, from above: the gardens' beds under it in long soft ridges, a trodden path across them (where the
// old man goes in the morning), a fence line. Metres; 80 × 27 (y toward the window).
g.fillStyle = '#e6ebf3';
g.fillRect(-40, -13.5, 80, 27);
g.strokeStyle = 'rgba(178,188,206,0.6)';
g.lineWidth = 0.22;
for (let y = -13; y < 13.5; y += 0.9) {
  g.beginPath();
  g.moveTo(-40, y);
  g.lineTo(40, y + (e.rnd() - 0.5) * 0.6);
  g.stroke();
}
g.strokeStyle = 'rgba(150,158,176,0.7)';
g.lineWidth = 0.6;
g.beginPath();
g.moveTo(-2, 13.5);
g.bezierCurveTo(4, 6, 10, 2, 40, -1);
g.stroke();
g.strokeStyle = '#5c5045';
g.lineWidth = 0.08;
for (const y of [-6, 4]) {
  g.beginPath();
  g.moveTo(-40, y);
  g.lineTo(40, y);
  g.stroke();
}
