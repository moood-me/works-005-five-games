// A low bush of the cliff top (juniper, wild pistachio) — one painting, many copies. Origin at its foot.
const rnd = e.rnd, greens = ['#5c654f', '#6a7158', '#535d4a'];
e.layer('bush', { wind: { strength: 0.2, gust: 0.4 }, pivot: [0, 0] }, gb => {
  for (let k = 0; k < 14; k++) {
    gb.fillStyle = greens[k % 3];
    gb.beginPath(); gb.ellipse((rnd() - 0.5) * 1.3, -0.25 - rnd() * 0.6, 0.25 + rnd() * 0.3, 0.2 + rnd() * 0.2, 0, 0, Math.PI * 2); gb.fill();
  }
});
