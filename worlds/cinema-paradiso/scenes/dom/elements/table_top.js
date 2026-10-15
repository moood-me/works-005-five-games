// The table's top from above (y toward the start): a faded checked oilcloth, worn pale where the hands go; bread on
// a board in the past. Painted once a time.
const T = e.lib.G.TABLE;
g.fillStyle = '#b9c0a8'; g.fillRect(-T.w / 2 - 0.03, -T.d / 2 - 0.03, T.w + 0.06, T.d + 0.06);
g.fillStyle = 'rgba(80,100,80,0.28)';
for (let x = -T.w / 2; x < T.w / 2; x += 0.08) g.fillRect(x, -T.d / 2, 0.04, T.d);
for (let y = -T.d / 2; y < T.d / 2; y += 0.08) g.fillRect(-T.w / 2, y, T.w, 0.04);
const worn = g.createRadialGradient(0, 0.1, 0, 0, 0.1, 0.5);
worn.addColorStop(0, 'rgba(235,230,210,0.35)'); worn.addColorStop(1, 'rgba(235,230,210,0)');
g.fillStyle = worn; g.fillRect(-T.w / 2, -T.d / 2, T.w, T.d);
if (e.state.era !== 'now') {
  g.fillStyle = '#6a4a30'; g.fillRect(-0.48, -0.2, 0.3, 0.2);
  g.fillStyle = '#c9965a'; g.beginPath(); g.ellipse(-0.33, -0.1, 0.11, 0.07, 0, 0, Math.PI * 2); g.fill();
}
