
// The station clock over the middle door: dawn of 1959 (twenty to six) or the evening of 1988 (ten past seven)
const now = e.state.era === 'now', h = now ? 7 + 10 / 60 : 5 + 40 / 60;
g.fillStyle = '#2a2826'; g.beginPath(); g.arc(0, -0.5, 0.5, 0, Math.PI * 2); g.fill();
g.fillStyle = now ? '#d8d4c8' : '#f0e8d4'; g.beginPath(); g.arc(0, -0.5, 0.44, 0, Math.PI * 2); g.fill();
g.fillStyle = '#2a2826'; for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2; g.fillRect(Math.sin(a) * 0.37 - 0.012, -0.5 - Math.cos(a) * 0.37 - 0.03, 0.024, 0.06); }
const ha = (h % 12) / 12 * Math.PI * 2, ma = (h % 1) * Math.PI * 2;
g.strokeStyle = '#1a1816'; g.lineCap = 'round';
g.lineWidth = 0.04; g.beginPath(); g.moveTo(0, -0.5); g.lineTo(Math.sin(ha) * 0.22, -0.5 - Math.cos(ha) * 0.22); g.stroke();
g.lineWidth = 0.025; g.beginPath(); g.moveTo(0, -0.5); g.lineTo(Math.sin(ma) * 0.34, -0.5 - Math.cos(ma) * 0.34); g.stroke();
e.at(0, -0.5, 'face');
