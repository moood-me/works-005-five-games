// The windows' frames at the outer face of the wall: slim dark bronze, two lights wide, four high
// (x along the wall, as `wall_left`; y from the sill up)
const BRONZE = "#38312a";
g.fillStyle = BRONZE;
for (const x0 of [-1.75, 1.25]) {
  g.beginPath();
  g.rect(x0, -4.4, 1.4, 4.4);
  g.rect(x0 + 0.06, -4.34, 1.28, 4.28);
  g.fill("evenodd");
  g.fillRect(x0 + 0.675, -4.4, 0.05, 4.4);
  for (const y of [-1.1, -2.2, -3.3]) g.fillRect(x0, y - 0.0225, 1.4, 0.045);
}
