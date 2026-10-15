// The shed's side: weathered boards, snow drifted against them; after the fire (`shed_burnt`) scorched, and with
// `shed_left` 0 burnt to black stumps of boards. Metres; 2 deep.
const burnt = e.state.shed_burnt ? (e.state.shed_left === 0 ? 2 : 1) : 0;
const top = burnt === 2 ? -1.5 : -2.4;
g.fillStyle = burnt === 2 ? '#1c1714' : burnt ? '#3a312b' : '#54493f';
if (burnt === 2) {
  g.beginPath();
  g.moveTo(-1.0, 0);
  for (let x = -1.0; x <= 1.0; x += 0.16) g.lineTo(x, top - e.rnd() * 0.7);
  g.lineTo(1.0, 0);
  g.closePath();
  g.fill();
} else g.fillRect(-1.0, top, 2.0, -top + 0.03);
g.strokeStyle = 'rgba(25,20,16,0.6)';
g.lineWidth = 0.025;
for (let x = -0.85; x < 1.0; x += 0.16) {
  g.beginPath();
  g.moveTo(x, top);
  g.lineTo(x, 0);
  g.stroke();
}
if (burnt === 1) {
  g.fillStyle = 'rgba(15,12,10,0.7)';
  g.fillRect(-1.0, -2.4, 2.0, 0.9);
}
e.kit.izby.drift(g, e, -1.1, 1.1, 0.35);
