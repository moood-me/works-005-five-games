// The main deck from above, stern to stem (the plane's far edge y −26 is the stem at 47 m, its near edge the stern):
// planks along the ship, their butts staggered, the seams caulked dark; the waterways along the sides; the ship's deck
// colour (the «Henrietta»'s worn and greyer).
const L = e.lib, c = L.colours(e.state);
L.rect(g, -5.6, -26, 11.2, 52, c.deck);
// the planks: a seam every 0.16 m, butts every 6 m staggered by plank
g.fillStyle = L.shade(c.deck, 0.32);
for (let x = -5.2; x < 5.2; x += 0.16) g.fillRect(x, -26, 0.018, 52);
g.fillStyle = L.shade(c.deck, 0.22);
for (let i = 0, x = -5.2; x < 5.2; x += 0.16, i++) for (let y = -26 + (i % 5) * 1.2; y < 26; y += 6) g.fillRect(x, y, 0.16, 0.025);
// a few planks a shade lighter or darker, as old wood is
for (let k = 0; k < 18; k++) {
  const x = -5.2 + 0.16 * Math.floor(e.rnd() * 65), y = -26 + 46 * e.rnd();
  g.fillStyle = e.rnd() < 0.5 ? L.tint(c.deck, 0.08) : L.shade(c.deck, 0.07);
  g.fillRect(x + 0.02, y, 0.14, 6);
}
// the waterways: a darker strip along either side
L.rect(g, -5.6, -26, 0.4, 52, L.shade(c.deck, 0.28));
L.rect(g, 5.2, -26, 0.4, 52, L.shade(c.deck, 0.28));
