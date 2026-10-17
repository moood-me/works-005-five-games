// The sea alive: glints on the water, thickest in the sun's road and toward the horizon, each twinkling in its own time
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  var c = painted.rgb;
  let sea = smoothstep(u_horizon, u_horizon + 0.01, at.y);
  let depth = clamp((at.y - u_horizon) / (1.25 - u_horizon), 0.0, 1.0);
  let tw = noise2(vec2f(at.x * 60.0 + u_time * 0.2, pow(depth, 0.55) * 150.0 - u_time * 0.5));
  let fleck = smoothstep(0.76, 0.95, tw);
  let off = (at.x - u_sun_x) / (0.1 + 0.5 * depth);
  let road = exp(-off * off);
  let glint = fleck * (0.15 + 0.85 * road) * (1.0 - 0.5 * depth) * sea;
  c += vec3f(1.0, 0.82, 0.55) * glint * 0.7;
  emission = vec3f(1.0, 0.82, 0.55) * glint * 0.3;
  return vec4f(c, 1.0);
}
