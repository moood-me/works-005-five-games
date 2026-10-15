
// the frames mixed by their weights over the torn sheet (1988), shining with the beam: a flicker, the print's grain,
// the frame's slight weave
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  let weave = vec2f(0.0, (noise1(u_time * 6.0) - 0.5) * 0.012);
  let fr = layer(1, at + weave) * u_f0 + layer(2, at + weave) * u_f1 + layer(3, at + weave) * u_f2 + layer(4, at + weave) * u_f3;
  let torn = layer(5, at);
  let fl = 0.86 + 0.14 * noise1(u_time * 13.0);
  let gr = hash2(floor(at * 55.0) + vec2f(floor(u_time * 24.0) * 7.0, 0.0)) - 0.5;
  let film = vec4f(fr.rgb * (1.0 + gr * 0.12 * u_on), fr.a);
  let c = mix(torn, film, u_whole);
  emission = fr.rgb * vec3f(1.0, 0.95, 0.84) * (fl + gr * 0.18) * u_on * u_whole * 1.15;
  let base = painted * (1.0 - c.a);
  return vec4f(base.rgb + c.rgb, max(painted.a, c.a));
}
