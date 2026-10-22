// The deck — what the scene's elements, script and film share: the ship's plan (one deck, four ships told apart by
// their details), the ports on the horizon, the colours, the parts of the «Henrietta» that go into her furnaces and how
// they go (burn), and the film in beats (film(scene), for the world's module beats).
//   Metres, the ship's own: `distance` forward along her keel (the stem at +47), `across` to starboard (her right, the
// side of the ports and the moon); the main deck is the land (0), the sea 5.5 m below it, a quay 2.6 m below it to
// starboard. The ship lies still in the world; her way through the water is the sea's (its shader runs by `speed`).
// The camera stands on the deck by her poop looking forward (a walk: the operator slides, it never turns) — so whoever
// speaks stands turned aft, toward it, or in profile.
const { mixc, css, rgba, glow } = kit.light;
const clamp01 = v => anim.clamp(typeof v === 'number' ? v : 0, 0, 1);

const SHIPS = ['mongolia', 'rangoon', 'general_grant', 'henrietta'];
const PORTS = ['suez', 'bombay', 'new_york', 'queenstown', 'liverpool', 'none'];
const shipOf = st => (SHIPS.includes(st.ship) ? st.ship : 'mongolia');
const portOf = st => (PORTS.includes(st.port) ? st.port : 'none');
// a quay alongside to starboard (and the gangway down to it)
const quayed = p => p === 'suez' || p === 'new_york' || p === 'liverpool';

const plan = {
  sea: -5.5,
  quay: -2.6,
  // the bulwarks' inner face either side; the rail's height
  beam: 5.4,
  rail: 1.1,
  // the deck from the stern to the stem
  stern: -5,
  stem: 47,
  // the captain's cabin (on the «Henrietta»; the others' after skylight): its aft face's middle, width, depth, height
  cabin: { a: -3, d: 7, w: 3.1, deep: 3.6, h: 2.3 },
  mastMain: { a: 0, d: 11, h: 25 },
  mastFore: { a: 0, d: 34, h: 23 },
  // the stokehold's hatch (open: the furnaces' glow), its coaming's aft face; the bunks stacked by it
  hatch: { a: 1.4, d: 13.8, s: 1.6, h: 0.7 },
  bunks: { a: 3.4, d: 12.4 },
  // the deckhouse: its aft face, how far forward it runs; the bridge on its roof; the funnel through it
  house: { a: 0, d: 18, deep: 8.2, w: 4.6, h: 2.4 },
  funnel: { a: 0, d: 22.5, r: 1.05, top: 11 },
  // the boats on chocks across the deck between the hatch and the deckhouse: the port one (the part's point) and, a
  // part of the same element, the starboard one beside it, a little forward
  boats: { a: -2.6, d: 15.8, len: 4.6, next: [5.6, 1.2] },
  // the gangway's head at the starboard rail
  gangway: { d: 9.5 },
  // the calendar on the deckhouse's aft face (across, elevation)
  calendar: [-1.2, 1.62],
  // Fogg's deck chair
  chair: [-2.2, 14.2],
  // the custom house's cell (release), far off to starboard where no deck shot sees it
  cell: [400, 0],
};

// The ships' colours: deck, bulwark (inside), rail cap, house, trim, funnel, its band, masts, boats, sea, iron
const COLOURS = {
  mongolia: { deck: '#cdb894', bulwark: '#ece6d8', cap: '#8a5c36', house: '#a8744a', trim: '#ece6d8', funnel: '#1e1e20', band: '#1e1e20', mast: '#c4a06a', boat: '#f2efe8', sea: '#2f8098', iron: '#2e2f33' },
  rangoon: { deck: '#cdb894', bulwark: '#ece6d8', cap: '#8a5c36', house: '#a8744a', trim: '#ece6d8', funnel: '#1e1e20', band: '#1e1e20', mast: '#c4a06a', boat: '#f2efe8', sea: '#2c6a86', iron: '#2e2f33' },
  general_grant: { deck: '#d4c19c', bulwark: '#f4f2ec', cap: '#6e4a30', house: '#f4f1ea', trim: '#3e6a4e', funnel: '#b23a28', band: '#1c1c1e', mast: '#c8a874', boat: '#f4f2ec', sea: '#2b72a6', iron: '#2e2f33' },
  henrietta: { deck: '#b9a07a', bulwark: '#8e6c48', cap: '#5c4030', house: '#93683f', trim: '#5c4030', funnel: '#2c2926', band: '#a33628', mast: '#9e7c52', boat: '#dcd4c0', sea: '#4f7a76', iron: '#3a3b3e' },
};
const colours = st => COLOURS[shipOf(st)];

// ── the «Henrietta»'s parts that burn (the game's «The boilers») ──
// Each: its key (1 aboard, 0 burnt), the anchor its cards stand on, where that anchor is (`home`) and where the part's
// middle is (`mid`: what goes to the hatch); the point the player takes it by (`<part>#part`) is its element's. Dragged
// to the hatch (`drag_<part>` 0…1) the script places the anchor (keys at_<part>_a, _d, _e — partAt), a mast lowered
// down through the deck as it goes (`drop`: it sinks out of sight under the planks); each element's animate shrinks it as
// it goes, hides it at 0 and dims it while `locked_<part>` (partAnimate).
const PARTS = {
  deckhouse: { anchor: 'house', home: [0, 18], mid: [0, 22] },
  boats: { anchor: 'boats', home: [plan.boats.a, plan.boats.d], mid: [plan.boats.a + plan.boats.next[0] / 2, plan.boats.d + 0.6] },
  bunks: { anchor: 'bunks', home: [plan.bunks.a, plan.bunks.d] },
  yards: { anchor: 'yards_at', home: [0, 11], mid: [0, 22], drop: -7 },
  mast_fore: { anchor: 'mast_fore', home: [0, plan.mastFore.d], drop: -plan.mastFore.h },
  mast_main: { anchor: 'mast_main', home: [0, plan.mastMain.d], drop: -plan.mastMain.h },
  bulwarks: { anchor: 'bulwarks_at', home: [0, 0], mid: [0, 20] },
  speedy_cabin: { anchor: 'cabin', home: [plan.cabin.a, plan.cabin.d], mid: [plan.cabin.a, plan.cabin.d + plan.cabin.deep / 2] },
};
const PART_NAMES = Object.keys(PARTS);
// where a part's anchor is, dragged `v` of the way: [across, distance, elevation] — its middle along the deck to the
// hatch's side, lowered as it goes
function partAt(name, v) {
  const p = PARTS[name], u = clamp01(v), H = plan.hatch, mid = p.mid ?? p.home;
  const to = [H.a - 1.5, H.d + 0.9];
  const slide = anim.ease.inOut(u);
  return [p.home[0] + (to[0] - mid[0]) * slide, p.home[1] + (to[1] - mid[1]) * slide, (p.drop ?? 0) * slide];
}
// how a part looks as it goes: its scale, its alpha (0 — gone), its brightness (locked: as not yours)
function partLook(st, name) {
  if (shipOf(st) !== 'henrietta') return { scale: 1, alpha: 1, bright: 1 };
  const here = (st[name] ?? 1) > 0.5, d = clamp01(st[`drag_${name}`]);
  return { scale: anim.mix(1, 0.32, anim.ease.in(d)), alpha: here ? 1 : 0, bright: (st[`locked_${name}`] ?? 0) > 0.5 ? 0.5 : 1 };
}
// an animate's lines for a part: its layers (all its painting) shrunk about `pivot` (the element's own units), hidden,
// dimmed
function partAnimate(e, name, layers, pivot) {
  const k = partLook(e.state, name);
  for (const n of layers) {
    const l = e.layer(n);
    l.scale = k.scale;
    l.x = pivot[0] * (1 - k.scale);
    l.y = pivot[1] * (1 - k.scale);
    l.alpha = k.alpha;
    l.brightness = k.bright;
  }
  return k;
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
// a window or a porthole's glass: dark, a pale glint
const pane = (g, x, y, w, h, frame) => {
  rect(g, x - 0.05, y - 0.05, w + 0.1, h + 0.1, frame);
  rect(g, x, y, w, h, '#3c4a52');
  rect(g, x + w * 0.15, y + h * 0.12, w * 0.18, h * 0.6, 'rgba(220,232,236,0.35)');
};
const port = (g, x, y, r) => {
  g.fillStyle = '#b08a48';
  g.beginPath();
  g.arc(x, y, r + 0.05, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = '#34424a';
  g.beginPath();
  g.arc(x, y, r, 0, Math.PI * 2);
  g.fill();
};
// planks of a wall seen from before it, x0…x1, y0 (top) … y1 (foot): a seam every `step`
function planked(g, x0, x1, y0, y1, colour, step) {
  rect(g, x0, y0, x1 - x0, y1 - y0, colour);
  g.fillStyle = shade(colour, 0.22);
  for (let y = y0 + step; y < y1 - 0.01; y += step) g.fillRect(x0, y - 0.012, x1 - x0, 0.024);
}
// a door: frame, panels, a brass knob
function door(g, x, w, h, colour) {
  rect(g, x - 0.06, -h - 0.06, w + 0.12, h + 0.06, shade(colour, 0.35));
  rect(g, x, -h, w, h, colour);
  g.fillStyle = shade(colour, 0.15);
  g.fillRect(x + 0.1, -h + 0.12, w - 0.2, h * 0.38);
  g.fillRect(x + 0.1, -h * 0.5 + 0.06, w - 0.2, h * 0.38);
  g.fillStyle = '#c8a050';
  g.beginPath();
  g.arc(x + w - 0.12, -h * 0.5, 0.035, 0, Math.PI * 2);
  g.fill();
}
// A side of a house (the deckhouse's, the cabin's) along its length 0…len (x), its height h: planks, windows, a door
function houseSide(g, c, len, h, windows, doorAt) {
  planked(g, 0, len, -h, 0, c.house, 0.24);
  rect(g, 0, -h - 0.08, len, 0.1, c.trim);
  rect(g, 0, -0.12, len, 0.12, shade(c.house, 0.3));
  for (const x of windows) pane(g, x, -h + 0.55, 0.7, 0.6, c.trim);
  if (doorAt != null) door(g, doorAt, 0.8, 1.95, shade(c.house, 0.15));
}
// a ship's boat lying on her chocks, seen from her side (x along her, 0 her middle; y up from the deck, its foot 0)
function boat(g, c, len) {
  const h = 1.0, top = -0.55 - h;
  // the chocks
  for (const x of [-len * 0.3, len * 0.3]) rect(g, x - 0.12, -0.55, 0.24, 0.55, '#6a5038');
  g.fillStyle = c.boat;
  g.beginPath();
  g.moveTo(-len / 2, top);
  g.lineTo(len / 2, top);
  g.quadraticCurveTo(len / 2 - 0.2, -0.55, len / 2 - 0.9, -0.5);
  g.lineTo(-len / 2 + 0.9, -0.5);
  g.quadraticCurveTo(-len / 2 + 0.2, -0.55, -len / 2, top);
  g.fill();
  // the gunwale, the strakes, the cover over her
  rect(g, -len / 2, top - 0.06, len, 0.1, c.cap);
  g.fillStyle = shade(c.boat, 0.12);
  for (let k = 1; k < 3; k++) g.fillRect(-len / 2 + 0.3 * k, top + 0.3 * k, len - 0.6 * k, 0.03);
  poly(g, [[-len / 2 + 0.1, top - 0.04], [-len / 2 + 0.6, top - 0.38], [len / 2 - 0.6, top - 0.38], [len / 2 - 0.1, top - 0.04]], '#c8c0a8');
}

// A side's bulwarks seen from inboard, x 0…52 along the side (port: forward from the stern; starboard: aft from the
// stem), their foot on the deck: planks (the «Henrietta») or white plating, stanchions, the rail cap, the shrouds'
// chain plates at the masts; the starboard one opened at the gangway when a quay is alongside. The port side's point
// bulwarks#part (10 m forward).
function bulwarkSide(g, e, portSide) {
  const c = colours(e.state), d2x = d => (portSide ? d - plan.stern : plan.stem - d), H = plan.rail;
  const wood = shipOf(e.state) === 'henrietta';
  const gap = !portSide && quayed(portOf(e.state)) ? [d2x(plan.gangway.d) - 0.6, d2x(plan.gangway.d) + 0.6].sort((a, b) => a - b) : null;
  const span = gap ? [[0, gap[0]], [gap[1], 52]] : [[0, 52]];
  for (const [x0, x1] of span) {
    if (wood) planked(g, x0, x1, -H, 0, c.bulwark, 0.18);
    else rect(g, x0, -H, x1 - x0, H, c.bulwark);
    // stanchions
    g.fillStyle = shade(c.bulwark, wood ? 0.3 : 0.12);
    for (let x = Math.ceil(x0 / 1.8) * 1.8; x < x1 - 0.1; x += 1.8) g.fillRect(x - 0.05, -H, 0.1, H);
    // the scupper's dark strip at the foot, the rail cap
    rect(g, x0, -0.08, x1 - x0, 0.08, shade(c.bulwark, 0.4));
    rect(g, x0 - 0.02, -H - 0.12, x1 - x0 + 0.04, 0.14, c.cap);
    rect(g, x0 - 0.02, -H - 0.02, x1 - x0 + 0.04, 0.03, shade(c.cap, 0.35));
  }
  // chain plates of the shrouds at the masts
  for (const d of [plan.mastMain.d, plan.mastFore.d]) {
    const x = d2x(d);
    g.fillStyle = c.iron;
    for (let k = -2; k <= 2; k++) g.fillRect(x + k * 0.45 - 0.03, -H - 0.3, 0.06, 0.3);
  }
  if (gap) { rect(g, gap[0] - 0.08, -H - 0.45, 0.08, H + 0.45, c.cap); rect(g, gap[1], -H - 0.45, 0.08, H + 0.45, c.cap); }
  if (portSide) e.at(d2x(10), -0.8, 'part');
}
// What is left of a side when its bulwarks have burnt: the iron sheer strake along it, its rivets
function gunwaleSide(g, e) {
  const c = colours(e.state);
  rect(g, 0, -0.42, 52, 0.42, c.iron);
  rect(g, 0, -0.45, 52, 0.05, shade(c.iron, 0.3));
  g.fillStyle = tint(c.iron, 0.18);
  for (let x = 0.2; x < 52; x += 0.3) g.fillRect(x, -0.32, 0.03, 0.03);
}

// A mast seen from aft (its foot on the deck at 0): the pole tapering, its tops and crosstrees, the topmast, the
// shrouds down to the rails either side and their ratlines. h — its height.
function mast(g, c, h) {
  const top = -h, cross = -h * 0.6;
  poly(g, [[-0.22, 0], [-0.14, cross], [0.14, cross], [0.22, 0]], c.mast);
  poly(g, [[-0.12, cross], [-0.06, top], [0.06, top], [0.12, cross]], c.mast);
  rect(g, -1.1, cross - 0.12, 2.2, 0.16, shade(c.mast, 0.2));
  rect(g, -0.6, top + h * 0.15, 1.2, 0.1, shade(c.mast, 0.2));
  rect(g, -0.1, top - 0.25, 0.2, 0.25, shade(c.mast, 0.3));
  // the shrouds and their ratlines
  g.strokeStyle = '#3a342c';
  g.lineWidth = 0.05;
  for (const s of [-1, 1]) for (let k = 0; k < 3; k++) {
    g.beginPath();
    g.moveTo(s * (0.9 - k * 0.12), cross);
    g.lineTo(s * (5.3 - k * 0.42), -1.3);
    g.stroke();
  }
  g.lineWidth = 0.025;
  for (const s of [-1, 1]) for (let y = -2; y > cross + 0.4; y -= 0.45) {
    const u = (y - -1.3) / (cross - -1.3);
    g.beginPath();
    g.moveTo(s * (5.3 - 4.4 * u), y);
    g.lineTo(s * (5.3 - 0.84 - 4.4 * u + 0.24 * u), y);
    g.stroke();
  }
  // the topmast's shrouds to the crosstrees
  g.lineWidth = 0.04;
  for (const s of [-1, 1]) { g.beginPath(); g.moveTo(s * 0.08, top + h * 0.15); g.lineTo(s * 1.05, cross); g.stroke(); }
}
// A mast's yards (y their heights, w their lengths) and their sails: each yard with its sail furled along it, and the
// sail set below it — a layer `sail<k>` hung from the yard (its animate lets it fall as `sails` says); `point` — where
// the part's point is, if it is this one's
function yardsOf(g, e, c, yards, point) {
  const sailed = shipOf(e.state) === 'henrietta';
  e.layer('yards', { pivot: [0, 0] }, g => {
    yards.forEach(([y, w]) => {
      rect(g, -w / 2, -y - 0.09, w, 0.18, shade(c.mast, 0.25));
      // the sail furled along it
      g.fillStyle = '#d8d0bc';
      g.beginPath();
      g.ellipse(0, -y + 0.12, w / 2 - 0.4, 0.16, 0, 0, Math.PI * 2);
      g.fill();
    });
    if (point) e.at(point[0], point[1], 'part');
  });
  if (!sailed) return;
  yards.forEach(([y, w], k) => {
    const next = yards[k - 1] ? yards[k - 1][0] : 1.6, deep = y - next - 0.25, foot = w * (k ? 1.12 : 1.05);
    e.layer(`sail${k}`, { pivot: [0, -y] }, g => {
      const shape = () => {
        g.beginPath();
        g.moveTo(-w / 2 + 0.2, -y + 0.1);
        g.lineTo(w / 2 - 0.2, -y + 0.1);
        g.quadraticCurveTo(foot / 2 + 0.5, -y + deep * 0.6, foot / 2, -y + deep);
        g.quadraticCurveTo(0, -y + deep - 0.9, -foot / 2, -y + deep);
        g.quadraticCurveTo(-foot / 2 - 0.5, -y + deep * 0.6, -w / 2 + 0.2, -y + 0.1);
        g.closePath();
      };
      // the canvas, its belly fuller in the middle
      const gr = g.createLinearGradient(-w / 2, 0, w / 2, 0);
      gr.addColorStop(0, '#d6ccb4');
      gr.addColorStop(0.5, '#f2ecdc');
      gr.addColorStop(1, '#d6ccb4');
      g.fillStyle = gr;
      shape();
      g.fill();
      // a reef band, the bolt-rope round its edge
      g.fillStyle = 'rgba(160,148,124,0.5)';
      g.fillRect(-w / 2 + 0.3, -y + deep * 0.22, w - 0.6, 0.08);
      g.strokeStyle = '#b4a888';
      g.lineWidth = 0.08;
      shape();
      g.stroke();
    });
  });
}
// a yards' animate: the sails let fall by `sails`; the yards and sails lowered with their mast as it is dragged down
// through the deck and gone with it once it is burnt; shrunk and gone with their own part
function yardsAnimate(e, mastKey, count) {
  const st = e.state, k = partLook(st, 'yards'), sails = clamp01(st.sails), henrietta = shipOf(st) === 'henrietta';
  const sink = henrietta ? -partAt(mastKey, st[`drag_${mastKey}`])[2] : 0, gone = henrietta && (st[mastKey] ?? 1) < 0.5;
  const layers = ['yards', ...(henrietta ? Array.from({ length: count }, (_, i) => `sail${i}`) : [])];
  partAnimate(e, 'yards', layers, [0, -8]);
  layers.forEach((n, i) => {
    const l = e.layer(n);
    l.y += sink;
    if (gone) l.alpha = 0;
    if (i > 0) { l.scaleX = k.scale; l.scaleY = k.scale * (0.06 + 0.94 * sails); l.alpha = sails > 0.02 && !gone ? k.alpha : 0; }
  });
}

// The ports on the horizon: a skyline of each, x across (metres about its middle), its foot at 0, toward −y up
function skyline(g, port, rnd) {
  const bump = (x, c, w, h) => h * Math.exp(-(((x - c) / w) ** 2));
  if (port === 'suez') {
    // low desert hills, a white town, two minarets, palms, the mole
    poly(g, [[-900, 0], ...Array.from({ length: 37 }, (_, i) => { const x = -900 + i * 50; return [x, -8 - bump(x, -500, 260, 40) - bump(x, 300, 300, 26)]; }), [900, 0]], '#d8c29a');
    for (let i = 0; i < 46; i++) { const x = -380 + i * 17 + rnd() * 6, h = 6 + rnd() * 9; rect(g, x, -h, 12 + rnd() * 6, h, rnd() < 0.5 ? '#efe6d4' : '#e2d4b8'); }
    for (const x of [-140, 110]) { rect(g, x, -46, 4, 46, '#f2ead8'); poly(g, [[x - 1, -46], [x + 2, -54], [x + 5, -46]], '#f2ead8'); rect(g, x - 1.5, -38, 7, 2, '#e0d2b8'); }
    poly(g, [[-30, -16], [-10, -27], [10, -16]], '#e8dcc4');
    for (let i = 0; i < 9; i++) { const x = -420 + i * 95 + rnd() * 30; g.strokeStyle = '#6a5a3a'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(x, 0); g.quadraticCurveTo(x + 3, -12, x + 1, -22); g.stroke(); g.fillStyle = '#4e6a3a'; for (let k = 0; k < 6; k++) { g.beginPath(); g.ellipse(x + 1 + Math.cos(k) * 5, -22 + Math.sin(k) * 1.5, 7, 1.8, k * 0.5, 0, Math.PI * 2); g.fill(); } }
    rect(g, -600, -3, 520, 3, '#b8a888');
  } else if (port === 'bombay') {
    // the island's low hills, the town along the shore: domes, a clock tower, ships' masts
    poly(g, [[-1000, 0], ...Array.from({ length: 41 }, (_, i) => { const x = -1000 + i * 50; return [x, -6 - bump(x, -350, 220, 34) - bump(x, 420, 280, 46)]; }), [1000, 0]], '#8a8a7c');
    for (let i = 0; i < 70; i++) { const x = -560 + i * 16 + rnd() * 6, h = 6 + rnd() * 14; rect(g, x, -h, 11 + rnd() * 6, h, rnd() < 0.5 ? '#d8c8b0' : '#c4b49a'); }
    for (const x of [-220, 60, 260]) { rect(g, x, -22, 20, 22, '#e2d6c0'); g.fillStyle = '#e2d6c0'; g.beginPath(); g.arc(x + 10, -22, 10, Math.PI, 0); g.fill(); }
    rect(g, -40, -58, 9, 58, '#d4c4a6');
    poly(g, [[-42, -58], [-35.5, -70], [-29, -58]], '#a87a5a');
    g.strokeStyle = '#5a4e40';
    g.lineWidth = 0.8;
    for (let i = 0; i < 14; i++) { const x = -640 + i * 50 + rnd() * 20; g.beginPath(); g.moveTo(x, 0); g.lineTo(x, -28 - rnd() * 10); g.stroke(); }
  } else if (port === 'new_york') {
    // the city along the water: blocks, warehouses, spires, Trinity Church's tall one
    for (let i = 0; i < 90; i++) { const x = -800 + i * 18 + rnd() * 6, h = 10 + rnd() * 22; rect(g, x, -h, 14 + rnd() * 8, h, rnd() < 0.5 ? '#a89a8a' : '#8e8478'); }
    for (const [x, h] of [[-300, 86], [-60, 70], [180, 62], [420, 74]]) { rect(g, x, -h * 0.55, 10, h * 0.55, '#7a7068'); poly(g, [[x, -h * 0.55], [x + 5, -h], [x + 10, -h * 0.55]], '#6e645c'); }
    g.strokeStyle = '#4e4640';
    g.lineWidth = 0.8;
    for (let i = 0; i < 24; i++) { const x = -760 + i * 64 + rnd() * 20; g.beginPath(); g.moveTo(x, 0); g.lineTo(x, -34 - rnd() * 14); g.stroke(); }
  } else if (port === 'queenstown') {
    // green hills of Ireland round the harbour, the town climbing, the cathedral's spire
    poly(g, [[-1000, 0], ...Array.from({ length: 41 }, (_, i) => { const x = -1000 + i * 50; return [x, -10 - bump(x, -400, 300, 60) - bump(x, 200, 260, 80) - bump(x, 700, 240, 40)]; }), [1000, 0]], '#7f9a6c');
    poly(g, [[-1000, 0], ...Array.from({ length: 41 }, (_, i) => { const x = -1000 + i * 50; return [x, -6 - bump(x, -150, 380, 30) - bump(x, 520, 200, 20)]; }), [1000, 0]], '#6c8a5c');
    for (let i = 0; i < 40; i++) { const x = -300 + i * 14 + rnd() * 5, y = -bump(x, 120, 200, 40) * 0.8; rect(g, x, y - 7, 10, 7 + 4, rnd() < 0.5 ? '#e6e0d2' : '#cfc6b4'); }
    rect(g, 120, -64, 12, 30, '#8c8478');
    poly(g, [[119, -64], [126, -96], [133, -64]], '#7a7268');
  } else if (port === 'liverpool') {
    // docks: warehouses of brick, chimneys, cranes, a forest of masts
    for (let i = 0; i < 60; i++) { const x = -900 + i * 30 + rnd() * 6, h = 14 + rnd() * 16; rect(g, x, -h, 26, h, rnd() < 0.5 ? '#8a5040' : '#764438'); }
    for (let i = 0; i < 12; i++) { const x = -800 + i * 140 + rnd() * 40; rect(g, x, -60 - rnd() * 20, 4, 80, '#5a3a32'); }
    g.strokeStyle = '#3e3a36';
    g.lineWidth = 0.9;
    for (let i = 0; i < 40; i++) { const x = -860 + i * 44 + rnd() * 14; g.beginPath(); g.moveTo(x, 0); g.lineTo(x, -36 - rnd() * 18); g.stroke(); }
  }
}

// ── The film ──
const WHO = ['fogg', 'passepartout', 'aouda', 'fix', 'consul', 'sailor', 'speedy', 'stoker', 'policeman', 'policeman_2'];
const toward = ([a, d], [a2, d2]) => ((Math.atan2(a2 - a, d2 - d) * 180) / Math.PI + 360) % 360;
// a point before someone standing at [a, d] turned `turn`: `f` metres ahead of them, `side` to their right, `h` up
const before = ([a, d], turn, f, h, side = 0) => {
  const r = (turn * Math.PI) / 180;
  return [a + Math.sin(r) * f + Math.cos(r) * side, d + Math.cos(r) * f - Math.sin(r) * side, h];
};
const OFF = id => ({ [`${id}_a`]: -2, [`${id}_d`]: -3, [`${id}_here`]: false, [`${id}_do`]: 'stand', [`${id}_turn`]: 0,
  [`${id}_look`]: null, [`${id}_reach`]: null, [`${id}_with`]: null, [`${id}_gait`]: null, [`${id}_on`]: null, [`${id}_mood`]: null });
const NOBODY = () => Object.assign({}, ...WHO.map(OFF));
const loop = (motion, from = 0) => ({ motion, loop: true, from });
// someone standing at [a, d], turned `turn`, and whatever else
const at = (id, [a, d], turn, more = {}) => ({ [`${id}_a`]: a, [`${id}_d`]: d, [`${id}_here`]: true, [`${id}_turn`]: turn,
  ...Object.fromEntries(Object.entries(more).map(([k, v]) => [`${id}_${k}`, v])) });
const CAM = { camera_glide: 0, camera_target: null, camera_shot: null, camera_frame: null, camera_x: 0, camera_z: 0, camera_h: 0, camera_look: 0, camera_yaw: 0, camera_on: null };
// the parts all aboard and nothing burning
const WHOLE = () => Object.assign({ fire: 0, flare: 0, flare_glow: 0, speedy_grief: 0, sails: 0 },
  ...PART_NAMES.map(n => ({ [n]: 1, [`drag_${n}`]: 0, [`locked_${n}`]: 0 })));
// the light and the ship at the film's moments
const SEA = (ship, port, more = {}) => ({ ship, port, night: 0, dawn: 0, fog: 0, smoke: 1, speed: port === 'none' || port === 'bombay' || port === 'queenstown' ? 0.8 : 0,
  porthole: 0, cell_close: 0, leaf: 0, door: 0, ...WHOLE(), ...more });
// the burn's view: from high on the poop, the whole deck laid out (every part's point in the middle of a 4:3 frame)
const BURN_VIEW = { ...CAM, camera_z: -4.5, camera_h: 3.2, camera_look: 0.06 };
// where people stand
const RAIL = 4.6;
const SPOT = {
  // Suez: Passepartout and Fix face to face by the gangway's head (profiles); the consul forward; Fix whispering to him
  pp_suez: [3.9, 10.4], fix_suez: [2.7, 10.4], consul: [2.5, 13.9], fix_whisper: [1.4, 13.8],
  bombay: [RAIL - 0.05, 9.6],
  // the night: she forward at the rail, he a step aft and inboard; where he lays the plaid (forward of her, turned aft:
  // his face to us, the plaid on her shoulders seen)
  aouda_rail: [RAIL, 10.6], fogg_rail: [3.85, 9.9], fogg_plaid: [4.15, 11.35],
  // the Pacific: Passepartout at the rail; Fix comes aft from the deckhouse and stands before him
  pp_rail: [RAIL, 10.6], fix_from: [1.6, 15.8], fix_pp: [3.4, 10.4],
  // the calendar: the sailor at the deckhouse, Passepartout by him, Fogg in his chair
  sailor_cal: [-1.3, 17.4], pp_cal: [0.4, 15.2],
  // New York: the gangway's head; under the bridge; on the bridge
  gang: [3.6, 9.8], gang_aouda: [2.9, 10.6], gang_pp: [2.3, 10.0], gang_fix: [4.2, 10.9], below_bridge: [1.9, 15.4],
  bridge_speedy: [1.1, 19.4], bridge_fogg: [-0.9, 19.4],
  // no coal: the stoker come up from the hatch, Fogg before him, Passepartout aside; Speedy brought aft out of the
  // deckhouse by a sailor (they walk toward us)
  stoker: [1.9, 13.0], coal_fogg: [0.4, 11.4], coal_pp: [-1.6, 11.6], house_door: [0.6, 17.9], speedy_brought: [0.75, 14.4], sailor_brought: [1.3, 15.6],
  stoker_burn: [2.4, 15.9],
  pp_hatch: [0.2, 14.2], speedy_burn: [-1.2, 12.0],
  // Liverpool: at the gangway's head; Fix comes aft to him; the constables come up the gangway
  lv_fogg: [3.4, 10.0], lv_fix_from: [1.2, 14.6], lv_fix: [3.3, 10.75], lv_aouda: [2.6, 9.0], lv_pp: [2.2, 9.9],
  quay_1: [9.6, 9.6], quay_2: [9.9, 8.6], gang_top: [5.2, 9.6], pol_1: [4.6, 10.6], pol_2: [4.8, 9.0],
};
// the cell: its anchor and where people are in it (the bench along its back wall, the door in its left wall)
const CELL_AT = (a, d) => [plan.cell[0] + a, plan.cell[1] + d];
const BENCH = CELL_AT(-0.2, 4.8), FIX_IN = CELL_AT(-1.4, 4.35), FIX_OUT = CELL_AT(-4.2, 2.1);

function film(scene) {
  const get = (k, or = 0) => { const v = scene.get(k); return v == null ? or : v; };
  const withIt = k => get(k, 1) > 0.5;
  // the people's looks from the game's keys: Fogg's hat out of doors; Aouda's dress from Hong Kong on; Passepartout in
  // the «Long Noses»' wings; Fix's bruise — the cast's own objects (kit.cast.wears)
  const W = scene.kit.cast.wears;
  const wear = {
    fogg: () => ({ hat: 'tophat' }),
    aouda: () => (get('aouda_dress') > 0.5 ? W.aouda_dress : null),
    passepartout: () => (get('pp_wings') > 0.5 ? W.pp_wings : null),
    fix: () => (get('fix_bruise') > 0.5 ? W.fix_bruise : null),
  };
  const WEAR = () => Object.fromEntries(Object.entries(wear).map(([id, f]) => [`${id}_wear`, f()]));
  const P = (id, spot, turn, more) => ({ [`${id}_wear`]: wear[id] ? wear[id]() : null, ...at(id, spot, turn, more) });
  // both hands holding something before the chest (the notebook)
  const holding = (spot, turn) => { const p = before(spot, turn, 0.3, 1.1); return { r: p, l: p }; };

  // ── the shots ──
  const SUEZ = () => ({ ...SEA('mongolia', 'suez'), ...CAM, ...NOBODY(), ...WEAR(),
    camera_target: 'suez_two', camera_shot: 1.35, camera_frame: [0.5, 0.42],
    ...P('passepartout', SPOT.pp_suez, toward(SPOT.pp_suez, SPOT.fix_suez), { look: 'fix#head', mood: 'smile' }),
    ...P('fix', SPOT.fix_suez, toward(SPOT.fix_suez, SPOT.pp_suez), { look: 'passepartout#head', mood: 'smile' }),
    ...P('consul', SPOT.consul, 230, { do: loop('hands_behind'), look: 'fix#head' }) });
  const BOMBAY = () => ({ ...SEA('mongolia', 'bombay', { dawn: 1 }), ...CAM, ...NOBODY(), ...WEAR(),
    camera_target: 'fogg', camera_shot: 1, camera_frame: [0.36, 0.42],
    ...P('fogg', SPOT.bombay, 225, { with: ['notebook'], reach: holding(SPOT.bombay, 225), look: 'fogg#book' }) });
  const NIGHT = () => ({ ...SEA('rangoon', 'none', { night: 1, speed: 0.6 }), ...CAM, ...NOBODY(), ...WEAR(),
    camera_target: 'night_two', camera_shot: 0.85, camera_frame: [0.5, 0.42],
    ...P('aouda', SPOT.aouda_rail, 85, { look: [60, 300, -4] }),
    ...P('fogg', SPOT.fogg_rail, 80, { with: ['plaid'], look: [40, 300, -4] }) });
  // (as rail_night leaves them: turned to each other)
  const NIGHT_TURNED = () => ({ ...NIGHT(), aouda_turn: toward(SPOT.aouda_rail, SPOT.fogg_rail), aouda_look: 'fogg#head',
    fogg_turn: toward(SPOT.fogg_rail, SPOT.aouda_rail), fogg_look: 'aouda#head' });
  const PACIFIC = () => ({ ...SEA('general_grant', 'none', { speed: 0.8 }), ...CAM, ...NOBODY(), ...WEAR(),
    camera_target: 'two_pacific', camera_shot: 1.2, camera_frame: [0.5, 0.42],
    ...P('passepartout', SPOT.pp_rail, 100, { look: [80, 400, -5] }),
    ...P('fix', SPOT.fix_from, toward(SPOT.fix_from, SPOT.fix_pp)) });
  // (as pacific leaves them: face to face)
  const MET = () => ({ ...PACIFIC(), fix_a: SPOT.fix_pp[0], fix_d: SPOT.fix_pp[1], fix_turn: toward(SPOT.fix_pp, SPOT.pp_rail), fix_look: 'passepartout#head',
    passepartout_turn: toward(SPOT.pp_rail, SPOT.fix_pp), passepartout_look: 'fix#head' });
  const CALENDAR = () => ({ ...SEA('general_grant', 'none', { speed: 0.8 }), ...CAM, ...NOBODY(), ...WEAR(),
    camera_target: 'calendar', camera_shot: 4, camera_frame: [0.5, 0.45],
    ...P('sailor', SPOT.sailor_cal, 0, { look: 'calendar#leaf' }),
    ...P('passepartout', SPOT.pp_cal, toward(SPOT.pp_cal, [plan.calendar[0], plan.house.d]), { look: 'calendar#leaf' }),
    ...P('fogg', plan.chair, 150, { on: [plan.chair[0], plan.chair[1], 0.42], do: loop('read_book'), with: ['notebook'], look: 'fogg#book', wear: null }) });
  const NEW_YORK = () => {
    const v = { ...SEA('henrietta', 'new_york'), ...CAM, ...NOBODY(), ...WEAR(),
      camera_target: 'fogg', camera_shot: 0.8, camera_frame: [0.7, 0.3],
      ...P('fogg', SPOT.gang, 330, { look: 'china#smoke' }),
      ...P('speedy', SPOT.bridge_speedy, 190, { do: loop('arms_folded'), look: 'fogg#head' }) };
    if (withIt('with_aouda')) Object.assign(v, P('aouda', SPOT.gang_aouda, 330, { look: 'china#smoke' }));
    if (withIt('with_pp')) Object.assign(v, P('passepartout', SPOT.gang_pp, 340, { look: 'china#smoke' }));
    if (withIt('with_fix')) Object.assign(v, P('fix', SPOT.gang_fix, 320, { look: 'china#smoke' }));
    return v;
  };
  const MUTINY = () => ({ ...SEA('henrietta', 'none', { speed: 0.85 }), ...CAM, ...NOBODY(), ...WEAR(),
    camera_target: 'fogg', camera_shot: 1.6, camera_frame: [0.45, 0.4],
    ...P('fogg', SPOT.bridge_fogg, 100, { look: [60, 300, 4] }) });
  const COAL = () => ({ ...SEA('henrietta', 'none', { speed: 0.6 }), ...CAM, ...NOBODY(), ...WEAR(),
    camera_target: 'coal_three', camera_shot: 0.55, camera_frame: [0.5, 0.42],
    ...P('stoker', SPOT.stoker, toward(SPOT.stoker, SPOT.coal_fogg), { look: 'fogg#head' }),
    ...P('fogg', SPOT.coal_fogg, toward(SPOT.coal_fogg, SPOT.stoker), { look: 'stoker#head' }),
    ...(withIt('with_pp') ? P('passepartout', SPOT.coal_pp, toward(SPOT.coal_pp, SPOT.stoker), { look: 'stoker#head' }) : {}),
    // (brought out in the beat)
    ...P('speedy', SPOT.house_door, 180, { here: false, mood: 'angry' }), ...P('sailor', [SPOT.house_door[0] + 0.7, SPOT.house_door[1]], 180, { here: false }) });
  const BURN = () => {
    const pp = withIt('with_pp');
    return { ...SEA('henrietta', 'none', { speed: 0.2, smoke: 0.6, fire: 0.3 }), ...BURN_VIEW, ...NOBODY(), ...WEAR(),
      ...P('stoker', SPOT.stoker_burn, 225, { do: loop('shovel'), look: 'hatch#fire' }),
      ...(pp ? P('passepartout', SPOT.pp_hatch, 60, { look: 'hatch#fire' })
        : P('fogg', SPOT.pp_hatch, 60, { look: 'hatch#fire', wear: { garment: 'waistcoat', hat: 'none' } })),
      ...(pp ? P('fogg', SPOT.bridge_fogg, 160, { look: 'hatch#fire' }) : {}),
      ...P('speedy', SPOT.speedy_burn, 150, { look: 'hatch#fire' }) };
  };
  // the parts as the game left them (the burn's): kept — the cut sets only the light and the people
  const QUEENSTOWN = () => {
    const cabin = get('speedy_cabin', 1) > 0.5;
    return { ship: 'henrietta', port: 'queenstown', night: 0, dawn: 1, fog: 0, smoke: 0.5, speed: 0.5, fire: 0.3, flare_glow: 0, speedy_grief: 0, porthole: 0, cell_close: 0,
      ...BURN_VIEW, camera_h: 2.2, camera_look: 0.02, ...NOBODY(), ...WEAR(),
      ...(cabin ? P('speedy', [plan.cabin.a, plan.cabin.d + 1.6], 160, { look: 'fogg#head' }) : {}),
      ...P('fogg', [1.4, 9.6], 30, { look: [120, 900, 10] }) };
  };
  // (from the starboard quarter, low, looking forward and up across the deck: the masts and the sails aslant)
  const SAILS = () => ({ ...SEA('henrietta', 'none', { speed: 0.3, smoke: 0, sails: 0 }), ...CAM, camera_x: 3.6, camera_z: -3.5, camera_h: -0.2, camera_look: -0.15, camera_yaw: -14, ...NOBODY(), ...WEAR(),
    ...P('speedy', SPOT.bridge_speedy, 150, { look: [0, 11, 16] }),
    ...P('fogg', SPOT.bridge_fogg, 200, { look: 'speedy#head' }) });
  const LIVERPOOL = () => {
    const v = { ...SEA('henrietta', 'liverpool', { fog: 1, smoke: 0.3 }), ...CAM, ...NOBODY(), ...WEAR(),
      camera_target: 'lv_two', camera_shot: 0.6, camera_frame: [0.38, 0.42],
      ...P('fogg', SPOT.lv_fogg, 120, { look: [12, 30, -1] }),
      ...P('fix', SPOT.lv_fix_from, toward(SPOT.lv_fix_from, SPOT.lv_fix)),
      ...P('policeman', SPOT.quay_1, 270), ...P('policeman_2', SPOT.quay_2, 270) };
    if (withIt('with_aouda')) Object.assign(v, P('aouda', SPOT.lv_aouda, 100, { look: [12, 30, -1] }));
    if (withIt('with_pp')) Object.assign(v, P('passepartout', SPOT.lv_pp, 100, { look: [12, 30, -1] }));
    return v;
  };
  // the cell, inside: the operator on the bench and the door (cell_two), Fogg on the bench, Fix outside the door
  const CELL = () => ({ ...SEA('henrietta', 'liverpool', { speed: 0, smoke: 0 }), ...CAM, camera_target: 'cell_two', camera_shot: 0.75, camera_frame: [0.5, 0.45], ...NOBODY(),
    ...P('fogg', BENCH, 180, { on: [BENCH[0], BENCH[1], 0.46], do: loop('sit_calm'), wear: null, look: CELL_AT(-1.2, 1.5).concat(1.2) }),
    ...P('fix', FIX_OUT, 90, { here: false }) });

  // ── the beats ──
  const B = {
    // ---- Suez, day: by the gangway's head Passepartout chats with Fix, who offers him a cigar; Fix goes over to the
    // consul and whispers to him, turned aft, while Passepartout looks at the town.
    suez: {
      from: SUEZ,
      run: async s => {
        const pp = s.person('passepartout'), fix = s.person('fix'), consul = s.person('consul');
        await s.wait(0.6);
        fix.reach({ r: 'passepartout#hand_r' });
        await s.wait(0.4);
        pp.reach({ r: 'fix#hand_r' });
        await s.wait(1.1);
        fix.reach(null);
        pp.reach(null);
        s.tell('suez:chat');
        await s.wait(3.6);
        // Fix goes; Passepartout's eyes go to the town over the rail
        pp.mood(null);
        pp.look([300, 900, 30]);
        pp.turn(70);
        s.camera({ target: 'fix_consul', shot: 1.35, frame: [0.5, 0.42], glide: 2.4 });
        await fix.walk([[2.2, 12.0], SPOT.fix_whisper]);
        fix.mood(null);
        consul.look('fix#head');
        await s.all(fix.turn(toward(SPOT.fix_whisper, SPOT.consul)), consul.turn(toward(SPOT.consul, SPOT.fix_whisper)));
        fix.look('consul#head');
        const w = fix.do('whisper');
        await s.wait(1);
        s.tell('suez:whisper');
        await w;
        consul.look('passepartout#head');
        await s.wait(2.4);
      },
    },
    // ---- Bombay at dawn on the horizon: Fogg at the rail with his notebook, turned to us; he looks up over the sea, and
    // back to the book.
    bombay: {
      from: BOMBAY,
      run: async s => {
        const fogg = s.person('fogg');
        await s.wait(1.6);
        fogg.look([30, -60, 4]);
        await s.wait(1.2);
        fogg.look('fogg#book');
        s.tell('bombay:book');
        await s.wait(2.6);
      },
    },
    // ---- The «Rangoon» at night, the moon's path on the sea: Fogg and Aouda at the rail, a step apart; she turns to
    // him (her line), he to her; held under the choice.
    rail_night: {
      from: NIGHT,
      run: async s => {
        const fogg = s.person('fogg'), aouda = s.person('aouda');
        await s.wait(3.2);
        aouda.look('fogg#head');
        await s.wait(0.4);
        await aouda.turn(toward(SPOT.aouda_rail, SPOT.fogg_rail));
        s.tell('rail_night:turns');
        await s.wait(0.8);
        fogg.look('aouda#head');
        await fogg.turn(toward(SPOT.fogg_rail, SPOT.aouda_rail));
        await s.wait(2);
      },
    },
    // ---- He steps round before her (his face to us), takes the plaid off his arm and lays it over her shoulders; her
    // hand comes up to its edge.
    plaid: {
      after: 'rail_night',
      from: NIGHT_TURNED,
      run: async s => {
        const fogg = s.person('fogg'), aouda = s.person('aouda');
        s.camera({ target: 'night_two', shot: 1.0, frame: [0.5, 0.42], glide: 1.8 });
        await fogg.walk([[3.9, 10.9], SPOT.fogg_plaid]);
        await s.all(fogg.turn(toward(SPOT.fogg_plaid, SPOT.aouda_rail)), aouda.turn(toward(SPOT.aouda_rail, SPOT.fogg_plaid)));
        fogg.reach({ r: 'aouda#shoulder_l', l: 'aouda#shoulder_r' });
        await s.wait(1.4);
        fogg.with(null);
        aouda.with(['plaid_shoulders']);
        await s.wait(0.5);
        fogg.reach(null);
        await s.wait(0.6);
        aouda.reach({ r: 'aouda#shoulder_l' });
        aouda.mood('smile');
        aouda.look('fogg#head');
        await s.wait(2.6);
        aouda.reach(null);
      },
    },
    // ---- She asks for his notebook and writes a line in it; he looks out at the sea.
    writes: {
      after: ['rail_night', 'plaid'],
      from: NIGHT_TURNED,
      run: async s => {
        const fogg = s.person('fogg'), aouda = s.person('aouda');
        s.camera({ target: 'night_two', shot: 1.0, frame: [0.5, 0.42], glide: 1.8 });
        const was = scene.get('aouda_with');
        fogg.with(['notebook']);
        fogg.reach({ r: 'aouda#hands' });
        await s.wait(1.2);
        fogg.with(Array.isArray(was) && was.includes('plaid_shoulders') ? null : ['plaid']);
        fogg.reach(null);
        aouda.with([...(Array.isArray(was) ? was.filter(x => x !== 'notebook') : []), 'notebook']);
        aouda.look('aouda#book');
        fogg.look([60, 300, -4]);
        // she turns to the lantern to write (her face to us); he to the sea
        await s.all(fogg.turn(80), aouda.turn(140));
        aouda.do('write_note', { loop: true });
        await s.wait(4.2);
        s.tell('writes:done');
        aouda.do('stand', { loop: true });
        aouda.look('fogg#head');
        await s.wait(2);
      },
    },
    // ---- The «General Grant» on the Pacific, sun: Passepartout at the rail (in his wings, if he wore them); Fix comes
    // aft from the deckhouse and stands before him; face to face — under the choice.
    pacific: {
      from: PACIFIC,
      run: async s => {
        const pp = s.person('passepartout'), fix = s.person('fix');
        await s.wait(0.8);
        await fix.walk([[2.8, 12.6], SPOT.fix_pp]);
        await fix.turn(toward(SPOT.fix_pp, SPOT.pp_rail));
        fix.look('passepartout#head');
        await s.wait(0.5);
        pp.look('fix#head');
        await pp.turn(toward(SPOT.pp_rail, SPOT.fix_pp));
        pp.mood('surprised');
        s.tell('pacific:fix');
        await s.wait(2);
        pp.mood(null);
      },
    },
    // ---- Passepartout hits him; Fix goes down, sits up on the deck and sets his hat right.
    punch: {
      after: 'pacific',
      from: MET,
      run: async s => {
        const pp = s.person('passepartout'), fix = s.person('fix');
        // wider and lower: the blow and the fall to the deck in sight
        s.camera({ target: 'two_pacific', shot: 0.7, frame: [0.5, 0.36], glide: 0.8 });
        pp.mood('angry');
        const hit = pp.do('punch');
        await s.wait(1.45);
        fix.mood('surprised');
        const fall = fix.do('knocked_down');
        await s.wait(0.2);
        s.tell('punch:down');
        await hit;
        pp.mood(null);
        pp.look('fix#head');
        await fall;
        fix.mood('tired');
        await s.wait(1.2);
      },
    },
    // ---- Passepartout, after a moment, holds out his hand; they shake.
    shake: {
      after: 'pacific',
      from: MET,
      run: async s => {
        const pp = s.person('passepartout'), fix = s.person('fix');
        await s.wait(1.4);
        pp.reach({ r: 'fix#hand_r' });
        await s.wait(0.8);
        fix.reach({ r: 'passepartout#hand_r' });
        fix.mood('smile');
        pp.mood('smile');
        await s.wait(2.4);
        pp.reach(null);
        fix.reach(null);
        await s.wait(1);
      },
    },
    // ---- A sailor by the deckhouse turns the calendar's leaf: Wednesday again (the leaf read close); he turns round;
    // Passepartout roars with laughter; Fogg in his deck chair with his notebook doesn't look up.
    calendar: {
      from: CALENDAR,
      run: async s => {
        const pp = s.person('passepartout'), sailor = s.person('sailor');
        await s.wait(0.8);
        sailor.reach({ r: 'calendar#leaf' });
        await s.wait(0.6);
        await s.move('leaf', 1, { over: 1.1, ease: 'inOut' });
        sailor.reach(null);
        s.tell('calendar:leaf');
        s.camera({ target: 'calendar_three', shot: 0.55, frame: [0.5, 0.45], glide: 2 });
        await sailor.turn(170);
        sailor.look('passepartout#head');
        await s.wait(1.8);
        pp.look('fogg#head');
        await pp.turn(toward(SPOT.pp_cal, plan.chair));
        pp.mood('laugh');
        s.tell('calendar:laugh');
        await pp.do('laugh_up');
        await s.wait(1.6);
      },
    },
    // ---- New York, the «Henrietta» at the quay: Fogg (and whoever is with him) at the gangway's head; the «China»'s
    // smoke far off on the horizon; he goes up to the bridge where Speedy stands — under the lines.
    new_york: {
      from: NEW_YORK,
      run: async s => {
        const fogg = s.person('fogg');
        await s.wait(1.4);
        s.tell('new_york:smoke');
        await s.wait(3.2);
        fogg.look('speedy#head');
        s.camera({ target: 'ny_two', shot: 0.6, frame: [0.5, 0.5], glide: 3 });
        await fogg.walk([[2.6, 12.6], SPOT.below_bridge]);
        await fogg.turn(toward(SPOT.below_bridge, SPOT.bridge_speedy));
        s.camera({ target: 'speedy', shot: 1.6, frame: [0.5, 0.36], glide: 2 });
        s.tell('new_york:speedy');
        await s.wait(2.4);
      },
    },
    // ---- At sea under steam: Fogg on the bridge; close — Speedy in his cabin's porthole, his red beard, roaring.
    mutiny: {
      from: MUTINY,
      run: async s => {
        await s.wait(2.4);
        await s.move('porthole', 1, { over: 0.5 });
        s.tell('mutiny:porthole');
        await s.wait(3.2);
        await s.move('porthole', 0, { over: 0.5 });
      },
    },
    // ---- The smoke thins; the stoker at the hatch spreads his hands; Speedy is brought out of his cabin by a sailor
    // and stands before Fogg — under the choice.
    coal: {
      from: COAL,
      run: async s => {
        const stoker = s.person('stoker'), fogg = s.person('fogg'), speedy = s.person('speedy'), sailor = s.person('sailor');
        s.move('smoke', 0.2, { over: 3 });
        await s.wait(0.8);
        const hands = stoker.do('spread_hands');
        await s.wait(1.2);
        s.tell('coal:stoker');
        speedy.here(true);
        sailor.here(true);
        await s.all(hands, speedy.walk([[0.0, 16.0], SPOT.speedy_brought]), sailor.walk([[1.1, 16.0], SPOT.sailor_brought]));
        speedy.look('fogg#head');
        sailor.look('speedy#head');
        fogg.look('speedy#head');
        await s.all(speedy.turn(toward(SPOT.speedy_brought, SPOT.coal_fogg)), fogg.turn(toward(SPOT.coal_fogg, SPOT.speedy_brought)));
        s.tell('coal:speedy');
        await s.wait(2);
      },
    },
    // ---- «The boilers»: the deck from the poop; the game drags the parts to the hatch (its keys); the beat only cuts
    // here and sets the fire going.
    burn: {
      from: BURN,
      run: async s => { await s.wait(1); },
    },
    // ---- Dawn, from the stern: the bare iron hull, Queenstown on the horizon; Speedy saluting from his cabin's roof if
    // it is left him.
    queenstown: {
      from: QUEENSTOWN,
      run: async s => {
        await s.wait(2.4);
        if (get('speedy_cabin', 1) > 0.5) {
          s.camera({ target: 'speedy', shot: 0.9, frame: [0.45, 0.42], glide: 2.6 });
          await s.wait(1.6);
          await s.person('speedy').do('salute');
        }
        await s.wait(1.6);
      },
    },
    // ---- The «Henrietta» under all her sails, slow; Speedy roaring with laughter on the bridge by Fogg.
    sails_only: {
      from: SAILS,
      run: async s => {
        const set = s.move('sails', 1, { over: 3, ease: 'inOut' });
        await set;
        // up to the bridge: the quarter's offsets go as the operator takes it
        for (const k of ['camera_x', 'camera_z', 'camera_h', 'camera_look', 'camera_yaw']) s.move(k, 0, { over: 2 });
        s.camera({ target: 'bridge_two', shot: 1.6, frame: [0.5, 0.4], glide: 2 });
        await s.wait(1.2);
        const speedy = s.person('speedy');
        speedy.look('fogg#head');
        speedy.mood('laugh');
        s.tell('sails_only:laugh');
        await speedy.do('laugh_up');
        await s.wait(1.4);
      },
    },
    // ---- Liverpool, 11:40, fog: the constables come up the gangway; Fix comes aft, his hand on Fogg's shoulder.
    liverpool: {
      from: LIVERPOOL,
      run: async s => {
        const fogg = s.person('fogg'), fix = s.person('fix'), p1 = s.person('policeman'), p2 = s.person('policeman_2');
        await s.wait(0.6);
        const fixes = (async () => { await s.wait(1.2); await fix.walk([[2.6, 12.4], SPOT.lv_fix]); })();
        await s.all(p1.walk([SPOT.gang_top, SPOT.pol_1]), (async () => { await s.wait(0.9); await p2.walk([[5.4, 9.2], SPOT.pol_2]); })());
        p1.turn(toward(SPOT.pol_1, SPOT.lv_fogg));
        p2.turn(toward(SPOT.pol_2, SPOT.lv_fogg));
        p1.look('fogg#head');
        p2.look('fogg#head');
        fogg.look('policeman#head');
        await fixes;
        await fix.turn(toward(SPOT.lv_fix, SPOT.lv_fogg));
        fix.look('fogg#head');
        fix.reach({ l: 'fogg#shoulder_l' });
        await s.wait(0.4);
        fogg.look('fix#head');
        s.tell('liverpool:hand');
        await s.wait(2.6);
      },
    },
    // ---- The cell, close: the bench, Fogg's watch open on it, his hands on his knees; the bars' shadow creeps over the
    // floor as the game moves `cell_time`.
    cell: {
      from: () => ({ ...CELL(), cell_close: 1 }),
      run: async s => { await s.wait(1); },
    },
    // ---- The insert closes on the cell itself; Fix bursts in, out of breath, and stands before Fogg: the two face to
    // face, held — the player decides what Fogg does (fix_down or fix_hand follow it).
    release: {
      after: 'cell',
      from: CELL,
      run: async s => {
        const fix = s.person('fix'), fogg = s.person('fogg');
        if ((scene.get('cell_close') ?? 0) > 0) await s.move('cell_close', 0, { over: 0.6 });
        await s.move('door', 1, { over: 0.5, ease: 'out' });
        fix.here(true);
        fix.mood('afraid');
        // (he is in, out of breath — his line begins as he comes up to Fogg)
        const run = fix.walk([CELL_AT(-2.6, 2.4), FIX_IN], { gait: 'run' });
        await s.wait(0.5);
        s.tell('release:in');
        fogg.look('fix#head');
        s.camera({ target: 'cell_two', shot: 0.9, frame: [0.5, 0.5], glide: 1.6 });
        await run;
        await fix.turn(toward(FIX_IN, BENCH));
        fix.look('fogg#head');
        await s.wait(1.6);
      },
    },
    // ---- What Fogg does, after release: he rises and strikes him, Fix goes down — or holds out his hand
    fix_down: { after: 'release', from: CELL, run: s => fixDown(s) },
    fix_hand: { after: 'release', from: CELL, run: s => fixHand(s) },
  };
  // Fogg rises and strikes him, Fix goes down —
  async function fixDown(s) {
    const fix = s.person('fix'), fogg = s.person('fogg');
    fogg.on(null);
    await fogg.do('rise_chair');
    await fogg.turn(toward(BENCH, FIX_IN));
    fogg.mood('angry');
    const hit = fogg.do('punch');
    await s.wait(1.6);
    const fall = fix.do('knocked_down');
    await hit;
    fogg.mood(null);
    await fall;
    await s.wait(1.2);
  }
  // — or Fogg rises and holds out his hand; Fix takes it
  async function fixHand(s) {
    const fix = s.person('fix'), fogg = s.person('fogg');
    fogg.on(null);
    await fogg.do('rise_chair');
    await fogg.turn(toward(BENCH, FIX_IN));
    fogg.reach({ r: 'fix#hand_r' });
    await s.wait(0.9);
    fix.reach({ r: 'fogg#hand_r' });
    fix.mood('sad');
    await s.wait(2.6);
  }
  return B;
}

// The showcase's own beats (not the game's): «The boilers» played out — the parts dragged to the hatch one after
// another — and the cell with the bars' shadow going over the floor.
function showcaseOnly(scene) {
  const drag = async (s, part) => {
    s.set(`drag_${part}`, 0);
    await s.move(`drag_${part}`, 1, { over: 2.4, ease: 'inOut' });
    s.set(part, 0);
    s.set(`drag_${part}`, 0);
    s.move('fire', anim.clamp((scene.get('fire') ?? 0) + 0.12, 0, 1), { over: 0.8 });
    await s.wait(0.6);
  };
  return {
    burn_show: {
      from: () => film(scene).burn.from(),
      run: async s => {
        await s.move('fire', 0.3, { over: 1 });
        await drag(s, 'boats');
        await drag(s, 'bunks');
        s.set('speedy_grief', 0.5);
        await drag(s, 'mast_main');
        await drag(s, 'deckhouse');
        s.set('speedy_grief', 1);
        await s.wait(1.5);
      },
    },
    cell_show: {
      from: () => film(scene).cell.from(),
      run: async s => {
        s.set('cell_time', 0);
        await s.move('cell_time', 1, { over: 8, ease: 'linear' });
        await s.move('cell_close', 0, { over: 0.6 });
      },
    },
  };
}
const SHOWCASE = ['suez', 'bombay', 'rail_night', 'plaid', 'writes', 'pacific', 'punch', 'calendar', 'new_york', 'mutiny', 'coal', 'burn_show', 'queenstown', 'sails_only', 'liverpool', 'cell_show', 'release', 'fix_hand'];

return {
  plan, SHIPS, PORTS, shipOf, portOf, quayed, COLOURS, colours, PARTS, PART_NAMES, partAt, partLook, partAnimate,
  poly, rect, line, shade, tint, pane, port, planked, door, houseSide, bulwarkSide, gunwaleSide, mast, yardsOf, yardsAnimate, boat, skyline, film, showcaseOnly, SHOWCASE, SPOT, toward,
  clamp01, mixc, css, rgba, glow, BURN_VIEW,
};
