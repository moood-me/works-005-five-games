// Dry run of the minigames: a fake language (bespoke.minigame) that steps frames on a simulated clock, a fake scene
// (keys; the keys the scene answers with), and a bot player per minigame — each variant a way of playing it (good,
// lazy — hardly playing, the other path of a choice…), and each skipped. node bespoke/check/dry.mjs [name]. Printed: the
// result, the seconds it took, how it ended, the errors shown, the plate's phrases.
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';

const DIR = process.argv[2] && process.argv[2].includes('/') ? process.argv[2] : join(import.meta.dirname, '..', 'minigames');
// the minigames' texts as written (the source language): tr as the page gives it, without the translations
const fill = (t, p = {}) => t.replace(/\{(\w+)\}/g, (_, k) => String(p[k]));
globalThis.tr = Object.assign(fill, { n: (n, one, other, p) => fill(n === 1 ? one : other, { n, ...p }), c: (c, t, p) => fill(t, p), line: (who, t) => t, thought: (who, t) => t, lang: 'en' });
const DT = 1 / 30;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

function emitter() {
  const ls = {};
  return {
    on(e, f) { (ls[e] ??= new Set()).add(f); return () => ls[e].delete(f); },
    emit(e, d) { for (const f of [...(ls[e] ?? [])]) f(d); },
  };
}

function fakeLanguage(log) {
  const ev = emitter();
  const mg = { t: 0, gestures: [], marks: [], errors: [], ended: null, phrases: [], plate: null };
  let left = false;
  mg.on = ev.on;
  mg.plate = { set(o) { if (o.phrase) mg.phrases.push(o.phrase); for (const k of Object.keys(o)) if (!['phrase', 'fill', 'notches', 'glow', 'shade', 'ways', 'sample'].includes(k)) throw new Error('plate: ' + k); if (o.fill != null && !(o.fill >= 0 && o.fill <= 1.0001)) throw new Error('fill ' + o.fill); } };
  mg.mark = o => {
    if (!o.at) throw new Error('mark without at');
    const m = { o: { ...o }, removed: false, set(n) { Object.assign(m.o, n); }, remove() { m.removed = true; for (const gg of mg.gestures) if (gg.o.on === m) gg.removed = true; } };
    mg.marks.push(m);
    return m;
  };
  const gesture = (kind, o, state, extra = {}) => {
    const e = emitter();
    const { set: own, ...rest } = extra;
    const h = { kind, o: { ...o }, state, removed: false, on: e.on, emit: e.emit, set(n) { Object.assign(h.o, n); own?.(n); }, remove() { h.removed = true; }, ...rest };
    if (o.on && o.on.removed) throw new Error(kind + ' on a removed mark');
    mg.gestures.push(h);
    return h;
  };
  mg.press = o => gesture('press', o, { count: 0, open: false });
  mg.hold = o => { const h = gesture('hold', o, { held: false, fill: 0, moved: 0 }, { set(n) { if (n.fill != null) h.state.fill = n.fill; } }); return h; };
  mg.pull = o => { const h = gesture('pull', o, { held: false, u: 0, inTarget: false }, { set(n) { if (n.u != null) h.state.u = n.u; } }); return h; };
  mg.lead = o => gesture('lead', o, { held: false, knob: 0, arrow: 0, in: false, jerk: 0 });
  mg.rhythm = o => { const h = gesture('rhythm', o, { t: 0, k: -1, held: false }, { set(n) { if (n.times) { h.state.k = -1; } } }); return h; };
  mg.snap = () => {};
  mg.error = (reason, o = {}) => { if (!['miss', 'early', 'danger', 'off', 'behind', 'wrong', 'timing', 'often', 'against', 'jerk'].includes(reason)) throw new Error('reason ' + reason); mg.errors.push(reason); };
  mg.glow = () => {};
  mg.sceneTurn = () => {};
  mg.sound = role => { if (!['enter', 'tap', 'snap', 'halfway', 'miss', 'slip', 'fault', 'quarter', 'beat', 'tick', 'found', 'end'].includes(role)) throw new Error('sound ' + role); };
  mg.layer = role => { if (!['fill', 'motion', 'seek', 'zone', 'tension', 'time'].includes(role)) throw new Error('layer ' + role); return { set() {}, remove() {} }; };
  mg.show = o => ({ finished: Promise.resolve(true), dead: false });
  mg.end = async ({ as }) => { if (!['clean', 'flawed', 'neutral', 'loss'].includes(as)) throw new Error('end ' + as); mg.ended = as; leave(); };
  mg.leave = () => leave();
  const leave = () => { if (!left) { left = true; ev.emit('end'); } };
  // one frame: the gestures' physics, then the frame event
  mg.step = (dt) => {
    if (left) return;
    mg.t += dt;
    for (const h of mg.gestures) {
      if (h.removed) continue;
      const s = h.state, o = h.o;
      if (h.kind === 'hold') {
        if (s.held) s.fill = Math.min(1, s.fill + dt / (o.seconds ?? 1.2));
        else if ((o.drain ?? 0.5) > 0) s.fill = Math.max(0, s.fill - dt / (o.drain ?? 0.5));
      }
      if (h.kind === 'lead') {
        const f = s.held ? s.knob : 0;
        if (o.steer === 'rate') s.arrow = clamp(s.arrow + (0.8 * f + (o.push || 0)) * dt * 0.6, -1, 1);
        else if (s.held) s.arrow += (f - s.arrow) * Math.min(1, dt * 10);
        else if (o.release !== 'stay') s.arrow += (0 - s.arrow) * Math.min(1, dt * 4);
        const z = o.zone || { at: 0, width: 0.35 };
        s.in = Math.abs(s.arrow - z.at) <= z.width / 2;
      }
      if (h.kind === 'rhythm') {
        s.t += dt;
        const beatAt = k => (o.times ? (o.times[k] ?? Infinity) : (o.from ?? 60 / o.bpm) + k * 60 / o.bpm);
        while (beatAt(s.k + 1) <= s.t) { s.k++; h.emit('beat', { k: s.k }); }
        h.beatAt = beatAt;
      }
    }
    ev.emit('frame', { t: mg.t, dt });
    for (const h of mg.gestures) if (!h.removed) h.emit('frame', h.state);
  };
  // the player's hands
  mg.tap = h => {
    if (h.kind === 'press') { h.state.count++; h.emit('press', { count: h.state.count }); }
    if (h.kind === 'rhythm') {
      const o = h.o, s = h.state, beatAt = h.beatAt ?? (() => Infinity);
      let k = 0, best = Infinity;
      for (let i = 0; i < 400; i++) { const x = beatAt(i); if (x === Infinity) break; if (Math.abs(x - s.t) < best) { best = Math.abs(x - s.t); k = i; } }
      const off = s.t - beatAt(k);
      h.emit('down', {});
      h.emit('tap', { k, off, hit: Math.abs(off) <= (o.window ?? 0.15) });
    }
  };
  mg.skip = () => ev.emit('skip');
  mg.left = () => left;
  return mg;
}

function fakeScene(values) {
  return {
    get: k => values[k],
    set: (k, v) => { values[k] = v; },
  };
}

// bots: each frame, what the hand does (sim: {mg, values, t, variant})
const live = (mg, kind) => mg.gestures.filter(h => h.kind === kind && !h.removed);
const at = h => h.o.on?.o.at;
const BOTS = {
  'ten-minutes'(mg, v, t, variant, mem) {
    if (t - (mem.last ?? -1) < 0.45) return;
    mem.last = t;
    const ps = live(mg, 'press');
    const attic = ps.find(h => at(h) === 'attic'), rooms = ps.filter(h => at(h) !== 'attic');
    if (variant === 'gas' && attic && !mem.gas) { mem.gas = true; mg.tap(attic); mem.last = t + 3; return; }
    if (variant === 'lazy' && t > 6) return;
    if (rooms[0]) mg.tap(rooms[0]);
  },
  bargain(mg, v, t, variant, mem) {
    const h = live(mg, 'hold')[0]; if (!h) return;
    const target = variant === 'rich' ? 1 : (mem.n ?? 0) * 0.2 + 0.15;
    if (!h.state.held && t > (mem.next ?? 0)) { h.state.held = true; h.emit('down', {}); }
    if (h.state.held && h.state.fill >= target) { h.state.held = false; mem.n = (mem.n ?? 0) + 1; mem.next = t + 3.5; h.emit('up', {}); }
  },
  elephant(mg, v, t, variant, mem) {
    const r = live(mg, 'rhythm')[0], goad = live(mg, 'hold')[0], p = live(mg, 'press')[0];
    if (p) { mg.tap(p); }
    if (r && r.beatAt) { const k = r.state.k; if (k >= 0 && mem.k !== k && r.state.t - r.beatAt(k) < 0.05) { mem.k = k; if (variant !== 'lazy') mg.tap(r); } }
    if (goad) {
      const want = variant === 'goad' ? true : variant === 'smart' ? (t % 6) < 2.4 : false;
      if (want !== goad.state.held) { goad.state.held = want; goad.emit(want ? 'down' : 'up', {}); }
    }
  },
  'like-the-dead'(mg, v, t, variant) {
    const l = live(mg, 'lead')[0]; if (!l) return;
    l.state.held = variant !== 'lazy';
    l.state.knob = clamp(-3 * (l.state.arrow - (variant === 'rush' ? 0.9 : 0)), -1, 1);
  },
  dash(mg, v, t, variant) {
    const l = live(mg, 'lead')[0];
    if (l) { l.state.held = true; l.state.knob = variant === 'lazy' ? 0.9 : clamp(l.o.zone.at, -1, 1); }
    const p = live(mg, 'pull')[0];
    if (p) { p.state.held = true; p.state.u = Math.min(1, p.state.u + DT * 0.8); if (p.state.u >= 1 && !p.torn) { p.torn = true; p.emit('tear', {}); } }
  },
  'stay-awake'(mg, v, t, variant) {
    const l = live(mg, 'lead')[0]; if (!l) return;
    l.state.held = variant === 'lazy' ? (t % 5) < 1 : true;
    l.state.knob = clamp(-3 * l.state.arrow, -1, 1);
  },
  typhoon(mg, v, t, variant) {
    const l = live(mg, 'lead')[0]; if (!l) return;
    l.state.held = true; l.state.knob = variant === 'lazy' ? 0 : l.o.zone.at;
  },
  pyramid(mg, v, t, variant, mem) {
    const l = live(mg, 'lead')[0]; if (!l) return;
    const choosing = mg.phrases.some(p => p.includes('Fogg'));
    l.state.held = !(choosing && variant === 'drop');
    l.state.knob = clamp(-3 * l.state.arrow, -1, 1);
  },
  coupling(mg, v, t, variant, mem) {
    v.swing_at = (t / 1.3) % 1;
    const r = live(mg, 'rhythm')[0];
    if (r && r.o.times?.length) {
      const next = r.o.times.find(x => Math.abs(x - r.state.t) < DT / 2 + 0.001);
      if (next != null && mem.last !== next) { mem.last = next; mg.tap(r); }
    }
    if (variant === 'clumsy' && r && Math.random() < 0.02) mg.tap(r);
    const p = live(mg, 'pull')[0];
    if (p) { p.state.held = true; p.state.u = Math.min(1, p.state.u + DT); if (p.state.u >= 1 && !p.torn) { p.torn = true; p.emit('tear', {}); } }
  },
  sail(mg, v, t, variant) {
    const l = live(mg, 'lead')[0]; if (!l) return;
    l.state.held = true; l.state.knob = variant === 'lazy' ? 0.5 : l.o.zone.at;
  },
  boilers(mg, v, t, variant, mem) {
    const pulls = live(mg, 'pull');
    const p = pulls[0];
    const keep = live(mg, 'press').find(h => h.o.petals);
    if (keep && variant === 'spare') { keep.emit('choose', { id: 'spare' }); return; }
    if (p) {
      p.state.held = true; p.state.u = Math.min(1, p.state.u + DT * 1.5);
      if (p.state.u >= 1) { p.state.held = false; p.state.inTarget = true; p.emit('release', { u: 1, inTarget: true }); p.state.u = 0; p.state.inTarget = false; }
    }
  },
  cab(mg, v, t, variant, mem) {
    v.cab_at = Math.min(v.cab_to ?? 0, (v.cab_at ?? 0) + DT * 0.05);
    const r = live(mg, 'rhythm')[0];
    if (r && r.beatAt) { const k = r.state.k; if (k >= 0 && mem.k !== k) { mem.k = k; if (variant !== 'lazy' && (variant !== 'half' || k % 2)) mg.tap(r); } }
  },
};
// what the scene does on its own: someone walking toward the key the game sets
const SCENE = {
  'stay-awake'(v) { v.pp_walk_at = Math.min(v.pp_walk ?? 0, (v.pp_walk_at ?? 0) + DT * 0.03); },
};

async function play(name, variant, { skipAt = null, money = 20000 } = {}) {
  const mod = (await import(pathToFileURL(join(DIR, `${name}.js`)).href)).default;
  const values = { daze: 0.3, pp_walk_at: 0 }, scene = fakeScene(values);
  const mg = fakeLanguage();
  const acts = [];
  const abort = new AbortController();
  const g = {
    get: scene.get, set: scene.set,
    minigame(o) { if (!o.phrase) throw new Error('no phrase'); mg.phrases.push(o.phrase); mg.on('skip', () => abort.abort()); return mg; },
    told: (text, ms) => new Promise(ok => { const t1 = mg.t; const off = mg.on('frame', ({ t }) => { if (t - t1 >= 1) { off(); ok(true); } }); }),
    move: async (k, v) => { values[k] = v; },
    sound: new Proxy({}, { get: (_, k) => { throw new Error('g.sound.' + String(k)); } }),
  };
  const b = {
    act(kind, verb, key, value, { over } = {}) { if (kind !== 'state' || verb !== 'move') throw new Error('act'); values[key] = value; const a = { cancel() {} }; acts.push(a); return a; },
    minigame: { tricks: { teach: () => ({ remove() {} }) } },
  };
  for (const k of ['file', 'title', 'about', 'skipped', 'run']) if (!(k in mod)) throw new Error(`${name}: no ${k}`);
  if (mod.file !== name) throw new Error(`${name}: file ${mod.file}`);
  // g.play's race: the run, or skipped once the signal aborts
  const skipped = new Promise(ok => abort.signal.addEventListener('abort', () => { mg.leave(); ok(mod.skipped); }));
  let result = null, done = false, err = null;
  Promise.race([mod.run(g, b, { who: variant === 'fogg' ? 'fogg' : 'pp', money, alone: variant === 'alone', onRefuse() {} }, abort.signal), skipped])
    .then(r => { result = r; done = true; }, e => { err = e; done = true; });
  const mem = {};
  let t = 0;
  while (!done && t < 240) {
    await new Promise(r => setImmediate(r));
    if (done) break;
    if (skipAt != null && t >= skipAt) { mg.skip(); skipAt = null; continue; }
    BOTS[name](mg, values, t, variant, mem);
    SCENE[name]?.(values);
    mg.step(DT);
    t += DT;
  }
  for (let i = 0; i < 5 && !done; i++) await new Promise(r => setImmediate(r));
  if (err) throw err;
  if (!done) throw new Error(`${name}/${variant}: did not end in ${t.toFixed(0)} s`);
  return { result, t: +t.toFixed(1), end: mg.ended, errors: mg.errors.length, phrases: [...new Set(mg.phrases)] };
}

const CASES = {
  'ten-minutes': ['good', 'gas', 'lazy'], bargain: ['haggle', 'rich'], elephant: ['steady', 'smart', 'goad', 'lazy'],
  'like-the-dead': ['good', 'rush', 'lazy'], dash: ['good', 'lazy'], 'stay-awake': ['good', 'lazy'], typhoon: ['good', 'lazy'],
  pyramid: ['hold', 'drop'], coupling: ['good', 'clumsy'], sail: ['good', 'lazy', 'alone'], boilers: ['burn', 'spare', 'poor', 'fogg'],
  cab: ['good', 'half', 'lazy'],
};
const only = process.argv.find(a => CASES[a]);
for (const [name, variants] of Object.entries(CASES)) {
  if (only && name !== only) continue;
  for (const variant of variants) {
    try {
      const r = await play(name, variant, { money: variant === 'poor' ? 7000 : 20000 });
      console.log(`${name}/${variant}: ${JSON.stringify(r.result)} — ${r.t} s, ${r.end}, errors ${r.errors}`);
      if (variant === variants[0]) for (const p of r.phrases) console.log(`    «${p}»`);
    } catch (e) { console.log(`${name}/${variant}: ERROR ${e.stack}`); }
  }
  const s = await play(name, variants[0], { skipAt: 2 });
  console.log(`${name}/skip: ${JSON.stringify(s.result)}`);
}
