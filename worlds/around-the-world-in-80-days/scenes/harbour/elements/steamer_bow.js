// The steamer's starboard bow, from where her side runs straight to her stem (x toward it): her rail rising on, her stem
// raked forward over the water — a clipper's bow.
const L = e.lib;
const top = x => -L.sheer(30 + 0.8 * x) - 0.15 * (x / 7.5) ** 2;
g.fillStyle = '#1e2024';
g.beginPath();
g.moveTo(0, 0.4);
for (let x = 0; x <= 7.5; x += 0.5) g.lineTo(x, top(x));
g.quadraticCurveTo(7.0, -2.2, 5.2, 0.4);
g.closePath();
g.fill();
g.fillStyle = '#8a3428';
g.fillRect(0, -0.5, 5.4, 0.6);
g.strokeStyle = L.portOf(e.state) === 'yokohama' ? '#e4e0d6' : '#b8a888';
g.lineWidth = 0.3;
g.beginPath();
for (let x = 0; x <= 7.3; x += 0.5) g.lineTo(x, top(x) + 0.35);
g.stroke();
