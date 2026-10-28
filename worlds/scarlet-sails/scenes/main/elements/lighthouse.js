// The lighthouse on the cape's end: a thin white tower, its lamp room dark glass — its light is `lighthouse_light`
const CLIFF = 16;
const TALL = 22;
g.fillStyle = "#eef0ee";
g.beginPath();
g.moveTo(-1.6, -CLIFF + 0.5);
g.lineTo(-1.05, -CLIFF - TALL + 3);
g.lineTo(1.05, -CLIFF - TALL + 3);
g.lineTo(1.6, -CLIFF + 0.5);
g.fill();
g.fillStyle = "#4f5862";
g.fillRect(-1.3, -CLIFF - TALL + 0.6, 2.6, 0.5);
g.fillRect(-0.95, -CLIFF - TALL + 1.1, 1.9, 1.9);
g.fillRect(-1.25, -CLIFF - TALL * 0.55, 2.5, 1.4);
e.at(0, -CLIFF - TALL + 1.6, "light");
