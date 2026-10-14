// Last year's dry weeds sticking out of the snow by the road, bending in the wind. Metres; a tuft 0.7 high.
e.layer('stalks', { pivot: [0, 0], wind: { strength: 0.55, gust: 0.6 } }, s => {
  s.lineCap = 'round';
  for (let i = 0; i < 9; i++) {
    const x = (e.rnd() - 0.5) * 0.5;
    const h = 0.35 + e.rnd() * 0.45;
    const lean = (e.rnd() - 0.4) * 0.25;
    s.strokeStyle = i % 3 ? '#7d6c55' : '#5f5243';
    s.lineWidth = 0.012 + e.rnd() * 0.01;
    s.beginPath();
    s.moveTo(x, 0);
    s.quadraticCurveTo(x + lean * 0.3, -h * 0.6, x + lean, -h);
    s.stroke();
    if (i % 2 === 0) {
      s.fillStyle = '#6a5a46';
      s.beginPath();
      s.ellipse(x + lean, -h - 0.03, 0.025, 0.05, lean, 0, Math.PI * 2);
      s.fill();
    }
  }
});
g.fillStyle = '#e3e9f1';
g.beginPath();
g.ellipse(0, 0, 0.42, 0.08, 0, Math.PI, 0);
g.fill();
