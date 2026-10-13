const N = e.kit.nebo;
// The tavern's windows lit (tavern_lamp), over the front wall's own dark panes (the same metres) — a layer and glows
// its animate lights
e.layer("lit", {}, (g) => {
  g.fillStyle = N.PALE;
  for (const [x, w] of e.lib.TAVERN_WINDOWS) {
    g.fillRect(x, -2.8, w, 1.1);
    e.light(x + w / 2, -2.25, 0.8, N.PALE, 0.4, "windows");
  }
});
