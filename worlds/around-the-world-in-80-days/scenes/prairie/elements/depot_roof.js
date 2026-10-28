// The station roof's front slope (the plane's metres, up the slope toward the ridge −y): grey shingles in rows under
// snow, thicker toward the ridge, a dark eave.
const { R } = e.lib;
R(g, -5.9, -1.8, 5.9, 1.8, '#6a645c');
g.strokeStyle = '#57514a';
g.lineWidth = 0.03;
g.beginPath();
for (let y = -1.7; y < 1.8; y += 0.25) { g.moveTo(-5.9, y); g.lineTo(5.9, y); }
g.stroke();
g.fillStyle = '#eef2f6';
g.beginPath();
g.moveTo(-5.9, -1.8);
g.lineTo(5.9, -1.8);
for (let x = 5.9; x >= -5.9; x -= 0.5) g.lineTo(x, 0.4 + 0.5 * Math.sin(x * 1.7) + 0.3 * e.anim.hash(Math.round(x * 2), 4));
g.closePath();
g.fill();
R(g, -5.9, 1.62, 5.9, 1.8, '#4a3a2a');
