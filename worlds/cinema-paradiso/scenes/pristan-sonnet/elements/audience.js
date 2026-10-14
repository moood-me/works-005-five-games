e.layer('row', { box: [-2.6, -1.4, 2.6, 0.1] }, g => {
  for (let i = 0; i < 7; i++) {
    const x = -1.92 + i * 0.64;
    g.fillStyle = '#4f3c2c'; g.fillRect(x - 0.24, -0.95, 0.04, 0.95); g.fillRect(x + 0.2, -0.95, 0.04, 0.95);
    g.fillRect(x - 0.24, -0.95, 0.48, 0.05); g.fillRect(x - 0.24, -0.6, 0.48, 0.04);
    if (e.rnd() < 0.82) {
      g.fillStyle = e.rnd() < 0.5 ? '#222844' : '#2e2a3a';
      g.beginPath(); g.ellipse(x, -0.82, 0.24, 0.17, 0, Math.PI, 0); g.lineTo(x + 0.24, -0.45); g.lineTo(x - 0.24, -0.45); g.closePath(); g.fill();
      g.beginPath(); g.arc(x + (e.rnd() - 0.5) * 0.06, -1.04, 0.115, 0, 6.28); g.fill();
      if (e.rnd() < 0.25) { g.fillStyle = '#6a5a4a'; g.fillRect(x - 0.12, -1.18, 0.24, 0.07); }
    }
  }
});
