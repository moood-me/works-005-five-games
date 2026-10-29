// The world's sky (module sky; written into a scene by tools/sky.js — change it there, not in the scene).
// The hour's sky from what its animate gives (sky.skyMotion): the gradient from the top through the middle to the
// horizon, the far sea under it; the stars of the night, each twinkling its own way; long bands of cloud (layer 1,
// painted white) in the hour's colours, lit from under by a low sun, drifting slowly round; the sun's light along the
// horizon and round it, its disc (layer 2), the moon (layer 3) — where the animate has them; a storm's low grey cover.
// Colours come as sRGB 0…1 (mixed so, as the palette was painted), made linear at the end.
// a soft round light's fall-off: 1 at its middle, 0.45 at 0.35 of its reach, nothing at its reach
fn fall(r0: f32) -> f32 {
  let r = clamp(r0, 0.0, 1.0);
  return select(mix(0.45, 0.0, (r - 0.35) / 0.65), mix(1.0, 0.45, r / 0.35), r < 0.35);
}
// how far across x is from x1 — round a sky seen all round
fn across(x: f32, x1: f32) -> f32 {
  let d = x - x1;
  return select(d, wrap(d + 0.5 * u_span, u_span) - 0.5 * u_span, u_all_round > 0.5);
}
fn shade(painted: vec4f, at: vec2f, uv: vec2f) -> vec4f {
  // (a pixel, in stage heights: a star smaller than it is drawn that big, fainter)
  let px = max(length(abs(at_dx) + abs(at_dy)), 0.00001);
  let top = vec3f(u_tr, u_tg, u_tb);
  let mid = vec3f(u_mr, u_mg, u_mb);
  let low = vec3f(u_lr, u_lg, u_lb);
  let glw = vec3f(u_gr, u_gg, u_gb);
  let sea = vec3f(u_sr, u_sg, u_sb);
  let above = at.y <= u_horizon;
  var c: vec3f;
  if (above) {
    let y = clamp((at.y + 0.4) / (u_horizon + 0.4), 0.0, 1.0);
    let high = mix(top, mid, 0.7);
    if (y < 0.5) {
      c = mix(top, high, y / 0.5);
    } else if (y < 0.82) {
      c = mix(high, mid, (y - 0.5) / 0.32);
    } else {
      c = mix(mid, low, (y - 0.82) / 0.18);
    }
  } else {
    let y = clamp((at.y - u_horizon) / (1.3 - u_horizon), 0.0, 1.0);
    let near = mix(mid, sea, 0.7);
    if (y < 0.12) {
      c = mix(low, near, y / 0.12);
    } else {
      c = mix(near, sea, (y - 0.12) / 0.88);
    }
  }
  let sx = across(at.x, u_sun_x);
  let mx = across(at.x, u_moon_x);
  var starlight = vec3f(0.0);
  if (above) {
    // the sun's light along the horizon (wide and flat) and round the sun
    c = mix(c, glw, 0.55 * max(u_sun_low, 0.25 * u_day) * fall(length(vec2f(sx / 1.6, (at.y - u_horizon) / 0.256))));
    c = mix(c, glw, 0.5 * u_sun_up * (0.4 + 0.6 * u_sun_low) * fall(length(vec2f(sx / 0.55, (at.y - u_sun_y) / 0.33))));
    // the clouds, carried slowly round
    let cx = u_x0 + wrap(at.x - u_x0 - 0.0012 * u_time, u_span);
    let cover = layer(1, vec2f(cx, at.y)).a;
    let lit = exp(-abs(sx) * 1.2) * u_sun_low;
    let cloud = mix(mix(top, mid, 0.55), mix(mid, glw, 0.25 + 0.6 * u_sun_low), 0.4 + 0.6 * lit);
    c = mix(c, cloud, cover * (0.42 + 0.33 * u_day));
    // the storm's cover: low and grey, heavier in slow banks
    if (u_storm > 0.0) {
      let grey = mix(mid, vec3f(0.361, 0.388, 0.42), 0.6);
      let y = clamp((at.y + 0.4) / (u_horizon + 0.4), 0.0, 1.0);
      c = mix(c, mix(mix(grey, top, 0.3), mix(grey, low, 0.4), y), (0.8 + 0.1 * y) * u_storm);
      let bank = noise2(vec2f(cx * 1.6 + 0.01 * u_time, at.y * 5.0));
      c = mix(c, mix(grey, vec3f(0.247, 0.271, 0.298), 0.5), 0.5 * u_storm * smoothstep(0.45, 0.85, bank));
    }
    // the moon's light in the air
    c = mix(c, vec3f(0.788, 0.831, 0.894), 0.18 * u_moon_up * fall(length(vec2f(mx, at.y - u_moon_y)) / 0.22));
    // the stars: a star in some cells of two fields — many faint, a few bright —, fewer and fainter toward the horizon
    if (u_night > 0.003) {
      let lowSky = clamp((u_horizon - at.y) / 0.2, 0.0, 1.0) * (1.0 - u_storm);
      for (var f = 0; f < 2; f++) {
        let ff = f32(f);
        let size = select(0.13, 0.035, f == 0);
        let cell = vec2f(select(size, u_span / floor(u_span / size), u_all_round > 0.5), size);
        let k = floor(at / cell);
        if (hash3(vec3f(k, 1.0 + ff * 8.0)) > select(0.16, 0.2, f == 0)) {
          continue;
        }
        let pos = (k + 0.25 + 0.5 * vec2f(hash3(vec3f(k, 2.0 + ff * 8.0)), hash3(vec3f(k, 3.0 + ff * 8.0)))) * cell;
        let h = hash3(vec3f(k, 4.0 + ff * 8.0));
        let b = select(0.6 + 0.4 * h, 0.25 + 0.5 * h * h, f == 0);
        let tw = 1.0 + (0.15 + 0.3 * (1.0 - lowSky)) * (noise1(u_time * (1.5 + 3.0 * hash3(vec3f(k, 6.0 + ff * 8.0))) + h * 97.0) * 2.0 - 1.0);
        let r = 0.0007 + 0.0013 * b;
        let bigR = max(r, 0.7 * px);
        let d = length(at - pos);
        let core = (1.0 - smoothstep(bigR - 0.5 * px, bigR + 0.5 * px, d)) * min(1.0, (r * r) / (bigR * bigR));
        starlight += srgbToLinear(vec3f(0.875, 0.902, 0.949)) * core * b * tw * u_night * lowSky;
      }
    }
  }
  // the moon and the sun themselves, from where they are painted (the middle of the sky) to where they are now
  let mid0 = vec2f(u_x0 + 0.5 * u_span, 0.0);
  let moonDisc = layer(3, vec2f(mid0.x + mx, at.y - u_moon_y + 0.3));
  c = mix(c, vec3f(0.933, 0.945, 0.961), 0.95 * moonDisc.a * u_moon_up);
  let sunAir = fall(length(vec2f(sx, at.y - u_sun_y)) / 0.05);
  c = mix(c, mix(glw, vec3f(1.0), 0.5), 0.9 * u_sun_up * sunAir);
  let sunDisc = layer(2, vec2f(mid0.x + sx, at.y - u_sun_y + 0.2)).a * u_sun_up;
  c = mix(c, mix(glw, vec3f(1.0, 0.98, 0.949), 0.75), sunDisc);
  var L = srgbToLinear(c) + starlight;
  // (the sun's disc brighter than white: it blooms, and draws its path on the water; the moon's a little)
  L *= 1.0 + 3.0 * sunDisc + 0.6 * moonDisc.a * u_moon_up;
  return vec4f(L, 1.0);
}
