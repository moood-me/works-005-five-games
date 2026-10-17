// The fireplace's surround: one slab of pale stone round the opening, faint veins (x across, anchor
// 0.25 m right; the opening as in the wall). It hides the fire from the hall but at its opening:
// its shadow from the fire makes the light come out of the opening only.
g.fillStyle = "#d3cbbd";
g.beginPath();
g.rect(-1.3, -1.6, 2.6, 1.6);
g.rect(-0.75, -1.1, 1.5, 0.95);
g.fill("evenodd");
g.strokeStyle = "rgba(120,108,92,0.22)";
g.lineWidth = 0.006;
for (let i = 0; i < 6; i++) {
  const y = -1.55 + e.anim.hash(i, 1) * 1.4;
  g.beginPath();
  g.moveTo(-1.3, y);
  g.bezierCurveTo(-0.6, y + 0.2 * (e.anim.hash(i, 2) - 0.5), 0.4, y - 0.25 * (e.anim.hash(i, 3) - 0.5), 1.3, y + 0.1);
  g.stroke();
}
e.at(0, -0.6, "fireplace");
