// The right side of the lane beyond the cross street (distance 38…72): house fronts one after another
const L = e.lib;
const P = L.PAINT;
const season = L.seasonOf(e.state.season);
const kinds = [
  { color: '#cdbf9f', h: 8.5, floors: [{ y0: 3.0, y1: 1.4, w: 0.9, xs: [-3, -1.5, 0, 1.5, 3] }, { y0: 6.6, y1: 5.0, w: 0.85, xs: [-3, -1.5, 0, 1.5, 3] }] },
  { color: '#b5bfc6', h: 11, floors: [{ y0: 3.0, y1: 1.4, w: 0.9, xs: [-3, -1.5, 0, 1.5, 3] }, { y0: 6.4, y1: 4.8, w: 0.85, xs: [-3, -1.5, 0, 1.5, 3] }, { y0: 9.6, y1: 8.1, w: 0.8, xs: [-3, -1.5, 0, 1.5, 3] }] },
  { color: '#d2c3b0', h: 6.2, floors: [{ y0: 3.0, y1: 1.4, w: 0.9, xs: [-3, -1.5, 1.5, 3] }] },
];
let k = e.id === 'row_far_l' ? 1 : 0;
for (let x = -17; x < 17; x += 8) {
  const o = kinds[k++ % kinds.length];
  g.save();
  g.translate(x + 4, 0);
  P.facade(g, e, { x0: -4, x1: 4, h: o.h, plinth: 0.5, color: o.color, trim: '#ebe7dc', roof: 1.3, floors: o.floors, season });
  g.restore();
}
