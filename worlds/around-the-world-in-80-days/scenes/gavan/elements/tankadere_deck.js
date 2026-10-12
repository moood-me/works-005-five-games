// The "Tankadere"'s deck (Hong Kong only), seen from above: planks fore and aft, a hatch, the cockpit by her tiller; her
// bow pointed, her transom square.
if (e.lib.portOf(e.state) === 'hongkong') {
  g.fillStyle = '#b4a084';
  g.beginPath();
  g.moveTo(-8.7, -2.1);
  g.lineTo(5.6, -2.1);
  g.quadraticCurveTo(8.2, -1.2, 8.7, 0);
  g.quadraticCurveTo(8.2, 1.2, 5.6, 2.1);
  g.lineTo(-8.7, 2.1);
  g.closePath();
  g.fill();
  g.fillStyle = 'rgba(40,30,20,0.25)';
  for (let y = -1.9; y < 2; y += 0.22) g.fillRect(-8.7, y, 14, 0.02);
  g.fillStyle = '#5a4a38';
  g.fillRect(-0.6, -0.7, 1.6, 1.4);
  g.fillRect(-7.6, -0.9, 2.2, 1.8);
}
