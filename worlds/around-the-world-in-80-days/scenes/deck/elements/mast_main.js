// The mainmast (just forward of the cabin), seen from aft: the pole, tops, crosstrees, shrouds and ratlines down to the
// rails — one layer, lowered down through the deck as it is dragged (a part of the «Henrietta» that burns). Its point
// mast_main#part.
const L = e.lib, c = L.colours(e.state);
e.layer('mast', { pivot: [0, 0] }, g => {
  L.mast(g, c, L.plan.mastMain.h);
  e.at(0, -4, 'part');
});
