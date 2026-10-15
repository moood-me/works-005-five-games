// The bed's front: the coverlet hanging down over the side with a lace hem, dark turned legs under it (metres,
// origin at its foot's middle).
g.fillStyle = '#4a3527';
for (const x of [-0.98, 0.94]) g.fillRect(x, -0.25, 0.06, 0.25);
g.fillStyle = '#e6dfd0';
g.beginPath(); g.moveTo(-1.02, -0.52); g.lineTo(1.02, -0.52);
for (let x = 1.02; x >= -1.02; x -= 0.085) g.quadraticCurveTo(x - 0.04, -0.16, x - 0.085, -0.2);
g.closePath(); g.fill();
g.fillStyle = 'rgba(160,145,125,0.3)';
for (let x = -0.9; x < 1; x += 0.3) g.fillRect(x, -0.5, 0.025, 0.3);
g.fillStyle = '#f6f2ea'; g.fillRect(-1.02, -0.55, 2.04, 0.05);
