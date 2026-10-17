// The river beyond the clearing: still water under a breeze from its near bank (where the land goes below
// its level) to the forest far off — the engine mirrors the far bank, the pagoda, the sky, the sun's path
// and the fire's in it (reflect, rough, ripple).
const L = e.lib;
const V = L.plan.river;
const ax = 70; // the plane's across
const zc = 83.5; // its distance
g.fillStyle = '#42585c';
g.beginPath();
g.moveTo(-60, -64);
for (let a = 10; a <= 130; a += 1) {
  const s = L.bank(a);
  const d = L.shoreline(dd => L.ground(a, dd), s + 2, s - 8, V.level) ?? zc + 64;
  g.lineTo(a - ax, zc - d);
}
g.lineTo(60, -64);
g.closePath();
g.fill();
