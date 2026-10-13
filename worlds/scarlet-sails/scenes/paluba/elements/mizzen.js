// "Secret"'s mizzen mast on the poop, ahead of the wheel (x to starboard, y up from the deck): the mast, its top and
// topmast; "Anselm" has none
const s = e.state;
const L = e.lib;
if (L.shipOf(s) === "secret") {
  const c = L.colours(s);
  L.mast(g, c, 18.5, 0.3);
  g.fillStyle = c.spar;
  g.fillRect(-1.1, -11.2, 2.2, 0.18);
}
