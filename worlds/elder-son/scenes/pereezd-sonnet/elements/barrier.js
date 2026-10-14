// The barrier: a post at the left of the road and a striped arm (a layer, turned about the post by `barrier`).
g.fillStyle = '#d9dde8';
g.fillRect(-0.18, -1.35, 0.36, 1.35);
g.fillStyle = '#b8222a';
g.fillRect(-0.18, -0.9, 0.36, 0.3);
g.fillStyle = '#2a2c34';
g.beginPath(); g.arc(0, -1.05, 0.12, 0, 6.283); g.fill();
e.layer('arm', { pivot: [0, -1.05] }, g => {
  for (let i = 0; i < 12; i++) {
    g.fillStyle = i % 2 ? '#e9ecf3' : '#c0222a';
    g.fillRect(0.1 + i * 0.45, -1.14, 0.45, 0.18);
  }
  g.fillStyle = '#ff3b2a';
  g.beginPath(); g.arc(5.4, -1.2, 0.1, 0, 6.283); g.fill();
  e.light(5.4, -1.2, 0.35, '#ff3b2a', 0.9, 'tip');
});
e.at(2.8, -1.05);
