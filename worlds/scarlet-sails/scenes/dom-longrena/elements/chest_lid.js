// The sea chest's lid seen from above (x along it, y toward the room): its boards and the iron bands
// over them (not painted when the chest is not in the house: `chest_here` 0)
if (!(e.state.chest_here > 0.5)) return;
g.fillStyle = "#67625b";
g.fillRect(-0.52, -0.17, 1.04, 0.34);
g.fillStyle = "rgba(60,56,52,0.35)";
for (const y of [-0.06, 0.06]) g.fillRect(-0.52, y, 1.04, 0.008);
g.fillStyle = "#282523";
for (const bx of [-0.36, 0.33]) g.fillRect(bx, -0.17, 0.035, 0.34);
