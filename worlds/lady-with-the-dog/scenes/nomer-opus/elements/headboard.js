// The bed's iron head, at the wall (metres from its foot's middle, x along the bed).
g.strokeStyle = '#3e3a3a'; g.lineWidth = 0.04;
g.beginPath(); g.moveTo(-0.5, 0); g.lineTo(-0.5, -1.25); g.moveTo(0.5, 0); g.lineTo(0.5, -1.25);
g.moveTo(-0.5, -1.15); g.quadraticCurveTo(0, -1.32, 0.5, -1.15); g.moveTo(-0.5, -0.6); g.lineTo(0.5, -0.6); g.stroke();
g.lineWidth = 0.02;
for (let x = -0.35; x <= 0.36; x += 0.14) { g.beginPath(); g.moveTo(x, -0.6); g.lineTo(x, -1.19); g.stroke(); }
g.fillStyle = '#b39352'; for (const x of [-0.5, 0.5]) { g.beginPath(); g.arc(x, -1.27, 0.04, 0, Math.PI * 2); g.fill(); }
