// Wolves loping along the edge of the plain after the sledge: four grey wolves, each in three strides, each stride a
// layer shown at its time (animate), all of them as near as `wolves` brings them.
const L = e.lib, COLS = ['#7d7a74', '#6a6862', '#8c877e', '#75716a'], XS = [-8, -3.5, 1.5, 6.5];
XS.forEach((x, k) => {
  for (let f = 0; f < 3; f++) e.layer(`w${k}f${f}`, { box: [x - 1.2, -1.4, x + 1.2, 0.2] }, g => L.wolf(g, x, f, COLS[k]));
});
