// What paints lit windows or lamps: its painting as it is (lit by the scene), and its layer of lit windows added as
// light (it blooms) as much as they are lit now (`lit`, its animate: lib.js litMotion).
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  emission = layer(1, at).rgb * u_lit * 2.0;
  return painted;
}
