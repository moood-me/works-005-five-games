// The kitchen's back wall: whitewash above, green oil paint below a dark line; the window cut through it (its frame
// and frost are `window`). Metres; 4 wide, 2.6 high.
const L = e.lib, W = L.WINDOW, x0 = W.a - W.w / 2, top = -(W.sill + W.h);
e.lib.kitchenWall(g, e, 4);
g.globalCompositeOperation = 'destination-out';
g.fillRect(x0, top, W.w, W.h);
g.globalCompositeOperation = 'source-over';
