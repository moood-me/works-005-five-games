const W = e.aspect, x0 = -0.3, x1 = W + 0.3;
// сумерки: холодная бирюза у горизонта, глубокая синева выше
e.layer('dusk', { box: [x0, -0.35, x1, 1.25] }, g => {
  const gr = g.createLinearGradient(0, -0.35, 0, 0.44);
  gr.addColorStop(0, '#0f1f40'); gr.addColorStop(0.5, '#27487a'); gr.addColorStop(0.8, '#5d87ad'); gr.addColorStop(0.95, '#a8c0cc'); gr.addColorStop(1, '#cbd0c4');
  g.fillStyle = gr; g.fillRect(x0, -0.35, x1 - x0, 0.8);
  g.fillStyle = '#cbd0c4'; g.fillRect(x0, 0.43, x1 - x0, 0.82);
  // след ушедшего света слева у горизонта — холодный, не оранжевый
  const rg = g.createRadialGradient(0.15, 0.44, 0, 0.15, 0.44, 0.7);
  rg.addColorStop(0, 'rgba(210,222,214,0.55)'); rg.addColorStop(1, 'rgba(210,222,214,0)');
  g.fillStyle = rg; g.fillRect(x0, -0.3, 1.6, 0.8);
});
e.layer('night', { box: [x0, -0.35, x1, 1.25] }, g => {
  const gr = g.createLinearGradient(0, -0.35, 0, 0.44);
  gr.addColorStop(0, '#060b19'); gr.addColorStop(0.55, '#0e1c3a'); gr.addColorStop(0.9, '#223e6c'); gr.addColorStop(1, '#3a5a86');
  g.fillStyle = gr; g.fillRect(x0, -0.35, x1 - x0, 0.8);
  g.fillStyle = '#3a5a86'; g.fillRect(x0, 0.43, x1 - x0, 0.82);
  for (let i = 0; i < 160; i++) {
    const x = x0 + e.rnd() * (x1 - x0), y = -0.3 + e.rnd() * 0.7, r = 0.0011 + e.rnd() * 0.0016, a = 0.25 + e.rnd() * 0.6;
    g.fillStyle = `rgba(220,232,255,${a * (1 - Math.max(0, y - 0.15) * 1.4)})`;
    g.beginPath(); g.arc(x, y, r, 0, 6.3); g.fill();
  }
});
// тонкие длинные облака, ползут очень медленно; концы сходятся
e.layer('clouds', { box: [0, 0.02, W, 0.4], drift: [0.004, 0] }, g => {
  for (let i = 0; i < 9; i++) {
    const cx = (i + 0.5) / 9 * W, cy = 0.1 + e.rnd() * 0.26, rx = 0.18 + e.rnd() * 0.16, ry = 0.012 + e.rnd() * 0.012;
    for (const off of [-W, 0, W]) {
      const gr = g.createRadialGradient(cx + off, cy, 0, cx + off, cy, rx);
      gr.addColorStop(0, 'rgba(150,175,210,0.30)'); gr.addColorStop(1, 'rgba(150,175,210,0)');
      g.save(); g.translate(cx + off, cy); g.scale(1, ry / rx); g.translate(-(cx + off), -cy);
      g.fillStyle = gr; g.beginPath(); g.arc(cx + off, cy, rx, 0, 6.3); g.fill(); g.restore();
    }
  }
});
