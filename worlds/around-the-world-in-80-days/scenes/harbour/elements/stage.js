// The stage's boards (Yokohama only), seen from above.
if (e.lib.portOf(e.state) === 'yokohama') {
  g.fillStyle = '#9a8264';
  g.fillRect(-5, -2.3, 10, 4.6);
  g.fillStyle = 'rgba(30,22,14,0.3)';
  for (let x = -4.75; x < 5; x += 0.25) g.fillRect(x, -2.3, 0.02, 4.6);
}
