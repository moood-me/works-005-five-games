// The crossing's signal: a striped post, the white cross, a black plate with two red lamps (they blink by `bell`:
// animate), the bell on top. Metres.
// the post, black and white
for (let i = 0; i < 12; i++) {
  g.fillStyle = i % 2 ? '#1d1d1f' : '#e4e1da';
  g.fillRect(-0.07, -0.25 * (i + 1), 0.14, 0.25);
}
g.fillStyle = '#8c8a86';
g.fillRect(-0.25, -0.18, 0.5, 0.22);
// the cross
g.save();
g.translate(0, -2.0);
for (const r of [0.6, -0.6]) {
  g.save();
  g.rotate(r);
  g.fillStyle = '#b02a22';
  g.fillRect(-0.68, -0.09, 1.36, 0.18);
  g.fillStyle = '#efece6';
  g.fillRect(-0.64, -0.055, 1.28, 0.11);
  g.restore();
}
g.restore();
// the plate and the hoods
g.fillStyle = '#141416';
g.fillRect(-0.58, -2.98, 1.16, 0.5);
for (const x of [-0.3, 0.3]) {
  g.beginPath();
  g.arc(x, -2.73, 0.19, Math.PI, 0);
  g.lineTo(x + 0.19, -2.86);
  g.lineTo(x - 0.19, -2.86);
  g.fill();
  g.fillStyle = '#5c1712';
  g.beginPath();
  g.arc(x, -2.73, 0.12, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = '#141416';
}
// the bell
g.fillStyle = '#2a2a2c';
g.beginPath();
g.arc(0, -3.12, 0.13, Math.PI, 0);
g.fill();
g.fillRect(-0.02, -3.0, 0.04, 0.05);
// snow on the plate's top
g.fillStyle = '#e8eef5';
g.fillRect(-0.6, -3.02, 1.2, 0.06);
e.light(-0.3, -2.73, 0.3, '#ff2a14', 1.3, 'l1');
e.light(0.3, -2.73, 0.3, '#ff2a14', 1.3, 'l2');
