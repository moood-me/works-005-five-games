// swells running toward the viewer (+y on the plane) by the phase, broad and long; whitecaps and streaks of foam on
// them as the storm says
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  let y = at.y - u_phase;
  let swell = sin(y * 0.11 + noise2(vec2f(at.x * 0.01, y * 0.004)) * 4.0) * 0.5 + 0.5;
  let chop = noise2(vec2f(at.x * 0.18, y * 0.12)) * 0.6 + noise2(vec2f(at.x * 0.5, y * 0.4) + vec2f(5.2, 1.3)) * 0.4;
  let body = mix(0.78, 1.18, swell * 0.7 + chop * 0.3);
  let crest = smoothstep(0.62, 0.86, swell * 0.55 + chop * 0.45);
  let streak = smoothstep(0.66, 0.92, noise2(vec2f(at.x * 0.9, y * 0.05)));
  let foam = clamp((crest * 0.8 + streak * 0.35) * (0.25 + 0.75 * u_storm), 0.0, 1.0);
  var c = painted.rgb * body;
  c = mix(c, vec3f(0.82, 0.87, 0.86) * painted.a, foam * 0.6);
  return vec4f(c, painted.a);
}
