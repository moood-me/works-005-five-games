// The "Tankadere"'s two masts in her middle line, her bowsprit, the stays, the booms, and her masthead lamp (Hong Kong
// only). Her sails are tankadere_sails.
const L = e.lib;
if (L.portOf(e.state) === 'hongkong') {
  const B = L.plan.boat;
  const spar = '#4a3e32';
  g.strokeStyle = spar;
  g.lineCap = 'round';
  g.lineWidth = 0.13;
  for (const [x, top] of B.masts) {
    g.beginPath();
    g.moveTo(x, 0);
    g.lineTo(x - 0.3, -(top - B.deck));
    g.stroke();
  }
  g.beginPath();
  g.moveTo(8.6, -0.7);
  g.lineTo(12.4, -1.1);
  g.stroke();
  // the stays: bowsprit to the foremast's head, mast to mast
  g.lineWidth = 0.03;
  g.beginPath();
  g.moveTo(12.4, -1.1);
  g.lineTo(B.masts[1][0] - 0.3, -(B.masts[1][1] - B.deck) + 0.6);
  g.moveTo(B.masts[1][0] - 0.25, -(B.masts[1][1] - B.deck) + 1);
  g.lineTo(B.masts[0][0] - 0.25, -(B.masts[0][1] - B.deck) + 2.5);
  g.stroke();
  // the booms
  g.lineWidth = 0.1;
  for (const [[x], boom] of [[B.masts[0], 7.6], [B.masts[1], 5.6]]) {
    g.beginPath();
    g.moveTo(x, -1.2);
    g.lineTo(x - boom, -1.0);
    g.stroke();
  }
  L.lantern(e, g, B.masts[1][0] - 0.3, -(B.masts[1][1] - B.deck - 0.8), 0.16, '#fff4e0');
}
