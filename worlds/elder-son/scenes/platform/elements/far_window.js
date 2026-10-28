// The Sarafanovs' window, far down beyond the gardens: its frame, the warm glass — brighter as the house holds
// together (`warm`, far_window.animate.js: the layer `lit` and the glow). Metres, its anchor at the sill; a big window,
// so as to be a warm point from the platform 60 m off.
const w = 1.5, h = 1.3;
g.fillStyle = '#e9e1cf';
g.fillRect(-w / 2 - 0.1, -h - 0.15, w + 0.2, h + 0.2);
g.fillStyle = '#3b2b1e';
g.fillRect(-w / 2, -h - 0.05, w, h);
e.layer('lit', {}, c => {
  c.fillStyle = '#f2b866';
  c.fillRect(-w / 2, -h - 0.05, w, h);
  c.fillStyle = '#c98a45';
  c.fillRect(-w / 2, -h - 0.05, w * 0.2, h);
  c.fillRect(w / 2 - w * 0.2, -h - 0.05, w * 0.2, h);
  c.fillStyle = '#e9e1cf';
  c.fillRect(-0.04, -h - 0.05, 0.08, h);
  c.fillRect(-w / 2, -h * 0.6, w, 0.06);
});
e.at(0, -h / 2 - 0.05);
e.light(0, -h / 2 - 0.05, 3.2, '#f0a85a', 2.4, 'glow');
