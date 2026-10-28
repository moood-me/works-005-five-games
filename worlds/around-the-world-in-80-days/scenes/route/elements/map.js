// The old map of the world on its paper, painted once: the sheet yellowed and stained, its folds; the graticule every
// fifteen degrees, the equator and the tropics; the seas washed grey-blue along the coasts, the lands in ochre, their
// coasts in sepia — the world once round from Greenwich to Greenwich and a little more either side; the towns of the way
// and the oceans named in the engraver's italic. Its layers, shown by its shader (map.wgsl): the way in red ink (ink —
// by land a line, by sea dashes), the share of the way each point of it is at (share — the same way, its grey the
// share, a little wider), the day won at the 180th meridian (dateline).
const L = e.lib, K = L.K, [x0, x1] = [L.X(L.WEST), L.X(L.EAST)], [y0, y1] = [-L.UP(L.NORTH), -L.UP(L.SOUTH)];
const P = L.at;
const INK = '#a3271f', SEPIA = '#5b4126';
// (the sheet's edges: nothing of it past them)
g.beginPath();
g.rect(x0, y0, x1 - x0, y1 - y0);
g.clip();
// the paper, and its stains and its folds
g.fillStyle = '#e9dbb6';
g.fillRect(x0, y0, x1 - x0, y1 - y0);
for (let i = 0; i < 26; i++) {
  const r = 1.5 + 4 * e.rnd(), cx = x0 + r + (x1 - x0 - 2 * r) * e.rnd(), cy = y0 + r + (y1 - y0 - 2 * r) * e.rnd();
  const gr = g.createRadialGradient(cx, cy, 0, cx, cy, r);
  gr.addColorStop(0, `rgba(150,110,60,${0.05 + 0.08 * e.rnd()})`);
  gr.addColorStop(1, 'rgba(150,110,60,0)');
  g.fillStyle = gr;
  g.fillRect(cx - r, cy - r, 2 * r, 2 * r);
}
g.fillStyle = 'rgba(120,90,50,0.12)';
for (let x = x0 + 9; x < x1; x += 9.2) g.fillRect(x, y0, 0.05, y1 - y0);
g.fillRect(x0, (y0 + y1) / 2, x1 - x0, 0.04);
// the graticule
g.strokeStyle = 'rgba(110,80,45,0.35)';
g.lineWidth = 0.018;
g.beginPath();
for (let lon = -90; lon <= 450; lon += 15) { g.moveTo(L.X(lon), y0); g.lineTo(L.X(lon), y1); }
for (let lat = 0; lat <= 75; lat += 15) { g.moveTo(x0, -L.UP(lat)); g.lineTo(x1, -L.UP(lat)); }
g.stroke();
g.setLineDash([0.12, 0.1]);
g.lineWidth = 0.03;
g.beginPath();
for (const lat of [23.44, 0]) { g.moveTo(x0, -L.UP(lat)); g.lineTo(x1, -L.UP(lat)); }
g.stroke();
g.setLineDash([]);
// the lands — each three times over (a world to the west, this one, one to the east), where the sheet runs: the sea
// washed darker along their coasts, their ochre, their coasts
const copies = [-360, 0, 360];
const outline = (land, off) => {
  g.beginPath();
  land.forEach(([lon, lat], i) => { const [x, y] = P([lon + off, lat]); if (i) g.lineTo(x, y); else g.moveTo(x, y); });
  g.closePath();
};
g.lineJoin = 'round';
for (const [w, a] of [[0.5, 0.1], [0.26, 0.14], [0.1, 0.2]]) {
  g.strokeStyle = `rgba(80,110,120,${a})`;
  g.lineWidth = w;
  for (const off of copies) for (const land of L.LANDS) { outline(land, off); g.stroke(); }
}
for (const off of copies) for (const land of L.LANDS) {
  outline(land, off);
  g.fillStyle = '#dcc590';
  g.fill();
  g.strokeStyle = SEPIA;
  g.lineWidth = 0.03;
  g.stroke();
}
// the towns of the way, and the oceans
const NAMES = {
  london: tr('London'), suez: tr('Suez'), bombay: tr('Bombay'), calcutta: tr('Calcutta'), hongkong: tr('Hong Kong'),
  yokohama: tr('Yokohama'), sanfrancisco: tr('San Francisco'), newyork: tr('New York'), liverpool: tr('Liverpool'),
};
g.font = 'italic 0.3px Georgia, serif';
g.textBaseline = 'middle';
for (const [which, lon, lat, side, up] of L.TOWNS) {
  const [x, y] = P([lon, lat]);
  g.fillStyle = SEPIA;
  g.beginPath();
  g.arc(x, y, 0.07, 0, Math.PI * 2);
  g.fill();
  g.textAlign = side > 0 ? 'left' : 'right';
  g.fillText(NAMES[which], x + side * 0.16, y - up * 0.24);
}
g.font = 'italic 0.42px Georgia, serif';
g.textAlign = 'center';
g.fillStyle = 'rgba(70,90,100,0.75)';
for (const [text, lon, lat] of [[tr('Atlantic Ocean'), -38, 30], [tr('Atlantic Ocean'), 322, 30], [tr('Indian Ocean'), 75, 6],
  [tr('Pacific Ocean'), 205, 24]]) {
  const [x, y] = P([lon, lat]);
  g.fillText(text, x, y);
}
// the way: in red ink (by sea in dashes), and the share of the way under it, grey for grey
const way = L.pieces();
e.layer('ink', {}, I => {
  I.strokeStyle = INK;
  I.lineWidth = 0.075;
  I.lineCap = 'round';
  I.lineJoin = 'round';
  for (const leg of L.WAY) {
    I.setLineDash(leg.by === 'sea' ? [0.22, 0.14] : []);
    I.beginPath();
    leg.pts.forEach((p, i) => { const [x, y] = P(p); if (i) I.lineTo(x, y); else I.moveTo(x, y); });
    I.stroke();
  }
});
// (a share u written as the grey whose light is u: what the shader reads back is u itself)
const grey = u => { const v = Math.round(255 * (u <= 0.0031308 ? 12.92 * u : 1.055 * u ** (1 / 2.4) - 0.055)); return `rgb(${v},${v},${v})`; };
e.layer('share', {}, S => {
  S.lineWidth = 0.16;
  S.lineCap = 'round';
  for (const [a, b, u] of way) {
    const [ax, ay] = P(a), [bx, by] = P(b);
    S.strokeStyle = grey(u);
    S.beginPath();
    S.moveTo(ax, ay);
    S.lineTo(bx, by);
    S.stroke();
  }
});
// the day won: the 180th meridian in red, a notch across the way there, «+1 day» beside it
e.layer('dateline', {}, D => {
  const x = L.X(180), [, y] = P([180, 42.2]);
  D.strokeStyle = INK;
  D.lineWidth = 0.03;
  D.setLineDash([0.1, 0.08]);
  D.beginPath();
  D.moveTo(x, y0);
  D.lineTo(x, y1);
  D.stroke();
  D.setLineDash([]);
  D.lineWidth = 0.07;
  D.beginPath();
  D.moveTo(x - 0.12, y - 0.3);
  D.lineTo(x + 0.12, y + 0.3);
  D.moveTo(x + 0.06, y - 0.3);
  D.lineTo(x + 0.3, y + 0.3);
  D.stroke();
  D.fillStyle = INK;
  D.font = 'italic 0.36px Georgia, serif';
  D.textAlign = 'left';
  D.textBaseline = 'middle';
  D.fillText(tr('+1 day'), x + 0.4, y - 0.55);
});
