const gr = g.createLinearGradient(0, -250, 0, 250);
gr.addColorStop(0, '#8fa0c8'); gr.addColorStop(0.35, '#52668f'); gr.addColorStop(1, '#2f4068');
g.fillStyle = gr; g.fillRect(-350, -250, 700, 500);
g.fillStyle = '#d6dcf2';
for (let i = 0; i < 260; i++) {
  const t = e.rnd(), y = -250 + t * t * 500, w = 2 + t * 24, x = -330 + e.rnd() * 660;
  g.globalAlpha = 0.10 + e.rnd() * 0.15; g.fillRect(x, y, w, 0.2 + t * 0.9);
}
g.globalAlpha = 1;
