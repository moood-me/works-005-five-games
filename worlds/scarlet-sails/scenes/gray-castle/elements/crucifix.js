// The great painting of the crucifixion (canvas 1.76 × 2.56 m in a thin dark-gold frame; x across, y up from its foot,
// 2 m over the floor): the picture is lib.js `crucifixion`; the fresh paint over the nails — layers (lib.js `dabs`),
// grown by nail1…nail3 (crucifix.animate.js). Its points: `nail1…3`, `crucifix`.
g.fillStyle = "#7a6440";
g.fillRect(-0.94, -2.64, 1.88, 2.68);
g.fillStyle = "#4d3d27";
g.fillRect(-0.9, -2.6, 1.8, 2.6);
e.lib.crucifixion(g);
e.lib.dabs(e);
e.at(0, -1.3, "crucifix");
