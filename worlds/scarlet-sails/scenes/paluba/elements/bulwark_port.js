// The port bulwark, its inner face (x forward, from 7.5 m ahead of the start; from the main deck
// up): along the poop an open rail 1 m over it — stanchions, a rope, the caprail; down the step at the
// break, the waist's solid bulwark, stanchions, the caprail over them
const c = e.lib.colours(e.state);
const run = (x0, x1, y0, y1) => {
  g.fillStyle = c.bulwark;
  g.fillRect(Math.min(x0, x1), y1, Math.abs(x1 - x0), y0 - y1);
  g.fillStyle = "rgba(40,36,30,0.12)";
  for (let x = Math.min(x0, x1) + 0.6; x < Math.max(x0, x1); x += 1.2) g.fillRect(x, y1, 0.09, y0 - y1);
  g.fillStyle = c.rail;
  g.fillRect(Math.min(x0, x1) - 0.04, y1 - 0.09, Math.abs(x1 - x0) + 0.08, 0.12);
};
g.fillStyle = c.rail;
g.fillRect(-10.56, -2.46, 9.1, 0.07);
g.fillRect(-10.5, -1.93, 9, 0.02);
for (let x = -10.5; x <= -1.49; x += 1.8) g.fillRect(x - 0.03, -2.42, 0.06, 1.02);
run(-1.5, 10.5, 0, -1.1);
g.fillStyle = c.bulwark;
g.fillRect(-1.55, -2.4, 0.1, 1.3);
e.at(-5.5, -2.45, "rail_port");
