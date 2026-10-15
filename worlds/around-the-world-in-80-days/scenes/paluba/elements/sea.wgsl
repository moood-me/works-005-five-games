// whitecaps and streaks of foam, running toward +y (aft: the plane's +y is toward the viewer) by the phase
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  let p = vec2f(at.x * 0.11, (at.y - u_phase) * 0.045);
  let n = noise2(p) * 0.6 + noise2(p * 2.9 + vec2f(3.1, 1.7)) * 0.4;
  let crest = smoothstep(0.7, 0.84, n);
  let streak = smoothstep(0.62, 0.9, noise2(vec2f(at.x * 0.6, (at.y - u_phase) * 0.06)));
  let foam = clamp(crest * u_caps + streak * 0.25 * u_caps, 0.0, 1.0);
  let c = mix(painted.rgb, vec3f(0.86, 0.9, 0.9) * painted.a, foam * 0.55);
  return vec4f(c, painted.a);
}
