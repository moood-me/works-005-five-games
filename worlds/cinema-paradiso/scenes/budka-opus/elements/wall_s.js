
// The south wall (facing north; its x runs to the world's left): a shelf of film cans, a poster of an old film, a
// coat on a nail, the switchboard.
const P = e.lib, G = P.G, H = G.CEIL;
P.plaster(g, -2.05, -H - 0.05, 4.1, H + 0.05, '#76624c', 33);
g.fillStyle = '#3e3024'; g.fillRect(-2.05, -0.12, 4.1, 0.12);
P.cans(g, -1.6, -1.8, 1.5, 3);
g.fillStyle = '#8a7a5c'; g.fillRect(0.4, -1.95, 0.55, 0.78);                    // the poster: a couple in silhouette
g.fillStyle = '#3a2a22'; g.beginPath(); g.ellipse(0.6, -1.6, 0.06, 0.08, 0, 0, Math.PI * 2); g.ellipse(0.73, -1.62, 0.06, 0.08, 0, 0, Math.PI * 2); g.fill();
g.fillRect(0.5, -1.52, 0.33, 0.3);
g.save(); g.scale(0.01, 0.01); g.fillStyle = '#7a2a22'; g.font = '700 7px serif'; g.textAlign = 'center'; g.fillText('CATENE', 67.5, -182); g.restore();
g.fillStyle = '#2e2a26'; g.fillRect(1.3, -1.7, 0.36, 0.5);                       // the switchboard
g.fillStyle = '#b8b0a0'; for (let k = 0; k < 3; k++) g.fillRect(1.36 + k * 0.1, -1.6, 0.04, 0.1);
