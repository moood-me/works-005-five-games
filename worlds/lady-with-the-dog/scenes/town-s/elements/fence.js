// The near stretch of the grey fence — the part the shots along the street hold (x −5.0 … +6.5): the corner post on the
// left, the gate's opening (x 2.4…3.4, its leaf is the element `gate`), the posts. Its points: the corner, its ends in
// the frame (`gurov_at` 0 and 1), the five places of “By the fence” (p4 high, under her window), the poster.
const L = e.lib, season = e.state.season;
L.fenceBoards(g, L.CORNER_X, L.GATE.x0, season, 0);
L.fenceBoards(g, L.GATE.x1, 6.5, season, 9);
for (const x of [L.CORNER_X, L.GATE.x0 - 0.06, L.GATE.x1 + 0.06]) {       // the posts: the corner's, the gate's
  g.fillStyle = '#6e6c6c'; g.fillRect(x - 0.08, -2.75, 0.16, 2.75);
  g.fillStyle = '#58565a'; g.beginPath(); g.moveTo(x - 0.1, -2.75); g.lineTo(x, -2.9); g.lineTo(x + 0.1, -2.75); g.fill();
  const S = L.SEASONS[season]; if (S && S.snow) { g.fillStyle = S.snow; g.beginPath(); g.ellipse(x, -2.8, 0.12, 0.05, 0, Math.PI, 0); g.fill(); }
}
g.fillStyle = '#6e6c6c'; g.fillRect(L.GATE.x0 - 0.1, -2.75, L.GATE.x1 - L.GATE.x0 + 0.2, 0.1);   // the lintel over the gate
e.at(L.CORNER_X + 0.05, -1.5, 'corner');
e.at(L.gurovX(0), -1.2, 'left');
e.at(L.gurovX(1), -1.2, 'right');
L.PLACES.forEach((u, i) => e.at(L.gurovX(u), -L.PLACE_H[i], `p${i + 1}`));
e.at(L.POSTER_X, -1.65, 'poster');
