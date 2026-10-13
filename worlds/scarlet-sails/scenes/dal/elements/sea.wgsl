// The sea alive and the mist on it (`front`, lib.js: how far down the frame the mist has gone off): glints on the water,
// thickest in the sun's road and toward the horizon, each twinkling in its own time; then the mist — its edge wavering,
// drifting a little, thick over the water not yet cleared, thinner over the sky.
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  var c = painted.rgb;
  let sea = smoothstep(u_horizon, u_horizon + 0.01, at.y);
  let depth = clamp((at.y - u_horizon) / (1.25 - u_horizon), 0.0, 1.0);
  // glints
  let tw = noise2(vec2f(at.x * 60.0 + u_time * 0.2, pow(depth, 0.55) * 150.0 - u_time * 0.5));
  let fleck = smoothstep(0.76, 0.95, tw);
  let off = (at.x - u_sun_x) / (0.1 + 0.5 * depth);
  let road = exp(-off * off);
  let glint = fleck * (0.15 + 0.85 * road) * (1.0 - 0.5 * depth) * sea;
  c += vec3f(1.0, 0.82, 0.55) * glint * 0.7;
  emission = vec3f(1.0, 0.82, 0.55) * glint * 0.3;
  // the mist
  let edge = u_front + 0.035 * (noise2(vec2f(at.x * 2.2 + u_time * 0.04, 3.0)) - 0.5);
  let thick = smoothstep(edge - 0.02, edge + 0.12, at.y);
  let cloud = 0.8 + 0.2 * noise2(vec2f(at.x * 2.0 - u_time * 0.03, at.y * 7.0));
  let density = mix(0.75, 0.97, smoothstep(u_horizon - 0.1, u_horizon + 0.05, at.y));
  c = mix(c, vec3f(0.78, 0.79, 0.82), thick * cloud * density);
  emission *= 1.0 - thick;
  return vec4f(c, 1.0);
}
