// The pavement the viewer stands on, seen from above: flagstones to the kerb (painted where it is painted now: e.area).
const ax = 5; // the plane's across
const [l, , r] = e.area;
g.fillStyle = '#85847f';
g.fillRect(l, -1.8, r - l, 3.6);
g.fillStyle = 'rgba(30,30,30,0.3)';
for (let a = Math.floor((l + ax) / 0.9) * 0.9; a < r + ax; a += 0.9) g.fillRect(a - ax, -1.8, 0.025, 3.6);
for (const y of [-1.05, -0.3, 0.45, 1.2]) g.fillRect(l, y, r - l, 0.025);
g.fillStyle = 'rgba(200,198,190,0.35)';
g.fillRect(l, -1.8, r - l, 0.3);
