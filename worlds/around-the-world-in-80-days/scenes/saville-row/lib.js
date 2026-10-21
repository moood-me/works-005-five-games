// Saville Row's plan and what several elements paint and move. Metres: `across` along the street (left negative), `d`
// ahead of the viewer, who stands on the near pavement across the street from Fogg's house; up from the pavement on
// the houses (painted y down, as the engine has it). Everything is painted once, in its daylight colours: the hour is
// the scene's light (`night`, its looks), the gas and the lit rooms are glows and layers their animates set.
const { mixc, rgba, gas, london, lin } = kit.light;

const plan = {
  // the pavements are a kerb higher than the roadway
  kerb: 0.14,
  // the roadway, from the near kerb to the far one
  road: [2.6, 15.4],
  // the railings before the houses, and the houses' fronts
  rail: 19.8,
  front: 21,
  // the terrace's floors: the ground floor raised over the steps, the first, the second, the parapet's foot
  floors: [0.84, 4.3, 7.9, 11.3],
  parapet: 11.9,
  ridge: 13.7,
  dormer: { half: 0.8, top: 13.5, at: 0.35 },
  // the steps up to each door, from the railings' line to the front
  steps: { w: 1.7 },
  // Fogg's house, No. 7: its middle, half its width; how deep its rooms are seen
  house: { across: -5, half: 3.6, room: 2.6 },
  // its windows, each the room it shows: [x from the house's middle, sill, width, height]; the attic's in its dormer
  windows: {
    win_hall: [1.8, 1.6, 1.15, 2.3],
    win_study: [0, 4.6, 1.7, 3.0],
    win_bedroom: [-1.8, 8.4, 1.15, 2.1],
    win_dressing: [1.8, 8.4, 1.15, 2.1],
    attic: [0, 12.2, 1.0, 1.05],
  },
  // the door's middle (from the house's middle), its width and height over the ground floor, its fanlight; the bell-pull
  // beside it (from the door's middle, up from the ground floor)
  door: { x: -1.8, w: 1.15, h: 2.7, fan: 0.45, bell: [0.72, 1.1] },
  // the terrace either side of the house, the side street going off between it and the next block, the club at the end
  // of the street, set back behind its forecourt
  terrace: [-62, 12.4],
  // where the elements painting the whole row stand (its middle, across)
  row: -12,
  side: [12.4, 22.4],
  block: [22.4, 37.4],
  club: { across: 53.4, half: 16, d: 29, run: 1.6, rise: 0.96 },
  // the club's front: nine bays; its floors' windows [sill, height, width]; the main cornice
  clubBays: [-13.6, -10.2, -6.8, -3.4, 0, 3.4, 6.8, 10.2, 13.6],
  clubFloors: [[1.9, 3.0, 1.4], [7.0, 3.6, 1.5], [12.0, 2.4, 1.4]],
  clubTop: 16.2,
  // gas lamps [name, across, d]: by Fogg's door, along the far kerb, before the club, down the side street; and on the
  // near pavement, by the viewer
  lamps: [
    ['door', -8.2, 19.5], ['l1', -21, 15.9], ['l2', 5, 15.9], ['l3', 11.2, 15.9], ['l4', 33, 15.9],
    ['l5', 48, 27.6], ['l6', 58.8, 27.6],
    ['s1', 13.8, 30], ['s2', 21, 44], ['s3', 13.8, 60], ['s4', 21, 80], ['s5', 13.8, 104], ['s6', 21, 132],
  ],
  near: [['n1', -14, 2.35], ['n2', 9, 2.35], ['n3', 36, 2.35]],
  // how far the street's planes run either way (across): past where the traffic comes from and goes to
  street: [-100, 110],
  // the traffic: the cabs' lanes (the far one going right, toward the club; the near one left — London keeps left),
  // where they come out of the fog and go into it; the passers-by on the far pavement, along its kerb side (Fogg and
  // the others keep to the houses' side), between the ends of the street they walk
  lanes: { cab: 12.4, cab2: 5.8 },
  ends: [-96, 104],
  walkers: { walker1: 16.2, walker2: 16.9, walker3: 16.5 },
  walk: [-72, 78],
};

// Every house of the row, Fogg's among them: { x0, x1 (across), door (its door's middle), fogg, tone 0…1 — how pale
// its stucco }. Each a little different, all to one plan.
const houses = (() => {
  const out = [];
  const H = plan.house;
  const add = (from, to, seed) => {
    const n = Math.max(1, Math.round((to - from) / 7.2));
    const k = [...Array(n)].map((_, i) => 1 + 0.25 * (anim.hash(i, seed) - 0.5));
    const sum = k.reduce((a, b) => a + b, 0);
    let x = from;
    k.forEach((u, i) => {
      const w = ((to - from) * u) / sum;
      out.push({ x0: x, x1: x + w, door: anim.hash(i, seed + 1) < 0.5 ? x + w * 0.25 : x + w * 0.75, tone: anim.hash(i, seed + 2) });
      x += w;
    });
  };
  add(plan.terrace[0], H.across - H.half, 11);
  out.push({ x0: H.across - H.half, x1: H.across + H.half, door: H.across + plan.door.x, fogg: true, tone: 1 });
  add(H.across + H.half, plan.terrace[1], 23);
  add(plan.block[0], plan.block[1], 37);
  return out;
})();
const fogg = houses.find(h => h.fogg);
// the chimney stacks: on every party wall, a little higher or lower each (across, top)
const stacks = [...new Set(houses.flatMap(h => [h.x0, h.x1]).map(x => Math.round(x * 1000) / 1000))].map(x => [x, plan.ridge + 1.6 + 0.4 * anim.hash(Math.round(x * 10), 3)]);

// A house's windows, across: [x, sill, width, height] — a neighbour's two bays on each floor (the door in one of them),
// Fogg's as plan.windows has them (with the ids of the rooms they show).
function windowsOf(h) {
  if (h.fogg) return Object.entries(plan.windows).filter(([id]) => id !== 'attic').map(([id, [x, ...r]]) => [plan.house.across + x, ...r, id]);
  const out = [];
  for (const x of [h.x0 + (h.x1 - h.x0) * 0.25, h.x0 + (h.x1 - h.x0) * 0.75]) {
    if (Math.abs(x - h.door) > 0.1) out.push([x, 1.6, 1.1, 2.2]);
    out.push([x, 4.7, 1.1, 2.7], [x, 8.4, 1.1, 2.0]);
  }
  return out;
}
const dormerOf = h => [(h.x0 + h.x1) / 2, ...plan.windows.attic.slice(1)];
const fanOf = h => [h.door, plan.floors[0] + plan.door.h, plan.door.w, plan.door.fan];

// A sash window's panes, the holes its frame leaves: two sashes, `lights` panes across each (y down, its sill at
// -sill); the frame 6 cm, the bars 3.
function panes([x, sill, w, h], lights = 2) {
  const t = 0.06;
  const b = 0.03;
  const ph = (h - 3 * t) / 2;
  const pw = (w - 2 * t - (lights - 1) * b) / lights;
  const out = [];
  for (const k of [0, 1]) for (let i = 0; i < lights; i++) out.push([x - w / 2 + t + i * (pw + b), -sill - h + t + k * (ph + t), pw, ph]);
  return out;
}
const lightsOf = win => (win[2] > 1.5 ? 3 : 2);

// A front of the row (x0…x1 across, painted from `ox` — the element's anchor): the stucco, its windows' panes and Fogg's
// doorway cut out (what is behind shows through), the white sash frames, the neighbours' doors (theirs are not opened),
// a plinth, two string courses; Fogg's bell-pull by his door.
function front(g, h, ox) {
  const P = plan;
  const wins = windowsOf(h);
  const fan = fanOf(h);
  const top = -P.parapet;
  const X = x => x - ox;
  g.beginPath();
  g.rect(X(h.x0), top, h.x1 - h.x0, -top);
  for (const win of [...wins, fan]) for (const [x, y, w, hh] of panes(win, win === fan ? 3 : lightsOf(win))) g.rect(X(x), y, w, hh);
  if (h.fogg) g.rect(X(h.door - P.door.w / 2), -P.floors[0] - P.door.h, P.door.w, P.door.h);
  g.fillStyle = h.fogg ? '#d8d4ca' : rgba(mixc('#8f8a80', '#b2ac9f', h.tone));
  g.fill('evenodd');
  g.fillStyle = 'rgba(40,38,34,0.22)';
  g.fillRect(X(h.x0), -P.floors[0], h.x1 - h.x0, P.floors[0]);
  for (const y of [P.floors[1], P.floors[3]]) g.fillRect(X(h.x0), -y - 0.12, h.x1 - h.x0, 0.12);
  g.fillRect(X(h.x1) - 0.02, top, 0.04, -top);
  g.fillStyle = '#e4e2dc';
  for (const win of [...wins, fan]) {
    const [x, sill, w, hh] = win;
    g.beginPath();
    g.rect(X(x - w / 2), -sill - hh, w, hh);
    for (const [px, py, pw, ph] of panes(win, win === fan ? 3 : lightsOf(win))) g.rect(X(px), py, pw, ph);
    g.fill('evenodd');
  }
  const D = P.door;
  if (!h.fogg) {
    g.fillStyle = '#18191b';
    g.fillRect(X(h.door - D.w / 2), -P.floors[0] - D.h, D.w, D.h);
    g.fillStyle = 'rgba(255,255,255,0.05)';
    for (const y of [-P.floors[0] - D.h + 0.2, -P.floors[0] - D.h * 0.48]) {
      g.fillRect(X(h.door - D.w / 2 + 0.14), y, D.w / 2 - 0.2, D.h * 0.38);
      g.fillRect(X(h.door + 0.06), y, D.w / 2 - 0.2, D.h * 0.38);
    }
  } else {
    // the bell-pull: a brass knob in a round plate
    const bx = X(h.door + D.bell[0]), by = -P.floors[0] - D.bell[1];
    g.fillStyle = '#8a7444';
    g.beginPath();
    g.arc(bx, by, 0.05, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = '#c8a660';
    g.beginPath();
    g.arc(bx, by, 0.025, 0, Math.PI * 2);
    g.fill();
  }
}

// A wall of brick seen at its face (x0…x1 along it, up to `top`), its windows dark in rows — the side street's walls and
// its far end.
function brick(g, x0, x1, top, seed) {
  g.fillStyle = '#6e675d';
  g.fillRect(x0, -top, x1 - x0, top);
  g.fillStyle = '#2a2b2e';
  for (let x = x0 + 2.2; x < x1 - 1.4; x += 3.4) {
    for (const [sill, hh] of [[1.4, 2.2], [4.7, 2.5], [8.3, 2.0]]) {
      if (sill + hh > top - 0.8 || anim.hash(Math.round(x * 3), seed + sill) < 0.12) continue;
      g.fillRect(x, -sill - hh, 1.1, hh);
    }
  }
}

// A room of Fogg's, its back wall (x0…x1 across the house, from its floor y0 up to its ceiling y1, metres up): the wall
// in its colour, a skirting, a cornice line — the scene's light (its lamp, `lights`) lights it.
function room(g, x0, x1, y0, y1, color) {
  g.fillStyle = color;
  g.fillRect(x0, -y1, x1 - x0, y1 - y0);
  g.fillStyle = 'rgba(30,28,26,0.35)';
  g.fillRect(x0, -y0 - 0.16, x1 - x0, 0.16);
  g.fillStyle = 'rgba(255,255,255,0.12)';
  g.fillRect(x0, -y1, x1 - x0, 0.1);
}
// A gas bracket on a wall at (x, y): a brass arm and a glass tulip; its flame — the layer 'lit' (the tulip glowing, as
// bright as the room's key: roomMotion) and its light, named `name` (the scene's lights take it over: their `on` puts it
// out, glow and all).
function bracket(e, g, x, y, name) {
  g.strokeStyle = '#8a6e44';
  g.lineWidth = 0.025;
  g.beginPath();
  g.moveTo(x - 0.14, y + 0.12);
  g.quadraticCurveTo(x - 0.02, y + 0.12, x, y + 0.02);
  g.stroke();
  const tulip = (L, c) => {
    L.fillStyle = c;
    L.beginPath();
    L.moveTo(x - 0.06, y);
    L.quadraticCurveTo(x - 0.07, y - 0.12, x, y - 0.14);
    L.quadraticCurveTo(x + 0.07, y - 0.12, x + 0.06, y);
    L.closePath();
    L.fill();
  };
  tulip(g, '#9a9488');
  e.layer('lit', {}, L => tulip(L, '#fff3d6'));
  e.light(x, y - 0.07, 0.28, '#ffd59a', 0.9, name);
}
// a room's animate: its tulip as lit as its key (the light's own `on` dims its glow and its light)
function roomMotion(e, key) {
  e.layer('lit').alpha = anim.clamp(e.state[key] ?? 0, 0, 1);
}
// A wall clock at (x, y), radius r: a plain dial, its hands at the hour h (0…12) — Fogg's house keeps time.
function clock(g, x, y, r, h) {
  g.fillStyle = '#2a2420';
  g.beginPath();
  g.arc(x, y, r * 1.12, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = '#e8e2d4';
  g.beginPath();
  g.arc(x, y, r, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = '#2a2420';
  g.lineWidth = r * 0.07;
  g.lineCap = 'round';
  for (const [turn, len] of [[h / 12, 0.5], [h % 1, 0.8]]) {
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + Math.sin(turn * Math.PI * 2) * r * len, y - Math.cos(turn * Math.PI * 2) * r * len);
    g.stroke();
  }
}

// The low stone walls along either side of every flight of steps (the cheeks): one card at Fogg's, a part at each other
// house's door — the cards face sideways (cheeks_l 270, cheeks_r 90), so a part `dz` behind the face is that much
// across (left cheeks: right of Fogg's; right cheeks: left of it). The wall slopes up with the steps toward the house.
function cheeks(g, e, side) {
  const pale = '#b4b0a5';
  const paint = L => {
    L.fillStyle = pale;
    L.beginPath();
    // (side 1: the left cheek, x toward the street; -1: the right one, x away from it)
    L.moveTo(0.6 * side, 0);
    L.lineTo(0.6 * side, -0.4);
    L.lineTo(-0.6 * side, -1.1);
    L.lineTo(-0.6 * side, 0);
    L.closePath();
    L.fill();
    L.fillStyle = 'rgba(30,28,24,0.25)';
    L.beginPath();
    L.moveTo(0.6 * side, -0.4);
    L.lineTo(-0.6 * side, -1.1);
    L.lineTo(-0.6 * side, -1.04);
    L.lineTo(0.6 * side, -0.34);
    L.closePath();
    L.fill();
  };
  paint(g);
  for (const h of houses) if (!h.fogg) e.part(0, side * (h.door - fogg.door), paint);
}
// The dormers' cheeks (lead, from the dormer's front back to where the mansard's slope meets its top): Fogg's a card,
// every other house's a part, as the steps' cheeks are.
function dormerCheeks(g, e, side) {
  const top = plan.dormer.top - plan.parapet;
  const paint = L => {
    L.fillStyle = '#5a5e64';
    L.beginPath();
    L.moveTo(0, -0.138);
    L.lineTo(0, -top);
    L.lineTo(0.528 * side, -top);
    L.closePath();
    L.fill();
  };
  paint(g);
  const mid = h => (h.x0 + h.x1) / 2;
  for (const h of houses) if (!h.fogg) e.part(0, -side * (mid(h) - mid(fogg)), paint);
}

// The sky: London's fog by the hour — its colours (london(), and the Sunday morning's pale warmth over them) given to
// its shader (sky.wgsl) whenever the hour or the morning moves; nothing of it repainted.
function skyMotion(e) {
  const m = e.mem;
  const night = e.state.night ?? 1, sun = anim.clamp(e.state.sunday ?? 0, 0, 1);
  if (m.night !== night || m.sun !== sun || m.aspect !== e.aspect) {
    m.night = night; m.sun = sun; m.aspect = e.aspect;
    const A = london(night);
    const h = lin(mixc(A.high, '#b8c0c4', sun * 0.7), (m.h ??= [0, 0, 0]));
    const l = lin(mixc(A.low, '#ece2cf', sun * 0.8), (m.l ??= [0, 0, 0]));
    m.u = [h[0], h[1], h[2], l[0], l[1], l[2]];
  }
  const u = m.u;
  e.uniform('high_r', u[0]); e.uniform('high_g', u[1]); e.uniform('high_b', u[2]);
  e.uniform('low_r', u[3]); e.uniform('low_g', u[4]); e.uniform('low_b', u[5]);
  e.uniform('sun', sun);
  e.uniform('wide', e.aspect);
}

// The gas: a lamp element's animate sets each of its lamps' flames (e.light, by name) to the hour — the one by Fogg's
// door as much as `door_lamp` too (put out until Passepartout lights it: the beat lost).
function lampsMotion(e, list) {
  const k = gas(e.state.night), door = anim.clamp(e.state.door_lamp ?? 1, 0, 1);
  for (let i = 0; i < list.length; i++) e.glow(list[i][0], list[i][0] === 'door' ? k * door : k);
}

// ── «Ten minutes» (the beat pack): Passepartout seen only as a shadow in the lit window of the room he is in, rushing
// about in it (one element in each room: pp_hall … pp_attic; `pp_in` names the room), and what he throws flying out of
// that window into the bag on the top step (the element thing). ──
// where his shadow stands in each room (on the house: across from its middle, its floor) and how far it rushes either
// way; the room's light key (the attic's is its gas)
const PP_ROOMS = {
  hall: { x: plan.windows.win_hall[0], floor: plan.floors[0], half: 0.35, key: 'win_hall' },
  study: { x: plan.windows.win_study[0], floor: plan.floors[1], half: 0.6, key: 'win_study' },
  bedroom: { x: plan.windows.win_bedroom[0], floor: plan.floors[2], half: 0.35, key: 'win_bedroom' },
  dressing: { x: plan.windows.win_dressing[0], floor: plan.floors[2], half: 0.35, key: 'win_dressing' },
  attic: { x: plan.windows.attic[0], floor: plan.floors[3], half: 0.3, key: null },
};
// his shadow: a flat dark figure (the element glows: its dark is its own, whatever the room's light behind it), its feet at (0, 0) — round head and curls, broad shoulders, the short jacket, the
// arms out and bent (his hands full), legs astride; one layer (fig) its animate moves
function ppFigure(e) {
  e.layer('fig', { pivot: [0, 0] }, g => {
    g.fillStyle = '#2b2622';
    g.beginPath();
    g.arc(0, -1.55, 0.12, 0, Math.PI * 2);
    g.fill();
    g.fillRect(-0.05, -1.45, 0.1, 0.08);
    g.beginPath();
    g.moveTo(-0.24, -1.38);
    g.lineTo(0.24, -1.38);
    g.lineTo(0.2, -0.82);
    g.lineTo(-0.2, -0.82);
    g.closePath();
    g.fill();
    // the arms: out from the shoulders, bent at the elbows, the hands up before him
    g.lineCap = 'round';
    g.lineJoin = 'round';
    g.strokeStyle = '#2b2622';
    g.lineWidth = 0.1;
    g.beginPath();
    g.moveTo(-0.22, -1.33);
    g.lineTo(-0.4, -1.05);
    g.lineTo(-0.28, -1.22);
    g.moveTo(0.22, -1.33);
    g.lineTo(0.42, -1.12);
    g.lineTo(0.36, -1.42);
    g.stroke();
    // the legs, astride
    g.lineWidth = 0.13;
    g.beginPath();
    g.moveTo(-0.1, -0.85);
    g.lineTo(-0.2, 0);
    g.moveTo(0.1, -0.85);
    g.lineTo(0.2, 0);
    g.stroke();
  });
}
// his shadow's animate: there when packing and `pp_in` names its room (in or out over a third of a second), rushing to and fro
// across the room's window, turned the way it goes, bobbing with its quick steps
function ppMotion(e, room) {
  const R = PP_ROOMS[room], m = e.mem, want = e.state.packing && e.state.pp_in === room ? 1 : 0;
  m.a ??= want;
  m.a = anim.clamp(m.a + Math.sign(want - m.a) * e.dt / 0.3, 0, 1);
  const fig = e.layer('fig');
  fig.alpha = m.a;
  if (m.a <= 0) return;
  const x = R.half * anim.drift(e.t * 0.9, anim.hash(R.x * 7 + R.floor, 3) * 100);
  const v = (x - (m.x ?? x)) / Math.max(e.dt, 1e-3);
  m.x = x;
  if (Math.abs(v) > 0.08) m.f = Math.sign(v);
  fig.x = x;
  fig.scaleX = m.f ?? 1;
  fig.y = -0.04 * Math.abs(Math.sin(e.t * 8.5));
}
// what flies into the bag (`fly_what`), round its middle, about half a metre: two shirts, three pairs of stockings, the
// mackintosh, the Bradshaw — one layer (it) its animate shows while it flies, tumbling
function thing(e, what) {
  e.layer('it', { pivot: [0, 0] }, g => {
    if (what === 'shirt') {
      g.fillStyle = '#ece8de';
      g.beginPath();
      g.moveTo(-0.14, -0.2);
      g.lineTo(-0.3, -0.08);
      g.lineTo(-0.24, 0.0);
      g.lineTo(-0.13, -0.07);
      g.lineTo(-0.13, 0.2);
      g.lineTo(0.13, 0.2);
      g.lineTo(0.13, -0.07);
      g.lineTo(0.24, 0.0);
      g.lineTo(0.3, -0.08);
      g.lineTo(0.14, -0.2);
      g.closePath();
      g.fill();
      g.fillStyle = '#c9c4b8';
      g.fillRect(-0.06, -0.2, 0.12, 0.05);
    } else if (what === 'stockings') {
      g.strokeStyle = '#2e2a30';
      g.lineCap = 'round';
      g.lineWidth = 0.07;
      for (const k of [-1, 0, 1]) {
        g.beginPath();
        g.moveTo(-0.22, -0.1 + k * 0.08);
        g.quadraticCurveTo(0.05, -0.04 + k * 0.1, 0.16, 0.12 + k * 0.05);
        g.lineTo(0.26, 0.1 + k * 0.05);
        g.stroke();
      }
    } else if (what === 'coat') {
      g.fillStyle = '#9a8a66';
      g.beginPath();
      g.moveTo(-0.16, -0.26);
      g.lineTo(-0.36, -0.02);
      g.lineTo(-0.28, 0.06);
      g.lineTo(-0.2, -0.02);
      g.lineTo(-0.26, 0.28);
      g.lineTo(0.26, 0.28);
      g.lineTo(0.2, -0.02);
      g.lineTo(0.28, 0.06);
      g.lineTo(0.36, -0.02);
      g.lineTo(0.16, -0.26);
      g.closePath();
      g.fill();
      g.fillStyle = '#6e6248';
      g.fillRect(-0.01, -0.24, 0.02, 0.5);
    } else if (what === 'bradshaw') {
      g.fillStyle = '#7a2a22';
      g.fillRect(-0.11, -0.08, 0.22, 0.16);
      g.fillStyle = '#e2d8bc';
      g.fillRect(-0.11, 0.06, 0.22, 0.025);
      g.fillStyle = '#c8a660';
      g.fillRect(-0.08, -0.04, 0.16, 0.025);
    }
  });
}
function thingMotion(e) {
  const it = e.layer('it');
  it.alpha = e.state.thing_on ? 1 : 0;
  it.rotate = (e.state.thing_a ?? 0) * 2.4 + (e.state.thing_e ?? 0) * 1.3;
}

// ── The cabs: a hansom and its horse, side on, going along its lane (`place.across` — <id>_across), painted once facing
// the way it goes (dir 1 right, -1 left): the cab, its shafts, the cabman up behind; the horse's body, head and tail, its
// eight leg pieces and the near wheel are layers its animate moves — the wheel rolls and the legs trot by the ground the
// cab has gone over, so they go as fast as it goes, never slid; standing, the horse stands. Its lamp burns with the gas.
const HORSE = {
  // the legs: [layer, hip/shoulder pivot, knee/hock, hoof, phase in the trot (diagonal pairs together), far (behind the
  // body) or near]
  legs: [
    ['fore_n', [1.85, -1.08], [1.87, -0.56], [1.86, 0], 0, false],
    ['fore_f', [1.78, -1.08], [1.8, -0.56], [1.79, 0], Math.PI, true],
    ['hind_n', [0.55, -1.12], [0.43, -0.55], [0.5, 0], Math.PI, false],
    ['hind_f', [0.62, -1.12], [0.5, -0.55], [0.57, 0], 0, true],
  ],
  // one full trot (both diagonal pairs) — metres of ground; the wheel's radius and axle
  stride: 2.7,
  wheel: { r: 0.74, at: [-1.45, -0.74] },
  withers: [1.85, -1.42],
  tail: [0.3, -1.45],
};
const COATS = {
  cab: { horse: '#5a3c28', mane: '#24180f', body: '#1c2124', trim: '#3a3226' },
  cab2: { horse: '#8e8a82', mane: '#3e3a36', body: '#2a1d1e', trim: '#4a3a2a' },
};
// a tapering limb from a to b (widths wa, wb), its hoof at b
function limb(g, a, b, wa, wb, c, hoof) {
  const dx = b[0] - a[0], dy = b[1] - a[1], n = Math.hypot(dx, dy) || 1, nx = -dy / n, ny = dx / n;
  g.fillStyle = c;
  g.beginPath();
  g.moveTo(a[0] + nx * wa / 2, a[1] + ny * wa / 2);
  g.lineTo(b[0] + nx * wb / 2, b[1] + ny * wb / 2);
  g.lineTo(b[0] - nx * wb / 2, b[1] - ny * wb / 2);
  g.lineTo(a[0] - nx * wa / 2, a[1] - ny * wa / 2);
  g.closePath();
  g.fill();
  g.beginPath();
  g.arc(a[0], a[1], wa / 2, 0, Math.PI * 2);
  g.fill();
  if (hoof) {
    g.fillStyle = '#1a1612';
    g.fillRect(b[0] - 0.06, b[1] - 0.09, 0.12, 0.09);
  }
}
// what a colour is a little darker (the far legs, in the body's shadow)
const darker = (c, k) => rgba(mixc(c, '#000000', k));
function cab(g, e, dir) {
  const C = COATS[e.id];
  const flip = (L, f) => { L.save(); L.scale(dir, 1); f(L); L.restore(); };
  const P = ([x, y]) => [dir * x, y];
  const W = HORSE.wheel;
  // the far legs, behind the body
  for (const [name, hip, knee, hoof, , far] of HORSE.legs) {
    if (!far) continue;
    const col = darker(C.horse, 0.35);
    e.layer(`${name}_u`, { pivot: P(hip), depth: -0.45 }, L => flip(L, L => limb(L, hip, knee, 0.2, 0.1, col)));
    e.layer(`${name}_l`, { pivot: P(knee), depth: -0.45 }, L => flip(L, L => limb(L, knee, hoof, 0.09, 0.07, col, true)));
  }
  // the cab: its body on its springs, the apron's folding doors, the side window, the roof and the cabman's perch behind,
  // the shafts out to the horse, the lamp at its front corner
  flip(g, g => {
    g.fillStyle = C.trim;
    g.fillRect(-2.2, -0.86, 1.4, 0.06);
    g.strokeStyle = C.trim;
    g.lineWidth = 0.05;
    g.beginPath();
    g.moveTo(-0.9, -1.12);
    g.quadraticCurveTo(0.6, -1.2, 2.05, -1.32);
    g.stroke();
    g.fillStyle = C.body;
    g.beginPath();
    g.moveTo(-2.3, -0.95);
    g.lineTo(-0.95, -0.95);
    g.quadraticCurveTo(-0.7, -1.3, -0.85, -1.62);
    g.lineTo(-0.98, -2.15);
    g.quadraticCurveTo(-1.6, -2.32, -2.36, -2.22);
    g.lineTo(-2.44, -1.2);
    g.closePath();
    g.fill();
    // the apron's doors, a shade lighter, and the window
    g.fillStyle = 'rgba(255,255,255,0.06)';
    g.beginPath();
    g.moveTo(-0.95, -0.98);
    g.quadraticCurveTo(-0.74, -1.3, -0.88, -1.6);
    g.lineTo(-1.2, -1.6);
    g.lineTo(-1.2, -0.98);
    g.closePath();
    g.fill();
    g.fillStyle = '#14181c';
    g.fillRect(-1.95, -1.98, 0.62, 0.42);
    // the cabman's perch, and the cabman: a caped coat, a top hat, the reins in his hands, the whip up
    g.fillStyle = C.body;
    g.fillRect(-2.56, -2.42, 0.36, 0.22);
    g.fillStyle = '#2b2a2c';
    g.beginPath();
    g.moveTo(-2.62, -2.42);
    g.lineTo(-2.5, -2.98);
    g.quadraticCurveTo(-2.36, -3.06, -2.24, -2.98);
    g.lineTo(-2.12, -2.42);
    g.closePath();
    g.fill();
    g.fillStyle = '#b89478';
    g.beginPath();
    g.arc(-2.37, -3.1, 0.09, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = '#17171a';
    g.fillRect(-2.5, -3.16, 0.27, 0.025);
    g.fillRect(-2.46, -3.4, 0.19, 0.25);
    g.strokeStyle = '#2a2622';
    g.lineWidth = 0.015;
    g.beginPath();
    g.moveTo(-2.18, -2.72);
    g.quadraticCurveTo(-1.3, -3.6, -0.3, -3.3);
    g.stroke();
    // the lamp: a small brass box at the apron's corner
    g.fillStyle = '#6a5a3a';
    g.fillRect(-0.98, -1.92, 0.1, 0.16);
    g.fillStyle = '#e8dcb8';
    g.fillRect(-0.965, -1.89, 0.07, 0.09);
  });
  e.light(dir * -0.93, -1.85, 0.12, '#ffcf8a', 0.7, 'lamp');
  // the near wheel: rim, hub, twelve spokes (it rolls: rotate)
  e.layer('wheel', { pivot: P(W.at), depth: 0.35 }, L => flip(L, L => {
    const [ax, ay] = W.at;
    L.strokeStyle = '#2b2620';
    L.lineWidth = 0.06;
    L.beginPath();
    L.arc(ax, ay, W.r - 0.03, 0, Math.PI * 2);
    L.stroke();
    L.strokeStyle = '#4a3e30';
    L.lineWidth = 0.025;
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      L.beginPath();
      L.moveTo(ax + Math.cos(a) * 0.08, ay + Math.sin(a) * 0.08);
      L.lineTo(ax + Math.cos(a) * (W.r - 0.05), ay + Math.sin(a) * (W.r - 0.05));
      L.stroke();
    }
    L.fillStyle = '#3a3026';
    L.beginPath();
    L.arc(ax, ay, 0.1, 0, Math.PI * 2);
    L.fill();
  }));
  // the horse: the tail (stirring in the air), the body with its harness, the near legs, the neck and head
  e.layer('tail', { pivot: P(HORSE.tail), wind: 0.25 }, L => flip(L, L => {
    L.fillStyle = C.mane;
    L.beginPath();
    L.moveTo(0.36, -1.5);
    L.quadraticCurveTo(0.12, -1.3, 0.16, -0.78);
    L.lineTo(0.28, -0.76);
    L.quadraticCurveTo(0.3, -1.2, 0.44, -1.42);
    L.closePath();
    L.fill();
  }));
  e.layer('body', { depth: -0.1 }, L => flip(L, L => {
    L.fillStyle = C.horse;
    L.beginPath();
    L.moveTo(2.08, -1.18);
    L.quadraticCurveTo(2.0, -1.6, 1.75, -1.63);
    L.quadraticCurveTo(1.25, -1.48, 0.62, -1.6);
    L.quadraticCurveTo(0.24, -1.56, 0.3, -1.22);
    L.quadraticCurveTo(0.34, -1.02, 0.6, -1.0);
    L.quadraticCurveTo(1.2, -0.92, 1.9, -1.0);
    L.closePath();
    L.fill();
    // the harness: the saddle pad and its girth, the breeching round the quarters
    L.fillStyle = '#16120f';
    L.fillRect(1.25, -1.6, 0.26, 0.1);
    L.fillRect(1.32, -1.5, 0.08, 0.5);
    L.strokeStyle = '#16120f';
    L.lineWidth = 0.035;
    L.beginPath();
    L.moveTo(0.42, -1.38);
    L.quadraticCurveTo(0.9, -1.22, 1.32, -1.3);
    L.stroke();
  }));
  for (const [name, hip, knee, hoof, , far] of HORSE.legs) {
    if (far) continue;
    e.layer(`${name}_u`, { pivot: P(hip), depth: 0.12 }, L => flip(L, L => limb(L, hip, knee, 0.22, 0.11, C.horse)));
    e.layer(`${name}_l`, { pivot: P(knee), depth: 0.12 }, L => flip(L, L => limb(L, knee, hoof, 0.1, 0.075, C.horse, true)));
  }
  e.layer('head', { pivot: P(HORSE.withers) }, L => flip(L, L => {
    L.fillStyle = C.horse;
    L.beginPath();
    L.moveTo(1.7, -1.6);
    L.quadraticCurveTo(2.0, -1.95, 2.4, -2.1);
    L.lineTo(2.5, -2.02);
    L.quadraticCurveTo(2.62, -1.86, 2.84, -1.66);
    L.quadraticCurveTo(2.86, -1.55, 2.74, -1.54);
    L.quadraticCurveTo(2.58, -1.6, 2.44, -1.72);
    L.quadraticCurveTo(2.2, -1.5, 2.1, -1.2);
    L.closePath();
    L.fill();
    // the ears, the mane along the crest, the collar and the bridle
    L.beginPath();
    L.moveTo(2.36, -2.08);
    L.lineTo(2.38, -2.24);
    L.lineTo(2.45, -2.07);
    L.closePath();
    L.fill();
    L.fillStyle = C.mane;
    L.beginPath();
    L.moveTo(1.68, -1.62);
    L.quadraticCurveTo(1.98, -1.98, 2.38, -2.12);
    L.lineTo(2.34, -2.04);
    L.quadraticCurveTo(1.98, -1.88, 1.76, -1.56);
    L.closePath();
    L.fill();
    L.fillStyle = '#16120f';
    L.beginPath();
    L.ellipse(1.98, -1.42, 0.09, 0.27, -0.5, 0, Math.PI * 2);
    L.fill();
    L.strokeStyle = '#16120f';
    L.lineWidth = 0.02;
    L.beginPath();
    L.moveTo(2.44, -2.0);
    L.lineTo(2.76, -1.62);
    L.moveTo(2.52, -1.8);
    L.lineTo(2.78, -1.72);
    L.stroke();
    // the reins, back to the cabman's hands
    L.strokeStyle = '#201a14';
    L.lineWidth = 0.012;
    L.beginPath();
    L.moveTo(2.7, -1.68);
    L.quadraticCurveTo(0.4, -2.2, -2.18, -2.72);
    L.stroke();
  }));
  e.at(0, -1.7);
  e.at(dir * 2.4, -2.0, 'horse');
}
// a cab's animate: how far it has gone along its lane (its across: `key`) turns its wheel and sets its legs going, as
// much as it is moving (a horse eased into the trot and out of it, kept in e.mem); its lamp burns with the gas
function cabMotion(e, dir, key) {
  const m = e.mem;
  const a = e.state[key] ?? 0;
  const v = Math.abs(e.speed(key));
  m.amp ??= 0;
  m.amp += (Math.min(1, v / 3) - m.amp) * Math.min(1, e.dt * 3);
  const amp = m.amp;
  const s = a * dir;
  const phi = (2 * Math.PI * s) / HORSE.stride;
  e.layer('wheel').rotate = a / HORSE.wheel.r;
  const bob = amp * 0.025 * Math.cos(2 * phi);
  e.layer('body').y = bob;
  const head = e.layer('head');
  head.y = bob;
  // (the cab racing to the club, as fast as the game urges it — cab_pace: its horse throws its head the more)
  const pace = key === 'cab_across' ? anim.clamp(e.state.cab_pace ?? 0, 0, 1) : 0;
  head.rotate = dir * amp * (0.035 + 0.05 * pace) * Math.sin(2 * phi);
  e.layer('tail').y = bob;
  for (let i = 0; i < HORSE.legs.length; i++) {
    const [name, hip, knee, , off] = HORSE.legs[i];
    const swing = amp * 0.36 * Math.sin(phi + off);
    const bend = amp * 0.85 * Math.max(0, Math.cos(phi + off));
    const tu = -dir * swing;
    const u = e.layer(`${name}_u`), l = e.layer(`${name}_l`);
    u.rotate = tu;
    u.y = bob;
    // where the knee has gone, the hip turned by tu (mirrored with the painting)
    const kx = dir * (knee[0] - hip[0]), ky = knee[1] - hip[1];
    const c = Math.cos(tu), sn = Math.sin(tu);
    l.x = kx * c - ky * sn - kx;
    l.y = kx * sn + ky * c - ky + bob;
    l.rotate = dir * (bend - swing);
  }
  e.glow('lamp', gas(e.state.night));
}

// ── The film in beats (the world's module beats): played by the game one at a time (`beat`), and as the showcase. ──
const DOOR = plan.house.across + plan.door.x;
// in the hall, behind the door; on its threshold; at the foot of the steps; along the far pavement (the houses' side:
// a camera on someone walking there stands between them and the kerb's lamps, not behind a post);
// the bell-pull by the door (over the top step); under the lamp by the door (where Fix waits); the bag on the top step
const HALL = [DOOR, 22.6], SILL = [DOOR, 21.2], FOOT = [DOOR, 19.4], WALK_D = 18.8;
// on the top step: Fogg (on its left) and Aouda (on its right, by the door); a step lower, by the right cheek — Fix; under
// the lamp by the door, where it is lit
const TOP_F = [DOOR - 0.3, 20.7], TOP_A = [DOOR + 0.35, 20.95], STEP_FIX = [DOOR + 0.5, 20.15], UNDER_LAMP = [-7.95, 19.3];
// the race to the club (the beat cab): where the cab sets off and the club's door it draws up at (its across), the
// camera a little ahead of it; Fogg's way from the cab up the club's steps
const CAB = [-20, 51];
const camX = a => anim.clamp(a + 2.5, -18, 56);
const CLUB_RUN = [[49.6, 13.6], [52.6, 20], [53.4, 27.3], [53.4, 29.2]];
const BELL = [DOOR + plan.door.bell[0], plan.front - 0.03, plan.door.bell[1]], LAMP = [-8.0, 19.05], BAG = 'bag#bag';
// off along the street into the fog: right (toward the club), left
const RIGHT = [16, 18.4], LEFT = [-24, 18.4];
// the night as the film has it: fog, the rooms lit, the door shut; the camera the scene's own; the cabs out in the fog
// at their ends (the traffic's own sends them by); everyone off
const NIGHT = {
  night: 1, fog: 1, sunday: 0, door: 0, bag: 0, gas: 0, win_hall: 1, win_study: 1, win_bedroom: 0, win_dressing: 0,
  packing: 0, thing_on: 0, door_lamp: 1,
  camera_target: null, camera_shot: null, camera_frame: null, camera_glide: 0, camera_x: 0, camera_z: 0, camera_h: 0, camera_look: 0,
  cab_across: plan.ends[1], cab2_across: plan.ends[0],
};
// «Ten minutes»: the whole front of Fogg's house, its windows and the bag on the top step, from across the street — a
// little nearer, higher and turned up to it
const PACK_VIEW = { camera_x: plan.house.across, camera_z: 2.5, camera_h: 3.5, camera_look: 0.09 };
// where a thing thrown from a room's window starts (on the house: just out of its window), and the bag's mouth it falls
// into
const THROW_FROM = room => { const w = plan.windows[PP_ROOMS[room]?.key]; return w ? [w[0], -0.15, w[1] + w[3] * 0.45] : null; };
const INTO_BAG = [-1.32, -0.25, plan.floors[0] + 0.3];
// …and its way there, over the bag: [from, the top of its arc, the bag] (on the house)
const THROW = room => {
  const from = THROW_FROM(room);
  return from && [from, [(from[0] + INTO_BAG[0]) / 2, -1.1, Math.max(from[2], INTO_BAG[2]) + 0.9], INTO_BAG];
};
// the street's life in a beat: none where the camera stands on the far pavement close to someone (a passer-by would walk
// between it and them) — the passers-by sent off; as busy as `k` in the beats seen from across the street
const STREET = k => ({ traffic: k, ...(k ? {} : Object.fromEntries(Object.keys(plan.walkers).flatMap(w => [[`${w}_a`, plan.walk[0]], [`${w}_here`, false]]))) });
const person = (id, at, turn, more) => ({
  [`${id}_a`]: at[0], [`${id}_d`]: at[1], [`${id}_turn`]: turn, [`${id}_do`]: 'stand', [`${id}_look`]: null, [`${id}_reach`]: null,
  [`${id}_with`]: null, [`${id}_here`]: true, ...more,
});
const OFF = { fogg_here: false, passepartout_here: false, fix_here: false, aouda_here: false };
const FOGG = { fogg_wear: { hat: 'tophat' }, fogg_gait: 'fogg_walk' };
const PP = { passepartout_wear: null, passepartout_gait: 'pp_walk' };

function film(scene) {
  // a point before someone standing at `at` facing `turn`: `side` metres to their right, `fwd` ahead, `up` over their
  // feet — as a point of the world ([across, distance, elevation over the land there])
  const before = (at, turn, side, fwd, up) => {
    const t = (turn * Math.PI) / 180, a = at[0] + fwd * Math.sin(t) + side * Math.cos(t), d = at[1] + fwd * Math.cos(t) - side * Math.sin(t);
    return [a, d, scene.ground(at[0], at[1]) + up - scene.ground(a, d)];
  };
  const DRESS = () => scene.kit.cast.wears.aouda_dress;
  const has = key => (scene.get(key) ?? 0) > 0.5;
  // the runner of the last evening (the game's `runner`): Passepartout, or Fogg himself
  const runner = () => (scene.get('runner') === 'fogg' ? 'fogg' : 'passepartout');
  const runs = () => {
    const id = runner();
    return { id, d: `${id}_d`, a: `${id}_a`, set: at => ({ ...OFF, ...person(id, at, at === HALL ? 180 : 90, { [`${id}_wear`]: { hat: 'none' }, [`${id}_gait`]: 'run' }) }) };
  };
  return {
    // ---- 2 October, dusk: the street before the story — the lamps lit as the night comes down, a window lit, the cabs
    // and the passers-by going by in the fog
    dusk: {
      from: () => ({ ...NIGHT, ...OFF, ...STREET(1), night: 0.2, fog: 0.8, win_hall: 0, win_study: 0 }),
      run: async s => {
        await s.all(
          s.move('night', 0.8, { over: 24, ease: 'linear' }),
          s.sequence(async q => { await q.wait(13); await q.move('win_study', 1, { over: 1.2 }); }),
        );
      },
    },
    // ---- 2 October, 19:50. Fogg comes home along the far pavement, up his steps; the door; the hall lights up, then the
    // study.
    home: {
      from: () => ({ ...NIGHT, ...OFF, ...STREET(0), win_hall: 0, win_study: 0, camera_target: 'fogg', camera_shot: 0.72,
        ...person('fogg', [6, WALK_D], 270, FOGG), ...person('passepartout', HALL, 180, { ...PP, passepartout_here: false }) }),
      run: async s => {
        const f = s.person('fogg');
        await f.walk([[-5.4, WALK_D], FOOT, SILL]);
        await f.turn(0);
        f.look('door#handle');
        f.reach({ r: 'door#handle' });
        s.tell('home:door');
        await s.move('door', 1, { over: 0.8, ease: 'out' });
        f.reach(null);
        f.look(null);
        s.set('camera_glide', 1.5);
        s.set('camera_target', null);
        s.set('camera_shot', null);
        await f.walk([HALL]);
        f.here(false);
        s.tell('home:in');
        await s.move('door', 0, { over: 0.9, ease: 'inOut' });
        await s.move('win_hall', 1, { over: 0.6 });
        await s.wait(0.6);
        await s.move('win_study', 1, { over: 0.8 });
        await s.wait(1.5);
      },
    },
    // ---- Passepartout on the threshold, the hall's light behind him: «Round… the world?» (the game says the line)
    news: {
      after: 'home',
      from: () => ({ ...NIGHT, ...OFF, ...STREET(0), ...person('fogg', HALL, 180, { ...FOGG, fogg_here: false }), ...person('passepartout', HALL, 180, { ...PP, passepartout_here: false }) }),
      run: async s => {
        const p = s.person('passepartout');
        const next = s.shot({ camera_target: 'passepartout', camera_shot: 0.9, camera_glide: 0, ...person('passepartout', HALL, 180, PP) });
        await s.until(() => next.ready);
        next.cut();
        s.move('door', 1, { over: 0.6, ease: 'out' });
        await p.walk([SILL]);
        await p.turn(180);
        s.tell('news:at-door');
        await p.do('surprised');
        await s.wait(1);
      },
    },
    // ---- Ten minutes later: Fogg comes out, Passepartout after him — takes the bag from the top step — down the steps,
    // and the two away along the street into the fog (the attic's gas burning, if it was left on).
    out: {
      from: () => ({ ...NIGHT, ...OFF, ...STREET(0), door: 1, bag: 1, camera_target: 'fogg', camera_shot: 0.7,
        ...person('fogg', HALL, 180, FOGG), ...person('passepartout', HALL, 180, { ...PP, passepartout_here: false }) }),
      run: async s => {
        const f = s.person('fogg'), p = s.person('passepartout');
        const down = f.walk([SILL, FOOT, [DOOR + 1.5, WALK_D + 0.3]]);
        await s.until(() => s.get('fogg_d') < 21.0);
        p.here(true);
        await p.walk([[DOOR + 0.25, 21.15]]);
        await p.turn(160);
        p.look(BAG);
        p.reach({ r: BAG });
        await s.wait(0.6);
        p.with(['bag']);
        s.set('bag', 0);
        s.tell('out:bag');
        p.reach(null);
        p.look(null);
        const after = p.walk([[DOOR + 0.2, FOOT[1]]]);
        s.move('door', 0, { over: 1.2, ease: 'inOut' });
        await down;
        await f.turn(330);
        await after;
        s.set('camera_glide', 2);
        s.set('camera_target', null);
        s.set('camera_shot', null);
        await s.all(
          f.walk([[DOOR + 3, WALK_D - 0.2], RIGHT]),
          p.walk([[DOOR + 2.2, WALK_D + 0.5], [RIGHT[0] - 0.5, RIGHT[1] + 0.5]]),
        );
        f.here(false);
        p.here(false);
        s.tell('out:away');
      },
    },
    // ---- The last evening: the door flies open; the runner, no hat, out and down and away into the fog, running.
    run_out: {
      from: () => { const r = runs(); return { ...NIGHT, ...STREET(0), ...r.set(HALL), camera_target: r.id, camera_shot: 0.7 }; },
      run: async s => {
        const r = runs(), who = s.person(r.id);
        s.move('door', 1, { over: 0.4, ease: 'out' });
        const away = who.walk([SILL, FOOT, [DOOR - 2, WALK_D], LEFT]);
        await s.until(() => s.get(r.d) < 20.6);
        s.tell('run_out:out');
        s.move('door', 0.6, { over: 1.5, ease: 'inOut' });
        await away;
        who.here(false);
        s.tell('run_out:away');
      },
    },
    // ---- Under the lamp by the door, Fix with an evening paper: he fidgets, makes up his mind, goes up and rings.
    fix_paper: {
      from: () => ({ ...NIGHT, ...OFF, ...STREET(0), camera_target: 'fix', camera_shot: 0.7,
        ...person('fix', LAMP, 160, { fix_do: { motion: 'fidget_paper', loop: true }, fix_with: ['newspaper_folded'], fix_gait: null }) }),
      run: async s => {
        const x = s.person('fix');
        await s.wait(0.8);
        x.look([DOOR, plan.front, 1.4]);
        await s.wait(1.8);
        x.look([LEFT[0], LEFT[1], 1.6]);
        await s.wait(1.0);
        x.look(null);
        await s.wait(0.6);
        s.set('fix_do', 'stand');
        await x.walk([FOOT, [DOOR + 0.35, 20.95]]);
        await x.turn(0);
        x.look(BELL);
        x.reach({ r: BELL });
        await s.wait(0.9);
        s.tell('fix_paper:rings');
        x.reach(null);
        x.look(null);
        await s.wait(0.8);
      },
    },
    // ---- The runner comes back out of the fog, running, up the steps and in at the open door.
    run_back: {
      after: 'run_out',
      from: () => { const r = runs(); return { ...NIGHT, ...STREET(0), ...r.set(LEFT), door: 0.6, camera_target: r.id, camera_shot: 0.7 }; },
      run: async s => {
        const r = runs(), who = s.person(r.id);
        who.wear({ hat: 'none' });
        who.gait('run');
        who.here(true);
        const back = who.walk([[DOOR - 2, WALK_D], FOOT, SILL, HALL]);
        await s.until(() => s.get(r.a) > DOOR - 3);
        s.move('door', 1, { over: 0.4, ease: 'out' });
        await back;
        who.here(false);
        s.tell('run_back:in');
        await s.move('door', 0, { over: 0.6, ease: 'in' });
      },
    },
    // ---- Along Pall Mall to the club: a cab trots down the street to the Reform Club, the camera with it.
    to_club: {
      from: () => ({ ...NIGHT, ...OFF, ...STREET(0.6), cab_across: -34 }),
      run: async s => {
        const cam = s.move('camera_x', 50, { over: 24, ease: 'inOut' });
        await s.path(['cab_across'], [[s.get('cab_across')], [47]], { speed: 3.8, ease: 'linear' });
        await s.path(['cab_across'], [[47], [51]], { over: 2.2, ease: 'out' });
        s.tell('to_club:arrived');
        await cam;
        await s.wait(1.5);
      },
    },
    // ---- (the coda) Monday morning: Passepartout along the street with his bundle; at the steps he looks at his watch,
    // goes up and rings.
    pp_returns: {
      from: () => ({ ...NIGHT, ...OFF, ...STREET(0), night: 0, fog: 0.5, sunday: 1, win_hall: 0, win_study: 0, camera_target: 'passepartout', camera_shot: 0.7, camera_frame: 0.4,
        ...person('passepartout', LEFT, 90, { ...PP, passepartout_with: ['bundle'] }) }),
      run: async s => {
        const p = s.person('passepartout');
        // (he stops a step past the lamp by the door: it stays out of the shot on him)
        await p.walk([[DOOR - 1.6, WALK_D], [DOOR + 0.5, FOOT[1] - 0.3]]);
        await p.turn(0);
        const watch = p.do('watch_look');
        await s.wait(0.7);
        p.with(['bundle', 'watch']);
        p.look('passepartout#watch');
        s.tell('pp_returns:watch');
        await s.wait(2.2);
        p.with(['bundle']);
        p.look(null);
        await watch;
        await p.walk([[DOOR + 0.35, 20.95]]);
        await p.turn(0);
        p.look(BELL);
        p.reach({ r: BELL });
        await s.wait(0.9);
        s.tell('pp_returns:rings');
        p.reach(null);
        p.look(null);
        await s.wait(0.8);
      },
    },
    // ---- «Ten minutes» (the game's minigame): the front of the house, every window in the frame, the bag on the top
    // step, the gas burning in the attic (Passepartout lit it, packing), the street living. The beat only brings this
    // frame (`packing` 1); then, till another beat, Passepartout is his shadow in the window of the room he is in
    // (`pp_in`): its light comes on as he comes, the room he left goes dark; what he throws (`fly_what`, as `fly` rises)
    // flies out of that window into the bag (script.js).
    pack: {
      from: () => ({ ...NIGHT, ...OFF, ...STREET(0.6), ...PACK_VIEW, win_hall: 0, win_study: 0, gas: 1, bag: 0.15, packing: 1, pp_in: 'none' }),
      run: async s => {
        await s.wait(0.5);
      },
    },
    // ---- The epilogue, the evening: Fogg comes out onto the top step under the lamp by the door, Aouda after him. She
    // looks at him (her question), he turns to her (his answer); their hands. (The game says their lines.)
    proposal: {
      from: () => ({ ...NIGHT, ...OFF, ...STREET(0), night: 0.9, door: 1, camera_target: 'fogg', camera_shot: 0.75, camera_frame: [0.42, 0.38],
        ...person('fogg', SILL, 180, { fogg_wear: null, fogg_gait: 'fogg_walk' }), ...person('aouda', HALL, 180, { aouda_wear: DRESS() }) }),
      run: async s => {
        const f = s.person('fogg'), a = s.person('aouda');
        await f.walk([TOP_F]);
        await f.turn(150);
        await a.walk([TOP_A]);
        await a.turn(215);
        a.look('fogg#head');
        await s.wait(0.6);
        s.tell('proposal:asks');
        await s.wait(3.4);
        await f.turn(110);
        f.look('aouda#head');
        await s.wait(0.3);
        s.tell('proposal:answers');
        await s.wait(1.8);
        f.reach({ l: 'aouda#hand_r' });
        a.reach({ r: 'fogg#hand_l' });
        await s.wait(0.8);
        s.tell('proposal:hands');
        await s.wait(2.4);
      },
    },
    // ---- The ending «Two Wednesdays»: Sunday morning, the bells (the game's). Fogg on the top step reads his paper —
    // lowers it: the date; then he laughs, his head back — and Passepartout, come out of the door, with him.
    sunday: {
      from: () => {
        const at = TOP_F, turn = 180;
        return { ...NIGHT, ...OFF, ...STREET(0), night: 0, fog: 0.5, sunday: 1, win_hall: 0, win_study: 0, door: 0.6,
          camera_target: 'fogg', camera_shot: 0.7, camera_frame: [0.45, 0.38],
          ...person('fogg', at, turn, { fogg_wear: null, fogg_with: ['newspaper'], fogg_reach: { r: before(at, turn, 0.17, 0.32, 1.3), l: before(at, turn, -0.17, 0.32, 1.3) } }),
          ...person('passepartout', HALL, 180, { ...PP, passepartout_here: false }) };
      },
      run: async s => {
        const f = s.person('fogg'), p = s.person('passepartout');
        await s.wait(2.6);
        f.with(['newspaper_folded']);
        f.reach(null);
        s.tell('sunday:date');
        await s.wait(1.8);
        const laughs = [f.do('laugh_up')];
        s.tell('sunday:laugh');
        if (has('with_pp')) {
          p.here(true);
          laughs.push(s.sequence(async q => {
            await q.person('passepartout').walk([SILL, TOP_A]);
            await q.person('passepartout').turn(200);
            await q.person('passepartout').do('laugh');
          }));
        }
        await s.all(...laughs);
        await s.wait(1);
      },
    },
    // ---- The ending «Lost — and won»: the evening, on the steps — Fogg and whoever is with him; the lamp by the door
    // not yet lit, and Passepartout (or Fogg himself) lights it.
    lost: {
      from: () => ({ ...NIGHT, ...OFF, ...STREET(0), door: 0.6, door_lamp: 0, camera_target: 'fogg', camera_shot: 0.42, camera_frame: [0.6, 0.5],
        ...person('fogg', TOP_F, 190, { fogg_wear: null, fogg_gait: 'fogg_walk' }),
        ...person('aouda', TOP_A, 205, { aouda_wear: DRESS(), aouda_here: has('with_aouda') }),
        ...person('fix', STEP_FIX, 215, { fix_here: has('with_fix') }),
        ...person('passepartout', SILL, 180, { ...PP, passepartout_here: has('with_pp') }) }),
      run: async s => {
        const id = has('with_pp') ? 'passepartout' : 'fogg', who = s.person(id);
        await s.wait(0.8);
        await who.walk([FOOT, UNDER_LAMP]);
        await who.turn(305);
        who.look('lamps#door_flame');
        who.reach({ r: 'lamps#door_flame' });
        await s.wait(0.7);
        await s.move('door_lamp', 1, { over: 0.8, ease: 'out' });
        s.tell('lost:lamp');
        await s.wait(0.6);
        who.reach(null);
        who.look(null);
        await who.turn(120);
        await s.wait(2.5);
      },
    },
    // ---- (a coda) Eighty days of gas: the attic's window, close; the gas goes out.
    gas_off: {
      from: () => ({ ...NIGHT, ...OFF, ...STREET(0), gas: 1, camera_target: 'attic', camera_shot: 0.3, camera_frame: [0.5, 0.45] }),
      run: async s => {
        await s.wait(1.2);
        await s.move('gas', 0, { over: 0.8, ease: 'in' });
        s.tell('gas_off:out');
        await s.wait(2);
      },
    },
    // ---- «The cab» (the game's minigame): the cab in the fog down the street to the Reform Club, the camera with it.
    // The game urges it on (`cab_to` — how far along it should be; script.js takes it there, the camera with it, and says
    // where it is, `cab_at`); the lamps of carriages come out of the fog toward it (`traffic`). At the club it draws up;
    // Fogg jumps out and runs up the club's steps.
    cab: {
      from: () => ({ ...NIGHT, ...OFF, ...STREET(0.6), cab_across: CAB[0], cab_to: 0, cab_at: 0, cab_pace: 0, camera_x: camX(CAB[0]),
        ...person('fogg', CLUB_RUN[0], 90, { ...FOGG, fogg_here: false, fogg_gait: 'run' }) }),
      run: async s => {
        await s.until(() => (s.get('cab_at') ?? 0) >= 0.98);
        s.tell('cab:arrived');
        const f = s.person('fogg');
        await s.wait(0.4);
        f.here(true);
        s.move('camera_x', camX(CLUB_RUN[2][0]), { over: 2.5 });
        await f.walk(CLUB_RUN.slice(1));
        f.here(false);
        s.tell('cab:in');
        await s.wait(0.6);
      },
    },
  };
}
const SHOWCASE = ['dusk', 'home', 'news', 'pack', 'out', 'proposal', 'run_out', 'run_back', 'fix_paper', 'cab', 'to_club', 'lost', 'gas_off',
  'sunday', 'pp_returns'];

return {
  plan, houses, fogg, stacks, windowsOf, dormerOf, fanOf, panes, front, brick, room, bracket, roomMotion, clock, cheeks, dormerCheeks,
  skyMotion, lampsMotion, cab, cabMotion, PP_ROOMS, THROW, ppFigure, ppMotion, thing, thingMotion, CAB, camX, film, SHOWCASE, DOOR, mixc, rgba,
};
