// The father's photograph on the north wall over the table: a broad dark frame with a cream mount, a young man in
// soldier's uniform and side cap, half-length, strong in black and white so it reads across the room; a sprig of dried
// flowers tucked into the frame's corner and a black ribbon not yet (he is only missing). Painted once.
g.fillStyle = '#231910'; g.fillRect(-0.22, -0.6, 0.44, 0.6);
g.fillStyle = '#4a3624'; g.fillRect(-0.205, -0.585, 0.41, 0.57);
g.fillStyle = '#e4dac4'; g.fillRect(-0.18, -0.56, 0.36, 0.52);
g.save();
g.beginPath(); g.ellipse(0, -0.3, 0.13, 0.2, 0, 0, Math.PI * 2); g.clip();
const bg = g.createRadialGradient(0, -0.34, 0.02, 0, -0.3, 0.22);
bg.addColorStop(0, '#d8cdb6'); bg.addColorStop(1, '#8c7c62');
g.fillStyle = bg; g.fillRect(-0.14, -0.52, 0.28, 0.44);
// the tunic: dark, buttons, a pale collar
g.fillStyle = '#2b261f';
g.beginPath(); g.moveTo(-0.14, -0.08); g.quadraticCurveTo(-0.13, -0.2, -0.05, -0.23); g.lineTo(0.05, -0.23); g.quadraticCurveTo(0.13, -0.2, 0.14, -0.08); g.fill();
g.fillStyle = '#cfc5ad'; g.beginPath(); g.moveTo(-0.035, -0.235); g.lineTo(0.035, -0.235); g.lineTo(0, -0.19); g.fill();
g.fillStyle = '#9a8a62'; for (let k = 0; k < 3; k++) { g.beginPath(); g.arc(0, -0.17 + k * 0.035, 0.006, 0, Math.PI * 2); g.fill(); }
// the face: light, eyes, brows, a moustache
g.fillStyle = '#ddc8a6'; g.beginPath(); g.ellipse(0, -0.31, 0.05, 0.068, 0, 0, Math.PI * 2); g.fill();
g.fillStyle = '#1e1913';
g.beginPath(); g.arc(-0.019, -0.32, 0.0065, 0, Math.PI * 2); g.arc(0.019, -0.32, 0.0065, 0, Math.PI * 2); g.fill();
g.fillRect(-0.03, -0.337, 0.022, 0.004); g.fillRect(0.008, -0.337, 0.022, 0.004);
g.fillRect(-0.018, -0.285, 0.036, 0.008);
// the side cap
g.fillStyle = '#2b261f'; g.beginPath(); g.moveTo(-0.055, -0.36); g.lineTo(0.05, -0.375); g.lineTo(0.04, -0.4); g.lineTo(-0.05, -0.385); g.closePath(); g.fill();
g.restore();
g.strokeStyle = '#7a6a50'; g.lineWidth = 0.005; g.beginPath(); g.ellipse(0, -0.3, 0.13, 0.2, 0, 0, Math.PI * 2); g.stroke();
// the dried flowers
g.strokeStyle = '#6e6a3e'; g.lineWidth = 0.008;
g.beginPath(); g.moveTo(0.17, -0.58); g.quadraticCurveTo(0.22, -0.66, 0.26, -0.72); g.stroke();
g.fillStyle = '#a07a5a'; g.beginPath(); g.arc(0.26, -0.725, 0.016, 0, Math.PI * 2); g.arc(0.235, -0.69, 0.013, 0, Math.PI * 2); g.fill();
e.at(0, -0.3, 'photo');
