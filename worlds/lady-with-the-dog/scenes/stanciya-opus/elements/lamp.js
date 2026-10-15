// A platform lamp: a thin cast-iron post and a four-sided lantern on top (metres, origin at its foot). Its flame is
// a glow and a light (the scene's lights take it over to reach the platform round it).
g.fillStyle = '#3c4140';
g.fillRect(-0.05, -3.0, 0.1, 3.0);
g.fillRect(-0.14, -0.25, 0.28, 0.25);
g.fillRect(-0.18, -3.02, 0.36, 0.05);
g.fillStyle = '#e9d6a6';
g.beginPath(); g.moveTo(-0.15, -3.05); g.lineTo(-0.2, -3.42); g.lineTo(0.2, -3.42); g.lineTo(0.15, -3.05); g.closePath(); g.fill();
g.strokeStyle = '#3c4140'; g.lineWidth = 0.025;
g.beginPath(); g.moveTo(0, -3.05); g.lineTo(0, -3.42); g.stroke();
g.fillStyle = '#3c4140';
g.beginPath(); g.moveTo(-0.24, -3.42); g.lineTo(0, -3.58); g.lineTo(0.24, -3.42); g.closePath(); g.fill();
// (its light and glow are the scene's lights at the lamps' places: lamp0…lamp4)
