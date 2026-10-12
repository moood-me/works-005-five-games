// The fog from high up (the top of the sky, y −0.35) down to low over the street (y 0.7 and below): the hour's two
// colours (sky.animate.js), mixed as the old gradient did
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  let u = clamp((at.y + 0.35) / 1.05, 0.0, 1.0);
  return vec4f(mix(vec3f(u_high_r, u_high_g, u_high_b), vec3f(u_low_r, u_low_g, u_low_b), u), 1.0);
}
