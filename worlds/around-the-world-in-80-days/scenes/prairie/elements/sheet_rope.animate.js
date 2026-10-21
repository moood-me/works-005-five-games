// the rope laid from the boom's end to the hands holding the sheet (Fogg's, or Passepartout's alone with Mudge); none
// while nobody holds it or the sail is furled
const st = e.state, who = st.fogg_here && Array.isArray(st.fogg_with) && st.fogg_with.includes('sheet') ? 'fogg'
  : st.passepartout_here && Array.isArray(st.passepartout_with) && st.passepartout_with.includes('sheet') ? 'passepartout' : null;
const rope = e.layer('rope');
if (!who || (st.sail_up ?? 0) < 0.5) rope.alpha = 0;
else {
  const a = e.point('sail#sheet'), b = e.point(`${who}#sheet`), dx = b[0] - a[0], dy = b[1] - a[1];
  rope.alpha = 1;
  rope.x = a[0];
  rope.y = a[1];
  rope.rotate = Math.atan2(dy, dx);
  rope.scaleX = Math.hypot(dx, dy);
}
