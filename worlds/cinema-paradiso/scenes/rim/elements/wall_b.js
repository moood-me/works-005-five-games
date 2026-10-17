// The back wall (seen from the room: x to the world's left) with the projection port: an opening in it
const G = e.lib.G, W = G.WALL_X, H = G.CEIL, pw = G.PORT_W / 2, ph = G.PORT_H / 2, py = -G.PORT[1];
g.save(); g.beginPath(); g.rect(-W, -H - 0.05, 2 * W, H + 0.05); g.rect(-pw, py - ph, 2 * pw, 2 * ph); g.clip('evenodd');
e.lib.panels(g, -W, W, H, 11);
g.restore();
