// The foremast (forward of the deckhouse), seen from aft: as the mainmast. Its point mast_fore#part (high on it: clear
// of the deckhouse's and the yards' points in the boilers' view).
const L = e.lib, c = L.colours(e.state);
e.layer('mast', { pivot: [0, 0] }, g => {
  L.mast(g, c, L.plan.mastFore.h);
  e.at(0, -10, 'part');
});
