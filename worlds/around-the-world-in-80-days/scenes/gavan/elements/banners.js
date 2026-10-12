// The troupe's two banners on tall poles either side of the stage (Yokohama only): long white cloths, a red block at the
// top, an indigo one below — each cloth a layer hanging from its crossbar, stirring in the wind.
const L = e.lib;
if (L.portOf(e.state) === 'yokohama') {
  const S = L.plan.stage;
  [-S.half - 1.4, S.half + 1.4].forEach((x, i) => {
    g.fillStyle = '#2e2620';
    g.fillRect(x - 0.05, -6.2, 0.1, 6.2);
    g.fillRect(x - 0.05, -6.2, 0.75, 0.06);
    e.layer(`cloth${i}`, { pivot: [x + 0.36, -6.1], wind: { strength: 0.35, gust: 0.6 } }, g => {
      g.fillStyle = '#efe6d4';
      g.fillRect(x + 0.05, -6.1, 0.62, 4.0);
      g.fillStyle = '#b8342a';
      g.fillRect(x + 0.05, -6.1, 0.62, 0.8);
      g.fillStyle = '#2c3a5a';
      g.fillRect(x + 0.18, -4.9, 0.36, 2.2);
    });
  });
}
