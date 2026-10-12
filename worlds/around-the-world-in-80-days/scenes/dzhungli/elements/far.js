// The forest far off, beyond everything: the canopy against the sky in two ranges — rounded crowns over a ragged mass —,
// the farther one a part 110 m behind (the engine's haze pales it); on the right it is the river's far bank. Painted
// clear, in the canopy's own green.
const h = e.anim.hash, n = e.anim.noise;
const range = (g, lift, col, seed) => {
  g.fillStyle = col;
  const top = x => lift + 7 * n(x / 50, seed);
  g.beginPath();
  g.moveTo(-320, 4);
  for (let x = -320; x <= 320; x += 4) g.lineTo(x, -top(x) + 3);
  g.lineTo(320, 4);
  g.closePath();
  g.fill();
  for (let i = 0; i < 150; i++) {
    const x = -320 + 640 * h(i, seed * 7), r = 3 + 6 * h(i, seed * 7 + 1);
    g.beginPath();
    g.ellipse(x, -top(x) + r * 0.3, r, r * 0.55, 0, Math.PI, 0);
    g.fill();
  }
};
e.part(0, 110, gp => range(gp, 30, '#4e6848', 1), [-330, -50, 330, 4]);
range(g, 15, '#46603f', 2);
