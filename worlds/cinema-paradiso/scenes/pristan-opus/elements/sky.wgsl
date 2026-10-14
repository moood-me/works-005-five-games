// the stars (layer 1) twinkle over the sky's painting. All of it is given as emission over black: what a shader
// returns is lit by the scene (a night's ambient would darken the sky), its emission is not.
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  let s = layer(1, at);
  let tw = 0.5 + 0.5 * noise2(vec2f(at.x * 173.0 + u_time * 0.7, at.y * 191.0 - u_time * 0.4));
  let k = s.a * tw;
  emission = s.rgb * tw + painted.rgb * (1.0 - k);
  return vec4f(0.0, 0.0, 0.0, k + painted.a * (1.0 - k));
}
