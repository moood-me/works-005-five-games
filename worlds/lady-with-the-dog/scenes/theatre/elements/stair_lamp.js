// The landing's lamp, hung on a chain from the ceiling: a frosted globe in a brass ring — the dim lamp over the two.
g.strokeStyle = '#6a5440'; g.lineWidth = 0.02;
g.beginPath(); g.moveTo(0, -2.7); g.lineTo(0, -0.32); g.stroke();
g.fillStyle = '#b8955a'; g.fillRect(-0.12, -0.34, 0.24, 0.05);
g.fillStyle = '#f4ead2'; g.beginPath(); g.arc(0, -0.17, 0.15, 0, Math.PI * 2); g.fill();
e.light(0, -0.17, 0.35, '#ffd08a', 1.2, 'flame');
