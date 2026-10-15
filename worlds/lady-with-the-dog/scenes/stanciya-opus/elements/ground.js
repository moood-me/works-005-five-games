// The trodden ground round the station (a plane, seen from above; metres, y toward the viewer): dust and dry grass.
const W = 450, D = 53.8, rnd = e.rnd;
g.fillStyle = '#8f8270';
g.fillRect(-W, -D, 2 * W, 2 * D);
for (let i = 0; i < 500; i++) {
  const x = -W + rnd() * 2 * W, y = -D + rnd() * 2 * D;
  g.fillStyle = rnd() < 0.5 ? 'rgba(120,112,80,0.35)' : 'rgba(170,150,120,0.3)';
  g.beginPath(); g.ellipse(x, y, 0.6 + rnd() * 3, 0.3 + rnd() * 1.2, rnd() * 3, 0, Math.PI * 2); g.fill();
}
