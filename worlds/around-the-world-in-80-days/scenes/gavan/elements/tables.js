// The terrace's tables and stools, each a part where it stands: round tops, a cup or a bottle; Fix and Passepartout's
// by the rail, nearest the water (tables#table).
const spots = [[-4.2, -3.4], [2.8, -2.6], [-2.4, 1.6], [4.4, 2.4]];
spots.forEach(([x, dz], i) => {
  e.part(x, dz, g => {
    g.fillStyle = '#3e2e20';
    g.fillRect(-0.05, -0.72, 0.1, 0.72);
    g.fillRect(-0.3, -0.04, 0.6, 0.04);
    g.beginPath();
    g.ellipse(0, -0.74, 0.5, 0.06, 0, 0, Math.PI * 2);
    g.fill();
    for (const s of [-0.75, 0.75]) {
      g.fillRect(s - 0.03, -0.45, 0.06, 0.45);
      g.fillRect(s - 0.18, -0.48, 0.36, 0.05);
    }
    g.fillStyle = '#c8c0a8';
    g.fillRect(-0.12, -0.86, 0.07, 0.1);
    g.fillStyle = '#2a3a2a';
    g.fillRect(0.12, -1.02, 0.07, 0.26);
    if (i === 0) e.at(0, -0.9, 'table');
  });
});
