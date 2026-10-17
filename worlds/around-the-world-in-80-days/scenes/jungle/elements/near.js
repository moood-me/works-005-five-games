// The great trunks close to the viewer, before the trail, dark against the lit forest (their places chosen for the views):
// each a part at its own depth, a buttress flaring at its foot. What grows at their feet and hangs from overhead is
// near_leaves'.
const L = e.lib, A = 4, bark = '#262b22';
for (const t of L.NEAR_TRUNKS) {
  const w = t.w;
  e.part(t.a, t.d - A, gp => {
    gp.fillStyle = bark;
    gp.beginPath();
    gp.moveTo(-w * 3, 0);
    gp.quadraticCurveTo(-w * 1.1, -0.2, -w * 1.05, -2.6);
    gp.lineTo(-w * 0.8, -32);
    gp.lineTo(w * 0.8, -32);
    gp.lineTo(w * 1.05, -2.6);
    gp.quadraticCurveTo(w * 1.1, -0.2, w * 3, 0);
    gp.closePath();
    gp.fill();
    // moss up the buttress, the bark's long grooves
    gp.fillStyle = 'rgba(52,70,40,0.5)';
    gp.beginPath();
    gp.moveTo(-w * 2.8, 0);
    gp.quadraticCurveTo(-w * 1.1, -0.2, -w * 1.0, -1.8);
    gp.lineTo(w * 0.3, -1.2);
    gp.quadraticCurveTo(w * 1.1, -0.2, w * 2.4, 0);
    gp.closePath();
    gp.fill();
    gp.fillStyle = 'rgba(12,14,10,0.35)';
    for (let k = 0; k < 4; k++) gp.fillRect(-w * 0.7 + w * 0.42 * k, -31, w * 0.07, 28);
  }, [-w * 3.2, -32, w * 3.2, 0.2]);
}
