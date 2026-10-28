// The club's steps up to its doorway (a plane along their slope, seen from above): six wide steps of stone.
const half = 0.933; // half the slope's length
g.fillStyle = '#b9b4a8';
g.fillRect(-4.5, -half, 9, 2 * half);
g.fillStyle = 'rgba(30,28,24,0.3)';
for (let k = 0; k < 6; k++) g.fillRect(-4.5, -half + k * (half / 3) + 0.2, 9, 0.1);
