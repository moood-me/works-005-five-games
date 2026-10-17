// The mainmast amidships (x to starboard, y up from the main deck): the mast, and on "Secret" the yards of its three
// square sails — layers, painted hoisted; the upper ones lie lowered till their sails are set (its animate). The sails
// are their own cards (`main_course_l` …); "Anselm"'s mast is bare, her mainsail a gaff.
const s = e.state;
const L = e.lib;
const c = L.colours(s);
if (L.shipOf(s) === "secret") {
  L.mast(g, c, 27);
  L.yards(g, e, ["main_course", "main_top", "main_tg"]);
} else L.mast(g, c, 21, 0.36);
e.at(0, -12, "mainmast");
