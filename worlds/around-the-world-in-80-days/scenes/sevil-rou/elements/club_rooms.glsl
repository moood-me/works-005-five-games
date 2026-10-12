// The club's rooms as lit as the gas: the unlit rooms (its painting) giving way to the lit ones (layer 1), their warmth
// and the chandeliers (layer 2) a light of their own (they bloom at night).
vec4 shade(vec4 painted, vec2 at, vec2 uv) {
  vec4 lit = layer(1, at);
  vec4 ch = layer(2, at);
  emission = (lit.rgb * 0.35 + ch.rgb) * gas;
  return mix(painted, lit, gas);
}
