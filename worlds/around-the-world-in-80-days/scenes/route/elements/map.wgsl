// the map with the way in red ink as far as the play has come: the ink shown where the share of the way under it
// (layer 2: its grey is the share) is short of `cut`; the day won at the 180th meridian as much as `dateline`
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  let ink = layer(1, at);
  let share = layer(2, at);
  let u = share.r / max(share.a, 0.0001);
  let on = select(0.0, 1.0, share.a > 0.02 && u < u_cut);
  let day = layer(3, at);
  var c = vec4f(painted.rgb * (1.0 - ink.a * on) + ink.rgb * on, painted.a);
  c = vec4f(c.rgb * (1.0 - day.a * u_dateline) + day.rgb * u_dateline, c.a);
  return c;
}
