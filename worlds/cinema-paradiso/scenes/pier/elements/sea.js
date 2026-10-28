// The sea, a mirror under a breeze (seen from above: x across, y toward the viewer; the near edge, y 700, at the quay).
// Dark blue-green; long swell strokes near, finer far; the moon's path and every light are the mirror's.
const an = e.anim;
g.fillStyle = '#1e3350'; g.fillRect(-1500, -700, 3000, 1400);
const far = g.createLinearGradient(0, -700, 0, 300);
far.addColorStop(0, 'rgba(40,62,96,0.6)'); far.addColorStop(1, 'rgba(40,62,96,0)');
g.fillStyle = far; g.fillRect(-1500, -700, 3000, 1000);
g.lineCap = 'round';
for (let i = 0; i < 600; i++) {
  const y = 700 - Math.pow(an.hash(i, 3), 2.4) * 900, near = (y + 200) / 900;
  const x = (an.hash(i, 4) - 0.5) * (80 + (1 - near) * 600), len = 1.5 + near * 9 + an.hash(i, 5) * 4;
  g.strokeStyle = i % 3 ? 'rgba(74,104,140,0.35)' : 'rgba(14,24,40,0.45)';
  g.lineWidth = 0.05 + near * 0.12;
  g.beginPath(); g.moveTo(x, y); g.lineTo(x + len, y + (an.hash(i, 6) - 0.5) * 0.2); g.stroke();
}
