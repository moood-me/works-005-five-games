// The left wall, seen straight at it (x runs from the viewer's side toward the far wall; 0 at 2.7 m): plaster over
// panelling, the window cut in it at x 0.5…2.7 (the street's Z 3.2…5.4), y −2.6…−0.95
g.fillStyle = "#ebe3d1";
g.beginPath();
g.rect(-3.3, -3, 6.6, 3);
g.rect(0.5, -2.6, 2.2, 1.65);
g.fill("evenodd");
g.fillStyle = "#a9c1b6";
g.fillRect(-3.3, -0.9, 6.6, 0.9);
g.fillStyle = "#f4f0e6";
g.fillRect(-3.3, -0.94, 6.6, 0.04);
