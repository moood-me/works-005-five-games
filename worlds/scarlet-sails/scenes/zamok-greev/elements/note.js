// Grey's note on the table, seen from above: a folded sheet, a little askew (layer `sheet`, shown by `note`:
// note.animate.js)
e.layer("sheet", {}, (c) => {
  c.rotate(0.22);
  c.fillStyle = "#e9e3d6";
  c.fillRect(-0.1, -0.07, 0.2, 0.14);
  c.fillStyle = "rgba(90,80,70,0.25)";
  c.fillRect(-0.1, -0.003, 0.2, 0.006);
});
