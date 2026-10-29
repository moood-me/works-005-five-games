// The gate's leaf, painted from its hinge (the left post) to the right: the same grey boards, a cross-brace, an iron
// ring; it opens into the yard (`gate_f` from `gate`).
const S = e.lib.SEASONS[e.state.season] || e.lib.SEASONS.winter;
for (let x = 0, i = 0; x < 1.0; x += 0.125, i++) {
  const t = 132 + Math.round(e.anim.hash(i, 41) * 18);
  g.fillStyle = `rgb(${t},${t + 2},${t + 6})`; g.fillRect(x, -2.2, 0.12, 2.2);
}
g.fillStyle = '#7a7876'; g.fillRect(0, -1.9, 1.0, 0.1); g.fillRect(0, -0.5, 1.0, 0.1);
g.save(); g.translate(0.5, -1.2); g.rotate(-0.95); g.fillRect(-0.85, -0.05, 1.7, 0.1); g.restore();
g.strokeStyle = '#3a3836'; g.lineWidth = 0.02; g.beginPath(); g.arc(0.85, -1.15, 0.05, 0, Math.PI * 2); g.stroke();
if (S.snow) { g.fillStyle = S.snow; g.fillRect(0, -2.24, 1.0, 0.05); }
