// The foremast (x to starboard, y up from the main deck): the mast and the yards of its square sails — layers, painted
// hoisted, lowered by its animate till their sails are set: "Secret"'s three; "Anselm"'s fore topsail's over a fixed
// lower yard
const s = e.state;
const L = e.lib;
const c = L.colours(s);
if (L.shipOf(s) === "secret") L.mast(g, c, 24, 0.38);
else {
  L.mast(g, c, 20, 0.34);
  g.fillStyle = c.spar;
  g.fillRect(-5, -11.6, 10, 0.2);
}
L.yards(g, e, ["fore_course", "fore_top", "fore_tg"]);
e.at(0, -11, "foremast");
