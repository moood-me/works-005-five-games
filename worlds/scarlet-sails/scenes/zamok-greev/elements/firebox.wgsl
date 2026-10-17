// The firebox's back as the light has it, and the fire's glow on it (layer 1): light of its own, as much as the fire
// burns (`heat`), breathing as a fire does
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  let g = layer(1, at);
  let breath = 0.85 + 0.1 * wobble(u_time * 1.3) + 0.05 * wobble(u_time * 3.7 + at.x * 2.0);
  emission = g.rgb * u_heat * breath * 1.5;
  return painted;
}
