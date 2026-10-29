// The baker's shop (z 11…17): two floors, grey-blue; the shop window below (its glow — `shop_glow`), its door (a hole),
// the signboard — a gilt kalach, no words
const L = e.lib;
const P = L.PAINT;
const season = L.seasonOf(e.state.season);
P.facade(g, e, { ...P.FRONTS.shop, season });
P.fillRect(g, '#3c4652', -1.8, -2.6, 0.8, -0.5);
g.strokeStyle = '#e3e4e0';
g.lineWidth = 0.08;
g.strokeRect(-1.8, -2.6, 2.6, 2.1);
g.lineWidth = 0.05;
g.beginPath();
g.moveTo(-0.5, -2.6);
g.lineTo(-0.5, -0.5);
g.stroke();
P.fillRect(g, '#e3e4e0', 1.1, -2.45, 2.1, -2.3);
// the signboard
P.fillRect(g, '#4b5560', -2.4, -3.6, 2.4, -2.9);
g.strokeStyle = '#c9b27a';
g.lineWidth = 0.07;
g.beginPath();
g.ellipse(0, -3.25, 0.32, 0.2, 0, 0, Math.PI * 2);
g.stroke();
g.beginPath();
g.arc(0, -3.45, 0.1, 0, Math.PI);
g.stroke();
P.snowLedge(g, season, -2.4, 2.4, -3.6, 0.1, () => e.rnd());
