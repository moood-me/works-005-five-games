// The flat round film tin on the bench: its lid a layer lifted aside while `tin_open`; gone when it is in Alfredo's
// pocket (`tin_at`) and in 1988 (Salvatore brings it himself)
if (e.state.tin_at !== 'bench' || e.state.era === 'ruin') return;
g.fillStyle = '#7a7a7e'; g.beginPath(); g.ellipse(0, -0.02, 0.11, 0.035, 0, 0, Math.PI * 2); g.fill();
g.fillStyle = '#5a5a5e'; g.fillRect(-0.11, -0.02, 0.22, 0.02);
g.fillStyle = '#2a2826'; g.beginPath(); g.ellipse(0, -0.04, 0.09, 0.025, 0, 0, Math.PI * 2); g.fill();
g.fillStyle = '#c8c0b0'; for (let k = 0; k < 4; k++) g.fillRect(-0.05 + k * 0.025, -0.05, 0.015, 0.01);
e.layer('lid', { pivot: [0.11, -0.04], box: [-0.15, -0.2, 0.3, 0.02] }, l => {
  l.fillStyle = '#8a8a8e'; l.beginPath(); l.ellipse(0, -0.05, 0.115, 0.035, 0, 0, Math.PI * 2); l.fill();
  l.fillStyle = '#6a6a6e'; l.fillRect(-0.115, -0.05, 0.23, 0.015);
});
e.at(0, -0.05);
