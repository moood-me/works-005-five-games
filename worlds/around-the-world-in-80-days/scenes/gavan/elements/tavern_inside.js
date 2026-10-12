// The tavern's room, seen through its doors and windows: its back wall, shelves of jars; its lamp lights it and, through
// the doors, the terrace — and the room upstairs lit (the lights tavern, tavern_upstairs, as the lanterns are).
const L = e.lib;
const T = L.plan.tavern;
g.fillStyle = '#8a6e50';
g.fillRect(-T.half, -T.wall, 2 * T.half, T.wall);
g.fillStyle = '#4a3a2a';
g.fillRect(-T.half, -T.floor - 0.3, 2 * T.half, 0.3);
for (const x of [-5.5, -2.5, 2.5, 5.5]) {
  g.fillStyle = '#4a3828';
  g.fillRect(x - 0.9, -2.2, 1.8, 0.06);
  g.fillRect(x - 0.9, -1.5, 1.8, 0.06);
  for (let k = 0; k < 4; k++) {
    g.fillStyle = L.rgba(L.mixc('#6a5038', '#a07850', e.anim.hash(k + x * 3, 2)));
    g.beginPath();
    g.ellipse(x - 0.6 + k * 0.4, -2.38, 0.13, 0.17, 0, 0, Math.PI * 2);
    g.fill();
  }
}
e.light(0, -2.2, 0.9, '#ffc070', 0.9, 'lamp');
e.light(0, -5.0, 0.7, '#ffc070', 0.7, 'upstairs');
