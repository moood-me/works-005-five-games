const A = e.aspect;
const gr = g.createLinearGradient(0, -0.35, 0, 1.25);
gr.addColorStop(0, '#0b1430');
gr.addColorStop(0.25, '#16264a');
gr.addColorStop(0.44, '#46628f');
gr.addColorStop(0.5, '#6a82b0');
gr.addColorStop(0.56, '#3b4c76');
gr.addColorStop(1, '#27345a');
g.fillStyle = gr;
g.fillRect(-0.3, -0.35, A + 0.6, 1.6);
e.layer('stars', { box: [-0.3, -0.35, A + 0.3, 0.42], flicker: 0.25 }, g => {
  for (let i = 0; i < 70; i++) {
    const x = -0.3 + e.rnd() * (A + 0.6), y = -0.35 + e.rnd() * 0.7;
    g.globalAlpha = 0.25 + e.rnd() * 0.5;
    g.fillStyle = '#dfe8ff';
    g.beginPath(); g.arc(x, y, 0.0016 + e.rnd() * 0.0016, 0, 6.2832); g.fill();
  }
});
e.layer('glow', { box: [A * 0.45, 0.1, A * 1.1, 0.48] }, g => {
  const r = g.createRadialGradient(A * 0.82, 0.41, 0, A * 0.82, 0.41, 0.5);
  r.addColorStop(0, 'rgba(190,208,236,0.75)');
  r.addColorStop(0.35, 'rgba(120,150,205,0.35)');
  r.addColorStop(1, 'rgba(60,90,160,0)');
  g.fillStyle = r;
  g.fillRect(A * 0.45, 0.0, A * 0.7, 0.5);
});
