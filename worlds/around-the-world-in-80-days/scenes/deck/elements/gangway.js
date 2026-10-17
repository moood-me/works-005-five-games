// The gangway from the starboard rail down to the quay: planks with battens across, its ropes painted along its edges
// (seen from above, the deck end at the far edge). Nothing where there is no quay.
const L = e.lib;
if (L.quayed(L.portOf(e.state))) {
  L.rect(g, -0.55, -2.35, 1.1, 4.7, '#8a6a48');
  g.fillStyle = '#6a5038';
  for (let y = -2.2; y < 2.35; y += 0.35) g.fillRect(-0.5, y, 1.0, 0.05);
  L.rect(g, -0.55, -2.35, 0.06, 4.7, '#d8ccb0');
  L.rect(g, 0.49, -2.35, 0.06, 4.7, '#d8ccb0');
}
