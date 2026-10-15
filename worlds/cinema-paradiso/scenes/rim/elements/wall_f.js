// The screen wall: black around the screen, a low stage-step, the curtains drawn aside
const G = e.lib.G, W = G.WALL_X, H = G.CEIL, sw = G.SCREEN_W / 2;
g.fillStyle = '#141113'; g.fillRect(-W, -H - 0.05, 2 * W, H + 0.05);
for (const s of [-1, 1]) {
  const x0 = s < 0 ? -W : sw + 0.2, x1 = s < 0 ? -sw - 0.2 : W;
  for (let x = x0; x < x1; x += 0.12) { g.fillStyle = Math.round((x - x0) / 0.12) % 2 ? '#4a1a1e' : '#3a1418'; g.fillRect(x, -H + 0.1, 0.12, H - 0.1); }
}
g.fillStyle = '#231a16'; g.fillRect(-W, -0.5, 2 * W, 0.5);
