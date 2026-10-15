// The strip coming into the lamp's light (u_slide: from the right, its share of u_span still to go) and its frames
// coming up one by one (u_develop 0…1 against each frame's order, layer 3; where there is no order — the heading —
// first): layer 1 the strips, unexposed; layer 2 what the frames show, laid over as they come up; the warm parts of the
// frames glow as light (emission), breathing a little with the lamp (u_lamp).
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  let p = at - vec2f(u_slide * u_span, 0.0);
  let strips = layer(1, p);
  let frames = layer(2, p);
  let ord = layer(3, p);
  let o = select(0.0, ord.r / max(ord.a, 0.001), ord.a > 0.5);
  let shown = smoothstep(o, o + 0.12, u_develop);
  let flick = 0.93 + 0.07 * noise1(u_time * 9.0);
  let fr = frames * shown;
  var c = fr + strips * (1.0 - fr.a);
  // the lamp through the film: the warm parts glow (the dark ones and the words hardly)
  let warmth = smoothstep(0.45, 0.85, fr.r) * smoothstep(0.25, 0.6, fr.r - fr.b);
  emission = fr.rgb * warmth * u_lamp * flick * 0.9;
  return c;
}
