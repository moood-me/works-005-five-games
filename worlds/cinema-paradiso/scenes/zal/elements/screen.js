
// The screen in the proscenium: a white sheet 7 × 4 m in a black border, a film on it (layers: romance,
// romance_kiss, comedy, white; the shader shows the one `screen_film` names and makes it shine with the beam).
// 1988: a torn grey sheet (its own layer) — the film only in the memory.
const P = e.lib, W = 3.5, top = -6.2, bot = -2.2;
g.fillStyle = '#0d0c0c'; g.fillRect(-W - 0.15, top - 0.15, 2 * W + 0.3, bot - top + 0.3);
for (const f of ['romance', 'romance_kiss', 'comedy', 'white']) e.layer(f, { box: [-W, top, W, bot] }, l => P.film(l, f, -W, top, 2 * W, bot - top));
e.layer('torn', { box: [-W, top, W, bot] }, t => {
  t.fillStyle = '#9a968c'; t.fillRect(-W, top, 2 * W, bot - top);
  t.fillStyle = '#0d0c0c';
  t.beginPath(); t.moveTo(0.6, top); t.lineTo(1.6, top + 1.4); t.lineTo(1.1, top + 2.2); t.lineTo(2.2, bot); t.lineTo(3.5, bot); t.lineTo(3.5, top + 1.0); t.lineTo(2.0, top); t.closePath(); t.fill();
  t.fillStyle = 'rgba(70,60,50,0.4)'; for (let i = 0; i < 14; i++) t.fillRect(-W + e.anim.hash(i, 5) * 6, top, 0.05, 1 + e.anim.hash(i, 6) * 2.5);
});
e.at(0, (top + bot) / 2, 'screen');
