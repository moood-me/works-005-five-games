// The thin partition closing Toto's corner on the south, seen from inside the corner (its x runs west): whitewash,
// photos of film stars cut from magazines pinned round a bare patch — where the home movie falls. Painted once.
const C = e.lib.G.CORNER, w = (C.x1 - C.x0) / 2, h = e.lib.G.ROOM.h;
g.fillStyle = '#cfc3ab'; g.fillRect(-w - 0.02, -h - 0.02, 2 * w + 0.04, h + 0.04);
for (let i = 0; i < 30; i++) {
  const x = -w + e.rnd() * 2 * w, y = -h + e.rnd() * h, r = 0.05 + e.rnd() * 0.2;
  g.fillStyle = i % 3 ? 'rgba(90,70,50,0.05)' : 'rgba(255,245,225,0.05)';
  g.beginPath(); g.ellipse(x, y, r, r * 0.7, e.rnd() * 3, 0, Math.PI * 2); g.fill();
}
g.fillStyle = '#7b6a56'; g.fillRect(-w - 0.02, -0.95, 2 * w + 0.04, 0.95);
g.fillStyle = '#4b3e31'; g.fillRect(-w - 0.02, -0.12, 2 * w + 0.04, 0.12);
// cut-out pictures: faces in profile, a couple, a car — grey and sepia, slightly askew, round the bare patch
const cut = (x, y, ww, hh, a, col) => {
  g.save(); g.translate(x, y); g.rotate(a);
  g.fillStyle = '#e6dcc6'; g.fillRect(-ww / 2, -hh / 2, ww, hh);
  g.fillStyle = col; g.fillRect(-ww / 2 + 0.01, -hh / 2 + 0.01, ww - 0.02, hh - 0.02);
  g.fillStyle = 'rgba(30,26,22,0.75)'; g.beginPath(); g.ellipse(0, -hh * 0.05, ww * 0.18, hh * 0.22, 0, 0, Math.PI * 2); g.fill();
  g.fillRect(-ww * 0.3, hh * 0.15, ww * 0.6, hh * 0.3);
  g.restore();
};
cut(-0.62, -1.95, 0.16, 0.2, -0.06, '#9b8f7c');
cut(-0.5, -1.62, 0.14, 0.18, 0.08, '#a8946e');
cut(0.55, -2.0, 0.18, 0.22, 0.05, '#8f8a82');
cut(0.62, -1.62, 0.14, 0.17, -0.1, '#a1886a');
cut(-0.6, -1.12, 0.15, 0.18, 0.04, '#948a7a');
e.at(0, -1.5, 'square');
