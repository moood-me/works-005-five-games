g.fillStyle = '#343a52'; g.fillRect(-20, -10, 40, 20);
for (let i = 0; i < 220; i++) {
  g.globalAlpha = 0.14; g.fillStyle = e.rnd() < 0.5 ? '#2a3350' : '#8c95ad';
  g.fillRect(-20 + e.rnd() * 40, -10 + e.rnd() * 20, 0.2 + e.rnd() * 0.8, 0.05 + e.rnd() * 0.2);
}
