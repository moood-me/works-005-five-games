const r = g.createRadialGradient(0, 0, 0, 0, 0, 9);
r.addColorStop(0, 'rgba(255,246,214,1)');
r.addColorStop(0.15, 'rgba(255,236,190,0.65)');
r.addColorStop(1, 'rgba(255,230,180,0)');
g.fillStyle = r; g.fillRect(-9, -9, 18, 18);
e.light(0, 0, 4.5, '#fff0c8', 1.6, 'far');
