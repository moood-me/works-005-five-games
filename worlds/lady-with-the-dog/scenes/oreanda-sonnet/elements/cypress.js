e.layer('crown', { pivot: [0, 0], wind: 0.25 }, g => {
  g.fillStyle = '#33443d';
  g.beginPath();
  g.moveTo(0, -7.4);
  g.bezierCurveTo(0.9, -5.5, 1.5, -3.4, 1.35, -1.4);
  g.bezierCurveTo(1.25, -0.5, 0.5, 0, 0, 0);
  g.bezierCurveTo(-0.5, 0, -1.25, -0.5, -1.35, -1.4);
  g.bezierCurveTo(-1.5, -3.4, -0.9, -5.5, 0, -7.4);
  g.closePath();
  g.fill();
  for (let i = 0; i < 40; i++) {
    const y = -0.4 - e.rnd() * 6.4;
    const w = 1.2 - Math.abs(y + 3.2) * 0.12;
    const x = (e.rnd() - 0.5) * w;
    g.strokeStyle = e.rnd() < 0.5 ? '#4b5f55' : '#27342f';
    g.lineWidth = 0.05;
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x * 0.8, y - 0.5);
    g.stroke();
  }
  e.at(-0.1, -5.2, 'cicada');
});
