// The club's plan and its film — what the elements, the script and the showcase share. The room is painted in its own
// colours, as by day; the scene's light (ambient, its look for `day`, the lamps and the fire) makes the night.
// Metres: `across` to the right of the start's line of sight, `d` ahead of it.
const plan = {
  // the window wall onto Pall Mall, and what is in it
  wall: 18,
  windows: [-5.2, -11.2, -17.2, -23.2],
  win: { w: 3.6, sill: 0.6, top: 10.4, deep: 0.7 },
  door: { across: 0, w: 2.6, h: 4.8 },
  // the street outside lies a little lower than the club's floor
  street: -0.5,
  // gas lamps on the pavement: [across, d]
  lamps: [
    [-7.6, 23],
    [-14.6, 26],
    [-23.5, 24],
  ],
  // the partition with the clock and the fireplace, and its free end
  near: 8,
  corner: 0.95,
  thick: 0.45,
  fireplace: 4.2,
  // the fireplace's opening cut through the partition: its width and height; its back, how far behind the wall's face
  hearth: { w: 1.25, h: 0.95, deep: 0.55 },
  clock: 2.35,
  // the whist table (where its near legs stand) and its four seats — where the players' hips are, [across, d]: a
  // quarter of a metre from its edge, their hands on the baize
  table: { across: -1.6, d: 6.55 },
  seats: { far: [-1.6, 7.79], near: [-1.6, 6.21], left: [-2.39, 7.0], right: [-0.81, 7.0] },
  // Stuart's chair, a little apart, behind the table on its right, turned to it
  reader: [-0.15, 8.5],
  // the hat stand by the door, its top hook
  stand: [-2.6, 17.0],
};

// A leaf of the double door, painted from its hinge (side 1: the left leaf, x 0 → its width; −1: the right
// one, x −width → 0): walnut, two plain panels, a hair short of the middle and of the floor — the crack the
// hall's light comes through when it is shut.
function leaf(g, side) {
  const w = plan.door.w / 2 - 0.015;
  const h = plan.door.h;
  g.save();
  g.scale(side, 1);
  g.fillStyle = '#3a2a22';
  g.fillRect(0, -h, w, h - 0.03);
  g.strokeStyle = 'rgba(0,0,0,0.25)';
  g.lineWidth = 0.02;
  g.strokeRect(w * 0.2, -h + 0.3, w * 0.6, h * 0.45 - 0.3);
  g.strokeRect(w * 0.2, -h * 0.5, w * 0.6, h * 0.5 - 0.35);
  g.restore();
}

// A window's reveal, the wall's depth (plan.win.deep) round its opening: the jamb (a card turned to the
// room's middle, x 0 → the depth, running away from you), the sill (a plane seen from above) and the soffit
// (from below), their own shades of the plaster.
function reveal(g, part) {
  const W = plan.win;
  if (part === 'jamb') {
    g.fillStyle = '#423e46';
    g.fillRect(0, -W.top, W.deep, W.top - W.sill);
  } else {
    g.fillStyle = part === 'sill' ? '#423e46' : '#2a272e';
    g.fillRect(-W.w / 2, -W.deep / 2, W.w, W.deep);
  }
}

// A chair seen from before (s 1: behind a table, facing us; its back behind the sitter) or from behind (−1: before it, its
// back to us, before them): the seat and its legs at the seat's place [dx, dz] (metres from the painting element's
// anchor), the back at its own depth — parts of element e
function chair(e, [dx, dz], s) {
  const dark = '#2c211b';
  e.part(dx, dz, g => {
    g.fillStyle = dark;
    g.fillRect(-0.23, -0.48, 0.46, 0.05);
    for (const x of [-0.21, 0.18]) g.fillRect(x, -0.46, 0.035, 0.46);
  }, [-0.3, -0.52, 0.3, 0.02]);
  e.part(dx, dz + s * 0.22, g => {
    g.fillStyle = dark;
    for (const x of [-0.22, 0.185]) g.fillRect(x, -1.0, 0.035, 1.0);
    g.fillRect(-0.22, -1.0, 0.44, 0.09);
    g.fillRect(-0.22, -0.72, 0.44, 0.035);
  }, [-0.3, -1.05, 0.3, 0.02]);
}

// The crowd outside, filling in as `crowd_outside` grows: its people and lanterns in GROUPS, each a layer of the crowd
// (crowd.js), shown as far as the key has come to it (crowd.animate.js)
const CROWD = { people: 160, lanterns: 26, groups: 6 };
const crowdGroup = (i, n) => Math.floor((i * CROWD.groups) / n);

// ── the film, in beats (the world's module beats; notes.md lists them) ──
// Built for the scene that plays it (the script's, the showcase's): a beat's `from` asks the people where a motion done
// once ends (startOf).
const MEN = ['stuart', 'flanagan', 'fallentin', 'sullivan', 'ralph'];
// (degrees: 0 away from us, 90 to the right, 180 toward us — the way from one place to another)
const toward = ([a, d], [a2, d2]) => ((Math.atan2(a2 - a, d2 - d) * 180) / Math.PI + 360) % 360;
const loop = (motion, from = 0) => ({ motion, loop: true, from });
const S = plan.seats, READER = plan.reader;
// the table's middle, the baize; the clock's face; the door (its middle, in the wall), the hall behind it
const BAIZE = [-1.6, 7.0, 0.78], DIAL = [plan.clock, 8, 4.4], DOOR = [0, 18, 1.6], HALL = [0, 19.6];
// where Ralph stands warming himself, by the fire; Fogg's hat on its stand, and where he stands to take it
const BY_FIRE = [3.3, 6.9], HAT = 'hatstand#hat', BY_STAND = [-2.25, 16.65];
// the half-circle before the clock where the five wait on the evening of the 21st, its middle Stuart's
const ROUND = { sullivan: [0.7, 6.8], flanagan: [1.5, 6.15], stuart: [2.4, 5.9], fallentin: [3.3, 6.15], ralph: [4.35, 6.95] };
const TO_CLOCK = id => toward(ROUND[id], [plan.clock, 8]);
// where Fogg stops, coming in (in the gap by the end of the clock's wall, where they see him); Aouda, Passepartout behind;
// where each waits in the hall, out of sight, till the door opens
const IN = { fogg: [-0.25, 10.6], aouda: [0.45, 11.5], passepartout: [-0.95, 11.7], fix: [0.3, 12.9] };
const OUT = { fogg: HALL, aouda: [0.5, 19.9], passepartout: [-0.5, 20.0], porter: [0.3, 19.6], fix: [0.1, 20.2] };
// Fogg's armchair by the fire (turned to it, its back to us): where he sits, facing the fire
const ARMCHAIR = [1.68, 5.48], TO_FIRE = 45;
// (Stuart's right hand holds the watch before his chest, where his eyes go)
const WATCH = (() => { const [a, d] = ROUND.stuart, t = (TO_CLOCK('stuart') * Math.PI) / 180; return [a + 0.28 * Math.sin(t) - 0.06, d + 0.28 * Math.cos(t), 1.22]; })();

// the camera, two ways. A shot on someone — the operator frames them (`on`: who, how big — their height in frame
// heights —, where their head goes in the frame; `more`: the film's own step on top, camera_x…). A shot of the room — the
// scene's own picture moved by keys (`view`: camera_x metres right, camera_z ahead, camera_h up, camera_look screen
// heights the gaze is lowered): the door, the table with everyone at it.
const CAM = { camera_glide: 0, camera_target: null, camera_shot: null, camera_frame: null, camera_x: 0, camera_z: 0, camera_h: 0, camera_look: 0 };
const view = (x = 0, z = 0, h = 0, look = 0) => ({ ...CAM, camera_x: x, camera_z: z, camera_h: h, camera_look: look });
const on = (target, shot, frame, more) => ({ ...CAM, camera_target: target, camera_shot: shot, camera_frame: frame, ...more });
const WIDE = view();
// the shots: on Stuart, the five's backs and the dial over them; the door far off, and the hat stand by it; the whist
// table, on Fogg across it; Fogg at his cards, from a little above; Fogg come in, by the end of the clock's wall; Stuart
// close, turning; Fogg in his armchair by the fire
const ON_STUART = on('stuart', 0.4, [0.45, 0.55]), AT_DOOR = view(-0.3, 9.6, -0.1, 0), AT_STAND = view(-1.3, 9.6, -0.15, 0.01);
const WHIST_TABLE = on('fogg', 0.55, [0.4, 0.32]), FOGG_CLOSE = on('fogg', 0.7, [0.45, 0.32], { camera_x: -0.4, camera_h: 1.3 });
const FOGG_IN = on('fogg', 0.7, [0.45, 0.42]), STUART_CLOSE = on('stuart', 0.6, [0.5, 0.35]), FRIDAY_FOGG = on('fogg', 0.5, [0.45, 0.45]);
const same = (a, b) => (Array.isArray(a) && Array.isArray(b) ? a.length === b.length && a.every((v, i) => v === b[i]) : (a ?? 0) === (b ?? 0));
const isView = (s, v) => Object.keys(CAM).every(k => k === 'camera_glide' || same(s.get(k), v[k]));
// the operator taken to a shot of its own over `glide` seconds (an action: done once it has settled)
const frame = (s, v, glide) => s.camera({ target: v.camera_target, shot: v.camera_shot, frame: v.camera_frame, glide });

// ── the scene's state before anything happens: the 2nd of October, the evening's whist ──
const person = (id, a, d, turn, more = {}) => ({
  [`${id}_a`]: a, [`${id}_d`]: d, [`${id}_turn`]: turn, [`${id}_do`]: 'stand', [`${id}_look`]: null, [`${id}_reach`]: null,
  [`${id}_with`]: null, [`${id}_wear`]: null, [`${id}_gait`]: null, [`${id}_here`]: true,
  ...Object.fromEntries(Object.entries(more).map(([k, v]) => [`${id}_${k}`, v])),
});
const WHIST = {
  minute: 1150, second: 0, day: 1, fire: 0.75, door: 0, crowd_outside: 0, fogg_hat: 1, cards_down: 0, chair_back: 0, ...WIDE,
  gentlemen: 5, fogg_present: 1, fogg_seated: 0,
  ...person('fogg', ...S.far, 180, { do: loop('cards'), look: BAIZE, with: ['cards'], gait: 'fogg_walk' }),
  ...person('flanagan', ...S.near, 0, { do: loop('cards', 2.6), with: ['cards'] }),
  ...person('fallentin', ...S.left, 90, { do: loop('cards', 5.1), with: ['cards'] }),
  ...person('sullivan', ...S.right, 270, { do: loop('cards', 7.4), with: ['cards'] }),
  ...person('stuart', ...READER, 180, { do: loop('paper_seated'), with: ['newspaper'] }),
  ...person('ralph', ...BY_FIRE, 250, { do: loop('hands_behind'), look: BAIZE }),
  ...person('aouda', ...OUT.aouda, 180, { here: false }),
  ...person('passepartout', ...OUT.passepartout, 180, { here: false }),
  ...person('porter', ...OUT.porter, 180, { here: false }),
  ...person('fix', ...OUT.fix, 180, { here: false }),
};
// the 21st of December, a little before a quarter to nine: the five in a half-circle before the clock, their backs to
// us; Stuart in the middle, his watch open in his hand; Fogg away (in the hall, unseen, his hat on), the crowd outside
const WAIT = {
  ...WHIST, minute: 1243, second: 10, crowd_outside: 1, fogg_present: 0, fogg_hat: 0,
  ...person('fogg', ...OUT.fogg, 180, { here: false, wear: { hat: 'tophat' }, gait: 'fogg_walk' }),
  ...Object.fromEntries(MEN.flatMap(id => Object.entries(person(id, ...ROUND[id], TO_CLOCK(id), { look: DIAL })))),
  stuart_with: ['watch'], stuart_look: 'stuart#watch', stuart_reach: { r: WATCH },
  flanagan_do: loop('arms_folded'), fallentin_do: loop('hands_behind', 3.1), sullivan_do: loop('hands_behind', 5.7), ralph_do: loop('arms_folded', 4.2),
};
// Friday: the salon half empty; Fogg in his armchair by the fire with his paper; the gentlemen still to come — in the
// hall, to come running in
const FRIDAY = {
  ...WHIST, minute: 1100, crowd_outside: 0, gentlemen: 0, fogg_seated: 1,
  ...person('fogg', ...ARMCHAIR, TO_FIRE, { do: loop('paper_seated'), with: ['newspaper'], gait: 'fogg_walk' }),
  ...Object.fromEntries(MEN.flatMap((id, i) => Object.entries(person(id, -0.6 + 0.3 * i, 19.6 + 0.3 * (i % 2), 180, { here: false, gait: 'run' })))),
};

function film(scene) {
  const P = id => scene.person(id);
  // where `id` is when a motion done once that began at `from` (their place) has ended, facing `turn` — a beat's `from`
  // after one that did it
  const ended = (id, motion, from, turn) => {
    const off = P(id).startOf(motion, turn) ?? { across: 0, distance: 0 };
    return { [`${id}_a`]: from[0] - off.across, [`${id}_d`]: from[1] - off.distance, [`${id}_turn`]: turn, [`${id}_do`]: { motion, from: 99 } };
  };
  // someone walks along points (their gait's own pace) and turns at the end: an action, done as they have turned
  const walk = (s, id, pts, turn) => s.sequence(async q => {
    await q.person(id).walk(pts);
    if (turn != null) await q.person(id).turn(turn);
  });
  // the time on the club's clock, at once (its script goes on from there)
  const time = (s, minute, second) => { s.set('minute', minute); s.set('second', second); };
  // looks one after another: [[seconds after the one before, id, at] …]
  const looks = (s, list) => s.sequence(async q => { for (const [dt, id, at] of list) { await q.wait(dt); q.person(id).look(at); } });

  // the whist as it ends: Stuart talking over his folded paper, all eyes where whist leaves them
  const AFTER_WHIST = () => ({
    ...WHIST, stuart_with: ['newspaper_folded'], stuart_do: loop('talk_seated'), stuart_look: 'fogg#head',
    ralph_look: 'stuart#head', fallentin_look: 'fogg#head',
  });
  // the wager as it ends: Fogg's cards down, his hands on the baize; Stuart up from his chair; all looking at Fogg
  const AFTER_WAGER = () => ({
    ...AFTER_WHIST(), cards_down: 1, fogg_with: null, fogg_look: 'stuart#head',
    ...ended('fogg', 'lay_cards', S.far, 180), ...ended('stuart', 'rise_chair', READER, 200),
    ...Object.fromEntries(['fallentin', 'sullivan', 'flanagan', 'ralph'].map(id => [`${id}_look`, 'fogg#head'])),
  });

  return {
    // ---- 21 December, 20:44:37 → :57. The five in a half-circle before the clock, their backs to us; Stuart's watch
    // open in his hand. The pendulum; the second hand; eyes to the watch, the dial, the door. At :57 the door's handle
    // turns — the door gives a little.
    countdown: {
      from: () => ({ ...WAIT, minute: 1244, second: 37 }),
      run: async s => {
        const door = s.shot(AT_DOOR);
        await s.wait(1);
        frame(s, ON_STUART, 5);
        looks(s, [[2.2, 'flanagan', 'stuart#watch'], [2.2, 'flanagan', DIAL], [2.1, 'ralph', DOOR], [2.1, 'ralph', DIAL],
          [1.4, 'sullivan', 'stuart#head'], [1.6, 'sullivan', DIAL], [2.4, 'fallentin', 'stuart#watch']]);
        // (the clock's own seconds: the cut comes at :56, the handle at :57)
        await s.wait(18.2);
        await s.until(() => door.ready);
        door.cut();
        await s.wait(0.8);
        s.tell('countdown:handle');
        await s.move('door', 0.03, { over: 0.4, ease: 'out' });
        await s.wait(0.6);
      },
    },
    // ---- 2 October, the evening. Whist: Fogg and three at the table under the lamp, Stuart apart with his paper,
    // Ralph by the fire. (Under the lines.) Stuart folds his paper and talks, his eyes on Fogg; Fogg answers without
    // lifting his eyes from his cards.
    whist: {
      from: () => ({ ...WHIST, ...WHIST_TABLE }),
      run: async s => {
        const stuart = s.person('stuart');
        await s.wait(2);
        s.tell('whist:stuart-talks');
        stuart.with(['newspaper_folded']);
        stuart.do('talk_seated', { loop: true });
        await s.wait(0.3);
        stuart.look('fogg#head');
        await looks(s, [[0.5, 'sullivan', 'stuart#head'], [0.6, 'flanagan', 'stuart#head'], [1.8, 'ralph', 'stuart#head'],
          [0.8, 'sullivan', null], [0.8, 'flanagan', null], [1.2, 'fallentin', 'fogg#head']]);
        await s.wait(1);
      },
    },
    // ---- The wager. Fogg at his cards, close; all eyes on him, his face even — the beat stops here, alive (the player
    // lays the cards: the game waits for a touch on fogg#hands, then plays wager_down).
    wager: {
      after: 'whist',
      from: AFTER_WHIST,
      run: async s => {
        const fogg = s.person('fogg');
        s.cut(FOGG_CLOSE);
        await looks(s, [[0.3, 'fogg', 'stuart#head'], [0.3, 'fallentin', 'fogg#head'], [0.2, 'sullivan', 'fogg#head'],
          [0.2, 'flanagan', 'fogg#head'], [0.2, 'ralph', 'fogg#head']]);
        await s.wait(0.8);
        fogg.look(BAIZE);
        await s.wait(0.6);
        s.tell('wager:ready');
        await s.wait(0.5);
      },
    },
    // ---- He lays his cards and his hands on the baize; Stuart gets up. All eyes on Fogg.
    wager_down: {
      after: 'wager',
      from: () => ({ ...AFTER_WHIST(), ...FOGG_CLOSE, fogg_look: BAIZE,
        ...Object.fromEntries(['fallentin', 'sullivan', 'flanagan', 'ralph'].map(id => [`${id}_look`, 'fogg#head'])) }),
      run: async s => {
        const fogg = s.person('fogg'), stuart = s.person('stuart');
        const laid = fogg.go('lay_cards', { from: S.far, turn: 180 });
        await s.wait(0.9);
        fogg.with(null);
        s.set('cards_down', 1);
        s.tell('wager_down:cards-down');
        await s.wait(0.3);
        fogg.look('stuart#head');
        await s.wait(0.3);
        const up = stuart.go('rise_chair', { from: READER, turn: 200 });
        await s.wait(0.1);
        stuart.look('fogg#head');
        await s.wait(3.4);
        frame(s, { ...FOGG_CLOSE, camera_shot: 0.8 }, 3);
        await s.all(laid, up);
        s.tell('wager_down:stuart-up');
        await s.wait(2);
      },
    },
    // ---- 19:25. He gets up, pushing back his chair, goes to the door without a step too many — his hat from the stand
    // on the way — and is gone; the door shuts behind him.
    leave: {
      after: 'wager_down',
      from: () => ({ ...AFTER_WAGER(), ...WHIST_TABLE }),
      run: async s => {
        const fogg = s.person('fogg');
        time(s, 1165, 0);
        if (!isView(s, WHIST_TABLE)) s.cut(WHIST_TABLE);
        // (the door: its view made ready while he gets up and goes)
        const door = s.shot(AT_STAND);
        await s.wait(0.2);
        s.move('chair_back', 0.36, { over: 1.4, ease: 'out' });
        await fogg.go('rise_table', { from: S.far, turn: 180 });
        s.tell('leave:up');
        // (the camera back to the whole room as he goes)
        frame(s, WIDE, 3);
        fogg.look(null);
        looks(s, ['fallentin', 'sullivan', 'flanagan', 'stuart', 'ralph'].map(id => [0.3, id, 'fogg#head']));
        await fogg.turn(toward(S.far, [-0.9, 8.35]));
        await fogg.walk([[-0.9, 8.35], [-1.6, 12.4]]);
        await s.until(() => door.ready);
        door.cut();
        await walk(s, 'fogg', [BY_STAND], toward(BY_STAND, plan.stand));
        fogg.look(HAT);
        await s.wait(0.2);
        fogg.reach({ r: HAT });
        await s.wait(0.6);
        s.set('fogg_hat', 0);
        fogg.reach({ r: 'fogg#head' });
        fogg.look(null);
        await s.wait(0.5);
        fogg.wear({ hat: 'tophat' });
        fogg.reach(null);
        s.tell('leave:hat-on');
        const open = s.move('door', 1, { over: 1.1, ease: 'out' });
        await s.wait(0.4);
        await fogg.walk([[-0.3, 17.7], HALL]);
        fogg.here(false);
        s.tell('leave:gone');
        await open;
        await s.move('door', 0, { over: 1.3, ease: 'inOut' });
        await s.wait(1);
      },
    },
    // ---- 21 December. The gentlemen are here before the clock; the crowd outside with its lanterns. The clock goes.
    wait: {
      from: () => ({ ...WAIT, ...ON_STUART }),
      run: async s => {
        await looks(s, [[2.5, 'ralph', 'stuart#head'], [2, 'ralph', DIAL], [0.5, 'sullivan', 'stuart#watch'], [2, 'sullivan', DIAL]]);
        await s.wait(1);
      },
    },
    // ---- 20:44:57. The door opens: Fogg — and, behind him, whoever has come with him. The gentlemen turn round, one
    // after another; Stuart shuts his watch.
    door: {
      after: ['wait', 'countdown'],
      from: () => ({ ...WAIT, minute: 1244, second: 57, door: 0.03, ...AT_DOOR }),
      run: async s => {
        const fogg = s.person('fogg');
        time(s, 1244, 57);
        if (!isView(s, AT_DOOR)) s.cut(AT_DOOR);
        s.move('door', 1, { over: 1.2, ease: 'out' });
        await s.wait(0.3);
        fogg.here(true);
        // (on him once he is well in — the view made ready meanwhile — and on to where he stops)
        const him = s.shot(FOGG_IN);
        const comes = s.sequence(async q => {
          await q.person('fogg').walk([[-0.15, 13.6]]);
          await q.until(() => him.ready);
          him.cut();
          await walk(q, 'fogg', [IN.fogg], 180);
        });
        const followers = s.sequence(async q => {
          const come = [];
          await q.wait(0.7);
          if (q.get('with_aouda')) { q.person('aouda').here(true); come.push(walk(q, 'aouda', [IN.aouda], 200)); }
          await q.wait(0.6);
          if (q.get('with_pp')) { q.person('passepartout').here(true); come.push(walk(q, 'passepartout', [IN.passepartout], 160)); }
          await q.wait(0.6);
          // (Fix last, a step behind, by the door; his bruise if the game says so)
          if (q.get('with_fix')) {
            q.person('fix').wear(q.get('fix_bruise') ? scene.kit.cast.wears.fix_bruise : null);
            q.person('fix').here(true);
            come.push(walk(q, 'fix', [IN.fix], 175));
          }
          await q.all(...come);
        });
        // the five turn round, one after another
        const turning = MEN.map((id, i) => s.sequence(async q => {
          await q.wait(1.2 + [0.6, 0, 0.9, 0.3, 1.4][i]);
          q.person(id).turn(toward(ROUND[id], IN.fogg));
          await q.wait(0.2);
          q.person(id).look('fogg#head');
        }));
        await s.wait(1.7);
        s.person('stuart').reach(null);
        await s.wait(0.6);
        s.person('stuart').with(['watch_shut']);
        await comes;
        s.tell('door:fogg-in');
        fogg.look('stuart#head');
        await s.all(followers, ...turning);
        await s.wait(2.5);
      },
    },
    // ---- 20:45:00. The pendulum, silence, the door shut. Stuart shuts his watch, lowers his hand, turns to the others;
    // they look at him.
    no_door: {
      after: ['wait', 'countdown'],
      from: () => ({ ...WAIT, minute: 1245, second: 0, ...STUART_CLOSE }),
      run: async s => {
        const stuart = s.person('stuart');
        time(s, 1245, 0);
        if (!isView(s, STUART_CLOSE)) s.cut(STUART_CLOSE);
        await s.wait(1.2);
        stuart.with(['watch_shut']);
        s.tell('no_door:watch-shut');
        await s.wait(0.4);
        stuart.reach(null);
        await s.wait(0.2);
        stuart.look(null);
        await s.wait(0.4);
        const turned = stuart.turn(200);
        await looks(s, [[0.4, 'flanagan', 'stuart#head'], [0.2, 'sullivan', 'stuart#head'], [0.2, 'fallentin', 'stuart#head'], [0.4, 'ralph', 'stuart#head']]);
        await turned;
        await s.wait(3);
      },
    },
    // ---- Friday (the ending «по расписанию»). The salon half empty; Fogg in his armchair by the fire, his paper open.
    // Outside, day — night — day — evening; the fire high and low. The porter comes to him, and goes.
    friday: {
      from: () => ({ ...FRIDAY, ...FRIDAY_FOGG }),
      run: async s => {
        const porter = s.person('porter'), wide = s.shot(WIDE);
        // (the days going by: the hour and the fire)
        await s.all(s.move('day', 0, { over: 2.5, ease: 'inOut' }), s.move('fire', 0.35, { over: 2.5, ease: 'inOut' }));
        await s.all(s.move('day', 1, { over: 2.5, ease: 'inOut' }), s.move('fire', 0.9, { over: 2.5, ease: 'inOut' }));
        s.move('day', 0.6, { over: 2.5, ease: 'inOut' });
        s.move('fire', 0.6, { over: 2.5, ease: 'inOut' });
        time(s, 1243, 0);
        // the porter, through the door left ajar, to Fogg — and back
        s.move('door', 0.4, { over: 0.8, ease: 'out' });
        await s.wait(0.4);
        porter.here(true);
        await walk(s, 'porter', [[0.3, 16.4], [0.9, 7.9], [1.2, 6.45]], toward([1.2, 6.45], ARMCHAIR));
        porter.look('fogg#head');
        s.tell('friday:porter');
        await s.wait(2);
        porter.look(null);
        await s.until(() => wide.ready);
        wide.cut();
        await walk(s, 'porter', [[0.9, 7.9], [0.3, 16.4], OUT.porter]);
        porter.here(false);
      },
    },
    // ---- 20:45: the door flung open, the five running in, round Fogg's armchair; he sits on.
    friday_in: {
      after: 'friday',
      from: () => ({ ...FRIDAY, ...WIDE, minute: 1245, second: 0, day: 0.6, fire: 0.6, door: 0.4 }),
      run: async s => {
        time(s, 1245, 0);
        s.move('door', 1, { over: 0.6, ease: 'out' });
        const STOP = [[0.0, 8.6], [0.7, 8.2], [1.3, 7.8], [0.1, 7.4], [0.8, 9.0]];
        const come = MEN.map((id, i) => s.sequence(async q => {
          await q.wait(0.35 * i);
          q.person(id).here(true);
          await walk(q, id, [[[-0.6, 0.2, 0.9, -0.2, 0.5][i], 13.5 - 0.4 * i], STOP[i]], toward(STOP[i], ARMCHAIR));
          q.person(id).look('fogg#head');
        }));
        await s.all(...come);
        s.tell('friday_in:round-him');
        s.set('gentlemen', 5);
        await s.wait(2.5);
      },
    },
  };
}
// the showcase's order: the scene's own cut (the prologue's last seconds, the wager, the evening of the 21st and its two
// endings), then Friday
const ORDER = ['countdown', 'whist', 'wager', 'wager_down', 'leave', 'wait', 'door', 'no_door', 'friday', 'friday_in'];

return { plan, leaf, reveal, chair, CROWD, crowdGroup, film, ORDER, MEN, ARMCHAIR, TO_FIRE, loop };
