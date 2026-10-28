
// The station — what the paintings and the script share: the station in metres, the train's frame, a few painted things.
// Metres: across x (east +), distance z (north +). The start stands on the platform; the platform runs east–west,
// its edge at z 4.5, the track beyond it 0.9 m lower; the station's front at z −4 faces north across the platform.

const G = {
  EDGE: 4.5, BED: -0.9, TRACK_Z: 5.6, BUILDING_Z: -4,
  // the train, in its own frame (the anchor `train` on the track's middle; it faces west, so that in its frame —
  // laid out as if it faced the start — `distance` runs east, the way it goes, and `across` south, toward the platform). Its anchor stands at x = TRAIN_X0 + RUN·train.
  TRAIN_X0: 0, RUN: 150,
  LOCO: [2.6, 13.4], CAR1: [-12.4, 1.8], CAR2: [-27.2, -13.0],   // each piece's west and east ends (along)
  SIDE: 1.35, FLOOR: 0.35,                                       // the cars' south side across the anchor; their floor over the platform
  DOOR1: 0.85, WIN1: -1.375,                                     // car 1's door and the middle of Toto's window (along)
  LAMP: [4.2, 2.6], CLOCK: [0, -4, 5.0],
};
G.trainX = t => G.TRAIN_X0 + G.RUN * t;

const hash = (n, s) => anim.hash(n, s);

// a carriage's south side, painted from its west end (x 0) east (len m), the rail at y 0.9 below the platform's level,
// floor at y −FLOOR: green-brown body, a cream band, windows (holes — the inside shows), the door near the east end
function carSide(g, len, seed, now) {
  const top = -3.2, bot = 0.75, win = [], door = len - 1.4;
  g.save(); g.beginPath(); g.rect(0, top - 0.3, len, bot - top + 0.3);
  for (let x = 1.2; x < len - 2.2; x += 1.55) { if (Math.abs(x - door) < 1.3) continue; win.push(x); g.rect(x, -2.25, 1.05, 0.8); }
  g.clip('evenodd');
  const body = now ? '#4c5852' : '#64744e', dark = now ? '#3e4842' : '#4f5d3d', line = now ? '#a7a08e' : '#c9b98e';
  g.fillStyle = body; g.fillRect(0, top, len, bot - top);
  g.fillStyle = dark; g.fillRect(0, -1.3, len, 1.55);                                  // the lower panels, darker
  g.fillStyle = line; g.fillRect(0, -1.42, len, 0.12);                                 // the cream band
  g.fillStyle = now ? '#56625b' : '#72835a'; g.fillRect(0, -2.72, len, 0.08); g.fillRect(0, -1.32, len, 0.03);   // the beading
  g.fillStyle = now ? '#353e39' : '#435034'; for (let x = 0.4; x < len; x += 1.55) { g.fillRect(x, top + 0.1, 0.035, 1.0); g.fillRect(x, -1.28, 0.035, 1.45); }
  for (let x = 1.0; x < len - 0.5; x += 1.55) { g.fillStyle = 'rgba(20,24,18,0.5)'; g.fillRect(x, -1.0, 0.9, 0.025); g.fillRect(x, -0.3, 0.9, 0.025); }   // the panels' joints
  g.fillStyle = '#2a2a2c'; g.beginPath(); g.moveTo(-0.05, top); g.quadraticCurveTo(len / 2, top - 0.42, len + 0.05, top); g.lineTo(len + 0.05, top + 0.08); g.lineTo(-0.05, top + 0.08); g.fill();   // the roof's edge
  g.fillStyle = '#3c3c40'; g.beginPath(); g.moveTo(0.2, top - 0.08); g.quadraticCurveTo(len / 2, top - 0.44, len - 0.2, top - 0.08); g.lineTo(len - 0.2, top - 0.04); g.quadraticCurveTo(len / 2, top - 0.38, 0.2, top - 0.04); g.fill();   // its rain strip
  for (let x = 1.6; x < len - 1; x += 2.6) { g.fillStyle = '#26262a'; g.beginPath(); g.ellipse(x, top - 0.3, 0.16, 0.09, 0, Math.PI, 0); g.fill(); }   // the vents
  g.restore();
  g.fillStyle = '#23262a'; g.fillRect(door, -2.35, 0.9, 2.45);                      // the door
  g.fillStyle = '#5a6458'; g.fillRect(door + 0.2, -2.15, 0.5, 0.55);
  g.fillStyle = '#1c1c1e'; g.fillRect(door + 0.1, 0.1, 0.7, 0.08); g.fillRect(door + 0.15, 0.35, 0.6, 0.08);   // the steps
  for (const x of win) {
    g.strokeStyle = now ? '#7a7466' : '#b8a678'; g.lineWidth = 0.06; g.strokeRect(x - 0.03, -2.28, 1.11, 0.86);   // the brass-and-wood frame
    g.fillStyle = '#2e2e2a'; g.fillRect(x, -1.88, 1.05, 0.03);
    g.fillStyle = now ? '#7a7466' : '#b8a678'; g.fillRect(x + 0.1, -1.47, 0.85, 0.03);                             // the drop-light's strap
  }
  g.fillStyle = '#c9b98e'; for (const x of [door + 0.12, door + 0.78]) g.fillRect(x, -1.45, 0.03, 0.18);              // the door's handrails
  g.fillStyle = '#18181a'; g.fillRect(0, 0.5, len, 0.25);                              // the frame under
  for (const x of [1.6, 3.4, len - 3.4, len - 1.6]) { g.fillStyle = '#121214'; g.beginPath(); g.arc(x, 0.48, 0.42, 0, Math.PI * 2); g.fill(); g.fillStyle = '#3a3a3c'; g.beginPath(); g.arc(x, 0.48, 0.12, 0, Math.PI * 2); g.fill(); }
  g.save(); g.scale(0.01, 0.01); g.fillStyle = now ? '#c8c2b0' : '#d8c890'; g.font = '700 22px serif'; g.textAlign = 'center';
  g.fillText('FS  ' + (seed % 2 ? '2' : '3'), len * 50, -50); g.restore();
  return win;
}
// the inside of a carriage seen through its windows: the far wall's dark wood, the seats' backs, a small lamp
function carInside(g, len, now) {
  g.fillStyle = '#2c241e'; g.fillRect(0, -3.0, len, 3.0);
  g.fillStyle = '#4a3a2c'; for (let x = 1.0; x < len - 1; x += 1.55) g.fillRect(x, -1.35, 1.2, 0.5);
  g.fillStyle = now ? '#606a70' : '#3a3e48'; for (let x = 1.2; x < len - 2.2; x += 1.55) g.fillRect(x + 0.1, -2.15, 0.85, 0.6);   // the far windows: the sky
}
// the locomotive's south side from its back (x 0, the cab) to its front (len): the tender joined, the boiler, the
// chimney, the dome, the driving wheels with their rods (a layer the animate turns), the buffer beam
function locoSide(g, len) {
  const green = '#25302a', black = '#18191b', red = '#8a2a20', brass = '#a9864a';
  g.fillStyle = green; g.fillRect(0, -3.4, 2.6, 3.4);                                   // the cab
  g.strokeStyle = red; g.lineWidth = 0.04; g.strokeRect(0.12, -3.25, 2.36, 2.95);     // its red lining
  g.fillStyle = black; g.fillRect(-0.1, -3.55, 2.8, 0.18);                             // the cab roof
  g.fillStyle = '#9aa2b4'; g.fillRect(0.5, -2.9, 0.8, 0.7);                            // the cab's window: the dawn sky in it
  g.strokeStyle = brass; g.lineWidth = 0.05; g.strokeRect(0.5, -2.9, 0.8, 0.7);
  g.fillStyle = brass; g.fillRect(1.55, -1.95, 0.7, 0.32);                             // the number plate
  g.fillStyle = black; g.save(); g.scale(0.01, 0.01); g.font = '700 20px serif'; g.textAlign = 'center'; g.fillText('835', 190, -172); g.restore();
  g.fillStyle = green; g.beginPath(); g.moveTo(2.6, -2.8); g.lineTo(len - 0.6, -2.8); g.quadraticCurveTo(len - 0.3, -2.75, len - 0.3, -2.3); g.lineTo(len - 0.3, -1.1); g.lineTo(2.6, -1.1); g.fill();   // the boiler and tanks
  g.strokeStyle = red; g.lineWidth = 0.035; g.strokeRect(2.8, -2.65, len - 3.4, 1.4);
  g.fillStyle = brass; for (let x = 3.4; x < len - 1; x += 1.4) g.fillRect(x, -2.8, 0.05, 1.7);          // the boiler's brass bands
  g.fillStyle = black; g.fillRect(len - 1.5, -3.6, 0.55, 0.85);                        // the chimney
  g.fillRect(len - 1.62, -3.68, 0.79, 0.12);
  g.fillStyle = brass; g.beginPath(); g.ellipse(len - 4.6, -2.85, 0.5, 0.3, 0, Math.PI, 0); g.fill();   // the dome
  g.fillStyle = '#8a1c18'; g.fillRect(len - 0.35, -0.95, 0.3, 0.45);                    // the buffer beam
  g.fillStyle = '#121214'; g.fillRect(2.4, -1.1, len - 2.6, 0.75);                      // the running board's shade
  g.fillStyle = '#c8b070'; g.fillRect(2.6, -1.12, len - 3, 0.03);
  g.fillStyle = '#121214'; for (const x of [len - 1.6, len - 0.9]) { g.beginPath(); g.arc(x, 0.55, 0.38, 0, Math.PI * 2); g.fill(); }   // the bogie's wheels
  g.fillStyle = '#2a2a2e'; g.fillRect(len - 2.6, -0.3, 0.9, 0.5);                       // the cylinder
}
const WHEELS = [3.6, 5.5, 7.4];                                                         // the driving wheels' hubs (x), r 0.7
function wheels(r, now, only) {
  for (const x of WHEELS) {
    if (only !== undefined && x !== only) continue;
    r.fillStyle = '#141416'; r.beginPath(); r.arc(x, 0.2, 0.72, 0, Math.PI * 2); r.fill();
    r.fillStyle = now ? '#6a2a24' : '#7a2420'; r.beginPath(); r.arc(x, 0.2, 0.62, 0, Math.PI * 2); r.fill();
    r.fillStyle = '#141416'; r.beginPath(); r.arc(x, 0.2, 0.5, 0, Math.PI * 2); r.fill();
    r.strokeStyle = now ? '#6a2a24' : '#7a2420'; r.lineWidth = 0.05;
    for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2; r.beginPath(); r.moveTo(x, 0.2); r.lineTo(x + Math.cos(a) * 0.5, 0.2 + Math.sin(a) * 0.5); r.stroke(); }
  }
}

// the station's front from the platform (x across as seen looking south: east at the left — the card faces north and
// its x runs to the world's west), two storeys of lime-washed stone, shutters, the doors, the name, the clock's place
function station(g, now) {
  const W = 9, H = 7.2;
  g.fillStyle = now ? '#a59d8c' : '#cdb894'; g.fillRect(-W, -H, 2 * W, H);
  g.fillStyle = now ? '#8a8476' : '#b49e7a'; g.fillRect(-W, -H, 2 * W, 0.4); g.fillRect(-W, -3.6, 2 * W, 0.18); g.fillRect(-W, -0.6, 2 * W, 0.6);
  for (const x of [-W, W - 0.5]) g.fillRect(x, -H, 0.5, H);
  for (let k = 0; k < 5; k++) {
    const x = -7 + k * 3.5;
    g.fillStyle = now ? '#3a3e40' : '#3c3a36'; g.fillRect(x - 0.55, -6.3, 1.1, 1.8);
    g.fillStyle = now ? '#506058' : '#5e7a5a'; g.fillRect(x - 1.0, -6.3, 0.42, 1.8); g.fillRect(x + 0.58, -6.3, 0.42, 1.8);
    const door = k % 2 === 1;
    g.fillStyle = now ? '#3a3a3c' : '#4a3a2c'; g.fillRect(x - 0.65, door ? -2.9 : -2.6, 1.3, door ? 2.9 : 1.6);
    if (!door) { g.fillStyle = now ? '#506058' : '#5e7a5a'; g.fillRect(x - 1.1, -2.6, 0.42, 1.6); g.fillRect(x + 0.68, -2.6, 0.42, 1.6); }
  }
  g.save(); g.scale(0.01, 0.01); g.fillStyle = now ? '#4a4a4c' : '#3a2e24'; g.font = '700 46px serif'; g.textAlign = 'center';
  g.fillText('GIANCALDO', 0, -400); g.restore();
}



// ---- the sky (the world's sky): dawn's gold low in the east-south-east, a pale moon going down in the west; 1988's
// lilac evening with its afterglow in the west-north-west ----
const SKY = { horizon: 0.5, round: true, moon: -100, glow: -70 };

// ---- the film of the scene (the world's beats): film(scene) → { <beat>: { from, after, run } } ----
// Metres: x east, z north; camera yaw — degrees right of north.
const brg = (a, b) => { const d = Math.atan2(b[0] - a[0], b[1] - a[1]) * 180 / Math.PI; return d < 0 ? d + 360 : d; };
const IDS = ['toto', 'maria', 'alfredo', 'c1', 'c2'];
const cam = (x, z, yaw, h = 0, pitch = 0) => ({ camera_on: null, camera_target: null, camera_x: x, camera_z: z, camera_yaw: yaw, camera_h: h, camera_pitch: pitch, camera_roll: 0, camera_look: 0 });
const look = (at, to, h = 0, pitch = 0) => cam(at[0], at[1], +((brg(at, to) + 540) % 360 - 180).toFixed(1), h, pitch);
// places (the train standing: train 0)
const P = {
  T_HUG: [1.2, 3.3], M_HUG: [0.72, 3.3], M_BACK: [-0.05, 3.7], A_WAIT: [2.3, 2.9], A_HUG: [1.68, 3.3],
  DOOR: [G.DOOR1, 4.35], A_EDGE: [1.6, 3.95], A_OFF: [-6, 0.4], A_GONE: [-16, 0.2],
  SAL_OUT: [0.75, 3.95], SAL_STOP: [-0.2, 1.4],
};
const WIN = 'car1_floor#win'; // the spot behind Toto's window on car 1's floor: he stands there, carried
const C_FAR = { c1: { at: [14, 1.0], turn: 300 }, c2: { at: [-11, -2.2], turn: 20 } };
function film(scene) {
  const CH = scene.kit.cast.characters;
  const CAM = {
    platform: look([0.25, 0.6], [1.42, 3.3], -0.15, 2),   // the farewell, medium: Toto and Alfredo ≈ 1/2, the mother a step behind; the green carriage
    window: cam(-2.0, 1.2, 11, 0.0, 6),                  // from the platform: Toto's window; the camera pans after it as the train starts, Alfredo coming into the frame
    away: cam(-5.5, 0.4, 60, 0, 2),                      // along the platform east: the carriage goes, the mother waves
    back: { ...cam(1.7, G.WIN1 - 0.2, 150, 1.25, -2), camera_on: 'train' },   // leaning out of Toto's window, back at the platform
    arrive: cam(1.9, 4.35, 205, 0, 3),                   // 1988, from the carriage's step: Salvatore's back, the empty platform, the clock
  };
  const trainKeys = t => ({ train: t, train_x: G.trainX(t) });
  const base = (era, hour) => ({ era, hour, now_k: era === 'now' ? 1 : 0, dawn_k: era === 'now' ? 0 : 1, steam: era === 'now' ? 0 : 1,
    wallet: 0, open: 0, ...trainKeys(0) });
  function cast(who) {
    const o = {};
    for (const id of IDS) {
      const p = who[id];
      o[id + '_here'] = !!p;
      if (!p) continue;
      o[id + '_a'] = p.at[0]; o[id + '_d'] = p.at[1];
      o[id + '_turn'] = p.turn ?? 180; o[id + '_do'] = p.do || 'stand';
      o[id + '_look'] = p.look ?? null; o[id + '_reach'] = p.reach ?? null; o[id + '_gait'] = p.gait ?? null;
      o[id + '_mood'] = p.mood ?? 'neutral';
      if (id === 'toto') { o.toto_on = p.on ?? null; o.toto_with = p.with ?? null; o.toto_wear = p.wear ?? null; o.toto_steps = p.on ? false : null; }
    }
    return o;
  }
  const stays = () => scene.get('alfredo_stays') !== 0;
  // where Alfredo is after Toto has boarded, by what the game chose
  const alfAfter = far => stays() ? { at: P.A_EDGE, turn: 20, look: 'car1#window', mood: 'sad' } : { at: far ? P.A_GONE : P.A_OFF, turn: 270, gait: 'cane_walk', mood: 'sad' };
  const B = {
    // dawn, the train standing, steam; the mother holds Toto (5 s); she steps back; Alfredo comes with his cane and
    // holds him. The pose under the choice `station`: Alfredo and Toto in the middle, faces; the mother a step behind
    platform: {
      from: () => ({ ...base('past', 0.25), ...cast({
        toto: { at: P.T_HUG, turn: 270, look: 'maria', reach: { r: 'maria#back', l: 'maria#back' }, mood: 'thinking' },
        maria: { at: P.M_HUG, turn: 90, look: 'toto', reach: { r: 'toto#nape', l: 'toto#nape' }, mood: 'tired' },
        alfredo: { at: P.A_WAIT, turn: brg(P.A_WAIT, P.T_HUG), look: 'toto', mood: 'sad' }, ...C_FAR }), ...CAM.platform }),
      run: async s => {
        const toto = s.person('toto'), ma = s.person('maria'), alf = s.person('alfredo');
        await s.wait(5); s.tell('platform:hug');
        await s.wait(1.6);
        toto.reach(null); ma.reach(null);
        await ma.walk([P.M_BACK]); await ma.turn(brg(P.M_BACK, P.T_HUG)); ma.look('toto');
        alf.gait('cane_walk');
        await alf.walk([P.A_HUG]); alf.gait(null);
        await s.all(alf.turn(255), toto.turn(105));
        alf.look('toto'); toto.look('alfredo');
        alf.reach({ l: 'toto#back' }); toto.reach({ r: 'alfredo#shoulder_l', l: 'alfredo#shoulder_r' });
        await s.wait(3.5);
      },
    },
    // Toto takes the suitcase and goes in at the door; the cut: he is at his window; the train starts, the camera
    // tracks with the window; alfredo_stays 0 — Alfredo turns and goes off tapping his cane, 1 — he goes to the
    // platform's edge. The pose under the choice `look`: the window with Toto in it
    boarding: {
      after: ['platform'],
      from: () => ({ ...base('past', 0.25), ...cast({
        toto: { at: P.T_HUG, turn: 105, look: 'alfredo', reach: { r: 'alfredo#shoulder_l', l: 'alfredo#shoulder_r' }, mood: 'thinking' },
        maria: { at: P.M_BACK, turn: brg(P.M_BACK, P.T_HUG), look: 'toto', mood: 'sad' },
        alfredo: { at: P.A_HUG, turn: 255, look: 'toto', reach: { l: 'toto#back' }, mood: 'sad' }, ...C_FAR }), ...CAM.platform }),
      run: async s => {
        const toto = s.person('toto'), ma = s.person('maria'), alf = s.person('alfredo');
        const win = s.shot({ ...CAM.window, toto_here: true, toto_on: WIN, toto_steps: false, toto_turn: 90, toto_with: null, toto_do: 'stand', toto_look: 'alfredo', toto_reach: null, toto_gait: null, toto_mood: 'sad' });
        toto.reach(null); alf.reach(null);
        await s.wait(0.6);
        toto.look('suitcase'); toto.reach({ r: 'suitcase' });
        await s.wait(0.8);
        toto.with(['suitcase']); toto.reach(null); toto.gait('carry_walk'); toto.look(null);
        await toto.walk([[1.0, 3.9], P.DOOR]);
        toto.here(false); toto.gait(null);
        win.cut();
        // the train starts; the camera tracks along the platform with Toto's window and stops with it
        s.move('train', 0.08, { over: 4.5, ease: 'in' });
        s.move('camera_yaw', 64, { over: 4.8, ease: 'inOut' });
        alf.look('car1#window'); ma.look('car1#window');
        await s.wait(1.2); s.tell('boarding:window');
        if (stays()) { await alf.walk([P.A_EDGE]); await alf.turn(20); }
        else { await alf.turn(270); alf.look(null); alf.gait('cane_walk'); alf.walk([P.A_OFF, P.A_GONE]); }
        await s.wait(3.3);
      },
    },
    // from the platform: the carriage goes, Toto at his window in profile looking ahead; the mother waves; Alfredo as
    // he chose
    away: {
      after: ['boarding'],
      from: () => ({ ...base('past', 0.25), ...trainKeys(0.08), ...cast({ toto: { at: [0, 0], on: WIN, turn: 0, mood: 'sad' }, maria: { at: P.M_BACK, turn: 20, look: 'car1#window', mood: 'sad' }, alfredo: alfAfter(false), ...C_FAR }), ...CAM.away }),
      run: async s => {
        const ma = s.person('maria'), alf = s.person('alfredo'), toto = s.person('toto');
        if (s.get('camera_yaw') !== CAM.away.camera_yaw) s.cut({ ...CAM.away, toto_turn: 0, toto_look: null, toto_steps: false });
        if (!stays()) { alf.gait('cane_walk'); alf.walk([P.A_GONE]); }
        toto.look(null);
        const go = s.move('train', 1, { over: 12, ease: 'in' });
        await s.wait(0.6); ma.do('wave');
        await s.wait(4.2); ma.do('wave');
        await go;
        s.tell('away:gone');
        await s.wait(0.6);
      },
    },
    // from the train, backward: the platform going away; the mother waves; Alfredo — his back going, the cane; or he
    // stands and lifts his hand
    back_look: {
      after: ['boarding'],
      from: () => ({ ...base('past', 0.25), ...trainKeys(0.08), ...cast({ maria: { at: P.M_BACK, turn: 20, look: 'car1#window', mood: 'sad' }, alfredo: alfAfter(false), ...C_FAR }), ...CAM.back }),
      run: async s => {
        const ma = s.person('maria'), alf = s.person('alfredo');
        if (s.get('camera_on') !== 'train') s.cut({ ...CAM.back, toto_here: false });
        if (!stays()) { alf.gait('cane_walk'); alf.walk([P.A_GONE]); }
        const go = s.move('train', 0.42, { over: 12, ease: 'in' });
        await s.wait(0.5); ma.do('wave');
        if (stays()) { await s.wait(1.2); alf.do('wave'); }
        await s.wait(4.5); ma.do('wave');
        await s.wait(2); s.tell('back_look:far');
        await go;
        await s.wait(0.5);
      },
    },
    // 1988, a cool evening: the train standing, no steam; Salvatore (already on the platform) walks three steps from the
    // carriage and stops in the empty platform, his back to us
    arrival: {
      from: () => ({ ...base('now', 0.8), ...cast({ toto: { at: P.SAL_OUT, turn: 200, wear: CH.salvatore, with: ['suitcase'], mood: 'tired' } }), ...CAM.arrive }),
      run: async s => {
        const sal = s.person('toto');
        s.move('camera_z', CAM.arrive.camera_z - 1.4, { over: 11, ease: 'inOut' });
        s.move('camera_x', CAM.arrive.camera_x - 0.6, { over: 11, ease: 'inOut' });
        await s.wait(1.5);
        await sal.walk([[0.35, 2.6], P.SAL_STOP]);
        await s.wait(1.2); s.tell('arrival:stand');
        sal.look('clock#face');
        await s.wait(3.5);
        sal.look([-3, -2, 1.2]);
        await s.wait(2.5);
      },
    },
    // the insert: his hands open the old wallet, the one frame of a kiss against the station's lamp
    wallet: {
      after: ['arrival'],
      from: () => ({ ...B.arrival.from(), toto_a: P.SAL_STOP[0], toto_d: P.SAL_STOP[1], toto_look: 'clock#face' }),
      run: async s => {
        s.set('open', 0); s.set('wallet', 1);
        await s.wait(0.6);
        await s.move('open', 1, { over: 2.6, ease: 'inOut' });
        await s.wait(1.8);
      },
    },
  };
  return B;
}

return { G, carSide, carInside, locoSide, wheels, WHEELS, station, SKY, P, film };
