// The stream: dark water lying in its channel, from the viewer's feet under the trail into the forest — as
// wide as the land leaves it below its level (lib.shoreline over the relief); the engine mirrors the trees
// and the sky in it.
const L = e.lib;
const S = L.plan.stream;
const ax = 7.5; // the plane's across
const zc = 22; // its distance
const side = [];
for (let d = 1.5; d <= S.to; d += 0.25) {
  const c = L.stream(d);
  const w = L.shoreline(x => L.ground(c + x, d), 0, S.w, S.level);
  if (w !== null) side.push([c, d, w]);
}
g.fillStyle = '#34443e';
g.beginPath();
for (const [c, d, w] of side) g.lineTo(c + w - ax, zc - d);
for (const [c, d, w] of side.reverse()) g.lineTo(c - w - ax, zc - d);
g.closePath();
g.fill();
