// The port boat on her chocks across the deck between the hatch and the deckhouse, seen from aft along her side (the
// starboard one — boats_s, beside her a little forward). A part of the «Henrietta» that burns, both (layer `all`). Its
// point boats#part.
const L = e.lib, c = L.colours(e.state);
e.layer('all', {}, g => {
  L.boat(g, c, L.plan.boats.len);
  e.at(0.6, -1.0, 'part');
});
