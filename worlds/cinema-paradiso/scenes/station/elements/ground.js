// the dry ground round the station and past the platform's ends, from above
const now = e.state.era === 'now', an = e.anim;
g.fillStyle = now ? '#6a6458' : '#a89c80'; g.fillRect(-300, -32, 600, 64);
for (let i = 0; i < 200; i++) { g.fillStyle = i % 2 ? 'rgba(80,70,50,0.1)' : 'rgba(230,220,190,0.08)'; g.beginPath(); g.ellipse(-300 + an.hash(i, 1) * 600, -32 + an.hash(i, 2) * 64, 2 + an.hash(i, 3) * 6, 0.8 + an.hash(i, 4) * 2, 0, 0, Math.PI * 2); g.fill(); }
