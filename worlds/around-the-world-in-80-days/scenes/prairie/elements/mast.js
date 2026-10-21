// The sledge's mast, lashed with iron to the frame, and its pennant at the top (a layer: it streams downwind — by the
// wind and the sledge's own running — animate).
const { R, P } = e.lib;
R(g, -0.08, -6.6, 0.08, 0.02, '#7a5a3c');
for (const y of [-0.35, -0.6]) R(g, -0.12, y - 0.04, 0.12, y + 0.04, '#4a4a4e');
R(g, -0.11, -6.68, 0.11, -6.58, '#4a4a4e');
e.layer('pennant', { pivot: [0, -6.45], box: [-1.7, -6.75, 1.7, -6.1], wind: { strength: 0.6, gust: 0.5 } }, g => {
  P(g, [0, -6.6, 1.55, -6.45, 0, -6.3], '#b8402e');
});
