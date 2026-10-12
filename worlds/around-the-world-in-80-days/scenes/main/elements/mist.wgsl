// The fog: how thick it is here — the low fog as painted, and the two sheets of banks (layers 1, 2) drifting at their own
// paces, wrapped round the box (x −56 … 18) — in the hour's colour (mist.animate.js)
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  let W = 74.0;
  let a1 = vec2f(-56.0 + wrap(at.x + 56.0 - 0.22 * u_time, W), at.y);
  let a2 = vec2f(-56.0 + wrap(at.x + 56.0 - 0.34 * u_time, W), at.y);
  let a = 1.0 - (1.0 - painted.a) * (1.0 - layer(1, a1).a) * (1.0 - layer(2, a2).a);
  return vec4f(vec3f(u_fog_r, u_fog_g, u_fog_b) * a, a);
}
