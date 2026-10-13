// The tavern's door: planks, hinged on the left (x 0 → 1 from the hinge); `tavern_door` turns it into the house
g.fillStyle = "#8d8a84";
g.fillRect(0, -2.1, 1, 2.1);
g.fillStyle = "#6b6964";
for (let i = 1; i < 5; i++) g.fillRect(0.2 * i, -2.1, 0.012, 2.1);
g.fillStyle = "#313131";
g.fillRect(0.84, -1.1, 0.05, 0.14);
e.at(0.5, -1.05, "door");
