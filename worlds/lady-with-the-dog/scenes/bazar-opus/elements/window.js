// The tall window's frame: white sashes and glazing bars over the opening (the evening is the sky's); its middle is
// a point (an offer in «Советоваться»). Metres, origin at the window's middle across, on the floor.
const L = e.lib, Wn = L.WIN, w = (Wn.x1 - Wn.x0) / 2;
g.fillStyle = '#e4dfd4';
g.fillRect(-w - 0.05, -Wn.top - 0.05, 2 * w + 0.1, 0.08);
g.fillRect(-w - 0.05, -Wn.top, 0.08, Wn.top - Wn.sill);
g.fillRect(w - 0.03, -Wn.top, 0.08, Wn.top - Wn.sill);
g.fillRect(-0.03, -Wn.top, 0.06, Wn.top - Wn.sill);
g.fillRect(-w, -2.15, 2 * w, 0.06);
g.fillRect(-w, -1.3, 2 * w, 0.05);
for (const x of [-w / 2, w / 2]) g.fillRect(x - 0.015, -Wn.top, 0.03, Wn.top - Wn.sill);
g.fillStyle = 'rgba(210,220,235,0.06)'; g.fillRect(-w, -Wn.top, 2 * w, Wn.top - Wn.sill);
e.at(0.35, -1.75);
