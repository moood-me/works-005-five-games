const N = e.kit.nebo;
const L = e.lib;

// The windows of Kaperna, lit: each a glow in its house's place (parts, as `kaperna` stands them: `w0`… by its index
// through the village; Longren's to the sea the last, warm) — its animate lights as many as `windows` says, each at its
// own moment, and Longren's as `longren_window`. A light of its own: the night does not darken it.
for (const p of L.houses(e)) {
  e.part(p.X - L.HILL.across, p.Z - 200, (g) => {
    p.windows.forEach(([x, y, w, h, n], i) => {
      const longren = p.longren && i === p.windows.length - 1;
      if (longren) e.at(x, y, "longren_window");
      e.light(x, y, longren ? 2.2 : 1.2, longren ? N.WARM : N.PALE, longren ? 3 : 0.7, L.WINDOW_NAMES[n]);
    });
  }, p.box);
}
