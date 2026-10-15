// A street lamp on the quay by the road: an iron bracket, a pale bulb under a shade.
g.fillStyle = '#26282c';
g.fillRect(-0.06, -4.2, 0.12, 4.2); g.fillRect(-0.15, -0.3, 0.3, 0.3);
g.strokeStyle = '#26282c'; g.lineWidth = 0.05; g.beginPath(); g.moveTo(0, -4.1); g.quadraticCurveTo(0.2, -4.5, 0.75, -4.4); g.stroke();
g.beginPath(); g.moveTo(0.5, -4.42); g.lineTo(1.0, -4.42); g.lineTo(0.88, -4.25); g.lineTo(0.62, -4.25); g.closePath(); g.fill();
e.light(0.75, -4.2, 0.12, '#dde3f2', 1, 'lamp');
