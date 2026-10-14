for (let i = 0; i < 16; i++) {
  const x = -0.35 + e.rnd() * 0.7, h = 0.2 + e.rnd() * 0.3;
  g.strokeStyle = e.rnd() < 0.5 ? '#6c7a58' : '#4a5a3e'; g.lineWidth = 0.02;
  g.beginPath(); g.moveTo(x, 0); g.quadraticCurveTo(x + (e.rnd() - 0.5) * 0.1, -h * 0.6, x + (e.rnd() - 0.5) * 0.2, -h); g.stroke();
}
