const N = e.kit.sky;
// The lantern on the veranda's beam, over the table: its glass, cold — and lit (a layer its animate shows by
// `tavern_lamp`); its light is the scene's (`lights`: lantern), its point `lamp`
g.fillStyle = "#8f979c";
g.fillRect(-0.1, -0.34, 0.2, 0.32);
e.layer("lit", {}, (g) => {
  g.fillStyle = N.WARM;
  g.fillRect(-0.1, -0.34, 0.2, 0.32);
  e.light(0, -0.18, 2.2, N.WARM, 0.8, "lamp");
});
e.at(0, -0.18, "lamp");
