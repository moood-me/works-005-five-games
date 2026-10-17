// the two red lamps in turn, about once a second each, while the bell rings; dark otherwise
const on = e.state.bell > 0.5 ? 1 : 0;
const w = Math.sin(e.t * Math.PI * 1.7);
const k1 = Math.min(1, Math.max(0, 0.5 + 3 * w));
const k2 = Math.min(1, Math.max(0, 0.5 - 3 * w));
e.glow('l1', on * k1);
e.glow('l2', on * k2);
