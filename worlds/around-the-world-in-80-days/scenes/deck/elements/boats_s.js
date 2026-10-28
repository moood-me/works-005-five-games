// The starboard boat on her chocks, as the port one (it goes with her: on her anchor).
const L = e.lib, c = L.colours(e.state);
e.layer('all', {}, g => L.boat(g, c, L.plan.boats.len));
