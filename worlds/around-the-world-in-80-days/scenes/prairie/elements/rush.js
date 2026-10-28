// The snow by the line running past while the train or the sledge runs «on the spot» (the plane's metres: x along the
// line, y toward the viewer — 30 − distance): long thin streaks of blown snow and a few smears of grass, one stretch of
// 40 m painted over and over; a layer that runs back by the stretch, seen only as fast as the plain runs (animate).
const h = e.anim.hash, SP = 40;
e.layer('streaks', { box: [-212, -28, 252, 28] }, g => {
  for (let t = -6; t <= 6; t++) {
    for (let i = 0; i < 60; i++) {
      const x = t * SP + h(i, 1) * SP;
      if (x < -212 || x > 252) continue;
      const y = -28 + h(i, 2) * 56, len = 1.5 + 5 * h(i, 3), k = i % 6;
      g.fillStyle = k === 5 ? 'rgba(176,168,144,0.45)' : k % 2 ? 'rgba(255,255,255,0.75)' : 'rgba(198,212,230,0.6)';
      g.beginPath();
      g.ellipse(x, y, k === 5 ? len * 0.4 : len, 0.05 + 0.12 * h(i, 4), 0, 0, Math.PI * 2);
      g.fill();
    }
  }
});
