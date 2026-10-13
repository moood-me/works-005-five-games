// The firebox's back as the light has it, and the fire's glow on it (layer 1): light of its own, as much as the fire
// burns (`heat`), breathing as a fire does
vec4 shade(vec4 painted, vec2 at, vec2 uv) {
  vec4 g = layer(1, at);
  float breath = 0.85 + 0.1 * wobble(u_time * 1.3) + 0.05 * wobble(u_time * 3.7 + at.x * 2.0);
  emission = g.rgb * heat * breath * 1.5;
  return painted;
}
