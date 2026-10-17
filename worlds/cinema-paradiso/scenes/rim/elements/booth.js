// The booth behind the back wall, round the camera: plastered walls, shelves of film cans, a wiring board — seen
// at the frame's sides at 21:9, in the projector lamp's warm light
const an = e.anim;
g.fillStyle = '#4a3e34'; g.fillRect(-1.6, -3.2, 3.2, 3.2);
g.fillStyle = '#3a3029'; g.fillRect(-1.6, -1.0, 3.2, 1.0);
for (let k = 0; k < 3; k++) {
  const y = -2.6 + k * 0.5;
  g.fillStyle = '#5a4230'; g.fillRect(-1.4, y, 2.8, 0.04);
  for (let x = -1.35; x < 1.3; x += 0.36) {
    const n = 1 + Math.floor(an.hash(Math.round(x * 10) + k * 31, 7) * 4);
    for (let i = 0; i < n; i++) { g.fillStyle = i % 2 ? '#77736a' : '#8a857a'; g.fillRect(x, y - 0.035 * (i + 1), 0.32, 0.03); }
  }
}
g.fillStyle = '#2a2420'; g.fillRect(0.6, -1.9, 0.5, 0.7);
g.fillStyle = '#c9b48a'; for (let i = 0; i < 4; i++) g.fillRect(0.66 + i * 0.1, -1.8, 0.04, 0.04);
