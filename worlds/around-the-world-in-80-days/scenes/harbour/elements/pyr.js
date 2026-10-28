// Yokohama only: the acrobats' mat on Batulcar's stage, where the Long Noses' pyramid stands — its foot's three places
// (pyr#b0, b1, b2: those at the bottom stand there, Passepartout in the middle); it sways aside as the pyramid does
// (`pyr_x`: the script, by `tilt`).
if (e.lib.portOf(e.state) === 'yokohama') {
  g.fillStyle = '#8a2e2a';
  g.fillRect(-1.5, -0.06, 3, 0.06);
  g.fillStyle = '#d8b050';
  g.fillRect(-1.5, -0.065, 3, 0.015);
  const gap = e.lib.PYR_GAP;
  e.at(-gap, 0, 'b0');
  e.at(0, 0, 'b1');
  e.at(gap, 0, 'b2');
}
