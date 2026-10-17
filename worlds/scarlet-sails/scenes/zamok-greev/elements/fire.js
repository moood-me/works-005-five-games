// The fire in the fireplace: two logs on the ash — and the bed of embers under them (layer `embers`: the shader lets
// it shine as the fire burns, fire.glsl). The flames and the sparks rising are the scene's particles (`flames`,
// `fire_embers`); its light — the scene's `fire_light`, on by `fire` — comes out of the opening.
g.fillStyle = "#2a211b";
g.save();
g.rotate(-0.08);
g.fillRect(-0.42, -0.1, 0.8, 0.1);
g.restore();
g.save();
g.rotate(0.12);
g.fillRect(-0.3, -0.17, 0.66, 0.09);
g.restore();
e.layer("embers", {}, (c) => {
  c.fillStyle = "rgba(200,80,30,0.9)";
  c.fillRect(-0.4, -0.06, 0.78, 0.05);
  // (a round glow squeezed flat over the bed)
  c.scale(1, 0.3);
  const eg = c.createRadialGradient(0, -0.27, 0, 0, -0.27, 0.45);
  eg.addColorStop(0, "rgba(255,190,110,0.7)");
  eg.addColorStop(0.4, "rgba(240,120,50,0.3)");
  eg.addColorStop(1, "rgba(200,70,30,0)");
  c.fillStyle = eg;
  c.beginPath();
  c.arc(0, -0.27, 0.45, 0, 7);
  c.fill();
});
e.light(0, -0.3, 0.7, e.kit.nebo.WARM, 1);
e.at(0, -0.3, "fire");
