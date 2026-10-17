// The balcony's railing: thin black bars between two rails, nothing more.
g.fillStyle = '#1b1d20';
g.fillRect(-1.2, -0.95, 2.4, 0.04);
g.fillRect(-1.2, -0.12, 2.4, 0.03);
for (let x = -1.18; x <= 1.2; x += 0.12) g.fillRect(x, -0.95, 0.016, 0.95);
