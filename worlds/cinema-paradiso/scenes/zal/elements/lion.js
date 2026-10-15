// The stone lion's head on the back wall (seen from the hall; symmetric): a mane of heavy locks round a broad face,
// the mouth open — the booth's port; the beam comes out of it, its glass glowing while the beam is on (animate).
// 1988: the stone dirty, a lock broken off, the mouth black.
const ruin = e.state.era === 'ruin', an = e.anim;
const stone = ruin ? '#8a8276' : '#b69a6e', dark = ruin ? '#5e5850' : '#7c6442', light = ruin ? '#9e968a' : '#cdb388';
for (let ring = 0; ring < 2; ring++) for (let i = 0; i < 18; i++) {
  if (ruin && ring === 0 && i === 5) continue;
  const a = i / 18 * Math.PI * 2 + ring * 0.17, r = ring ? 0.62 : 0.8;
  const x = Math.cos(a) * r, y = -1.3 + Math.sin(a) * r * 0.95;
  g.fillStyle = ring ? stone : dark;
  g.beginPath(); g.ellipse(x, y, 0.22, 0.13, a + Math.PI / 2, 0, Math.PI * 2); g.fill();
  g.fillStyle = 'rgba(40,30,20,0.25)'; g.beginPath(); g.ellipse(x * 1.04, y + 0.02, 0.06, 0.12, a + Math.PI / 2, 0, Math.PI * 2); g.fill();
}
g.fillStyle = stone; g.beginPath(); g.ellipse(0, -1.3, 0.52, 0.6, 0, 0, Math.PI * 2); g.fill();
g.fillStyle = light; g.beginPath(); g.ellipse(0, -1.52, 0.2, 0.32, 0, 0, Math.PI * 2); g.fill();
g.fillStyle = dark;
g.beginPath(); g.ellipse(-0.2, -1.6, 0.1, 0.05, 0.3, 0, Math.PI * 2); g.fill();
g.beginPath(); g.ellipse(0.2, -1.6, 0.1, 0.05, -0.3, 0, Math.PI * 2); g.fill();
g.fillStyle = light; g.beginPath(); g.ellipse(-0.14, -1.06, 0.17, 0.1, 0, 0, Math.PI * 2); g.fill(); g.beginPath(); g.ellipse(0.14, -1.06, 0.17, 0.1, 0, 0, Math.PI * 2); g.fill();
g.fillStyle = '#1a1310'; g.beginPath(); g.ellipse(0, -0.9, 0.2, 0.15, 0, 0, Math.PI * 2); g.fill();
if (!ruin) { g.fillStyle = '#4a3a22'; g.beginPath(); g.ellipse(0, -0.9, 0.11, 0.08, 0, 0, Math.PI * 2); g.fill(); }
g.fillStyle = stone; for (const x of [-0.12, 0.12]) { g.beginPath(); g.moveTo(x - 0.03, -1.02); g.lineTo(x + 0.03, -1.02); g.lineTo(x, -0.92); g.fill(); }
if (ruin) for (let i = 0; i < 20; i++) { g.fillStyle = 'rgba(40,36,30,0.3)'; g.beginPath(); g.arc((an.hash(i, 2) - 0.5) * 1.6, -2.1 + an.hash(i, 3) * 1.6, 0.04 + an.hash(i, 4) * 0.08, 0, Math.PI * 2); g.fill(); }
e.light(0, -0.9, 0.16, '#ffd9a0', 1.4, 'mouth');
e.at(0, -1.2);
e.at(0, -0.9, 'mouth');
