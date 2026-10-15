// The father's photograph on the north wall over the table: a dark wooden frame, an oval mount, a young man in a
// soldier's uniform and cap, in sepia; a sprig of dried flowers tucked in the frame's corner. Painted once.
g.fillStyle = '#2e2117'; g.fillRect(-0.17, -0.44, 0.34, 0.44);
g.fillStyle = '#ddd2bb'; g.fillRect(-0.14, -0.41, 0.28, 0.38);
g.save();
g.beginPath(); g.ellipse(0, -0.22, 0.1, 0.15, 0, 0, Math.PI * 2); g.clip();
const sepia = g.createLinearGradient(0, -0.37, 0, -0.07);
sepia.addColorStop(0, '#b19a78'); sepia.addColorStop(1, '#8a7356');
g.fillStyle = sepia; g.fillRect(-0.1, -0.37, 0.2, 0.3);
// the shoulders in uniform, the collar
g.fillStyle = '#4c4132';
g.beginPath(); g.moveTo(-0.11, -0.06); g.quadraticCurveTo(-0.09, -0.15, -0.03, -0.17); g.lineTo(0.03, -0.17); g.quadraticCurveTo(0.09, -0.15, 0.11, -0.06); g.fill();
g.fillStyle = '#5d503d'; g.fillRect(-0.025, -0.18, 0.05, 0.03);
// the face: plain, eyes, a moustache — a young man
g.fillStyle = '#c9ad88'; g.beginPath(); g.ellipse(0, -0.235, 0.038, 0.05, 0, 0, Math.PI * 2); g.fill();
g.fillStyle = '#3a2e22';
g.beginPath(); g.arc(-0.014, -0.245, 0.004, 0, Math.PI * 2); g.arc(0.014, -0.245, 0.004, 0, Math.PI * 2); g.fill();
g.fillRect(-0.012, -0.215, 0.024, 0.005);
// the cap
g.fillStyle = '#4c4132'; g.beginPath(); g.ellipse(0, -0.282, 0.044, 0.018, 0, Math.PI, 0); g.fill();
g.fillRect(-0.046, -0.283, 0.092, 0.008);
g.restore();
g.strokeStyle = '#7a6a50'; g.lineWidth = 0.004; g.beginPath(); g.ellipse(0, -0.22, 0.1, 0.15, 0, 0, Math.PI * 2); g.stroke();
// the dried flowers
g.strokeStyle = '#6e6a3e'; g.lineWidth = 0.006;
g.beginPath(); g.moveTo(0.13, -0.42); g.quadraticCurveTo(0.17, -0.5, 0.2, -0.54); g.stroke();
g.fillStyle = '#9a7a5a'; g.beginPath(); g.arc(0.2, -0.545, 0.012, 0, Math.PI * 2); g.arc(0.18, -0.515, 0.01, 0, Math.PI * 2); g.fill();
e.at(0, -0.22, 'photo');
