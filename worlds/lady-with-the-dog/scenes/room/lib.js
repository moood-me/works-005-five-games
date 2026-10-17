// A room in Yalta: what the paintings and the script share — the room in metres, the shots, the film in beats (FILM:
// modules/beats.js plays it). The room seen from the wall opposite the balcony: the back wall at distance 5.8 with the
// open balcony door (across 0.35…1.55), the bed along it on the left, the little table on the right with the candle
// on its left end (between the two of them) and his chair at its right end, its back to the right wall.
const clamp01 = v => Math.max(0, Math.min(1, Number(v) || 0));
const WALL_D = 5.8, HALF = 2.7, CEIL = 3.2, FRONT_D = -0.55;
const DOOR = { x0: 0.35, x1: 1.55, h: 2.5 };
const BED = { x0: -2.55, x1: -0.55, d0: 4.45, d1: 5.45, top: 0.5 };
const TABLE = { x: 1.75, d: 3.9, w: 0.9, depth: 0.7, top: 0.74 };
const ANNA_SEAT = [-1.75, 4.62, 0.5];
const ANNA_APART = [-1.62, 4.62, 0.5];         // a palm further from him (`apart` 1)
const GUROV_BED_SEAT = [-2.42, 4.62, 0.5];     // on her left, toward the bed's head: from the balcony she is nearer
const GUROV_BED_STAND = [-2.3, 4.1];           // where he stands by the bed, past her, to set the plate down
const CHAIR_SEAT = [2.48, 3.92, 0.46];         // his chair at the table's right end, facing her (turn 270)
const GUROV_STAND = [1.75, 3.2];               // at the table, his back to us
const PLATE_TABLE = [2.0, 3.86, 0.745];        // before him on the table
const PLATE_BED = [-2.0, 4.95, 0.5];
const FLOOR_BEFORE_HER = [-1.25, 4.05, 0];

// ── the shots: place x, z (metres from the start), the eye's height, yaw (right of straight ahead), pitch ──
const cam = (x, z, eye, yaw = 0, pitch = 0) => ({ camera_target: null, camera_shot: null, camera_frame: null,
  camera_x: x, camera_z: z, camera_h: eye - 1.7, camera_yaw: yaw, camera_pitch: pitch, camera_roll: 0, camera_look: 0 });
const CAM = {
  ROOM: cam(0, 0, 1.7),                  // the whole room: bed left, table and candle right, the balcony door between
  EAT: cam(0.35, -0.4, 1.7),             // drawn back: she at the 4:3 window's left edge, he at its right, the candle between
  FACE: cam(-0.88, 3.52, 1.2, -38),      // her face at the candle, medium: 1.4 m off, three-quarter (she faces 115)
  BED: cam(-1.75, 3.2, 1.15, -13, -3),   // the two side by side on the bed (he left, she right), medium, faces three-quarter
  BALCONY: cam(-0.6, 5.6, 1.25, 236, -6),// from the balcony side by the bed's foot, back into the room: she nearer, turned
                                         // to the candle; he beyond her, his hand on her back
};

// ── the film ──
function film(scene) {
  const plateAt = p => p === 'bed' ? PLATE_BED : PLATE_TABLE;
  // where every beat may begin from: night, the candle new; she on the bed's edge, head bowed; he standing at the table
  const base = extra => {
    const v = {
      fade: 0, ...CAM.ROOM, hour: 0.9, candle: 0, melon: 0, cut: 0, slice: 0, hands: 0, hand_at: 0, pull: 0, palm: 0, plate: 'table',
      anna_here: true, anna_a: ANNA_SEAT[0], anna_d: ANNA_SEAT[1], anna_on: ANNA_SEAT, anna_turn: 110, anna_do: 'seated_bowed',
      anna_look: null, anna_reach: null, anna_mood: 'sad',
      gurov_here: true, gurov_a: GUROV_STAND[0], gurov_d: GUROV_STAND[1], gurov_on: null, gurov_turn: 5, gurov_do: 'stand',
      gurov_look: null, gurov_reach: null, gurov_with: null, gurov_mood: null,
      ...extra,
    };
    const [a, d, h] = plateAt(v.plate);
    return { ...v, melon_a: a, melon_d: d, melon_e: h };
  };
  // he at the table on his chair, the slice cut; the candle lower (what the game leaves after “Watermelon”)
  const AT_TABLE = { gurov_a: CHAIR_SEAT[0], gurov_d: CHAIR_SEAT[1], gurov_on: CHAIR_SEAT, gurov_turn: 270, gurov_do: 'seated',
    gurov_look: 'watermelon', cut: 1, slice: 1, candle: 0.4 };
  // he beside her on the bed, both turned a little to the room; the plate with the slice by her
  const ON_BED = { gurov_a: GUROV_BED_SEAT[0], gurov_d: GUROV_BED_SEAT[1], gurov_on: GUROV_BED_SEAT, gurov_turn: 165, gurov_do: 'seated',
    gurov_look: 'anna', anna_turn: 165, anna_do: 'seated', cut: 1, slice: 1, candle: 0.4, plate: 'bed', hands: 0 };
  // `apart` (the game's: she took her hand away): she sits a palm further, does not lean to him
  const apart = () => Number(scene.get('apart')) > 0.5;
  const herSeat = () => apart() ? ANNA_APART : ANNA_SEAT;

  return {
    // night; the candle; she sits on the bed's edge, head bowed; he stands at the table, his back to us
    room: {
      from: () => base({ fade: 1 }),
      run: async s => {
        s.move('fade', 0, { over: 1.5, ease: 'out' });
        await s.wait(3.5);
        s.person('gurov').look('candle');
        await s.wait(4.5);
        s.person('gurov').look('watermelon');
        await s.wait(3.5);
      },
    },
    // faces: the cut to her at the candle — she lifts her head and looks at him; back: he turns to her from the table
    room_hold: {
      after: 'room', from: () => base({}),
      run: async s => {
        const anna = s.person('anna'), gurov = s.person('gurov');
        const face = s.shot({ ...CAM.FACE });
        await s.until(() => face.ready);
        const back = s.shot({ ...CAM.ROOM });
        face.cut();
        anna.do('seated');
        anna.mood('sad');
        anna.turn(115);
        anna.look('gurov');
        await s.wait(1.6);
        await s.until(() => back.ready);
        back.cut();
        gurov.look('anna');
        await gurov.turn(280);
        await s.wait(0.4);
      },
    },
    // he sits down to the table; the cut into the close-up of the watermelon (an insert opens at once)
    melon: {
      after: 'room_hold', from: () => base({ gurov_turn: 280, gurov_look: 'anna', anna_do: 'seated', anna_turn: 115, anna_look: 'gurov' }),
      run: async s => {
        const gurov = s.person('gurov');
        gurov.look('watermelon');
        await gurov.go('sit_down', { to: [CHAIR_SEAT[0], CHAIR_SEAT[1]], turn: 270 });
        gurov.on(CHAIR_SEAT);
        gurov.do('seated');
        await s.wait(0.3);
        s.set('melon', 1);
      },
    },
    // back from the close-up: he at the table, the red slice before him; she on the bed; the candle lower — the choice
    melon_hold: {
      after: 'melon', from: () => base({ ...AT_TABLE, anna_do: 'seated', anna_turn: 115 }),
      run: async s => {
        s.set('melon', 0);
        if (Number(s.state.candle) < 0.4) s.move('candle', 0.4, { over: 2 });
        s.person('gurov').look('watermelon');
        await s.wait(3);
      },
    },
    // he eats at the table, not looking at her; the camera draws back: the two at the window's edges, the candle between
    melon_eat: {
      after: 'melon_hold', from: () => base({ ...AT_TABLE }),
      run: async s => {
        const gurov = s.person('gurov'), anna = s.person('anna');
        gurov.look('watermelon');
        gurov.turn(285);
        gurov.do('eat_slow', { loop: true });
        anna.do('seated_bowed', { loop: true });
        anna.look(FLOOR_BEFORE_HER);
        s.move('camera_x', CAM.EAT.camera_x, { over: 6, ease: 'inOut' });
        await s.move('camera_z', CAM.EAT.camera_z, { over: 6, ease: 'inOut' });
        await s.wait(6);
      },
    },
    // he gets up with the plate, takes it to the bed, sets it by her and sits beside her; the close-up of the hands
    beside: {
      after: 'melon_hold', from: () => base({ ...AT_TABLE, anna_do: 'seated', anna_turn: 115 }),
      run: async s => {
        const gurov = s.person('gurov');
        gurov.look('anna');
        gurov.on(null);
        await gurov.go('rise', { from: [CHAIR_SEAT[0], CHAIR_SEAT[1]] });
        s.set('plate', 'held');
        gurov.with(['plate']);
        await gurov.walk([GUROV_BED_STAND]);
        const at = [PLATE_BED[0], PLATE_BED[1], PLATE_BED[2] + 0.05];
        gurov.reach({ r: at, l: at });
        await s.wait(0.8);
        s.set('plate', 'bed');
        gurov.with(null);
        gurov.reach(null);
        await gurov.go('sit_down', { to: [GUROV_BED_SEAT[0], GUROV_BED_SEAT[1]], turn: 165 });
        gurov.on(GUROV_BED_SEAT);
        gurov.do('seated');
        await s.wait(0.3);
        s.set('hands', 1);
      },
    },
    // back from the close-up, nearer: side by side, faces three-quarter. Together (apart 0): his hand behind her back,
    // she leans her head to his shoulder; apart (1): she sits a palm further, hands on her knees, looks at him
    beside_hold: {
      after: 'beside', from: () => base({ ...ON_BED, ...CAM.BED, anna_a: herSeat()[0], anna_on: herSeat() }),
      run: async s => {
        const anna = s.person('anna'), gurov = s.person('gurov'), seat = herSeat();
        // her turn and seat are set under the insert, then the cut back said ahead
        const next = s.shot({ ...CAM.BED, hands: 0, anna_turn: 165, anna_do: 'seated', anna_a: seat[0], anna_on: seat, anna_look: 'gurov' });
        await s.until(() => next.ready);
        next.cut();
        gurov.look('anna');
        anna.mood('sad');
        if (apart()) {
          gurov.reach(null);
          anna.look('gurov');
        } else {
          gurov.reach({ l: 'anna#back' });
          anna.look('gurov#shoulder_l');
        }
        await s.wait(6);
      },
    },
    // faces: he turns on his chair to her; the cut to her, medium, at the candle: she lifts her head, her hands to her
    // face, lets them down — she speaks
    confession_table: {
      after: 'melon_eat', from: () => base({ ...AT_TABLE, ...CAM.EAT, gurov_turn: 285, gurov_do: 'eat_slow' }),
      run: async s => {
        const gurov = s.person('gurov'), anna = s.person('anna');
        const face = s.shot({ ...CAM.FACE });
        gurov.do('seated');
        gurov.turn(250);
        gurov.look('anna');
        await s.wait(2);
        await s.until(() => face.ready);
        face.cut();
        anna.do('seated');
        anna.turn(115);
        anna.look('gurov');
        anna.mood('sad');
        await s.wait(1.5);
        s.tell('confession_table:speaks');
        anna.reach({ r: 'anna#head', l: 'anna#head' });
        await s.wait(3.2);
        anna.reach(null);
        anna.look(FLOOR_BEFORE_HER);
        await s.wait(11);
      },
    },
    // faces: medium from the balcony side — she straightens, her hands to her face, her face to the candle; his hand
    // on her back, his face in profile
    confession_bed: {
      after: 'beside_hold', from: () => base({ ...ON_BED, ...CAM.BED, gurov_reach: { l: 'anna#back' }, anna_look: 'gurov#shoulder_l' }),
      run: async s => {
        const anna = s.person('anna'), gurov = s.person('gurov');
        const next = s.shot({ ...CAM.BALCONY, anna_a: ANNA_SEAT[0], anna_on: ANNA_SEAT, anna_turn: 120, gurov_turn: 140 });
        await s.until(() => next.ready);
        next.cut();
        gurov.reach({ l: 'anna#back' });
        gurov.look('candle');
        anna.do('seated');
        anna.mood('sad');
        anna.look('candle');
        await anna.turn(105);
        s.tell('confession_bed:speaks');
        anna.reach({ r: 'anna#head', l: 'anna#head' });
        await s.wait(4);
        anna.reach(null);
        anna.look(FLOOR_BEFORE_HER);
        await s.wait(11);
      },
    },
  };
}

return {
  clamp01, WALL_D, HALF, CEIL, FRONT_D, DOOR, BED, TABLE, CAM, cam, film,
  ANNA_SEAT, ANNA_APART, GUROV_BED_SEAT, GUROV_BED_STAND, CHAIR_SEAT, GUROV_STAND, PLATE_TABLE, PLATE_BED, FLOOR_BEFORE_HER,
};
