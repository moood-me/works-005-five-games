
// the far screen shines with the film while the beam is on, flickering
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  let inside = step(-3.5, at.x) * step(at.x, 3.5) * step(-4.0, at.y) * step(at.y, 0.0);
  let fl = 0.85 + 0.15 * noise1(u_time * 13.0);
  emission = painted.rgb * vec3f(1.0, 0.94, 0.82) * fl * inside * u_on * 1.3;
  return vec4f(painted.rgb * (0.25 + 0.75 * (1.0 - inside)), painted.a);
}
