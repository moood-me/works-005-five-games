// The electric train far off across the field: a chain of warm windows (five cars, 14 windows each).
g.fillStyle = '#11182c';
g.fillRect(0, -3.2, 66, 3);
for (let c = 0; c < 5; c++) for (let i = 0; i < 9; i++) {
  g.fillStyle = '#f0b868';
  g.fillRect(c * 13.2 + 0.8 + i * 1.3, -2.6, 0.9, 1.1);
}
e.light(8, -2, 5, '#e8963a', 0.6);
e.light(36, -2, 5, '#e8963a', 0.6);
e.light(60, -2, 5, '#e8963a', 0.6);
