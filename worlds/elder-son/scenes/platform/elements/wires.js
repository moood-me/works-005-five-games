// The overhead line over the near track: the contact wire, the messenger above it sagging between the masts, the
// droppers. y up from the bed; the masts every 60 m (masts.js).
const len = 400, wire = -6.35, top = -7.5;
g.strokeStyle = '#2b2d31';
g.lineWidth = 0.02;
g.beginPath();
g.moveTo(-len / 2, wire);
g.lineTo(len / 2, wire);
g.stroke();
g.beginPath();
for (let x = -len / 2; x <= len / 2; x += 1) {
  const u = (((x % 60) + 60) % 60) / 60;
  const y = top + 0.75 * 4 * u * (1 - u);
  if (x === -len / 2) g.moveTo(x, y);
  else g.lineTo(x, y);
}
g.stroke();
g.lineWidth = 0.012;
for (let x = -len / 2; x <= len / 2; x += 6) {
  const u = (((x % 60) + 60) % 60) / 60;
  g.beginPath();
  g.moveTo(x, top + 0.75 * 4 * u * (1 - u));
  g.lineTo(x, wire);
  g.stroke();
}
