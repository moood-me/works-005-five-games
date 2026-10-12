// The facades as painted (lit by the scene); over them the fog (layer 1: its share), lit by the city — its own light, in
// the hour's colours, darker up high, pale low over the street (y −21.5 → 0.5); and the windows lit across the street
// (layer 2) glowing through it as much as the gas is lit
vec4 shade(vec4 painted, vec2 at, vec2 uv) {
  float f = layer(1, at).a;
  vec3 fog = mix(vec3(high_r, high_g, high_b), vec3(low_r, low_g, low_b), clamp((at.y + 21.5) / 22.0, 0.0, 1.0));
  emission = fog * f + layer(2, at).rgb * gas * 2.0;
  return vec4(painted.rgb * (1.0 - f), painted.a);
}
