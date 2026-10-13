// The sky over Kaperna and the light of the hour, one for every scene of the world (engine 2): the hour's palette, the
// sun and the moon on their way, the weights of the scenes' looks, the colours of lamplight and of the scarlet — and
// the sky itself: painted once (sky), moved by its animate (skyMotion) and its shader (tools/nebo-sky.glsl, written
// into a scene by tools/nebo-sky.js). No painting reads the hour: `hour` moves, and what moves is the engine's.
// nebo.md says how a scene uses it.

const rgbOf = (c) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
const hexOf = (r) => `#${r.map((v) => Math.round(anim.clamp(v, 0, 255)).toString(16).padStart(2, "0")).join("")}`;
// a colour between two (#rrggbb), u 0…1
const mix = (a, b, u) => {
  const p = rgbOf(a);
  const q = rgbOf(b);
  return hexOf(p.map((v, i) => v + (q[i] - v) * u));
};
const rgba = (c, a) => {
  const [r, g, b] = rgbOf(c);
  return `rgba(${r},${g},${b},${anim.clamp(a, 0, 1)})`;
};
// a colour as a shader takes it: linear 0…1 — into `out` if given (an animate's own array: nothing made each frame)
const toLin = (v) => {
  const c = v / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
function lin(c, out = [0, 0, 0]) {
  const v = Array.isArray(c) ? c : rgbOf(c);
  out[0] = toLin(v[0]);
  out[1] = toLin(v[1]);
  out[2] = toLin(v[2]);
  return out;
}

// ── The hour ── 0 midnight, 0.25 dawn, 0.5 noon, 0.75 sunset.
// the sky's top, middle and horizon; the glow round the sun; the sea under the sky; day 0…1
const KEYS = ["top", "mid", "low", "glow", "sea"];
const NIGHT = ["#0b1322", "#152034", "#26344b", "#33435c", "#0b131f", 0];
const STOPS = [
  [0, NIGHT],
  [0.16, ["#1a273e", "#33425b", "#66748b", "#7d8296", "#16223a", 0.12]],
  [0.25, ["#6a7f9b", "#a7b4c4", "#e2dad4", "#f4dfcc", "#506379", 0.55]],
  [0.33, ["#8199b3", "#bccad7", "#e8eaea", "#f6eee2", "#6a7f96", 0.85]],
  [0.5, ["#8ea6bd", "#c5d1dc", "#ebeff1", "#f7f5ef", "#788da2", 1]],
  [0.67, ["#8398ae", "#b9c3ce", "#e4ded7", "#f3e6d6", "#6a7c90", 0.85]],
  [0.75, ["#53637d", "#9493a4", "#dcc2b1", "#efcfb4", "#3f4c60", 0.5]],
  [0.84, ["#1f2c44", "#424e66", "#7c7787", "#968890", "#172236", 0.12]],
  [1, NIGHT],
];
// (the same as numbers, for what runs every frame: 15 colour channels 0…1, then day)
const NUMS = STOPS.map(([h, c]) => [h, [...c.slice(0, 5).flatMap((x) => rgbOf(x).map((v) => v / 255)), c[5]]]);
const wrap1 = (h) => ((h % 1) + 1) % 1;
function between(h) {
  let i = 0;
  while (i < STOPS.length - 2 && STOPS[i + 1][0] <= h) i++;
  return i;
}
// the hour's colours as numbers into `out` (16: top, mid, low, glow, sea as r, g, b 0…1 — sRGB —, then day 0…1):
// nothing made — for an animate
function paletteInto(hour, out) {
  const h = wrap1(hour);
  const i = between(h);
  const a = NUMS[i][1];
  const b = NUMS[i + 1][1];
  const u = anim.ease.inOut(anim.span(h, NUMS[i][0], NUMS[i + 1][0]));
  for (let k = 0; k < 16; k++) out[k] = a[k] + (b[k] - a[k]) * u;
  return out;
}
const nightOf = (day) => 1 - anim.clamp(day * 2.2, 0, 1);
// the hour's colours → { top, mid, low, glow, sea (#rrggbb), day, night } — for scripts and animates, never a painting
function palette(hour) {
  const h = wrap1(hour);
  const i = between(h);
  const [h0, a] = STOPS[i];
  const [h1, b] = STOPS[i + 1];
  const u = anim.ease.inOut(anim.span(h, h0, h1));
  const p = {};
  KEYS.forEach((k, j) => {
    p[k] = mix(a[j], b[j], u);
  });
  p.day = a[5] + (b[5] - a[5]) * u;
  p.night = nightOf(p.day);
  return p;
}

// The sun over the sea: it rises in the east over the water (u 0), crosses the south and sets in the west behind the
// hills (u 1); below the horizon u is under 0 or over 1. height 0…1 — how high (1 at noon); visible 0…1 — up or not.
const sunU = (hour) => (wrap1(hour) - 0.23) / 0.54;
const moonU = (hour) => wrap1(hour - 0.78) / 0.44;
const heightOf = (u) => Math.sin(Math.PI * anim.clamp(u, 0, 1));
const sunSeen = (u) => anim.clamp(Math.min(u, 1 - u) * 18 + 0.5, 0, 1);
const moonSeen = (u) => anim.clamp(Math.min(u, 1 - u) * 14, 0, 1);
function sun(hour) {
  const u = sunU(hour);
  return { u, height: heightOf(u), visible: sunSeen(u) };
}
// The moon by night, the same way round
function moon(hour) {
  const u = moonU(hour);
  return { u, height: heightOf(u), visible: moonSeen(u) };
}

// How far the hour is into each of the day's lights, 0…1 — the weights of a scene's light.looks: the night (till 0.15,
// again from 0.9) gives way to the dawn, the dawn (full at 0.26) to the day, the day to the dusk (full at 0.76), the
// dusk to the night
function looks(hour) {
  const h = wrap1(hour);
  const night = anim.clamp(1 - anim.span(h, 0.15, 0.24) + anim.span(h, 0.8, 0.9), 0, 1);
  const dawn = h < 0.26 ? 1 - night : Math.max(0, 1 - (h - 0.26) / 0.12);
  const dusk = h > 0.76 ? 1 - night : Math.max(0, 1 - (0.76 - h) / 0.1);
  return { night, dawn, dusk, day: anim.clamp(1 - night - dawn - dusk, 0, 1) };
}
// how much the sun and the moon shine at an hour, 0…1 — the `on` of the scene's lights from "sky#sun", "sky#moon"
function shine(hour) {
  const s = sunU(hour);
  const m = moonU(hour);
  return { sun: sunSeen(s) * anim.clamp(heightOf(s) * 4, 0, 1), moon: moonSeen(m) * looks(hour).night };
}
// The hour's light as the scene's keys: day, dawn, dusk, night (its light.looks' weights) and sun_light, moon_light
// (its far lights' `on`). A cut to another hour gives them with the hour — `{ hour: 0.96, ...nebo.keys(0.96) }` in a
// beat's `from`, in s.shot / s.cut — so the shot is made in its own light from its first frame.
function keys(hour) {
  const k = looks(hour);
  const s = shine(hour);
  return { day: k.day, dawn: k.dawn, dusk: k.dusk, night: k.night, sun_light: s.sun, moon_light: s.moon };
}
const KEYS_OF_LIGHT = ["day", "dawn", "dusk", "night", "sun_light", "moon_light"];
// The scene's script keeps them: they follow `hour` as it is set or moves.
function follow(scene, key = "hour") {
  const set = () => {
    const k = keys(scene.get(key) ?? 0.25);
    for (const name of KEYS_OF_LIGHT) scene.set(name, k[name]);
  };
  set();
  scene.on("change", key, set);
  scene.on("move", key, set);
}

// lamplight: a warm one (an oil lamp, Longren's window) and the paler village windows
const WARM = "#f4a85c";
const PALE = "#d8d3c2";
// the sails' cloth in daylight (the scene's light makes the hour): white, and the scarlet — its body, where the light
// lies on it, where it folds away
const WHITE = "#f2f1ec";
const SCARLET = "#d4283a";
const SCARLET_LIGHT = "#ec4a52";
const SCARLET_DEEP = "#a8182c";
const sail = (sails) => mix(WHITE, SCARLET, sails);

// A soft round light painted at (x, y), radius r, squeezed `flat` in height: a soft cloud, a band of mist, a pale
// wash. (A lamp's glow and its halo in the air are the engine's: e.light, light.hazeGlow.)
function glow(g, x, y, r, flat, colour, a) {
  if (a <= 0) return;
  g.save();
  g.translate(x, y);
  g.scale(1, flat);
  const gr = g.createRadialGradient(0, 0, 0, 0, 0, r);
  gr.addColorStop(0, rgba(colour, a));
  gr.addColorStop(0.35, rgba(colour, a * 0.45));
  gr.addColorStop(1, rgba(colour, 0));
  g.fillStyle = gr;
  g.fillRect(-r, -r, 2 * r, 2 * r);
  g.restore();
}

// ── The sky ── one sky element: `sky(g, e, o)` its code, `skyMotion(e, o)` its animate, tools/nebo-sky.glsl its
// shader. o (the scene's, made once — in its lib — not in the animate):
//   horizon — where the horizon is on the stage, from the top (the scene's "horizon");
//   round — true for a sky seen all round (cameras around, roam: x 0…2π, straight ahead at π); else the stage's
//     (x 0…e.aspect);
//   sun, moon — where the scene has them on its sky: (u, height, state, out) => { out[0] = x; out[1] = y; } (or
//     returning [x, y]) — u 0 rising … 1 setting (under 0, over 1: below the horizon), height 0…1, state the scene's
//     values now (a ship's heading); onRound(…) for a round sky; null — the scene has none;
//   clouds — [[x, y, length, thickness], …] long soft bands (stage heights); none given: a few of its own;
//   storm — the state key (0…1) drawing a low grey cover over it all, the sun and the moon dimmed.
const TAU = 2 * Math.PI;
const MARGIN = 0.4;
// where the sun's and the moon's layers are painted (the animate carries them from there): the middle of the sky
const SUN_Y = 0.2;
const MOON_Y = 0.3;
const extent = (e, o) => (o.round ? [0, TAU] : [-MARGIN, e.aspect + 2 * MARGIN]); // [left, width]
const BANDS = [[0.55, 0.19, 0.7, 0.022], [0.9, 0.3, 0.5, 0.014], [0.2, 0.34, 0.56, 0.016], [0.65, 0.43, 0.8, 0.01], [0.06, 0.1, 0.45, 0.02]];
function sky(g, e, o = {}) {
  const [x0, span] = extent(e, o);
  const H = o.horizon ?? 0.5;
  const mid = x0 + span / 2;
  // (under it all: what the shader colours)
  g.fillStyle = "#ffffff";
  g.fillRect(x0, -MARGIN, span, 1.3 + MARGIN);
  // the clouds: long soft bands, white — the shader gives them the hour's colours, lit from under by a low sun, and
  // carries them slowly round (their ends meet)
  const clouds = o.clouds ?? BANDS.map(([u, y, len, th]) => [x0 + u * span, y * (H / 0.55), len * (o.round ? 1.6 : 1.7), th]);
  e.layer("clouds", { box: [x0, -MARGIN, x0 + span, H] }, (g) => {
    clouds.forEach(([cx, cy, len, th], i) => {
      for (let j = 0; j < 4; j++) {
        const x = cx + (anim.hash(i * 4 + j, 12) - 0.5) * len * 0.7;
        const w = len * (0.25 + 0.25 * anim.hash(i * 4 + j, 13));
        for (const k of [-1, 0, 1]) glow(g, x + k * span, cy + (j % 2) * th * 0.6, w, th / w, "#ffffff", 0.6);
      }
    });
  });
  // the sun and the moon: a disc each, its glow (the path it draws on mirror water) and its point — the scene's
  // sunlight and moonlight shine from "sky#sun", "sky#moon", wherever the animate has them
  e.layer("sun", { box: [mid - 0.1, SUN_Y - 0.1, mid + 0.1, SUN_Y + 0.1] }, (g) => {
    g.fillStyle = "#ffffff";
    g.beginPath();
    g.arc(mid, SUN_Y, 0.016, 0, TAU);
    g.fill();
    e.light(mid, SUN_Y, 0.05, "#fff0d8", 0.7, "sun");
    e.at(mid, SUN_Y, "sun");
  });
  e.layer("moon", { box: [mid - 0.1, MOON_Y - 0.1, mid + 0.1, MOON_Y + 0.1] }, (g) => {
    g.fillStyle = "#eef1f5";
    g.beginPath();
    g.arc(mid, MOON_Y, 0.013, 0, TAU);
    g.fill();
    e.light(mid, MOON_Y, 0.05, "#c9d4e4", 0.7, "moon");
    e.at(mid, MOON_Y, "moon");
  });
}
// a point of a round sky: bearing (degrees from straight ahead, right +), height (degrees over the horizon)
function onRound(bearing, height, horizon, out = [0, 0]) {
  out[0] = Math.PI + (bearing * Math.PI) / 180;
  out[1] = horizon - Math.tan((anim.clamp(height, -10, 70) * Math.PI) / 180);
  return out;
}
const PAL = new Float64Array(16);
const AT = [0, 0];
const NAMES = ["tr", "tg", "tb", "mr", "mg", "mb", "lr", "lg", "lb", "gr", "gg", "gb", "sr", "sg", "sb"];
function body(e, o, name, where, u, height, y0) {
  const [x0, span] = extent(e, o);
  AT[0] = x0 + span / 2;
  AT[1] = y0;
  const r = where ? where(u, height, e.state, AT) : null;
  const x = r ? r[0] : AT[0];
  const y = r ? r[1] : AT[1];
  const l = e.layer(name);
  l.x = x - (x0 + span / 2);
  l.y = y - y0;
  e.uniform(`${name}_x`, x);
  e.uniform(`${name}_y`, y);
}
function skyMotion(e, o = {}) {
  const hour = e.state.hour ?? 0.25;
  const [x0, span] = extent(e, o);
  const P = paletteInto(hour, PAL);
  for (let k = 0; k < 15; k++) e.uniform(NAMES[k], P[k]);
  const day = P[15];
  const night = nightOf(day);
  const storm = anim.clamp(o.storm ? e.state[o.storm] ?? 0 : 0, 0, 1);
  const calm = 1 - 0.8 * storm;
  e.uniform("storm", storm);
  e.uniform("horizon", o.horizon ?? 0.5);
  e.uniform("x0", x0);
  e.uniform("span", span);
  e.uniform("all_round", o.round ? 1 : 0);
  e.uniform("day", day);
  e.uniform("night", night);
  // the sun: where the scene has it; how much of it is out, how low it is (its glow along the horizon, its halo)
  const su = sunU(hour);
  const sh = heightOf(su);
  const sunUp = (o.sun === null ? 0 : sunSeen(su)) * calm;
  body(e, o, "sun", o.sun, su, sh, SUN_Y);
  const low = (1 - anim.clamp(sh * 1.6, 0, 1)) * sunUp;
  e.uniform("sun_up", sunUp);
  e.uniform("sun_low", low);
  e.glow("sun", sunUp);
  // the moon, out in the night
  const mu = moonU(hour);
  const moonUp = (o.moon === null ? 0 : moonSeen(mu)) * night * calm;
  body(e, o, "moon", o.moon, mu, heightOf(mu), MOON_Y);
  e.uniform("moon_up", moonUp);
  e.glow("moon", moonUp);
}
// the uniforms the sky's shader has, as they start (tools/nebo-sky.js writes them into the scene's sky element)
const UNIFORMS = {
  tr: 0.42, tg: 0.5, tb: 0.61, mr: 0.65, mg: 0.71, mb: 0.77, lr: 0.89, lg: 0.85, lb: 0.83, gr: 0.96, gg: 0.87, gb: 0.8,
  sr: 0.31, sg: 0.39, sb: 0.47, horizon: 0.5, x0: -0.4, span: 2.58, all_round: 0, day: 0.55, night: 0, storm: 0,
  sun_x: 0.89, sun_y: 0.2, sun_up: 0, sun_low: 0, moon_x: 0.89, moon_y: 0.3, moon_up: 0,
};

return {
  mix, rgba, lin, palette, paletteInto, looks, sun, moon, shine, keys, follow, WARM, PALE, WHITE, SCARLET, SCARLET_LIGHT, SCARLET_DEEP,
  sail, glow, sky, skyMotion, onRound, UNIFORMS,
};
