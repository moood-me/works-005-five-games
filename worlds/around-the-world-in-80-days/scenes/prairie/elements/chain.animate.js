// The chains sag as the cars come together and swing with the sway (swing, its phase swing_at — 0.5 together); the link
// drops as the pin comes out (uncouple). Where Passepartout is (pp_car): his hips under the car, his hands on the frame
// above him, one reaching ahead of the other as he goes.
const L = e.lib, st = e.state, c = e.anim.clamp, TAU = Math.PI * 2;
const sw = c(st.swing ?? 0, 0, 1), at = st.swing_at ?? 0, close = 0.5 + 0.5 * Math.cos(TAU * (at - 0.5));
for (let k = 0; k < 4; k++) {
  const l = e.layer(`ch${k}`);
  l.scaleY = 1 + 0.5 * sw * (close - 0.5);
  l.rotate = 0.08 * sw * Math.sin(TAU * at + k);
}
e.layer('link').rotate = 1.1 * c(((st.uncouple ?? 0) - 0.7) / 0.3, 0, 1);
const v = st.pp_car ?? 0, x = L.ppX(v), s = Math.sin(v * TAU);
e.at(x + 0.32 + 0.22 * s, -0.98, 'hand_r');
e.at(x + 0.02 - 0.22 * s, -0.98, 'hand_l');
e.at(x - 0.75, -0.42, 'pp');
