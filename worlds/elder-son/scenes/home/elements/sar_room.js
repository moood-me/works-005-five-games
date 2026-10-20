// Sarafanov's own room beyond his door, seen through it: dark wallpaper, a music stand with a sheet, his bed's foot,
// a table lamp with a green shade on a little table (its light is the scene's `sar_light`, in the room before the gap).
// Metres; x = 3.5 − the plan's z.
e.lib.roomWall(g, e, 1.8, 2.4);
g.fillStyle = 'rgba(40,30,24,0.35)';
g.fillRect(-0.9, -2.4, 1.8, 2.42);
g.fillStyle = '#4a3a2c';
g.fillRect(-0.85, -0.7, 0.6, 0.04);
g.fillRect(-0.8, -0.66, 0.04, 0.66);
g.fillRect(-0.34, -0.66, 0.04, 0.66);
g.fillStyle = '#2f5a3c';
g.beginPath();
g.moveTo(-0.66, -1.05);
g.lineTo(-0.44, -1.05);
g.lineTo(-0.5, -0.9);
g.lineTo(-0.6, -0.9);
g.closePath();
g.fill();
g.fillStyle = '#3a3330';
g.fillRect(-0.56, -0.9, 0.03, 0.2);
g.fillStyle = '#8a7a64';
g.fillRect(0.2, -0.5, 0.7, 0.5);
g.fillStyle = '#d6cdb8';
g.fillRect(0.2, -0.55, 0.7, 0.08);
g.strokeStyle = '#2a2420';
g.lineWidth = 0.02;
g.beginPath();
g.moveTo(0.05, 0);
g.lineTo(0.05, -1.2);
g.stroke();
g.fillStyle = '#ece6d6';
g.fillRect(-0.12, -1.42, 0.34, 0.24);
