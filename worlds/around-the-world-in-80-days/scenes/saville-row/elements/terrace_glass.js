// The neighbours' panes (glass): dark rooms behind them, the lamps across the street faint in them.
const L = e.lib;
g.fillStyle = '#000000';
for (const h of L.houses) {
  if (h.fogg) continue;
  for (const [x, sill, w, hh] of [...L.windowsOf(h), L.fanOf(h)]) g.fillRect(x - L.plan.row - w / 2, -sill - hh, w, hh);
}
