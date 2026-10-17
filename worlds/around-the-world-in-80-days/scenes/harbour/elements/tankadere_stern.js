// The "Tankadere"'s transom, flat across her stern.
const L = e.lib;
if (L.portOf(e.state) === 'hongkong') {
  const B = L.plan.boat;
  g.fillStyle = '#223028';
  g.fillRect(-B.beam, -B.deck - 0.3, 2 * B.beam, B.deck + 0.3);
  g.fillStyle = '#c8c2b0';
  g.fillRect(-B.beam, -0.35, 2 * B.beam, 0.4);
}
