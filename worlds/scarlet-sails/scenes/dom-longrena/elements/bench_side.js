// The workbench's long side, toward the room (x along the bench, to the window): the thick edge
// of its top, the apron under it, square legs, a rail low between them
g.fillStyle = "#89857f";
g.fillRect(-1, -0.9, 2, 0.06);
g.fillStyle = "#76736d";
g.fillRect(-0.96, -0.84, 1.92, 0.1);
for (const x of [-0.96, 0.89]) {
  g.fillStyle = "#65635e";
  g.fillRect(x, -0.84, 0.07, 0.84);
}
g.fillStyle = "#65635e";
g.fillRect(-0.9, -0.24, 1.8, 0.04);
