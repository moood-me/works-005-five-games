// The screen wall: fabric panels round the screen, a red pelmet with a gold fringe over it, the curtains drawn aside,
// a low stage-step
const G = e.lib.G, W = G.WALL_X, H = G.CEIL, sw = G.SCREEN_W / 2, top = G.SCREEN_Y + G.SCREEN_H;
e.lib.panels(g, -W, W, H, 23);
g.fillStyle = '#5a1e22'; g.fillRect(-sw - 0.6, -H + 0.05, 2 * sw + 1.2, H - top - 0.15);
for (let x = -sw - 0.6; x < sw + 0.6; x += 0.3) { g.fillStyle = 'rgba(0,0,0,0.18)'; g.fillRect(x, -H + 0.05, 0.03, H - top - 0.15); }
g.fillStyle = '#b08a48'; g.fillRect(-sw - 0.6, -top - 0.14, 2 * sw + 1.2, 0.05);
for (const s of [-1, 1]) {
  const x0 = s < 0 ? -sw - 0.75 : sw + 0.15;
  for (let x = x0; x < x0 + 0.6; x += 0.1) { g.fillStyle = Math.round((x - x0) / 0.1) % 2 ? '#6a2228' : '#521a1e'; g.fillRect(x, -top - 0.1, 0.1, top + 0.1); }
}
g.fillStyle = '#231a16'; g.fillRect(-W, -0.5, 2 * W, 0.5);
