// The night sky over the crossing: deep blue going paler and warmer at the horizon (the settlement's glow), a few stars.
const w = e.aspect;
const gr = g.createLinearGradient(0, -0.35, 0, 0.5);
gr.addColorStop(0, '#080d1e');
gr.addColorStop(0.55, '#14204a');
gr.addColorStop(0.88, '#2c3a68');
gr.addColorStop(1, '#4a4a6a');
g.fillStyle = gr;
g.fillRect(-0.3, -0.35, w + 0.6, 1.0);
g.fillStyle = '#4a4a6a';
g.fillRect(-0.3, 0.5, w + 0.6, 0.8);
// the glow of the settlement behind the rails
const gl = g.createRadialGradient(w * 0.42, 0.47, 0, w * 0.42, 0.47, 0.55);
gl.addColorStop(0, 'rgba(232,150,70,0.35)');
gl.addColorStop(1, 'rgba(232,150,70,0)');
g.fillStyle = gl;
g.fillRect(-0.3, -0.1, w + 0.6, 0.7);
// stars
for (let i = 0; i < 110; i++) {
  const x = -0.2 + (w + 0.4) * e.rnd(), y = -0.3 + 0.7 * e.rnd() ** 1.3, r = 0.0012 + 0.0018 * e.rnd();
  g.globalAlpha = 0.35 + 0.5 * e.rnd();
  g.fillStyle = e.rnd() < 0.2 ? '#ffe9c8' : '#dfe8ff';
  g.beginPath(); g.arc(x, y, r, 0, 6.283); g.fill();
}
g.globalAlpha = 1;
