// The deckhouse's starboard side (x forward along it): planks, windows, a door to the engine-room.
const L = e.lib, c = L.colours(e.state);
e.layer('all', {}, g => L.houseSide(g, c, L.plan.house.deep, L.plan.house.h, [0.8, 2.2, 5.6, 7.0], 3.6));
