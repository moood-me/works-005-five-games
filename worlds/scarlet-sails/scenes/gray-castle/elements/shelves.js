const A = e.anim;

// The library: books floor to ceiling along the right wall (x along it, + back toward the start;
// anchor 3.75 m ahead), the shelves of dark wood, uprights every metre or so; over the mother's door
// (x −2.6…−1.3) only from 3 m up. Books in quiet colours, upright, a few leaning, gaps here and there.
const SPINES = ["#5a4636", "#6b5a40", "#3f4a40", "#5c3a32", "#7a6a50", "#4a4440", "#8a7c62", "#c2b49a", "#364048"];
const RUNS = [[-5.25, -2.6, 0], [-2.6, -1.3, 3.0], [-1.3, 5.25, 0]];
const ROW = 0.38;
g.fillStyle = "#33281f";
for (const [x0, x1, from] of RUNS) g.fillRect(x0, -6, x1 - x0, 6 - from);
let n = 0;
for (const [x0, x1, from] of RUNS) {
  for (let y = -from - 0.06; y > -5.95; y -= ROW) {
    g.fillStyle = "#4a3a2d";
    g.fillRect(x0, y, x1 - x0, 0.03);
    let x = x0 + 0.02;
    while (x < x1 - 0.06) {
      n++;
      const w = 0.025 + 0.045 * A.hash(n, 1);
      if (A.hash(n, 5) < 0.05) {
        x += 0.12 + 0.2 * A.hash(n, 6);
        continue;
      }
      const h = ROW * (0.55 + 0.32 * A.hash(n, 2));
      g.fillStyle = SPINES[Math.floor(A.hash(n, 3) * SPINES.length)];
      if (A.hash(n, 7) < 0.04) {
        g.save();
        g.translate(x, y);
        g.rotate(0.3);
        g.fillRect(0, -h, w, h);
        g.restore();
        x += h * 0.35 + w;
        continue;
      }
      g.fillRect(x, y - h, w, h);
      if (A.hash(n, 4) < 0.3) {
        g.fillStyle = "rgba(210,180,120,0.35)";
        g.fillRect(x, y - h * 0.82, w, 0.008);
      }
      x += w + 0.003;
    }
  }
  g.fillStyle = "#2a2019";
  for (let x = x0; x <= x1 + 0.01; x += (x1 - x0) / Math.max(1, Math.round((x1 - x0) / 1.05))) g.fillRect(x - 0.02, -6, 0.04, 6 - from);
}
e.at(2, -1.6, "shelves");
