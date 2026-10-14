// The settlement's lights far beyond the field: dark low houses, a few warm windows.
const row = (x0, x1, hmin, hmax) => {
  for (let x = x0; x < x1; ) {
    const w = 3 + 4 * e.rnd(), h = hmin + (hmax - hmin) * e.rnd();
    g.fillStyle = '#0f1630';
    g.fillRect(x, -h, w, h);
    g.beginPath(); g.moveTo(x - 0.4, -h); g.lineTo(x + w / 2, -h - 1.6 - e.rnd()); g.lineTo(x + w + 0.4, -h); g.fill();
    g.fillStyle = '#5b6a92'; g.globalAlpha = 0.5;
    g.beginPath(); g.moveTo(x - 0.4, -h); g.lineTo(x + w / 2, -h - 1.6); g.lineTo(x + w / 2, -h - 1.2); g.lineTo(x - 0.1, -h); g.fill();
    g.globalAlpha = 1;
    if (e.rnd() < 0.55) {
      const wx = x + w * (0.25 + 0.4 * e.rnd()), wy = -h * (0.4 + 0.3 * e.rnd());
      g.fillStyle = '#f0b050'; g.fillRect(wx, wy, 0.8, 0.9);
      e.light(wx + 0.4, wy + 0.45, 1.1, '#e8963a', 0.7);
    }
    x += w + 1 + 5 * e.rnd();
  }
};
row(-58, 58, 3, 5.5);
