// Переезд: общий код. Место — в метрах: across (вправо от линии взгляда), distance (вперёд).
// Путь: ближний прямой отрезок слева-снизу к P1, дальше дуга вглубь к лесу. Путь считается от дальнего конца (s = 0).
const P1 = [22, 17], C = [56, 26.9], P2 = [88, 200];
const N_WAGONS = 9, LOCO_HALF = 7.5, WAGON_STEP = 12, FIRST = 13.75;
const TAIL = FIRST + (N_WAGONS - 1) * WAGON_STEP + 5.75;      // от центра тепловоза до хвоста
const SPEED = 20;                                              // м/с — скорость товарного

const pts = [];
for (let i = 0; i <= 60; i++) {
  const t = i / 60, u = 1 - t;
  pts.push([u * u * P2[0] + 2 * u * t * C[0] + t * t * P1[0], u * u * P2[1] + 2 * u * t * C[1] + t * t * P1[1]]);
}
{
  const dx = P1[0] - C[0], dy = P1[1] - C[1], dl = Math.hypot(dx, dy);
  for (let m = 4; m <= 120; m += 4) pts.push([P1[0] + dx / dl * m, P1[1] + dy / dl * m]);
}
const cum = [0];
for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
const LEN = cum[cum.length - 1];

// точка пути на расстоянии s от дальнего конца: { a, d, psi } — psi: угол линии пути от оси «поперёк», градусы
function at(s) {
  if (s <= 0) {
    const dx = P2[0] - C[0], dy = P2[1] - C[1], dl = Math.hypot(dx, dy);
    return { a: P2[0] + dx / dl * -s, d: P2[1] + dy / dl * -s, psi: Math.atan2(dy, dx) * 57.29578 };
  }
  let i = 1;
  while (i < cum.length - 1 && cum[i] < s) i++;
  const k = Math.min(1, Math.max(0, (s - cum[i - 1]) / (cum[i] - cum[i - 1])));
  const p = pts[i - 1], q = pts[i];
  return { a: p[0] + (q[0] - p[0]) * k, d: p[1] + (q[1] - p[1]) * k, psi: Math.atan2(p[1] - q[1], p[0] - q[0]) * 57.29578 };
}
// s, при котором путь проходит across = a
function sAcross(a) {
  for (let i = 1; i < pts.length; i++) {
    if (pts[i][0] <= a) { const k = (pts[i - 1][0] - a) / (pts[i - 1][0] - pts[i][0]); return cum[i - 1] + (cum[i] - cum[i - 1]) * k; }
  }
  return LEN;
}
const S_PEOPLE = sAcross(-0.4);      // тепловоз против людей
const S_EDGE = sAcross(-10);         // тепловоз у левого края кадра
const S_LOUD = S_PEOPLE + 36;        // вагоны идут прямо перед ними
const S_TAIL = S_PEOPLE + TAIL + 1;  // хвост прошёл мимо людей
const S_END = S_EDGE + TAIL + 2;     // весь состав ушёл за левый край
const S_LIGHT = 0;                   // фара на дуге вдали

// где стоит n-й вагон (1…) при тепловозе в s; k = 0 — сам тепловоз
function carAt(s, k) {
  const off = k === 0 ? 0 : FIRST + (k - 1) * WAGON_STEP;
  const p = at(s - off);
  return { a: p.a, d: p.d, f: 180 - p.psi };
}

// ---- рисунок вагонов (метры, якорь — середина у рельсов, +x вдоль пути «от камеры», тепловоз носом в −x)
const COL = { box: '#54404a', tank: '#36435a', open: '#5a4a44', flat: '#3a414f' };
function wheels(g, xs) {
  for (const x of xs) {
    g.fillStyle = '#0d1016'; g.beginPath(); g.arc(x, -0.46, 0.46, 0, 6.3); g.fill();
    g.fillStyle = '#2a3242'; g.beginPath(); g.arc(x, -0.46, 0.17, 0, 6.3); g.fill();
  }
}
function snowTop(g, x0, x1, y, h) {
  g.fillStyle = '#dbe4f2'; g.beginPath(); g.moveTo(x0, y);
  const n = Math.max(2, Math.round((x1 - x0) / 0.9));
  for (let i = 0; i <= n; i++) g.lineTo(x0 + (x1 - x0) * i / n, y - h * (0.6 + 0.4 * Math.sin(i * 2.3 + x0)));
  g.lineTo(x1, y + 0.02); g.lineTo(x0, y + 0.02); g.closePath(); g.fill();
}
function chassis(g, x0, x1) {
  g.fillStyle = '#0c1017'; g.fillRect(x0, -1.12, x1 - x0, 0.5);
  g.fillStyle = '#1a202b';
  g.fillRect(x0 + 0.9, -0.95, 2.4, 0.55); g.fillRect(x1 - 3.3, -0.95, 2.4, 0.55);
  wheels(g, [x0 + 1.4, x0 + 2.8, x1 - 2.8, x1 - 1.4]);
}
function wagon(g, e, kind, seed) {
  const x0 = -5.6, x1 = 5.6, c = COL[kind];
  chassis(g, x0, x1);
  // сцепка
  g.fillStyle = '#0c1017'; g.fillRect(-6.3, -0.9, 0.9, 0.18); g.fillRect(5.4, -0.9, 0.9, 0.18);
  if (kind === 'box') {
    g.fillStyle = c; g.fillRect(x0, -4.0, x1 - x0, 2.9);
    g.fillStyle = 'rgba(0,0,0,0.22)';
    for (let x = x0 + 0.5; x < x1; x += 0.55) g.fillRect(x, -4.0, 0.05, 2.9);
    g.fillStyle = 'rgba(255,255,255,0.10)'; g.fillRect(x0, -4.0, x1 - x0, 0.1);
    // дверь на катках
    g.fillStyle = 'rgba(0,0,0,0.30)'; g.fillRect(-1.2, -3.8, 2.4, 2.6);
    g.fillStyle = '#8b97ad'; g.fillRect(-1.2, -3.85, 2.4, 0.07); g.fillRect(-1.2, -1.28, 2.4, 0.06);
    g.fillRect(-0.05, -3.8, 0.1, 2.6);
    snowTop(g, x0, x1, -4.0, 0.22);
  } else if (kind === 'tank') {
    g.fillStyle = c;
    g.beginPath(); g.roundRect ? g.roundRect(x0 + 0.2, -3.9, x1 - x0 - 0.4, 2.8, 1.35) : g.rect(x0 + 0.2, -3.9, x1 - x0 - 0.4, 2.8); g.fill();
    g.fillStyle = 'rgba(255,255,255,0.12)'; g.fillRect(x0 + 0.9, -3.8, x1 - x0 - 1.8, 0.14);
    g.fillStyle = 'rgba(0,0,0,0.28)';
    for (const x of [-3.6, -1.2, 1.2, 3.6]) g.fillRect(x - 0.05, -3.9, 0.1, 2.8);
    g.fillStyle = '#1e2736'; g.fillRect(-0.5, -4.25, 1.0, 0.4);                    // люк
    g.fillStyle = '#20293a'; g.fillRect(x0 + 0.1, -1.4, x1 - x0 - 0.2, 0.3);
    snowTop(g, -3.2, 3.2, -3.9, 0.2);
  } else if (kind === 'open') {
    g.fillStyle = c; g.fillRect(x0, -3.1, x1 - x0, 2.0);
    g.fillStyle = 'rgba(0,0,0,0.25)';
    for (let x = x0 + 1.1; x < x1; x += 1.4) g.fillRect(x, -3.1, 0.12, 2.0);
    g.fillStyle = '#7d8aa3'; g.fillRect(x0, -3.15, x1 - x0, 0.12);
    // груз: холм под снегом
    g.fillStyle = '#26303f'; g.beginPath(); g.moveTo(x0 + 0.3, -3.1);
    for (let i = 0; i <= 12; i++) { const u = i / 12, x = x0 + 0.3 + (x1 - x0 - 0.6) * u; g.lineTo(x, -3.1 - 0.9 * Math.sin(u * 3.14) - 0.15 * Math.sin(u * 17 + seed)); }
    g.lineTo(x1 - 0.3, -3.1); g.closePath(); g.fill();
    snowTop(g, x0 + 1.2, x1 - 1.2, -3.95, 0.25);
  } else { // flat
    g.fillStyle = c; g.fillRect(x0, -1.5, x1 - x0, 0.45);
    g.fillStyle = '#2b2f3b';
    g.fillRect(-5.0, -3.1, 3.2, 1.6); g.fillRect(-1.5, -3.5, 3.0, 2.0); g.fillRect(1.9, -2.9, 3.1, 1.4);
    g.fillStyle = 'rgba(255,255,255,0.12)';
    g.fillRect(-5.0, -3.1, 3.2, 0.1); g.fillRect(-1.5, -3.5, 3.0, 0.1); g.fillRect(1.9, -2.9, 3.1, 0.1);
    g.fillStyle = '#8b97ad';
    for (const x of [-5.3, 5.3]) g.fillRect(x - 0.05, -3.9, 0.1, 2.4);
  }
}
function loco(g, e) {
  const x0 = -7.5, x1 = 7.5;
  chassis(g, x0 + 0.4, x1 - 0.4);
  wheels(g, [x0 + 3.9, x1 - 3.9]);
  g.fillStyle = '#0c1017'; g.fillRect(-8.2, -0.95, 0.9, 0.2); g.fillRect(7.3, -0.95, 0.9, 0.2);
  // корпус: длинный капот-нос, кабина, задний капот
  g.fillStyle = '#34445f';
  g.beginPath(); g.moveTo(x0, -1.1); g.lineTo(x0, -3.0); g.lineTo(x0 + 0.5, -3.3); g.lineTo(-1.2, -3.3);
  g.lineTo(-1.2, -4.4); g.lineTo(3.4, -4.4); g.lineTo(3.4, -3.5); g.lineTo(x1 - 0.2, -3.5); g.lineTo(x1, -3.2); g.lineTo(x1, -1.1); g.closePath(); g.fill();
  g.fillStyle = '#6f84a6'; g.fillRect(x0, -2.35, x1 - x0, 0.22);                       // светлая полоса
  g.fillStyle = 'rgba(0,0,0,0.25)'; g.fillRect(x0, -1.5, x1 - x0, 0.4);
  // окна кабины
  g.fillStyle = '#16202f'; g.fillRect(-0.9, -4.0, 1.3, 1.1); g.fillRect(0.7, -4.0, 1.3, 1.1); g.fillRect(2.3, -4.0, 0.8, 1.1);
  g.fillStyle = 'rgba(160,190,230,0.25)'; g.fillRect(-0.9, -4.0, 1.3, 0.2); g.fillRect(0.7, -4.0, 1.3, 0.2);
  // жалюзи заднего капота
  g.fillStyle = 'rgba(0,0,0,0.35)'; for (let x = 4.0; x < 7.0; x += 0.38) g.fillRect(x, -3.3, 0.14, 1.0);
  // поручни и вентилятор
  g.fillStyle = '#9aa7bd'; g.fillRect(x0 + 0.3, -3.4, 5.8, 0.07);
  g.fillStyle = '#0f1520'; g.fillRect(5.0, -3.8, 1.2, 0.3);
  snowTop(g, -1.2, 3.4, -4.4, 0.2); snowTop(g, x0 + 0.6, -1.4, -3.3, 0.15); snowTop(g, 3.6, x1 - 0.4, -3.5, 0.15);
  // фара: корпус и огонь
  g.fillStyle = '#c9d4e6'; g.beginPath(); g.arc(x0 + 0.25, -2.7, 0.3, 0, 6.3); g.fill();
  g.fillStyle = '#fff3d2'; g.beginPath(); g.arc(x0 + 0.25, -2.7, 0.2, 0, 6.3); g.fill();
  e.light(x0 + 0.1, -2.7, 1.2, '#fff0cc', 2.0, 'lamp');
  e.at(x0 + 0.1, -2.7, 'light');
}

return { P1, C, P2, pts, cum, LEN, at, sAcross, carAt, wagon, loco, N_WAGONS, TAIL, SPEED, S_PEOPLE, S_LOUD, S_TAIL, S_END, S_LIGHT };
