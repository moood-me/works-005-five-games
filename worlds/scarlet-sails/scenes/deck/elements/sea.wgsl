// The sea's own colour under the mirror, and the swell's crests on it: short pale strokes lying across the wind (it
// blows from astern, toward the west — up the painting), each rising, running a little downwind and sinking back; of
// three sizes, so the water is worked near the ship and out to the horizon, each size fading out where it would be
// finer than the pixels. They lie in the world: the ship sails over them. `storm` 0…1 — a darker sea, more crests and
// whiter.
const DEEP = vec3f(0.0704, 0.1221, 0.1946);
const DEEP_STORM = vec3f(0.0452, 0.0782, 0.1221);
const CREST = vec3f(0.716, 0.776, 0.823);
fn crests(at: vec2f, cell: f32, px: f32) -> f32 {
  // (downwind: toward −y; the crests run that way at a walking pace, the bigger the faster)
  let p = vec2f(at.x, at.y + u_time * (0.6 + 0.02 * cell)) / cell;
  let i = floor(p);
  let f = fract(p);
  if (hash2(i + vec2f(cell * 7.0, 13.0)) > 0.3 + 0.45 * u_storm) {
    return 0.0;
  }
  let life = 0.5 + 0.5 * sin(u_time * (0.25 + 0.3 * hash2(i + 7.0)) + 6.283 * hash2(i + 3.0));
  let len = 0.3 + 0.6 * hash2(i + 11.0);
  let x0 = hash2(i + 5.0) * (1.0 - len);
  let y0 = 0.15 + 0.7 * hash2(i + 9.0);
  let thick = max(0.12 / cell, 0.03);
  let soft = px / cell + 0.0001;
  let a = smoothstep(x0 - soft, x0 + 0.08, f.x) * (1.0 - smoothstep(x0 + len - 0.08, x0 + len + soft, f.x))
    * (1.0 - smoothstep(thick - soft, thick + soft, abs(f.y - y0)));
  // (finer than the pixels: gone)
  return a * life * (0.12 + 0.35 * u_storm) * (0.4 + 0.6 * hash2(i + 1.0)) * (1.0 - smoothstep(0.08, 0.3, px / cell));
}
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  let px = max(abs(at_dx.x) + abs(at_dy.x), abs(at_dx.y) + abs(at_dy.y));
  let a = max(crests(at, 6.0, px), max(crests(at + 31.0, 40.0, px), crests(at + 77.0, 260.0, px)));
  return vec4f(mix(mix(DEEP, DEEP_STORM, u_storm), CREST, a), 1.0) * painted.a;
}
