// the headlights' wedge: light added, broken a little by the air (and the rain's veil)
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  let c = layer(1, at);
  let n = noise2(vec2f(at.x * 0.8 - u_time * 1.6, at.y * 4.0 + u_time * 3.0));
  emission = c.rgb * (0.7 + 0.5 * n) * u_on * 1.4;
  return vec4f(0.0, 0.0, 0.0, 0.0);
}
