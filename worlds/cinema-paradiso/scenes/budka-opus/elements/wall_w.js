
// The west wall (x from the south wall north): the window on the square — an opening; its frame is drawn here —
// the boy's chalk marks low by the corner, nails with film strips hanging.
const P = e.lib, G = P.G, H = G.CEIL, z0 = G.S;
const [wa, wb, wl, wh] = G.WINDOW, x0 = wa - z0, x1 = wb - z0;
g.save(); g.beginPath(); g.rect(-0.05, -H - 0.05, 3.6, H + 0.05); g.rect(x0, -wh, x1 - x0, wh - wl); g.clip('evenodd');
P.plaster(g, -0.05, -H - 0.05, 3.6, H + 0.05, '#7a6650', 35);
g.fillStyle = '#3e3024'; g.fillRect(-0.05, -0.12, 3.6, 0.12);
g.restore();
g.strokeStyle = '#3a2c20'; g.lineWidth = 0.05; g.strokeRect(x0 - 0.02, -wh - 0.02, x1 - x0 + 0.04, wh - wl + 0.04);
g.lineWidth = 0.025; g.beginPath(); g.moveTo((x0 + x1) / 2, -wh); g.lineTo((x0 + x1) / 2, -wl); g.moveTo(x0, -(wl + wh) / 2); g.lineTo(x1, -(wl + wh) / 2); g.stroke();
g.fillStyle = '#4a3a2a'; g.fillRect(x0 - 0.06, -wl, x1 - x0 + 0.12, 0.05);      // the sill
g.strokeStyle = 'rgba(230,226,215,0.5)'; g.lineWidth = 0.008;                     // chalk ticks by the corner
for (let k = 0; k < 9; k++) { g.beginPath(); g.moveTo(3.2 - k * 0.03, -0.62); g.lineTo(3.2 - k * 0.03, -0.52); g.stroke(); }
g.strokeStyle = '#2a2622'; g.lineWidth = 0.012;                                   // film strips on nails
for (const x of [2.3, 2.42, 2.6]) { g.beginPath(); g.moveTo(x, -2.0); g.quadraticCurveTo(x + 0.04, -1.6, x - 0.02, -1.3); g.stroke(); }
