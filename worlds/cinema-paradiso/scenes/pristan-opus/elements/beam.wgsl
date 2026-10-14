// the beam: the cone (layer 1) breathing with smoke, motes (layer 2) kept inside the wedge; all of it light added
fn inwedge(at: vec2f) -> f32 {
  let k = clamp(at.x / 24.4, 0.0, 1.0);
  let t = mix(-0.05, -4.05, k);
  let b = mix(0.05, -0.05, k);
  let a = smoothstep(t - 0.1, t + 0.35, at.y) * (1.0 - smoothstep(b - 0.35, b + 0.1, at.y));
  return a * step(0.0, at.x) * (1.0 - smoothstep(24.0, 24.4, at.x));
}
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  let cone = layer(1, at);
  let n1 = noise2(vec2f(at.x * 0.55 - u_time * 0.28, at.y * 1.3 + u_time * 0.05));
  let n2 = noise2(vec2f(at.x * 1.9 - u_time * 0.5, at.y * 2.7 - u_time * 0.11));
  let smoke = 0.45 + 0.75 * n1 * (0.6 + 0.8 * n2);
  let motes = layer(2, at) * inwedge(at);
  let fl = 0.92 + 0.08 * noise1(u_time * 11.0);
  emission = (cone.rgb * smoke * 1.25 + motes.rgb * 0.9) * u_on * fl;
  return vec4f(0.0, 0.0, 0.0, 0.0);
}
