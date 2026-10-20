// The frost on the glass (layer 1) over the wall (the painting): a hole rubbed in it, round from the glass's middle
// (u_cy: its height in the painting), as far as `wipe` (1 — the whole glass); its edge soft and ragged.
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  let f = layer(1, at);
  let d = length(at - vec2f(0.0, u_cy)) + 0.03 * noise2(at * 18.0);
  let r = u_wipe * 0.78;
  let keep = select(1.0, smoothstep(r - 0.05, r + 0.03, d), u_wipe > 0.001);
  let fr = f * keep;
  return fr + painted * (1.0 - fr.a);
}
