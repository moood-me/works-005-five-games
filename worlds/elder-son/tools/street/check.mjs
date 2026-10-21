// Runs every beat of “The Street” (and the actions by key) in node with a stub director on a virtual clock, and prints at
// each moment the scene tells: where the camera is, where each person here stands in the frame (x from the middle in
// frame heights: the 4:3 edges ±0.667, 16:9 ±0.889; y from the top 0…1; size — height in frame heights) and where the
// points the game offers are. Mistakes of code (a key misspelt, NaN, a walk to nowhere) show here, not on the GPU.
//   node tools/street/check.mjs [beat …]      (from the world's root)
import { readFileSync } from 'node:fs';

const DIR = 'scenes/street';
const scenePlay = {};
const kit = { cast: { characters: new Proxy({}, { get: (_, k) => ({ kind: 'shapes', who: String(k) }) }) } };
const L = new Function('anim', 'kit', readFileSync(`${DIR}/lib.js`, 'utf8'))({}, kit);
const spec = JSON.parse(readFileSync(`${DIR}/scene.json`, 'utf8'));
const TALL = { busygin: 1.82, silva: 1.74, sarafanov: 1.6, vasenka: 1.8, nina: 1.66, kudimov: 1.8, makarskaya: 1.68, neighbor1: 1.74, neighbor2: 1.66 };
const PACE = { run: 3.6, carry_walk: 1.0, march_walk: 1.3, null: 1.3 };
const DUR = { knock: 3, look_watch: 3, point: 2, dip: 2.5, throw_bucket: 2, sit_down: 2.5, rise: 2.5, give: 2, take: 2, look_back: 3, put_down: 3 };
const relief = (a) => 3.4 * smooth(Math.max(0, Math.min(1, (-a - 38) / 12)));
function smooth(u) { return u * u * (3 - 2 * u); }

function run(name, fn, init, party = {}) {
  const st = { ...spec.state, ...party, ...init };
  let now = 0, warn = [];
  const queue = [];
  const at = (t) => new Promise(r => queue.push({ t, r }));
  const action = (dur) => { const p = at(now + dur); p.duration = dur; p.remaining = dur; p.cancel = () => {}; p.ending = () => at(now + Math.max(0, dur - 1)); return p; };
  const snaps = [];
  const known = new Set([...Object.keys(spec.state), ...Object.keys(spec.states || {})]);
  const set = (k, v) => {
    if (typeof v === 'number' && !Number.isFinite(v)) warn.push(`NaN ${k}`);
    if (!known.has(k) && !k.startsWith('camera_') && !/_(here|do|look|reach|with|wear|gait|on|mood|turn|a|d)$/.test(k)) warn.push(`unknown key ${k}`);
    st[k] = v;
  };
  const scene = {
    get: k => st[k], set, state: st,
    tell: t => { snaps.push(snap(t)); },
    warn: t => warn.push(t),
    sequence: (f) => { const p = Promise.resolve().then(() => f(s)); p.catch(e => warn.push(String(e.stack))); p.cancel = () => {}; return p; },
    every() {}, after() {}, on() {},
  };
  const s = {
    ...scene,
    get: k => st[k],
    set: (k, v, over) => { set(k, v); return action(over || 0); },
    move: (k, v, o = {}) => { set(k, v); return action(o.over || 0); },
    cut: v => { for (const [k, x] of Object.entries(v)) set(k, x); },
    shot: v => ({ cut: () => { for (const [k, x] of Object.entries(v)) set(k, x); }, cancel() {}, ready: true }),
    wait: d => at(now + d),
    until: f => (f() ? action(0) : (warn.push('until: never'), action(0))),
    all: (...a) => Promise.all(a.filter(Boolean)),
    person: id => person(id),
  };
  function person(id) {
    return {
      walk(points, o = {}) {
        if (st[`${id}_here`] === false) warn.push(`${id} walks while not here`);
        if (o.gait !== undefined) st[`${id}_gait`] = o.gait;
        let p = [st[`${id}_a`], st[`${id}_d`]], len = 0;
        for (const q of points) { if (!q || q.some(v => !Number.isFinite(v))) warn.push(`${id} walk to ${q}`); len += Math.hypot(q[0] - p[0], q[1] - p[1]); p = q; }
        const end = points[points.length - 1], prev = points.length > 1 ? points[points.length - 2] : [st[`${id}_a`], st[`${id}_d`]];
        const pace = PACE[st[`${id}_gait`] ?? 'null'] ?? 1.3;
        const a = action(len / pace);
        a.then(() => { st[`${id}_a`] = end[0]; st[`${id}_d`] = end[1]; if (Math.hypot(end[0] - prev[0], end[1] - prev[1]) > 1e-3) st[`${id}_turn`] = Math.atan2(end[0] - prev[0], end[1] - prev[1]) * 180 / Math.PI; });
        return a;
      },
      do(m, o = {}) { const name = typeof m === 'string' ? m : m.motion; st[`${id}_do`] = m; if ((o.loop || (typeof m === 'object' && m.loop)) || name === 'stand') return action(0); return action(DUR[name] ?? 2); },
      turn(t) { st[`${id}_turn`] = t; return action(0.6); },
      look(v) { st[`${id}_look`] = v; }, reach(v) { st[`${id}_reach`] = v; }, with(v) { st[`${id}_with`] = v; },
      wear(v) { st[`${id}_wear`] = v; }, gait(v) { st[`${id}_gait`] = v; }, on(v) { st[`${id}_on`] = v; },
      here(v) { st[`${id}_here`] = v; }, mood(v) { st[`${id}_mood`] = v; },
    };
  }
  function proj(a, d, e) {
    const cx = st.camera_x || 0, cz = st.camera_z || 0, yaw = (st.camera_yaw || 0) * Math.PI / 180;
    const eye = 1.7 + (st.camera_h || 0) + relief(cx);
    const fx = Math.sin(yaw), fz = Math.cos(yaw), rx = Math.cos(yaw), rz = -Math.sin(yaw);
    const ra = a - cx, rd = d - cz, depth = ra * fx + rd * fz, lat = ra * rx + rd * rz;
    return { depth, x: lat / depth, y: 0.5 - (e - eye) / depth };
  }
  const POINTS = {
    win1: L.winOf('win1'), win2: L.winOf('win2'), win3: L.winOf('win3'), win4: L.winOf('win4'), win5: L.winOf('win5'),
  };
  function snap(t) {
    const r = [];
    for (const id of L.PEOPLE) {
      if (st[`${id}_here`] === false) continue;
      const a = st[`${id}_a`], d = st[`${id}_d`];
      const inside = /^k\d$/.test(id);
      const onPorch = a > 24.3 && a < 26.1 && d > 10.9 && d < 12.6;
      const sit = st[`${id}_on`] || (st[`${id}_do`] && st[`${id}_do`].motion === 'seated');
      const tall = TALL[id] ?? 1.72, floor = (inside || onPorch ? 0.45 : 0) + relief(a);
      const top = floor + (sit ? 1.27 * tall / 1.75 : tall), face = top - 0.12;
      const p = proj(a, d, face), f = proj(a, d, floor);
      // f — how the face is turned from the camera: 0 full face, 90 profile, 180 the back
      const toCam = Math.atan2((st.camera_x || 0) - a, (st.camera_z || 0) - d) * 180 / Math.PI;
      const fc = Math.round(Math.abs(((((st[`${id}_turn`] ?? 0) - toCam) % 360) + 540) % 360 - 180));
      const out = p.depth <= 0 || Math.abs(p.x) > 0.667 ? ' OUT' : '';
      // the people in the kitchen: whether the eye sees their head through the window (else the wall hides them)
      let seen = '';
      if (inside) {
        const cx = st.camera_x || 0, cz = st.camera_z || 0, eye = 1.7 + (st.camera_h || 0) + relief(cx), W = L.KITCHEN_WIN;
        const k = (W.d - cz) / (d - cz), wa = cx + (a - cx) * k, we = eye + (face - eye) * k;
        seen = k > 0 && k < 1 && Math.abs(wa - W.a) < W.w / 2 && we > W.sill && we < W.sill + W.h ? ' window' : ' WALL';
      }
      r.push(`${id}${st[`${id}_mood`] ? '(' + st[`${id}_mood`] + ')' : ''} x${p.x.toFixed(2)} y${p.y.toFixed(2)} h${(top - floor) / p.depth > 0 ? ((top - floor) / p.depth).toFixed(2) : 'BEHIND'} d${p.depth.toFixed(1)} t${Math.round(st[`${id}_turn`] ?? 0)} f${fc}${out}${seen}`);
    }
    const pts = { kitchen: [22, 12, 1.6], mak_window: [32, 13, 1.7], barrel: [L.BARREL[0], L.BARREL[1], 0.6], shed: [L.SHED.a, L.SHED.d, 1.2], porch: [L.DOOR.a, 10.6, 0.5] };
    for (const [k, w] of Object.entries(POINTS)) pts[k] = [w.a, w.d, w.sill + w.h / 2];
    const ps = Object.entries(pts).map(([k, [a, d, e]]) => { const p = proj(a, d, e); return p.depth > 0 && Math.abs(p.x) < 0.9 ? `${k} x${p.x.toFixed(2)} y${p.y.toFixed(2)}` : null; }).filter(Boolean);
    return `  ${now.toFixed(1).padStart(5)}s ${t}\n     cam (${(+st.camera_x).toFixed(1)}, ${(+st.camera_z).toFixed(1)}) yaw ${st.camera_yaw} h ${st.camera_h}\n     ${r.join('\n     ')}\n     · ${ps.join(' · ')}`;
  }
  return (async () => {
    let done = false;
    const p = Promise.resolve().then(() => fn(s)).then(() => { done = true; }, e => { done = true; warn.push(String(e.stack)); });
    for (let guard = 0; guard < 100000; guard++) {
      await new Promise(r => setImmediate(r));
      if (done) break;
      if (!queue.length) { warn.push('stuck: nothing to wait for'); break; }
      queue.sort((a, b) => a.t - b.t);
      const q = queue.shift();
      now = Math.max(now, q.t);
      q.r();
    }
    await p;
    snaps.push(snap(`end of ${name}`));
    console.log(`── ${name} ≈ ${now.toFixed(1)} s${warn.length ? '  WARN: ' + [...new Set(warn)].join('; ') : ''}`);
    console.log(snaps.join('\n'));
    return st;
  })();
}

const want = process.argv.slice(2);
const party = { warm: 0.36, frost: 0.25, nina_is: 'knows', secret: 0, silva_door: 1, ending: 'late', nina_end: 'home', nina_for: 0, knocked: '13', shed_left: 1 };
const play = { get: k => (k in party ? party[k] : spec.state[k]) };
const FILM = L.film({ ...play, sequence: () => ({ cancel() {} }), tell() {} });
let last = null, st = null;
for (const [name, b] of Object.entries(FILM)) {
  if (want.length && !want.includes(name)) continue;
  const follows = last && [].concat(b.after ?? []).includes(last) && st;
  const init = follows ? st : b.from ? b.from() : {};
  st = await run(name, s => b.run(s), init, party);
  last = name;
}
if (!want.length || want.includes('knock')) {
  let s0 = L.END.knock_ready();
  for (const n of [1, 5, 0]) s0 = await run(`knock ${n}`, s => L.knock(s, n), s0, party);
}
if (!want.length || want.includes('buckets')) {
  let s0 = st;
  for (const v of ['fill', 'throw', 'fill', 'none']) s0 = await run(`buckets ${v}`, s => L.buckets(s, v), { ...(s0 || {}), ...{ busygin_here: true, busygin_a: L.SPOT.barrel[0], busygin_d: L.SPOT.barrel[1] } }, party);
}
