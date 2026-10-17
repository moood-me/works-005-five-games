// The kitchen table seen from its long south side: the apron with a drawer, four turned legs (the far two between
// the near ones), the oilcloth's edge hanging over. Its top is table_top. Painted once.
const T = e.lib.G.TABLE, w = T.w, h = T.top;
g.fillStyle = '#4e3b2a';
for (const x of [-w / 2 + 0.06, w / 2 - 0.1]) g.fillRect(x, -h + 0.08, 0.05, h - 0.08);
g.fillStyle = '#3e2f22';
for (const x of [-w / 2 + 0.2, w / 2 - 0.24]) g.fillRect(x, -h + 0.08, 0.04, h - 0.1);
g.fillStyle = '#5c4632'; g.fillRect(-w / 2 + 0.03, -h + 0.02, w - 0.06, 0.1);
g.fillStyle = '#4a3828'; g.fillRect(-0.18, -h + 0.04, 0.36, 0.06);
g.fillStyle = '#8f7a52'; g.fillRect(-0.02, -h + 0.06, 0.04, 0.02);
// the oilcloth's edge: pale, a faded check
g.fillStyle = '#b9c0a8'; g.fillRect(-w / 2 - 0.03, -h - 0.01, w + 0.06, 0.07);
g.fillStyle = 'rgba(80,100,80,0.35)';
for (let x = -w / 2; x < w / 2; x += 0.08) g.fillRect(x, -h - 0.01, 0.04, 0.07);
e.at(0, -h, 'edge');
