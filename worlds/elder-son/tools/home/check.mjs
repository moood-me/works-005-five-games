// Runs every beat of “The Sarafanovs' Home” in node with a stub director on a virtual clock, and prints at each moment
// the scene tells (and at each beat's end): where the camera is, where each person here stands in the frame (x from
// the middle in frame heights: the 4:3 edges ±0.667, 16:9 ±0.889; y from the top 0…1; h — their height in frame
// heights) and where the points the game takes are. Mistakes of code (a key misspelt, NaN, a walk to nowhere, a key
// not in states) show here, not on the GPU. The motions' lengths are the cast's; a walk goes at 1.25 m/s (tiptoe 0.5).
//   node tools/home/check.mjs [beat …] [--party '{"box_where": "busygin"}']      (from the world's root)
import { readFileSync } from 'node:fs';

const DIR = 'scenes/home';
const args = process.argv.slice(2), pi = args.indexOf('--party');
const over = pi >= 0 ? JSON.parse(args.splice(pi, 2)[1]) : {};
const want = args;
const cast = new Function('data', 'anim', 'kit', 'MooodShapes', readFileSync('modules/cast.js', 'utf8'))({ motions: {} }, {}, {}, { V: {} });
const L = new Function('anim', 'kit', readFileSync(`${DIR}/lib.js`, 'utf8'))({}, { cast });
const spec = JSON.parse(readFileSync(`${DIR}/scene.json`, 'utf8'));
const MOTIONS = JSON.parse(readFileSync('modules/cast.data.json', 'utf8')).motions;
const DUR = Object.fromEntries(Object.entries(MOTIONS).map(([k, m]) => [k, m.n / m.fps]));
const PACE = { tiptoe: 0.5 };
const PEOPLE_KEYS = /_(here|do|look|reach|with|wear|gait|on|mood|turn|a|d|still|steps)$/;
const known = new Set([...Object.keys(spec.states)]);
const ids = new Set(spec.objects.map(o => o.id));

function run(name, fn, init, party) {
  const st = { ...spec.state, ...party, ...init };
  let now = 0;
  const warn = [], queue = [], snaps = [];
  const at = t => new Promise(r => queue.push({ t, r }));
  const action = dur => { const p = at(now + dur); p.cancel = () => {}; p.ending = () => at(now + Math.max(0, dur - 1)); return p; };
  const set = (k, v) => {
    if (typeof v === 'number' && !Number.isFinite(v)) warn.push(`NaN ${k}`);
    if (!known.has(k) && !k.startsWith('camera_') && k !== 'fade' && !PEOPLE_KEYS.test(k)) warn.push(`key not in states: ${k}`);
    const d = spec.states[k];
    if (d && d.values && !d.values.includes(v)) warn.push(`${k} = ${JSON.stringify(v)} not among its values`);
    const ref = typeof v === 'string' ? v : null;
    if (/_(look|on)$/.test(k) && ref && !ids.has(ref.split('#')[0])) warn.push(`${k} → no element ${ref}`);
    if (/_reach$/.test(k) && v) for (const r of Object.values(v)) if (typeof r === 'string' && !ids.has(r.split('#')[0])) warn.push(`${k} → no element ${r}`);
    st[k] = v;
  };
  const s = {
    get: k => st[k], state: st,
    set: (k, v, over) => { set(k, v); return action(over || 0); },
    move: (k, v, o = {}) => { set(k, v); return action(o.over || 0); },
    cut: v => { for (const [k, x] of Object.entries(v)) set(k, x); },
    shot: v => ({ cut: () => { for (const [k, x] of Object.entries(v)) set(k, x); }, cancel() {}, ready: true }),
    tell: t => snaps.push(snap(t)),
    warn: t => warn.push(t),
    wait: d => at(now + d),
    until: f => at(now),
    all: (...a) => Promise.all(a.filter(Boolean)),
    person: id => person(id),
  };
  function person(id) {
    if (!ids.has(id)) warn.push(`no person ${id}`);
    return {
      walk(points, o = {}) {
        if (st[`${id}_here`] === false) warn.push(`${id} walks while not here`);
        if (o.gait !== undefined) st[`${id}_gait`] = o.gait;
        let p = [st[`${id}_a`], st[`${id}_d`]], len = 0, prev = p;
        for (const q of points) { if (!q || q.some(v => !Number.isFinite(v))) warn.push(`${id} walk to ${q}`); prev = p; len += Math.hypot(q[0] - p[0], q[1] - p[1]); p = q; }
        const end = points[points.length - 1];
        const a = action(len / (PACE[o.gait ?? st[`${id}_gait`]] ?? 1.25));
        a.then(() => { st[`${id}_a`] = end[0]; st[`${id}_d`] = end[1]; if (Math.hypot(end[0] - prev[0], end[1] - prev[1]) > 1e-3) st[`${id}_turn`] = Math.atan2(end[0] - prev[0], end[1] - prev[1]) * 180 / Math.PI; });
        return a;
      },
      go(m, o = {}) {
        if (!(m in DUR)) warn.push(`no motion ${m}`);
        const t = o.to || o.from; st[`${id}_a`] = t[0]; st[`${id}_d`] = t[1]; if (o.turn != null) st[`${id}_turn`] = o.turn;
        if (m === 'rise') { const r = (st[`${id}_turn`] || 0) * Math.PI / 180; st[`${id}_a`] += 0.6 * Math.sin(r); st[`${id}_d`] += 0.6 * Math.cos(r); }
        st[`${id}_do`] = m; return action(DUR[m] ?? 2);
      },
      do(m, o = {}) {
        const name = typeof m === 'string' ? m : m.motion;
        if (name !== 'stand' && !(name in DUR)) warn.push(`no motion ${name}`);
        st[`${id}_do`] = o.loop ? { motion: name, loop: true } : name;
        if (name === 'rise') { const r = (st[`${id}_turn`] || 0) * Math.PI / 180; st[`${id}_a`] += 0.6 * Math.sin(r); st[`${id}_d`] += 0.6 * Math.cos(r); }
        return action(o.loop || name === 'stand' ? 0 : DUR[name] ?? 2);
      },
      turn(t) { st[`${id}_turn`] = t; return action(0.6); },
      look(v) { set(`${id}_look`, v); }, reach(v) { set(`${id}_reach`, v); }, with(v) { st[`${id}_with`] = v; },
      wear(v) { st[`${id}_wear`] = v; }, gait(v) { st[`${id}_gait`] = v; }, on(v) { set(`${id}_on`, v); },
      here(v) { st[`${id}_here`] = v; }, mood(v) { st[`${id}_mood`] = v; },
    };
  }
  function proj(a, d, e) {
    const cx = st.camera_x || 0, cz = st.camera_z || 0, yaw = (st.camera_yaw || 0) * Math.PI / 180;
    const eye = 1.7 + (st.camera_h || 0);
    const fx = Math.sin(yaw), fz = Math.cos(yaw), rx = Math.cos(yaw), rz = -Math.sin(yaw);
    const ra = a - cx, rd = d - cz, depth = ra * fx + rd * fz, lat = ra * rx + rd * rz;
    return { depth, x: lat / depth, y: 0.5 - (e - eye) / depth + (st.camera_look || 0) };
  }
  const f2 = v => (v >= 0 ? ' ' : '') + v.toFixed(2);
  function snap(t) {
    const r = [];
    for (const id of L.PEOPLE) {
      if (st[`${id}_here`] === false) continue;
      const a = st[`${id}_a`], d = st[`${id}_d`], tall = L.HEIGHT[id], doing = st[`${id}_do`], m = doing && (doing.motion || doing);
      const lying = /^(lie|lie_side|sit_up)$/.test(m), sitting = m === 'seated' || m === 'sit_down' || m === 'turn_glass';
      const floor = lying ? (st[`${id}_on`] === 'sofa_top#bed' ? L.SOFA.top : L.COT.top) : 0;
      const head = lying ? floor + 0.15 : sitting ? L.SEAT_H + 0.78 * tall / 1.75 : tall - 0.1;
      const p = proj(a, d, head), f = proj(a, d, floor);
      r.push(`${id.padEnd(9)}${(st[`${id}_mood`] || '').padEnd(9)} x${f2(p.x)} y${f2(p.y)} h${p.depth > 0 ? ((head + 0.1 - floor) / p.depth).toFixed(2) : 'BEHIND'} d${p.depth.toFixed(1)} ${m}`);
    }
    const T = L.TOP, P = {
      'table#box': [st.box_at === 'near' ? L.ON.near : L.ON.box, T], 'table#glass': [L.ON.glass_b, T], 'clock#face': [[0.03, L.CLOCK.z], L.CLOCK.face],
      'window#pane': [[L.WINDOW.x + L.PANE[0], 3.985], L.WINDOW.sill - L.PANE[1]], 'cot_chair#coat': [L.COT_CHAIR, 0.72], cot: [[L.COT.x + L.COT.w / 2, 1.55], 0.46],
      door: [[3.2, 0], 1.0], stove: [[0.75, 1.6], 0.54],
    };
    const ps = Object.entries(P).map(([k, [[x, z], e]]) => { const p = proj(L.A(x), z, e); return p.depth > 0 && Math.abs(p.x) < 1.2 ? `${k} x${f2(p.x)} y${f2(p.y)}` : null; }).filter(Boolean);
    return `  ${now.toFixed(1).padStart(5)}s ${t}\n     cam (${(st.camera_x + 2).toFixed(2)}, ${(+st.camera_z).toFixed(2)}, ${(1.7 + st.camera_h).toFixed(2)}) yaw ${st.camera_yaw}${st.camera_look ? ` look ${st.camera_look}` : ''}\n     ${r.join('\n     ')}\n     · ${ps.join(' · ')}`;
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
    return { st, seconds: now };
  })();
}

const party = { ...Object.fromEntries(['warm', 'frost', 'box_where', 'vasenka_by', 'silva_door', 'father_came', 'nina_came', 'vasya_came', 'nina_end',
  'nina_for', 'vasya_end', 'hurt', 'heard'].map(k => [k, spec.state[k]])), ...over };
const scene = { get: k => (k in party ? party[k] : spec.state[k]), kit: { cast }, warn: t => console.log('WARN', t) };
const FILM = L.film(scene);
let last = null, st = null;
const lengths = {};
for (const [name, b] of Object.entries(FILM)) {
  if (want.length && !want.includes(name)) continue;
  const follows = last && [].concat(b.after ?? []).includes(last) && st;
  const init = follows ? st : b.from ? b.from() : {};
  ({ st, seconds: lengths[name] } = await run(name, s => b.run(s), init, party));
  last = name;
}
console.log(JSON.stringify(Object.fromEntries(Object.entries(lengths).map(([k, v]) => [k, Math.round(v)]))));
