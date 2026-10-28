// The west wall (its x runs north, from the south wall): the door to the stair, an old coat on its hook, the dado.
// Painted once.
const G = e.lib.G, R = G.ROOM, D = G.DOOR;
g.fillStyle = '#cdc1aa'; g.fillRect(-0.05, -R.h - 0.05, R.z1 + 0.1, R.h + 0.07);
for (let i = 0; i < 40; i++) {
  const x = e.rnd() * R.z1, y = -R.h + e.rnd() * R.h, r = 0.05 + e.rnd() * 0.3;
  g.fillStyle = i % 3 ? 'rgba(90,70,50,0.05)' : 'rgba(255,245,225,0.05)';
  g.beginPath(); g.ellipse(x, y, r, r * 0.7, e.rnd() * 3, 0, Math.PI * 2); g.fill();
}
g.fillStyle = '#7b6a56'; g.fillRect(-0.05, -0.95, R.z1 + 0.1, 0.95);
g.fillStyle = '#4b3e31'; g.fillRect(-0.05, -0.12, R.z1 + 0.1, 0.12);
// the door: its frame, two panels, a latch
g.fillStyle = '#4a3828'; g.fillRect(D.z0 - 0.07, -D.top - 0.07, D.z1 - D.z0 + 0.14, D.top + 0.07);
g.fillStyle = '#6b5440'; g.fillRect(D.z0, -D.top, D.z1 - D.z0, D.top);
g.fillStyle = '#5b4634';
g.fillRect(D.z0 + 0.1, -D.top + 0.12, D.z1 - D.z0 - 0.2, 0.8);
g.fillRect(D.z0 + 0.1, -1.0, D.z1 - D.z0 - 0.2, 0.85);
g.fillStyle = '#8f7a52'; g.fillRect(D.z1 - 0.14, -1.05, 0.05, 0.1);
// a coat on a hook by the door
g.fillStyle = '#2e2a28';
g.beginPath(); g.moveTo(D.z0 - 0.3, -1.85); g.lineTo(D.z0 - 0.12, -1.8); g.lineTo(D.z0 - 0.06, -0.95); g.lineTo(D.z0 - 0.42, -0.95); g.closePath(); g.fill();
