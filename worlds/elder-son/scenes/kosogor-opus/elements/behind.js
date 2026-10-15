// The fields between the road and the suburb, from above: snow, a few dark fences and stacks. Metres; 420 × 100.
g.fillStyle = '#e2e7f0';
g.fillRect(-210, -50, 420, 100);
for (let i = 0; i < 40; i++) {
  const x = -200 + e.rnd() * 400, y = -48 + e.rnd() * 96;
  g.fillStyle = i % 4 ? 'rgba(196,204,220,0.55)' : 'rgba(110,100,96,0.5)';
  g.beginPath();
  g.ellipse(x, y, 2 + e.rnd() * 6, 0.4 + e.rnd() * 1.2, 0, 0, Math.PI * 2);
  g.fill();
}
