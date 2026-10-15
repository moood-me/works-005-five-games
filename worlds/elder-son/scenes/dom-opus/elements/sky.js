// The night over the gardens, seen only through the kitchen window: deep blue, lighter toward the snowy horizon.
// Screen heights, all round (the roaming camera's sky).
const A = e.aspect, x0 = -2.6, w = A + 5.2;
const gr = g.createLinearGradient(0, -0.35, 0, 0.55);
gr.addColorStop(0, '#0b1020');
gr.addColorStop(0.6, '#1c2440');
gr.addColorStop(1, '#3c4566');
g.fillStyle = gr;
g.fillRect(x0, -1.2, w, 2.5);
for (let i = 0; i < 90; i++) {
  g.fillStyle = 'rgba(220,228,255,0.8)';
  g.beginPath();
  g.arc(x0 + e.rnd() * w, -0.3 + e.rnd() * e.rnd() * 0.6, 0.0012, 0, Math.PI * 2);
  g.fill();
}
