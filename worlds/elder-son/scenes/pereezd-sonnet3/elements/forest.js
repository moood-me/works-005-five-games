for (let layer = 0; layer < 2; layer++) {
  g.fillStyle = layer ? '#1a2640' : '#222f4c';
  for (let x = -330; x < 330; x += 2.2 + e.rnd() * 2.4) {
    const h = 9 + e.rnd() * 14 + layer * 3, w = 2.4 + e.rnd() * 2.6;
    g.beginPath();
    g.moveTo(x - w, 1); g.lineTo(x, -h); g.lineTo(x + w, 1);
    g.closePath(); g.fill();
  }
}
g.fillStyle = '#1a2640'; g.fillRect(-340, -4, 680, 6);
