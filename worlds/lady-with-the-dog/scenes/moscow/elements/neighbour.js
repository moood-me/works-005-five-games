// The neighbour's house (z 18.4…30): three floors, pale grey-green, the gateway arch to its yard cut through
const L = e.lib;
const P = L.PAINT;
const season = L.seasonOf(e.state.season);
P.facade(g, e, { ...P.FRONTS.neighbour, season });
// the arch's surround
g.strokeStyle = '#e6e8de';
g.lineWidth = 0.18;
g.beginPath();
g.moveTo(3.0, 0);
g.lineTo(3.0, -2.6);
g.quadraticCurveTo(3.6, -3.3, 4.2, -2.6);
g.lineTo(4.2, 0);
g.stroke();
