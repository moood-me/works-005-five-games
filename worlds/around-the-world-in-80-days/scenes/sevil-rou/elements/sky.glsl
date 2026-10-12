// London's fog over the roofs: from high up (the stage's top and above) to low over the street, a slow drift of thicker
// and thinner fog across it (more of it low down), and on Sunday morning the low sun's pale warmth to the right, behind
// the viewer. Colours come linear (svet.lin) from the animate.
vec4 shade(vec4 painted, vec2 at, vec2 uv) {
  float k = clamp((at.y + 0.35) / 1.05, 0.0, 1.0);
  vec3 c = mix(vec3(high_r, high_g, high_b), vec3(low_r, low_g, low_b), k);
  float f = noise2(vec2(at.x * 1.4 + u_time * 0.012, at.y * 5.0 - u_time * 0.004)) * 0.6 + noise2(vec2(at.x * 4.0 - u_time * 0.02, at.y * 11.0)) * 0.4;
  c *= 0.93 + 0.14 * f * (0.4 + 0.6 * k);
  float d = length(vec2(at.x - (wide + 0.2), (at.y - 0.45) / 0.6)) / 1.1;
  c += vec3(1.0, 0.87, 0.65) * 0.35 * sun * pow(max(0.0, 1.0 - d), 2.0);
  return vec4(c, 1.0);
}
