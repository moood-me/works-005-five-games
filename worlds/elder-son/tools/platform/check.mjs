// Runs every beat of “The Platform” in node with a stub director on a virtual clock, for several plays (who came, the
// late run, torn, vasya_end), and prints at each moment the scene tells: where the camera is, where each person here
// stands in the frame (x from the middle in frame heights: the 4:3 edges ±0.667, 16:9 ±0.889; y from the top 0…1; h —
// height in frame heights; f — how far they face away from the camera, degrees: 0 face on, 90 profile, 180 the back)
// and where the points the game takes are. Mistakes of code (a key misspelt, NaN, a walk to nowhere) show here.
//   node tools/platform/check.mjs [beat …]      (from the world's root)
import { readFileSync } from 'node:fs';

const DIR = 'scenes/platform';
const trains = new Function('anim', 'kit', readFileSync('modules/trains.js', 'utf8'))({}, {});
const L = new Function('anim', 'kit', readFileSync(`${DIR}/lib.js`, 'utf8'))({}, { trains });
const { G, EL } = L;
const spec = JSON.parse(readFileSync(`${DIR}/scene.json`, 'utf8'));
const TALL = { busygin: 1.83, silva: 1.76, sarafanov: 1.62, vasenka: 1.8, nina: 1.66 };
const PACE = { run: 3.6, null: 1.3 };
const DUR = { sit_down: 2.5, rise: 2.5, stand_bag: 2.5, wave: 3, give: 2, take: 2, cold: 0 };
const TRAIN_DOOR = (x, back) => [x + EL.doors(1)[back ? 0 : 1], G.SIDE];

// the height of the ground (or what people stand on) at a place
function floor(a, d) {
  const LD = G.LANDING;
  if (a > LD.a1 && a < G.FOOT.a && d > LD.d0 && d < LD.d1) return G.FOOT.low * (a - LD.a1) / (G.FOOT.a - LD.a1);
  if (a >= G.FOOT.a && d > LD.d0 - 1 && d < LD.d1 + 1) return Math.min(G.FOOT.low, G.ground(a, d));
  if (a >= G.PLAT.a0 && a <= G.PLAT.a1 && d >= G.PLAT.d0 && d <= G.EDGE) return 0.05;
  return G.ground(a, d);
}

function run(name, fn, init, party) {
  const st = { ...spec.state, ...party, ...init };
  let now = 0;
  const warn = [], queue = [], snaps = [];
  const at = t => new Promise(r => queue.push({ t, r }));
  const action = dur => { const p = at(now + dur); p.cancel = () => {}; return p; };
  const known = new Set([...Object.keys(spec.state), ...Object.keys(spec.states || {})]);
  const set = (k, v) => {
    if (typeof v === 'number' && !Number.isFinite(v)) warn.push(`NaN ${k}`);
    if (!known.has(k) && !k.startsWith('camera_') && !/_(here|do|look|reach|with|wear|gait|on|mood|turn|a|d)$/.test(k)) warn.push(`unknown key ${k}`);
    st[k] = v;
    if (k === 'train') st.train_x = G.trainX(v);
  };
  const s = {
    get: k => st[k], state: st, warn: t => warn.push(t),
    tell: t => snaps.push(snap(t)),
    set: (k, v, over) => { set(k, v); return action(over || 0); },
    move: (k, v, o = {}) => {
      const from = st[k], over = o.over || 0, t0 = now;
      if (k === 'train' && over) moving = { from, to: v, t0, over, ease: o.ease };
      else set(k, v);
      const p = action(over);
      p.then(() => { if (k === 'train') { moving = null; set(k, v); } });
      return p;
    },
    cut: v => { for (const [k, x] of Object.entries(v)) set(k, x); },
    shot: v => ({ cut: () => { for (const [k, x] of Object.entries(v)) set(k, x); }, cancel() {}, ready: true }),
    wait: d => at(now + d),
    until: f => (typeof f === "function" ? (f() ? Promise.resolve() : new Promise(r => { waiters.push({ f, r }); })) : f),
    all: (...a) => Promise.all(a.filter(Boolean)),
    person: id => person(id),
  };
  // (a sequence inside a beat: its own `s`, here the same stub)
  s.sequence = fn => fn(s);
  let moving = null;
  const waiters = [];
  const ease = (u, e) => (e === 'out' ? 1 - (1 - u) * (1 - u) : e === 'in' ? u * u : e === 'linear' ? u : u * u * (3 - 2 * u));
  function person(id) {
    return {
      walk(points) {
        if (st[`${id}_here`] === false) warn.push(`${id} walks while not here`);
        let p = [st[`${id}_a`], st[`${id}_d`]], len = 0;
        for (const q of points) { if (!q || q.some(v => !Number.isFinite(v))) warn.push(`${id} walk to ${q}`); len += Math.hypot(q[0] - p[0], q[1] - p[1]); p = q; }
        const end = points[points.length - 1], prev = points.length > 1 ? points[points.length - 2] : [st[`${id}_a`], st[`${id}_d`]];
        const a = action(len / (PACE[st[`${id}_gait`] ?? 'null'] ?? 1.3));
        a.then(() => { st[`${id}_a`] = end[0]; st[`${id}_d`] = end[1]; if (Math.hypot(end[0] - prev[0], end[1] - prev[1]) > 1e-3) st[`${id}_turn`] = L.brg(prev, end); });
        return a;
      },
      go(m, o = {}) { const p = o.to || o.from; if (p) { st[`${id}_a`] = p[0]; st[`${id}_d`] = p[1]; } if (o.turn != null) st[`${id}_turn`] = o.turn; st[`${id}_do`] = m; return action(DUR[m] ?? 2.5); },
      do(m) { const n = typeof m === 'string' ? m : m.motion; st[`${id}_do`] = m; if (typeof m === 'object' && m.loop) return action(0); return action(DUR[n] ?? 2); },
      turn(t) { st[`${id}_turn`] = t; return action(0.6); },
      look(v) { st[`${id}_look`] = v; }, reach(v) { st[`${id}_reach`] = v; }, with(v) { st[`${id}_with`] = v; },
      gait(v) { st[`${id}_gait`] = v; }, on(v) { st[`${id}_on`] = v; }, here(v) { st[`${id}_here`] = v; }, mood(v) { st[`${id}_mood`] = v; },
    };
  }
  function eye() {
    const cx = st.camera_x || 0, cz = st.camera_z || 0, h = st.camera_h || 0;
    if (st.camera_on === 'train') return [st.train_x + cx, G.SIDE + cz, -1.1 + 1.7 + h];
    return [cx, cz, floor(cx, cz) + 1.7 + h];
  }
  function proj(a, d, e) {
    const [ex, ez, ey] = eye(), yaw = (st.camera_yaw || 0) * Math.PI / 180;
    const fx = Math.sin(yaw), fz = Math.cos(yaw), rx = Math.cos(yaw), rz = -Math.sin(yaw);
    const ra = a - ex, rd = d - ez, depth = ra * fx + rd * fz, lat = ra * rx + rd * rz;
    return { depth, x: lat / depth, y: 0.5 - (e - ey) / depth };
  }
  const where = id => {
    if (st[`${id}_on`] === 'floor#vest') return [st.train_x + EL.doors(1)[1] - 0.4, G.SIDE + 0.6, 0.05];
    const a = st[`${id}_a`], d = st[`${id}_d`];
    return [a, d, floor(a, d)];
  };
  function snap(t) {
    const r = [];
    const [ex, ez] = eye();
    for (const id of L.IDS) {
      if (st[`${id}_here`] === false) continue;
      const [a, d, fl] = where(id);
      const sit = Array.isArray(st[`${id}_on`]) || (st[`${id}_do`] && st[`${id}_do`].loop && /seated/.test(st[`${id}_do`].motion));
      const tall = TALL[id], top = fl + (sit ? 1.27 * tall / 1.75 : tall), face = top - 0.12;
      const p = proj(a, d, face), f = proj(a, d, fl);
      const toCam = L.brg([a, d], [ex, ez]), off = Math.abs(((st[`${id}_turn`] ?? 0) - toCam + 540) % 360 - 180);
      r.push(`${id}(${st[`${id}_mood`]}) x${p.x.toFixed(2)} y${p.y.toFixed(2)} h${p.depth > 0 ? ((top - fl) / p.depth).toFixed(2) : 'BEHIND'} d${p.depth.toFixed(1)} f${Math.round(off)}`);
      void f;
    }
    const tx = st.train_x;
    const pts = { 'train#door': [...TRAIN_DOOR(tx), 1.35], 'train#tail': [tx - EL.half, G.SIDE, -1.1 + 1.85], far_window: [G.FAR_WINDOW[0], G.FAR_WINDOW[1], -8 + G.FAR_WINDOW[2] + 0.48], lamp2: [G.STAIR_LAMP[0] + 0.46, G.STAIR_LAMP[1], G.STAIR_LAMP[2]] };
    const ps = Object.entries(pts).map(([k, [a, d, e]]) => { const p = proj(a, d, e); return p.depth > 0 && Math.abs(p.x) < 1.2 ? `${k} x${p.x.toFixed(2)} y${p.y.toFixed(2)}` : null; }).filter(Boolean);
    return `  ${now.toFixed(1).padStart(5)}s ${t}\n     cam (${eye().map(v => v.toFixed(1)).join(', ')}) yaw ${(+st.camera_yaw).toFixed(0)} train ${(+st.train).toFixed(3)} doors ${st.doors}\n     ${r.join('\n     ')}\n     · ${ps.join(' · ')}`;
  }
  return (async () => {
    let done = false;
    Promise.resolve().then(() => fn(s)).then(() => { done = true; }, e => { done = true; warn.push(String(e.stack)); });
    for (let guard = 0; guard < 200000; guard++) {
      await new Promise(r => setImmediate(r));
      if (done) break;
      if (moving) set('train', moving.from + (moving.to - moving.from) * ease(Math.min(1, (now - moving.t0) / moving.over), moving.ease));
      for (const w of [...waiters]) if (w.f()) { waiters.splice(waiters.indexOf(w), 1); w.r(); }
      if (!queue.length) {
        if (moving || waiters.length) { now += 0.1; continue; }
        warn.push('stuck: nothing to wait for');
        break;
      }
      queue.sort((a, b) => a.t - b.t);
      const step = Math.min(queue[0].t, now + 0.1);
      if (step < queue[0].t) { now = step; continue; }
      const q = queue.shift();
      now = Math.max(now, q.t);
      q.r();
    }
    snaps.push(snap(`end of ${name}`));
    console.log(`── ${name} ≈ ${now.toFixed(1)} s${warn.length ? '  WARN: ' + [...new Set(warn)].join('; ') : ''}`);
    console.log(snaps.join('\n'));
    return { ...st };
  })();
}

const want = process.argv.slice(2);
const PLAYS = [
  { name: 'default', party: {} },
  { name: 'family, Nina knows, suitcase', party: { father_came: 1, nina_came: 1, vasya_came: 1, nina_is: 'knows', suitcase: 1, box_hand: 0, late_run: 0 } },
  { name: 'Nina alone, late run', party: { father_came: 0, nina_came: 1, vasya_came: 0, late_run: 1 } },
  { name: 'Vasenka alone, home', party: { father_came: 0, nina_came: 0, vasya_came: 1, vasya_end: 'home' } },
  { name: 'no one', party: { father_came: 0, nina_came: 0, vasya_came: 0, silva_door: 0 } },
];
const ORDER = [['gone', 'wave', 'stand'], ['bench', 'strap', 'bench_back'], ['last', 'stays'], ['last', 'boards'], ['glass', 'away'], ['dawn']];
for (const play of PLAYS) {
  if (play.name !== 'default' && !want.includes('all')) { if (!want.includes('plays')) continue; }
  console.log(`\n==== ${play.name}`);
  for (const chain of ORDER) {
    let last = null, st = null;
    for (const name of chain) {
      if (want.length && !want.includes(name) && !want.includes('all') && !want.includes('plays')) continue;
      if (play.name !== 'default' && !['last', 'stays', 'boards', 'glass', 'away', 'dawn'].includes(name)) continue;
      const get = k => (k in play.party ? play.party[k] : spec.state[k]);
      const FILM = L.film({ get, tell() {}, warn() {} });
      const b = FILM[name];
      const follows = last && [].concat(b.after ?? []).includes(last) && st;
      const init = follows ? st : b.from();
      st = await run(name, s => b.run(s), init, play.party);
      last = name;
    }
  }
}
