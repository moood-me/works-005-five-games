// The neighbours' rooms, seen through their windows: their back walls, dark.
const L = e.lib;
const P = L.plan;
for (const h of L.houses) {
  if (h.fogg) continue;
  g.fillStyle = L.rgba(L.mixc('#4a4741', '#5a554c', h.tone));
  g.fillRect(h.x0 - P.row, -P.parapet, h.x1 - h.x0, P.parapet - P.floors[0]);
}
