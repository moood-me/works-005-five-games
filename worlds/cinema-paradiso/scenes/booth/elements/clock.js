// The clock over the look port: a white face; its hands are layers turned by `clock` (6…10 o'clock); in 1988 stopped
const ruin = e.state.era === 'ruin';
g.fillStyle = '#2a2826'; g.beginPath(); g.arc(0, -0.16, 0.16, 0, Math.PI * 2); g.fill();
g.fillStyle = ruin ? '#a8a092' : '#e4dccb'; g.beginPath(); g.arc(0, -0.16, 0.14, 0, Math.PI * 2); g.fill();
g.fillStyle = '#2a2826';
for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2; g.fillRect(Math.sin(a) * 0.12 - 0.004, -0.16 - Math.cos(a) * 0.12 - 0.01, 0.008, 0.02); }
e.layer('hour', { pivot: [0, -0.16] }, l => { l.strokeStyle = '#1a1816'; l.lineCap = 'round'; l.lineWidth = 0.014; l.beginPath(); l.moveTo(0, -0.16); l.lineTo(0, -0.23); l.stroke(); });
e.layer('min', { pivot: [0, -0.16] }, l => { l.strokeStyle = '#1a1816'; l.lineCap = 'round'; l.lineWidth = 0.009; l.beginPath(); l.moveTo(0, -0.16); l.lineTo(0, -0.27); l.stroke(); });
e.at(0, -0.16, 'face');
