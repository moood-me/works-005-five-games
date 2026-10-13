// The lamp as the light has it; its shade lit from inside (layer 1) as much as the lamps burn (`lit`)
vec4 shade(vec4 painted, vec2 at, vec2 uv) {
  emission = layer(1, at).rgb * lit * 0.9;
  return painted;
}
