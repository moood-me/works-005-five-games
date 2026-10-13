// The shop's floor, seen from above (x across, y toward the eye): wide light boards running to the far wall
g.fillStyle = "#cfae82";
g.fillRect(-2.6, -3.3, 5.2, 6.6);
for (let x = -2.6, i = 0; x < 2.6; x += 0.22, i++) {
  g.fillStyle = i % 2 ? "rgba(255,240,210,0.16)" : "rgba(90,60,30,0.1)";
  g.fillRect(x, -3.3, 0.22, 6.6);
  g.fillStyle = "rgba(90,60,30,0.28)";
  g.fillRect(x, -3.3, 0.008, 6.6);
}
