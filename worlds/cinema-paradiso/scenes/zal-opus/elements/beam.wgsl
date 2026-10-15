
// the beam: the cone (layer 1) breathing with smoke, motes (layer 2) kept inside the wedge; all of it light added
fn inwedge(at: vec2f) -> f32 {
  let k = clamp(at.x / 20.44, 0.0, 1.0);
  let t = mix(-0.05, -1.6, k);
  let b = mix(0.05, 2.4, k);
  let a = smoothstep(t - 0.1, t + 0.35, at.y) * (1.0 - smoothstep(b - 0.35, b + 0.1, at.y));
  return a * step(0.0, at.x) * (1.0 - smoothstep(20.04, 20.44, at.x));
}
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  let cone = layer(1, at);
  let n1 = noise2(vec2f(at.x * 0.5 - u_time * 0.22, at.y * 1.1 + u_time * 0.06));
  let n2 = noise2(vec2f(at.x * 1.7 - u_time * 0.4, at.y * 2.3 - u_time * 0.13));
  let smoke = 0.4 + 0.8 * n1 * (0.6 + 0.8 * n2);
  let motes = layer(2, at) * inwedge(at);
  let fl = 0.92 + 0.08 * noise1(u_time * 11.0);
  emission = (cone.rgb * smoke * 1.3 + motes.rgb * 0.9) * u_on * fl;
  return vec4f(0.0, 0.0, 0.0, 0.0);
}
