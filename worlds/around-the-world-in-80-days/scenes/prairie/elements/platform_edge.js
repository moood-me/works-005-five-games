// The platform's front, half a metre of boards on posts, snow along its lip and drifted against its foot.
const { R } = e.lib;
R(g, -30.1, -0.5, 30.1, 0.02, '#6e5c46');
g.strokeStyle = '#5a4a38';
g.lineWidth = 0.02;
g.beginPath();
for (const y of [-0.34, -0.18]) { g.moveTo(-30.1, y); g.lineTo(30.1, y); }
g.stroke();
for (let x = -30; x <= 30; x += 2) R(g, x - 0.07, -0.5, x + 0.07, 0.02, '#4e3e2e');
R(g, -30.1, -0.56, 30.1, -0.48, '#eef2f6');
g.fillStyle = '#eef2f6';
for (let i = 0; i < 24; i++) {
  const x = -30 + e.anim.hash(i, 1) * 60;
  g.beginPath();
  g.ellipse(x, 0, 0.8 + 1.5 * e.anim.hash(i, 2), 0.12 + 0.12 * e.anim.hash(i, 3), 0, Math.PI, Math.PI * 2);
  g.fill();
}
