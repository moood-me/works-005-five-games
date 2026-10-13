// The wheel on its pedestal (x to starboard): two uprights; the wheel itself — a rim of wood, eight spokes run out into
// handles, the brass hub — a layer its animate turns as `helm` says. Its hub and the two places on its rim where the
// helmsman's hands lie are marked (wheel#wheel, wheel#rim_l, wheel#rim_r).
const c = e.lib.colours(e.state);
const C = -1.15;
g.fillStyle = c.rail;
g.fillRect(-0.3, -0.06, 0.6, 0.06);
g.fillRect(-0.16, C, 0.07, -C);
g.fillRect(0.09, C, 0.07, -C);
e.layer("wheel", { pivot: [0, C] }, g => {
  g.translate(0, C);
  g.strokeStyle = c.rail;
  g.lineWidth = 0.065;
  g.beginPath();
  g.arc(0, 0, 0.6, 0, 7);
  g.stroke();
  g.lineCap = "round";
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * 2 * Math.PI;
    g.lineWidth = 0.035;
    g.beginPath();
    g.moveTo(0, 0);
    g.lineTo(Math.cos(a) * 0.62, Math.sin(a) * 0.62);
    g.stroke();
    g.lineWidth = 0.045;
    g.beginPath();
    g.moveTo(Math.cos(a) * 0.64, Math.sin(a) * 0.64);
    g.lineTo(Math.cos(a) * 0.78, Math.sin(a) * 0.78);
    g.stroke();
  }
  g.fillStyle = "#a08850";
  g.beginPath();
  g.arc(0, 0, 0.08, 0, 7);
  g.fill();
});
e.at(0, C, "wheel");
e.at(-0.5, C - 0.33, "rim_l");
e.at(0.5, C - 0.33, "rim_r");
