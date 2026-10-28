// The captain's cabin on the poop, its aft face (on the others an after saloon of the same build): planks, a door,
// two portholes, the trim along its roof. A part of the «Henrietta» that burns — the last (layer `all`, shrunk as it is
// dragged). Its point speedy_cabin#part.
const L = e.lib, c = L.colours(e.state), P = L.plan.cabin;
e.layer('all', {}, g => {
  L.planked(g, -P.w / 2, P.w / 2, -P.h, 0, c.house, 0.22);
  L.rect(g, -P.w / 2 - 0.06, -P.h - 0.12, P.w + 0.12, 0.14, c.trim);
  L.door(g, -0.4, 0.8, 1.95, L.shade(c.house, 0.15));
  L.port(g, -1.0, -1.5, 0.17);
  L.port(g, 1.0, -1.5, 0.17);
  e.at(0.9, -1.0, 'part');
});
