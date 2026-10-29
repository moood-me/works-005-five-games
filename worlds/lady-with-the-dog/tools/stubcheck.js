// Stub check of a scene folder: lib, every element painting/animate, script, film beats (from + run), showcase.
const fs = require('fs'), path = require('path');
const dir = process.argv[2];
const J = JSON.parse(fs.readFileSync(path.join(dir, 'scene.json'), 'utf8'));
const problems = [];
const bad = (where, v) => { const s = JSON.stringify(v); if (s && /NaN|null,null|undefined/.test(s) && /NaN/.test(s)) problems.push(`${where}: NaN in ${s.slice(0, 200)}`); };
const anim = { span: (v, a, b) => Math.max(0, Math.min(1, (v - a) / (b - a))), mix: (a, b, u) => a + (b - a) * u,
  ease: new Proxy({}, { get: () => u => u }), hash: (n, s) => ((Math.sin(n * 12.9898 + s * 78.233) * 43758.5453) % 1 + 1) % 1, clamp: (v, a, b) => Math.max(a, Math.min(b, v)) };
const any = () => new Proxy(function () {}, { get: (t, k) => k === 'then' ? undefined : any(), apply: () => any() });
const checkNum = (where, args) => { for (const a of args) if (typeof a === 'number' && !Number.isFinite(a)) problems.push(`${where}: non-finite arg`); };
const G = () => new Proxy({}, { get: (t, k) => {
  if (k in t) return t[k];
  if (typeof k !== 'string') return undefined;
  return (...a) => { checkNum('g.' + k, a); return { addColorStop() {} }; };
}, set: (t, k, v) => { t[k] = v; return true; } });
// the lib as the engine runs it: (anim, kit) — the world's own modules for the lib (a scene's lib may call kit.sky)
const real = require('./lib');
const lib = new Function('anim', 'kit', fs.readFileSync(path.join(dir, 'lib.js'), 'utf8'))(real.anim, { sky: real.load('sky') });
const state = { ...J.state };
const kit = { sky: real.load('sky'), closeups: { paint() {}, live() {} }, spitz: { paint() {}, live() {}, LEASH: '#a8322c' }, cast: { characters: {} },
  beats: null };
const mkE = (id) => {
  const layers = {};
  return { id, state, lib, kit, aspect: 16 / 9, anim, rnd: () => 0.5, time: 0,
    layer(name, opts, fn) { if (fn) fn(G()); return layers[name] ||= { alpha: 1, x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0 }; },
    at: (...a) => checkNum(id + '.at', a), light: (...a) => checkNum(id + '.light', a), glow() {}, uniform() {}, warn: m => problems.push(id + ' warn ' + m), point: () => [0, 0], where: () => [0, 0] };
};
const elDir = path.join(dir, 'elements');
for (const f of fs.existsSync(elDir) ? fs.readdirSync(elDir).filter(f => f.endsWith('.js')) : []) {
  const id = f.replace(/\.(animate\.)?js$/, '');
  if (!J.objects.find(o => o.id === id)) problems.push(`element file without object: ${f}`);
  try { new Function('g', 'e', 'anim', fs.readFileSync(path.join(elDir, f), 'utf8'))(G(), mkE(id), anim); }
  catch (err) { problems.push(`${f}: ${err.message}`); }
}
// the script with a stub scene; beats.play collects the film
let FILM = null;
const handlers = [];
const scene = { state, get: k => state[k], set: (k, v) => { bad('scene.set ' + k, v); state[k] = v; }, on: (...a) => handlers.push(a),
  every() {}, after() {}, tell() {}, warn: m => problems.push('warn ' + m), lib, anim, time: 0, random: () => 0.5,
  kit: { ...kit, beats: { play: (sc, film) => { FILM = film; }, showcase: (sc, film, order) => order.map(n => {
    if (!film[n]) problems.push('showcase: no beat ' + n); return { name: n, run: async () => {} }; }) } },
  person: () => any(), sequence() {}, shot: () => ({ ready: true, cut() {}, cancel() {} }), cut() {} };
try { new Function('scene', fs.readFileSync(path.join(dir, 'script.js'), 'utf8'))(scene); } catch (err) { problems.push('script: ' + err.message); }
for (const [type, key, fn] of handlers) if (typeof fn === 'function') { try { fn(state[key], null, key); } catch (err) { problems.push(`on ${key}: ${err.message}`); } }
try { const sc = new Function('scene', fs.readFileSync(path.join(dir, 'showcase.js'), 'utf8'))(scene); if (!Array.isArray(sc)) problems.push('showcase not array'); } catch (err) { problems.push('showcase: ' + err.message); }
const tells = {};
(async () => {
  if (!FILM) problems.push('no film played');
  for (const [name, b] of Object.entries(FILM || {})) {
    for (const a of [].concat(b.after ?? [])) if (!FILM[a]) problems.push(`${name}.after ${a} unknown`);
    let v = {};
    if (b.from) { try { v = b.from(); bad(name + '.from', v); Object.assign(state, v); } catch (err) { problems.push(`${name}.from: ${err.message}`); } }
    for (const k of Object.keys(v)) if (!(k in J.states) && !/^(fade|camera_|.*_(a|d|e|on|turn|do|look|reach|with|here|gait|mood|wear)$)/.test(k)) problems.push(`${name}.from key not in states: ${k}`);
    let t = 0; tells[name] = [];
    const person = id => new Proxy({}, { get: (o, k) => (...a) => { bad(`${name} ${id}.${String(k)}`, a); return Object.assign(Promise.resolve('done'), { ending: async () => {}, cancel() {} }); } });
    const s = { state, get: k => state[k], set: (k, v) => { bad(`${name} set ${k}`, v); state[k] = v; },
      move: (k, v, o) => { bad(`${name} move ${k}`, v); state[k] = v; t += (o?.over || 0) * 0; return Promise.resolve('done'); },
      wait: async x => { t += x; }, until: async f => { if (typeof f === 'function') f(); }, tell: x => tells[name].push(x),
      person, shot: v => { bad(name + ' shot', v); return { ready: true, cut() { Object.assign(state, v); }, cancel() {} }; },
      cut: v => Object.assign(state, v), all: (...a) => Promise.all(a), any: (...a) => Promise.race(a), sequence: async f => f(s),
      path: (keys, pts) => { bad(`${name} path ${keys}`, pts); const p = pts[pts.length - 1]; keys.forEach((k, i) => { state[k] = p[i]; }); return Promise.resolve('done'); },
      turn: (k, v) => { state[k] = v; return Promise.resolve('done'); }, after() {}, every() {} };
    try { await b.run(s); } catch (err) { problems.push(`${name}.run: ${err.message}`); }
    tells[name].t = t;
  }
  console.log(path.basename(dir), JSON.stringify(Object.fromEntries(Object.entries(tells).map(([k, v]) => [k, { tells: v, waits: Math.round(v.t * 10) / 10 }]))));
  console.log(problems.length ? problems.join('\n') : 'OK');
})();
