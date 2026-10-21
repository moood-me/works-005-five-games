// The boatman's sampan (Hong Kong): a small low boat rising to its bow, a mat roof over its middle, the long oar astern —
// it lies at the foot of the steps, and goes off across the water with the news (sampan_x, sampan_d, sampan_facing:
// the script); the boatman stands at its stern (sampan#stand).
g.fillStyle = '#3a3026';
g.beginPath();
g.moveTo(-2.4, -0.3);
g.lineTo(1.8, -0.36);
g.quadraticCurveTo(2.5, -0.42, 2.8, -0.9);
g.lineTo(2.1, 0.05);
g.lineTo(-2.2, 0.05);
g.closePath();
g.fill();
g.fillStyle = '#8a7a5c';
g.beginPath();
g.moveTo(-0.5, -0.36);
g.quadraticCurveTo(0.5, -1.5, 1.5, -0.36);
g.closePath();
g.fill();
g.strokeStyle = '#3a3026';
g.lineWidth = 0.06;
g.beginPath();
g.moveTo(-2.1, -0.5);
g.lineTo(-3.4, 0.15);
g.stroke();
e.at(-1.5, -0.32, 'stand');
