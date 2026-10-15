// The snowy night over the suburb: low, overcast, a little lighter toward the horizon where the snow and the far
// lights glow; the late night (`late`) a darker layer over it (animate). Screen heights; all round; the horizon 0.5.
// (the full circle, e.aspect = 2π, its ends overlapping a little — the camera roams and turns)
const A = e.aspect, x0 = -2.6, w = A + 5.2;
const gr = g.createLinearGradient(0, -0.35, 0, 0.55);
gr.addColorStop(0, '#0a0f1d');
gr.addColorStop(0.45, '#151d33');
gr.addColorStop(0.8, '#2a3352');
gr.addColorStop(1, '#46496a');
g.fillStyle = gr;
g.fillRect(x0, -0.35, w, 1.6);
// low cloud, faintly lit from below
for (let i = 0; i < 9; i++) {
  const cx = x0 + e.rnd() * w, cy = 0.12 + e.rnd() * 0.3, rx = 0.25 + e.rnd() * 0.4, k = 0.1 + e.rnd() * 0.1;
  const c = g.createRadialGradient(cx, cy / k, 0, cx, cy / k, rx);
  c.addColorStop(0, 'rgba(70,78,108,0.45)');
  c.addColorStop(1, 'rgba(70,78,108,0)');
  g.save();
  g.scale(1, k);
  g.fillStyle = c;
  g.fillRect(cx - rx, cy / k - rx, rx * 2, rx * 2);
  g.restore();
}
e.layer('late', {}, n => {
  const d = n.createLinearGradient(0, -0.35, 0, 0.55);
  d.addColorStop(0, '#05080f');
  d.addColorStop(0.7, '#0e1426');
  d.addColorStop(1, '#262b44');
  n.fillStyle = d;
  n.fillRect(x0, -0.35, w, 1.6);
});
