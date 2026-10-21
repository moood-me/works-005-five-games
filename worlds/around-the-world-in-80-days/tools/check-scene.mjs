// Dry run of an engine-3 scene folder in node: a mock canvas and a mock `e`, every element's code painted for the
// given states, every animate run a few frames, the script and every beat's `from` and `run` played on a mock director.
// Catches syntax errors, NaN, unknown keys, missing person ids.  node check.mjs <scene folder> [stateJSON ...]
import fs from 'node:fs';
import path from 'node:path';
const dir = process.argv[2];
const world = path.resolve(dir, '../..');
const spec = JSON.parse(fs.readFileSync(path.join(dir, 'scene.json'), 'utf8'));
const read = f => (fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null);
const errs = [], warns = [];
const err = (w, x) => errs.push(`${w}: ${x?.stack?.split('\n').slice(0, 3).join(' | ') ?? x}`);
// ── anim ──
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const ease = { smooth: u => u * u * (3 - 2 * u), linear: u => u, in: u => u * u, out: u => 1 - (1 - u) * (1 - u), inOut: u => (u < 0.5 ? 2 * u * u : 1 - 2 * (1 - u) * (1 - u)), back: u => u, spring: u => u, anticipate: u => u };
const hash = (n, s = 0) => { const x = Math.sin(n * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); };
const noise = (x, s = 0) => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return (hash(i, s) * (1 - u) + hash(i + 1, s) * u) * 2 - 1; };
const anim = { ease, easeOf: n => ease[n] ?? ease.smooth, clamp, mix: (a, b, u) => a + (b - a) * u, span: (v, a, b) => clamp((v - a) / (b - a), 0, 1), turn: (a, b, u) => a + (b - a) * u, hash, noise, drift: noise, joint: () => [0, 0], blend: l => l[0][0] };
const fn = (args, body, name) => { try { return new Function(...args, body); } catch (x) { err(`syntax ${name}`, x); return null; } };
// ── modules ──
const kit = { bend: () => () => [0, 0, 0], revolve: () => () => [0, 0, 0], extrude: () => () => [0, 0, 0], loft: () => () => [0, 0, 0], lump: () => () => [0, 0, 0] };
for (const m of spec.modules ?? []) {
  if (m === 'cast') { kit.cast = { characters: new Proxy({}, { get: () => ({ kind: 'shapes' }) }), wears: new Proxy({}, { get: () => ({}) }) }; continue; }
  const f = fn(['anim', 'kit', 'data'], read(path.join(world, 'modules', m + '.js')), 'module ' + m);
  try { kit[m] = f(anim, kit, {}); } catch (x) { err('module ' + m, x); }
}
let lib = {};
const libSrc = read(path.join(dir, 'lib.js'));
if (libSrc) { const f = fn(['anim', 'kit'], libSrc, 'lib'); try { lib = f(anim, kit); } catch (x) { err('lib', x); } }
// ── a canvas that takes everything and checks numbers ──
function canvas(where) {
  const bad = (k, a) => { for (const v of a) if (typeof v === 'number' && !Number.isFinite(v)) { err(`NaN ${where}.${k}`, JSON.stringify(a.map(v => (typeof v === 'number' ? v : typeof v)))); break; } };
  let calls = 0;
  const grad = { addColorStop: (o, c) => { if (!(o >= 0 && o <= 1)) err(`gradient stop ${where}`, o); if (typeof c !== 'string' || /NaN|undefined/.test(c)) err(`colour ${where}`, c); } };
  const g = new Proxy({}, {
    get(t, k) {
      if (k === '__calls') return calls;
      if (k in t) return t[k];
      if (k === 'createLinearGradient' || k === 'createRadialGradient') return (...a) => { calls++; bad(k, a); return grad; };
      if (k === 'measureText') return s => ({ width: String(s).length * 0.5 });
      if (k === 'getTransform') return () => new DOMMatrixLike();
      if (k === 'canvas') return { width: 100, height: 100 };
      return (...a) => { calls++; bad(k, a); };
    },
    set(t, k, v) { if (typeof v === 'string' && /NaN|undefined/.test(v)) err(`style ${where}.${String(k)}`, v); if (typeof v === 'number' && !Number.isFinite(v)) err(`NaN ${where}.${String(k)}`, v); t[k] = v; return true; },
  });
  return g;
}
class DOMMatrixLike { constructor() { Object.assign(this, { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }); } }
globalThis.Path2D = class { constructor() { return new Proxy({}, { get: () => () => {} }); } };
globalThis.DOMMatrix = DOMMatrixLike;
globalThis.OffscreenCanvas = class { constructor() { this.width = 1; this.height = 1; } getContext() { return canvas('offscreen'); } };
// ── states ──
const stateOf = over => ({ ...(spec.state ?? {}), ...over });
const known = new Set([...Object.keys(spec.states ?? {}), ...Object.keys(spec.state ?? {})]);
const engineKey = k => /^camera_|^fade|^beat$|^beat_next$/.test(k) || /_(a|d|e|do|turn|look|reach|with|wear|gait|steps|on|here|still|mood|talk)$/.test(k);
const ids = new Set(spec.objects.map(o => o.id));
const people = new Set(spec.objects.filter(o => o.person).map(o => o.id));
function paint(o, state) {
  const src = read(path.join(dir, 'elements', o.id + '.js'));
  if (!src) return;
  const f = fn(['g', 'e'], src, 'code ' + o.id);
  if (!f) return;
  const g = canvas(o.id);
  const points = {}, lights = [];
  const e = { state: new Proxy(state, { get: (t, k) => { if (typeof k === 'string' && !(k in t) && !known.has(k)) warns.push(`${o.id} reads unknown key ${k}`); return t[k]; } }),
    id: o.id, rnd: () => 0.5, aspect: 16 / 9, area: o.box ?? [-1, -1, 1, 0], spot: { across: 0, distance: 10, elevation: 0, ground: 0 }, ground: () => 0,
    light: (...a) => { lights.push(a); if (a.slice(0, 5).some(v => typeof v === 'number' && !Number.isFinite(v))) err(`NaN light ${o.id}`, a); },
    at: (x, y, n) => { if (!Number.isFinite(x) || !Number.isFinite(y)) err(`NaN at ${o.id}#${n}`, [x, y]); points[n ?? ''] = [x, y]; },
    form: () => {}, debug: () => {}, warn: w => warns.push(`${o.id}: ${w}`), anim, kit, lib,
    layer: (n, opts, p) => { p(canvas(o.id + ':' + n)); }, part: (dx, dz, p) => { p(canvas(o.id + ':part')); } };
  try { f(g, e); } catch (x) { err('paint ' + o.id, x); }
  if (g.__calls > 6000) warns.push(`${o.id}: ${g.__calls} canvas calls`);
  return points;
}
function animate(o, state) {
  const src = read(path.join(dir, 'elements', o.id + '.animate.js'));
  if (!src) return;
  const f = fn(['e'], src, 'animate ' + o.id);
  if (!f) return;
  const layers = {}, mem = {};
  const layer = n => (layers[n] ??= new Proxy({}, { set(t, k, v) { if (!Number.isFinite(v)) err(`NaN layer ${o.id}:${n}.${String(k)}`, v); t[k] = v; return true; } }));
  for (let i = 0; i < 4; i++) {
    const e = { t: i * 0.37 + 3, dt: 1 / 60, cut: 5, id: o.id, aspect: 16 / 9, state, was: k => state[k], speed: () => 0, layer, mem,
      uniform: (n, v) => { if (!Number.isFinite(v)) err(`NaN uniform ${o.id}.${n}`, v); }, glow: (n, k) => { if (!Number.isFinite(k)) err(`NaN glow ${o.id}.${n}`, k); },
      at: () => {}, point: () => [0, 0], where: () => ({ across: 0, distance: 0, elevation: 0 }), spot: { across: 0, distance: 10, elevation: 0 }, burst: () => {}, anim, kit, lib, debug: () => {}, warn: w => warns.push(w) };
    try { f(e); } catch (x) { err('animate ' + o.id, x); break; }
  }
}
// ── the director, mocked ──
function director(state) {
  const handlers = [];
  const act = (what) => { const p = Promise.resolve('done'); p.ending = () => Promise.resolve(); p.cancel = () => {}; p.pause = () => {}; p.resume = () => {}; p.finish = () => {}; p.then2 = 0; p.what = what; return p; };
  const chk = (k, v) => { if (!known.has(k) && !engineKey(k)) warns.push(`set unknown key ${k}`); if (typeof v === 'number' && !Number.isFinite(v)) err('NaN set ' + k, v); const m = /^(.*)_(a|d|do|turn|look|reach|with|wear|gait|on|here|mood)$/.exec(k); if (m && !people.has(m[1]) && !known.has(k)) warns.push(`person key for no person ${k}`); if (k === 'camera_target' && v && !ids.has(String(v).split('#')[0])) warns.push('camera_target to unknown ' + v); };
  const setv = (k, v) => { chk(k, v); state[k] = v; };
  const person = id => { if (!people.has(id)) err('no person', id); const p = {}; for (const v of ['walk', 'go', 'do', 'turn', 'say']) p[v] = (...a) => { if (v === 'walk') for (const q of a[0]) if (!q.every(Number.isFinite)) err('NaN walk ' + id, a[0]); if (v === 'turn' && !Number.isFinite(a[0])) err('NaN turn ' + id, a[0]); return act(v); }; for (const v of ['look', 'reach', 'with', 'wear', 'gait', 'on', 'here', 'still', 'mood', 'talk']) p[v] = x => { setv(`${id}_${v}`, x); return act(v); }; p.startOf = () => ({ across: 0, distance: 0, turn: 0 }); return p; };
  const scene = {
    state, get: k => state[k], time: 0, was: k => state[k], ground: () => 0, random: () => 0.5, anim, kit, lib,
    tell: t => told.push(t), warn: w => warns.push(w), person,
    set: (k, v) => { setv(k, v); return act('set'); }, move: (k, v) => { setv(k, v); return act('move'); }, turn: (k, v) => { setv(k, v); return act('turn'); },
    path: (ks, pts) => { pts.at(-1).forEach((v, i) => setv(ks[i], v)); return act('path'); },
    camera: o => { if (o.target && !ids.has(String(o.target).split('#')[0])) warns.push('camera target unknown ' + o.target); return act('camera'); },
    light: id => ({ fade: () => act('fade') }), say: () => act('say'),
    shot: v => { for (const [k, x] of Object.entries(v)) chk(k, x); return { cut: () => Object.assign(state, v), cancel: () => {}, ready: true }; },
    cut: v => { for (const [k, x] of Object.entries(v)) chk(k, x); Object.assign(state, v); return act('cut'); },
    sequence: (f) => { const s = Object.create(scene); s.wait = () => Promise.resolve(); s.until = () => Promise.resolve(); s.event = () => Promise.resolve({}); s.all = (...a) => Promise.all(a); s.any = (...a) => Promise.race(a); s.sequence = g => scene.sequence(g); const p = (async () => { try { await f(s); } catch (x) { err('sequence', x); } })(); seqs.push(p); return { cancel: () => {}, pause: () => {} }; },
    on: (t, a, b) => handlers.push([t, a, b]), after: () => {}, every: () => {}, signal: () => {}, cutAt: 0,
  };
  return { scene, handlers };
}
const told = [], seqs = [];
// ── run ──
const overs = process.argv.slice(3).map(s => JSON.parse(s));
if (!overs.length) overs.push({});
for (const over of overs) {
  const st = stateOf(over);
  for (const o of spec.objects) { if (o.on && !ids.has(o.on)) err('on unknown', o.id + ' on ' + o.on); paint(o, st); animate(o, st); }
}
for (const k of Object.keys(spec.state ?? {})) if (!spec.states?.[k] && !engineKey(k)) warns.push('state key without states: ' + k);
// script + film
const scriptSrc = read(path.join(dir, 'script.js'));
if (scriptSrc) {
  const st = stateOf({ beat: null });
  const { scene, handlers } = director(st);
  const f = fn(['scene'], scriptSrc, 'script');
  try { f?.(scene); } catch (x) { err('script', x); }
  // fire every change handler once with the current value
  for (const [t, a, b] of handlers) if (t === 'change' && typeof a === 'string') { try { b(st[a], st[a], a); } catch (x) { err('change ' + a, x); } }
  const film = lib.film ? lib.film(scene) : null;
  if (film) for (const [name, b] of Object.entries(film)) {
    const s2 = stateOf({});
    const d = director(s2);
    try { if (b.from) { const v = b.from(); for (const [k, x] of Object.entries(v)) { if (!known.has(k) && !engineKey(k)) warns.push(`${name}.from unknown key ${k}`); if (typeof x === 'number' && !Number.isFinite(x)) err(`NaN ${name}.from.${k}`, x); } Object.assign(s2, v); for (const o of spec.objects) { paint(o, s2); animate(o, s2); } } } catch (x) { err('from ' + name, x); }
    const ff = lib.film(d.scene)[name];
    d.scene.sequence(async s => { await ff.run(s); });
  }
}
const showSrc = read(path.join(dir, 'showcase.js'));
if (showSrc) { const { scene } = director(stateOf({})); try { const beats = fn(['scene'], showSrc, 'showcase')(scene); if (!Array.isArray(beats)) err('showcase', 'not an array'); } catch (x) { err('showcase', x); } }
await Promise.all(seqs);
await new Promise(r => setTimeout(r, 50));
console.log('ERRORS', errs.length); for (const x of [...new Set(errs)].slice(0, 60)) console.log(' ', x);
console.log('WARNINGS', new Set(warns).size); for (const x of [...new Set(warns)].slice(0, 60)) console.log(' ', x);
console.log('TOLD', [...new Set(told)].join(' '));
