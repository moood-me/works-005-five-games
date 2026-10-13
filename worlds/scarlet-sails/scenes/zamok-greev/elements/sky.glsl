// The world's sky (module nebo; written into a scene by tools/nebo-sky.js — change it there, not in the scene).
// The hour's sky from what its animate gives (nebo.skyMotion): the gradient from the top through the middle to the
// horizon, the far sea under it; the stars of the night, each twinkling its own way; long bands of cloud (layer 1,
// painted white) in the hour's colours, lit from under by a low sun, drifting slowly round; the sun's light along the
// horizon and round it, its disc (layer 2), the moon (layer 3) — where the animate has them; a storm's low grey cover.
// Colours come as sRGB 0…1 (mixed so, as the palette was painted), made linear at the end.
// a soft round light's fall-off: 1 at its middle, 0.45 at 0.35 of its reach, nothing at its reach
float fall(float r) { r = clamp(r, 0.0, 1.0); return r < 0.35 ? mix(1.0, 0.45, r / 0.35) : mix(0.45, 0.0, (r - 0.35) / 0.65); }
// how far across x is from x1 — round a sky seen all round
float across(float x, float x1) { float d = x - x1; return all_round > 0.5 ? mod(d + 0.5 * span, span) - 0.5 * span : d; }
vec4 shade(vec4 painted, vec2 at, vec2 uv) {
  // (a pixel, in stage heights: a star smaller than it is drawn that big, fainter)
  float px = max(length(fwidth(at)), 1e-5);
  vec3 top = vec3(tr, tg, tb), mid = vec3(mr, mg, mb), low = vec3(lr, lg, lb), glw = vec3(gr, gg, gb), sea = vec3(sr, sg, sb);
  bool above = at.y <= horizon;
  vec3 c;
  if (above) {
    float y = clamp((at.y + 0.4) / (horizon + 0.4), 0.0, 1.0);
    vec3 high = mix(top, mid, 0.7);
    c = y < 0.5 ? mix(top, high, y / 0.5) : y < 0.82 ? mix(high, mid, (y - 0.5) / 0.32) : mix(mid, low, (y - 0.82) / 0.18);
  } else {
    float y = clamp((at.y - horizon) / (1.3 - horizon), 0.0, 1.0);
    vec3 near = mix(mid, sea, 0.7);
    c = y < 0.12 ? mix(low, near, y / 0.12) : mix(near, sea, (y - 0.12) / 0.88);
  }
  float sx = across(at.x, sun_x), mx = across(at.x, moon_x);
  vec3 starlight = vec3(0.0);
  if (above) {
    // the sun's light along the horizon (wide and flat) and round the sun
    c = mix(c, glw, 0.55 * max(sun_low, 0.25 * day) * fall(length(vec2(sx / 1.6, (at.y - horizon) / 0.256))));
    c = mix(c, glw, 0.5 * sun_up * (0.4 + 0.6 * sun_low) * fall(length(vec2(sx / 0.55, (at.y - sun_y) / 0.33))));
    // the clouds, carried slowly round
    float cx = x0 + mod(at.x - x0 - 0.0012 * u_time, span);
    float cover = layer(1, vec2(cx, at.y)).a;
    float lit = exp(-abs(sx) * 1.2) * sun_low;
    vec3 cloud = mix(mix(top, mid, 0.55), mix(mid, glw, 0.25 + 0.6 * sun_low), 0.4 + 0.6 * lit);
    c = mix(c, cloud, cover * (0.42 + 0.33 * day));
    // the storm's cover: low and grey, heavier in slow banks
    if (storm > 0.0) {
      vec3 grey = mix(mid, vec3(0.361, 0.388, 0.42), 0.6);
      float y = clamp((at.y + 0.4) / (horizon + 0.4), 0.0, 1.0);
      c = mix(c, mix(mix(grey, top, 0.3), mix(grey, low, 0.4), y), (0.8 + 0.1 * y) * storm);
      float bank = noise2(vec2(cx * 1.6 + 0.01 * u_time, at.y * 5.0));
      c = mix(c, mix(grey, vec3(0.247, 0.271, 0.298), 0.5), 0.5 * storm * smoothstep(0.45, 0.85, bank));
    }
    // the moon's light in the air
    c = mix(c, vec3(0.788, 0.831, 0.894), 0.18 * moon_up * fall(length(vec2(mx, at.y - moon_y)) / 0.22));
    // the stars: a star in some cells of two fields — many faint, a few bright —, fewer and fainter toward the horizon
    if (night > 0.003) {
      float lowSky = clamp((horizon - at.y) / 0.2, 0.0, 1.0) * (1.0 - storm);
      for (int f = 0; f < 2; f++) {
        float ff = float(f), size = f == 0 ? 0.035 : 0.13;
        vec2 cell = vec2(all_round > 0.5 ? span / floor(span / size) : size, size);
        vec2 k = floor(at / cell);
        if (hash1(vec3(k, 1.0 + ff * 8.0)) > (f == 0 ? 0.2 : 0.16)) continue;
        vec2 pos = (k + 0.25 + 0.5 * vec2(hash1(vec3(k, 2.0 + ff * 8.0)), hash1(vec3(k, 3.0 + ff * 8.0)))) * cell;
        float h = hash1(vec3(k, 4.0 + ff * 8.0));
        float b = f == 0 ? 0.25 + 0.5 * h * h : 0.6 + 0.4 * h;
        float tw = 1.0 + (0.15 + 0.3 * (1.0 - lowSky)) * (noise1(u_time * (1.5 + 3.0 * hash1(vec3(k, 6.0 + ff * 8.0))) + h * 97.0) * 2.0 - 1.0);
        float r = 0.0007 + 0.0013 * b, R = max(r, 0.7 * px), d = length(at - pos);
        float core = (1.0 - smoothstep(R - 0.5 * px, R + 0.5 * px, d)) * min(1.0, (r * r) / (R * R));
        starlight += srgbToLinear(vec3(0.875, 0.902, 0.949)) * core * b * tw * night * lowSky;
      }
    }
  }
  // the moon and the sun themselves, from where they are painted (the middle of the sky) to where they are now
  vec2 mid0 = vec2(x0 + 0.5 * span, 0.0);
  vec4 moonDisc = layer(3, vec2(mid0.x + mx, at.y - moon_y + 0.3));
  c = mix(c, vec3(0.933, 0.945, 0.961), 0.95 * moonDisc.a * moon_up);
  float sunAir = fall(length(vec2(sx, at.y - sun_y)) / 0.05);
  c = mix(c, mix(glw, vec3(1.0), 0.5), 0.9 * sun_up * sunAir);
  float sunDisc = layer(2, vec2(mid0.x + sx, at.y - sun_y + 0.2)).a * sun_up;
  c = mix(c, mix(glw, vec3(1.0, 0.98, 0.949), 0.75), sunDisc);
  vec3 L = srgbToLinear(c) + starlight;
  // (the sun's disc brighter than white: it blooms, and draws its path on the water; the moon's a little)
  L *= 1.0 + 3.0 * sunDisc + 0.6 * moonDisc.a * moon_up;
  return vec4(L, 1.0);
}
