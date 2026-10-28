// The flight's side: its concrete stringer from the platform's level (x −2.25, y −3.2) down to its foot (x 2.25, y 0),
// the iron railing over it, the landing's railing along the platform's end. Two copies: the near side and the far one.
const L = 4.5, H = 3.2;
g.fillStyle = '#8e9299';
g.beginPath();
g.moveTo(-L / 2 - 0.1, -H - 0.06);
g.lineTo(L / 2, -0.06);
g.lineTo(L / 2, 0.1);
g.lineTo(L / 2 - 0.5, 0.1);
g.lineTo(-L / 2 - 0.1, -H + 0.45);
g.closePath();
g.fill();
g.strokeStyle = '#2f3134';
g.lineWidth = 0.05;
g.beginPath();
g.moveTo(-L / 2 - 2.0, -H - 0.95);
g.lineTo(-L / 2, -H - 0.95);
g.lineTo(L / 2, -0.95);
for (let x = -L / 2 - 2.0; x <= L / 2 + 0.01; x += 0.75) {
  const y = x < -L / 2 ? -H : -H * (1 - (x + L / 2) / L);
  g.moveTo(x, y - 0.95);
  g.lineTo(x, y);
}
g.stroke();
g.fillStyle = '#e6ecf4';
g.fillRect(-L / 2 - 2.0, -H - 1.0, 2.0, 0.04);
