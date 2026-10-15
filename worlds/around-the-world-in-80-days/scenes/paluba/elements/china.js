// The «China»'s smoke, New York: a steamer hull-down on the horizon and her trail of smoke lying long behind her —
// she left forty-five minutes ago. Point china#smoke. Nothing in another port.
if (e.lib.portOf(e.state) === 'new_york') {
  const L = e.lib;
  L.poly(g, [[-14, 0], [16, 0], [12, -4], [-12, -4]], '#3a3c40');
  L.rect(g, -2, -14, 3.4, 10, '#2a2a2c');
  L.rect(g, -10, -24, 0.7, 20, '#3a3c40');
  L.rect(g, 8, -22, 0.7, 18, '#3a3c40');
  e.layer('trail', { drift: [6, 0], box: [-40, -150, 260, 0] }, g => {
    for (let i = 0; i < 26; i++) {
      const u = i / 25, x = u * 240, y = -16 - 70 * Math.pow(u, 0.7) - 8 * Math.sin(u * 7), r = 6 + 26 * u;
      g.fillStyle = L.rgba(L.mixc('#5c5a56', '#a8a6a0', u), 0.7 - 0.45 * u);
      g.beginPath();
      g.ellipse(x, y, r * 1.6, r, 0, 0, Math.PI * 2);
      g.fill();
    }
  });
  e.at(30, -50, 'smoke');
}
