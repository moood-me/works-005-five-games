// What grows at the viewer's feet and hangs into the top of the view, dark against the lit forest: ferns and broad leaves
// (a few in every view; none in the stream's channel nor before the clearing, the view to the river open), lianas with
// their leaves hanging from the branches overhead — each a layer at its own depth, stirring in the wind (the lianas swing
// from their tops).
const L = e.lib, A = 4, leaf = '#1f2e22';
const foot = (box) => Object.assign(box, { pivot: [0, 0] });
L.NEAR_LOW.forEach((p, i) => p.fern
  ? L.plantLayer(e, `low${i}`, p, A, foot([-1.65, -1.55, 1.65, 0.05]), { strength: 0.22, gust: 0.4 }, gl => L.fern(gl, p.h, p.v, leaf))
  : L.plantLayer(e, `low${i}`, p, A, foot([-2.45, -2.45, 2.45, 0.05]), { strength: 0.2, gust: 0.4 }, gl => L.broadleaf(gl, p.h * 1.4, p.v, leaf, '#2c4232')));
L.LIANAS.forEach((p, i) => L.plantLayer(e, `liana${i}`, { a: p.a, d: p.d, h: 1 }, A, Object.assign([-0.6, -9.1, 0.6, -p.low + 0.4], { pivot: [0, -9] }),
  { strength: 0.3, gust: 0.6 }, gl => L.liana(gl, p.low, leaf)));
