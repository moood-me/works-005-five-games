// What the world's generators share: the world's modules loaded as the engine loads them (with the engine's `anim`), a
// scene's files read and written as the repository keeps them.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
// `anim` — the engine's own (rpg moood/web/scene/kit.js, copied as it is: a generator computes what the scene will)
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const mix = (a, b, u) => a + (b - a) * u;
// u (0…1) of the way between a and b that v is, clamped
const span = (v, a, b) => clamp((v - a) / (b - a));
// easing: how the 0…1 of a movement's time becomes the 0…1 of its way
const ease = {
  linear: u => u,
  smooth: u => (1 - Math.cos(Math.PI * u)) / 2,              // starts and stops gently (the default)
  in: u => u * u * u,                                         // gathers speed, ends at full speed
  out: u => 1 - Math.pow(1 - u, 3),                           // sets off at once, settles
  inOut: u => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2),
  back: u => { const c = 1.70158; return 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2); }, // a little past, and back
  spring: u => (u >= 1 ? 1 : 1 - Math.exp(-6 * u) * Math.cos(9 * u)),               // overshoots, wobbles, rests
  anticipate: u => { const c = 1.4; return u * u * ((c + 1) * u - c); },              // back a little first, then go
};
const easeOf = e => (typeof e === 'function' ? e : ease[e] || ease.smooth);
// angles (radians): the short way round from a to b
const turn = (a, b, u) => { let d = ((b - a) % (2 * Math.PI) + 3 * Math.PI) % (2 * Math.PI) - Math.PI; return a + d * u; };
// steady random: the same n gives the same 0…1, however many other calls came before
const hash = (n, seed = 0) => { let h = Math.imul((n * 374761393 + seed * 668265263) | 0, 1274126177); h = (h ^ (h >>> 13)) >>> 0; h = Math.imul(h, 1103515245) >>> 0; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
// smooth noise along x (−1…1): for breathing, swaying, drifting that never repeats
const noise = (x, seed = 0) => { const i = Math.floor(x), f = x - i, s = f * f * (3 - 2 * f); return mix(hash(i, seed) * 2 - 1, hash(i + 1, seed) * 2 - 1, s); };
// a few octaves of it, slower ones stronger
const drift = (x, seed = 0) => noise(x, seed) * 0.6 + noise(x * 2.1 + 7, seed + 1) * 0.3 + noise(x * 4.3 + 13, seed + 2) * 0.1;
// a two-bone joint: from the root (x0, y0) to the end (x1, y1) with bones a and b; bend 1 or −1 —
// which side the joint goes. Returns the joint [x, y] (the end out of reach: the limb straight toward it)
const joint = (x0, y0, x1, y1, a, b, bend = 1) => {
  const dx = x1 - x0, dy = y1 - y0, d = Math.min(Math.hypot(dx, dy), a + b - 1e-6), ang = Math.atan2(dy, dx);
  const k = clamp((a * a + d * d - b * b) / (2 * a * d || 1), -1, 1), off = Math.acos(k) * bend;
  return [x0 + Math.cos(ang + off) * a, y0 + Math.sin(ang + off) * a];
};
// poses mixed: pose objects (numbers, or nested objects/arrays of them) weighted [[pose, weight], …]
const blend = list => {
  const total = list.reduce((s, [, w]) => s + w, 0) || 1, [first] = list[0];
  const go = (sel) => {
    const v0 = sel(first);
    if (typeof v0 === 'number') return list.reduce((s, [p, w]) => s + (sel(p) ?? v0) * w, 0) / total;
    if (Array.isArray(v0)) return v0.map((_, i) => go(p => sel(p)?.[i]));
    if (v0 && typeof v0 === 'object') return Object.fromEntries(Object.keys(v0).map(k => [k, go(p => sel(p)?.[k])]));
    return v0;
  };
  return go(p => p);
};
const anim = Object.freeze({ clamp, mix, span, ease, easeOf, turn, hash, noise, drift, joint, blend });
const kit = {};
function load(name) {
  if (!kit[name]) kit[name] = new Function('anim', 'data', fs.readFileSync(path.join(ROOT, 'modules', `${name}.js`), 'utf8'))(anim, {});
  return kit[name];
}
const dir = folder => path.join(ROOT, 'scenes', folder);
const readScene = folder => JSON.parse(fs.readFileSync(path.join(dir(folder), 'scene.json'), 'utf8'));
const writeScene = (folder, spec) => fs.writeFileSync(path.join(dir(folder), 'scene.json'), `${JSON.stringify(spec, null, 2)}\n`);
// an element's file (elements/<id>.<ext>): written, or removed when there is nothing to write
function writeElement(folder, id, ext, text) {
  const file = path.join(dir(folder), 'elements', `${id}.${ext}`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (text == null) fs.rmSync(file, { force: true });
  else fs.writeFileSync(file, text.endsWith('\n') ? text : `${text}\n`);
}
const wgsl = name => fs.readFileSync(path.join(__dirname, `${name}.wgsl`), 'utf8');

module.exports = { anim, load, readScene, writeScene, writeElement, wgsl };
