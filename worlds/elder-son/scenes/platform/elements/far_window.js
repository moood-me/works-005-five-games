// The Sarafanovs' window, far down beyond the gardens: its frame, the warm glass — brighter as the house holds
// together (`warm`, far_window.animate.js: the layer `lit` and the glow). Metres, its anchor at the sill.
g.fillStyle = '#e9e1cf';
g.fillRect(-0.55, -1.0, 1.1, 1.05);
g.fillStyle = '#3b2b1e';
g.fillRect(-0.45, -0.9, 0.9, 0.85);
e.layer('lit', {}, c => {
  c.fillStyle = '#f2b866';
  c.fillRect(-0.45, -0.9, 0.9, 0.85);
  c.fillStyle = '#c98a45';
  c.fillRect(-0.45, -0.9, 0.2, 0.85);
  c.fillRect(0.25, -0.9, 0.2, 0.85);
  c.fillStyle = '#e9e1cf';
  c.fillRect(-0.03, -0.9, 0.06, 0.85);
  c.fillRect(-0.45, -0.55, 0.9, 0.05);
});
e.at(0, -0.48);
e.light(0, -0.48, 1.2, '#eda055', 1.4, 'glow');
