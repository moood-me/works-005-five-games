// The painting of a ship on the crest of a wave (canvas 2.08 × 1.38 m in a thin dark-gold frame; x across, y up from
// its foot, 1.3 m over the floor): a grey sky breaking to light, the dark sea, a great wave rising from the right, the
// ship heeled on its crest, bow up, the captain a speck at the wheel. Painted once, still: the frame and the sky, and
// three layers — the far sea, the great wave, the ship. `painting_alive` 0…1 is its shader's (ship_painting.glsl): the
// far sea runs, the wave rises and falls, its lip curls, the ship rides it.
const A = e.anim;
const X0 = -1.04, X1 = 1.04, Y0 = -1.44, Y1 = -0.06;
const crest = -0.08, top = -1.0;
g.fillStyle = "#7a6440";
g.fillRect(-1.1, -1.5, 2.2, 1.5);
const sky = g.createLinearGradient(0, Y0, 0, -0.6);
sky.addColorStop(0, "#3f4a52");
sky.addColorStop(0.55, "#7c8a90");
sky.addColorStop(1, "#b9bfb8");
g.fillStyle = sky;
g.fillRect(X0, Y0, X1 - X0, Y1 - Y0);
const brk = g.createRadialGradient(-0.45, -0.95, 0.02, -0.45, -0.95, 0.6);
brk.addColorStop(0, "rgba(240,230,204,0.7)");
brk.addColorStop(1, "rgba(240,230,204,0)");
g.fillStyle = brk;
g.fillRect(X0, Y0, X1 - X0, Y1 - Y0);

// (the layers are painted a little past the canvas: the shader moves them and cuts them to it)
const band = (c, y0, amp, k, seed, colour) => {
  c.fillStyle = colour;
  c.beginPath();
  c.moveTo(-1.15, 0.05);
  for (let x = -1.15; x <= 1.16; x += 0.02) c.lineTo(x, y0 + amp * Math.sin(x * k + seed));
  c.lineTo(1.16, 0.05);
  c.closePath();
  c.fill();
};
// the far sea, two lines of swell
e.layer("sea", {}, (c) => {
  band(c, -0.62, 0.02, 9, 1, "#48565a");
  band(c, -0.5, 0.03, 6, 2, "#3b4848");
});
// the great wave: its long back rising from the right to the crest, the lip curling over to the left, its hollow face
// falling to the trough; the foam along the lip, falling off it, streaked down the back
e.layer("wave", {}, (c) => {
  const body = c.createLinearGradient(crest + 0.4, top, crest + 0.1, -0.2);
  body.addColorStop(0, "#5f7a72");
  body.addColorStop(0.35, "#34474a");
  body.addColorStop(1, "#243235");
  c.fillStyle = body;
  c.beginPath();
  c.moveTo(1.16, -0.36);
  c.bezierCurveTo(0.6, -0.42, crest + 0.4, top + 0.1, crest + 0.05, top);
  c.bezierCurveTo(crest - 0.12, top - 0.03, crest - 0.3, top + 0.03, crest - 0.36, top + 0.16);
  c.bezierCurveTo(crest - 0.3, top + 0.12, crest - 0.24, top + 0.18, crest - 0.22, top + 0.3);
  c.bezierCurveTo(crest - 0.24, top + 0.55, crest - 0.5, -0.3, -1.16, -0.36);
  c.lineTo(-1.16, 0.05);
  c.lineTo(1.16, 0.05);
  c.closePath();
  c.fill();
  c.strokeStyle = "rgba(228,232,224,0.9)";
  c.lineWidth = 0.02;
  c.beginPath();
  c.moveTo(crest + 0.3, top + 0.08);
  c.bezierCurveTo(crest + 0.1, top - 0.02, crest - 0.25, top - 0.01, crest - 0.36, top + 0.16);
  c.stroke();
  c.fillStyle = "rgba(228,232,224,0.55)";
  for (let i = 0; i < 18; i++) {
    const u = A.hash(i, 1);
    c.beginPath();
    c.arc(crest - 0.38 + 0.12 * A.hash(i, 4), top + 0.14 + 0.3 * u, 0.005 + 0.009 * A.hash(i, 3), 0, 7);
    c.fill();
  }
  c.strokeStyle = "rgba(210,220,214,0.25)";
  c.lineWidth = 0.008;
  for (let i = 0; i < 6; i++) {
    const x = crest + 0.12 + i * 0.13;
    c.beginPath();
    c.moveTo(x, top + 0.12 + i * 0.05);
    c.quadraticCurveTo(x + 0.06, top + 0.2 + i * 0.05, x + 0.04, top + 0.3 + i * 0.06);
    c.stroke();
  }
});
// the ship on the crest, heeled, bow up to the left (it turns about the crest: ship_painting.glsl SHIP)
e.layer("ship", {}, (c) => {
  c.translate(crest + 0.08, top + 0.02);
  c.rotate(-0.28);
  c.fillStyle = "#1f2224";
  c.beginPath();
  c.moveTo(-0.24, -0.05);
  c.quadraticCurveTo(-0.2, 0.02, -0.12, 0.03);
  c.lineTo(0.18, 0.03);
  c.lineTo(0.22, -0.04);
  c.closePath();
  c.fill();
  c.fillRect(-0.09, -0.4, 0.008, 0.36);
  c.fillRect(0.06, -0.36, 0.007, 0.32);
  c.fillStyle = "#d8d6cc";
  for (const [cx, h] of [[-0.085, 0.38], [0.064, 0.34]]) {
    c.beginPath();
    c.moveTo(cx - 0.07, -h * 0.95);
    c.lineTo(cx + 0.07, -h * 0.95);
    c.quadraticCurveTo(cx + 0.09, -h * 0.55, cx + 0.08, -h * 0.25);
    c.lineTo(cx - 0.08, -h * 0.25);
    c.quadraticCurveTo(cx - 0.05, -h * 0.6, cx - 0.07, -h * 0.95);
    c.fill();
  }
  c.fillStyle = "#14171a";
  c.fillRect(0.15, -0.075, 0.012, 0.03);
});
e.at(crest + 0.08, top - 0.15, "ship");
