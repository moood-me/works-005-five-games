// The ceiling seen from below (the card faces down: x across, y from the screen wall back toward the start):
// coffered plaster with a rose in the middle; 1988 — grey, a hole torn through it over the left rows (its light falls on the aisle at row 5), broken laths
// at its edge: through it, the evening sky.
const P = e.lib, G = P.G, ruin = e.state.era === 'ruin', an = e.anim, L = G.FRONT_Z - G.BACK_Z;
const zy = z => -(G.FRONT_Z - z);
const hole = [[-4.1, zy(5.9)], [-3.2, zy(5.6)], [-1.9, zy(6.1)], [-1.4, zy(7.4)], [-1.8, zy(8.7)], [-3.0, zy(9.0)], [-4.3, zy(8.2)]];
g.save();
g.beginPath(); g.rect(-6.6, -L - 0.05, 13.2, L + 0.1);
if (ruin) { g.moveTo(hole[0][0], hole[0][1]); for (const p of hole.slice(1)) g.lineTo(p[0], p[1]); g.closePath(); }
g.clip('evenodd');
g.fillStyle = ruin ? '#77726a' : '#4e4032'; g.fillRect(-6.6, -L - 0.05, 13.2, L + 0.1);
for (let y = -L + 0.6; y < -0.4; y += 2.4) for (let x = -5.6; x < 5.6; x += 2.4) {
  g.fillStyle = ruin ? '#6a665f' : '#43372b'; g.fillRect(x, y, 2.1, 2.1);
  g.fillStyle = ruin ? '#827d74' : '#56473a'; g.fillRect(x + 0.18, y + 0.18, 1.74, 1.74);
}
g.fillStyle = ruin ? '#8a857c' : '#5e4e3c'; g.beginPath(); g.arc(0, zy(9), 1.1, 0, Math.PI * 2); g.fill();
g.fillStyle = ruin ? '#77726a' : '#4e4032'; g.beginPath(); g.arc(0, zy(9), 0.7, 0, Math.PI * 2); g.fill();
if (ruin) for (let i = 0; i < 60; i++) { g.fillStyle = 'rgba(50,46,42,0.25)'; g.beginPath(); g.arc(-6 + an.hash(i, 3) * 12, -L + an.hash(i, 4) * L, 0.2 + an.hash(i, 5) * 0.8, 0, Math.PI * 2); g.fill(); }
g.restore();
if (ruin) {
  g.strokeStyle = '#3e3328'; g.lineWidth = 0.05;
  for (let i = 0; i < 9; i++) { const y = zy(5.9) + i * 0.38; g.beginPath(); g.moveTo(-4.5, y); g.lineTo(-4.5 + 0.6 + an.hash(i, 6) * 1.4, y + (an.hash(i, 7) - 0.5) * 0.3); g.stroke(); }
  g.fillStyle = '#4a3c30'; g.fillRect(-3.0, zy(9.1), 0.14, 3.6);
}
