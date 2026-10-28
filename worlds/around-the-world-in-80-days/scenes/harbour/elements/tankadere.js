// The pilot boat "Tankadere", No. 43 (Hong Kong only): her side toward us from her transom to where she narrows to her
// bow — dark green, a pale boot-top at the water, a gold line along her sheer rising to the bow.
const L = e.lib;
if (L.portOf(e.state) === 'hongkong') {
  const B = L.plan.boat;
  const top = x => -B.deck - 0.4 - 0.25 * ((x + 1.5) / 7.5) ** 2;
  g.fillStyle = '#28362e';
  g.beginPath();
  g.moveTo(-9, 0.3);
  for (let x = -9; x <= 6; x += 0.5) g.lineTo(x, top(x));
  g.lineTo(6, 0.3);
  g.closePath();
  g.fill();
  g.fillStyle = '#c8c2b0';
  g.fillRect(-9, -0.35, 15, 0.4);
  g.strokeStyle = '#c8a050';
  g.lineWidth = 0.07;
  g.beginPath();
  for (let x = -9; x <= 6; x += 0.5) g.lineTo(x, top(x) + 0.12);
  g.stroke();
  e.at(-1, top(-1) - 1);
}
