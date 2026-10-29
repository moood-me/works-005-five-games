// The girls' school beyond its railings: a long two-storey front, ochre with white trim
const L = e.lib;
const P = L.PAINT;
P.facade(g, e, { x0: -9, x1: 9, h: 9.5, plinth: 0.7, color: '#d6be86', trim: '#f0ebde', rust: 4.2, roof: 1.6, pilasters: [-8.8, -3, 3, 8.8],
  floors: [{ y0: 3.6, y1: 1.6, w: 1.1, xs: [-7.6, -6.0, -4.4, -1.2, 0.4, 2.0, 4.4, 6.0, 7.6] }, { y0: 8.0, y1: 5.8, w: 1.1, xs: [-7.6, -6.0, -4.4, -1.2, 0.4, 2.0, 4.4, 6.0, 7.6] }],
  season: L.seasonOf(e.state.season) });
