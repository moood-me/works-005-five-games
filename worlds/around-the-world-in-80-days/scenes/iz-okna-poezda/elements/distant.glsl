// What paints lit windows or lamps: its painting as it is (lit by the scene), and its layer of lit windows added as
// light (it blooms) as much as they are lit now (`lit`, its animate: lib.js litMotion).
vec4 shade(vec4 painted, vec2 at, vec2 uv) {
  emission = layer(1, at).rgb * lit * 2.0;
  return painted;
}
