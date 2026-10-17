// The door: planks, hinged on the right (x −0.87 → 0 from the hinge, over the frame's stop); `door`
// turns it into the room
g.fillStyle = "#989691";
g.fillRect(-0.87, -2, 0.87, 2);
g.fillStyle = "#75746f";
for (let i = 1; i < 5; i++) g.fillRect(-0.85 + 0.17 * i, -2, 0.012, 2);
g.fillStyle = "#313131";
g.fillRect(-0.77, -1.05, 0.05, 0.14);
e.at(-0.425, -1, "door");
