// the projector's beam (cinema.beam): the cone (layer 1) breathing with smoke, the motes (layer 2) kept inside the
// cone, the tip (layer 3: its glow is the engine's); all of it light added — u_on its strength
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  let cone = layer(1, at);
  let n1 = noise2(vec2f(at.x * 0.55 - u_time * 0.28, at.y * 1.3 + u_time * 0.05));
  let n2 = noise2(vec2f(at.x * 1.9 - u_time * 0.5, at.y * 2.7 - u_time * 0.11));
  let smoke = 0.45 + 0.75 * n1 * (0.6 + 0.8 * n2);
  let inside = smoothstep(0.02, 0.12, cone.a);
  let motes = layer(2, at) * inside;
  let fl = 0.92 + 0.08 * noise1(u_time * 11.0);
  emission = (cone.rgb * smoke * 1.25 + motes.rgb * 0.9) * u_on * fl;
  return vec4f(0.0, 0.0, 0.0, 0.0);
}
