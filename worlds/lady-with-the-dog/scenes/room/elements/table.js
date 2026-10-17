// The little table's front: the lace cloth's hanging edge, the dark legs (metres, origin at its foot's middle).
g.fillStyle = '#4a3528';
for (const x of [-0.4, 0.36]) g.fillRect(x, -0.7, 0.05, 0.7);
g.fillRect(-0.45, -0.76, 0.9, 0.08);
g.fillStyle = '#ece6d8';
g.beginPath(); g.moveTo(-0.4, -0.76); g.lineTo(0.4, -0.76);
for (let x = 0.4; x >= -0.4; x -= 0.08) g.quadraticCurveTo(x - 0.04, -0.6, x - 0.08, -0.64);
g.closePath(); g.fill();
