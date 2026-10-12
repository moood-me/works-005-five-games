// The side street going off into the fog, seen from above: its narrow roadway of setts between two pavements,
// from the corner (where it crosses the far pavement) to the end (x across it, y toward the viewer).
const [, t, , b] = e.area;
g.fillStyle = '#7e7d78';
g.fillRect(-5, t, 10, b - t);
g.fillStyle = '#4a4c4f';
g.fillRect(-3.4, t, 6.8, b - t);
g.fillStyle = 'rgba(16,17,19,0.5)';
for (let y = Math.floor(t / 0.15) * 0.15; y < b; y += 0.15) g.fillRect(-3.4, y, 6.8, 0.018);
g.fillStyle = 'rgba(30,30,30,0.3)';
for (let y = Math.floor(t / 0.75) * 0.75; y < b; y += 0.75) {
  g.fillRect(-5, y, 1.6, 0.025);
  g.fillRect(3.4, y, 1.6, 0.025);
}
// the kerbstones
g.fillStyle = 'rgba(200,198,190,0.35)';
g.fillRect(-3.6, t, 0.2, b - t);
g.fillRect(3.4, t, 0.2, b - t);
