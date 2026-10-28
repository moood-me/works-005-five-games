// The lit panes of all four carriages (hers first, its own window left open): they glow warm from inside.
for (let k = 0; k < 4; k++) {
  g.save(); g.translate(k * e.lib.CAR, 0);
  e.lib.carriage(g, { lit: true, hole: k === 0 ? e.lib.HER_WIN : null });
  g.restore();
}
