// The «General Grant»'s walking-beam engine over the deckhouse, seen from aft: the gallows-frame (two raking legs and
// its crosshead) and the beam's end over it, rocking (a layer: its animate, by the ship's way). Nothing on the others.
const L = e.lib, c = L.colours(e.state);
if (L.shipOf(e.state) === 'general_grant') {
  L.poly(g, [[-2.6, -2.4], [-2.3, -2.4], [-0.25, -8.6], [-0.55, -8.6]], '#4a4440');
  L.poly(g, [[2.6, -2.4], [2.3, -2.4], [0.25, -8.6], [0.55, -8.6]], '#4a4440');
  L.rect(g, -0.8, -8.9, 1.6, 0.4, '#3a3634');
  e.layer('beam', {}, g => {
    L.poly(g, [[-0.35, -9.2], [0, -10.2], [0.35, -9.2], [0, -8.9]], '#2e2c2a');
    L.rect(g, -0.08, -9.2, 0.16, 6.8, '#3a3634');
  });
}
