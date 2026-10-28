// The steamer's masts in her middle line, their yards, the stays and shrouds, the bowsprit (x along her, from her deck
// up); her masthead light, white (lit as the lanterns are: its animate).
const L = e.lib;
const S = L.plan.steamer;
const up = h => -(h - S.deck);
g.strokeStyle = '#2a2622';
g.lineCap = 'round';
for (const [x, top] of S.masts) {
  g.lineWidth = 0.32;
  g.beginPath();
  g.moveTo(x, 0);
  g.lineTo(x + 0.6, up(top));
  g.stroke();
  // the yards, squared
  g.lineWidth = 0.16;
  for (const [k, w] of [[0.55, 9], [0.75, 7], [0.92, 4.6]]) {
    const y = up(S.deck + (top - S.deck) * k);
    g.beginPath();
    g.moveTo(x + 0.5 * k - w / 2, y);
    g.lineTo(x + 0.5 * k + w / 2, y);
    g.stroke();
  }
  // the shrouds to her rail either side
  g.lineWidth = 0.04;
  for (const s of [-1, 1]) {
    for (let k = 0; k < 4; k++) {
      g.beginPath();
      g.moveTo(x + 0.3 * k * s, up(S.deck + (top - S.deck) * 0.7));
      g.lineTo(x + s * (2.2 + 0.5 * k), up(S.rail));
      g.stroke();
    }
  }
}
// the stays: bowsprit to the foremast, mast to mast, the main to her stern
const [[mx, mt], [fx, ft]] = S.masts;
g.lineWidth = 0.05;
g.beginPath();
g.moveTo(43, up(S.rail + 1.6));
g.lineTo(fx + 0.6, up(ft));
g.moveTo(fx + 0.4, up(ft - 2));
g.lineTo(mx + 0.4, up(mt - 4));
g.moveTo(mx + 0.6, up(mt));
g.lineTo(-35, up(S.rail));
g.stroke();
g.lineWidth = 0.28;
g.beginPath();
g.moveTo(35.5, up(L.sheer(36) + 0.1));
g.lineTo(43, up(S.rail + 1.6));
g.stroke();
L.lantern(e, g, fx + 0.6, up(ft) + 4, 0.3, '#fff4e0', 'masthead');
e.at(fx + 0.6, up(ft) + 4, 'masthead');
