// The lamp as the light has it; its shade lit from inside (layer 1) as much as the lamps burn (`lit`)
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  emission = layer(1, at).rgb * u_lit * 0.9;
  return painted;
}
