const N = e.kit.sky;

// The picture lamp over the crucifixion: a slim brass bar on a short arm from the wall; its light —
// the scene's `cross_light`, on by `lamps` — washes down over the canvas.
g.fillStyle = "#6d5a3a";
g.fillRect(-0.02, -0.12, 0.04, 0.1);
g.fillStyle = "#8a7448";
g.fillRect(-0.34, -0.03, 0.68, 0.045);
e.light(0, 0.03, 0.3, N.WARM, 0.9);
