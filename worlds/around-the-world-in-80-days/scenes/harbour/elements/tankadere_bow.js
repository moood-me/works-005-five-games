// The "Tankadere"'s starboard bow, narrowing to her stem (x toward it), her sheer rising on.
const L = e.lib;
if (L.portOf(e.state) === 'hongkong') {
  const B = L.plan.boat;
  const top = x => -B.deck - 0.4 - 0.25 * ((6 + 0.8 * x + 1.5) / 7.5) ** 2;
  g.fillStyle = '#28362e';
  g.beginPath();
  g.moveTo(0, 0.3);
  for (let x = 0; x <= 3.72; x += 0.3) g.lineTo(x, top(x));
  g.quadraticCurveTo(3.5, -1.0, 2.6, 0.3);
  g.closePath();
  g.fill();
  g.fillStyle = '#c8c2b0';
  g.fillRect(0, -0.35, 2.7, 0.4);
}
