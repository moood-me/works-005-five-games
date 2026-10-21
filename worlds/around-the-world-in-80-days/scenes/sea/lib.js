// The sea — the «Tankadere» in the typhoon (chapter II): what the elements, the script and the film share. The boat is
// built on three anchors (scene.json: `boat` — her yaw and pitch, `hull` — her heel, `frame` — her own frame); her
// metres are her own: `distance` forward from her middle (the stern −7.5, the stem 8, the bowsprit's end 10.6),
// `across` to starboard, the deck 0, the sea 0.9 below it. In the world her middle is 7.5 m ahead of the start (the
// camera rides her stern, low). The waves run at her bow: the crest (an element in the world, placed by `wave`), the
// sea's swell (its shader). The game drives `wave`, `wave_h`, `helm`, `heel`, `green_water` («The typhoon»); the script
// turns them, with the swell's own rocking, into the anchors' keys (pose).
const { mixc, css, rgba, glow } = kit.light;
const clamp01 = v => anim.clamp(typeof v === 'number' ? v : 0, 0, 1);
const num = (v, or = 0) => (typeof v === 'number' && Number.isFinite(v) ? v : or);

const plan = {
  // her middle in the world; her stem (in her frame)
  at: 7.5,
  stem: 8,
  beam: 2.05,
  sea: -0.9,
  masts: { main: 0.4, fore: 4.6 },
};
// the boat's colours (as in the harbour: dark green, a gold line, pale decks), the sea's
const C = { hull: '#28362e', gold: '#c8a050', deck: '#c2b292', rail: '#5a4632', inside: '#4a5a4e', mast: '#a8885e', sail: '#e6dfcc', iron: '#2e2f33', sea: '#3e5e62' };

const bump = (x, c, w) => Math.exp(-(((x - c) / w) ** 2));
// The boat's pose and the crest's place from the state: { bow_f, pitch, roll } (degrees: the anchors' keys) and the
// crest { a, d, e, f } (the world's metres, its slant). The pitch: the bow lifts as the crest comes under it (wave ≈
// 0.42), drops into the trough after it (≈ 0.66), as high as the waves run; the swell's own rocking (`rock`, `rise`)
// as strong as the storm.
function pose(st) {
  const w = clamp01(st.wave), h = clamp01(st.wave_h), storm = clamp01(st.storm), from = anim.clamp(num(st.wave_from), -1, 1);
  const pitch = -15 * h * bump(w, 0.42, 0.1) + 11 * h * bump(w, 0.66, 0.1) + (1.5 + 3.5 * storm) * num(st.rise);
  const roll = -18 * anim.clamp(num(st.heel), -1, 1) + (1 + 6 * storm) * num(st.rock);
  const bow = 180 + 20 * anim.clamp(num(st.helm), -1, 1);
  const bowWorld = plan.at + plan.stem, d = bowWorld + (0.5 - w) * 220;
  const crest = { a: from * (d - bowWorld) * 0.45, d, e: -1 - 9 * anim.ease.inOut(anim.span(w, 0.34, 0.5)), f: 180 + 28 * from };
  return { bow, pitch, roll, crest };
}

// ── painting helpers ──
const poly = (g, pts, fill) => {
  g.fillStyle = fill;
  g.beginPath();
  pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
  g.closePath();
  g.fill();
};
const rect = (g, x, y, w, h, fill) => {
  g.fillStyle = fill;
  g.fillRect(x, y, w, h);
};
const line = (g, pts, colour, width) => {
  g.strokeStyle = colour;
  g.lineWidth = width;
  g.beginPath();
  pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
  g.stroke();
};
const shade = (c, k) => css(mixc(c, '#000000', k));
const tint = (c, k) => css(mixc(c, '#ffffff', k));
// A bulwark seen from inboard, x 0…len along it, its top `h` over the deck (rising to `h2` at its far end): planks, the
// rail, stanchions; the gold line along the outside's top shows over the rail
function bulwark(g, len, h, h2 = h) {
  poly(g, [[0, 0], [0, -h], [len, -h2], [len, 0]], C.inside);
  g.fillStyle = shade(C.inside, 0.25);
  for (let k = 1; k < 4; k++) g.fillRect(0, -(h * k) / 4, len, 0.02);
  g.fillStyle = shade(C.rail, 0.2);
  for (let x = 0.5; x < len; x += 0.9) g.fillRect(x - 0.04, -anim.mix(h, h2, x / len), 0.08, anim.mix(h, h2, x / len));
  line(g, [[0, -h - 0.04], [len, -h2 - 0.04]], C.rail, 0.1);
  line(g, [[0, -h - 0.11], [len, -h2 - 0.11]], C.gold, 0.025);
}
// A mast seen from aft (its foot on the deck): the pole, its cap, the shrouds down to the rails; the flag at half-mast
// (a layer, its wind) when `flag`
function mast(g, e, h, flag) {
  poly(g, [[-0.11, 0], [-0.07, -h], [0.07, -h], [0.11, 0]], C.mast);
  rect(g, -0.12, -h - 0.15, 0.24, 0.18, shade(C.mast, 0.3));
  line(g, [[-0.05, -h * 0.82], [-2.0, -0.7]], '#3a342c', 0.035);
  line(g, [[0.05, -h * 0.82], [2.0, -0.7]], '#3a342c', 0.035);
  if (flag) e.layer('flag', { pivot: [0.07, -h * 0.55], wind: { strength: 0.9, gust: 0.6 } }, g => {
    // the red ensign, upside down — the signal of distress
    poly(g, [[0.07, -h * 0.55], [1.5, -h * 0.55 + 0.05], [1.5, -h * 0.55 + 0.75], [0.07, -h * 0.55 + 0.7]], '#a8302a');
    rect(g, 0.07, -h * 0.55 + 0.35, 0.65, 0.35, '#24305a');
    line(g, [[0.07, -h * 0.55 + 0.35], [0.72, -h * 0.55 + 0.7]], '#ece6d8', 0.06);
    line(g, [[0.07, -h * 0.55 + 0.7], [0.72, -h * 0.55 + 0.35]], '#ece6d8', 0.06);
  });
}
// A gaff sail seen aslant from aft (x from the mast out along the boom, y up from the boom): the cloth between the
// mast, the gaff and the boom — a layer `sail` its animate shortens from the boom up as she is reefed; the boom below
// it; her number on the mainsail
function gaffSail(g, e, boom, luff, number) {
  rect(g, 0, -0.06, boom, 0.12, shade(C.mast, 0.2));
  e.layer('sail', { pivot: [0, 0] }, g => {
    poly(g, [[0.1, -0.1], [0.1, -luff], [boom * 0.8, -luff - 1.8], [boom, -0.15]], C.sail);
    line(g, [[0.1, -luff], [boom * 0.8, -luff - 1.8]], shade(C.mast, 0.2), 0.1);
    g.fillStyle = 'rgba(150,140,120,0.4)';
    for (let k = 1; k < 4; k++) g.fillRect(0.1, -k * 0.7, boom * 0.95, 0.03);
    if (number) {
      g.fillStyle = '#2a2a2a';
      g.font = 'bold 1.4px serif';
      g.textAlign = 'center';
      g.fillText('43', boom * 0.45, -luff * 0.55);
    }
  });
}

// ── The film ──
const WHO = ['fogg', 'aouda', 'fix', 'bunsby'];
const toward = ([a, d], [a2, d2]) => ((Math.atan2(a2 - a, d2 - d) * 180) / Math.PI + 360) % 360;
const OFF = id => ({ [`${id}_a`]: 0, [`${id}_d`]: -3, [`${id}_here`]: false, [`${id}_do`]: 'stand', [`${id}_turn`]: 180,
  [`${id}_look`]: null, [`${id}_reach`]: null, [`${id}_with`]: null, [`${id}_gait`]: null, [`${id}_mood`]: null });
const NOBODY = () => Object.assign({}, ...WHO.map(OFF));
const at = (id, [a, d], turn, more = {}) => ({ [`${id}_a`]: a, [`${id}_d`]: d, [`${id}_here`]: true, [`${id}_turn`]: turn,
  ...Object.fromEntries(Object.entries(more).map(([k, v]) => [`${id}_${k}`, v])) });
const CAM = { camera_glide: 0, camera_target: null, camera_shot: null, camera_frame: null, camera_x: -0.45, camera_z: 0, camera_h: -0.55, camera_look: 0.02 };
// a point of the boat (her own metres) for a look or a reach: it goes with her
const aboard = (a, d, h) => ({ on: 'frame', at: [a, d, h] });
const BRACE = { motion: 'storm_brace', loop: true, from: 0 };
// where they are: Bunsby at the tiller; Fogg by the port rail, Aouda beside him, Fix by the starboard rail — aft, turned
// aft from the spray
const SPOT = {
  bunsby: [0.95, -5.9], bunsby_gun: [0.35, 6.4],
  fogg: [-1.45, -3.0], aouda: [-0.75, -3.75], fix: [1.4, -2.6],
};
const QUIET = { storm: 0, reef: 0, wave: 0, wave_h: 0.35, helm: 0, heel: 0, green_water: 0, wave_from: 0, flag: 0, steamer: 0, steamer_turn: 0, gun_flash: 0 };

// `party` — keys the film takes as given over the scene's (the showcase's: everyone aboard)
function film(scene, party = {}) {
  const get = (k, or = 0) => { const v = k in party ? party[k] : scene.get(k); return v == null ? or : v; };
  const withIt = k => get(k, 0) > 0.5;
  const W = scene.kit.cast.wears;
  const wear = {
    fogg: () => ({ hat: 'tophat' }),
    aouda: () => (get('aouda_dress') > 0.5 ? W.aouda_dress : null),
    fix: () => (get('fix_bruise') > 0.5 ? W.fix_bruise : null),
  };
  const P = (id, spot, turn, more) => ({ [`${id}_wear`]: wear[id] ? wear[id]() : null, ...at(id, spot, turn, more) });
  // who is aboard: Fogg and Bunsby always; Aouda and Fix as the game says
  const ABOARD = (more = {}) => ({
    ...NOBODY(),
    ...P('bunsby', SPOT.bunsby, 335, { do: BRACE, reach: { r: 'tiller#tiller', l: 'tiller#tiller' }, look: aboard(0, 30, 2) }),
    ...P('fogg', SPOT.fogg, 160, { do: BRACE, reach: { l: aboard(-2.05, -3.2, 0.75) }, look: aboard(-0.2, -7.5, 1.4) }),
    ...(withIt('with_aouda') ? P('aouda', SPOT.aouda, 165, { do: BRACE, look: aboard(0.4, -7.5, 1.6) }) : {}),
    ...(withIt('with_fix') ? P('fix', SPOT.fix, 200, { do: BRACE, reach: { l: aboard(2.05, -2.5, 0.75) }, look: 'fogg#head', mood: 'afraid' }) : {}),
    ...party,
    ...more,
  });
  // the wide shot from the stern, low: the deck, the people braced aft, the bow and what comes at it
  const SQUALL = () => ({ ...QUIET, ...CAM, ...ABOARD() });
  const STORM = () => ({ ...QUIET, storm: 0.9, reef: 1, wave_h: 0.6, ...CAM, ...ABOARD() });
  const STILLER = () => ({ ...STORM(), storm: 0.45, wave_h: 0.4 });

  const B = {
    // ---- The sky darkens, the wind gets up; Bunsby has the sails reefed (they shorten from the boom up) and turns
    // to Fogg (his line) — the typhoon.
    squall: {
      from: SQUALL,
      run: async s => {
        const bunsby = s.person('bunsby');
        s.move('storm', 0.6, { over: 7, ease: 'inOut' });
        s.move('wave_h', 0.55, { over: 7 });
        await s.wait(2.4);
        await s.move('reef', 1, { over: 3, ease: 'inOut' });
        bunsby.look('fogg#head');
        s.tell('squall:reef');
        await s.wait(2.4);
      },
    },
    // ---- The typhoon at its height: the camera low at the stern, all holding on; the game's «The typhoon» drives
    // the crests (`wave`), the helm, the heel, the green water. The beat only brings the storm up and holds.
    typhoon: {
      after: 'squall',
      from: STORM,
      run: async s => {
        s.person('bunsby').look(aboard(0, 30, 2));
        s.move('reef', 1, { over: 1 });
        await s.move('storm', 0.9, { over: 2.5, ease: 'inOut' });
        s.move('wave_h', 0.6, { over: 1 });
      },
    },
    // ---- Close: Aouda in the spray, calm, braced, her eyes on the sea astern (only with her aboard).
    aouda_storm: {
      after: 'typhoon',
      from: STORM,
      run: async s => {
        const aouda = s.person('aouda');
        aouda.look(aboard(0.6, -9, 2.2));
        s.camera({ target: 'aouda', shot: 1.4, frame: [0.5, 0.42], glide: 1.6 });
        await s.wait(2.2);
        aouda.look(aboard(-0.2, -9, 1.4));
        await s.wait(2.6);
        s.camera({ target: null, glide: 1.6 });
        await s.wait(0.6);
      },
    },
    // ---- The storm dies down; a steamer's smoke on the horizon; Bunsby goes forward to the bow gun, the flag at
    // half-mast; the shot; the steamer turns toward them.
    shanghai: {
      after: ['typhoon', 'aouda_storm'],
      from: STILLER,
      run: async s => {
        const bunsby = s.person('bunsby');
        s.move('storm', 0.2, { over: 5, ease: 'inOut' });
        s.move('wave_h', 0.3, { over: 5 });
        s.set('steamer', 1);
        await s.wait(2.2);
        bunsby.reach(null);
        bunsby.do('stand', { loop: true });
        s.set('flag', 1);
        await bunsby.walk([[0.8, -2.0], [0.6, 3.0], SPOT.bunsby_gun]);
        await bunsby.turn(0);
        bunsby.reach({ r: 'bowsprit#breech' });
        await s.wait(0.6);
        s.set('gun', get('gun') + 1);
        s.tell('shanghai:gun');
        bunsby.reach(null);
        await s.wait(2.4);
        await s.move('steamer_turn', 1, { over: 4, ease: 'inOut' });
        s.tell('shanghai:turns');
        await s.wait(2);
      },
    },
  };
  return B;
}
// the showcase's own beat: a few crests met as the game's «The typhoon» would drive them (the boat steered into each)
function showcaseOnly(scene) {
  return {
    typhoon_show: {
      after: 'typhoon',
      from: () => film(scene, SHOW_PARTY).typhoon.from(),
      run: async s => {
        for (const from of [-0.6, 0.6, -0.4]) {
          s.set('wave_from', from);
          s.set('wave', 0);
          s.move('helm', from, { over: 1.8, ease: 'inOut' });
          await s.move('wave', 0.5, { over: 2.6, ease: 'linear' });
          s.move('helm', 0, { over: 1.2, ease: 'inOut' });
          if (from === 0.6) { s.set('green_water', 1); s.move('heel', 0.6, { over: 0.6 }); }
          await s.move('wave', 1, { over: 2.4, ease: 'linear' });
          s.set('green_water', 0);
          s.move('heel', 0, { over: 1 });
        }
      },
    },
  };
}
const SHOW_PARTY = { with_aouda: 1, with_fix: 1 };
const SHOWCASE = ['squall', 'typhoon', 'typhoon_show', 'aouda_storm', 'shanghai'];

return { plan, C, pose, SHOW_PARTY, poly, rect, line, shade, tint, bulwark, mast, gaffSail, film, showcaseOnly, SHOWCASE, SPOT, toward, clamp01, mixc, css, rgba, glow, bump };
