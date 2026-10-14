const A = e.aspect;
const box = [-0.3, -0.35, A + 0.3, 1.25];
const grad = (g, stops) => {
  const gr = g.createLinearGradient(0, -0.35, 0, 1.25);
  for (const [o, c] of stops) gr.addColorStop(o, c);
  return gr;
};
e.layer('night', { box }, g => {
  g.fillStyle = grad(g, [[0, '#141b3a'], [0.25, '#2b3560'], [0.42, '#5a5f8c'], [0.5, '#a698b4'], [0.53, '#c9aab8'], [1, '#c9aab8']]);
  g.fillRect(box[0], box[1], box[2] - box[0], box[3] - box[1]);
});
e.layer('stars', { box }, g => {
  for (let i = 0; i < 55; i++) {
    const x = e.rnd() * A;
    const y = e.rnd() * 0.3 - 0.1;
    const r = 0.0012 + e.rnd() * 0.0016;
    g.fillStyle = 'rgba(235,235,255,' + (0.4 + e.rnd() * 0.5) + ')';
    g.beginPath();
    g.arc(x, y, r, 0, 6.283);
    g.fill();
  }
});
e.layer('day', { box }, g => {
  g.fillStyle = grad(g, [[0, '#6f86b8'], [0.3, '#a9b3d0'], [0.45, '#e8c4b0'], [0.53, '#ffd9a8'], [1, '#ffd9a8']]);
  g.fillRect(box[0], box[1], box[2] - box[0], box[3] - box[1]);
});
e.layer('glow', { box, blend: 'add' }, g => {
  const gr = g.createRadialGradient(A * 0.62, 0.43, 0, A * 0.62, 0.43, 0.55);
  gr.addColorStop(0, 'rgba(255,200,140,0.55)');
  gr.addColorStop(0.4, 'rgba(255,170,130,0.22)');
  gr.addColorStop(1, 'rgba(255,160,130,0)');
  g.fillStyle = gr;
  g.fillRect(box[0], box[1], box[2] - box[0], box[3] - box[1]);
});
e.layer('sun', { box }, g => {
  const x = A * 0.62;
  const gr = g.createRadialGradient(x, 0.5, 0, x, 0.5, 0.09);
  gr.addColorStop(0, 'rgba(255,240,200,0.9)');
  gr.addColorStop(1, 'rgba(255,220,170,0)');
  g.fillStyle = gr;
  g.fillRect(x - 0.1, 0.4, 0.2, 0.2);
  g.fillStyle = '#fff1cc';
  g.beginPath();
  g.arc(x, 0.5, 0.03, 0, 6.283);
  g.fill();
  e.light(x, 0.5, 0.25, '#ffd6a0', 1.0, 'sun');
});
