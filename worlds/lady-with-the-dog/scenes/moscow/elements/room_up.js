// The room behind the window upstairs: papered wall, a picture, the table lamp under its shade (its light — `room`, by
// `window_up`)
g.fillStyle = '#c9b89a';
g.fillRect(-1.2, -2.8, 2.4, 2.8);
g.fillStyle = 'rgba(120,96,70,0.18)';
for (let x = -1.15; x < 1.2; x += 0.22) g.fillRect(x, -2.8, 0.05, 2.8);
g.fillStyle = '#6e5a46';
g.fillRect(-0.7, -2.1, 0.5, 0.4);
g.fillStyle = '#a99a80';
g.fillRect(-0.66, -2.06, 0.42, 0.32);
g.fillStyle = '#7a6550';
g.fillRect(-0.1, -0.78, 0.9, 0.06);
g.fillStyle = '#e7d5ae';
g.beginPath();
g.moveTo(0.25, -1.25);
g.lineTo(0.45, -1.25);
g.lineTo(0.52, -1.08);
g.lineTo(0.18, -1.08);
g.closePath();
g.fill();
e.light(0.35, -1.12, 0.12, '#ffd49a', 1, 'lamp');
