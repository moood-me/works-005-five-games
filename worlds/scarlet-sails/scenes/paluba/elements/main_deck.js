// The main deck seen from above (x to starboard, y back toward the stern; its middle 19 m ahead):
// from the poop's break to the bow, full width to the foremast and narrowing to the stem; planks
// fore and aft, the waterways along the sides
const c = e.lib.colours(e.state);
g.fillStyle = c.deck;
g.beginPath();
g.moveTo(-4.3, 13);
g.lineTo(4.3, 13);
g.lineTo(4.3, 1);
g.bezierCurveTo(4.2, -6, 2.4, -11, 0, -13);
g.bezierCurveTo(-2.4, -11, -4.2, -6, -4.3, 1);
g.closePath();
g.fill();
g.save();
g.clip();
g.fillStyle = c.seam;
for (let x = -4.3; x < 4.3; x += 0.15) g.fillRect(x, -13, 0.014, 26);
g.globalAlpha = 0.35;
g.fillRect(-4.3, -13, 0.35, 26);
g.fillRect(3.95, -13, 0.35, 26);
g.restore();
