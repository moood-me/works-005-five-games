// The hut's right end: its bamboo wall up into the gable under the ridge.
const H = e.lib.plan.hut;
g.fillStyle = '#a08a60';
g.beginPath();
g.moveTo(-H.d, 0);
g.lineTo(-H.d, -H.wall);
g.lineTo(0, -H.ridge);
g.lineTo(H.d, -H.wall);
g.lineTo(H.d, 0);
g.closePath();
g.fill();
g.fillStyle = 'rgba(60,45,30,0.35)';
for (let x = -H.d + 0.1; x < H.d; x += 0.22) g.fillRect(x, -H.wall - (H.ridge - H.wall) * (1 - Math.abs(x) / H.d), 0.03, H.wall + (H.ridge - H.wall) * (1 - Math.abs(x) / H.d));
