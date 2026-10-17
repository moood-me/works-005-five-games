// The little square of the home movie on the partition (its face to the corner): the faded colour of the 8 mm reel —
// the square at dusk (kino.frame elena8, layer `film`) — and the girl crossing it (layer `girl`, moved by animate:
// as much of her as he caught, the party's `share`). It glows its own: seen only while the projector runs (animate).
const W = e.lib.G.SCREEN_W, H = e.lib.G.SCREEN_H;
e.layer('film', { flicker: 0.18 }, l => {
  e.kit.kino.frame(l, 'elena8', -W / 2, -H, W, H);
  // the light's own soft edge
  const v = l.createRadialGradient(0, -H / 2, H * 0.3, 0, -H / 2, W * 0.62);
  v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(20,14,10,0.6)');
  l.fillStyle = v; l.fillRect(-W / 2, -H, W, H);
});
e.layer('girl', { flicker: 0.18, box: [-W / 2 - 0.4, -H, W / 2 + 0.4, 0] }, l => {
  e.kit.kino.elena8Girl(l, 0, -H * 0.2, H * 0.62);
});
e.at(0, -H / 2, 'square');
