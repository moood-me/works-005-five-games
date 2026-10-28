
// the platform from above: big limestone flags, the white line along the edge, worn; the station's own strip
const now = e.state.era === 'now', an = e.anim;
const W = 60, D = 4.25;
g.fillStyle = now ? '#8a847a' : '#bcae92'; g.fillRect(-W, -D, 2 * W, 2 * D);
for (let row = 0, y = -D; y < D; y += 0.8, row++) for (let k = 0, x = -W - (row % 2) * 0.5; x < W; x += 1.0, k++) {
  g.fillStyle = an.hash(row * 211 + k, 5) < 0.5 ? (now ? '#86807a' : '#b5a88c') : (now ? '#908a80' : '#c3b598');
  g.fillRect(x + 0.03, y + 0.03, 0.94, 0.74);
}
g.fillStyle = now ? '#c8c4b8' : '#ece4cc'; g.fillRect(-W, -D + 0.45, 2 * W, 0.08);
