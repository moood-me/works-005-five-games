// the rope laid from the boom's end to the hands holding the sheet (Fogg's, or Passepartout's alone with Mudge); none
// while nobody holds it, the sail is furled or a point of it is not to be had
const st = e.state, who = st.fogg_here && Array.isArray(st.fogg_with) && st.fogg_with.includes('sheet') ? 'fogg'
  : st.passepartout_here && Array.isArray(st.passepartout_with) && st.passepartout_with.includes('sheet') ? 'passepartout' : null;
const rope = e.layer('rope');
const a = who && (st.sail_up ?? 0) >= 0.5 ? e.point('sail#sheet') : null, b = a ? e.point(`${who}#sheet`) : null;
if (!a || !b) rope.alpha = 0;
else {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  rope.alpha = 1;
  rope.x = a[0];
  rope.y = a[1];
  rope.rotate = Math.atan2(dy, dx);
  rope.scaleX = Math.hypot(dx, dy);
}
