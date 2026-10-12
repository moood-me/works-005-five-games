// The undergrowth between the trunks, each plant a layer at its own depth, its foot on the land there, swaying from it in
// the wind, never in step with its neighbours: palms of the understorey, bamboo along the trail's far edge, ferns and
// broad leaves, the palms leaning out over the river on the clearing's shore. Thin leaves: lit from behind, they glow.
const L = e.lib, A = 12;
const foot = (box) => Object.assign(box, { pivot: [0, 0] });
L.PALMS.forEach((p, i) => L.plantLayer(e, `palm${i}`, p, A, foot([-0.95, -1.4, 0.95, 0.05]), { strength: 0.25, gust: 0.5 },
  gl => L.palm(gl, p.h, p.v, '#3f5e38', '#55573f')));
L.BAMBOO.forEach((p, i) => L.plantLayer(e, `bamboo${i}`, p, A, foot([-0.78, -1.2, 0.78, 0.05]), { strength: 0.32, gust: 0.6 },
  gl => L.bamboo(gl, p.h, p.v, '#46643a', '#5e6e44')));
L.LOW.forEach((p, i) => p.fern
  ? L.plantLayer(e, `low${i}`, p, A, foot([-1.65, -1.55, 1.65, 0.05]), { strength: 0.2, gust: 0.4 }, gl => L.fern(gl, p.h, p.v, '#3a5834'))
  : L.plantLayer(e, `low${i}`, p, A, foot([-2.25, -2.25, 2.25, 0.05]), { strength: 0.18, gust: 0.4 }, gl => L.broadleaf(gl, p.h * 1.3, p.v, '#3d5c36', '#5a7a4a')));
L.SHORE.forEach((p, i) => L.plantLayer(e, `shore${i}`, p, A, foot([-0.85, -1.4, 1.0, 0.05]), { strength: 0.22, gust: 0.5 },
  gl => L.palm(gl, p.h, p.v, '#3f5e38', '#6a6450')));
