const k = e.kit.kino, W = 6, H = 4, x = -3, y = -6.5;
e.layer('blur', {}, l => { l.filter = 'blur(0.18px)'; k.frame(l, 'comedy', x, y, W, H); l.filter = 'none'; });
e.layer('sharp', { flicker: 0.12 }, l => k.frame(l, 'comedy', x, y, W, H));
e.layer('white', { flicker: 0.1 }, l => k.frame(l, 'white', x, y, W, H));
e.layer('burn', { pivot: [0, -4.5], box: [-3.1, -6.6, 3.1, -2.4] }, l => {
  const r = l.createRadialGradient(0, -4.5, 0, 0, -4.5, 3.2);
  r.addColorStop(0, '#fffdf6'); r.addColorStop(0.5, '#f6eedb'); r.addColorStop(0.72, 'rgba(170,110,60,0.95)'); r.addColorStop(0.8, 'rgba(40,24,12,0.85)'); r.addColorStop(1, 'rgba(40,24,12,0)');
  l.fillStyle = r; l.fillRect(-3, -6.5, 6, 4);
});
