// The harbour lantern at the end of the mole: a cast-iron post, a glass lamp (cool white), a small green signal on top.
g.fillStyle = '#25272b';
g.beginPath(); g.moveTo(-0.22, 0); g.lineTo(-0.14, -0.5); g.lineTo(-0.06, -3.3); g.lineTo(0.06, -3.3); g.lineTo(0.14, -0.5); g.lineTo(0.22, 0); g.fill();
g.fillRect(-0.18, -3.38, 0.36, 0.08);
g.fillStyle = '#e9ecef'; g.beginPath(); g.moveTo(-0.14, -3.38); g.lineTo(-0.18, -3.95); g.lineTo(0.18, -3.95); g.lineTo(0.14, -3.38); g.fill();
g.strokeStyle = '#25272b'; g.lineWidth = 0.025; g.beginPath(); g.moveTo(0, -3.38); g.lineTo(0, -3.95); g.stroke();
g.fillStyle = '#25272b'; g.beginPath(); g.moveTo(-0.24, -3.95); g.lineTo(0, -4.18); g.lineTo(0.24, -3.95); g.fill();
g.fillStyle = '#8fd8a8'; g.beginPath(); g.arc(0, -4.25, 0.05, 0, Math.PI * 2); g.fill();
e.light(0, -3.68, 0.28, '#e4ecff', 1, 'lamp');
e.light(0, -4.25, 0.07, '#7dffb0', 0.8, 'signal');
