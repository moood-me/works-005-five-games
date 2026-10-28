const FLAME = 0.22;

// The lamp's flame: it glows, and its light — the scene's `lamp_light`, on by `lamp` — lights the room. Its animate
// puts it out as `lamp` says and keeps it alive (a slow waver behind the glass)
e.at(0, -FLAME, "flame");
e.layer("flame", { pivot: [0, -FLAME + 0.04], flicker: 0.1 }, (g) => {
  g.fillStyle = "#fff1d0";
  g.beginPath();
  g.ellipse(0, -FLAME + 0.01, 0.012, 0.03, 0, 0, 7);
  g.fill();
});
e.light(0, -FLAME, 0.35, e.kit.sky.WARM, 1);
