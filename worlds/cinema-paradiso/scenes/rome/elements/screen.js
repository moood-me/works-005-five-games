// The screen (cinema.screen): every frame of the reel its own layer, and white; it glows — a lit screen is light
const G = e.lib.G, w = G.SCREEN_W / 2, h = G.SCREEN_H;
e.kit.cinema.screen(g, e, { x: -w, y: -h, w: 2 * w, h, sheet: 'rgba(0,0,0,0)', frames: [...e.lib.REEL, 'white'] });
