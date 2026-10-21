// The sky over the gardens, seen only through the kitchen window: the night (hour 0.9) deep blue with stars, lighter
// toward the snowy horizon; the grey dawn (hour 0.25) low and pale, the stars gone. Screen heights, all round (the
// roaming camera's sky: plain bands across, so its ends meet).
const A = e.aspect, n = e.anim.clamp((e.state.hour - 0.25) / 0.65, 0, 1);
const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
const mix = (a, b) => { const p = hex(a), q = hex(b); return `rgb(${p.map((v, i) => Math.round(v + (q[i] - v) * n)).join(',')})`; };
const gr = g.createLinearGradient(0, -0.35, 0, 0.6);
gr.addColorStop(0, mix('#59606f', '#0a0f1f'));
gr.addColorStop(0.55, mix('#8a8f9c', '#1b2340'));
gr.addColorStop(1, mix('#c4c3c0', '#3d4666'));
g.fillStyle = gr;
g.fillRect(-0.3, -0.4, A + 0.6, 1.7);
if (n > 0.3) {
  g.fillStyle = `rgba(220,228,255,${0.85 * (n - 0.3) / 0.7})`;
  for (let i = 0; i < 160; i++) {
    g.beginPath();
    g.arc(e.rnd() * A, -0.3 + e.rnd() * e.rnd() * 0.7, 0.0008 + e.rnd() * 0.0012, 0, Math.PI * 2);
    g.fill();
  }
}
