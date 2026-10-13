const N = e.kit.nebo;

// The picture lamp over the ship: as the one over the crucifixion — the scene's `ship_light`
g.fillStyle = "#6d5a3a";
g.fillRect(-0.02, -0.12, 0.04, 0.1);
g.fillStyle = "#8a7448";
g.fillRect(-0.38, -0.03, 0.76, 0.045);
e.light(0, 0.03, 0.3, N.WARM, 0.9);
