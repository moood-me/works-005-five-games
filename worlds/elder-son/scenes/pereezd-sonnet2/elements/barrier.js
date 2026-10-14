// шлагбаум: стойка у дороги и стрела на шарнире; стрела — слой, поворачивается по ключу barrier
g.fillStyle = '#e1e6ee'; g.fillRect(-0.3, -1.3, 0.6, 1.3);
g.fillStyle = '#c4302b'; g.fillRect(-0.3, -0.85, 0.6, 0.3);
g.fillStyle = '#10151d'; g.fillRect(-0.36, -0.2, 0.72, 0.2);
g.fillStyle = '#dbe4f2'; g.fillRect(-0.34, -1.36, 0.68, 0.08);
e.layer('arm', { pivot: [0, -1.15], box: [-1.2, -7.4, 6.9, 0.3] }, g2 => {
  g2.fillStyle = '#10151d'; g2.fillRect(-1.0, -1.28, 1.0, 0.26);          // противовес
  for (let i = 0; i < 8; i++) {                                          // стрела: красно-белые отрезки
    g2.fillStyle = i % 2 ? '#e8ecf3' : '#c9322d';
    g2.fillRect(i * 0.775, -1.27, 0.775, 0.24);
  }
  g2.fillStyle = '#dbe4f2'; g2.fillRect(0, -1.31, 6.2, 0.06);            // снег по стреле
  g2.fillStyle = '#ff4a38'; g2.beginPath(); g2.arc(6.0, -1.15, 0.12, 0, 6.3); g2.fill();
  e.light(6.0, -1.15, 0.6, '#ff3b2b', 1.2, 'tip');
});
e.at(2.5, -1.15);
