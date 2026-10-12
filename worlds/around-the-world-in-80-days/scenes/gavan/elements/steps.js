// The stone steps down from the quay's edge to the water (a plane along their slope, seen from above): where the boatmen
// wait (steps#steps).
const half = 1.7; // half the slope's length
g.fillStyle = '#86837b';
g.fillRect(-1.3, -half, 2.6, 2 * half);
g.fillStyle = 'rgba(20,24,24,0.35)';
for (let k = 0; k < 9; k++) g.fillRect(-1.3, -half + k * ((2 * half) / 9) + 0.22, 2.6, 0.12);
e.at(0, half - 0.4, 'steps');
