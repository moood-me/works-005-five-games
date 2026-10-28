// The library ladder leaning on the wall (x across, y up along it from its feet): two rails, the rungs; `ladder` moves
// it from the corner by the windows to under the crucifixion. Its points: `ladder`, and where the boy's hands hold its
// right rail as he pulls it (`rail_hi`, `rail_lo`).
g.fillStyle = "#8f7c62";
g.fillRect(-0.24, -3.05, 0.045, 3.05);
g.fillRect(0.195, -3.05, 0.045, 3.05);
g.fillStyle = "#a08c70";
for (let y = -0.28; y > -3; y -= 0.28) g.fillRect(-0.2, y, 0.4, 0.03);
e.at(0, -1.6, "ladder");
e.at(0.22, -0.98, "rail_hi");
e.at(0.22, -0.74, "rail_lo");
