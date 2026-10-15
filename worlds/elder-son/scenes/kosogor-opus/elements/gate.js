// The cemetery gate: two square brick pillars with snow on their caps, the iron gate leaves standing open inward.
// Metres; the opening 2 m wide between the pillars.
for (const x of [-1.15, 1.15]) {
  g.fillStyle = '#8a4f3e';
  g.fillRect(x - 0.3, -2.3, 0.6, 2.32);
  g.strokeStyle = 'rgba(40,20,16,0.45)';
  g.lineWidth = 0.015;
  for (let y = -2.3; y < 0; y += 0.13) {
    g.beginPath();
    g.moveTo(x - 0.3, y);
    g.lineTo(x + 0.3, y);
    g.stroke();
  }
  g.fillStyle = '#5f3a30';
  g.fillRect(x - 0.36, -2.42, 0.72, 0.14);
  g.fillStyle = '#e6ebf3';
  g.beginPath();
  g.ellipse(x, -2.44, 0.38, 0.1, 0, Math.PI, 0);
  g.fill();
  e.kit.izby.drift(g, e, x - 0.45, x + 0.45, 0.3);
}
// the open leaves, seen edge-on as thin iron bars
g.strokeStyle = '#2a2a2d';
g.lineWidth = 0.035;
for (const x of [-0.82, 0.82]) {
  g.beginPath();
  g.moveTo(x, -1.75);
  g.lineTo(x, -0.1);
  g.moveTo(x - 0.03, -1.75);
  g.lineTo(x + 0.03, -1.75);
  g.stroke();
}
e.at(0, -1.2);
