// The card table's top seen from above: green baize, a thin rim of dark wood. The lamp over it lights it. Fogg's
// cards, laid face down on the baize before his place when he makes his wager (`cards_down`).
const s = 0.5;
g.fillStyle = '#2c211b';
g.fillRect(-s - 0.04, -s - 0.04, 2 * s + 0.08, 2 * s + 0.08);
g.fillStyle = '#3f6e52';
g.fillRect(-s, -s, 2 * s, 2 * s);
if ((e.state.cards_down ?? 0) > 0.5) {
  g.fillStyle = '#e4ddcf';
  g.save();
  g.translate(0.03, -0.3);
  g.rotate(0.12);
  g.fillRect(-0.045, -0.065, 0.09, 0.13);
  g.restore();
}
