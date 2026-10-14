// the far glow of the headlight only while it is far (a small bright lamp is too small to see at 200 m)
const d = e.state.freight_d, k = Math.min(1, Math.max(0, (d - 30) / 100));
e.glow('far', k);
e.glow('head', 1 - 0.6 * k);
