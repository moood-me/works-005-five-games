// The fleet coming out of the morning mist (`front`, lib.js; the same edge as the sea's, sea.glsl): everything lower
// than the mist's edge is still hidden by it, fading in as it clears. The painting is the glow round the chosen sails
// (and the light through the great sail), which shines (emission), breathing; layer 1 the sails and their hulls, 2 the
// words, 3 the weave of the cloth over them (the title shows through it). The cloth stirs a little in the wind; the
// words stand still.
vec4 shade(vec4 painted, vec2 at, vec2 uv) {
  float vis = 1.0 - smoothstep(front - 0.02, front + 0.12, at.y);
  vec2 stir = vec2(0.0025 * sin(u_time * 0.9 + at.y * 14.0 + at.x * 5.0), 0.0);
  vec4 sails = layer(1, at + stir);
  vec4 words = layer(2, at);
  vec4 weave = layer(3, at + stir);
  vec4 o = painted;
  o = sails + o * (1.0 - sails.a);
  o = words + o * (1.0 - words.a);
  o = weave + o * (1.0 - weave.a);
  emission = painted.rgb * (0.5 + 0.15 * sin(u_time * 1.3 + at.x * 6.0)) * vis;
  return o * vis;
}
