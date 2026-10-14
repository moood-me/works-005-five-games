g.fillStyle = '#7f879b'; g.fillRect(-0.2, -1.3, 0.4, 1.3);
g.fillStyle = '#d3d9e6'; g.fillRect(-0.34, -1.52, 0.68, 0.5);
e.layer('arm', { pivot: [0, -1.25] }, g => {
  for (let i = 0; i < 9; i++) {
    g.fillStyle = i % 2 ? '#e3e8f1' : '#a8434a';
    g.fillRect(-0.8 + i * 0.75, -1.4, 0.75, 0.3);
  }
  g.fillStyle = '#434c64'; g.fillRect(-1.25, -1.62, 0.55, 0.68);
  g.fillStyle = '#7a1f25'; g.beginPath(); g.arc(5.7, -1.48, 0.14, 0, 6.2832); g.fill();
  e.light(5.7, -1.5, 0.5, '#ff4a3a', 0.9, 'tip');
});
e.at(2.2, -1.25);
