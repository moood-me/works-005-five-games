// A snow ridge across the sledge's way: a drift the wind has carved into a crest, its lee face in blue shadow, a little
// spindrift smoking off its top (a layer in the wind).
const { P } = e.lib;
P(g, [-5, 0.15, -3.6, -0.6, -1.6, -1.5, 0.2, -1.85, 1.6, -1.6, 3.4, -0.7, 5, 0.15], '#f3f6fa');
P(g, [0.2, -1.85, 1.6, -1.6, 3.4, -0.7, 5, 0.15, 2.0, 0.15, 1.2, -0.8], '#cdd9e8');
e.layer('spindrift', { pivot: [0.2, -1.85], box: [-1.5, -2.6, 3.5, -1.4], wind: { strength: 0.7, gust: 0.8 } }, g => {
  g.fillStyle = 'rgba(255,255,255,0.55)';
  g.beginPath();
  g.ellipse(1.2, -1.95, 1.6, 0.18, -0.08, 0, Math.PI * 2);
  g.fill();
});
