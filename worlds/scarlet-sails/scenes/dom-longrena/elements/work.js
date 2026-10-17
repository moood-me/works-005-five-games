const A = e.anim;

// On the bench: the plane, shavings; the hull he is shaping (a layer: there till the yacht is made) and his knife (a
// layer: there while it is not in his hand) — its animate shows them
g.fillStyle = "#514b44";
g.fillRect(0.06, -0.055, 0.2, 0.055);
g.fillRect(0.11, -0.085, 0.05, 0.03);
g.strokeStyle = "#c0b5a1";
g.lineWidth = 0.005;
for (let i = 0; i < 7; i++) {
  const cx = -0.35 + A.hash(i, 1) * 0.6;
  const r = 0.008 + A.hash(i, 2) * 0.012;
  g.beginPath();
  for (let a = 0; a < 9; a += 0.4) {
    const rr = r * (1 - a / 12);
    g.lineTo(cx + Math.cos(a) * rr * 1.6 + a * 0.004, -r + Math.sin(a) * rr);
  }
  g.stroke();
}
e.layer("hull", { depth: -0.02 }, (g) => {
  g.fillStyle = "#b8b2a7";
  g.beginPath();
  g.moveTo(-0.3, 0);
  g.quadraticCurveTo(-0.2, -0.085, 0.22, -0.075);
  g.lineTo(0.22, 0);
  g.closePath();
  g.fill();
});
e.layer("knife", { depth: 0.05 }, (g) => {
  g.fillStyle = "#6b4f36";
  g.fillRect(0.3, -0.02, 0.085, 0.02);
  g.fillStyle = "#9ea0a2";
  g.beginPath();
  g.moveTo(0.385, -0.018);
  g.lineTo(0.47, -0.008);
  g.lineTo(0.385, -0.002);
  g.closePath();
  g.fill();
});
e.at(0, -0.08, "work");
