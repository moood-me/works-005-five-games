// the gate's leaves swing in as `gate` opens it (seen face-on, they narrow toward their hinges)
if (e.state.town !== 'omaha') {
  const u = e.anim.clamp(e.state.gate ?? 0, 0, 1);
  e.layer('gate_l').scaleX = 1 - 0.88 * u;
  e.layer('gate_r').scaleX = 1 - 0.88 * u;
}
