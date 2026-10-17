
// the platform's stone face toward the track (from the bed up to the coping), seen from the train
const now = e.state.era === 'now';
g.fillStyle = now ? '#77726a' : '#a4987e'; g.fillRect(-60, -0.92, 120, 0.92);
g.fillStyle = now ? '#8e8a80' : '#c4b896'; g.fillRect(-60, -0.94, 120, 0.12);
g.strokeStyle = 'rgba(60,50,40,0.3)'; g.lineWidth = 0.02; for (let x = -60; x < 60; x += 0.9) { g.beginPath(); g.moveTo(x, -0.82); g.lineTo(x, 0); g.stroke(); }
