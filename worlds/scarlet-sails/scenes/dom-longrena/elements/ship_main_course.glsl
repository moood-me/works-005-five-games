// The world's sailcloth (module korabli; written into a scene by tools/korabl.js — change it there, not in the scene).
// A sail painted once, fully set, white: here it is set as far as `set` says (furled, a roll: dropping from its head, or
// — `rise` — going up from its foot), white or scarlet (`scarlet`: the painting's lights and darks become the silk's),
// and alive — the wind's long folds going over it, light on their crests (`wind`: how much; in gusts), and, when it
// spills its wind (`luff`), shaking. Nothing moves where it is bent on (its head). head, foot: the painting's y of its
// head and foot (its units, y down); seed: its own.
const vec3 SCARLET = vec3(0.6584, 0.0212, 0.0423), SCARLET_LIGHT = vec3(0.8388, 0.0685, 0.0844), SCARLET_DEEP = vec3(0.3916, 0.0091, 0.0252);
vec4 shade(vec4 painted, vec2 at, vec2 uv) {
  float tall = foot - head, u = clamp(set, 0.05, 1.0);
  // how far down the sail (as painted) this point is: 0 its head, 1 its foot
  float t = rise > 0.5 ? 1.0 - (foot - at.y) / (tall * u) : (at.y - head) / (tall * u);
  if (t < -0.03 || t > 1.03) return vec4(0.0);
  float free = smoothstep(0.0, 0.3, t) * u;
  float gust = 0.55 + 0.45 * noise1(0.23 * u_time + 7.0 * seed);
  float pace = 0.4 + 1.8 * luff;
  vec2 q = vec2(at.x * 0.24 + 3.7 * seed - 0.35 * pace * u_time, t * 1.4 + 1.9 * seed + 0.12 * pace * u_time);
  vec2 w = wobble2(q) + 0.5 * wobble2(q * 2.6 + vec2(0.8 * pace * u_time, 5.0));
  float amp = tall * free * (0.007 * wind * gust + 0.035 * luff);
  vec4 c = layer(0, vec2(at.x + 2.0 * amp * w.x, head + clamp(t, 0.0, 1.0) * tall + amp * w.y));
  if (c.a < 0.004) return vec4(0.0);
  // the folds' light: their crests toward the light, their hollows away
  float light = 1.0 + free * (0.07 * wind * gust + 0.2 * luff) * w.x;
  vec3 col = c.rgb / c.a;
  float k = luma(col) / 0.878 * light;
  vec3 silk = mix(SCARLET_DEEP, SCARLET, smoothstep(0.5, 0.9, k));
  silk = mix(silk, SCARLET_LIGHT, smoothstep(0.9, 1.1, k));
  col = mix(col * light, silk, scarlet);
  return vec4(col * c.a, c.a);
}
