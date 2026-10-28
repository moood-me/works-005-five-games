// The kitchen's back wall: whitewash above, green oil paint below a dark line; the window cut through it (its glass,
// frame and sill are `window`, `window_frame`, `sill`); a little shelf with two mugs right of it. Metres; 4 wide,
// x = across (the plan's x − 2).
const L = e.lib, W = L.WINDOW, x0 = L.A(W.x) - W.w / 2;
L.kitchenWall(g, e, 4);
g.globalCompositeOperation = 'destination-out';
g.fillRect(x0, -(W.sill + W.h), W.w, W.h);
g.globalCompositeOperation = 'source-over';
g.fillStyle = '#5a4434';
g.fillRect(0.95, -1.62, 0.6, 0.04);
g.fillRect(1.0, -1.6, 0.03, 0.12);
g.fillRect(1.47, -1.6, 0.03, 0.12);
g.fillStyle = '#e8e2d4';
g.fillRect(1.05, -1.75, 0.1, 0.13);
g.fillStyle = '#4d6a86';
g.fillRect(1.25, -1.73, 0.09, 0.11);
