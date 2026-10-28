// The railings along the row before the houses: black bars between two rails, a point on each; open at each
// flight of steps and where the side street goes off.
const L = e.lib;
const P = L.plan;
const ax = P.row;
const gaps = [...L.houses.map(h => [h.door - P.steps.w / 2 - 0.2, h.door + P.steps.w / 2 + 0.2]), P.side].sort((a, b) => a[0] - b[0]);
g.fillStyle = '#1b1d20';
let from = P.terrace[0];
for (const [a, b] of [...gaps, [P.block[1], P.block[1]]]) {
  if (a > from) {
    g.fillRect(from - ax, -0.98, a - from, 0.035);
    g.fillRect(from - ax, -0.16, a - from, 0.03);
    for (let x = from + 0.06; x < a; x += 0.13) {
      g.fillRect(x - ax - 0.009, -1.05, 0.018, 1.05);
      g.beginPath();
      g.moveTo(x - ax - 0.028, -1.05);
      g.lineTo(x - ax, -1.14);
      g.lineTo(x - ax + 0.028, -1.05);
      g.fill();
    }
  }
  from = Math.max(from, b);
}
