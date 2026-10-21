// The sledge's great sail, hinged on the mast (x 0) and reaching aft (−x): a gaff sail of creamy canvas with its seams
// and reef points, the gaff above, the boom below (it turns with its card: sail_face, by the sheet and the wind). Thin:
// the low sun shows through it. The canvas and the gaff are a layer that comes down onto the boom as it is furled
// (sail_up). Points: `sheet` — the boom's end, where the sheet runs to the hand; `peak` — the gaff's end.
const { R, P } = e.lib;
// the boom
R(g, -5.1, -0.62, 0, -0.5, '#6e5238');
e.layer('canvas', { pivot: [0, -0.55], box: [-5.4, -7.7, 0.3, -0.45] }, g => {
  P(g, [0, -0.62, -5.0, -0.66, -4.4, -7.35, -0.05, -6.6], '#efe6d2');
  g.strokeStyle = '#d6cbb2';
  g.lineWidth = 0.025;
  g.beginPath();
  for (let k = 1; k < 7; k++) { const u = k / 7; g.moveTo(-5.0 * u, -0.65); g.lineTo(-0.05 + (-4.4 + 0.05) * u, -6.6 - 0.75 * u); }
  g.stroke();
  g.fillStyle = '#b8a888';
  for (let k = 1; k < 10; k++) g.fillRect(-0.45 * k - 0.02, -1.6 - 0.02 * k, 0.04, 0.12);
  g.strokeStyle = '#bfae8a';
  g.lineWidth = 0.04;
  g.beginPath();
  g.moveTo(-5.0, -0.66);
  g.lineTo(-4.4, -7.35);
  g.stroke();
  // the gaff
  g.strokeStyle = '#6e5238';
  g.lineWidth = 0.1;
  g.beginPath();
  g.moveTo(0, -6.55);
  g.lineTo(-4.55, -7.45);
  g.stroke();
});
e.at(-5.0, -0.56, 'sheet');
e.at(-4.4, -7.35, 'peak');
e.at(-2.4, -3.5);
