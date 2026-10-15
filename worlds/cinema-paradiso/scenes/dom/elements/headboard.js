// The bed's iron head against the north wall: two posts, bars, brass knobs. Painted once.
const w = e.lib.G.BED.x1 - e.lib.G.BED.x0;
g.fillStyle = '#2e2b29';
g.fillRect(-w / 2, -1.0, 0.035, 1.0); g.fillRect(w / 2 - 0.035, -1.0, 0.035, 1.0);
g.fillRect(-w / 2, -0.95, w, 0.03); g.fillRect(-w / 2, -0.6, w, 0.025);
for (let x = -w / 2 + 0.12; x < w / 2 - 0.05; x += 0.11) g.fillRect(x, -0.95, 0.014, 0.36);
g.fillStyle = '#a88a4a';
g.beginPath(); g.arc(-w / 2 + 0.017, -1.02, 0.025, 0, Math.PI * 2); g.arc(w / 2 - 0.017, -1.02, 0.025, 0, Math.PI * 2); g.fill();
