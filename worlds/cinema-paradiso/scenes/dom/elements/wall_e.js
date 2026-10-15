// The east wall (its x runs south, from the north wall): in Toto's corner over the bed — a film poster pinned up, a
// postcard of a film star. Painted once.
const G = e.lib.G, R = G.ROOM;
g.fillStyle = '#cbbfa8'; g.fillRect(-0.05, -R.h - 0.05, R.z1 + 0.1, R.h + 0.07);
for (let i = 0; i < 40; i++) {
  const x = e.rnd() * R.z1, y = -R.h + e.rnd() * R.h, r = 0.05 + e.rnd() * 0.3;
  g.fillStyle = i % 3 ? 'rgba(90,70,50,0.05)' : 'rgba(255,245,225,0.05)';
  g.beginPath(); g.ellipse(x, y, r, r * 0.7, e.rnd() * 3, 0, Math.PI * 2); g.fill();
}
g.fillStyle = '#7b6a56'; g.fillRect(-0.05, -0.95, R.z1 + 0.1, 0.95);
g.fillStyle = '#4b3e31'; g.fillRect(-0.05, -0.12, R.z1 + 0.1, 0.12);
// the poster (0.45…0.95 m from the north wall: over the bed's head), its corners curling
const px = 0.45, py = -2.35;
g.fillStyle = '#d8c9a4'; g.fillRect(px, py, 0.5, 0.7);
g.fillStyle = '#7a2e24'; g.fillRect(px + 0.03, py + 0.03, 0.44, 0.12);
g.fillStyle = '#2a2420';
g.beginPath(); g.ellipse(px + 0.17, py + 0.38, 0.06, 0.08, 0, 0, Math.PI * 2); g.fill();
g.beginPath(); g.ellipse(px + 0.31, py + 0.36, 0.06, 0.08, 0, 0, Math.PI * 2); g.fill();
g.fillRect(px + 0.1, py + 0.45, 0.3, 0.2);
g.fillStyle = '#efe6cf';
for (let i = 0; i < 4; i++) g.fillRect(px + 0.07, py + 0.05 + i * 0.022, 0.36, 0.008);
// a postcard
g.fillStyle = '#e4dccb'; g.fillRect(1.2, -2.0, 0.16, 0.22);
g.fillStyle = '#5a4a40'; g.beginPath(); g.ellipse(1.28, -1.9, 0.04, 0.05, 0, 0, Math.PI * 2); g.fill();
