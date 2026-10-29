// The hall seen through the Gurovs' door: a papered wall, the stair's first steps, a coat stand, the hall lamp (its light
// — `hall`, by `door`: lit as the door opens)
g.fillStyle = '#cbb48e';
g.fillRect(-1.2, -3.0, 2.4, 3.0);
g.fillStyle = 'rgba(110,86,60,0.16)';
for (let x = -1.15; x < 1.2; x += 0.2) g.fillRect(x, -3.0, 0.05, 3.0);
g.fillStyle = '#6a5440';
for (let k = 0; k < 5; k++) g.fillRect(-1.2 + k * 0.18, -0.2 - k * 0.2, 0.7, 0.2);
g.fillStyle = '#3a3330';
g.fillRect(0.55, -1.9, 0.05, 1.9);
g.beginPath();
g.ellipse(0.58, -1.55, 0.18, 0.35, 0, 0, Math.PI * 2);
g.fill();
g.fillStyle = '#e9d7ae';
g.beginPath();
g.arc(0.0, -2.55, 0.11, 0, Math.PI * 2);
g.fill();
e.light(0.0, -2.55, 0.14, '#ffd49a', 1, 'lamp');
