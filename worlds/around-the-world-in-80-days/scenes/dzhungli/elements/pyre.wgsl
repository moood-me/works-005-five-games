// The stack as painted, its seams glowing as hot as the fire is (`fire`), breathing unevenly.
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  let heat = layer(1, at);
  let breathe = 0.65 + 0.35 * noise2(vec2f(at.x * 1.7, u_time * 1.4));
  emission += heat.rgb * u_fire * breathe * 3.0;
  return painted;
}
