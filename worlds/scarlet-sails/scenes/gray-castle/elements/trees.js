const A = e.anim;

// The park's trees, each a part where it stands (metres from the anchor: 30 m left, 20 m ahead, on
// the park's ground): tall narrow poplars and round limes in clipped crowns — soft, dark, quiet
// masses against the sky. Their shadows lie on the lawn.
const TREES = [
  [12, -14, "lime", 9], [6, -4, "poplar", 15], [14, 6, "lime", 10], [8, 14, "poplar", 16],
  [-4, 4, "lime", 11], [-6, 20, "poplar", 17], [2, 30, "lime", 10], [-14, 34, "poplar", 15],
  [-2, 46, "lime", 12], [-22, 12, "lime", 9], [-26, 50, "poplar", 16], [10, 40, "lime", 9],
  [-30, -6, "poplar", 14], [16, 24, "lime", 8],
];
TREES.forEach(([dx, dz, kind, h], i) => {
  const w = kind === "poplar" ? h * 0.16 : h * 0.42;
  e.part(dx, dz, (p) => {
    p.fillStyle = "#4a4740";
    p.fillRect(-0.18, -h * 0.4, 0.36, h * 0.4);
    p.fillStyle = A.hash(i, 3) < 0.5 ? "#4f5a4c" : "#56604f";
    p.beginPath();
    if (kind === "poplar") p.ellipse(0, -h * 0.55, w, h * 0.45, 0, 0, 7);
    else p.ellipse(0, -h * 0.62, w, h * 0.36, 0, 0, 7);
    p.fill();
  }, [-w - 0.3, -h - 0.2, w + 0.3, 0.3]);
});
