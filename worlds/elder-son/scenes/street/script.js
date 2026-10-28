// “The Street” — the scene's mechanics: its film in beats (lib.js film(scene), played by the world's module beats: the
// game sets `beat`, the scene tells `beat:<name>`); the windows' light and figures eased by their keys; the doors turned
// by theirs; the late look by `hour`; the actions the mini-games ask for — the knock of “Windows” (`knock`), the
// buckets of “Buckets” (`buckets`); “Running”: Busygin along the street by `run` (where he is — `run_at`), looking
// back by `look_back`, the camera beside him.
const L = scene.lib;
scene.kit.beats.play(scene, L.film(scene));

// (a beat's cut brings the panes' own keys with it: lib.panes)
const PANES = L.PANES;
function pane(w, now) {
  const v = scene.get(w);
  const lit = v > 0 ? 1 : 0, who = v === 2 ? 1 : 0;
  if (now) {
    scene.set(`${w}_lit`, lit);
    scene.set(`${w}_who`, who);
  } else {
    scene.move(`${w}_lit`, lit, { over: lit ? 0.35 : 0.9, ease: 'out' });
    scene.move(`${w}_who`, who, { over: 0.5 });
  }
}
for (const w of PANES) scene.on('change', w, () => pane(w, false));

// the doors open inward: 0 shut (facing the street) … 1 open
const clamp01 = v => Math.max(0, Math.min(1, +v || 0));
function doors() {
  scene.set('door_f', 180 - 84 * clamp01(scene.get('door')));
  scene.set('mak_door_f', 180 - 80 * clamp01(scene.get('mak_door')));
  scene.set('nb_door_f', 180 - 80 * clamp01(scene.get('nb_door')));
}
for (const k of ['door', 'mak_door', 'nb_door']) {
  scene.on('change', k, doors);
  scene.on('move', k, doors);
}

function late() {
  scene.set('late', L.lateOf(scene.get('hour')));
}
scene.on('change', 'hour', late);
scene.on('move', 'hour', late);

for (const w of PANES) pane(w, true);
doors();
late();

// the mini-games' actions live till the next beat begins: a beat's start stops them (else a walk back to Silva would
// take Busygin out of the beat that follows)
const acts = { knock: null, buckets: null };
const stopActs = () => { for (const k in acts) if (acts[k]) { acts[k].cancel(); acts[k] = null; } };
// “Windows”: N — to window N and knock; 0 — back to Silva
scene.on('change', 'knock', n => {
  acts.knock = scene.sequence(async s => { await L.knock(s, n); }, { name: 'knock' });
});
// “Buckets”: fill — a full bucket at the barrel; throw — carried to the shed and thrown; none — put down
scene.on('change', 'buckets', v => {
  acts.buckets = scene.sequence(async s => { await L.buckets(s, v); }, { name: 'buckets' });
});

// the neighbours at the burning shed (`crowd`, set at the end of the beat `fire`): each throws, goes back for more and
// comes again, never in step, as long as the fire burns
const NB = [['neighbor1', L.SPOT.nb1, 0], ['neighbor2', L.SPOT.nb2, 1]];
const crowd = { tick: null, throws: {} };
function crowdOff() {
  if (crowd.tick) { crowd.tick.cancel(); crowd.tick = null; }
  for (const id in crowd.throws) if (crowd.throws[id]) crowd.throws[id].cancel();
  crowd.throws = {};
}
function crowdOn() {
  crowdOff();
  const from = scene.time;
  crowd.tick = scene.every(0.5, () => {
    if (!((+scene.get('fire') || 0) > 0.03)) return;
    for (const [id, at, k] of NB) {
      if (crowd.throws[id] || scene.time < from + 0.9 + 2.1 * k) continue;
      crowd.throws[id] = scene.sequence(async s => {
        try { await L.neighbourThrow(s, id, at, k); } finally { crowd.throws[id] = null; }
      }, { name: `throw_${id}` });
    }
  });
}
scene.on('change', 'crowd', v => (v ? crowdOn() : crowdOff()));
if (scene.get('crowd')) crowdOn();

// “Running”: the game moves `run` ahead of where he is (held) or to where he is (let go); he runs along the street at his
// own pace while `run` is ahead of him, and stops when it is not; `run_at` — where he is, ten times a second. Silva (if
// he came out) runs on ahead by himself at the first step and is gone up the path. `look_back` 1 — he stands turned to
// the kitchen window. The camera goes along beside him on the near side.
const R = { on: clamp01(scene.get('run')) > 0, walk: null };
function runOff() {
  if (R.walk) { const w = R.walk; R.walk = null; w.cancel(); }
  R.on = false;
}

// a beat begins: what the mini-games and the neighbours were doing stops
scene.on('change', 'beat', v => {
  if (!v) return;
  stopActs();
  crowdOff();
  runOff();
});
function runStep() {
  if (!R.on || !scene.get('busygin_here')) return;
  const a = +scene.get('busygin_a'), d = +scene.get('busygin_d');
  const at = Math.round(L.runAt(a, d) * 1000) / 1000;
  if (scene.get('run_at') !== at) scene.set('run_at', at);
  const bus = scene.person('busygin');
  if (clamp01(scene.get('run')) > at + 0.004 && !scene.get('look_back')) {
    if (!R.walk) {
      bus.look(null);
      const w = bus.walk(L.runWay(at), { gait: 'run' });
      R.walk = w;
      w.then(() => { if (R.walk === w) R.walk = null; });
    }
  } else if (R.walk) {
    const w = R.walk;
    R.walk = null;
    w.cancel();
  }
  const off = L.RUN_CAM.off0 + (L.RUN_CAM.off1 - L.RUN_CAM.off0) * Math.min(1, at / L.RUN_CAM.settle);
  if (Math.abs(+scene.get('camera_x') - (a + off)) > 0.02) scene.move('camera_x', a + off, { over: 0.5 });
}
scene.every(0.1, runStep);
scene.on('change', 'run', v => {
  if (R.on || !(clamp01(v) > 0)) return;
  R.on = true;
  if (scene.get('silva_here')) {
    const sil = scene.person('silva');
    sil.walk(L.runWay(L.runAt(+scene.get('silva_a'), +scene.get('silva_d'))), { gait: 'run' }).then(r => { if (r === 'done') sil.here(false); });
  }
});
scene.on('change', 'look_back', v => {
  if (!R.on) return;
  const bus = scene.person('busygin');
  if (v) {
    if (R.walk) { const w = R.walk; R.walk = null; w.cancel(); }
    const a = +scene.get('busygin_a'), d = +scene.get('busygin_d');
    bus.turn(Math.atan2(L.KITCHEN_WIN.a - a, L.KITCHEN_WIN.d - d) * 180 / Math.PI);
    bus.look('kitchen');
  } else bus.look(null);
});
