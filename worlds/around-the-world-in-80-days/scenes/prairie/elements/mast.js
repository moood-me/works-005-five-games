// The sledge's mast, lashed with iron to the frame, and its pennant at the top (a layer: it streams downwind — by the
// wind and the sledge's own running — animate).
const { R, P } = e.lib;
R(g, -0.08, -7.9, 0.08, 0.02, '#7a5a3c');
for (const y of [-0.35, -0.6]) R(g, -0.12, y - 0.04, 0.12, y + 0.04, '#4a4a4e');
R(g, -0.11, -7.98, 0.11, -7.88, '#4a4a4e');
e.layer('pennant', { pivot: [0, -7.75], box: [-1.7, -8.05, 1.7, -7.4], wind: { strength: 0.6, gust: 0.5 } }, g => {
  P(g, [0, -7.9, 1.55, -7.75, 0, -7.6], '#b8402e');
});
