// The crew's bunks, torn out and stacked by the hatch: wooden frames, boards, a straw mattress hanging over. A part
// of the «Henrietta» that burns (layer `all`; on the others — a stack of crates and coils of rope). Its point
// bunks#part.
const L = e.lib, c = L.colours(e.state);
e.layer('all', {}, g => {
  if (L.shipOf(e.state) === 'henrietta') {
    for (let k = 0; k < 4; k++) {
      const y = -0.3 - k * 0.32, dx = (k % 2 ? 0.08 : -0.06);
      L.rect(g, -1.1 + dx, y - 0.12, 2.2, 0.12, k % 2 ? '#8a6a48' : '#9a7a54');
      L.rect(g, -1.1 + dx, y - 0.12, 0.08, 0.32, '#6a5038');
      L.rect(g, 1.02 + dx, y - 0.12, 0.08, 0.32, '#6a5038');
    }
    L.poly(g, [[-0.8, -1.42], [0.7, -1.46], [0.9, -1.2], [0.85, -0.9], [0.7, -1.25], [-0.7, -1.25]], '#c8b47c');
  } else {
    L.rect(g, -1.0, -0.8, 1.0, 0.8, '#8a6a48');
    L.rect(g, 0.05, -0.6, 0.8, 0.6, '#9a7a54');
    L.rect(g, -0.7, -1.4, 0.8, 0.6, '#7a5c3e');
    g.fillStyle = '#b8a074';
    g.beginPath();
    g.ellipse(0.55, -0.85, 0.42, 0.2, 0, 0, Math.PI * 2);
    g.fill();
  }
  e.at(0, -0.8, 'part');
});
