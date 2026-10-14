const gr = g.createLinearGradient(0, -400, 0, 400);
gr.addColorStop(0, '#5a88c4'); gr.addColorStop(0.35, '#3a68a4'); gr.addColorStop(0.8, '#2a4f88'); gr.addColorStop(1, '#143056');
g.fillStyle = gr; g.fillRect(-800, -400, 1600, 800);
for (let i = 0; i < 320; i++) {
  const t = e.rnd(), y = 395 - t * t * 140, x = (e.rnd() - 0.5) * 120 * (0.3 + (1 - t));
  g.globalAlpha = 0.25 + e.rnd() * 0.3; g.strokeStyle = e.rnd() < 0.5 ? '#6f9ad0' : '#102a52';
  g.lineWidth = 0.04 + (1 - t) * 0.05; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 1.2 + e.rnd() * 3 * (1 - t), y); g.stroke();
}
g.globalAlpha = 1;
