// Through the club's door: its lit vestibule — a warm wall, a mirror's frame, a palm in a tub (its light — `club_door`)
g.fillStyle = '#e8c890';
g.fillRect(-1.3, -3.4, 2.6, 3.4);
g.fillStyle = '#b8955c';
g.fillRect(-0.5, -2.8, 1.0, 1.6);
g.fillStyle = '#efdcb4';
g.fillRect(-0.42, -2.72, 0.84, 1.44);
g.fillStyle = '#4e5a3e';
g.beginPath();
g.ellipse(0.9, -1.4, 0.35, 0.7, 0, 0, Math.PI * 2);
g.fill();
g.fillStyle = '#6a5440';
g.fillRect(0.75, -0.6, 0.3, 0.6);
e.light(0, -3.0, 0.2, '#ffd49a', 1, 'lamp');
