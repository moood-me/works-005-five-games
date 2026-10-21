// The scene's mechanics: the dusk going down by `hour`; the film's beats by `beat` (the world's `beats`: one at a time,
// the next one's opening made ready by `beat_next`); the club's door; and the two mini-games' keys —
// “Arm in Arm” (`down`, `catch`, `fall`: the pair down the iced path) and “Following” (`sar_go`, `follow`, `hold`,
// `duck`: the old man along the road, the two after him).
const L = scene.lib;
scene.kit.beats.play(scene, L.film(scene));

function dusk() {
  scene.set('dusk', L.duskOf(scene.get('hour')));
}
scene.on('change', 'hour', dusk);
scene.on('move', 'hour', dusk);
dusk();

function door() {
  scene.set('club_door_f', 180 - 84 * scene.get('club_door'));
}
scene.on('change', 'club_door', door);
scene.on('move', 'club_door', door);
door();

const num = k => Number(scene.get(k)) || 0;
const sar = () => scene.person('sarafanov'), bus = () => scene.person('busygin'), nina = () => scene.person('nina');

// where they are, in the game's units (ten times a second at the least, and at once)
scene.every(0.1, () => {
  scene.set('down_at', L.pathU(num('sarafanov_a'), num('sarafanov_d')));
  scene.set('sar_at', L.roadU(num('sarafanov_a')));
  scene.set('follow_at', L.roadU(num('busygin_a')));
});

// ── “Arm in Arm” ──
// They go while `down` is ahead of `down_at`, stand when it is not. On each iced stretch the scene stops them, the old man
// slips (`down:slip`) and holds that pose till the game's `catch` (the son's hands on him) or `fall` (he sits down in the
// snow; 0 — he gets up).
const strips = L.ICE.map(u => ({ u: u - 0.02, done: false }));
let stepping = false, slipping = false, sitting = false, stepSeq = null, riseSeq = null;
function descend() {
  // (at the gate, on the road, the path is done)
  if (slipping || num('sarafanov_d') < L.ROAD_D + 1.7) return;
  if (num('down') > num('down_at') + 0.002) {
    if (!stepping) step();
  } else if (stepping) stepSeq.cancel();
}
function step() {
  stepping = true;
  stepSeq = scene.sequence(async s => {
    try {
      const u0 = L.pathU(num('sarafanov_a'), num('sarafanov_d'));
      const next = strips.find(x => !x.done && x.u > u0 - 0.005);
      const u1 = next ? next.u : 1;
      const way = L.pairWay(u0, u1);
      const father = s.person('sarafanov'), son = s.person('busygin');
      father.gait('careful');
      son.gait('careful');
      father.look(null);
      son.look('sarafanov');
      son.reach({ r: 'sarafanov#shoulder_l' });
      const a = father.walk(way.map(p => p.sar)), b = son.walk(way.map(p => p.bus));
      await s.wait(0.1);
      const over = Math.max(1, a.remaining || a.duration || 1);
      s.path(L.CAMKEYS, way.map(p => L.downCam(p.sar)), { over, ease: 'linear' });
      await s.all(a, b);
      if (next) {
        next.done = true;
        slipping = true;
        father.mood('afraid');
        son.mood('afraid');
        const slip = father.do('falter');
        s.tell('down:slip');
        await slip;
      }
    } finally {
      stepping = false;
    }
  }, { name: 'down' });
}
scene.on('change', 'down', descend);
scene.on('change', 'down_at', descend);
// the game has answered the slip: the walk may go on again after it
scene.on('change', 'catch', v => {
  if (v === 1) {
    bus().reach({ r: 'sarafanov#shoulder_l', l: 'sarafanov#back' });
    sar().do('stand');
    sar().mood('surprised');
  } else {
    bus().reach({ r: 'sarafanov#shoulder_l' });
    sar().mood('smile');
    bus().mood('thinking');
    slipping = false;
    descend();
  }
});
scene.on('change', 'fall', v => {
  if (v === 1) {
    sitting = true;
    bus().reach(null);
    sar().do('fall_sit');
    sar().mood('surprised');
  } else if (sitting) {
    sitting = false;
    riseSeq = scene.sequence(async s => {
      await s.person('sarafanov').do('rise');
      s.person('sarafanov').do('stand');
      s.person('sarafanov').mood('smile');
      s.person('busygin').reach({ r: 'sarafanov#shoulder_l' });
      s.person('busygin').mood('thinking');
      slipping = false;
      descend();
    }, { name: 'rise' });
  }
});

// ── “Following” ──
// The old man goes by himself along the road (`sar_go` 1), stopping at 0.25, 0.5, 0.75 to look back (`sar_go:look`: his
// head begins to turn; 0.6 s on, if the two are moving (`hold`) he stands looking back two seconds more; `sar_go:on`: he
// goes on) and at the club's steps `sar_go:club`. The two go while `follow` is ahead of `follow_at`; `duck` — they crouch.
const LOOKS = [0.25, 0.5, 0.75];
let goSeq = null, trailSeq = null, pairSeq = null, crouched = false;
scene.on('change', 'sar_go', v => {
  if (v !== 1) {
    goSeq?.cancel();
    return;
  }
  goSeq = scene.sequence(async s => {
    const father = s.person('sarafanov');
    father.gait(null);
    father.mood('neutral');
    for (const stop of [...LOOKS.filter(u => u > L.roadU(num('sarafanov_a')) + 0.01), 1]) {
      const to = L.roadAt(stop);
      const w = father.walk([to]);
      await s.wait(0.1);
      const over = Math.max(1, w.remaining || w.duration || 1);
      const cam = L.trailCam(to[0]);
      s.path(L.CAMKEYS, [cam], { over, ease: 'linear' });
      await w;
      if (stop === 1) break;
      const look = father.do('look_back');
      s.tell('sar_go:look');
      await s.wait(0.6);
      if (num('hold') === 1) await s.wait(2);
      await look;
      s.tell('sar_go:on');
    }
    s.tell('sar_go:club');
  }, { name: 'sar_go' });
});

let trailing = false;
function trail() {
  if (num('duck') === 0 && num('follow') > num('follow_at') + 0.002) {
    if (!trailing) go();
  } else if (trailing) trailSeq.cancel();
}
function go() {
  trailing = true;
  trailSeq = scene.sequence(async s => {
    try {
      const end = L.roadAt(1);
      await s.all(s.person('busygin').walk([[end[0] - 0.8, end[1] + 0.4]]), s.person('nina').walk([[end[0] - 1.7, end[1] + 0.8]]));
    } finally {
      trailing = false;
    }
  }, { name: 'trail' });
}
scene.on('change', 'follow', trail);
scene.on('change', 'follow_at', trail);
scene.on('change', 'duck', v => {
  if (v === 1) {
    crouched = true;
    trailSeq?.cancel();
    nina().do('crouch');
    bus().do('crouch');
  } else if (crouched) {
    crouched = false;
    pairSeq = scene.sequence(async s => {
      await s.all(s.person('nina').do('crouch_rise'), s.person('busygin').do('crouch_rise'));
      s.person('nina').do('stand');
      s.person('busygin').do('stand');
    }, { name: 'rise_pair' });
  }
});

// A beat ends what the mini-games began in it: nothing of theirs goes on into the next (the cut sets the people and the
// keys itself)
scene.on('change', 'beat', () => {
  for (const seq of [stepSeq, riseSeq, goSeq, trailSeq, pairSeq]) seq?.cancel();
  slipping = false;
  sitting = false;
  crouched = false;
  for (const strip of strips) strip.done = false;
});
