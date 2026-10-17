// The tower's crown, round as seen from anywhere: a short neck, the ribbed stone disc (amalaka), the pot and
// its finial.
const b = e.lib.plan.temple.tower[2][0];
g.fillStyle = '#c2ae8e';
g.fillRect(-b * 0.8, -0.3, b * 1.6, 0.3);
g.beginPath();
g.ellipse(0, -0.65, 1.15, 0.4, 0, 0, Math.PI * 2);
g.fill();
g.fillStyle = 'rgba(90,70,48,0.35)';
for (let k = -5; k <= 5; k++) g.fillRect(k * 0.2 * Math.sqrt(1 - (k / 6) ** 2) - 0.015, -0.98, 0.03, 0.66);
g.fillStyle = '#c2ae8e';
g.fillRect(-0.3, -1.15, 0.6, 0.15);
g.beginPath();
g.ellipse(0, -1.45, 0.38, 0.33, 0, 0, Math.PI * 2);
g.fill();
g.fillRect(-0.05, -2.5, 0.1, 0.8);
