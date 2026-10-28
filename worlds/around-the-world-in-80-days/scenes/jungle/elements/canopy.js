// The crowns of the tall trees over their trunks (forest) — clusters of leaf masses, lianas hanging from them — and the
// great fig's broad dome: each a layer standing at its tree's depth, bending a little in the wind about where its limbs
// spread. The leaves are thin: the sun behind them comes through green (translucent), into their shade too.
const L = e.lib, A = 12, wind = { strength: 0.1, gust: 0.6, scale: 3 };
L.TREES.forEach((t, i) => L.plantLayer(e, `tree${i}`, t, A, Object.assign([-0.47, -1.1, 0.47, -0.04], { pivot: [0, -0.74] }), wind,
  gl => L.crown(gl, t.h, t.v, '#3b5434', '#2e4529')));
const [fa, fd] = L.plan.fig;
L.plantLayer(e, 'fig', { a: fa, d: fd, h: 18 }, A, Object.assign([-1.06, -1.06, 1.06, -0.3], { pivot: [0, -0.45] }), { strength: 0.06, gust: 0.6, scale: 4 },
  gl => L.figCrown(gl, 18));
