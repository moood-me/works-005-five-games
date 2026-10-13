// The poop deck seen from above (x to starboard, y back toward the stern; its middle 1.5 m ahead of
// the start): long planks fore and aft, their seams, the stern rounded behind the start
const c = e.lib.colours(e.state);
g.fillStyle = c.deck;
g.beginPath();
g.moveTo(-4.1, -4.5);
g.lineTo(4.1, -4.5);
g.lineTo(4.1, 3.2);
g.quadraticCurveTo(3.6, 4.5, 0, 4.5);
g.quadraticCurveTo(-3.6, 4.5, -4.1, 3.2);
g.closePath();
g.fill();
g.save();
g.clip();
g.fillStyle = c.seam;
for (let x = -4.1; x < 4.1; x += 0.15) g.fillRect(x, -4.5, 0.012, 9);
for (let i = 0; i < 30; i++) g.fillRect(-4.1 + 0.15 * Math.floor(e.anim.hash(i, 1) * 55), -4.5 + 9 * e.anim.hash(i, 2), 0.15, 0.012);
g.restore();
