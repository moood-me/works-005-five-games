// The facades as painted (lit by the scene); over them the fog (layer 1: its share), lit by the city — its own light, in
// the hour's colours, darker up high, pale low over the street (y −21.5 → 0.5); and the windows lit across the street
// (layer 2) glowing through it as much as the gas is lit
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  let f = layer(1, at).a;
  let fog = mix(vec3f(u_high_r, u_high_g, u_high_b), vec3f(u_low_r, u_low_g, u_low_b), clamp((at.y + 21.5) / 22.0, 0.0, 1.0));
  emission = fog * f + layer(2, at).rgb * u_gas * 2.0;
  return vec4f(painted.rgb * (1.0 - f), painted.a);
}
