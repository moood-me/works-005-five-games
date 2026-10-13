// The logs as the light has them, and the embers under them (layer 1): light of their own, as much as the fire burns
// (`heat`), crawling as embers do
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  let g = layer(1, at);
  let crawl = 0.75 + 0.25 * noise2(vec2f(at.x * 14.0 + u_time * 0.4, u_time * 0.9));
  emission = g.rgb * u_heat * crawl * 2.0;
  return painted;
}
