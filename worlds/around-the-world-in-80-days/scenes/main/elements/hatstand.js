// The hat stand by the door: a turned post on three feet, pegs at the top — and Fogg's top hat on its peg while
// `fogg_hat` is 1 (he takes it on his way out: then it is on his head).
g.fillStyle = '#241c18';
g.fillRect(-0.022, -1.82, 0.044, 1.82);
g.fillRect(-0.24, -0.03, 0.48, 0.03);
for (const s of [-1, 1]) {
  g.save();
  g.translate(0, -1.7);
  g.rotate(s * 0.9);
  g.fillRect(-0.012, -0.16, 0.024, 0.16);
  g.restore();
}
g.beginPath();
g.ellipse(0, -1.84, 0.04, 0.025, 0, 0, Math.PI * 2);
g.fill();
if ((e.state.fogg_hat ?? 1) > 0.5) {
  // the top hat on the right-hand peg: a narrow brim, a tall crown
  g.fillStyle = '#16171a';
  g.fillRect(0.06, -2.0, 0.27, 0.025);
  g.fillRect(0.1, -2.17, 0.19, 0.17);
}
e.at(0.2, -1.95, 'hat');
