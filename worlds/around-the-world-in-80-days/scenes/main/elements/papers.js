// The newspapers on their stand by the window: a slender post, a cross-bar, The Times and the rest
// folded over it.
g.fillStyle = '#241c18';
g.fillRect(-0.025, -1.66, 0.05, 1.66);
g.beginPath();
g.ellipse(0, -0.02, 0.26, 0.04, 0, 0, Math.PI * 2);
g.fill();
g.fillRect(-0.55, -1.68, 1.1, 0.035);
[-0.34, 0.33].forEach((x, i) => {
  const h = 0.7 + 0.1 * e.anim.hash(i, 9);
  const w = 0.34;
  g.fillStyle = '#d8d0c0';
  g.fillRect(x - w / 2, -1.66, w, h);
  // the fold over the bar, and the print as faint lines
  g.fillStyle = 'rgba(11,9,8,0.35)';
  g.fillRect(x - w / 2, -1.66, w, 0.05);
  g.fillStyle = 'rgba(11,9,8,0.14)';
  for (let y = -1.56; y < -1.66 + h - 0.05; y += 0.04) g.fillRect(x - w / 2 + 0.03, y, w - 0.06, 0.01);
});
e.at(0, -1.3, 'papers');
