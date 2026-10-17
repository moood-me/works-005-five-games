// The locomotive's front, turned to the end of the line: the round smokebox door, the chimney over it, the
// red buffer beam, the pilot, the lamp lit.
g.fillStyle = '#242a28';
g.beginPath();
g.arc(0, -2.45, 0.9, 0, Math.PI * 2);
g.fill();
g.fillRect(-0.28, -5.0, 0.56, 1.7);
g.fillRect(-0.4, -5.0, 0.8, 0.12);
g.strokeStyle = '#3a403c';
g.lineWidth = 0.05;
g.beginPath();
g.arc(0, -2.45, 0.62, 0, Math.PI * 2);
g.stroke();
g.fillStyle = '#7a3428';
g.fillRect(-1.3, -1.45, 2.6, 0.45);
g.fillStyle = '#1e2220';
g.beginPath();
g.moveTo(-1.0, -1.0);
g.lineTo(1.0, -1.0);
g.lineTo(0.7, -0.1);
g.lineTo(-0.7, -0.1);
g.closePath();
g.fill();
g.fillStyle = '#e8dcc0';
g.fillRect(-0.15, -3.75, 0.3, 0.3);
e.light(0, -3.6, 0.5, '#ffe2a8', 0.7, 'lamp');
