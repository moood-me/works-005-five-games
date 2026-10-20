// The two tracks seen from above on their snowy bed: the ballast, the sleepers, the rails. Metres, centre (0, 13.55);
// y toward the viewer (the near track at y +2.05, the far one at y −2.05).
const len = 400;
g.fillStyle = '#d9dfe8';
g.fillRect(-len / 2, -3.3, len, 6.6);
for (const ty of [2.05, -2.05]) {
  g.fillStyle = '#8f8d8a';
  g.fillRect(-len / 2, ty - 1.4, len, 2.8);
  g.fillStyle = '#3f3a35';
  for (let x = -len / 2; x < len / 2; x += 0.55) g.fillRect(x, ty - 1.25, 0.24, 2.5);
  g.fillStyle = 'rgba(232,238,246,0.75)';
  for (let x = -len / 2; x < len / 2; x += 0.55) if (e.rnd() < 0.6) g.fillRect(x - 0.15, ty - 1.3 + e.rnd() * 2.2, 0.3, 0.2);
  g.fillStyle = '#9da3aa';
  for (const r of [-0.76, 0.76]) g.fillRect(-len / 2, ty + r - 0.04, len, 0.08);
}
