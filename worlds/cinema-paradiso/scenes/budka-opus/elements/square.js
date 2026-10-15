
// The houses across the square, seen from the booth's window high above it (a card facing the booth): pale lime
// fronts, shutters, two or three windows lit, the roofs against the sky. Painted once by hour.
const an = e.anim, eve = e.state.hour < 0.85;
for (let k = 0; k < 6; k++) {
  const x0 = -10 + k * 3.4, h = 8.2 + an.hash(k, 3) * 2.4;
  g.fillStyle = ['#8e8676', '#9a9282', '#857d6e', '#948a78', '#8a8272', '#99907e'][k];
  g.fillRect(x0, -h, 3.4, h);
  g.fillStyle = '#5a4a3e'; g.beginPath(); g.moveTo(x0 - 0.1, -h); g.lineTo(x0 + 1.7, -h - 0.9); g.lineTo(x0 + 3.5, -h); g.closePath(); g.fill();
  for (let f = 0; f < 3; f++) for (let w = 0; w < 2; w++) {
    const x = x0 + 0.6 + w * 1.5, y = -h + 1.2 + f * 2.5, lit = an.hash(k * 7 + f * 2 + w, 9) < (eve ? 0.12 : 0.18);
    g.fillStyle = lit ? '#e0b070' : '#2a2a33'; g.fillRect(x, y, 0.7, 1.1);
    if (lit) e.light(x + 0.35, y + 0.55, 0.5, '#ffcf8a', 0.6, 'w' + k + f + w);
    g.fillStyle = '#4a5550'; g.fillRect(x - 0.22, y, 0.2, 1.1); g.fillRect(x + 0.72, y, 0.2, 1.1);
  }
}
