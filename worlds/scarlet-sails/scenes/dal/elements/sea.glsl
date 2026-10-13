// The sea alive and the mist on it (`front`, lib.js: how far down the frame the mist has gone off): glints on the water,
// thickest in the sun's road and toward the horizon, each twinkling in its own time; then the mist — its edge wavering,
// drifting a little, thick over the water not yet cleared, thinner over the sky.
vec4 shade(vec4 painted, vec2 at, vec2 uv) {
  vec3 c = painted.rgb;
  float sea = smoothstep(horizon, horizon + 0.01, at.y);
  float depth = clamp((at.y - horizon) / (1.25 - horizon), 0.0, 1.0);
  // glints
  float tw = noise2(vec2(at.x * 60.0 + u_time * 0.2, pow(depth, 0.55) * 150.0 - u_time * 0.5));
  float fleck = smoothstep(0.76, 0.95, tw);
  float off = (at.x - sun_x) / (0.1 + 0.5 * depth);
  float road = exp(-off * off);
  float glint = fleck * (0.15 + 0.85 * road) * (1.0 - 0.5 * depth) * sea;
  c += vec3(1.0, 0.82, 0.55) * glint * 0.7;
  emission = vec3(1.0, 0.82, 0.55) * glint * 0.3;
  // the mist
  float edge = front + 0.035 * (noise2(vec2(at.x * 2.2 + u_time * 0.04, 3.0)) - 0.5);
  float thick = smoothstep(edge - 0.02, edge + 0.12, at.y);
  float cloud = 0.8 + 0.2 * noise2(vec2(at.x * 2.0 - u_time * 0.03, at.y * 7.0));
  float density = mix(0.75, 0.97, smoothstep(horizon - 0.1, horizon + 0.05, at.y));
  c = mix(c, vec3(0.78, 0.79, 0.82), thick * cloud * density);
  emission *= 1.0 - thick;
  return vec4(c, 1.0);
}
