fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  let b = layer(1, at);
  let l = layer(2, at);
  emission = l.rgb * u_glow;
  return b + l * (1.0 - b.a);
}
