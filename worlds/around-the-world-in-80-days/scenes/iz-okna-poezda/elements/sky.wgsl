// The sky's colours, from what its animate gives (sRGB 0…1, mixed so, made linear at the end): the land's sky from
// the top to the horizon (top, low), the moonlit haze low along the horizon under the moon, the low sun's warm sky
// round it; over them its layers — the stars (each twinkling its own way), the moon, the sun — as much as each is out.
const YH = 0.27;
// a soft round glow's fall-off: 1 at its middle, 0.45 at 0.4 of its reach, nothing at its reach
fn fall(r: f32) -> f32 { return select(mix(0.45, 0.0, clamp((r - 0.4) / 0.6, 0.0, 1.0)), mix(1.0, 0.45, r / 0.4), r < 0.4); }
fn over(c: vec4f, l: vec4f, k: f32) -> vec4f { return c * (1.0 - l.a * k) + l * k; }
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  let top = vec3f(u_tr, u_tg, u_tb);
  let low = vec3f(u_lr, u_lg, u_lb);
  let mid = mix(top, low, 0.6);
  let y = clamp((at.y + 0.35) / (YH + 0.35), 0.0, 1.0);
  var c = select(mix(mid, low, (y - 0.7) / 0.3), mix(top, mid, y / 0.7), y < 0.7);
  // the moonlit haze along the horizon
  c = mix(c, vec3f(0.624, 0.698, 0.8), 0.18 * u_moon * fall(length(vec2f((at.x - u_w * 0.42) / 0.6, (at.y - YH) / 0.072))));
  // the low sun's warm sky
  let s = vec2f(u_w * 0.6, YH - 0.012 + u_sun_dy);
  c = mix(c, vec3f(1.0, 0.69, 0.44), 0.35 * u_sun * fall(length(vec2f((at.x - s.x) / 0.5, (at.y - s.y) / 0.225))));
  var o = vec4f(srgbToLinear(c), 1.0);
  // the stars, each twinkling at its own phase
  let tw = 0.7 + 0.3 * sin(6.2831853 * (cycle(0.6) + hash2(at * 160.0)));
  o = over(o, layer(1, at), u_stars * tw);
  o = over(o, layer(2, at), u_moon);
  o = over(o, layer(3, at - vec2f(0.0, u_sun_dy)), u_sun);
  return o;
}
