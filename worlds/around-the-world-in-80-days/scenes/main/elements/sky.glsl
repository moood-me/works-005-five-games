// The fog from high up (the top of the sky, y −0.35) down to low over the street (y 0.7 and below): the hour's two
// colours (sky.animate.js), mixed as the old gradient did
vec4 shade(vec4 painted, vec2 at, vec2 uv) {
  float u = clamp((at.y + 0.35) / 1.05, 0.0, 1.0);
  return vec4(mix(vec3(high_r, high_g, high_b), vec3(low_r, low_g, low_b), u), 1.0);
}
