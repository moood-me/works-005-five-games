// The canvas close (an insert over the hall, opened by `canvas`): the crucifixion on the wall, near — its nails, and the
// boy's hand with the brush. The picture is the hall's own (lib.js `crucifixion`, 0.46 of its size, its foot below
// the frame); the fresh paint over the nails — the same layers as on the wall (lib.js `dabs`: nail1…3), its points
// `canvas#nail1…3` the game's. The hand (layer `hand`) goes to the nail being painted (canvas.animate.js).
const C = e.lib.CLOSE, mid = e.aspect / 2;
// the wall either side, the frame, the canvas
g.fillStyle = "#8b7d6b";
g.fillRect(-0.4, -0.4, e.aspect + 0.8, 1.8);
g.save();
g.translate(mid, C.y0);
g.scale(C.k, C.k);
g.fillStyle = "rgba(30,22,16,0.35)";
g.fillRect(-0.9, -2.7, 1.9, 2.8);
g.fillStyle = "#7a6440";
g.fillRect(-0.94, -2.64, 1.88, 2.68);
g.fillStyle = "#4d3d27";
g.fillRect(-0.9, -2.6, 1.8, 2.6);
e.lib.crucifixion(g);
g.restore();
// the hall's dusk round the edges of the shot
const vg = g.createRadialGradient(mid, 0.5, 0.35, mid, 0.5, 1.15);
vg.addColorStop(0, "rgba(20,14,10,0)");
vg.addColorStop(1, "rgba(20,14,10,0.55)");
g.fillStyle = vg;
g.fillRect(-0.4, -0.4, e.aspect + 0.8, 1.8);
e.lib.dabs(e, mid, C.y0, C.k);
// the boy's hand, reaching up from under the frame: the brush's tip at the layer's pivot, the handle down to the fist,
// the velvet sleeve on down (painted straight down; the animate turns it to his shoulder)
const [hx, hy] = C.hand(e.aspect);
e.layer("hand", { pivot: [hx, hy], box: [hx - 0.15, hy - 0.05, hx + 0.15, hy + 1.75] }, (c) => {
  c.translate(hx, hy);
  c.rotate(Math.PI / 2);
  c.scale(0.6, 0.6);
  // the sleeve and the cuff
  c.fillStyle = "#4d2630";
  c.beginPath();
  c.moveTo(0.19, -0.045);
  c.lineTo(2.8, -0.1);
  c.lineTo(2.8, 0.14);
  c.lineTo(0.19, 0.06);
  c.closePath();
  c.fill();
  c.fillStyle = "#e9e3d6";
  c.fillRect(0.175, -0.05, 0.022, 0.112);
  // the fist round the handle
  c.fillStyle = "#dcbf9f";
  c.beginPath();
  c.ellipse(0.135, 0.004, 0.05, 0.046, 0, 0, 7);
  c.fill();
  c.fillStyle = "rgba(120,80,60,0.35)";
  for (const x of [0.112, 0.132, 0.152]) c.fillRect(x, -0.03, 0.003, 0.05);
  // the brush: the handle, the ferrule, the bristles loaded with paint
  c.fillStyle = "#6a4a30";
  c.fillRect(0.045, -0.007, 0.2, 0.014);
  c.fillStyle = "#9a8458";
  c.fillRect(0.03, -0.009, 0.02, 0.018);
  c.fillStyle = "#cfbfa5";
  c.beginPath();
  c.moveTo(0.032, -0.01);
  c.quadraticCurveTo(0.012, -0.012, 0, 0);
  c.quadraticCurveTo(0.012, 0.012, 0.032, 0.01);
  c.closePath();
  c.fill();
});
