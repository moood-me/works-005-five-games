// The fog: how thick it is here — the low fog as painted, and the two sheets of banks (layers 1, 2) drifting at their own
// paces, wrapped round the box (x −56 … 18) — in the hour's colour (mist.animate.js)
vec4 shade(vec4 painted, vec2 at, vec2 uv) {
  float W = 74.0;
  vec2 a1 = vec2(-56.0 + mod(at.x + 56.0 - 0.22 * u_time, W), at.y);
  vec2 a2 = vec2(-56.0 + mod(at.x + 56.0 - 0.34 * u_time, W), at.y);
  float a = 1.0 - (1.0 - painted.a) * (1.0 - layer(1, a1).a) * (1.0 - layer(2, a2).a);
  return vec4(vec3(fog_r, fog_g, fog_b) * a, a);
}
