// The far shore's lights: a window lit in many of its houses (lib.houses), the bigger ones by the water glowing
// (e.light) — their long paths lie on the water. Painted lit, a layer its animate shows as much as the lanterns are lit.
const L = e.lib;
const h = e.anim.hash;
const lights = [];
e.layer('lit', {}, g => {
  L.houses(L.portOf(e.state)).forEach(([x, y, w, hh], i) => {
    if (h(i, 31) < 0.35) return;
    const a = 0.55 + 0.45 * h(i, 32);
    g.fillStyle = L.rgba(L.mixc('#ffd690', '#ffaa58', h(i, 33)), a);
    g.fillRect(x + w * 0.3, -y - hh * 0.6, Math.max(1.6, w * 0.3), Math.max(1.6, hh * 0.3));
    if (y < 14 && h(i, 34) < 0.3) lights.push([x + w / 2, -y - hh / 2, a]);
  });
  for (const [x, y, a] of lights) e.light(x, y, 5, '#ffc070', 0.6 * a, 'shore');
});
