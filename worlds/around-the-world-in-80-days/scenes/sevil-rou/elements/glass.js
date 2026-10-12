// The panes of Fogg's windows and fanlight (glass): at night, where a room is dark, the street's lamps are
// seen in them, faintly.
const L = e.lib;
const h = L.houses.find(o => o.fogg);
g.fillStyle = '#000000';
for (const [x, sill, w, hh] of [...L.windowsOf(h), L.fanOf(h)]) g.fillRect(x - L.plan.house.across - w / 2, -sill - hh, w, hh);
