// The hole rubbed in the frost (`hole` 0…1, the uniform hole): a round clearing about the point `pane` (lib PANE,
// HOLE_R), its rim a little whiter where the frost was pushed aside, the glass clear inside it; none at 0.
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  let d = length((at - vec2f(0.3, -0.48)) / vec2f(1.0, 1.1));
  let r = u_hole * 0.2;
  let soft = abs(at_dx.x) + abs(at_dy.y) + 0.012 + 0.01 * wobble(at.x * 31.0 + at.y * 17.0);
  let rubbed = u_hole > 0.002;
  let keep = select(1.0, smoothstep(r - soft, r + soft, d), rubbed);
  let rim = select(0.0, (1.0 - smoothstep(0.0, 0.035, abs(d - r - 0.025))) * smoothstep(0.0, 0.05, u_hole) * 0.35, rubbed);
  return vec4f(painted.rgb * keep + vec3f(0.88, 0.92, 0.97) * rim, painted.a * keep + rim);
}
