// The bench's seat seen from above: three weathered boards, 2.1 × 0.42 m (y toward the viewer).
g.fillStyle = '#a39279';
g.fillRect(-1.05, -0.21, 2.1, 0.42);
g.strokeStyle = '#7d6e5a'; g.lineWidth = 0.012;
for (const y of [-0.07, 0.07]) { g.beginPath(); g.moveTo(-1.05, y); g.lineTo(1.05, y); g.stroke(); }
g.fillStyle = '#b3a38a';
for (let i = 0; i < 30; i++) { const x = -1 + e.rnd() * 2, y = -0.2 + e.rnd() * 0.4; g.fillRect(x, y, 0.08 + e.rnd() * 0.2, 0.006); }
