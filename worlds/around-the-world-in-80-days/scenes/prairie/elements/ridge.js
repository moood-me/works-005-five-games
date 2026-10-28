// A snow ridge across the sledge's way: a drift the wind has carved into a crest, its lee face in blue shadow, a little
// spindrift smoking off its top (a layer in the wind). It rises out of the snow as `ridge_h` grows (the drift and its
// spindrift are layers, risen from its foot by animate).
const { P } = e.lib;
e.layer('drift', { pivot: [0, 0.15], box: [-5.1, -2.0, 5.1, 0.2] }, g => {
  P(g, [-5, 0.15, -3.6, -0.6, -1.6, -1.5, 0.2, -1.85, 1.6, -1.6, 3.4, -0.7, 5, 0.15], '#f3f6fa');
  P(g, [0.2, -1.85, 1.6, -1.6, 3.4, -0.7, 5, 0.15, 2.0, 0.15, 1.2, -0.8], '#cdd9e8');
});
e.layer('spindrift', { pivot: [0.2, -1.85], box: [-1.5, -2.6, 3.5, -1.4], wind: { strength: 0.7, gust: 0.8 } }, g => {
  g.fillStyle = 'rgba(255,255,255,0.55)';
  g.beginPath();
  g.ellipse(1.2, -1.95, 1.6, 0.18, -0.08, 0, Math.PI * 2);
  g.fill();
});
