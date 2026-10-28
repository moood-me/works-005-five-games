// Runs every beat of a scene played by the world's `beats` (its lib.js `film`) in node with a stub director on a virtual
// clock, and prints when each moment is told and how long each beat is, with where the people here stand in the frame at
// those moments (x from the middle in frame heights: the 4:3 edges ±0.667; h — their height in frame heights; the
// camera `roam` by camera_x/z/yaw/h, `picture` taken as an eye at its camera_x/z looking straight on; the ground's
// height by the lib's `height` if it has one). Mistakes of code (a key not in states, NaN, a walk to nowhere, a beat
// that never ends) show here, not on the GPU. A walk goes at 1.25 m/s; a motion lasts as long as its recording.
//   node tools/beatscheck.mjs <folder> [beat …] [--party '{"snowy": 1}']      (from the world's root)
import { readFileSync } from 'node:fs';

const args = process.argv.slice(2), pi = args.indexOf('--party');
const over = pi >= 0 ? JSON.parse(args.splice(pi, 2)[1]) : {};
const [folder, ...want] = args;
const DIR = `scenes/${folder}`;
const L = new Function('anim', 'kit', readFileSync(`${DIR}/lib.js`, 'utf8'))({}, {});
const spec = JSON.parse(readFileSync(`${DIR}/scene.json`, 'utf8'));
const MOTIONS = JSON.parse(readFileSync('modules/cast.data.json', 'utf8')).motions;
const DUR = Object.fromEntries(Object.entries(MOTIONS).map(([k, m]) => [k, m.n / m.fps]));
const PEOPLE_KEYS = /_(here|do|look|reach|with|wear|gait|on|mood|turn|a|d)$/;
const known = new Set(Object.keys(spec.states || {}));
const ids = new Set(spec.objects.map(o => o.id));
const people = spec.objects.filter(o => o.person).map(o => o.id);
const roam = spec.camera && spec.camera.mode === 'roam';
const ground = (a, d) => (L.height ? L.height(a, d) : 0);

function run(name, fn, init, party) {
  const st = { ...spec.state, ...party, ...init };
  let now = 0;
  const warn = [], queue = [], snaps = [];
  const at = t => new Promise(r => queue.push({ t, r }));
  const action = dur => { const p = at(now + dur); p.duration = dur; p.remaining = dur; p.cancel = () => {}; return p; };
  const set = (k, v) => {
    if (typeof v === 'number' && !Number.isFinite(v)) warn.push(`NaN ${k}`);
    if (!known.has(k) && !k.startsWith('camera_') && k !== 'fade' && !PEOPLE_KEYS.test(k)) warn.push(`key not in states: ${k}`);
    const ref = typeof v === 'string' ? v : null;
    if (/_look$/.test(k) && ref && !ids.has(ref.split('#')[0])) warn.push(`${k} → no element ${ref}`);
    st[k] = v;
  };
  const s = {
    get: k => st[k], state: st,
    set: (k, v, o) => { set(k, v); return action(o || 0); },
    move: (k, v, o = {}) => { set(k, v); return action(o.over || 0); },
    cut: v => { for (const [k, x] of Object.entries(v)) set(k, x); },
    shot: v => ({ cut: () => { for (const [k, x] of Object.entries(v)) set(k, x); }, cancel() {}, ready: true }),
    tell: t => snaps.push(snap(t)),
    warn: t => warn.push(t),
    wait: d => at(now + d),
    until: f => (f() ? action(0) : (warn.push('until: never true here'), action(0))),
    sequence: f => { const p = Promise.resolve().then(() => f(s)); p.cancel = () => {}; return p; },
    all: (...a) => Promise.all(a.filter(Boolean)),
    person: id => person(id),
  };
  function person(id) {
    if (!ids.has(id)) warn.push(`no person ${id}`);
    return {
      walk(points) {
        if (st[`${id}_here`] === false) warn.push(`${id} walks while not here`);
        let p = [st[`${id}_a`], st[`${id}_d`]], prev = p, len = 0;
        for (const q of points) { if (!q || q.some(v => !Number.isFinite(v))) warn.push(`${id} walk to ${q}`); prev = p; len += Math.hypot(q[0] - p[0], q[1] - p[1]); p = q; }
        const end = points[points.length - 1];
        let cancelled = false;
        const a = action(len / 1.25);
        a.cancel = () => { cancelled = true; };
        a.then(() => { if (cancelled) return; st[`${id}_a`] = end[0]; st[`${id}_d`] = end[1]; if (Math.hypot(end[0] - prev[0], end[1] - prev[1]) > 1e-3) st[`${id}_turn`] = Math.atan2(end[0] - prev[0], end[1] - prev[1]) * 180 / Math.PI; });
        return a;
      },
      do(m, o = {}) {
        const n = typeof m === 'string' ? m : m.motion;
        if (n !== 'stand' && !(n in DUR)) warn.push(`no motion ${n}`);
        st[`${id}_do`] = m;
        return action(o.loop || (typeof m === 'object' && m.loop) || n === 'stand' ? 0 : DUR[n] ?? 2);
      },
      turn(t) { st[`${id}_turn`] = t; return action(0.6); },
      look(v) { set(`${id}_look`, v); }, reach(v) { st[`${id}_reach`] = v; }, with(v) { st[`${id}_with`] = v; },
      wear(v) { st[`${id}_wear`] = v; }, gait(v) { st[`${id}_gait`] = v; }, on(v) { st[`${id}_on`] = v; },
      here(v) { st[`${id}_here`] = v; }, mood(v) { st[`${id}_mood`] = v; },
    };
  }
  const f2 = v => (v >= 0 ? ' ' : '') + v.toFixed(2);
  function snap(t) {
    const cx = st.camera_x || 0, cz = st.camera_z || 0, yaw = roam ? ((st.camera_yaw || 0) * Math.PI) / 180 : 0;
    const fx = Math.sin(yaw), fz = Math.cos(yaw), rx = Math.cos(yaw), rz = -Math.sin(yaw);
    const r = people.filter(id => st[`${id}_here`] !== false).map(id => {
      const ra = st[`${id}_a`] - cx, rd = st[`${id}_d`] - cz, depth = ra * fx + rd * fz, lat = ra * rx + rd * rz;
      const face = (((st[`${id}_turn`] || 0) - (Math.atan2(-ra, -rd) * 180) / Math.PI) % 360 + 540) % 360 - 180;
      return `${id.padEnd(10)}${String(st[`${id}_mood`] || '').padEnd(10)} x${depth > 0 ? f2(lat / depth) : ' BEHIND'} h${depth > 0 ? (1.7 / depth).toFixed(2) : '-'} d${depth.toFixed(1)} face ${Math.round(face)}° ${typeof st[`${id}_do`] === 'object' ? st[`${id}_do`].motion : st[`${id}_do`]}`;
    });
    return `  ${now.toFixed(1).padStart(5)}s ${t}  cam (${(+cx).toFixed(1)}, ${(+cz).toFixed(1)}${roam ? `, yaw ${st.camera_yaw}, ground ${ground(cx, cz).toFixed(1)}` : ''})\n     ${r.join('\n     ')}`;
  }
  return (async () => {
    let done = false;
    Promise.resolve().then(() => fn(s)).then(() => { done = true; }, e => { done = true; warn.push(String(e.stack)); });
    for (let guard = 0; guard < 100000; guard++) {
      await new Promise(r => setImmediate(r));
      if (done) break;
      if (!queue.length) { warn.push('stuck: nothing to wait for'); break; }
      queue.sort((a, b) => a.t - b.t);
      const q = queue.shift();
      now = Math.max(now, q.t);
      q.r();
    }
    snaps.push(snap(`end of ${name}`));
    console.log(`── ${name} ≈ ${now.toFixed(1)} s${warn.length ? '  WARN: ' + [...new Set(warn)].join('; ') : ''}`);
    console.log(snaps.join('\n'));
    return { st, seconds: now, warned: warn.length > 0 };
  })();
}

const party = { ...over };
const scene = { get: k => (k in party ? party[k] : spec.state[k]), warn: t => console.log('WARN', t) };
const FILM = L.film(scene);
let last = null, st = null, bad = 0;
const lengths = {};
for (const [name, b] of Object.entries(FILM)) {
  if (want.length && !want.includes(name)) continue;
  const follows = last && [].concat(b.after ?? []).includes(last) && st;
  const init = follows ? st : b.from ? b.from() : {};
  let warned;
  ({ st, seconds: lengths[name], warned } = await run(name, s => b.run(s), init, party));
  if (warned) bad++;
  last = name;
}
console.log(JSON.stringify(Object.fromEntries(Object.entries(lengths).map(([k, v]) => [k, Math.round(v)]))));
process.exit(bad ? 1 : 0);
