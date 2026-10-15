const k = e.kit.kino, W = 6, H = 4, x = -3, y = -6.5;
e.layer('blur', {}, l => { l.filter = 'blur(0.18px)'; k.frame(l, 'comedy', x, y, W, H); l.filter = 'none'; });
e.layer('sharp', { flicker: 0.12 }, l => k.frame(l, 'comedy', x, y, W, H));
e.layer('white', { flicker: 0.1 }, l => k.frame(l, 'white', x, y, W, H));
const BL = [[-0.8, -4.9, 1.0], [1.2, -3.6, 0.8], [0.4, -5.6, 0.7], [-1.9, -3.4, 0.6]];
BL.forEach(([cx, cy, R0], i) => e.layer('burn' + i, { pivot: [cx, cy], box: [-3.1, -6.6, 3.1, -2.4] }, l => {
  l.save(); l.beginPath(); l.rect(-3, -6.5, 6, 4); l.clip();
  const ring = (rad, col) => { l.fillStyle = col; l.beginPath(); for (let k = 0; k <= 24; k++) { const a = k / 24 * Math.PI * 2, r = rad * (0.8 + 0.35 * e.anim.hash(k + i * 31, 7)); l.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.9); } l.fill(); };
  ring(R0 * 1.15, 'rgba(70,40,18,0.9)'); ring(R0, '#c8783a'); ring(R0 * 0.82, '#f2d9a8'); ring(R0 * 0.6, '#fbf4e4');
  l.restore();
}));
