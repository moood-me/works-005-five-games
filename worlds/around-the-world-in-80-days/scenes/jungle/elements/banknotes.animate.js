// at Fogg's right hand while he holds out the roll; thicker as the offer grows (`offer` 0…1: £1000 … £2000)
const roll = e.layer('roll'), p = (e.state.banknotes ?? 0) > 0.5 ? e.point('fogg#hand_r') : null;
roll.alpha = p ? 1 : 0;
if (p) {
  roll.x = p[0];
  roll.y = p[1] - 0.02;
  roll.scaleY = 0.7 + 1.6 * e.anim.clamp(e.state.offer ?? 0, 0, 1);
}
