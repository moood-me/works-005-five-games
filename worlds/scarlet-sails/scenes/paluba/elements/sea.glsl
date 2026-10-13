// The sea's own colour under the mirror, and the swell's crests on it: short pale strokes lying across the wind (it
// blows from astern, toward the west — up the painting), each rising, running a little downwind and sinking back; of
// three sizes, so the water is worked near the ship and out to the horizon, each size fading out where it would be
// finer than the pixels. They lie in the world: the ship sails over them. `storm` 0…1 — a darker sea, more crests and
// whiter.
const vec3 DEEP = vec3(0.0704, 0.1221, 0.1946), DEEP_STORM = vec3(0.0452, 0.0782, 0.1221), CREST = vec3(0.716, 0.776, 0.823);
float crests(vec2 at, float cell, float px) {
  // (downwind: toward −y; the crests run that way at a walking pace, the bigger the faster)
  vec2 p = vec2(at.x, at.y + u_time * (0.6 + 0.02 * cell)) / cell;
  vec2 i = floor(p), f = fract(p);
  if (hash1(i + vec2(cell * 7.0, 13.0)) > 0.3 + 0.45 * storm) return 0.0;
  float life = 0.5 + 0.5 * sin(u_time * (0.25 + 0.3 * hash1(i + 7.0)) + 6.283 * hash1(i + 3.0));
  float len = 0.3 + 0.6 * hash1(i + 11.0), x0 = hash1(i + 5.0) * (1.0 - len), y0 = 0.15 + 0.7 * hash1(i + 9.0);
  float thick = max(0.12 / cell, 0.03), soft = px / cell + 1e-4;
  float a = smoothstep(x0 - soft, x0 + 0.08, f.x) * (1.0 - smoothstep(x0 + len - 0.08, x0 + len + soft, f.x))
    * (1.0 - smoothstep(thick - soft, thick + soft, abs(f.y - y0)));
  // (finer than the pixels: gone)
  return a * life * (0.12 + 0.35 * storm) * (0.4 + 0.6 * hash1(i + 1.0)) * (1.0 - smoothstep(0.08, 0.3, px / cell));
}
vec4 shade(vec4 painted, vec2 at, vec2 uv) {
  float px = max(fwidth(at.x), fwidth(at.y));
  float a = max(crests(at, 6.0, px), max(crests(at + 31.0, 40.0, px), crests(at + 77.0, 260.0, px)));
  return vec4(mix(mix(DEEP, DEEP_STORM, storm), CREST, a), 1.0) * painted.a;
}
