// The far side of Pall Mall, forty metres off: a long row of facades, dissolved in the fog — painted in the grey of a
// London day (the look on `day` makes the night). The fog over them ("fog") and their windows lit here and there
// ("windows") are layers its shader lets shine: the fog in the hour's colours, the windows as the gas is lit (street.wgsl,
// the hour by street.animate.js).
const P = e.lib.plan;
const base = -P.street;
const svet = e.kit.svet;
const facade = '#8e9599', low = '#c9ccc8';
const fog = svet.mixc(facade, low, 0.35);
// blocks of houses: [left, right, height]
const blocks = [
  [-52, -41, 19],
  [-41, -27, 23],
  [-27, -16, 17.5],
  [-16, -4, 21],
];
for (const [x0, x1, h] of blocks) {
  g.fillStyle = svet.rgba(svet.mixc(fog, low, (h - 17) * 0.05));
  g.fillRect(x0, base - h, x1 - x0, h);
  // the cornice: one quiet line
  g.fillStyle = svet.rgba(svet.mixc(fog, low, 0.35));
  g.fillRect(x0, base - h + 1.2, x1 - x0, 0.25);
}
// the fog over them, thickening toward the street: its share (the colour is the hour's — street.wgsl, light of its own:
// the fog is lit by the city, not by the evening)
e.layer('fog', {}, f => {
  const gr = f.createLinearGradient(0, base - 22, 0, base);
  gr.addColorStop(0, 'rgba(255,255,255,0.15)');
  gr.addColorStop(1, 'rgba(255,255,255,0.75)');
  f.fillStyle = gr;
  f.fillRect(-52, base - 24, 48, 24);
});
// the windows across the street lit, here and there, behind the fog that lies over them
e.layer('windows', {}, w => {
  for (const [x0, x1, h] of blocks) {
    for (let x = x0 + 1.4; x < x1 - 1; x += 2.6) {
      for (let y = 4; y < h - 3; y += 4.2) {
        if (e.rnd() > 0.16) continue;
        w.fillStyle = svet.rgba('#e9b26a', 0.16 * (0.25 + 0.6 * Math.min(1, y / 22)));
        w.fillRect(x, base - y - 2.2, 1, 2);
      }
    }
  }
});
