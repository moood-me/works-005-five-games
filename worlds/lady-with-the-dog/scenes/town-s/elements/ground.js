// The land round the street (from above, metres; x across, y toward the start): the yard behind the fence, the
// fields beyond its end, the lane — snow (winter), grey wet snow with dark patches (thaw), dark earth with stubble and
// leaves (autumn).
const S = e.lib.SEASONS[e.state.season] || e.lib.SEASONS.winter, W = 160, D = 200;
g.fillStyle = S.ground; g.fillRect(-W, -D, 2 * W, 2 * D);
for (let i = 0; i < 900; i++) {
  const x = -W + e.anim.hash(i, 1) * 2 * W, y = -D + e.anim.hash(i, 2) * 2 * D, r = 0.4 + e.anim.hash(i, 3) * 3;
  g.fillStyle = e.anim.hash(i, 4) < 0.5 ? S.dark : S.light;
  g.globalAlpha = e.state.season === 'winter' ? 0.25 : 0.4;
  g.beginPath(); g.ellipse(x, y, r * 2, r * 0.6, 0, 0, Math.PI * 2); g.fill();
}
g.globalAlpha = 1;
// furrows across the fields beyond the fence's end (x > 14 − across 100 = −86 here)
g.strokeStyle = e.state.season === 'autumn' ? 'rgba(40,34,28,0.35)' : 'rgba(150,156,170,0.35)'; g.lineWidth = 0.25;
for (let y = -D + 18; y < D - 10; y += 3.2) { g.beginPath(); g.moveTo(-85, y); g.lineTo(W, y + 4); g.stroke(); }
