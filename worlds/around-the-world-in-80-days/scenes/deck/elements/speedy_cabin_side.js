// The cabin's starboard side (x forward along it): planks, three portholes — at the middle one Speedy roars (the
// insert porthole).
const L = e.lib, c = L.colours(e.state), P = L.plan.cabin;
e.layer('all', {}, g => {
  L.planked(g, 0, P.deep, -P.h, 0, c.house, 0.22);
  L.rect(g, -0.06, -P.h - 0.12, P.deep + 0.12, 0.14, c.trim);
  for (const x of [0.7, 1.8, 2.9]) L.port(g, x, -1.5, 0.17);
  e.at(1.8, -1.5, 'porthole');
});
