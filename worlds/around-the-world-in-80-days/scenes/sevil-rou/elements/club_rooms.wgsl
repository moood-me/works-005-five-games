// The club's rooms as lit as the gas: the unlit rooms (its painting) giving way to the lit ones (layer 1), their warmth
// and the chandeliers (layer 2) a light of their own (they bloom at night).
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  let lit = layer(1, at);
  let ch = layer(2, at);
  emission = (lit.rgb * 0.35 + ch.rgb) * u_gas;
  return mix(painted, lit, u_gas);
}
