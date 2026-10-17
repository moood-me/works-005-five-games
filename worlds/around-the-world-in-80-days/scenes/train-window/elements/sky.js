// The sky over the lands, painted once: its stars, the moon, the low sun — layers its shader (sky.wgsl) lays over the
// sky's colours, which its animate gives (lib.js skyMotion: the land's day sky darkened to a moonlit night, warmed low
// by the dawn) — so nothing of it is painted again as the land, the night or the dawn turn. Its moon and its sun shine
// (lights "moon", "sun" — from sky#moon, sky#sun) and make their glows (dimmed by its animate).
const w = e.aspect, yh = e.lib.plan.horizon, h = e.anim.hash;
// (under it all: what its shader colours)
g.fillStyle = '#ffffff';
g.fillRect(-0.3, -0.35, w + 0.6, 1.6);
// stars, faint toward the horizon
e.layer('stars', {}, g => {
  for (let i = 0; i < 140; i++) {
    const x = -0.3 + (w + 0.6) * h(i, 1);
    const y = -0.35 + (yh + 0.3) * Math.pow(h(i, 2), 1.6);
    g.fillStyle = `rgba(230,236,255,${((0.25 + 0.6 * h(i, 4)) * (1 - y / yh)).toFixed(3)})`;
    g.beginPath();
    g.arc(x, y, 0.0007 + 0.0012 * h(i, 3), 0, Math.PI * 2);
    g.fill();
  }
});
// the moon
e.layer('moon', {}, g => {
  const x = w * 0.42, y = 0.16;
  g.fillStyle = 'rgba(236,238,240,0.92)';
  g.beginPath();
  g.arc(x, y, 0.014, 0, Math.PI * 2);
  g.fill();
  e.at(x, y, 'moon');
  e.light(x, y, 0.05, '#c9d6ea', 0.35, 'moon');
});
// the low sun of the dawn (its animate lifts it as the dawn grows)
e.layer('sun', {}, g => {
  const x = w * 0.6, y = yh - 0.012;
  g.fillStyle = 'rgba(255,236,200,0.95)';
  g.beginPath();
  g.arc(x, y, 0.018, 0, Math.PI * 2);
  g.fill();
  e.at(x, y, 'sun');
  e.light(x, y, 0.08, '#ffd9a0', 0.6, 'sun');
});
