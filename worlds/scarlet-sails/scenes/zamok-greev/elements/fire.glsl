// The logs as the light has them, and the embers under them (layer 1): light of their own, as much as the fire burns
// (`heat`), crawling as embers do
vec4 shade(vec4 painted, vec2 at, vec2 uv) {
  vec4 g = layer(1, at);
  float crawl = 0.75 + 0.25 * noise2(vec2(at.x * 14.0 + u_time * 0.4, u_time * 0.9));
  emission = g.rgb * heat * crawl * 2.0;
  return painted;
}
