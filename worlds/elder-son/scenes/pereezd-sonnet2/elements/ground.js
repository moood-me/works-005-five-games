const A0 = 20, D0 = 120, L = e.lib;
const X = a => a - A0, Y = d => D0 - d;          // мир → холст плоскости (y к зрителю)
// снег
g.fillStyle = '#e4eaf4'; g.fillRect(-110, -125, 220, 250);
// волны наста: низкий контраст, ближе гуще
for (let i = 0; i < 260; i++) {
  const d = 3 + Math.pow(e.rnd(), 1.7) * 220, a = -70 + e.rnd() * 190, rx = 1.5 + e.rnd() * 7 * (1 + d / 60), ry = rx * (0.18 + e.rnd() * 0.15);
  g.fillStyle = e.rnd() < 0.5 ? 'rgba(255,255,255,0.28)' : 'rgba(150,170,205,0.14)';
  g.beginPath(); g.ellipse(X(a), Y(d), rx, ry, 0, 0, 6.3); g.fill();
}
const road = [[-14, 2.4], [-9, 2.9], [-6.5, 3.4], [-3.6, 4.6], [-1.9, 6.4], [-0.9, 8.4], [-0.5, 10.3], [-0.6, 13], [-2.8, 18], [-8, 27], [-16, 41], [-24, 63], [-31, 92], [-38, 125]];
function strokeRoad(w, col) {
  g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round'; g.lineJoin = 'round';
  g.beginPath(); g.moveTo(X(road[0][0]), Y(road[0][1]));
  for (let i = 1; i < road.length - 1; i++) {
    const mx = (road[i][0] + road[i + 1][0]) / 2, my = (road[i][1] + road[i + 1][1]) / 2;
    g.quadraticCurveTo(X(road[i][0]), Y(road[i][1]), X(mx), Y(my));
  }
  g.lineTo(X(road[road.length - 1][0]), Y(road[road.length - 1][1])); g.stroke();
}
// насыпь путей: балласт, шпалы, рельсы — по точкам пути; он идёт и влево за кадр, и дугой в лес
const EXT = (() => { const dx = L.P2[0] - L.C[0], dy = L.P2[1] - L.C[1], dl = Math.hypot(dx, dy); return [L.P2[0] + dx / dl * 45, L.P2[1] + dy / dl * 45]; })();
const PP = [EXT].concat(L.pts);
function trackStroke(w, col, off) {
  g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'butt'; g.lineJoin = 'round';
  g.beginPath();
  for (let i = 0; i < PP.length; i++) {
    const p = PP[i], q = PP[Math.min(PP.length - 1, i + 1)], r = PP[Math.max(0, i - 1)];
    const tx = q[0] - r[0], ty = q[1] - r[1], tl = Math.hypot(tx, ty) || 1;
    const nx = -ty / tl, ny = tx / tl;
    const a = p[0] + nx * off, d = p[1] + ny * off;
    if (i === 0) g.moveTo(X(a), Y(d)); else g.lineTo(X(a), Y(d));
  }
  g.stroke();
}
trackStroke(4.2, '#6b7488', 0);           // насыпь
trackStroke(3.2, '#586177', 0);           // балласт
strokeRoad(5.2, '#cfd8e8');               // обочина дороги, утоптанный снег
strokeRoad(3.6, '#a9b4c8');               // полотно
strokeRoad(0.35, 'rgba(70,82,108,0.5)');  // колея
// шпалы
g.strokeStyle = '#2f3544'; g.lineWidth = 0.28;
for (let s = -45; s < L.LEN; s += 0.62) {
  const p = L.at(s), n = L.at(s + 0.5);
  const tx = n.a - p.a, ty = n.d - p.d, tl = Math.hypot(tx, ty) || 1, nx = -ty / tl, ny = tx / tl;
  g.beginPath(); g.moveTo(X(p.a + nx * 1.3), Y(p.d + ny * 1.3)); g.lineTo(X(p.a - nx * 1.3), Y(p.d - ny * 1.3)); g.stroke();
}
// настил переезда: светлые доски поперёк рельсов у дороги
{
  const s0 = L.sAcross(-0.5);
  g.strokeStyle = '#8c97ad'; g.lineWidth = 0.22;
  for (let s = s0 - 3.2; s < s0 + 3.2; s += 0.5) {
    const p = L.at(s), n = L.at(s + 0.5);
    const tx = n.a - p.a, ty = n.d - p.d, tl = Math.hypot(tx, ty) || 1, nx = -ty / tl, ny = tx / tl;
    g.beginPath(); g.moveTo(X(p.a + nx * 1.7), Y(p.d + ny * 1.7)); g.lineTo(X(p.a - nx * 1.7), Y(p.d - ny * 1.7)); g.stroke();
  }
}
trackStroke(0.16, '#b7c3d8', 0.72);       // рельсы
trackStroke(0.16, '#b7c3d8', -0.72);
// валики снега вдоль насыпи
trackStroke(1.1, 'rgba(244,248,255,0.8)', 2.9);
trackStroke(1.1, 'rgba(244,248,255,0.8)', -2.9);
