// The reading lamp by the father's chair: a round brass foot, a slim stem, a drum shade of linen; its light — the
// scene's `reading_light`, on by `lamps` — falls on the chair and the floor, and the shade glows from inside as it
// burns (layer `lit`: the shader's, floor_lamp.glsl).
const shade = (c) => {
  c.beginPath();
  c.moveTo(-0.17, -1.6);
  c.lineTo(0.17, -1.6);
  c.lineTo(0.2, -1.36);
  c.lineTo(-0.2, -1.36);
  c.closePath();
  c.fill();
};
g.fillStyle = "#6d5a3a";
g.beginPath();
g.ellipse(0, -0.015, 0.16, 0.025, 0, 0, 7);
g.fill();
g.fillRect(-0.012, -1.4, 0.024, 1.39);
g.fillStyle = "#c9bda6";
shade(g);
e.layer("lit", {}, (c) => {
  const lg = c.createLinearGradient(0, -1.6, 0, -1.36);
  lg.addColorStop(0, "#f2cf9c");
  lg.addColorStop(1, "#ffe6c0");
  c.fillStyle = lg;
  shade(c);
});
e.light(0, -1.42, 0.35, e.kit.sky.WARM, 1);
e.at(0, -1.5, "floor_lamp");
