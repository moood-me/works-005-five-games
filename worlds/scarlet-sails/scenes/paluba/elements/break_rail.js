// The rail along the poop's break, over the waist (x to starboard): a slim caprail and a rope under
// it on a few stanchions, open in the middle over the ladder down — the main deck seen through it
const c = e.lib.colours(e.state);
g.fillStyle = c.rail;
for (const [x0, x1] of [[-4.15, -0.7], [0.7, 4.15]]) {
  g.fillRect(x0, -1.05, x1 - x0, 0.06);
  g.fillRect(x0, -0.55, x1 - x0, 0.02);
  for (let x = x0; x <= x1 + 0.01; x += (x1 - x0) / 3) g.fillRect(x - 0.03, -1.03, 0.06, 1.03);
}
