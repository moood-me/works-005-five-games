// «Гавань» — the harbour's plan, what several elements paint and move, and its film (film(scene): the world's module
// beats). Metres: `across` along the quay (left negative), `d` ahead of the viewer, who stands on the quay looking out
// over the water; the water is 1.6 m below the quay. Everything is painted once, in daylight colours: the evening, the
// night and the lit lanterns are the scene's light and the elements' animate (notes.md).
const { mixc, rgba, glow } = kit.svet;
const clamp01 = v => anim.clamp(typeof v === 'number' ? v : 0, 0, 1);

const plan = {
  // the water's level (the quay is the ground), and where the quay's edge is
  water: -1.6,
  edge: 5,
  // the tavern on its piles over the water, left: the house and the terrace before it, out from the quay
  tavern: { across: -36, d: 17, half: 7, deep: 6, wall: 6.4, ridge: 8.6, floor: 3.2 },
  // its openings, [x, sill, width, height]: the doors onto the terrace below, the windows above
  openings: [[-4.6, 0, 2.2, 2.6], [0, 0, 2.8, 2.7], [4.6, 0, 2.2, 2.6], [-4.6, 4.0, 1.6, 1.5], [-1.6, 4.0, 1.6, 1.5], [1.6, 4.0, 1.6, 1.5], [4.6, 4.0, 1.6, 1.5]],
  terrace: { from: -43, to: -29 },
  // the pier: its walk out from the quay and the jetty across its head, where the steamer lies
  pier: { across: 12, w: 3.5, to: 76 },
  jetty: { from: -2, to: 36, d: [76, 80] },
  // the steamer at the jetty (on its anchor at the waterline: x along her, her bow to the right): half her length,
  // half her beam, her deck and her bulwark's top over the water, her funnel (where, its top) and her masts (where,
  // their tops)
  steamer: { across: 4, d: 85, half: 36, beam: 4.5, deck: 4.6, rail: 5.6, funnel: [-4, 15.5], masts: [[-19, 27], [13, 25]] },
  // the pontoon on the right, floating low by the quay (a ramp down to it): the pilot boat lies off its head (Hong
  // Kong), Batulcar's stage stands on it (Yokohama)
  landing: { across: 38, half: 8, d: [7, 18], level: -1.3 },
  boat: { across: 41, d: 20.6, half: 9, beam: 2.2, deck: 2.0, masts: [[-3.2, 15], [3.6, 13]] },
  stage: { across: 38, half: 5, d: [12, 16], h: 2.5, back: 16.6 },
  // the low wall along the quay's edge, open at the steps down to the water, at the pier and at the landing
  parapet: [[-27, -9.5], [18, 29]],
  steps: { across: -8, w: 2.6 },
};

// the steamer's sheer: her rail's height over the water x along her, rising to her bow and her stern
const sheer = x => plan.steamer.rail + 0.7 * (x / plan.steamer.half) ** 2;

// the port: Hong Kong or Yokohama (changes only at a cut: paintings read it)
const portOf = state => (state.port === 'yokohama' ? 'yokohama' : 'hongkong');

// The steamer going out (`carnatic_present` 1 → 0): at the jetty, then backing off it, swinging her bow out to the
// right and steaming away to the harbour's mouth, off into the haze — where she is at each value: [across, d, facing].
// The script puts her there (steamer_x, steamer_d, steamer_facing); her smoke comes out of her funnel wherever it is.
function steamerAt(present) {
  const S = plan.steamer;
  const u = 1 - anim.clamp(present ?? 1, 0, 1);
  const back = anim.ease.inOut(anim.span(u, 0, 0.3));
  const turn = anim.ease.inOut(anim.span(u, 0.15, 0.55));
  const go = anim.ease.in(anim.span(u, 0.35, 1));
  // (going, she goes the way her bow points)
  return [S.across + 30 * turn + 850 * go, S.d + 22 * back + 60 * turn + 530 * go, 180 - 32 * turn];
}
// The pilot boat putting out (`tankadere_out` 0 → 1): off the landing, out past the steamer to the mouth.
function boatAt(out) {
  const B = plan.boat;
  const u = anim.clamp(out ?? 0, 0, 1);
  const off = anim.ease.inOut(anim.span(u, 0, 0.3));
  const go = anim.ease.in(anim.span(u, 0.2, 1));
  return [B.across + 14 * off + 720 * go, B.d + 10 * off + 340 * go, 180 - 25 * off];
}

// The far shore's profile, x along it (metres from the middle of the view), its height there: Hong Kong's peak over
// the town on the island; Yokohama's low bluffs, the hill with the pagoda on the left.
function shore(port, x) {
  const bump = (c, w, h) => h * Math.exp(-(((x - c) / w) ** 2));
  if (port === 'yokohama') return 16 + bump(-380, 160, 70) + bump(-150, 120, 45) + bump(260, 260, 40) - 10 * anim.span(x, 450, 800);
  return 16 + bump(-160, 230, 280) + bump(-470, 170, 170) + bump(220, 180, 110) + bump(-900, 260, 80) - 12 * anim.span(x, 400, 800);
}

// The far shore's houses, [x, y (its foot over the water), width, height, tone 0…1]: thick along the water in the
// middle (Victoria; Yokohama's front), thinning out along the shore and up the hill. The same for its painting and its
// lights.
function houses(port) {
  const out = [];
  const spread = port === 'yokohama' ? 520 : 420;
  for (let i = 0; i < 900; i++) {
    const x = -1100 + 2100 * anim.hash(i, 41);
    const up = anim.hash(i, 42) ** (port === 'yokohama' ? 2.2 : 1.6);
    const ground = shore(port, x);
    const y = 4 + up * (port === 'yokohama' ? 0.8 : 0.45) * (ground - 14);
    const near = Math.exp(-(((x + (port === 'yokohama' ? 60 : 140)) / spread) ** 2));
    if (anim.hash(i, 43) > near * (1 - 0.75 * up) + 0.04) continue;
    const big = up < 0.05 && anim.hash(i, 44) < 0.4;
    out.push([x, y, big ? 14 + 10 * anim.hash(i, 45) : 5 + 5 * anim.hash(i, 45), big ? 12 + 8 * anim.hash(i, 46) : 4 + 3 * anim.hash(i, 46), anim.hash(i, 47)]);
  }
  return out;
}

// ── Lanterns ──
// A paper lantern hanging at (x, y): round, ribbed, its caps dark; its light (e.light, named `name`) at full strength —
// the element's animate lets it burn as much as `lanterns` says (e.glow), and the light lights its own paper.
function lantern(e, g, x, y, r, color, name = 'lamp') {
  g.fillStyle = color;
  g.beginPath();
  g.ellipse(x, y, r, r * 1.15, 0, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = 'rgba(0,0,0,0.18)';
  g.lineWidth = r * 0.06;
  for (const k of [-0.5, 0, 0.5]) {
    g.beginPath();
    g.ellipse(x, y, r * Math.sqrt(1 - k * k), r * 1.15, 0, -Math.PI / 2, Math.PI / 2);
    g.stroke();
  }
  g.fillStyle = '#2a2420';
  g.fillRect(x - r * 0.45, y - r * 1.25, r * 0.9, r * 0.2);
  g.fillRect(x - r * 0.45, y + r * 1.05, r * 0.9, r * 0.2);
  e.light(x, y, r * 1.2, kit.svet.css(mixc(color, '#fff0d0', 0.35)), 0.8, name);
}
// The double a dazed eye sees of a lantern (`daze`): its glow alone, in the element's layer `ghost` — the animate
// carries it aside and lets it burn as much as the daze (dazed()).
const ghost = (e, x, y, r, color) => e.light(x, y, r * 1.6, color, 0.5, 'ghost');
// A row of lanterns hanging from a sagging string, each its own layer swinging from its hook in the wind (the middle one's
// light named `middle`: the scene's light over the terrace), their doubles in the layer `ghost`. `half` either side of
// the middle, the string `high` over the anchor, n lanterns; poles down to `foot` metres below the anchor unless it
// hangs from eaves (foot null).
const LANTERN_R = 0.21;
function lanternRow(e, g, { half, high, n, foot, middle, colors }) {
  const r = LANTERN_R;
  const sag = x => -high + 0.45 * (1 - (x / half) ** 2);
  g.fillStyle = '#3a2c20';
  if (foot != null) for (const s of [-1, 1]) g.fillRect(s * half - 0.06, -high - 0.3, 0.12, high + 0.3 + foot);
  g.strokeStyle = '#2a2420';
  g.lineWidth = 0.025;
  g.beginPath();
  for (let x = -half; x <= half; x += 0.25) g.lineTo(x, sag(x));
  g.stroke();
  const at = [];
  for (let i = 0; i < n; i++) {
    const x = -half + ((i + 0.5) * 2 * half) / n, y = sag(x);
    const color = colors[i % 2];
    at.push([x, y + 0.4, color]);
    e.layer(`l${i}`, { pivot: [x, y], wind: { strength: 0.12, gust: 0.6 } }, g => {
      g.strokeStyle = '#2a2420';
      g.lineWidth = 0.02;
      g.beginPath();
      g.moveTo(x, y);
      g.lineTo(x, y + 0.4 - r * 1.25);
      g.stroke();
      lantern(e, g, x, y + 0.4, r, color, middle && i === Math.floor(n / 2) ? middle : 'lamp');
    });
  }
  e.layer('ghost', { shimmer: 0.4 }, () => { for (const [x, y, c] of at) ghost(e, x, y, r, c); });
}
// how lit the lanterns are and how dazed the eye: the glows burn so (the middle one's, `middle`, is the scene light's —
// its `on`), the doubles drift aside and swim. r — the lanterns' radius.
// x, y — where the element's motion has the lanterns (a boat's way and bob).
function dazed(e, r = LANTERN_R, x = 0, y = 0) {
  const gh = e.layer('ghost');
  if (!gh.scaleX) return; // (nothing painted: Yokohama's lanterns in Hong Kong)
  const lit = clamp01(e.state.lanterns), daze = clamp01(e.state.daze);
  e.glow('lamp', lit);
  gh.x = x + r * daze * (3 + 0.8 * anim.noise(e.t * 0.25, 7));
  gh.y = y - r * daze * (1 + 0.6 * anim.noise(e.t * 0.2, 9));
  e.glow('ghost', lit * daze);
}
const LANTERN_COLORS = port => (port === 'yokohama' ? ['#f6ead2', '#f0dcc0'] : ['#e8503a', '#f0b040']);

// A wooden wall seen at its face: boards, from x0 to x1 and up to `top` (y down) — the tavern, the stage.
function boards(g, x0, x1, top, color, step = 0.22) {
  g.fillStyle = color;
  g.fillRect(x0, -top, x1 - x0, top);
  g.fillStyle = 'rgba(0,0,0,0.14)';
  for (let y = step; y < top; y += step) g.fillRect(x0, -y, x1 - x0, 0.015);
}

// ── The haze lying on the water ──
// Long slow banks at one depth, `half` metres either side: two layers drifting round their box, one each way (their
// ends meet), painted in the day's pale colour — the scene's light makes it warm toward evening, grey-blue at night,
// lit where the lanterns are.
function mist(e, half, seed) {
  const W = 2 * half;
  const h = anim.hash;
  [['east', 1], ['west', -1]].forEach(([name, sign], k) => {
    e.layer(name, { box: [-half, -12, half, 4], drift: [sign * (0.2 + 0.25 * h(seed, k + 1)), 0] }, g => {
      for (let i = 0; i < Math.round(half / 25); i++) {
        const x = -half + W * h(i, seed * 7 + k), y = -1 - 3 * h(i, seed * 7 + k + 2);
        const r = 18 + 16 * h(i, seed * 7 + k + 3), a = 0.12 + 0.08 * h(i, seed * 7 + k + 4);
        for (const dx of [-W, 0, W]) glow(g, x + dx, y, r, '#e6e8e4', a, 0.18);
      }
    });
  });
}

// ── The small craft on the water ──
// Each boat its own element (boat_0 … boat_10) at its distance; its layer `boat` rocks and bobs, a boat that goes
// slowly across is carried by its animate (a steady pace, round again 400 m off either way — its element at across 0,
// its box the whole way). [across (start), distance, pace m/s (0: lying still), facing right (1) or left (−1), sails
// (a junk's: 0 two, 1 three), its own phase 0…1]
const BOATS = [
  [-170, 132, 0, 1, 0, 0.12], [64, 168, -0.32, -1, 1, 0.47], [-38, 214, 0, -1, 1, 0.83], [215, 260, 0.18, 1, 0, 0.29],
  [-260, 305, 0, 1, 1, 0.64], [120, 338, 0, -1, 0, 0.05], [-95, 382, 0.26, 1, 1, 0.91], [300, 412, 0, -1, 0, 0.38],
  [-5, 438, -0.14, -1, 0, 0.71], [-330, 448, 0, 1, 0, 0.22], [176, 98, 0, -1, 1, 0.56],
];
const BOAT_WAY = 400;
// its painting: a junk (Hong Kong) or a sampan under its mat roof (Yokohama), its stern lantern; the double of the lantern
function boat(e, i) {
  const [x0, , pace, flip, three] = BOATS[i];
  const port = portOf(e.state);
  const yoko = port === 'yokohama';
  const at = pace ? x0 : 0; // (a boat that goes is painted where it starts: its element stands at across 0)
  const lamp = yoko ? [-3.4, -1.5, 0.22, '#fff2dc'] : [-8.4, -4.2, 0.35, '#ff7a3a'];
  e.layer('boat', { pivot: [at, 0] }, g => {
    g.save();
    g.translate(at, 0);
    g.scale(flip, 1);
    if (yoko) {
      // a sampan: a low hull rising to the bow, the mat roof amidships, the oar astern
      g.fillStyle = '#3a3026';
      g.beginPath();
      g.moveTo(-4, -0.4);
      g.lineTo(3.2, -0.5);
      g.quadraticCurveTo(4.2, -0.6, 4.6, -1.3);
      g.lineTo(3.6, 0);
      g.lineTo(-3.8, 0);
      g.closePath();
      g.fill();
      g.fillStyle = '#8a7a5c';
      g.beginPath();
      g.moveTo(-1.8, -0.5);
      g.quadraticCurveTo(0, -2.2, 1.8, -0.5);
      g.closePath();
      g.fill();
      g.strokeStyle = '#3a3026';
      g.lineWidth = 0.08;
      g.beginPath();
      g.moveTo(-3.6, -0.6);
      g.lineTo(-5.6, 0.2);
      g.stroke();
    } else {
      // a junk: the high stern, the bluff bow, two or three battened sails
      g.fillStyle = '#2e2620';
      g.beginPath();
      g.moveTo(-9, -3.2);
      g.lineTo(-6, -1.6);
      g.lineTo(7, -1.4);
      g.lineTo(9, -2.4);
      g.lineTo(7.5, 0);
      g.lineTo(-7.5, 0);
      g.closePath();
      g.fill();
      const sails = three ? [[-4.5, 12], [1, 14], [5.5, 8]] : [[-3, 13], [3.5, 10]];
      sails.forEach(([mx, tall], k) => {
        g.fillStyle = rgba(mixc('#7a4a32', '#9a6a46', anim.hash(i * 3 + k, 8)));
        g.beginPath();
        g.moveTo(mx - 1.2, -1.8);
        g.lineTo(mx - 1.6, -tall);
        g.quadraticCurveTo(mx + tall * 0.25, -tall - 1.2, mx + tall * 0.4, -tall * 0.85);
        g.lineTo(mx + tall * 0.35, -1.8);
        g.closePath();
        g.fill();
        g.strokeStyle = 'rgba(30,20,14,0.6)';
        g.lineWidth = 0.12;
        for (let b = 1; b < 6; b++) {
          const y = -1.8 - ((tall - 1.8) * b) / 6;
          g.beginPath();
          g.moveTo(mx - 1.4, y);
          g.lineTo(mx + tall * 0.38, y + 0.6);
          g.stroke();
        }
        g.fillStyle = '#2e2620';
        g.fillRect(mx - 0.12, -tall - 0.8, 0.24, tall);
      });
    }
    lantern(e, g, lamp[0], lamp[1], lamp[2], lamp[3]);
    g.restore();
  });
  e.layer('ghost', { shimmer: 0.4 }, () => ghost(e, at + flip * lamp[0], lamp[1], lamp[2], lamp[3]));
}
// its motion: across at its pace (round again), bobbing and rocking on the swell, never in step with the others
const wrap = v => ((((v + BOAT_WAY) % (2 * BOAT_WAY)) + 2 * BOAT_WAY) % (2 * BOAT_WAY)) - BOAT_WAY;
function boatLive(e, i) {
  const [x0, , pace, , , ph] = BOATS[i];
  const t = e.t;
  const x = pace ? wrap(x0 + pace * t) - x0 : 0;
  const bob = 0.15 * Math.sin(t * (0.5 + 0.3 * ph) + i);
  const b = e.layer('boat');
  b.x = x;
  b.y = bob;
  b.rotate = 0.03 * Math.sin(t * (0.55 + 0.25 * ph) + 1.7 * i) + 0.01 * anim.noise(t * 0.3, i);
  dazed(e, 0.3, x, bob);
}

// ── The film (the world's module beats), for the game and the showcase: film(scene) — its beats read the scene's own
// settings (Aouda's dress, whether she is with him) as they cut ──
// at the parapet, where Aouda waits looking out (parapet#parapet); where Passepartout stands by her; where Fogg comes to,
// and where he comes from along the quay
const BY_WALL = [-18, 4.15], PP_BY = [-16.9, 3.95], TO_HER = [-15.4, 3.6], ALONG = [-5, 3.2];
// the tavern's table by the rail (tables#table) and its two stools: Passepartout's (facing right), Fix's (left)
const TABLE = [-40.2, 6.6], STOOL = { passepartout: [-40.95, 6.6], fix: [-39.45, 6.6] };
const BOTTLE = [TABLE[0] + 0.15, TABLE[1], 0.95], CUP = [TABLE[0] - 0.1, TABLE[1], 0.82];
// Passepartout's way in the opium (`pp_walk` 0…1): off the terrace, along the quay, out along the pier toward the steamer
const WAY = [[-31, 3.6], [-12, 3.3], [10.6, 3.6], [12, 6.5], [12, 40], [12.4, 70]];
const LENS = WAY.slice(1).map((p, i) => Math.hypot(p[0] - WAY[i][0], p[1] - WAY[i][1]));
const WAY_LEN = LENS.reduce((a, b) => a + b, 0);
// where `pp_walk` v is along the way
function along(v) {
  let left = anim.clamp(v, 0, 1) * WAY_LEN, i = 0;
  while (i < LENS.length - 1 && left > LENS[i]) left -= LENS[i++];
  const f = LENS[i] ? left / LENS[i] : 0;
  return [WAY[i][0] + (WAY[i + 1][0] - WAY[i][0]) * f, WAY[i][1] + (WAY[i + 1][1] - WAY[i][1]) * f];
}
// the way's points from `from` on to `to` (both in pp_walk's units, from < to): where he walks
function wayBetween(from, to) {
  const pts = [];
  let s = 0;
  for (let i = 0; i < LENS.length; i++) {
    s += LENS[i];
    const v = s / WAY_LEN;
    if (v > from + 1e-4 && v < to - 1e-4) pts.push(WAY[i + 1].slice());
  }
  pts.push(along(to));
  return pts;
}
// where a point [a, d] is along the way, in pp_walk's units (the nearest point of it)
function wayOf(a, d) {
  let best = Infinity, at = 0, s = 0;
  for (let i = 0; i < LENS.length; i++) {
    const [x0, y0] = WAY[i], [x1, y1] = WAY[i + 1], dx = x1 - x0, dy = y1 - y0;
    const f = LENS[i] ? anim.clamp(((a - x0) * dx + (d - y0) * dy) / (LENS[i] * LENS[i]), 0, 1) : 0;
    const q = Math.hypot(x0 + dx * f - a, y0 + dy * f - d);
    if (q < best) { best = q; at = (s + f * LENS[i]) / WAY_LEN; }
    s += LENS[i];
  }
  return at;
}
// by the pier's foot in the morning, looking out where the steamer lay
const PIER_FOOT = { fogg: [9.4, 4.0], aouda: [8.3, 4.1] };
const TRAVEL = { garment: 'dress', colors: { garment: '#3c4a5a', top: '#3c4a5a', accent: '#c9b98f' } };
const WHO = ['fogg', 'aouda', 'passepartout', 'fix'];
const toward = ([a, d], [a2, d2]) => ((Math.atan2(a2 - a, d2 - d) * 180) / Math.PI + 360) % 360;
const OFF = id => ({ [`${id}_a`]: -60, [`${id}_d`]: 3.5, [`${id}_here`]: false, [`${id}_do`]: 'stand', [`${id}_turn`]: 0,
  [`${id}_look`]: null, [`${id}_reach`]: null, [`${id}_with`]: null, [`${id}_gait`]: null });
const NOBODY = () => Object.assign({}, ...WHO.map(OFF));
const CAM0 = { camera_glide: 0, camera_target: null, camera_shot: null, camera_frame: null, camera_x: 0, camera_roll: 0 };
const loop = (motion, from = 0) => ({ motion, loop: true, from });
// the light and the ships at the film's moments
const LIGHT = {
  day: { port: 'hongkong', evening: 0, night: 0, lanterns: 0.4, daze: 0, carnatic_present: 1, tankadere_out: 0, sail: 0, pp_walk: 0 },
  tavern: { port: 'hongkong', evening: 1, night: 0.4, lanterns: 1, daze: 0, carnatic_present: 1, tankadere_out: 0, sail: 0, pp_walk: 0 },
  night: { port: 'hongkong', evening: 1, night: 1, lanterns: 1, daze: 0, carnatic_present: 1, tankadere_out: 0, sail: 0, pp_walk: 0 },
};

function film(scene) {
  const travel = () => ((scene.get('aouda_dress') ?? 0) > 0.5 ? TRAVEL : null);
  // the quay by day: Aouda at the parapet, Passepartout by her; Fogg coming back along the quay
  const DAY = () => ({
    ...LIGHT.day, ...CAM0, camera_x: -16.5, ...NOBODY(),
    aouda_a: BY_WALL[0], aouda_d: BY_WALL[1], aouda_here: true, aouda_turn: 0, aouda_wear: travel(),
    passepartout_a: PP_BY[0], passepartout_d: PP_BY[1], passepartout_here: true, passepartout_turn: 330, passepartout_look: [-16, 40, 1],
    fogg_a: ALONG[0], fogg_d: ALONG[1], fogg_here: true, fogg_turn: 270, fogg_gait: 'fogg_walk', fogg_wear: { hat: 'tophat' },
  });
  // ... as the quay beat leaves it: Fogg before her, the three looking at each other
  const MET = () => ({
    ...DAY(), fogg_a: TO_HER[0], fogg_d: TO_HER[1], fogg_turn: toward(TO_HER, BY_WALL), fogg_look: 'aouda#head',
    passepartout_look: 'fogg#head', passepartout_turn: 70, aouda_turn: toward(BY_WALL, TO_HER), aouda_look: 'fogg#head',
  });
  // evening on the terrace: Passepartout and Fix at the table by the rail
  const TAVERN = () => ({
    ...LIGHT.tavern, ...CAM0, camera_target: 'fix', camera_shot: 0.55, camera_frame: 0.62, ...NOBODY(),
    passepartout_a: STOOL.passepartout[0], passepartout_d: STOOL.passepartout[1], passepartout_here: true, passepartout_turn: 90,
    passepartout_do: loop('talk_seated'), passepartout_look: 'fix#head',
    fix_a: STOOL.fix[0], fix_d: STOOL.fix[1], fix_here: true, fix_turn: 270, fix_do: loop('sit_calm'), fix_look: 'passepartout#head',
  });
  // the opium: Passepartout off the terrace (or as far along his way as `at`), reeling, the camera with him
  const DAZED = (at, daze) => {
    const [a, d] = along(at);
    return {
      ...LIGHT.tavern, ...CAM0, camera_target: 'passepartout', camera_shot: 'wide', camera_frame: [0.45, 0.62], ...NOBODY(),
      daze, camera_roll: 4 * daze, pp_walk: at, pp_walk_at: at,
      passepartout_a: a, passepartout_d: d, passepartout_here: true, passepartout_turn: 90, passepartout_gait: 'stagger_walk',
    };
  };
  // night on the quay, nobody there: the steamer at the jetty, smoking
  const NIGHT = () => ({ ...LIGHT.night, ...CAM0, camera_x: 8, ...NOBODY() });
  // morning, the jetty empty: Fogg (and Aouda) at the pier's foot
  const MORNING = () => ({
    ...LIGHT.day, ...CAM0, carnatic_present: 0, lanterns: 0.2, camera_x: 9, ...NOBODY(),
    fogg_a: PIER_FOOT.fogg[0], fogg_d: PIER_FOOT.fogg[1], fogg_here: true, fogg_turn: 10, fogg_wear: { hat: 'tophat' },
    aouda_a: PIER_FOOT.aouda[0], aouda_d: PIER_FOOT.aouda[1], aouda_here: (scene.get('with_aouda') ?? 1) > 0.5, aouda_turn: 5, aouda_wear: travel(),
  });
  const FAR = [14, 76, 1]; // where the steamer lay

  return {
    // ---- Hong Kong, day. Fogg comes back along the quay with the news; Aouda waits at the parapet, Passepartout by her.
    quay: {
      from: DAY,
      run: async s => {
        const fogg = s.person('fogg'), pp = s.person('passepartout'), aouda = s.person('aouda');
        await s.wait(0.4);
        const walk = fogg.walk([TO_HER]);
        await walk.ending(4);
        pp.look('fogg#head');
        await s.wait(0.5);
        pp.turn(70);
        await walk.ending(1.4);
        aouda.turn(toward(BY_WALL, TO_HER));
        await s.wait(0.2);
        aouda.look('fogg#head');
        await walk;
        await fogg.turn(toward(TO_HER, BY_WALL));
        fogg.look('aouda#head');
        s.tell('quay:met');
        await s.wait(2.5);
      },
    },
    // ---- (under the line) She listens, even; looks out over the water, and back to him; holds, under the choice.
    cousin: {
      after: 'quay',
      from: () => ({ ...MET(), camera_target: 'aouda', camera_shot: 0.6, camera_frame: 0.3, camera_x: 0 }),
      run: async s => {
        const aouda = s.person('aouda');
        // (the operator frames her; the quay's own sideways step, camera_x, is on top of a framing — taken off with it)
        s.camera({ target: 'aouda', shot: 0.6, frame: 0.3, glide: 1.6 });
        s.move('camera_x', 0, { over: 1.6, ease: 'inOut' });
        await s.wait(1.5);
        aouda.look([BY_WALL[0] - 1.5, 30, 1.5]);
        await s.wait(2.7);
        aouda.look('fogg#head');
        s.tell('cousin:looks-back');
        await s.wait(2);
      },
    },
    // ---- Evening. Passepartout and Fix at the table on the terrace; Fix fills his glass. (Under the lines.)
    tavern: {
      from: TAVERN,
      run: async s => {
        const fix = s.person('fix'), pp = s.person('passepartout');
        await s.wait(1);
        fix.look(BOTTLE);
        await s.wait(0.2);
        fix.reach({ r: BOTTLE });
        await s.wait(1.2);
        fix.reach({ r: CUP });
        fix.look(CUP);
        await s.wait(1.5);
        s.tell('tavern:poured');
        fix.reach(null);
        await s.wait(0.2);
        fix.look('passepartout#head');
        await s.wait(0.8);
        pp.look(CUP);
        await s.wait(1.6);
        pp.look('fix#head');
        await s.wait(1.4);
      },
    },
    // ---- Fix leans over and shows his badge; Passepartout is up on his feet.
    badge: {
      after: 'tavern',
      from: () => ({ ...TAVERN(), camera_target: 'passepartout', camera_shot: 0.65, camera_frame: 0.4 }),
      run: async s => {
        const fix = s.person('fix'), pp = s.person('passepartout');
        s.camera({ target: 'passepartout', shot: 0.65, frame: 0.4, glide: 1.5 });
        fix.with(['badge']);
        await s.wait(0.2);
        fix.reach({ r: [TABLE[0] + 0.05, TABLE[1], 0.95] });
        await s.wait(0.2);
        fix.look('passepartout#head');
        await s.wait(0.6);
        pp.look('fix#badge');
        s.tell('badge:shown');
        await s.wait(1);
        await pp.go('rise_table', { from: STOOL.passepartout, turn: 90 });
        s.tell('badge:up');
        pp.look('fix#head');
        await s.wait(1.4);
        fix.reach(null);
        await s.wait(0.2);
        fix.with(null);
        await s.wait(1.2);
      },
    },
    // ---- (the game's «Не уснуть»: `daze`, `pp_walk`, `pp_stumble`) Off the terrace, reeling, along the quay toward the
    // steamer: the film plays a stretch of it, as the game would — `pp_walk` sends him on, he stumbles.
    pipe: {
      from: () => DAZED(0, 0),
      run: async s => {
        s.move('daze', 0.6, { over: 4 });
        await s.wait(0.2);
        s.set('pp_walk', 0.16);
        await s.wait(6);
        s.set('pp_stumble', 1);
        await s.until(() => (s.get('pp_walk_at') ?? 0) >= 0.155);
        s.set('pp_stumble', 0);
        await s.wait(1);
      },
    },
    pipe_on: {
      after: 'pipe',
      from: () => DAZED(0.16, 0.6),
      run: async s => {
        s.set('pp_walk', 0.32);
        await s.wait(5);
        s.set('pp_stumble', 1);
        await s.until(() => (s.get('pp_walk_at') ?? 0) >= 0.315);
        s.set('pp_stumble', 0);
        await s.wait(1);
      },
    },
    // ---- Night: the steamer casts off from the jetty, backs, swings her bow out and makes for the harbour's mouth,
    // smoking — the start of her going (the game moves `carnatic_present` on to 0 as long as it wants her going to be).
    carnatic: {
      from: NIGHT,
      run: async s => {
        await s.wait(2);
        s.tell('carnatic:cast-off');
        await s.move('carnatic_present', 0.45, { over: 26, ease: 'inOut' });
      },
    },
    // ---- Morning. The jetty empty; Fogg (and Aouda) at the pier's foot look out where the steamer lay; his watch.
    morning: {
      from: MORNING,
      run: async s => {
        const fogg = s.person('fogg'), aouda = s.person('aouda');
        const close = s.shot({ camera_target: 'fogg', camera_shot: 0.8, camera_frame: 0.42, camera_x: 0 });
        await s.wait(0.6);
        fogg.look(FAR);
        await s.wait(0.6);
        aouda.look([12, 60, 1]);
        await s.wait(0.8);
        await s.until(() => close.ready);
        close.cut();
        await s.wait(0.2);
        await fogg.turn(270);
        const watch = fogg.do('watch_look');
        await s.wait(0.7);
        fogg.with(['watch']);
        fogg.look('fogg#watch');
        s.tell('morning:watch');
        await s.wait(2.2);
        fogg.with(null);
        fogg.look(FAR);
        await watch;
        aouda.look('fogg#head');
        await s.wait(2);
      },
    },
    // ---- Hong Kong, day: the pilot boat «Tankadere» raises her sails and puts off the landing (its people come with the
    // beats stay_behind and cast_off — to do).
    cast_off: {
      from: () => ({ ...LIGHT.day, ...CAM0, camera_x: 26, ...NOBODY() }),
      run: async s => {
        await s.wait(1);
        await s.move('sail', 1, { over: 7, ease: 'inOut' });
        s.tell('cast_off:sails-up');
        await s.move('tankadere_out', 0.3, { over: 16, ease: 'inOut' });
        await s.wait(1);
      },
    },
  };
}
// the showcase's own beats (outside games): the evening coming over the harbour; Yokohama at night
const SHOWCASE_ONLY = {
  evening: {
    from: () => ({ ...LIGHT.day, ...CAM0, camera_x: 2, ...NOBODY() }),
    run: async s => {
      s.move('evening', 1, { over: 16, ease: 'inOut' });
      await s.wait(6);
      s.move('lanterns', 1, { over: 6 });
      await s.wait(6);
      await s.move('night', 0.4, { over: 8, ease: 'inOut' });
    },
  },
  yokohama: {
    from: () => ({ ...LIGHT.night, port: 'yokohama', ...CAM0, camera_x: 30, ...NOBODY() }),
    run: async s => {
      await s.wait(2);
      await s.move('camera_x', -6, { over: 18, ease: 'inOut' });
      await s.wait(3);
    },
  },
};
const SHOWCASE = ['quay', 'cousin', 'evening', 'tavern', 'badge', 'pipe', 'pipe_on', 'carnatic', 'morning', 'cast_off', 'yokohama'];

return {
  plan, sheer, portOf, steamerAt, boatAt, shore, houses, lantern, ghost, lanternRow, dazed, LANTERN_COLORS, boards,
  mist, BOATS, boat, boatLive, film, SHOWCASE_ONLY, SHOWCASE, along, wayBetween, wayOf, clamp01, mixc, rgba, glow,
};
