e.layer('m', { box: [-130, -16, 130, 0], drift: [2, 0] }, g => {
  const W = 260;
  for (let i = 0; i < 16; i++) {
    const x = -130 + (i / 16) * W + e.rnd() * 10, w = 28 + e.rnd() * 30, h = 3 + e.rnd() * 5, y = -h * 0.6 - e.rnd() * 3;
    for (const dx of [-W, 0, W]) {
      const r = g.createRadialGradient(x + dx, y, 0, x + dx, y, w);
      r.addColorStop(0, 'rgba(230,226,240,0.55)'); r.addColorStop(1, 'rgba(230,226,240,0)');
      g.save(); g.translate(0, y); g.scale(1, h / w); g.translate(0, -y);
      g.fillStyle = r; g.beginPath(); g.arc(x + dx, y, w, 0, 7); g.fill(); g.restore();
    }
  }
});
