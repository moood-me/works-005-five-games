// The world's sailcloth (module ships; written into a scene by tools/ship.js — change it there, not in the scene).
// A sail painted once, fully set, white: here it is set as far as `set` says (furled, a roll: dropping from its head, or
// — `rise` — going up from its foot), white or scarlet (`scarlet`: the painting's lights and darks become the silk's),
// and alive — the wind's long folds going over it, light on their crests (`wind`: how much; in gusts), and, when it
// spills its wind (`luff`), shaking. Nothing moves where it is bent on (its head). head, foot: the painting's y of its
// head and foot (its units, y down); seed: its own.
const SCARLET = vec3f(0.6584, 0.0212, 0.0423);
const SCARLET_LIGHT = vec3f(0.8388, 0.0685, 0.0844);
const SCARLET_DEEP = vec3f(0.3916, 0.0091, 0.0252);
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  let tall = u_foot - u_head;
  let u = clamp(u_set, 0.05, 1.0);
  // how far down the sail (as painted) this point is: 0 its head, 1 its foot
  let t = select((at.y - u_head) / (tall * u), 1.0 - (u_foot - at.y) / (tall * u), u_rise > 0.5);
  if (t < -0.03 || t > 1.03) {
    return vec4f(0.0);
  }
  let free = smoothstep(0.0, 0.3, t) * u;
  let gust = 0.55 + 0.45 * noise1(0.23 * u_time + 7.0 * u_seed);
  let pace = 0.4 + 1.8 * u_luff;
  let q = vec2f(at.x * 0.24 + 3.7 * u_seed - 0.35 * pace * u_time, t * 1.4 + 1.9 * u_seed + 0.12 * pace * u_time);
  let w = wobble2(q) + 0.5 * wobble2(q * 2.6 + vec2f(0.8 * pace * u_time, 5.0));
  let amp = tall * free * (0.007 * u_wind * gust + 0.035 * u_luff);
  let c = layer(0, vec2f(at.x + 2.0 * amp * w.x, u_head + clamp(t, 0.0, 1.0) * tall + amp * w.y));
  if (c.a < 0.004) {
    return vec4f(0.0);
  }
  // the folds' light: their crests toward the light, their hollows away
  let light = 1.0 + free * (0.07 * u_wind * gust + 0.2 * u_luff) * w.x;
  var col = c.rgb / c.a;
  let k = luma(col) / 0.878 * light;
  var silk = mix(SCARLET_DEEP, SCARLET, smoothstep(0.5, 0.9, k));
  silk = mix(silk, SCARLET_LIGHT, smoothstep(0.9, 1.1, k));
  col = mix(col * light, silk, u_scarlet);
  return vec4f(col * c.a, c.a);
}
