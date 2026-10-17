// The taffrail across the stern behind the start, its inner face (x to port, seen from forward): slim
// posts, a middle rail, the caprail, as along the break
const c = e.lib.colours(e.state);
g.fillStyle = c.rail;
g.fillRect(-4.15, -1.05, 8.3, 0.07);
g.fillRect(-4.1, -0.52, 8.2, 0.035);
for (let x = -4.05; x <= 4.06; x += 0.45) g.fillRect(x - 0.025, -1, 0.05, 1);
