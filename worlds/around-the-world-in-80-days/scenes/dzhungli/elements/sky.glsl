// The sky as the hour has it: the night (its painting), the day mixed over it, the dawn's saffron over that, the stars
// twinkling each in its own time, the moon, the sun where its animate carries it (sunX, sunY: its layer's offset).
vec4 shade(vec4 painted, vec2 at, vec2 uv) {
  vec4 c = mix(painted, layer(1, at), day);
  vec4 w = layer(2, at) * dawn;
  c = c * (1.0 - w.a) + w;
  float tw = 0.3 + 0.7 * noise2(floor(at * 420.0) * 1.37 + vec2(u_time * 1.9, u_time * 1.3));
  vec4 st = layer(3, at) * dark * tw;
  c.rgb += st.rgb;
  vec4 m = layer(4, at) * dark;
  c = c * (1.0 - m.a) + m;
  emission += m.rgb * 0.5;
  vec4 s = layer(5, at - vec2(sunX, sunY)) * shine;
  s.rgb *= mix(vec3(1.0), vec3(1.0, 0.74, 0.46), dawn);
  c = c * (1.0 - s.a) + s;
  emission += s.rgb * 3.0;
  return c;
}
