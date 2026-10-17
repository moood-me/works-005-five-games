// Batulcar's show on the landing (Yokohama only): the backdrop behind the boards — two posts and a cloth in broad bands,
// a board over it with the troupe's marks; the water behind.
const L = e.lib;
if (L.portOf(e.state) === 'yokohama') {
  const S = L.plan.stage;
  const w = S.half;
  g.fillStyle = '#2e2620';
  for (const s of [-1, 1]) g.fillRect(s * w - 0.15, -6.6, 0.3, 6.6);
  const bands = ['#b8342a', '#efe6d4', '#2c3a5a', '#efe6d4', '#b8342a'];
  bands.forEach((c, i) => {
    g.fillStyle = c;
    g.fillRect(-w + 0.15 + (i * (2 * w - 0.3)) / 5, -5.2, (2 * w - 0.3) / 5, 5.2 - S.h);
  });
  g.fillStyle = '#1e1a16';
  g.fillRect(-w, -6.6, 2 * w, 1.3);
  g.strokeStyle = '#e8d8b0';
  g.lineWidth = 0.07;
  for (let k = 0; k < 5; k++) {
    g.beginPath();
    g.arc(-w + 1.4 + k * ((2 * w - 2.8) / 4), -5.95, 0.32, 0, Math.PI * 2);
    g.stroke();
  }
}
