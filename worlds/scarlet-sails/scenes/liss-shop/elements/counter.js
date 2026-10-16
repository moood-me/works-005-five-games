// The counter's front: light wood in panels
g.fillStyle = "#c9a273";
g.fillRect(-1.1, -0.95, 2.2, 0.95);
for (let i = 0; i < 4; i++) {
  const x = -1.03 + i * 0.54;
  g.fillStyle = "#8a6a44";
  g.fillRect(x, -0.85, 0.5, 0.7);
  g.fillStyle = "#d6b384";
  g.fillRect(x + 0.02, -0.83, 0.46, 0.66);
}
g.fillStyle = "#b08d64";
g.fillRect(-1.12, -0.97, 2.24, 0.04);
g.fillStyle = "#8a6a44";
g.fillRect(-1.1, -0.08, 2.2, 0.08);
