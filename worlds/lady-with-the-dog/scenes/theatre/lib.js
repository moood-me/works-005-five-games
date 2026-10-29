// The theatre in S.: what the paintings and the script share — the house in metres, the painted audience, the shots,
// the film in beats (FILM: modules/beats.js plays it). Metres: across x (right of the start's line of sight), distance
// z (toward the stage). The start stands at the back of the parterre, under the balcony, looking at the stage.
//   The hall: walls x ±7, the back wall z 0, the stage's front z 18 (1 m high), the ceiling 9 m; the balcony over the
// back of the parterre, its front at z 7.6, its floor 3 m up, two columns under its front (x ±3.8). Ten rows of seats,
// a middle aisle (|x| < 0.38) and side aisles; row 1 nearest the stage. The corridor beside the hall (x 7.2…9.4) with
// the side door from the hall; the staircase landing apart (x 20.6…26, z 17…27): the door from the corridor, the
// gallery above with its flight, the way down on the left.
const clamp01 = v => Math.max(0, Math.min(1, Number(v) || 0));
const hash = (n, s) => anim.hash(n, s);

const G = {
  WALL_X: 7, BACK_Z: 0, STAGE_Z: 18, STAGE_H: 1, CEIL: 9,
  BALC_Z: 7.6, BALC_H: 3, COLS: [-3.8, 3.8],
  ROWZ: [15.4, 14.5, 13.6, 12.7, 11.8, 10.9, 10.0, 9.1, 8.2, 7.3],   // a sitter's hips in row 1…10
  SEAT_W: 0.55, SEAT_X0: 0.65, SEATS: 10,                           // seat i of a block at ±(SEAT_X0 + i·SEAT_W)
  SEAT_H: 0.45,                                                     // the seat's top
  BACK_OFF: 0.22,                                                   // a seat back behind its sitter's hips
  LANE: 0.36,                                                       // the way along a row: in front of its seats
  AISLE: 0,
  SIDE_DOOR: [7.0, 13.6],                                           // the side door: the hall's right wall
  OTHER_DOOR: [7.2, 16.4],                                          // the corridor's other door (Gurov comes out)
};
G.rowZ = row => G.ROWZ[row - 1];
G.seatX = (side, i) => side * (G.SEAT_X0 + i * G.SEAT_W);
G.seat = (row, x) => [x, G.rowZ(row), G.SEAT_H];

// who sits where in the hall: [row, x]. Anna is the fourth to come in; her husband sits on her left, at the aisle
const SEATS = {
  lady1: [3, G.seatX(-1, 4)],      // −2.85
  lady2: [2, G.seatX(-1, 2)],      // −1.75 (the second row: she turns back to the column when he took her for Anna)
  lady3: [3, G.seatX(-1, 0)],      // −0.65
  anna: [3, G.seatX(1, 1)],        // +1.20
  lady4: [3, G.seatX(1, 5)],       // +3.40
  lady5: [4, G.seatX(1, 3)],       // +2.30
  diderits: [3, G.seatX(1, 0)],    // +0.65
};
const ORDER = ['lady1', 'lady2', 'lady3', 'anna', 'lady4', 'lady5'];   // `enter` 1…6
// seats no painted spectator takes: the people's own, and in row 2 the two by the aisle on the right — the shot of
// her face (FACE) looks through them from the aisle
const RESERVED = { 2: [G.seatX(-1, 2), G.seatX(1, 0), G.seatX(1, 1)], 3: [G.seatX(-1, 4), G.seatX(-1, 0), G.seatX(1, 0), G.seatX(1, 1), G.seatX(1, 5)], 4: [G.seatX(1, 3)] };
const seatsOf = () => {
  const xs = [];
  for (let i = G.SEATS - 1; i >= 0; i--) xs.push(G.seatX(-1, i));
  for (let i = 0; i < G.SEATS; i++) xs.push(G.seatX(1, i));
  return xs;
};
const SEAT_XS = seatsOf();

// ── the rows ──
// a row of seats seen from behind (the copies stand in every row): backs of dull green velvet on dark wood
function seatRow(g) {
  for (const x of SEAT_XS) {
    g.fillStyle = '#3a2c22';                                                    // the wooden frame and the armrests
    g.fillRect(x - 0.27, -0.97, 0.54, 0.05);
    g.fillRect(x - 0.285, -0.66, 0.035, 0.66);
    g.fillRect(x + 0.25, -0.66, 0.035, 0.66);
    g.fillStyle = '#4c5e4a';                                                    // the velvet back
    g.beginPath(); g.moveTo(x - 0.24, -0.5); g.lineTo(x - 0.24, -0.9); g.quadraticCurveTo(x, -0.97, x + 0.24, -0.9); g.lineTo(x + 0.24, -0.5); g.closePath(); g.fill();
    g.fillStyle = 'rgba(220,235,210,0.08)'; g.fillRect(x - 0.2, -0.88, 0.4, 0.05);
    g.fillStyle = '#3c4a3a'; g.fillRect(x - 0.24, -0.52, 0.48, 0.06);
    g.fillStyle = '#2a201a'; g.fillRect(x - 0.24, -0.46, 0.48, 0.46);         // under the seat
  }
}

// ── the painted audience ──
// One row of spectators, the seated people's place left empty. `front`: seen from the stage (faces) — painted
// mirrored, since that card faces the other way; else from behind. `keep`: those who stay in the interval (0) or go
// out (1) — two layers moved by animate.
const COATS = ['#2b2c33', '#3a3330', '#2e3540', '#433a30', '#30302c', '#3d4038', '#4a4148', '#2a3a36'];
const HAIR = ['#2a2220', '#4a3626', '#6a5038', '#1e1a18', '#8a7258', '#b9b2a6'];
const SKIN = ['#d8b89e', '#e2c2a8', '#caa286', '#e8cbb2'];
function spectator(g, x, k, front) {
  const woman = hash(k, 3) < 0.5, s = 1.08 + hash(k, 4) * 0.12;
  const coat = COATS[Math.floor(hash(k, 5) * COATS.length)], hair = HAIR[Math.floor(hash(k, 6) * HAIR.length)];
  const skin = SKIN[Math.floor(hash(k, 7) * SKIN.length)];
  g.save(); g.translate(x + (hash(k, 8) - 0.5) * 0.06, 0); g.scale(s, s);
  // the shoulders and the body down to the seat
  g.fillStyle = coat;
  g.beginPath(); g.moveTo(-0.2, -0.45); g.quadraticCurveTo(-0.24, -0.92, -0.15, -1.0); g.quadraticCurveTo(0, -1.06, 0.15, -1.0);
  g.quadraticCurveTo(0.24, -0.92, 0.2, -0.45); g.closePath(); g.fill();
  if (front) {
    if (woman) { g.fillStyle = skin; g.beginPath(); g.ellipse(0, -0.98, 0.1, 0.04, 0, 0, Math.PI); g.fill(); }   // the neckline
    else { g.fillStyle = '#e8e4da'; g.beginPath(); g.moveTo(-0.05, -1.0); g.lineTo(0.05, -1.0); g.lineTo(0, -0.84); g.closePath(); g.fill(); } // the shirt front
  }
  g.fillStyle = skin; g.fillRect(-0.035, -1.08, 0.07, 0.08);                    // the neck
  g.beginPath(); g.ellipse(0, -1.15, 0.085, 0.1, 0, 0, Math.PI * 2); g.fill();   // the head
  g.fillStyle = hair;
  if (front) {
    g.beginPath(); g.ellipse(0, -1.21, 0.088, 0.055, 0, Math.PI, 0); g.fill();  // the hair over the brow
    g.fillStyle = '#3a2a24'; g.fillRect(-0.04, -1.16, 0.016, 0.01); g.fillRect(0.024, -1.16, 0.016, 0.01);   // the eyes
    if (!woman && hash(k, 9) < 0.5) { g.fillStyle = hair; g.fillRect(-0.035, -1.11, 0.07, 0.014); }        // a moustache
  } else {
    g.beginPath(); g.ellipse(0, -1.16, 0.09, 0.1, 0, Math.PI * 1.05, Math.PI * 1.95); g.lineTo(0.085, -1.1); g.lineTo(-0.085, -1.1); g.fill();
  }
  if (woman) { g.fillStyle = hair; g.beginPath(); g.ellipse(0, -1.26, 0.055, 0.045, 0, 0, Math.PI * 2); g.fill(); }   // a knot of hair
  else if (hash(k, 10) < 0.2) { g.fillStyle = '#e4e0d6'; g.fillRect(-0.09, -0.99, 0.18, 0.03); }                     // an officer's collar
  g.restore();
}
function crowdRow(g, row, front, keep) {
  const free = RESERVED[row] || [];
  SEAT_XS.forEach((x, i) => {
    if (free.some(f => Math.abs(f - x) < 0.01)) return;
    const k = row * 37 + i;
    if (hash(k, 1) < 0.16) return;                                       // an empty seat
    if ((hash(k, 2) < 0.45 ? 0 : 1) !== keep) return;                     // stays in the interval, or goes out
    spectator(g, front ? -x : x, k, front);
  });
}

// ── the hall's side walls (a card's own metres: x along the wall from the back wall, 0…18.6 — the right wall's card runs
// the other way and is painted mirrored; y up negative) ──
const DOORS_R = [13.6, 16.4];          // the right wall's two doors into the corridor (z)
function hallWall(g, e, { side }) {
  const L = 18.6, H = 9.05;
  if (side > 0) { g.translate(L, 0); g.scale(-1, 1); }
  g.fillStyle = '#d9cbb0'; g.fillRect(0, -H, L, H);                               // cream plaster
  g.fillStyle = '#4a3a2e'; g.fillRect(0, -1.1, L, 1.1);                          // the dark wainscot
  g.fillStyle = '#6a5440'; g.fillRect(0, -1.14, L, 0.05);
  g.fillStyle = '#c4a463'; g.fillRect(0, -8.85, L, 0.16);                         // the cornice
  // under the balcony: a door to the foyer
  g.fillStyle = '#2c221c'; g.fillRect(3.0, -2.5, 1.2, 2.5);
  g.fillStyle = '#6a5440'; g.fillRect(2.92, -2.58, 1.36, 0.08);
  // the boxes: two tiers over the parterre, five bays from the balcony to the proscenium
  for (const [y0, tier] of [[-3.0, 1], [-5.6, 2]]) {
    for (let b = 0; b < 5; b++) {
      const x0 = 7.9 + b * 2.0, k = tier * 10 + b + (side > 0 ? 50 : 0);
      g.fillStyle = '#2a2224'; g.fillRect(x0 + 0.1, y0 - 2.2, 1.8, 2.2);              // the box's dark inside
      for (let j = 0; j < 3; j++) {                                                     // heads in it
        if (hash(k * 3 + j, 21) < 0.45) continue;
        const hx = x0 + 0.45 + j * 0.55, hy = y0 - 1.25 - hash(k * 3 + j, 22) * 0.1;
        g.fillStyle = COATS[Math.floor(hash(k * 3 + j, 23) * COATS.length)];
        g.beginPath(); g.ellipse(hx, hy + 0.32, 0.2, 0.22, 0, Math.PI, 0); g.fill();
        g.fillStyle = SKIN[Math.floor(hash(k * 3 + j, 24) * SKIN.length)];
        g.beginPath(); g.ellipse(hx, hy, 0.085, 0.1, 0, 0, Math.PI * 2); g.fill();
        g.fillStyle = HAIR[Math.floor(hash(k * 3 + j, 25) * HAIR.length)];
        g.beginPath(); g.ellipse(hx, hy - 0.05, 0.088, 0.06, 0, Math.PI, 0); g.fill();
      }
      g.fillStyle = '#56684f';                                                          // the hangings, drawn aside
      g.beginPath(); g.moveTo(x0 + 0.1, y0 - 2.2); g.lineTo(x0 + 0.5, y0 - 2.2); g.quadraticCurveTo(x0 + 0.2, y0 - 1.4, x0 + 0.32, y0 - 0.9); g.lineTo(x0 + 0.1, y0 - 0.9); g.fill();
      g.beginPath(); g.moveTo(x0 + 1.9, y0 - 2.2); g.lineTo(x0 + 1.5, y0 - 2.2); g.quadraticCurveTo(x0 + 1.8, y0 - 1.4, x0 + 1.68, y0 - 0.9); g.lineTo(x0 + 1.9, y0 - 0.9); g.fill();
      g.fillStyle = '#e2d4b8'; g.fillRect(x0, y0 - 0.95, 2.0, 0.95);                     // the front of the box
      g.fillStyle = '#c4a463'; g.fillRect(x0, y0 - 1.0, 2.0, 0.08); g.fillRect(x0, y0 - 0.06, 2.0, 0.08);
      g.strokeStyle = '#b8955a'; g.lineWidth = 0.03;
      g.beginPath(); g.moveTo(x0 + 0.2, y0 - 0.55); g.quadraticCurveTo(x0 + 1.0, y0 - 0.2, x0 + 1.8, y0 - 0.55); g.stroke();
      g.fillStyle = '#c4a463'; g.fillRect(x0 - 0.06, y0 - 2.4, 0.12, 2.45);              // the gilt pilaster between bays
    }
  }
  if (side > 0) {
    // the doors into the corridor: openings with their portières drawn aside
    for (const z of DOORS_R) {
      g.save(); g.globalCompositeOperation = 'destination-out'; g.fillRect(z - 0.5, -2.4, 1.0, 2.4); g.restore();
      g.fillStyle = '#6a5440'; g.fillRect(z - 0.6, -2.5, 1.2, 0.1); g.fillRect(z - 0.6, -2.5, 0.1, 2.5); g.fillRect(z + 0.5, -2.5, 0.1, 2.5);
      g.fillStyle = '#4c5e4a';
      g.beginPath(); g.moveTo(z + 0.5, -2.4); g.lineTo(z + 0.18, -2.4); g.quadraticCurveTo(z + 0.42, -1.3, z + 0.3, -0.05); g.lineTo(z + 0.5, -0.05); g.fill();
    }
  }
}

// ── the shots: place x, z (metres), the eye's height, yaw (right of the stage), pitch (up) ──
const cam = (x, z, eye, yaw = 0, pitch = 0) => ({ camera_target: null, camera_shot: null, camera_frame: null,
  camera_x: x, camera_z: z, camera_h: eye - 1.7, camera_yaw: yaw, camera_pitch: pitch, camera_roll: 0, camera_look: 0 });
const CAM = {
  BACK: cam(-1.8, 3.2, 1.9, -10, 6),        // at the back of the parterre, behind Gurov at the left column: the hall, the stage, the chandelier
  HALL: cam(0, 7.9, 4.5, 0, -29),          // from the balcony's front over the parterre: row 3 in the middle third, a seated lady ≈ 0.19 of the frame
  FACE: cam(0.6, 14.5, 1.2, 146, 6),       // from the empty seat in row 2 back at her, 1.1 m: her face lifted to him (he is out of the frame, in the aisle)
  CORRIDOR: cam(8.35, 19.8, 1.65, 182, 0), // down the corridor: she comes toward us from the side door; he steps out of the other door
  STAIRS: cam(23.2, 17.4, 1.65, 0, 3),     // the landing: the door from the corridor at the back, the gallery above right, the way down on the left
  TWO: cam(22.95, 21.15, 1.55, 0, 0),      // the two in profile under the lamp, medium, 1.9 m
  TURN: cam(22.4, 21.7, 1.5, -36, 0),      // her at the turn of the stairs, three-quarter, her face back to him
};

// the landing's places
const ST = {
  DOOR: [21.8, 26.6],          // just inside the door from the corridor (the door in the back wall, x 21.8)
  BEYOND: [21.8, 27.8],        // behind the door, in the corridor
  ANNA: [22.62, 23.0], GUROV: [23.3, 23.0],
  DOWN: [20.95, 23.7],         // at the turn of the stairs down, on the landing's side
  GONE: [19.7, 23.7],          // down the stairs, out of sight behind the wall
  BOY1: [24.25, 26.15], BOY2: [25.05, 26.2], BOYS_OFF: [26.6, 26.3],
  GALLERY: 2.0,
};
// the corridor's places
const CO = {
  SIDE_OUT: [7.75, 13.6],      // through the side door into the corridor
  SIDE_IN: [6.6, 13.6],        // the hall's side of the side door
  ANNA_STOP: [8.15, 15.6],
  OTHER_IN: [6.7, 16.4], GUROV_MEET: [7.95, 16.55],
};
// the hall's places
const HL = {
  COLUMN: [-3.75, 7.05],       // Gurov at the left column, his back to us
  BACK_DOOR: [0, 8.9],         // the middle aisle under the balcony's front, out of the balcony's shot: who comes in comes from here
  AISLE_AT: z => [G.AISLE, z],
};

function film(scene) {
  const on = k => Number(scene.get(k)) > 0.5;
  const seated = id => {
    const [row, x] = SEATS[id];
    return { [`${id}_here`]: true, [`${id}_a`]: x, [`${id}_d`]: G.rowZ(row), [`${id}_on`]: G.seat(row, x), [`${id}_do`]: 'seated',
      [`${id}_turn`]: 0, [`${id}_look`]: null, [`${id}_reach`]: null };
  };
  const away = id => ({ [`${id}_here`]: false, [`${id}_a`]: HL.BACK_DOOR[0], [`${id}_d`]: HL.BACK_DOOR[1], [`${id}_on`]: null, [`${id}_do`]: 'stand',
    [`${id}_turn`]: 0, [`${id}_look`]: null, [`${id}_reach`]: null });
  const ladies = (n, extra = {}) => {
    const o = {};
    ORDER.forEach((id, i) => Object.assign(o, i < n ? seated(id) : away(id)));
    return { ...o, enter: n, ...extra };
  };
  // where every beat may begin from: the hall lit, the curtain down, the hall full; nobody of ours in it
  const base = extra => ({
    ...CAM.BACK, hall_light: 1, curtain: 0, stage: 0.25, crowd: 1, leave: 0, glint: 0, door: 0,
    ...ladies(0), anna_with: ['lorgnette'], anna_mood: null,
    gurov_here: true, gurov_a: HL.COLUMN[0], gurov_d: HL.COLUMN[1], gurov_turn: 6, gurov_do: 'stand', gurov_on: null, gurov_look: null,
    gurov_reach: null, gurov_mood: 'thinking', gurov_gait: null, anna_gait: null, smoke: 0,
    ...away('diderits'), diderits_gait: null, diderits_mood: null,
    schoolboy1_here: false, schoolboy2_here: false,
    ...extra,
  });
  // the hall during the play: the six ladies in their seats, the husband beside her, the lights down, the curtain up
  const PLAYING = { ...ladies(6), ...seated('diderits'), hall_light: 0.3, curtain: 1, stage: 1, gurov_here: false };
  // the landing: the two of them, the schoolboys on the gallery
  const LANDING = {
    ...CAM.STAIRS, ...ladies(0), ...away('diderits'), anna_with: null,
    anna_here: true, anna_a: ST.ANNA[0], anna_d: ST.ANNA[1], anna_turn: 90, anna_look: 'gurov', anna_mood: 'afraid',
    gurov_here: true, gurov_a: ST.GUROV[0], gurov_d: ST.GUROV[1], gurov_turn: 270, gurov_look: 'anna', gurov_mood: 'sad',
    schoolboy1_here: true, schoolboy1_a: ST.BOY1[0], schoolboy1_d: ST.BOY1[1], schoolboy1_turn: 185, schoolboy1_do: 'lean_rail', schoolboy1_look: 'anna',
    schoolboy2_here: true, schoolboy2_a: ST.BOY2[0], schoolboy2_d: ST.BOY2[1], schoolboy2_turn: 175, schoolboy2_do: 'lean_rail', schoolboy2_look: 'gurov',
    smoke: 1,
  };
  const EMBRACE = {
    gurov_do: 'embrace_her', anna_do: 'embrace_him',
    gurov_reach: { r: 'anna#back', l: 'anna#back' }, anna_reach: { r: 'gurov#back', l: 'gurov#back' },
    gurov_look: 'anna#head', anna_look: 'gurov#shoulder_r', anna_mood: 'sad',
  };
  // she walks along her row from her seat to the aisle she leaves by (x), getting up first
  async function rise(p, id) {
    const [row, x] = SEATS[id];
    p.on(null);
    await p.go('rise', { from: [x, G.rowZ(row)] });
  }
  const lane = row => G.rowZ(row) + G.LANE;

  return {
    // before the curtain: from behind Gurov at the column; the hall fills; the chandelier in the haze
    hall: {
      from: () => base({ crowd: 0.35 }),
      run: async s => {
        s.move('crowd', 1, { over: 10, ease: 'inOut' });
        await s.wait(4);
        s.person('gurov').look([0, 13.6, 1.2]);
        await s.wait(5);
        s.person('gurov').look([-2, 12, 1.2]);
        await s.wait(3);
      },
    },
    // a cut: from the balcony over the parterre; the ladies have not come in yet — “Find her” plays over it (`enter`)
    hall_find: {
      from: () => base({ ...CAM.HALL, gurov_here: false }),
      run: async s => { await s.wait(2); },
    },
    // the six in their seats; (noticed) the lady in the second row turns back to the column; the husband comes down the
    // aisle and along the row, bowing at every step, sits by her and puts her shawl right; the lights go down
    husband_in: {
      after: 'hall_find', from: () => base({ ...CAM.HALL, ...ladies(6), gurov_here: false }),
      run: async s => {
        const d = s.person('diderits'), anna = s.person('anna');
        if (on('noticed')) {
          const l2 = s.person('lady2');
          l2.turn(-38);
          l2.look([HL.COLUMN[0], HL.COLUMN[1], 1.6]);
          l2.mood('surprised');
        }
        anna.look([-6.2, 13.2, 3.4]);                                 // her lorgnette to a box on the left
        anna.reach({ r: [1.12, 13.86, 1.12] });
        await s.wait(1);
        d.here(true);
        d.gait('bow_walk');
        await d.walk([HL.AISLE_AT(lane(3)), [SEATS.diderits[1], lane(3)]]);
        d.gait(null);
        anna.reach(null);
        anna.look('diderits');
        await d.go('bow', { to: [SEATS.diderits[1], lane(3)], turn: 300 });
        await d.go('sit_down', { to: [SEATS.diderits[1], G.rowZ(3)], turn: 0 });
        d.on(G.seat(3, SEATS.diderits[1]));
        d.do('seated');
        d.reach({ l: 'anna#shoulder_l' });
        d.look('anna');
        s.tell('husband_in:sat');
        await s.wait(1.6);
        d.reach(null);
        d.look([0, 21, 2.5]);
        anna.look([0, 21, 2.2]);
        anna.mood('sad');
        s.move('hall_light', 0.3, { over: 4, ease: 'inOut' });
        s.move('curtain', 1, { over: 5, ease: 'inOut' });
        await s.move('stage', 1, { over: 4 });
        await s.wait(1.5);
      },
    },
    // the interval: the lights up, the curtain down; the husband gets up and goes out; she stays in her seat
    interval_out: {
      after: 'husband_in', from: () => base({ ...CAM.HALL, ...PLAYING }),
      run: async s => {
        const d = s.person('diderits');
        s.move('hall_light', 1, { over: 2.5, ease: 'inOut' });
        s.move('curtain', 0, { over: 3, ease: 'inOut' });
        s.move('stage', 0.25, { over: 3 });
        s.move('leave', 1, { over: 7, ease: 'inOut' });
        await s.wait(1.5);
        d.look(null);
        await rise(d, 'diderits');
        d.gait('bow_walk');
        await d.walk([HL.AISLE_AT(lane(3)), HL.AISLE_AT(9.0), HL.BACK_DOOR]);
        d.gait(null);
        d.here(false);
        s.person('anna').look([0, 21, 2.2]);
        await s.wait(1);
      },
    },
    // the interval: he stays and looks round the hall; she gets up and goes out alone by the side door
    interval_stay: {
      after: 'husband_in', from: () => base({ ...CAM.HALL, ...PLAYING }),
      run: async s => {
        const d = s.person('diderits'), anna = s.person('anna');
        s.move('hall_light', 1, { over: 2.5, ease: 'inOut' });
        s.move('curtain', 0, { over: 3, ease: 'inOut' });
        s.move('stage', 0.25, { over: 3 });
        s.move('leave', 1, { over: 7, ease: 'inOut' });
        const looking = (async () => {
          for (const p of [[-6.4, 12, 3.6], [-3, 3, 4.2], [4, 4, 4.2], [6.4, 11, 3.6]]) { d.look(p); await s.wait(1.6); }
        })();
        await s.wait(1.2);
        anna.look(null);
        await rise(anna, 'anna');
        await anna.walk([[SEATS.anna[1], lane(3)], [6.2, lane(3)], [6.3, G.SIDE_DOOR[1]], CO.SIDE_IN]);
        anna.here(false);
        await looking;
        await s.wait(0.6);
      },
    },
    // he comes through the parterre to her row and stands by her seat; a cut — her face lifted to him, afraid; she rises
    approach: {
      after: 'interval_out', from: () => base({ ...CAM.HALL, ...PLAYING, ...away('diderits'), hall_light: 1, curtain: 0, stage: 0.25, leave: 1,
        gurov_here: false, gurov_a: HL.BACK_DOOR[0], gurov_d: HL.BACK_DOOR[1], gurov_turn: 0 }),
      run: async s => {
        const g = s.person('gurov'), anna = s.person('anna');
        const face = s.shot({ ...CAM.FACE });
        g.here(true);
        g.look('anna');
        await g.walk([HL.AISLE_AT(9.6), HL.AISLE_AT(lane(3) - 0.1)]);
        await g.turn(80);
        s.tell('approach:at');
        await s.until(() => face.ready);
        face.cut();
        anna.look('gurov');
        anna.mood('afraid');
        await s.wait(2.2);
        await rise(anna, 'anna');
        anna.look('gurov');
        await s.wait(1.5);
      },
    },
    // a cut: the corridor; she comes toward us from the side door; he steps out of the other door before her
    corridor: {
      from: () => base({ ...CAM.CORRIDOR, ...ladies(0), hall_light: 1, leave: 1,
        anna_here: true, anna_a: CO.SIDE_OUT[0], anna_d: CO.SIDE_OUT[1], anna_turn: 0, anna_with: ['lorgnette'],
        gurov_here: false, gurov_a: CO.OTHER_IN[0], gurov_d: CO.OTHER_IN[1], gurov_turn: 90 }),
      run: async s => {
        const g = s.person('gurov'), anna = s.person('anna');
        await anna.walk([CO.ANNA_STOP]);
        g.here(true);
        g.look('anna');
        await g.walk([CO.GUROV_MEET]);
        await g.turn(200);
        anna.look('gurov');
        anna.mood('afraid');
        s.tell('corridor:meet');
        await anna.go('step_back', { from: CO.ANNA_STOP, turn: 0 });
        await s.wait(2);
      },
    },
    // a cut: the landing; she comes in from the corridor — fast (anna_life 0) or as she always walks; he after her;
    // they stop in the middle (stairs:landing); faces: the two in profile under the lamp; the schoolboys above lean on
    // the rail, smoke at a hand; they hold each other; the schoolboys look down; back to the landing — under the choice
    stairs: {
      from: () => base({ ...LANDING, anna_here: false, anna_a: ST.BEYOND[0], anna_d: ST.BEYOND[1], anna_turn: 180, anna_mood: 'afraid',
        gurov_here: false, gurov_a: ST.BEYOND[0], gurov_d: ST.BEYOND[1], gurov_turn: 180, door: 0 }),
      run: async s => {
        const g = s.person('gurov'), anna = s.person('anna');
        await s.move('door', 1, { over: 0.8, ease: 'out' });
        anna.here(true);
        if (!on('anna_life')) anna.gait('walk_fast');
        const follows = (async () => {
          await s.wait(1.4);
          g.here(true);
          await g.walk([ST.DOOR, ST.GUROV]);
        })();
        await anna.walk([ST.DOOR, ST.ANNA]);
        anna.gait(null);
        await anna.turn(90);
        anna.look('gurov');
        await follows;
        await g.turn(270);
        g.look('anna');
        s.move('door', 0, { over: 1.4, ease: 'inOut' });
        const two = s.shot({ ...CAM.TWO });
        s.tell('stairs:landing');
        await s.until(() => two.ready);
        two.cut();
        anna.mood('afraid');
        await s.wait(5);
        anna.mood('sad');
        g.do('embrace_her');
        anna.do('embrace_him');
        g.reach({ r: 'anna#back', l: 'anna#back' });
        anna.reach({ r: 'gurov#back', l: 'gurov#back' });
        g.look('anna#head');
        anna.look('gurov#shoulder_r');
        const wide = s.shot({ ...CAM.STAIRS });
        await s.wait(4);
        await s.until(() => wide.ready);
        wide.cut();
        s.person('schoolboy1').look('anna');
        s.person('schoolboy2').look('anna');
        await s.wait(2);
      },
    },
    // she presses his hand, goes to the turn of the stairs; there she turns back once — her face to him — and is gone
    promise_go: {
      after: 'stairs', from: () => base({ ...LANDING, ...EMBRACE }),
      run: async s => {
        const g = s.person('gurov'), anna = s.person('anna');
        g.do('stand'); anna.do('stand');
        g.reach({ r: 'anna#hand_l' });
        anna.reach({ l: 'gurov#hand_r' });
        anna.look('gurov');
        g.look('anna');
        await s.wait(1.6);
        g.reach(null); anna.reach(null);
        const turn = s.shot({ ...CAM.TURN });
        await anna.walk([ST.DOWN]);
        await anna.turn(105);
        anna.look('gurov');
        await s.until(() => turn.ready);
        turn.cut();
        s.tell('promise_go:back');
        const wide = s.shot({ ...CAM.STAIRS });
        await s.wait(2.6);
        await s.until(() => wide.ready);
        wide.cut();
        await anna.walk([ST.GONE]);
        anna.here(false);
        g.look([20.6, 23.7, 1.2]);
      },
    },
    // she goes to the turn of the stairs and down, not looking back
    away_go: {
      after: 'stairs', from: () => base({ ...LANDING, ...EMBRACE }),
      run: async s => {
        const g = s.person('gurov'), anna = s.person('anna');
        g.do('stand'); anna.do('stand');
        g.reach(null); anna.reach(null);
        anna.look(null);
        g.look('anna');
        await anna.walk([ST.DOWN, ST.GONE]);
        anna.here(false);
        g.look([20.6, 23.7, 1.2]);
        await s.wait(2.4);
      },
    },
    // the bell: Gurov alone on the landing; the schoolboys go up and away
    bell: {
      after: ['promise_go', 'away_go'], from: () => base({ ...LANDING, anna_here: false, gurov_look: [20.6, 23.7, 1.2] }),
      run: async s => {
        const b1 = s.person('schoolboy1'), b2 = s.person('schoolboy2'), g = s.person('gurov');
        s.set('smoke', 0);
        await s.wait(1);
        b1.do('stand'); b2.do('stand');
        const off = s.all(b1.walk([ST.BOYS_OFF]), (async () => { await s.wait(0.6); await b2.walk([ST.BOYS_OFF]); })());
        g.mood('tired');
        await off;
        b1.here(false); b2.here(false);
        await s.wait(1.5);
      },
    },
  };
}

return { clamp01, G, DOORS_R, hallWall, SEATS, ORDER, RESERVED, SEAT_XS, seatRow, crowdRow, CAM, cam, ST, CO, HL, film };
