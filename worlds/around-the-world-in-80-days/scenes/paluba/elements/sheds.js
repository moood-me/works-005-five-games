// What stands on the quay beyond the ship (a card along it, its face to the ship; x runs aft from 110 m forward):
// Suez — low white houses, palms, a minaret; New York — wooden pier sheds with signs, a church spire; Liverpool — brick
// warehouses, hydraulic cranes, chimneys. Nothing for a port without a quay.
const L = e.lib, port = L.portOf(e.state);
if (L.quayed(port)) {
  let x = 4;
  while (x < 148) {
    const w = 9 + 10 * e.rnd(), h = port === 'liverpool' ? 12 + 10 * e.rnd() : port === 'suez' ? 5 + 4 * e.rnd() : 7 + 6 * e.rnd();
    const wall = port === 'liverpool' ? (e.rnd() < 0.5 ? '#8c5040' : '#7a4638') : port === 'suez' ? (e.rnd() < 0.5 ? '#efe6d2' : '#e2d2b2') : (e.rnd() < 0.5 ? '#9a8a74' : '#7e6e5a');
    L.rect(g, x, -h, w, h, wall);
    // windows, a door
    g.fillStyle = L.shade(wall, 0.45);
    for (let r = 1; r * 2.6 < h - 1; r++) for (let c = 0; c * 2.2 + 1.6 < w; c++) g.fillRect(x + 1 + c * 2.2, -h + r * 2.6 - 1.4, 0.9, 1.3);
    L.rect(g, x + w / 2 - 1.2, -3, 2.4, 3, L.shade(wall, 0.55));
    if (port === 'new_york' || port === 'liverpool') L.poly(g, [[x - 0.3, -h], [x + w / 2, -h - 2.4], [x + w + 0.3, -h]], L.shade(wall, 0.3));
    if (port === 'suez' && e.rnd() < 0.5) {
      // a palm before it
      const px = x + w * e.rnd();
      g.strokeStyle = '#6a5a3a'; g.lineWidth = 0.35;
      g.beginPath(); g.moveTo(px, 0); g.quadraticCurveTo(px + 1, -5, px + 0.4, -9); g.stroke();
      g.fillStyle = '#4e6a3a';
      for (let k = 0; k < 7; k++) { g.beginPath(); g.ellipse(px + 0.4 + Math.cos(k) * 1.4, -9 + Math.sin(k) * 0.4, 2, 0.45, k * 0.45, 0, Math.PI * 2); g.fill(); }
    }
    x += w + 1 + 3 * e.rnd();
  }
  if (port === 'liverpool') {
    // cranes: a post, a jib leaning out over the quay
    g.strokeStyle = '#3a3634'; g.lineWidth = 0.5;
    for (const cx of [20, 62, 104]) { g.beginPath(); g.moveTo(cx, 0); g.lineTo(cx, -16); g.lineTo(cx - 8, -24); g.moveTo(cx, -12); g.lineTo(cx - 8, -24); g.stroke(); }
    for (const cx of [36, 88, 130]) L.rect(g, cx, -34, 1.6, 34, '#5a3a32');
  }
  if (port === 'suez') { L.rect(g, 70, -22, 2, 22, '#f2ead8'); L.poly(g, [[69.6, -22], [71, -26], [72.4, -22]], '#f2ead8'); }
  if (port === 'new_york') { L.rect(g, 90, -24, 3, 24, '#7a7068'); L.poly(g, [[90, -24], [91.5, -32], [93, -24]], '#6e645c'); }
}
