// The ends of wood standing up out of the box, leaning this way and that
const STICKS = [
  [-0.16, 0.2, -0.12], [-0.06, 0.28, 0.05], [0.05, 0.17, -0.2], [0.13, 0.24, 0.15], [0.0, 0.12, 0.3],
];
for (const [sx, len, lean] of STICKS) {
  g.save();
  g.translate(sx, 0);
  g.rotate(lean);
  g.fillStyle = "#b0a99c";
  g.fillRect(-0.02, -len, 0.04, len);
  g.restore();
}
