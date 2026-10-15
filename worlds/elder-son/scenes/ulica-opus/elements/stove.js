// The Russian stove against the left wall: whitewashed brick, its iron plate with a kettle, the little fire door with
// the fire behind it (its glow `fire`). Metres; 1.4 wide along the wall, 2.1 high.
g.fillStyle = '#e4ddcf';
g.fillRect(-0.7, -2.1, 1.4, 2.12);
g.fillStyle = '#cfc6b4';
g.fillRect(-0.7, -1.0, 1.4, 0.06);
g.fillRect(-0.7, -2.1, 1.4, 0.08);
g.fillStyle = '#2d2b2a';
g.fillRect(-0.62, -1.06, 1.24, 0.07);
g.fillStyle = '#5e5953';
g.beginPath();
g.ellipse(0.25, -1.17, 0.13, 0.1, 0, 0, Math.PI * 2);
g.fill();
g.fillStyle = '#26211e';
g.fillRect(-0.24, -0.7, 0.36, 0.3);
g.fillStyle = '#e8813a';
g.fillRect(-0.2, -0.66, 0.28, 0.06);
e.light(-0.06, -0.55, 0.35, '#e07a35', 0.8, 'fire');
