// The curtain: two halves of dull green velvet with a gold fringe, gathered to the sides as `curtain` opens it
// (layers scaled about their outer edges), and the pelmet over them.
function half(gc, sx) {
  const x0 = sx < 0 ? -5.1 : 0, w = 5.1;
  gc.fillStyle = '#3f5040'; gc.fillRect(x0, -5.7, w, 5.7);
  for (let i = 0; i < 17; i++) {
    const x = x0 + i * w / 17;
    gc.fillStyle = i % 2 ? 'rgba(20,30,20,0.28)' : 'rgba(200,220,190,0.08)';
    gc.fillRect(x, -5.7, w / 34, 5.7);
  }
  gc.fillStyle = '#b8955a'; gc.fillRect(x0, -0.16, w, 0.12);
}
e.layer('left', { pivot: [-5.1, 0] }, gl => half(gl, -1));
e.layer('right', { pivot: [5.1, 0] }, gr => half(gr, 1));
e.layer('pelmet', {}, gp => {
  gp.fillStyle = '#3a4a3c'; gp.fillRect(-5.2, -5.7, 10.4, 0.7);
  gp.fillStyle = '#b8955a'; gp.fillRect(-5.2, -5.06, 10.4, 0.1);
  for (let x = -5.0; x < 5.1; x += 0.6) { gp.beginPath(); gp.moveTo(x - 0.3, -4.96); gp.quadraticCurveTo(x, -4.7, x + 0.3, -4.96); gp.fill(); }
});
