// «The harbour» — the harbour's plan, what several elements paint and move, and its film (film(scene): the world's module
// beats). Metres: `across` along the quay (left negative), `d` ahead of the viewer, who stands on the quay looking out
// over the water; the water is 1.6 m below the quay. Everything is painted once, in daylight colours: the evening, the
// night and the lit lanterns are the scene's light and the elements' animate (notes.md).
const { mixc, rgba, glow } = kit.light;
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
  e.light(x, y, r * 1.2, kit.light.css(mixc(color, '#fff0d0', 0.35)), 0.8, name);
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
// settings (Aouda's dress, whether she and Fix are with him) as they cut ──
// at the parapet, where Aouda waits looking out (parapet#parapet); where Passepartout stands by her; where Fogg comes to,
// and where he comes from along the quay
const BY_WALL = [-18, 4.15], PP_BY = [-16.9, 3.95], TO_HER = [-15.4, 3.6], ALONG = [-5, 3.2];
// the tavern's table by the rail (tables#table) and its two stools: Passepartout's (facing right), Fix's (left)
const TABLE = [-40.2, 6.6], STOOL = { passepartout: [-40.95, 6.6], fix: [-39.45, 6.6] };
const BOTTLE = [TABLE[0] + 0.15, TABLE[1], 0.95], CUP = [TABLE[0] - 0.1, TABLE[1], 0.82];
// Passepartout's way in the opium («Stay awake»: `pp_walk` 0…1): up from the stool, off the terrace onto the quay and
// along it to the top of the steps down to the water, where the boatman waits with his lantern (at 0.97 of the way)
const WAY = [[-41.5, 6.6], [-40.4, 4.0], [-24, 3.5], [-8.6, 4.3]];
const LENS = WAY.slice(1).map((p, i) => Math.hypot(p[0] - WAY[i][0], p[1] - WAY[i][1]));
const WAY_LEN = LENS.reduce((a, b) => a + b, 0);
// where `pp_walk` v is along the way
function along(v) {
  let left = anim.clamp(v, 0, 1) * WAY_LEN, i = 0;
  while (i < LENS.length - 1 && left > LENS[i]) left -= LENS[i++];
  const f = LENS[i] ? left / LENS[i] : 0;
  return [WAY[i][0] + (WAY[i + 1][0] - WAY[i][0]) * f, WAY[i][1] + (WAY[i + 1][1] - WAY[i][1]) * f];
}
// the way's points from `from` on to `to` (both in pp_walk's units, from < to): where he walks — the last of them as
// far aside as he lurches (`sway` −1…1: toward the town … toward the water), on the quay
function wayBetween(from, to, sway = 0) {
  const pts = [];
  let s = 0;
  for (let i = 0; i < LENS.length; i++) {
    s += LENS[i];
    const v = s / WAY_LEN;
    if (v > from + 1e-4 && v < to - 1e-4) pts.push(WAY[i + 1].slice());
  }
  const [a, d] = along(to);
  pts.push([a, d < 5 ? anim.clamp(d + 0.9 * anim.clamp(sway, -1, 1), 2.6, 4.4) : d]);
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
// the boatman's sampan lying at the foot of the steps, and its way off across the water toward the town with the news
const SAMPAN = [-7.6, 9.4, 180], SAMPAN_OFF = [[-11, 15, 200], [-40, 70, 195], [-90, 190, 190]];
// by the pier's foot in the morning, looking out where the steamer lay
const PIER_FOOT = { fogg: [9.4, 4.0], aouda: [8.3, 4.1] };
const TRAVEL = { garment: 'dress', colors: { garment: '#3c4a5a', top: '#3c4a5a', accent: '#c9b98f' } };
// the night the Carnatic sails: where Passepartout comes reeling along the jetty to the foot of her gangway
const JETTY_IN = [13.2, 78.4], GANGWAY_FOOT = [17.4, 79.6];
// the Tankadere at the landing: Bunsby by her side, Fogg and Aouda before him; Fix coming down the ramp from the quay
// (all of them off the stage's boards, d 12…16: its plane is a floor people stand on, in Hong Kong too)
const BY_BOAT = { bunsby: [39.8, 17.5], fogg: [37.6, 16.8], aouda: [36.5, 16.6], fix: [35.2, 16.5] };
const RAMP_DOWN = [[32, 3.9], [32, 7.5], [32.4, 16.4]];
// Aouda left on the quay's edge by the landing as the Tankadere puts out (Holland)
const LEFT_ON_LANDING = [34.2, 4.5];
// Yokohama: Batulcar's stage (on the landing, its boards 2.5 m up); the Long Noses in a row on it, Passepartout among
// them; the pyramid's foot (pyr#b0…b2) and its tiers — who stands on whose shoulders; the front row on the landing
// before the stage
const STAGE_Y = 14.2;
const NOSES = ['n1', 'n2', 'n3', 'n4', 'n5'];
const ROW = { n4: 35.4, n1: 36.4, passepartout: 37.4, n2: 38.4, n3: 39.4, n5: 40.4 };
const BASE = { n1: 'b0', passepartout: 'b1', n2: 'b2' };
const PYR_X = 38, PYR_D = 13.4, PYR_GAP = 0.62;
// [who, on whose shoulder (a point of theirs), the two shoulders under the feet, from what `pyramid` on]
const TIERS = [
  ['n4', 'n1#shoulder_l', ['n1#shoulder_l', 'passepartout#shoulder_r'], 0.2],
  ['n3', 'passepartout#shoulder_l', ['passepartout#shoulder_l', 'n2#shoulder_r'], 0.26],
  ['n5', 'n4#shoulder_l', ['n4#shoulder_l', 'n3#shoulder_r'], 0.42],
];
// where each climber stands waiting behind the foot, and where those who fall land
const WAIT = { n4: [37.2, 15.1], n3: [38.8, 15.1], n5: [38.0, 15.5] };
const FALL = { n4: [36.4, 13.4], n3: [39.8, 13.6], n5: [38.3, 14.8] };
const BATULCAR = [34.3, 13.0];
const SEAT = { fogg: [37.4, 9.5], aouda: [36.6, 9.5] }, TO_SEAT = { fogg: [35.4, 8.9], aouda: [34.6, 8.9] };
const COSTUME = () => kit.cast.characters.passepartout_nose;
// Yokohama's quay at night after the show: Fogg (and Aouda) going off along it; Passepartout running after them
const REUNION = { fogg: [10.6, 3.6], aouda: [9.6, 3.7], passepartout: [13.6, 3.5] };
const WHO = ['fogg', 'aouda', 'passepartout', 'fix', 'bunsby', 'boatman', 'batulcar', ...NOSES];
const toward = ([a, d], [a2, d2]) => ((Math.atan2(a2 - a, d2 - d) * 180) / Math.PI + 360) % 360;
const OFF = id => ({ [`${id}_a`]: -60, [`${id}_d`]: 3.5, [`${id}_here`]: false, [`${id}_do`]: 'stand', [`${id}_turn`]: 0,
  [`${id}_look`]: null, [`${id}_reach`]: null, [`${id}_with`]: null, [`${id}_gait`]: null, [`${id}_on`]: null, [`${id}_mood`]: null });
const NOBODY = () => ({ ...Object.assign({}, ...WHO.map(OFF)), aouda_wear: null, passepartout_wear: null, fix_wear: null,
  bunsby_wear: null, batulcar_wear: null, ...Object.fromEntries(NOSES.map(id => [`${id}_wear`, null])) });
const CAM0 = { camera_glide: 0, camera_target: null, camera_shot: null, camera_frame: null, camera_on: null, camera_x: 0, camera_z: 0, camera_h: 0, camera_yaw: 0, camera_roll: 0, camera_look: 0 };
const loop = (motion, from = 0) => ({ motion, loop: true, from });
const stand = (id, at, turn, more = {}) => ({ [`${id}_a`]: at[0], [`${id}_d`]: at[1], [`${id}_here`]: true, [`${id}_turn`]: turn, ...more });
// the light and the ships at the film's moments; the games' keys at rest
const HANDS = { boatman: 0, message: 0, pp_sway: 0, pyramid: 0, tilt: 0, pyr_x: PYR_X, fogg_present: 0, pipe_smoke: 0, ...{ sampan_x: SAMPAN[0], sampan_d: SAMPAN[1], sampan_facing: SAMPAN[2] } };
const LIGHT = {
  day: { port: 'hongkong', evening: 0, night: 0, lanterns: 0.4, daze: 0, carnatic_present: 1, tankadere_out: 0, sail: 0, pp_walk: 0, pp_walk_at: 0, ...HANDS },
  tavern: { port: 'hongkong', evening: 1, night: 0.4, lanterns: 1, daze: 0, carnatic_present: 1, tankadere_out: 0, sail: 0, pp_walk: 0, pp_walk_at: 0, ...HANDS },
  night: { port: 'hongkong', evening: 1, night: 1, lanterns: 1, daze: 0, carnatic_present: 1, tankadere_out: 0, sail: 0, pp_walk: 0, pp_walk_at: 0, ...HANDS },
  yokohama: { port: 'yokohama', evening: 1, night: 1, lanterns: 1, daze: 0, carnatic_present: 0, tankadere_out: 1, sail: 0, pp_walk: 0, pp_walk_at: 0, ...HANDS },
};

function film(scene) {
  const travel = () => ((scene.get('aouda_dress') ?? 0) > 0.5 ? TRAVEL : null);
  const withAouda = () => (scene.get('with_aouda') ?? 0) > 0.5, withFix = () => (scene.get('with_fix') ?? 0) > 0.5;
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
  // ... as the badge leaves it: Passepartout up, standing over the table
  const UP = () => ({ ...TAVERN(), camera_target: 'passepartout', camera_shot: 0.65, camera_frame: 0.4, passepartout_do: 'stand', passepartout_a: WAY[0][0], passepartout_d: WAY[0][1], passepartout_look: 'fix#head' });
  // the opium: Passepartout as far along his way as `at`, reeling, the camera with him; the boatman waiting at the steps
  const DAZED = (at, daze) => {
    const [a, d] = along(at);
    return {
      ...LIGHT.tavern, ...CAM0, camera_target: 'passepartout', camera_shot: 'wide', camera_frame: [0.45, 0.62], ...NOBODY(),
      daze, camera_roll: 4 * daze, pp_walk: at, pp_walk_at: at, boatman: 1,
      passepartout_a: a, passepartout_d: d, passepartout_here: true, passepartout_turn: 90, passepartout_gait: 'stagger_walk',
      ...boatman(),
    };
  };
  // the boatman standing in his sampan at the foot of the steps, his lantern
  const boatman = () => ({ boatman_here: true, boatman_on: 'sampan#stand', boatman_turn: 180, boatman_with: ['lantern'], boatman_a: SAMPAN[0], boatman_d: SAMPAN[1] });
  // night at the jetty: the steamer alongside, smoking; Passepartout reeling along the jetty to her gangway
  const NIGHT = () => ({
    ...LIGHT.night, ...CAM0, camera_x: 15.2, camera_z: 70, camera_h: 0.3, ...NOBODY(),
    ...stand('passepartout', JETTY_IN, toward(JETTY_IN, GANGWAY_FOOT), { passepartout_gait: 'stagger_walk' }), daze: 0.5,
  });
  // aboard, lying where he fell on her deck (the camera from the jetty, up at her rail)
  const ABOARD = () => ({ passepartout_on: 'steamer_deck#aboard', passepartout_do: loop('lie_limp'), passepartout_turn: 90, passepartout_gait: null,
    passepartout_a: 22, passepartout_d: 83.5, camera_x: 21, camera_z: 73, camera_h: 6, camera_look: 0.25 });
  // morning, the jetty empty: Fogg (and Aouda) at the pier's foot
  const MORNING = () => ({
    ...LIGHT.day, ...CAM0, carnatic_present: 0, lanterns: 0.2, camera_x: 9, ...NOBODY(),
    fogg_a: PIER_FOOT.fogg[0], fogg_d: PIER_FOOT.fogg[1], fogg_here: true, fogg_turn: 10, fogg_wear: { hat: 'tophat' },
    aouda_a: PIER_FOOT.aouda[0], aouda_d: PIER_FOOT.aouda[1], aouda_here: withAouda(), aouda_turn: 5, aouda_wear: travel(),
  });
  // the Tankadere at the landing: Bunsby by her, Fogg (and Aouda) before him; Fix up on the quay at the ramp's head
  const BOAT = () => ({
    ...LIGHT.day, ...CAM0, carnatic_present: 0, lanterns: 0.1, camera_x: 36.4, camera_z: 6.6, camera_h: -0.7, ...NOBODY(),
    ...stand('bunsby', BY_BOAT.bunsby, 215, { bunsby_look: 'fogg#head' }),
    ...stand('fogg', BY_BOAT.fogg, 40, { fogg_look: 'bunsby#head', fogg_wear: { hat: 'tophat' } }),
    ...stand('aouda', BY_BOAT.aouda, 45, { aouda_here: withAouda(), aouda_wear: travel(), aouda_look: 'bunsby#head' }),
    ...stand('fix', RAMP_DOWN[0], 180),
  });
  // aboard the Tankadere: Bunsby at the tiller, Fogg, Aouda (with_aouda), Fix (with_fix) — standing on her deck
  const crew = (aouda = withAouda(), fix = withFix()) => ({
    bunsby_here: true, bunsby_on: 'tankadere_crew#helm', bunsby_turn: 270, bunsby_a: 33, bunsby_d: 20.6,
    fogg_here: true, fogg_on: 'tankadere_crew#fogg', fogg_turn: 160, fogg_a: 36, fogg_d: 20.6, fogg_wear: { hat: 'tophat' },
    aouda_here: aouda, aouda_on: 'tankadere_crew#aouda', aouda_turn: 170, aouda_a: 37, aouda_d: 20.6, aouda_wear: travel(),
    fix_here: fix, fix_on: 'tankadere_crew#fix', fix_turn: 200, fix_a: 39, fix_d: 20.6,
  });
  const OUT = () => ({ ...LIGHT.day, ...CAM0, carnatic_present: 0, lanterns: 0.1, camera_x: 30, camera_z: 5, camera_h: -0.2, ...NOBODY(), ...crew() });
  // Yokohama, night: the booth — the Long Noses in a row on the stage, Passepartout among them; Batulcar at its edge
  const SHOW = () => ({
    ...LIGHT.yokohama, ...CAM0, camera_x: 37.2, camera_z: 5.8, camera_h: 0.2, ...NOBODY(),
    ...Object.assign({}, ...Object.entries(ROW).map(([id, x], i) => stand(id, [x, STAGE_Y + 0.2 * (i % 2)], 180, { [`${id}_do`]: 'stand' }))),
    passepartout_wear: COSTUME(), passepartout_look: null,
    ...stand('batulcar', BATULCAR, 150, { batulcar_look: [37, 4, 1.2] }),
  });
  // ... the pyramid's foot: the three at the mat, the climbers behind; the camera back to see it whole and the front row
  const FOOT = () => ({
    ...SHOW(), camera_x: 38, camera_z: 5.4, camera_h: 1.6,
    ...Object.assign({}, ...Object.entries(BASE).map(([id, b], i) => stand(id, [PYR_X + (i - 1) * PYR_GAP, PYR_D], 180, { [`${id}_on`]: `pyr#${b}`, [`${id}_do`]: loop('storm_brace', 0.7 * i) }))),
    ...Object.assign({}, ...Object.entries(WAIT).map(([id, at]) => stand(id, at, 180))),
    ...stand('batulcar', [34.6, 13.8], 110, { batulcar_look: 'passepartout#head' }),
  });
  // ... built: the tiers up on the shoulders
  const BUILT = () => ({
    ...FOOT(), pyramid: 1, ...Object.assign({}, ...TIERS.map(([id, on, feet]) => ({ [`${id}_on`]: { at: on, up: 0.95 }, [`${id}_turn`]: 0,
      [`${id}_reach`]: { foot_r: feet[0], foot_l: feet[1] }, [`${id}_do`]: 'stand' }))),
    ...stand('fogg', SEAT.fogg, 0, { fogg_on: null, fogg_do: loop('sit_calm'), fogg_with: ['watch'], fogg_reach: { r: [SEAT.fogg[0] + 0.1, SEAT.fogg[1] + 0.35, 1.0] }, fogg_look: 'passepartout#head', fogg_wear: { hat: 'tophat' } }),
    ...stand('aouda', SEAT.aouda, 0, { aouda_here: withAouda(), aouda_do: loop('sit_calm'), aouda_look: 'passepartout#head', aouda_wear: travel() }),
    fogg_present: 1,
  });
  // Yokohama's quay after the show: Fogg (and Aouda) going off along it; Passepartout running after them in his wings
  const AFTER = () => ({
    ...LIGHT.yokohama, ...CAM0, camera_x: 9.2, camera_z: -0.2, camera_h: -0.1, ...NOBODY(),
    ...stand('fogg', REUNION.fogg, 270, { fogg_wear: { hat: 'tophat' }, fogg_gait: 'fogg_walk' }),
    ...stand('aouda', REUNION.aouda, 270, { aouda_here: withAouda(), aouda_wear: travel() }),
    ...stand('passepartout', [15.4, 3.4], 270, { passepartout_wear: COSTUME(), passepartout_gait: 'run' }),
  });
  // the reverse from the stage: on the front row, the footlights in their faces
  const FRONT_ROW = { ...CAM0, camera_on: 'see_cam', camera_look: 0.35 };

  const beats = {
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
    // ---- The pipe: Passepartout sits down again; Fix's pipe at his lips, its smoke; the world begins to swim (`daze` to
    // 0.3); he gets up — and the game's «Stay awake» takes him on (`daze`, `pp_walk`, `pp_sway`, `pp_stumble`, `boatman`,
    // `message`: the script).
    pipe: {
      after: 'badge',
      from: UP,
      run: async s => {
        const pp = s.person('passepartout'), fix = s.person('fix');
        s.set('boatman', 1);
        await pp.go('sit_down', { to: STOOL.passepartout, turn: 90 });
        pp.do('sit_calm', { loop: true });
        fix.look('passepartout#head');
        s.set('passepartout_reach', { r: 'passepartout#head' });
        s.set('pipe_smoke', 1);
        s.move('daze', 0.3, { over: 3.5 });
        s.move('camera_roll', 4 * 0.3, { over: 3.5 });
        await s.wait(3.5);
        s.set('passepartout_reach', null);
        s.set('pipe_smoke', 0);
        s.set('passepartout_gait', 'stagger_walk');
        await pp.go('rise_table', { from: STOOL.passepartout, turn: 90 });
        s.set('pp_walk_at', 0);
        s.tell('pipe:up');
        s.camera({ target: 'passepartout', shot: 'wide', frame: [0.45, 0.62], glide: 1.5 });
        await s.wait(0.8);
      },
    },
    // ---- Night. Passepartout reels along the jetty to the Carnatic's gangway and falls — (a cut) on her deck, aboard;
    // she casts off, backs, swings her bow out and makes for the harbour's mouth (the game moves `carnatic_present` on to 0
    // as long as it wants her going to be).
    carnatic: {
      from: NIGHT,
      run: async s => {
        const pp = s.person('passepartout');
        const aboard = s.shot(ABOARD());
        await pp.walk([GANGWAY_FOOT]);
        await pp.do('stumble');
        await s.until(() => aboard.ready);
        aboard.cut();
        s.tell('carnatic:aboard');
        await s.wait(1.6);
        s.tell('carnatic:cast-off');
        s.move('camera_z', 30, { over: 12, ease: 'inOut' });
        s.move('camera_h', 0.4, { over: 12, ease: 'inOut' });
        s.move('camera_look', 0, { over: 12, ease: 'inOut' });
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
        fogg.look([14, 76, 1]);
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
        fogg.look([14, 76, 1]);
        await watch;
        aouda.look('fogg#head');
        await s.wait(2);
      },
    },
    // ---- Day, the landing: Fogg (and Aouda) by the Tankadere with Bunsby, her pilot, in his sou'wester; Fix comes down
    // the ramp from the quay and up to them (under the lines; holds under the choice).
    bunsby: {
      from: BOAT,
      run: async s => {
        const fix = s.person('fix');
        await s.wait(3);
        await fix.walk([RAMP_DOWN[1], RAMP_DOWN[2], BY_BOAT.fix]);
        await fix.turn(toward(BY_BOAT.fix, BY_BOAT.fogg));
        s.set('fix_look', 'fogg#head');
        s.set('fogg_look', 'fix#head');
        s.set('bunsby_look', 'fix#head');
        s.tell('bunsby:fix');
        await s.wait(0.6);
        s.set('aouda_look', 'fix#head');
        await s.wait(2.4);
      },
    },
    // ---- The Tankadere sets her sails and puts off the landing, her people on her deck: Bunsby at the tiller, Fogg,
    // Aouda (with_aouda), Fix (with_fix).
    cast_off: {
      from: OUT,
      run: async s => {
        await s.wait(1);
        await s.move('sail', 1, { over: 7, ease: 'inOut' });
        s.tell('cast_off:sails-up');
        await s.move('tankadere_out', 0.3, { over: 16, ease: 'inOut' });
        await s.wait(1);
      },
    },
    // ---- (Holland) Aouda in her travelling dress on the landing, her hand up; the Tankadere going out of the harbour.
    stay_behind: {
      from: () => ({ ...OUT(), tankadere_out: 0.3, sail: 1, camera_x: 31.4, camera_z: 0.6, camera_h: 0.1, ...crew(false),
        ...stand('aouda', LEFT_ON_LANDING, 60, { aouda_on: null, aouda_wear: TRAVEL, aouda_look: 'tankadere' }) }),
      run: async s => {
        await s.wait(0.6);
        const up = [LEFT_ON_LANDING[0] + 0.25, LEFT_ON_LANDING[1] + 0.2, 2.3], wave = [LEFT_ON_LANDING[0] + 0.45, LEFT_ON_LANDING[1] + 0.25, 2.2];
        s.set('aouda_reach', { r: up });
        s.move('tankadere_out', 0.62, { over: 14, ease: 'in' });
        await s.wait(0.8);
        s.tell('stay_behind:wave');
        for (let i = 0; i < 3; i++) { s.set('aouda_reach', { r: i % 2 ? up : wave }); await s.wait(0.7); }
        s.set('aouda_reach', { r: up });
        await s.wait(2);
        s.set('aouda_reach', null);
        await s.wait(2);
      },
    },
    // ---- Yokohama, night: Batulcar's booth on the landing — the Long Noses in a row on the stage, Passepartout among
    // them in wings and nose; Batulcar at the stage's edge announces them (under his line).
    show: {
      from: SHOW,
      run: async s => {
        await s.wait(1);
        s.person('batulcar').do('spread_hands');
        s.tell('show:announce');
        NOSES.forEach((id, i) => s.after(0.3 + 0.2 * i, () => s.set(`${id}_look`, [37, 4, 1.2])));
        await s.wait(2.6);
      },
    },
    // ---- (the game's «The pyramid»: `pyramid`, `tilt`, `fogg_present` — the script builds the tiers, sways it, seats
    // Fogg) The three at the foot of it on the mat, the climbers behind them; Batulcar aside.
    pyramid: {
      after: 'show',
      from: FOOT,
      run: async s => {
        s.move('camera_z', 5.4, { over: 2, ease: 'inOut' });
        s.move('camera_h', 1.6, { over: 2, ease: 'inOut' });
        s.move('camera_x', 38, { over: 2, ease: 'inOut' });
        const go = Object.entries(BASE).map(([id, b], i) => s.sequence(async q => {
          const p = q.person(id), at = [PYR_X + (i - 1) * PYR_GAP, PYR_D];
          await p.walk([at]);
          await p.turn(180);
          q.set(`${id}_on`, `pyr#${b}`);
          p.do('storm_brace', { loop: true, from: 0.7 * i });
        }));
        for (const [id, at] of Object.entries(WAIT)) s.person(id).walk([at]);
        s.person('batulcar').walk([[34.6, 13.8]]);
        await s.all(...go);
        s.set('batulcar_look', 'passepartout#head');
        for (const id of Object.keys(WAIT)) { s.set(`${id}_turn`, 180); s.set(`${id}_look`, 'passepartout#head'); }
        await s.wait(0.5);
      },
    },
    // ---- Close on Passepartout under the noses: his eyes on the front row — (a cut) his master there, watch in hand.
    see: {
      after: ['pyramid', 'pyramid_show'],
      from: BUILT,
      run: async s => {
        const close = s.shot({ ...CAM0, camera_x: 38, camera_z: 10.6, camera_h: 2.3 }), reverse = s.shot({ ...FRONT_ROW });
        await s.until(() => close.ready);
        close.cut();
        s.set('passepartout_look', 'fogg#head');
        await s.wait(1.2);
        s.set('passepartout_mood', 'surprised');
        await s.wait(1.4);
        await s.until(() => reverse.ready);
        reverse.cut();
        await s.wait(2.6);
      },
    },
    // ---- (dropped) He leaps out — the pyramid comes down, softly and absurdly, the noses sitting up on the boards;
    // Batulcar throws up his hands; Passepartout at the footlights, his arms out to his master.
    collapse: {
      after: 'see',
      from: () => ({ ...BUILT(), passepartout_look: 'fogg#head', passepartout_mood: 'surprised' }),
      run: async s => {
        const wide = s.shot({ ...CAM0, camera_x: 38, camera_z: 5.4, camera_h: 1.6 });
        await s.until(() => wide.ready);
        wide.cut();
        const pp = s.person('passepartout');
        s.set('passepartout_on', null);
        s.set('passepartout_a', PYR_X);
        s.set('passepartout_d', PYR_D);
        const out = pp.walk([[37.6, 12.4]]);
        TIERS.forEach(([id], i) => s.sequence(async q => {
          await q.wait(0.15 + 0.25 * i);
          q.set(`${id}_a`, FALL[id][0]); q.set(`${id}_d`, FALL[id][1]); q.set(`${id}_reach`, null);
          q.set(`${id}_on`, null);
          await q.person(id).do('knocked_down');
        }));
        for (const id of ['n1', 'n2']) { s.set(`${id}_on`, null); s.after(0.4, () => s.person(id).do('spread_hands')); }
        await s.wait(0.6);
        s.person('batulcar').do('surprised');
        s.tell('collapse:batulcar');
        await out;
        await pp.turn(180);
        s.set('passepartout_reach', { r: 'fogg#head', l: 'fogg#head' });
        s.set('passepartout_mood', 'smile');
        await s.wait(2.5);
      },
    },
    // ---- (held) The pyramid stands whole: the top man's arms out — the bow (the applause is the game's); the seat in
    // the front row empties; the noses come down, Passepartout runs off after his master in his wings.
    finish: {
      after: ['pyramid', 'pyramid_show'],
      from: BUILT,
      run: async s => {
        s.set('n5_reach', { foot_r: TIERS[2][2][0], foot_l: TIERS[2][2][1], r: [PYR_X + 1.2, PYR_D, 6.6], l: [PYR_X - 1.2, PYR_D, 6.6] });
        await s.wait(0.5);
        s.tell('finish:bow');
        const fogg = s.person('fogg'), aouda = s.person('aouda');
        await s.wait(0.8);
        s.set('fogg_reach', null);
        s.set('fogg_with', null);
        s.set('fogg_look', null);
        await fogg.do('rise_chair');
        if (withAouda()) aouda.do('rise_chair');
        const off = fogg.walk([[33, 3.4], [29, 3.6]]);
        s.after(0.6, () => { if (withAouda()) aouda.walk([[32.4, 3.3], [28.6, 3.5]]); });
        s.set('passepartout_look', 'fogg#head');
        await s.wait(1.2);
        TIERS.slice().reverse().forEach(([id], i) => s.sequence(async q => {
          await q.wait(0.4 * i);
          q.set(`${id}_a`, WAIT[id][0]); q.set(`${id}_d`, WAIT[id][1]); q.set(`${id}_reach`, null);
          q.set(`${id}_on`, null);
          await q.person(id).do('stumble');
        }));
        await s.wait(1.4);
        s.set('passepartout_on', null);
        s.set('passepartout_a', PYR_X);
        s.set('passepartout_d', PYR_D);
        s.set('passepartout_gait', 'run');
        await s.person('passepartout').walk([[34.4, 15.2], [33.4, 15.6]]);
        s.set('passepartout_here', false);
        await off;
        s.set('fogg_here', false);
        s.set('aouda_here', false);
        await s.wait(0.5);
      },
    },
    // ---- Yokohama's quay at night: Passepartout, in his wings and his nose, runs up to his master; Fogg turns and
    // nods.
    reunion: {
      from: AFTER,
      run: async s => {
        const fogg = s.person('fogg'), pp = s.person('passepartout');
        fogg.walk([[8.2, 3.6]]);
        if (withAouda()) s.person('aouda').walk([[7.3, 3.7]]);
        await pp.walk([[9.6, 3.4]]);
        s.set('passepartout_gait', null);
        await s.all(fogg.turn(115), pp.turn(245));
        if (withAouda()) s.person('aouda').turn(105);
        s.set('fogg_look', 'passepartout#head');
        s.set('passepartout_look', 'fogg#head');
        s.set('aouda_look', 'passepartout#head');
        s.tell('reunion:face');
        await s.wait(2.4);
        // (the nod: his eyes down to the wings and up again)
        s.set('fogg_look', 'passepartout#chest');
        await s.wait(0.5);
        s.set('fogg_look', 'passepartout#head');
        await s.wait(1.6);
      },
    },
    // ---- The showcase's own (outside games): the evening coming over the harbour; «Stay awake» and «The pyramid» played by
    // themselves; Yokohama by night
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
    stay_awake_show: {
      from: () => DAZED(0.6, 0.45),
      run: async s => {
        s.set('pp_walk', 0.75);
        s.set('pp_sway', 0.6);
        await s.wait(4);
        s.set('pp_stumble', 1);
        await s.wait(0.6);
        s.set('pp_stumble', 0);
        s.set('pp_sway', -0.3);
        s.set('pp_walk', 0.97);
        await s.until(() => (s.get('pp_walk_at') ?? 0) >= 0.96);
        s.set('message', 1);
        await s.wait(6);
      },
    },
    yokohama: {
      from: () => ({ ...LIGHT.yokohama, ...CAM0, camera_x: 30, ...NOBODY() }),
      run: async s => {
        await s.wait(2);
        await s.move('camera_x', -6, { over: 14, ease: 'inOut' });
        await s.wait(1);
      },
    },
    pyramid_show: {
      from: FOOT,
      run: async s => {
        s.move('tilt', 0.3, { over: 2, ease: 'inOut' });
        await s.move('pyramid', 0.5, { over: 9, ease: 'linear' });
        s.move('tilt', -0.2, { over: 2, ease: 'inOut' });
        s.set('fogg_present', 1);
        await s.wait(3.5);
        s.move('tilt', 0, { over: 2, ease: 'inOut' });
        await s.move('pyramid', 1, { over: 6, ease: 'linear' });
        await s.wait(1);
      },
    },
  };
  return beats;
}
const SHOWCASE = ['quay', 'cousin', 'evening', 'tavern', 'badge', 'pipe', 'stay_awake_show', 'carnatic', 'morning', 'bunsby', 'cast_off',
  'stay_behind', 'yokohama', 'show', 'pyramid_show', 'see', 'collapse', 'finish', 'reunion'];

return {
  plan, sheer, portOf, steamerAt, boatAt, shore, houses, lantern, ghost, lanternRow, dazed, LANTERN_COLORS, boards,
  mist, BOATS, boat, boatLive, film, SHOWCASE, along, wayBetween, wayOf, clamp01, mixc, rgba, glow,
  SAMPAN, SAMPAN_OFF, TIERS, WAIT, FALL, SEAT, TO_SEAT, PYR_X, PYR_GAP, toward,
};
