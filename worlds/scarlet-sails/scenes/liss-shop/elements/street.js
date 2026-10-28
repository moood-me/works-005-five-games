// The street outside, seen from above (x across, y toward the eye; 30 m by 26 m round z 5): pale paving, joints, the
// gutter along the shop wall
g.fillStyle = "#d3c9b3";
g.fillRect(-15, -13, 30, 26);
g.fillStyle = "rgba(110,95,70,0.18)";
for (let y = -13; y < 13; y += 0.6) g.fillRect(-15, y, 30, 0.012);
g.fillStyle = "#bdb39d";
g.fillRect(-15, -13, 12.6, 26);
g.fillStyle = "rgba(110,95,70,0.25)";
g.fillRect(-2.4, -13, 0.05, 26);
