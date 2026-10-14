const W = e.aspect, box = [0, -0.35, W, 1.25];
e.layer('dusk', { box }, g => {
  const gr = g.createLinearGradient(0, -0.35, 0, 1.25);
  gr.addColorStop(0, '#26356e'); gr.addColorStop(0.28, '#5a5a98'); gr.addColorStop(0.4, '#e89a78');
  gr.addColorStop(0.46, '#7a5a82'); gr.addColorStop(1, '#1a1c40');
  g.fillStyle = gr; g.fillRect(0, -0.35, W, 1.6);
});
e.layer('night', { box }, g => {
  const gr = g.createLinearGradient(0, -0.35, 0, 1.25);
  gr.addColorStop(0, '#050a1f'); gr.addColorStop(0.25, '#0b1a45'); gr.addColorStop(0.4, '#26478a');
  gr.addColorStop(0.46, '#1a3366'); gr.addColorStop(1, '#08122e');
  g.fillStyle = gr; g.fillRect(0, -0.35, W, 1.6);
  for (let i = 0; i < 700; i++) {
    const x = e.rnd() * W, y = -0.3 + e.rnd() * 0.74, r = 0.0012 + e.rnd() * 0.0028;
    g.globalAlpha = 0.35 + e.rnd() * 0.65;
    g.fillStyle = e.rnd() < 0.2 ? '#ffe9c0' : '#dfe8ff';
    g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.fill();
  }
  g.globalAlpha = 1;
});
e.layer('moon', { box }, g => {
  const mx = W / 2 + 0.42, my = 0.22;
  const gl = g.createRadialGradient(mx, my, 0.02, mx, my, 0.22);
  gl.addColorStop(0, 'rgba(190,210,255,0.55)'); gl.addColorStop(1, 'rgba(190,210,255,0)');
  g.fillStyle = gl; g.beginPath(); g.arc(mx, my, 0.22, 0, 6.2832); g.fill();
  g.fillStyle = '#f6f2de'; g.beginPath(); g.arc(mx, my, 0.03, 0, 6.2832); g.fill();
  e.light(mx, my, 0.25, '#a8bff5', 1.0, 'moon');
  e.at(mx, my, 'disc');
});
