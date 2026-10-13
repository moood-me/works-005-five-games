// The back of the firebox: sooted stone, darker up where the smoke goes — and the fire's glow on it (layer `glow`: the
// shader lets it shine as much as the fire burns, firebox.glsl)
const gr = g.createLinearGradient(0, -1.15, 0, 0);
gr.addColorStop(0, "#1f1a17");
gr.addColorStop(1, "#4a4038");
g.fillStyle = gr;
g.fillRect(-0.8, -1.15, 1.6, 1.15);
e.layer("glow", {}, (c) => {
  const ig = c.createRadialGradient(0, -0.2, 0, 0, -0.2, 0.75);
  ig.addColorStop(0, "rgba(190,84,30,0.8)");
  ig.addColorStop(0.5, "rgba(120,40,14,0.35)");
  ig.addColorStop(1, "rgba(60,18,8,0)");
  c.fillStyle = ig;
  c.fillRect(-0.8, -1.15, 1.6, 1.15);
});
