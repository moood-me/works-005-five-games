// Assol's basket by the door, set down full of her father's toys (`basket`: there or not): wicker, a hoop handle,
// little boats heaped in it — white hulls, a few coloured sails.
e.at(0, -0.22, "basket");
if (!(e.state.basket > 0.5)) return;
g.fillStyle = "#9e8158";
g.beginPath();
g.moveTo(-0.2, -0.2);
g.lineTo(0.2, -0.2);
g.lineTo(0.16, 0);
g.lineTo(-0.16, 0);
g.closePath();
g.fill();
g.strokeStyle = "#7d6544";
g.lineWidth = 0.008;
for (const y of [-0.15, -0.1, -0.05]) { g.beginPath(); g.moveTo(-0.19, y); g.lineTo(0.19, y); g.stroke(); }
g.lineWidth = 0.014;
g.beginPath();
g.ellipse(0, -0.2, 0.17, 0.17, 0, Math.PI, 0);
g.stroke();
for (const [x, w, c] of [[-0.1, 0.12, "#e8e4dc"], [0.05, 0.1, "#e8e4dc"], [0.11, 0.08, "#8fa3b4"]]) {
  g.fillStyle = "#e8e4dc";
  g.fillRect(x - w / 2, -0.24, w, 0.04);
  g.fillStyle = c;
  g.beginPath();
  g.moveTo(x, -0.24);
  g.lineTo(x, -0.36);
  g.lineTo(x - w * 0.4, -0.24);
  g.closePath();
  g.fill();
}
