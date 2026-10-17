// The wall of windows, seen straight at it (x along the wall, + away to the fireplace; anchor 3.75 m ahead): plaster in
// tall panels, the shadow gap at the floor; the two tall windows cut out. The sun and the moon
// come in only at their panes (the lights' `through`).
const OPEN = [[-1.75, -0.35], [1.25, 2.65]];
g.fillStyle = "#8b7d6b";
g.beginPath();
g.rect(-5.3, -6, 10.6, 5.96);
for (const [a, b] of OPEN) g.rect(a, -5, b - a, 4.4);
g.fill("evenodd");
g.fillStyle = "rgba(40,30,22,0.18)";
for (const x of [-4.05, -2.95, 0.45, 4.05]) g.fillRect(x, -6, 0.012, 5.96);
g.fillStyle = "#2e2620";
g.fillRect(-5.3, -0.04, 10.6, 0.04);
OPEN.forEach(([a, b], i) => e.at((a + b) / 2, -2.8, `window${i + 1}`));
