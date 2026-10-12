// The stack as painted, its seams glowing as hot as the fire is (`fire`), breathing unevenly.
vec4 shade(vec4 painted, vec2 at, vec2 uv) {
  vec4 heat = layer(1, at);
  float breathe = 0.65 + 0.35 * noise2(vec2(at.x * 1.7, u_time * 1.4));
  emission += heat.rgb * fire * breathe * 3.0;
  return painted;
}
