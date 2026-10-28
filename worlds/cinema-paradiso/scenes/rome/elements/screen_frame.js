// the screen's black border and its sheet (dark grey when nothing is shown)
const G = e.lib.G, w = G.SCREEN_W / 2, h = G.SCREEN_H;
g.fillStyle = '#0b0a0a'; g.fillRect(-w - 0.12, -h - 0.12, 2 * w + 0.24, h + 0.24);
g.fillStyle = '#5a5752'; g.fillRect(-w, -h, 2 * w, h);
