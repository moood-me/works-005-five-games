// The far bluffs of the plain, low and white, two and a half kilometres off: a long line of snowy swells with blue
// shadowed faces and a darker band of bare scrub at their feet; a farther, paler line above them. Painted as one layer
// that repeats every PERIOD metres, so its animate can run it back along the line while the train or the sledge runs.
const P = 2000, X0 = -5400, X1 = 5400;
const line = (g, seed, base, amp, fillTop, fillFace) => {
  // the ridge line: smooth noise of the metres along (repeating every P)
  const top = x => {
    const u = ((x % P) + P) % P / P * Math.PI * 2;
    return base - amp * (0.55 + 0.25 * Math.sin(u * 3 + seed) + 0.15 * Math.sin(u * 7 + seed * 2) + 0.05 * Math.sin(u * 13 + seed * 3));
  };
  g.fillStyle = fillTop;
  g.beginPath();
  g.moveTo(X0, 6);
  for (let x = X0; x <= X1; x += 20) g.lineTo(x, top(x));
  g.lineTo(X1, 6);
  g.closePath();
  g.fill();
  // the shadowed faces: where the ridge falls to the right (the sun on the left)
  g.fillStyle = fillFace;
  for (let x = X0; x < X1; x += 20) {
    const y0 = top(x), y1 = top(x + 20);
    if (y1 > y0 + 0.4) {
      g.beginPath();
      g.moveTo(x, y0);
      g.lineTo(x + 20, y1);
      g.lineTo(x + 20, y1 + (y1 - y0) * 3 + 8);
      g.lineTo(x, y0 + 10);
      g.closePath();
      g.fill();
    }
  }
};
e.layer('hills', { box: [X0, -190, X1, 6] }, g => {
  line(g, 1.3, -40, 140, '#dbe3ee', 'rgba(150,170,200,0.35)');
  line(g, 4.1, 0, 70, '#eef2f7', 'rgba(140,160,195,0.4)');
  // the scrub at the near swells' feet, a broken dark band
  g.fillStyle = '#8c8f94';
  for (let x = X0; x < X1; x += 12) {
    const u = ((x % P) + P) % P;
    const k = 0.5 + 0.5 * Math.sin(u * 0.013) * Math.sin(u * 0.0047 + 1);
    if (k > 0.45) g.fillRect(x, -2.5 - 3 * k, 12.5, 2.5 + 3 * k);
  }
});
