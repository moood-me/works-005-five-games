// The wall of the fireplace, seen straight at it (x across, anchor 0.25 m right): plaster in tall
// panels, the shadow gap at the floor, the fire's opening cut out (the surround is `hearth`)
g.fillStyle = "#8b7d6b";
g.beginPath();
g.rect(-4.3, -6, 8.6, 5.96);
g.rect(-0.75, -1.1, 1.5, 0.95);
g.fill("evenodd");
g.fillStyle = "rgba(40,30,22,0.18)";
for (const x of [-3.5, -1.4, 1.4, 4.1]) g.fillRect(x, -6, 0.012, 5.96);
g.fillStyle = "#2e2620";
g.fillRect(-4.3, -0.04, 8.6, 0.04);
