// London's fog over the roofs: from high up (the stage's top and above) to low over the street, a slow drift of thicker
// and thinner fog across it (more of it low down), and on Sunday morning the low sun's pale warmth to the right, behind
// the viewer. Colours come linear (svet.lin) from the animate.
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  let k = clamp((at.y + 0.35) / 1.05, 0.0, 1.0);
  var c = mix(vec3f(u_high_r, u_high_g, u_high_b), vec3f(u_low_r, u_low_g, u_low_b), k);
  let f = noise2(vec2f(at.x * 1.4 + u_time * 0.012, at.y * 5.0 - u_time * 0.004)) * 0.6 + noise2(vec2f(at.x * 4.0 - u_time * 0.02, at.y * 11.0)) * 0.4;
  c *= 0.93 + 0.14 * f * (0.4 + 0.6 * k);
  let d = length(vec2f(at.x - (u_wide + 0.2), (at.y - 0.45) / 0.6)) / 1.1;
  c += vec3f(1.0, 0.87, 0.65) * 0.35 * u_sun * pow(max(0.0, 1.0 - d), 2.0);
  return vec4f(c, 1.0);
}
