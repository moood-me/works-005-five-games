// The balcony's underside over the back of the parterre (seen from below): plaster coffers.
g.fillStyle = '#c8bba2'; g.fillRect(-7, -7.7, 14, 7.75);
g.strokeStyle = 'rgba(90,70,50,0.35)'; g.lineWidth = 0.05;
for (let x = -6; x <= 6; x += 2) for (let y = -7.2; y < -0.5; y += 1.8) g.strokeRect(x - 0.8, y, 1.6, 1.4);
