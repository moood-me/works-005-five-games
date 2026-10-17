// The dim corridor behind the door: a wall, a sconce's faint glow (metres, origin at its foot's middle).
g.fillStyle = '#4c4a44'; g.fillRect(-1.2, -2.6, 2.4, 2.6);
g.fillStyle = '#3a3832'; g.fillRect(-1.2, -0.9, 2.4, 0.9);
g.fillStyle = '#e8c890'; g.beginPath(); g.ellipse(0.5, -1.9, 0.05, 0.07, 0, 0, Math.PI * 2); g.fill();
e.light(0.5, -1.9, 0.12, '#ffc890', 0.5, 'sconce');
