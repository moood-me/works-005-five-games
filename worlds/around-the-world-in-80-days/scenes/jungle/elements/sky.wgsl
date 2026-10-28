// The sky as the hour has it: the night (its painting), the day mixed over it, the dawn's saffron over that, the stars
// twinkling each in its own time, the moon, the sun where its animate carries it (sunX, sunY: its layer's offset).
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  var c = mix(painted, layer(1, at), u_day);
  let w = layer(2, at) * u_dawn;
  c = c * (1.0 - w.a) + w;
  let tw = 0.3 + 0.7 * noise2(floor(at * 420.0) * 1.37 + vec2f(u_time * 1.9, u_time * 1.3));
  let st = layer(3, at) * u_dark * tw;
  c = vec4f(c.rgb + st.rgb, c.a);
  let m = layer(4, at) * u_dark;
  c = c * (1.0 - m.a) + m;
  emission += m.rgb * 0.5;
  var s = layer(5, at - vec2f(u_sunX, u_sunY)) * u_shine;
  s = vec4f(s.rgb * mix(vec3f(1.0), vec3f(1.0, 0.74, 0.46), u_dawn), s.a);
  c = c * (1.0 - s.a) + s;
  emission += s.rgb * 3.0;
  return c;
}
