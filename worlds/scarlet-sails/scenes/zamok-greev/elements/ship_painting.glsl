// The canvas alive (`alive` 0…1): the frame and the sky as painted; over them the far sea (layer 1) running in swells,
// the great wave (layer 2) rising and falling, its lip curling, the foam trembling; the ship (layer 3) riding the
// crest — rising with it, pitching about it. Still at 0: the layers as painted. All of it cut to the canvas.
const vec2 SHIP = vec2(0.0, -0.98);
const float TAU = 6.2831853;
vec4 over(vec4 top, vec4 under) { return top + under * (1.0 - top.a); }
vec4 shade(vec4 painted, vec2 at, vec2 uv) {
  if (at.x < -1.04 || at.x > 1.04 || at.y < -1.44 || at.y > -0.06) return painted;
  float a = alive;
  // the swell's slow turn, the lip's quicker one, the running of the far sea
  float slow = TAU * cycle(0.11), lip = TAU * cycle(0.21), run = TAU * cycle(0.16);
  vec4 c = painted;
  // the far sea: its lines of swell running to the left
  float swell = a * (0.012 * sin(at.x * 15.3 + run * 2.0 + 2.0) + 0.008 * sin(at.x * 9.0 - run + at.y * 6.0));
  c = over(layer(1, at - vec2(0.0, swell)), c);
  // the great wave: the crest rising and falling, leaning; the lip curling over and back; small water running down it
  vec2 heave = a * vec2(0.05 * sin(slow), 0.04 * sin(slow + 0.6));
  float atLip = smoothstep(0.1, -0.5, at.x) * smoothstep(-0.55, -0.95, at.y);
  vec2 curl = a * atLip * vec2(0.05 * sin(lip), 0.012 * sin(lip * 2.0 + at.y * 20.0));
  vec2 ripple = a * 0.004 * vec2(wobble(at.y * 14.0 + run * 3.0), wobble(at.x * 11.0 - run * 2.0));
  c = over(layer(2, at - heave - curl - ripple), c);
  // the ship: with the crest, bobbing on it, pitching about it
  float pitch = a * 0.08 * sin(slow - 0.4);
  vec2 d = at - SHIP - heave - a * vec2(0.0, 0.03 * sin(slow + 0.3));
  float cs = cos(pitch), sn = sin(pitch);
  c = over(layer(3, SHIP + vec2(cs * d.x + sn * d.y, -sn * d.x + cs * d.y)), c);
  return c;
}
