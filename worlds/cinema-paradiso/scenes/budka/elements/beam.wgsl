// the beam: the cone breathing with smoke, motes kept inside the wedge; light added
fn inwedge(at: vec2f) -> f32 {
  let k = clamp(at.x / 20.5, 0.0, 1.0);
  let t = mix(-0.03, -0.85, k);
  let b = mix(0.03, 3.15, k);
  return smoothstep(t - 0.05, t + 0.2, at.y) * (1.0 - smoothstep(b - 0.2, b + 0.05, at.y)) * step(0.0, at.x);
}
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  let cone = layer(1, at);
  let n1 = noise2(vec2f(at.x * 2.5 - u_time * 0.6, at.y * 4.0 + u_time * 0.2));
  let n2 = noise2(vec2f(at.x * 0.6 - u_time * 0.2, at.y * 1.2 - u_time * 0.1));
  let smoke = 0.45 + 0.75 * n1 * (0.6 + 0.8 * n2);
  let motes = layer(2, at) * inwedge(at);
  let fl = 0.92 + 0.08 * noise1(u_time * 11.0);
  emission = (cone.rgb * smoke * 1.3 + motes.rgb * 0.9) * u_on * fl;
  return vec4f(0.0, 0.0, 0.0, 0.0);
}
