// The small white church on the promontory: a whitewashed wall with an arched door and windows, a low roof, a drum
// with its dome and a cross. Seen square on; metres, origin at the middle of its foot.
const white = '#ebe7de', shade = '#d9d4c9', roof = '#a99e8a', dome = '#8e99a6', dark = '#4f4d55';
// the body and its low side porch
g.fillStyle = white;
g.fillRect(-3.2, -5.2, 6.4, 5.2);
g.fillStyle = shade;
g.fillRect(-3.2, -0.5, 6.4, 0.5);                 // the plinth
g.fillRect(3.2, -3.4, 0.8, 3.4);                  // the porch's side
// the roof: a low gable over the wall
g.fillStyle = roof;
g.beginPath(); g.moveTo(-3.6, -5.1); g.lineTo(0, -6.3); g.lineTo(3.6, -5.1); g.lineTo(3.6, -4.8); g.lineTo(-3.6, -4.8); g.closePath(); g.fill();
// the drum with its windows, the dome, the cross
g.fillStyle = white;
g.fillRect(-1.05, -7.9, 2.1, 2.2);
g.fillStyle = dark;
for (const x of [-0.55, 0.25]) { g.beginPath(); g.moveTo(x, -6.3); g.lineTo(x, -7.1); g.arc(x + 0.15, -7.1, 0.15, Math.PI, 0); g.lineTo(x + 0.3, -6.3); g.closePath(); g.fill(); }
g.fillStyle = roof; g.fillRect(-1.2, -8.0, 2.4, 0.18);
g.fillStyle = dome;
g.beginPath(); g.moveTo(-1.1, -7.95); g.bezierCurveTo(-1.1, -9.1, -0.25, -9.4, 0, -9.6); g.bezierCurveTo(0.25, -9.4, 1.1, -9.1, 1.1, -7.95); g.closePath(); g.fill();
g.strokeStyle = dark; g.lineWidth = 0.09;
g.beginPath(); g.moveTo(0, -9.6); g.lineTo(0, -10.5); g.moveTo(-0.28, -10.2); g.lineTo(0.28, -10.2); g.moveTo(-0.2, -9.9); g.lineTo(0.2, -9.85); g.stroke();
// the arched door and two windows of the wall
g.fillStyle = dark;
g.beginPath(); g.moveTo(-0.55, 0); g.lineTo(-0.55, -2.0); g.arc(0, -2.0, 0.55, Math.PI, 0); g.lineTo(0.55, 0); g.closePath(); g.fill();
for (const x of [-2.2, 1.7]) { g.beginPath(); g.moveTo(x, -2.4); g.lineTo(x, -3.3); g.arc(x + 0.25, -3.3, 0.25, Math.PI, 0); g.lineTo(x + 0.5, -2.4); g.closePath(); g.fill(); }
g.strokeStyle = shade; g.lineWidth = 0.12;
g.beginPath(); g.arc(0, -2.0, 0.75, Math.PI, 0); g.stroke();
