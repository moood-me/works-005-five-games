g.fillStyle = '#20263c';
g.beginPath(); g.moveTo(-10, -3); g.lineTo(10, -3); g.lineTo(8, 0.4); g.lineTo(-8, 0.4); g.closePath(); g.fill();
g.fillRect(-6, -6, 12, 3); g.fillRect(-3.5, -8.4, 7, 2.4);
g.fillStyle = '#2d2a30'; g.fillRect(-1.6, -13, 2.4, 5);
g.fillStyle = '#262d48'; g.fillRect(4, -12, 0.6, 9);
e.at(0, -5, 'lights');
e.light(-7, -4.4, 3.2, '#ffd9a0', 1.1, 'l0');
e.light(0, -7.6, 3.4, '#ffd9a0', 1.1, 'l1');
e.light(7, -4.4, 3.2, '#ff9c6a', 1.0, 'l2');
g.fillStyle = '#ffe2a8';
for (const [x, y] of [[-7, -4.4], [0, -7.6], [7, -4.4]]) { g.beginPath(); g.arc(x, y, 0.5, 0, 7); g.fill(); }
