// будка дежурной: бревенчатый домик, крыша под снегом, дверь, труба
g.fillStyle = '#4a4a5a'; g.fillRect(-3.0, -2.7, 6.0, 2.7);
g.fillStyle = 'rgba(0,0,0,0.22)';
for (let y = -2.55; y < 0; y += 0.3) g.fillRect(-3.0, y, 6.0, 0.04);
g.fillStyle = '#2a2d3a'; g.fillRect(1.5, -2.1, 0.95, 2.1);          // дверь
g.fillStyle = '#e1e8f3';                                              // крыша
g.beginPath(); g.moveTo(-3.5, -2.65); g.lineTo(0, -3.8); g.lineTo(3.5, -2.65); g.lineTo(3.5, -2.5); g.lineTo(-3.5, -2.5); g.closePath(); g.fill();
g.fillStyle = '#2b3140'; g.fillRect(-3.5, -2.52, 7.0, 0.14);
g.fillRect(1.8, -4.6, 0.45, 1.3);                                    // труба
g.fillStyle = '#dbe4f2'; g.fillRect(1.74, -4.66, 0.57, 0.1);
g.fillStyle = '#d5dded'; g.beginPath(); g.ellipse(0, 0.05, 4.2, 0.28, 0, 0, 6.3); g.fill(); // сугроб у стены
