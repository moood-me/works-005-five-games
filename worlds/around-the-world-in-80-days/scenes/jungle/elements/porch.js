// The temple's porch, its front: two square pillars carrying a stone beam and the edge of its flat roof.
const [w, , h] = e.lib.plan.temple.porch;
g.fillStyle = '#c2ae8e';
for (const x of [-w + 0.35, w - 0.35]) g.fillRect(x - 0.16, -h + 0.4, 0.32, h - 0.4);
g.fillRect(-w, -h, 2 * w, 0.4);
g.fillStyle = 'rgba(90,70,48,0.35)';
g.fillRect(-w, -h + 0.18, 2 * w, 0.04);
