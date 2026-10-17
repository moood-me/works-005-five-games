// What is seen in the tavern's doorway: the dark of the room — warm with its lamp lit (a layer, `tavern_lamp`)
g.fillStyle = "#2e3238";
g.fillRect(-0.9, -2.3, 1.8, 2.3);
e.layer("lit", {}, (g) => {
  g.fillStyle = e.kit.nebo.rgba(e.kit.nebo.WARM, 0.8);
  g.fillRect(-0.9, -2.3, 1.8, 2.3);
  e.light(0, -1.2, 0.9, e.kit.nebo.WARM, 0.4, "room");
});
