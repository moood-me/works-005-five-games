// The locomotive and its tender at the head of the train, side on, going right (metres, origin at its foot; the
// tender from x −8.6, the engine to x 9.6). Its chimney's mouth is a point: the smoke comes from it.
const black = '#2a2d2c', iron = '#3a3e3c', brass = '#9a8050';
// the tender
g.fillStyle = iron; g.fillRect(-8.4, -3.0, 5.2, 2.0);
g.fillStyle = '#1f2120'; g.beginPath(); g.ellipse(-5.8, -3.0, 2.4, 0.3, 0, Math.PI, 0); g.fill();
g.fillStyle = black; for (const x of [-7.4, -5.8, -4.2]) { g.beginPath(); g.arc(x, -0.5, 0.48, 0, Math.PI * 2); g.fill(); }
g.fillStyle = '#353335'; g.fillRect(-8.6, -1.12, 5.8, 0.3);
// the cab
g.fillStyle = iron; g.fillRect(-2.9, -3.9, 2.6, 2.8);
g.fillStyle = '#2f3331'; g.beginPath(); g.moveTo(-3.1, -3.9); g.quadraticCurveTo(-1.6, -4.4, -0.1, -3.9); g.closePath(); g.fill();
g.fillStyle = '#e9c88a'; g.fillRect(-2.5, -3.5, 0.8, 0.7);
// the boiler, the dome, the sand box, the chimney
g.fillStyle = black; g.fillRect(-0.4, -3.55, 8.4, 1.75);
g.beginPath(); g.ellipse(8.0, -2.68, 0.25, 0.88, 0, -Math.PI / 2, Math.PI / 2); g.fill();
g.fillStyle = iron; for (const x of [0.6, 2.2, 3.8, 5.4, 7.0]) g.fillRect(x, -3.55, 0.08, 1.75);
g.fillStyle = black; g.beginPath(); g.ellipse(3.2, -3.55, 0.5, 0.45, 0, Math.PI, 0); g.fill();
g.fillStyle = brass; g.beginPath(); g.ellipse(1.5, -3.55, 0.35, 0.3, 0, Math.PI, 0); g.fill();
g.fillStyle = black;
g.beginPath(); g.moveTo(6.7, -3.5); g.lineTo(6.75, -4.6); g.lineTo(6.5, -5.15); g.lineTo(7.7, -5.15); g.lineTo(7.45, -4.6); g.lineTo(7.5, -3.5); g.closePath(); g.fill();
e.at(7.1, -5.15, 'chimney');
// the frame, the wheels, the rods, the buffer beam, the head lamp
g.fillStyle = '#353335'; g.fillRect(-3.0, -1.8, 12.3, 0.4);
g.fillStyle = black;
for (const x of [0.6, 2.5, 4.4]) { g.beginPath(); g.arc(x, -0.82, 0.8, 0, Math.PI * 2); g.fill(); }
for (const x of [6.7, 7.9]) { g.beginPath(); g.arc(x, -0.45, 0.43, 0, Math.PI * 2); g.fill(); }
g.fillStyle = iron; for (const x of [0.6, 2.5, 4.4]) { g.beginPath(); g.arc(x, -0.82, 0.22, 0, Math.PI * 2); g.fill(); }
g.strokeStyle = '#7d7f7c'; g.lineWidth = 0.08; g.beginPath(); g.moveTo(0.6, -0.95); g.lineTo(4.4, -0.95); g.stroke();
g.fillStyle = '#3c3a38'; g.fillRect(8.7, -1.75, 0.35, 0.9);
g.beginPath(); g.moveTo(8.9, -0.85); g.lineTo(9.6, -0.1); g.lineTo(8.6, -0.1); g.closePath(); g.fill();
g.fillStyle = '#efd9a8'; g.beginPath(); g.arc(8.55, -3.75, 0.13, 0, Math.PI * 2); g.fill();
e.light(8.55, -3.75, 0.25, '#ffe2a8', 1.4, 'head');
