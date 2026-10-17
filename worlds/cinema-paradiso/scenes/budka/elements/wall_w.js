// The left wall (its x runs from the opposite wall toward the ports): the window on the square cut in it, its frame
// and cross-bar (the pane and what is seen in it are the element square_window); in 1988 a pane gone.
const L = e.lib, G = L.G, H = G.CEIL, [z0, z1, h0, h1] = G.WINDOW, ruin = e.state.era === 'ruin';
g.save(); g.beginPath(); g.rect(-0.1, -H - 0.1, 3.7, H + 0.15); g.rect(z0, -h1, z1 - z0, h1 - h0); g.clip('evenodd');
L.plaster(g, -0.1, -H - 0.1, 3.7, H + 0.15, ruin ? '#807668' : '#7c6852', 51, ruin);
g.fillStyle = '#3e3024'; g.fillRect(-0.1, -0.12, 3.7, 0.12);
g.restore();
g.fillStyle = ruin ? '#5a4c40' : '#4a3a2a';
g.fillRect(z0 - 0.05, -h1 - 0.05, z1 - z0 + 0.1, 0.05); g.fillRect(z0 - 0.05, -h0, z1 - z0 + 0.1, 0.06);
g.fillRect(z0 - 0.05, -h1 - 0.05, 0.05, h1 - h0 + 0.1); g.fillRect(z1, -h1 - 0.05, 0.05, h1 - h0 + 0.1);
g.fillRect((z0 + z1) / 2 - 0.015, -h1, 0.03, h1 - h0); g.fillRect(z0, -(h0 + h1) / 2 - 0.015, z1 - z0, 0.03);
g.fillStyle = '#5a4a3a'; g.fillRect(z0 - 0.08, -h0, z1 - z0 + 0.16, 0.035);   // the sill
// toward the ports (z 2.3…3.4, beyond the middle 4:3 of the shots that look at the projectors): a shelf of spare reels
// and cans, a notice VIETATO FUMARE, a fire extinguisher on its bracket, the cable of the lamp houses along the wall
g.fillStyle = ruin ? '#4e4438' : '#4a3424'; g.fillRect(2.35, -1.92, 1.0, 0.04);
if (!ruin) for (const [z, r] of [[2.55, 0.17], [2.92, 0.15]]) { g.fillStyle = '#4a4b50'; g.beginPath(); g.arc(z, -1.92 - r, r, 0, Math.PI * 2); g.fill(); g.fillStyle = '#26272b'; g.beginPath(); g.arc(z, -1.92 - r, r * 0.68, 0, Math.PI * 2); g.fill(); }
for (let k = 0; k < (ruin ? 1 : 4); k++) { g.fillStyle = k % 2 ? '#6a6a64' : '#7c7b74'; g.fillRect(3.1, -1.95 - 0.035 * k, 0.22, 0.03); }
g.fillStyle = ruin ? '#8a8276' : '#d8ccb0'; g.fillRect(2.45, -1.62, 0.42, 0.22);
g.fillStyle = '#7a2a22'; g.fillRect(2.47, -1.6, 0.38, 0.05);
g.save(); g.scale(0.01, 0.01); g.fillStyle = '#2a2420'; g.font = '700 3.6px sans-serif'; g.textAlign = 'center'; g.fillText('VIETATO FUMARE', 266, -147); g.restore();
g.fillStyle = ruin ? '#5a2a22' : '#9a2a22'; g.fillRect(3.05, -1.25, 0.14, 0.42); g.fillStyle = '#2a2420'; g.fillRect(3.07, -1.32, 0.1, 0.07); g.fillRect(3.02, -0.95, 0.2, 0.03);
g.strokeStyle = '#1e1c1a'; g.lineWidth = 0.014; g.beginPath(); g.moveTo(2.3, -2.3); g.lineTo(3.45, -2.3); g.stroke();
