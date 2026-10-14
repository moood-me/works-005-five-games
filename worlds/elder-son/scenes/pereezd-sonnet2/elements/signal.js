// светофор переезда: столб, чёрный щит с двумя красными огнями, крест под ним
g.fillStyle = '#20262f'; g.fillRect(-0.07, -3.3, 0.14, 3.3);
g.fillStyle = '#12161d'; g.fillRect(-1.0, -3.95, 2.0, 0.9);          // щит
g.fillStyle = '#e7ebf2'; g.fillRect(-1.0, -3.95, 2.0, 0.06); g.fillRect(-1.0, -3.11, 2.0, 0.06); // белая кайма
g.fillRect(-1.0, -3.95, 0.06, 0.9); g.fillRect(0.94, -3.95, 0.06, 0.9);
for (const [x, n] of [[-0.45, 'l1'], [0.45, 'l2']]) {
  g.fillStyle = '#4a1612'; g.beginPath(); g.arc(x, -3.5, 0.26, 0, 6.3); g.fill();
  g.fillStyle = '#ff4a38'; g.beginPath(); g.arc(x, -3.5, 0.2, 0, 6.3); g.fill();
  e.light(x, -3.5, 0.7, '#ff3b2b', 1.4, n);
}
// андреевский крест
g.save(); g.translate(0, -2.55);
for (const a of [0.62, -0.62]) {
  g.save(); g.rotate(a); g.fillStyle = '#e7ebf2'; g.fillRect(-0.9, -0.1, 1.8, 0.2);
  g.fillStyle = '#c4302b'; g.fillRect(-0.9, -0.03, 1.8, 0.06); g.restore();
}
g.restore();
g.fillStyle = '#dbe4f2'; g.fillRect(-1.0, -4.0, 2.0, 0.07);        // снег на щите
