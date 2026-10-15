// Toto's bed along the east wall, seen from its long side (its x runs south: the head at the left): an iron frame,
// the mattress, a grey blanket hanging over. Its top is bed_top. Painted once.
const B = e.lib.G.BED, L = (B.z1 - B.z0) / 2, h = B.top;
g.fillStyle = '#2e2b29';
g.fillRect(-L, -0.9, 0.04, 0.9); g.fillRect(L - 0.04, -0.7, 0.04, 0.7);
g.fillRect(-L, -0.32, 2 * L, 0.035);
g.fillStyle = '#6e6a66'; g.fillRect(-L + 0.04, -h, 2 * L - 0.08, 0.16);
g.fillStyle = '#5a5e66';
g.beginPath(); g.moveTo(-L + 0.35, -h - 0.02); g.lineTo(L - 0.06, -h - 0.02); g.lineTo(L - 0.05, -0.12); g.lineTo(-L + 0.38, -0.14); g.closePath(); g.fill();
g.fillStyle = 'rgba(30,30,40,0.35)'; for (let x = -L + 0.5; x < L; x += 0.3) g.fillRect(x, -h, 0.012, h - 0.14);
