// The mole's deck from above: honey limestone paving, lighter coping along both edges, a worn middle.
const P = e.lib, W = 3.5, D = 23;
P.paving(g, W, D, 7);
g.fillStyle = '#c6b493'; g.fillRect(-W, -D, 0.42, 2 * D); g.fillRect(W - 0.42, -D, 0.42, 2 * D);
g.fillStyle = 'rgba(70,58,44,0.12)'; g.fillRect(-1.3, -D, 2.6, 2 * D);
g.strokeStyle = '#3d3732'; g.lineWidth = 0.04;
for (const y of [-18, -8, 2, 12]) { g.beginPath(); g.arc(W - 0.21, y, 0.13, 0, Math.PI * 2); g.stroke(); g.beginPath(); g.arc(-W + 0.21, y + 5, 0.13, 0, Math.PI * 2); g.stroke(); }
