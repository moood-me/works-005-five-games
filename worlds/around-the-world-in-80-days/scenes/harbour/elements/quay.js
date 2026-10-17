// The quay the viewer stands on, seen from above: big granite slabs, wet; its edge to the water.
g.fillStyle = '#7c7a74';
g.fillRect(-100, -3.5, 200, 7);
g.fillStyle = 'rgba(30,30,30,0.3)';
for (let x = -99; x < 100; x += 1.2) g.fillRect(x, -3.5, 0.03, 7);
for (const y of [-2.6, -1.6, -0.6, 0.4, 1.4, 2.4]) g.fillRect(-100, y, 200, 0.03);
g.fillStyle = 'rgba(210,206,196,0.4)';
g.fillRect(-100, -3.5, 200, 0.25);
