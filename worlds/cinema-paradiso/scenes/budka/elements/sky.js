
// The night over the square, seen only through the window on the square: deep blue, a few stars; dusk bluer.
const A = e.aspect, an = e.anim, eve = e.state.hour < 0.85;
const gr = g.createLinearGradient(0, -0.35, 0, 1.25);
gr.addColorStop(0, eve ? '#28345e' : '#0c1532'); gr.addColorStop(0.55, eve ? '#56648f' : '#1b2a58'); gr.addColorStop(1, eve ? '#8c8aa8' : '#2c3f70');
g.fillStyle = gr; g.fillRect(-0.3, -0.35, A + 0.6, 1.6);
if (!eve) for (let i = 0; i < 220; i++) {
  g.fillStyle = 'rgba(230,236,255,' + (0.4 + an.hash(i, 3) * 0.5) + ')';
  g.beginPath(); g.arc(-0.3 + an.hash(i, 1) * (A + 0.6), -0.35 + an.hash(i, 2) * 0.8, 0.0008 + an.hash(i, 4) * 0.0015, 0, Math.PI * 2); g.fill();
}
