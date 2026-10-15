
// The clock over the look port: a white face, black numerals; its hands by `clock` (6…10 o'clock)
const h = Math.max(6, Math.min(10, e.state.clock || 6));
g.fillStyle = '#2a2826'; g.beginPath(); g.arc(0, -0.16, 0.16, 0, Math.PI * 2); g.fill();
g.fillStyle = '#e4dccb'; g.beginPath(); g.arc(0, -0.16, 0.14, 0, Math.PI * 2); g.fill();
g.fillStyle = '#2a2826';
for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2; g.fillRect(Math.sin(a) * 0.12 - 0.004, -0.16 - Math.cos(a) * 0.12 - 0.01, 0.008, 0.02); }
const ha = (h % 12) / 12 * Math.PI * 2, ma = (h % 1) * Math.PI * 2;
g.strokeStyle = '#1a1816'; g.lineCap = 'round';
g.lineWidth = 0.014; g.beginPath(); g.moveTo(0, -0.16); g.lineTo(Math.sin(ha) * 0.07, -0.16 - Math.cos(ha) * 0.07); g.stroke();
g.lineWidth = 0.009; g.beginPath(); g.moveTo(0, -0.16); g.lineTo(Math.sin(ma) * 0.11, -0.16 - Math.cos(ma) * 0.11); g.stroke();
e.at(0, -0.16, 'face');
