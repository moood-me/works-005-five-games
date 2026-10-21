// Yokohama only: the row of white paper lanterns over Batulcar's stage on the pontoon, on poles from the landing.
const L = e.lib;
if (L.portOf(e.state) === 'yokohama') {
  const P = L.plan;
  L.lanternRow(e, g, { half: P.stage.half + 0.4, high: P.stage.h + 4.2, n: 9, foot: 0, colors: L.LANTERN_COLORS('yokohama') });
}
