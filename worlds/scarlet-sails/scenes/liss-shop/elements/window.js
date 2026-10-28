// The big window in the left wall: a light frame round the opening, two mullions and a transom, a sill. The glass is
// not painted (the opening is clear): the street is seen through it
g.fillStyle = "#f2efe8";
g.beginPath();
g.rect(-1.2, -2.7, 2.4, 1.85);
g.rect(-1.1, -2.6, 2.2, 1.65);
g.fill("evenodd");
g.fillRect(-0.4, -2.6, 0.05, 1.65);
g.fillRect(0.35, -2.6, 0.05, 1.65);
g.fillRect(-1.1, -1.85, 2.2, 0.04);
g.fillStyle = "#d9d2c0";
g.fillRect(-1.25, -0.95, 2.5, 0.05);
e.at(0, -1.8, "window");
