// The ramp down from the quay's edge to the pontoon (a plane along its slope, seen from above): slats across.
const half = 1.193; // half the slope's length
g.fillStyle = '#7a6a56';
g.fillRect(-1.2, -half, 2.4, 2 * half);
g.fillStyle = 'rgba(30,22,14,0.35)';
for (let y = -half + 0.2; y < half; y += 0.3) g.fillRect(-1.2, y, 2.4, 0.05);
