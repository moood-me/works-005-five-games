// The three carriages ahead of hers, one painting (metres, origin at the first one's middle, on the rail).
for (let k = 0; k < 3; k++) {
  g.save(); g.translate(k * e.lib.CAR, 0);
  e.lib.carriage(g, {});
  g.restore();
}
