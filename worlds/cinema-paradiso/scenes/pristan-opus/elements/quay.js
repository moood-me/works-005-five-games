// The quay along the shore (seen from above; y toward the viewer: y −20 is its edge at the sea, z 4): limestone
// flags by the water, the cobbled road (z −4…0), the pavement before the houses.
const P = e.lib, an = e.anim;
g.fillStyle = '#7d7262'; g.fillRect(-200, -20, 400, 40);
g.save(); g.translate(0, -18); P.paving(g, 60, 2, 41); g.restore();               // flags z 0…4
g.fillStyle = '#c2b08f'; g.fillRect(-200, -20, 400, 0.45);                            // the edge's coping
g.fillStyle = '#5c544b'; g.fillRect(-200, -16, 400, 4);                               // the road
for (let i = 0; i < 700; i++) {
  const x = (an.hash(i, 51) - 0.5) * 50, y = -16 + an.hash(i, 52) * 4;
  g.fillStyle = an.hash(i, 53) < 0.5 ? '#6a6156' : '#544c44';
  g.beginPath(); g.ellipse(x, y, 0.12, 0.09, 0, 0, Math.PI * 2); g.fill();
}
g.fillStyle = '#8b8172'; g.fillRect(-200, -12, 400, 3);                               // the pavement
g.fillStyle = '#a19581'; g.fillRect(-200, -12.15, 400, 0.15);
