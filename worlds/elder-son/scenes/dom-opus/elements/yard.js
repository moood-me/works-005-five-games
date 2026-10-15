// The snow outside, from above: the gardens' furrows under it, a path, fence lines. Metres; 80 × 27.
g.fillStyle = '#e4eaf3';
g.fillRect(-40, -13.5, 80, 27);
g.strokeStyle = 'rgba(190,198,214,0.7)';
g.lineWidth = 0.25;
for (let y = -13; y < 13; y += 0.9) {
  g.beginPath();
  g.moveTo(-40, y);
  g.lineTo(40, y + (e.rnd() - 0.5));
  g.stroke();
}
g.strokeStyle = '#5c5045';
g.lineWidth = 0.1;
for (const x of [-9, 6]) {
  g.beginPath();
  g.moveTo(x, -13.5);
  g.lineTo(x, 13.5);
  g.stroke();
}
