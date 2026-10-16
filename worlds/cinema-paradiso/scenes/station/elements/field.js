
// the stubble field and the dry ground north of the track, from above
const now = e.state.era === 'now', an = e.anim;
g.fillStyle = now ? '#5a5650' : '#a49a78'; g.fillRect(-200, -26, 400, 52);
for (let i = 0; i < 260; i++) { g.fillStyle = i % 2 ? 'rgba(80,70,50,0.12)' : 'rgba(220,210,170,0.1)'; g.beginPath(); g.ellipse(-200 + an.hash(i, 1) * 400, -26 + an.hash(i, 2) * 52, 2 + an.hash(i, 3) * 6, 0.6 + an.hash(i, 4) * 1.5, 0, 0, Math.PI * 2); g.fill(); }
