// the sheet shines with the film while the beam is on: a flicker, the grain of the print
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  let w = 3.5;
  let inside = step(-w, at.x) * step(at.x, w) * step(-5.4, at.y) * step(at.y, -1.4);
  let fl = 0.86 + 0.14 * noise1(u_time * 13.0);
  let gr = hash2(floor(at * 55.0) + vec2f(floor(u_time * 24.0) * 7.0, 0.0)) - 0.5;
  let warm = vec3f(1.0, 0.93, 0.8);
  emission = painted.rgb * warm * (fl + gr * 0.18) * inside * u_on * 1.1;
  return painted;
}
