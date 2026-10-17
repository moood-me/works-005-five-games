// The two flames (layer 1, each painted at its fullest over its wick) as they burn now: as tall as `lit` says,
// flickering, the tip led aside and back — each in its own time; shining (emission)
const TOP = -0.47;
const FH = 0.05;
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  var o = painted;
  if (u_lit > 0.02) {
    let k = select(1.0, 0.0, at.x < 0.0);
    let t = u_time;
    let f = 1.0 + 0.06 * sin(t * 7.3 + k * 2.0) + 0.04 * sin(t * 11.9 + 1.0 + k * 3.0) + 0.03 * sin(t * 2.3 + k);
    let sy = f * (0.45 + 0.55 * u_lit);
    let sw = 0.004 * sin(t * 2.1 + k * 1.7) + 0.002 * sin(t * 5.3 + k);
    let wick = vec2f(select(0.12, -0.12, k < 0.5), TOP);
    let d = at - wick;
    let up = clamp(-d.y / (FH * sy), 0.0, 1.0);
    let flame = layer(1, wick + vec2f(d.x - sw * up * up, d.y / sy)) * u_lit;
    emission = flame.rgb * 2.2;
    o = flame + o * (1.0 - flame.a);
  }
  return o;
}
