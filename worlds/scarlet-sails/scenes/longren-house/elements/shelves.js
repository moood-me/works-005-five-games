// Longren's shelves on the wall to the sea (x from the card's centre, 0.8 m left of the start): three boards left of
// the window and one over it, his toys on them — sloops, schooners, little steam launches, each a layer (its animate
// takes them away one by one as `toys` grows). Assol's yacht on the board over the window is the element `toy`.
const L = e.lib;
const BOARDS = [
  [-0.6, 0.6, 1.35],
  [-0.6, 0.6, 1.75],
  [-0.6, 0.6, 2.15],
  [0.7, 2.4, 2.2],
];
for (const [x0, x1, h] of BOARDS) {
  g.fillStyle = "#9c9a94";
  g.fillRect(x0, -h, x1 - x0, 0.035);
  g.fillStyle = "#716f6a";
  g.fillRect(x0, -h + 0.035, x1 - x0, 0.015);
  g.fillRect(x0 + 0.1, -h + 0.05, 0.02, 0.08);
  g.fillRect(x1 - 0.12, -h + 0.05, 0.02, 0.08);
}
L.TOYS.forEach(([kind, x, h, size, hull], i) => {
  e.layer(L.TOY_LAYERS[i], { box: L.toyBox(x, h, size), depth: 0.06 }, (g) => L.toy(g, kind, x, h, size, hull, "#efece4"));
});
// (the place of Assol's yacht on the board over the window — the element `toy` — where it stands, or will)
e.at(L.YACHT[0], -L.YACHT[1] - 0.2, "yacht");
e.at(0, -1.75, "shelves");
