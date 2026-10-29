// The night sea alive: its layers laid over the painting — the stars twinkling, each in its own time; the lamps'
// reflections trembling on the water; the clouds drifting (read round) — and the glints on the water, thickest in the
// moon's road.
fn over(top: vec4f, under: vec3f) -> vec3f {
  return top.rgb + under * (1.0 - top.a);
}
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  var c = painted.rgb;
  let sky = 1.0 - smoothstep(u_horizon - 0.004, u_horizon, at.y);
  let tw = 0.55 + 0.45 * noise2(vec2f(at.x * 420.0 + u_time * 0.7, at.y * 420.0 - u_time * 0.5));
  let stars = layer(1, at);
  c = over(vec4f(stars.rgb * tw, stars.a * tw) * sky, c);
  let sea = smoothstep(u_horizon, u_horizon + 0.006, at.y) * (1.0 - smoothstep(u_foot - 0.004, u_foot, at.y));
  let wob = wobble(at.y * 260.0 + u_time * 1.3) * 0.0018;
  let refl = layer(2, at + vec2f(wob, 0.0));
  c = over(refl * sea, c);
  let clouds = layer(3, at);
  c = over(clouds * sky, c);
  let depth = clamp((at.y - u_horizon) / (u_foot - u_horizon), 0.0, 1.0);
  let n = noise2(vec2f(at.x * 70.0 + u_time * 0.15, pow(depth, 0.55) * 170.0 - u_time * 0.45));
  let fleck = smoothstep(0.78, 0.96, n);
  let off = (at.x - u_moon_x) / (0.02 + 0.2 * depth);
  let road = exp(-off * off);
  let glint = fleck * (0.08 + 0.92 * road) * sea;
  c += vec3f(0.85, 0.88, 1.0) * glint * 0.55;
  emission = vec3f(0.85, 0.88, 1.0) * glint * 0.25 + refl.rgb * sea * 0.25;
  return vec4f(c, 1.0);
}
