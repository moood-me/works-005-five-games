// The deckhouse's port side (x aft along it): as the starboard one, windows and a door.
const L = e.lib, c = L.colours(e.state);
e.layer('all', {}, g => L.houseSide(g, c, L.plan.house.deep, L.plan.house.h, [0.8, 2.2, 5.6, 7.0], 3.6));
