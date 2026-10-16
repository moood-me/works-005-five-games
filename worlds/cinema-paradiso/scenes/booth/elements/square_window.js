// What the window shows: only the sky of the hour (the world's sky, as a picture in the pane) — no square, no
// houses; in 1988 the glass broken, a shard left in a corner
const L = e.lib, [z0, z1, h0, h1] = L.G.WINDOW, S = e.state;
e.kit.sky.pane(g, z0, -h1, z1, -h0, S.hour, S.era === 'ruin' ? 'now' : S.era, e.anim);
if (S.era === 'ruin') { g.fillStyle = 'rgba(210,220,225,0.18)'; g.beginPath(); g.moveTo(z0, -h1); g.lineTo(z0 + 0.2, -h1); g.lineTo(z0, -h1 + 0.25); g.fill(); }
else { g.fillStyle = 'rgba(200,210,230,0.06)'; g.fillRect(z0, -h1, z1 - z0, h1 - h0); }
e.at((z0 + z1) / 2, -(h0 + h1) / 2);
