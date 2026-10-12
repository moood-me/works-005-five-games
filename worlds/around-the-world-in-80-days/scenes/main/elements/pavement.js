// Pall Mall's roadway and pavements outside, seen from above: dark setts, the kerb a paler line — what the eye sees of the
// street over the sills. Painted flat in its daylight colours; the gas lamps lay their pools on it.
g.fillStyle = '#3c3e40';
g.fillRect(-30, -12, 60, 24);
// the kerb along the pavement before the club, and the far one before the houses
g.fillStyle = '#5a5c5c';
g.fillRect(-30, 6.5, 60, 0.2);
g.fillRect(-30, -9.2, 60, 0.2);
// the setts: rows across, each a hair lighter or darker
for (let y = -9, i = 0; y < 6.5; y += 0.5, i++) {
  g.fillStyle = `rgba(${e.anim.hash(i, 3) > 0.5 ? '255,255,255' : '0,0,0'},${0.02 + 0.03 * e.anim.hash(i, 4)})`;
  g.fillRect(-30, y, 60, 0.5);
}
