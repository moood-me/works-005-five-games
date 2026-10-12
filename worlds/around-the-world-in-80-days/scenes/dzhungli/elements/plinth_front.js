// The temple's plinth, its front: dressed stone, steps up its middle to the porch.
const [w, , h] = e.lib.plan.temple.plinth;
e.lib.stone(g, -w, w, -h, 0.4);
g.fillStyle = 'rgba(90,70,48,0.35)';
for (let k = 1; k < 4; k++) g.fillRect(-0.9, -h * k / 4, 1.8, 0.05);
g.fillRect(-0.95, -h, 0.05, h);
g.fillRect(0.9, -h, 0.05, h);
