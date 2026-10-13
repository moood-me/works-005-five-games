// The two flames (layer 1, each painted at its fullest over its wick) as they burn now: as tall as `lit` says,
// flickering, the tip led aside and back — each in its own time; shining (emission)
const float TOP = -0.47;
const float FH = 0.05;
vec4 shade(vec4 painted, vec2 at, vec2 uv) {
  vec4 o = painted;
  if (lit > 0.02) {
    float k = at.x < 0.0 ? 0.0 : 1.0, t = u_time;
    float f = 1.0 + 0.06 * sin(t * 7.3 + k * 2.0) + 0.04 * sin(t * 11.9 + 1.0 + k * 3.0) + 0.03 * sin(t * 2.3 + k);
    float sy = f * (0.45 + 0.55 * lit);
    float sw = 0.004 * sin(t * 2.1 + k * 1.7) + 0.002 * sin(t * 5.3 + k);
    vec2 wick = vec2(k < 0.5 ? -0.12 : 0.12, TOP);
    vec2 d = at - wick;
    float up = clamp(-d.y / (FH * sy), 0.0, 1.0);
    vec4 flame = layer(1, wick + vec2(d.x - sw * up * up, d.y / sy)) * lit;
    emission = flame.rgb * 2.2;
    o = flame + o * (1.0 - flame.a);
  }
  return o;
}
