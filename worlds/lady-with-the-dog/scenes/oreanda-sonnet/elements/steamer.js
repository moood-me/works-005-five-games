g.fillStyle = '#2d3550';
g.beginPath();
g.moveTo(-26, -5);
g.lineTo(26, -5);
g.lineTo(22, 0);
g.lineTo(-22, 0);
g.closePath();
g.fill();
g.fillStyle = '#9a9fb8';
g.fillRect(-18, -9.5, 30, 4.5);
g.fillStyle = '#34405e';
g.fillRect(-4, -17, 5, 8);
g.fillRect(8, -13, 1.2, 8);
g.fillRect(-16, -13, 1.2, 8);
e.at(0, -9, 'lights');
e.light(-14, -7, 14, '#ffd58a', 1.0, 'l1');
e.light(0, -6, 14, '#ffd58a', 1.0, 'l2');
e.light(14, -6, 14, '#ffe0a0', 1.0, 'l3');
g.fillStyle = '#ffe3a0';
for (const x of [-14, 0, 14]) {
  g.beginPath();
  g.arc(x, -7, 0.9, 0, 6.283);
  g.fill();
}
