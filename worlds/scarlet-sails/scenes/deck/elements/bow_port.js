// The port bulwark forward, closing in to the stem (x forward, from the foremast's
// beam): its inner face rising toward the bow, stanchions, the caprail
const c = e.lib.colours(e.state);
const top = (x) => -1.1 - 0.55 * Math.pow((x + 7.3) / 14.6, 2);
g.fillStyle = c.bulwark;
g.beginPath();
g.moveTo(-7.3, 0);
for (let x = -7.3; x <= 7.31; x += 0.5) g.lineTo(x, top(x));
g.lineTo(7.3, 0);
g.closePath();
g.fill();
g.fillStyle = "rgba(40,36,30,0.12)";
for (let x = -6.7; x < 7.3; x += 1.2) g.fillRect(x, top(x), 0.09, -top(x));
g.strokeStyle = c.rail;
g.lineWidth = 0.12;
g.beginPath();
for (let x = -7.3; x <= 7.31; x += 0.5) g.lineTo(x, top(x) - 0.04);
g.stroke();
