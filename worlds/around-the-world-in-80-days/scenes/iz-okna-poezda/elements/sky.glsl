// The sky's colours, from what its animate gives (sRGB 0…1, mixed so, made linear at the end): the land's sky from
// the top to the horizon (top, low), the moonlit haze low along the horizon under the moon, the low sun's warm sky
// round it; over them its layers — the stars (each twinkling its own way), the moon, the sun — as much as each is out.
const float YH = 0.27;
// a soft round glow's fall-off: 1 at its middle, 0.45 at 0.4 of its reach, nothing at its reach
float fall(float r) { return r < 0.4 ? mix(1.0, 0.45, r / 0.4) : mix(0.45, 0.0, clamp((r - 0.4) / 0.6, 0.0, 1.0)); }
vec4 over(vec4 c, vec4 l, float k) { return c * (1.0 - l.a * k) + l * k; }
vec4 shade(vec4 painted, vec2 at, vec2 uv) {
  vec3 top = vec3(tr, tg, tb), low = vec3(lr, lg, lb), mid = mix(top, low, 0.6);
  float y = clamp((at.y + 0.35) / (YH + 0.35), 0.0, 1.0);
  vec3 c = y < 0.7 ? mix(top, mid, y / 0.7) : mix(mid, low, (y - 0.7) / 0.3);
  // the moonlit haze along the horizon
  c = mix(c, vec3(0.624, 0.698, 0.8), 0.18 * moon * fall(length(vec2((at.x - w * 0.42) / 0.6, (at.y - YH) / 0.072))));
  // the low sun's warm sky
  vec2 s = vec2(w * 0.6, YH - 0.012 + sun_dy);
  c = mix(c, vec3(1.0, 0.69, 0.44), 0.35 * sun * fall(length(vec2((at.x - s.x) / 0.5, (at.y - s.y) / 0.225))));
  vec4 o = vec4(srgbToLinear(c), 1.0);
  // the stars, each twinkling at its own phase
  float tw = 0.7 + 0.3 * sin(6.2831853 * (cycle(0.6) + hash1(at * 160.0)));
  o = over(o, layer(1, at), stars * tw);
  o = over(o, layer(2, at), moon);
  o = over(o, layer(3, at - vec2(0.0, sun_dy)), sun);
  return o;
}
