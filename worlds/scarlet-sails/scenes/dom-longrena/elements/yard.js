// The top of the hill outside the door, seen from above (x across, y toward the eye; centre 2 m to
// the right, 6.75 m ahead): short grass to the brow, where the slope drops to the sea, and the
// path from the door.
g.fillStyle = "#8a9389";
g.beginPath();
g.moveTo(-4, 1.75);
g.lineTo(4, 1.75);
g.lineTo(4, -1.2);
g.quadraticCurveTo(0, -1.9, -4, -1.4);
g.closePath();
g.fill();
g.fillStyle = "#a7aca3";
g.beginPath();
g.moveTo(0, 1.75);
g.lineTo(0.85, 1.75);
g.quadraticCurveTo(0.8, 0, 1.6, -1.6);
g.lineTo(1.1, -1.65);
g.quadraticCurveTo(0, 0, 0, 1.75);
g.fill();
