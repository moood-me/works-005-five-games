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
