const A = e.aspect, H = 0.34;
e.layer('night', { box: [-0.3, -0.35, A + 0.3, 0.8] }, g => {
  const gr = g.createLinearGradient(0, -0.35, 0, H + 0.02);
  gr.addColorStop(0, '#1c2550'); gr.addColorStop(0.7, '#34447c'); gr.addColorStop(1, '#5c6ea6');
  g.fillStyle = gr; g.fillRect(-0.3, -0.35, A + 0.6, 1.2);
  g.fillStyle = '#dfe6ff';
  for (let i = 0; i < 60; i++) { g.globalAlpha = 0.25 + e.rnd() * 0.5; const s = 0.0012 + e.rnd() * 0.0016; g.fillRect(-0.2 + e.rnd() * (A + 0.4), -0.3 + e.rnd() * 0.5, s, s); }
  g.globalAlpha = 1;
});
e.layer('dawn', { box: [-0.3, -0.35, A + 0.3, 0.8] }, g => {
  const gr = g.createLinearGradient(0, -0.35, 0, H + 0.02);
  gr.addColorStop(0, '#6f7fb4'); gr.addColorStop(0.45, '#c3a2b8'); gr.addColorStop(0.8, '#f4b99a'); gr.addColorStop(1, '#ffe2b0');
  g.fillStyle = gr; g.fillRect(-0.3, -0.35, A + 0.6, 1.2);
  const r = g.createRadialGradient(A * 0.38, H, 0, A * 0.38, H, 0.5);
  r.addColorStop(0, 'rgba(255,230,180,0.9)'); r.addColorStop(1, 'rgba(255,200,160,0)');
  g.fillStyle = r; g.fillRect(-0.3, -0.35, A + 0.6, 1.2);
});
