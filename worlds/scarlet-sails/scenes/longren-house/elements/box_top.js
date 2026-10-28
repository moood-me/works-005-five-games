// The box's open top seen from above (y toward the room): the boards' edges round the dark inside,
// the ends of the offcuts in it
g.fillStyle = "#7d7b75";
g.fillRect(-0.26, -0.2, 0.52, 0.4);
g.fillStyle = "#3e3c39";
g.fillRect(-0.24, -0.18, 0.48, 0.36);
g.fillStyle = "#b0a99c";
for (const [x, y] of [[-0.15, -0.05], [-0.05, 0.08], [0.06, -0.1], [0.14, 0.05], [0.0, -0.01]]) g.fillRect(x - 0.02, y - 0.02, 0.04, 0.04);
